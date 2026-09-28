/* HYPER-ERGONOMICS · content/mind-transport.js — the mind at work (perception and attention, mental workload, human
 * error, situation awareness, decisions under stress, usability, information design) and vehicles and transport (seats,
 * the driver's workspace, cockpits, truck and bus cabs, forklifts and mobile machines, public transport).
 * Simulations in sims/mind-transport.js (prefix mt-). */
Hyper.add(

{
  id: 'perception-attention', parent: 'mind-work', title: 'Perception and attention', level: 2,
  short: 'The senses take in far more than the mind can use; attention decides what gets through. Sharp vision covers only about 2°, attention to one stream blinds us to others, rare signals are missed, and a watch for them decays within 15–30 minutes. Design puts important things where the eyes and ears are, makes them stand out, and never asks people to watch for rare events for long.',
  keywords: ['perception', 'attention', 'selective attention', 'divided attention', 'vigilance', 'vigilance decrement', 'Mackworth clock', 'signal detection theory', 'd prime', 'criterion', 'hit rate', 'false alarm', 'prevalence effect', 'inattentional blindness', 'change blindness', 'reaction time', 'perception-reaction time', 'fovea', 'visual field', 'working memory', 'ISO 7731'],
  prereq: ['ergonomics-defined', 'medicine:vision', 'medicine:hearing-balance'],
  related: ['displays-design', 'alarms-warnings', 'mental-workload', 'situation-awareness', 'decisions-stress', 'hick-law', 'information-design', 'visual-ergonomics', 'control-rooms', 'fatigue-rest-breaks', 'math:normal-distribution'],
  body: `
Everything an operator does starts with noticing something: a pointer out of its zone, a child stepping off the kerb, a tone among the machine noise. The senses gather far more than the mind can use, and **attention** decides what gets through. Design puts important things where the eyes and ears already are, makes them stand out, and never relies on people watching for rare events for long.

### What the senses can and cannot do
- **Vision** is sharp only in the fovea, about 2° across — a thumbnail at arm's length. Outside it the eye sees motion and brightness but little detail, so the eyes jump three or four times a second; what they do not land on is often not seen.
- The **visual field** spans about 180–200° horizontally, but reading and detail need the central 10–20° — why primary displays sit within about 15° of the line of sight ([[displays-design]]).
- **Hearing** covers every direction and cannot be closed: the channel for warnings, if not masked by noise ([[alarms-warnings]]).
- **Working memory** holds only about four meaningful items at once (Cowan, 2001): making people carry a code from one screen to another is a design fault.

### Attention is the bottleneck
Attention is *selective* (we pick one stream and filter the rest), *divided* (we share it, poorly, between tasks) and *sustained* (we hold it on one task, and it fades). Three findings every designer should know:
1. **Inattentional blindness** — people looking straight at an unexpected object often do not see it while attending to something else: many "looked but failed to see" crashes at junctions are drivers who looked for cars and missed the motorcycle.
2. **Change blindness** — a change during a glance away or a screen refresh is easily missed; values that change on crowded displays need highlighting.
3. **Expectation drives perception** — we see what we expect; an unusual signal in a familiar place is read as the usual one.

### Signal detection: hits, misses and false alarms
Whenever a person must decide whether a signal is there — a crack on an X-ray, a weapon in a bag, a fault on a production line — **signal detection theory** separates two things. The *sensitivity* $d'$ is how far apart the evidence for "signal" and for "noise" lie, in [[?standard-deviation|standard deviations]]; the *criterion* $c$ is how much evidence the observer demands before saying "yes". Both kinds of evidence spread as a [[?gaussian|bell curve]], so the [[?probability|probabilities]] of a hit and of a false alarm are

$$H = \\Phi\\!\\left(\\tfrac{d'}{2} - c\\right), \\qquad F = \\Phi\\!\\left(-\\tfrac{d'}{2} - c\\right)$$

Good design — contrast, magnification, better sensors, training — raises $d'$. Payoffs and expectations move $c$: when signals are **rare**, observers become cautious and miss more. A defect that turns up once in a thousand parts is missed far more often than one that turns up once in ten, even by experts.

### Vigilance: the watch that decays
During the Second World War Norman Mackworth tested radar operators with a clock whose hand now and then jumped twice as far; detections fell within the first half-hour. This **vigilance decrement** has been found ever since: with rare, faint signals most of the decline comes within 15–30 minutes. It is not laziness — sustained attention is hard mental work. Remedies: a break or change of task every 20–30 minutes of monitoring (European aviation-security rules limit a screener's continuous review of X-ray images to 20 minutes); stronger signals; test signals that keep observers engaged; automation that pre-screens but keeps people in the loop.

### Reaction time
One expected signal and one response takes about 0.15–0.25 s; more choices take longer ([[hick-law]]). Real hazards take much longer: drivers brake after about 0.7–0.75 s for an expected signal, about 1.25 s for an unexpected but common one (brake lights ahead) and about 1.5 s or more for a true surprise (Green, 2000). Road design allows 2.5 s. While the driver is still perceiving, the vehicle travels on: at 50 km/h, 1.5 s is 21 m.

| Setting | Perceptual demand | What design does |
|---|---|---|
| Control rooms, security screening | long watches for rare events | rotation every 20–30 min, pre-screening, alarm filtering |
| Workshop inspection | rare defects among good parts | good light, magnification, known faulty samples inserted |
| Vehicles | a fast scene, glances away | warnings that sound, head-up information, glance limits ([[driver-workspace]]) |
| Military | night watches, noise, fatigue | rotation, displays compatible with night vision, sound plus light |
| Health care | bedside alarms, monitoring | fewer, meaningful alarms against alarm fatigue |

In the simulation, move the criterion across the two curves and watch hits and false alarms trade against each other; make signals rare and press *Set the ideal criterion*; then lengthen the watch and add breaks to see the decrement and its cure.

> [!warn] Never make safety depend on someone noticing a rare event after a long, quiet watch. Rotate, automate the screening, or make the event announce itself.

> [!key] People see what they attend to and expect. Put critical signals where the eyes are, make them strong and redundant (sight and sound), and design monitoring jobs with breaks every 20–30 minutes.
`,
  ideas: [
    'Sharp vision covers only about 2°; the eyes sample a scene in jumps, and what attention does not select is often not seen.',
    'Signal detection theory separates sensitivity d′ (how distinct the signal is) from the criterion c (how cautious the observer is).',
    'Rare signals make observers cautious: they miss more, even when well trained.',
    'In monitoring tasks detection declines within the first 15–30 minutes: rotate or break every 20–30 minutes.',
    'A driver needs about 0.75 s to react to an expected signal and 1.5 s or more to a surprise; the vehicle keeps moving meanwhile.'
  ],
  pitfalls: [
    'If it was in plain view, the operator should have seen it — Attention, not the eyes, decides what is seen; people looking at an object routinely miss it when attending to something else.',
    'A trained, motivated inspector keeps finding defects all shift — The vigilance decrement affects everyone; motivation delays it only a little. Breaks and job design are the remedy.',
    'Missed signals mean poor eyesight — Most misses are a cautious criterion (rare signals) or a decayed watch, not low sensitivity.'
  ],
  formulas: [
    {
      name: 'Hit rate in signal detection',
      expr: 'H = ncdf(dp/2 - c)', tex: "H = \\Phi\\!\\left(\\dfrac{d'}{2} - c\\right)",
      vars: {
        H: { name: 'hit rate (share of signals detected)', q: 'ratio', unit: '%' },
        dp: { name: 'sensitivity d′ (separation of signal from noise, in standard deviations)', value: 2, min: 0, max: 6, tex: "d'" },
        c: { name: 'criterion (0 neutral, positive cautious, negative liberal)', value: 0.5, min: -3, max: 3, signed: true }
      },
      note: 'Equal-variance signal detection with the criterion measured from the midpoint between the two distributions. Φ is the standard normal distribution function.',
      stories: { H: 'An inspector has a sensitivity of {dp} and a criterion of {c}. What share of the faulty parts does she find?', c: 'With a sensitivity of {dp}, an observer finds {H} of the signals. How cautious is the criterion?' }
    },
    {
      name: 'False-alarm rate in signal detection',
      expr: 'F = ncdf(-dp/2 - c)', tex: "F = \\Phi\\!\\left(-\\dfrac{d'}{2} - c\\right)",
      vars: {
        F: { name: 'false-alarm rate (share of non-signals called signals)', q: 'ratio', unit: '%' },
        dp: { name: 'sensitivity d′', value: 2, min: 0, max: 6, tex: "d'" },
        c: { name: 'criterion', value: 0.5, min: -3, max: 3, signed: true }
      },
      note: 'Hits and false alarms move together as the criterion moves; only a larger d′ gives more hits with fewer false alarms.',
      stories: { F: 'A screener with a sensitivity of {dp} works at a criterion of {c}. What share of harmless bags are flagged?' }
    },
    {
      name: 'Distance travelled while perceiving and reacting',
      expr: 'd = v*t', tex: 'd = v\\,t',
      vars: {
        d: { name: 'distance travelled before the response begins', q: 'length', unit: 'm' },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 50 },
        t: { name: 'perception–reaction time', q: 'time', unit: 's', value: 1.5 }
      },
      note: 'About 0.75 s for an expected signal, 1.25 s for an unexpected but common one, 1.5 s or more for a surprise; road design uses 2.5 s.',
      stories: { d: 'A driver at {v} needs {t} to notice a hazard and start braking. How far does the car travel meanwhile?', t: 'At {v} a car covers {d} before the driver brakes. What was the perception–reaction time?' }
    }
  ],
  examples: [
    {
      title: 'Alert or surprised',
      q: 'A driver at 50 km/h reacts in 0.75 s to a light she is waiting for and in 1.5 s to a child running out. How far does the car travel before braking starts in each case?',
      steps: [
        '50 km/h is $50/3.6 = 13.9$ m/s.',
        'Expected: $d = 13.9 \\times 0.75 = 10.4$ m.',
        'Surprise: $d = 13.9 \\times 1.5 = 20.8$ m — twice as far, before the brakes do anything.'
      ],
      a: 'About 10 m when alert, 21 m when surprised.'
    },
    {
      title: 'Why rare defects are missed',
      q: 'An inspector has $d\' = 2$. When one part in two is faulty she works near a neutral criterion, $c = 0$. When faults become rare she drifts to $c = 1$. Find her hit and false-alarm rates in both cases.',
      steps: [
        '$c = 0$: $H = \\Phi(1) = 84\\,\\%$, $F = \\Phi(-1) = 16\\,\\%$.',
        '$c = 1$: $H = \\Phi(0) = 50\\,\\%$, $F = \\Phi(-2) = 2.3\\,\\%$.',
        'Her eyes are as good as before; she simply says "fault" less often, so half the faults now pass. Inserting known faulty parts, feedback and pre-screening push the criterion back.'
      ],
      a: 'Neutral: 84 % hits, 16 % false alarms. Cautious: 50 % hits, 2.3 % false alarms.'
    }
  ],
  quiz: [
    { q: 'A radar operator detects fewer targets after 40 minutes on watch. What is the most likely cause?', choices: ['The vigilance decrement: sustained attention declines over the watch', 'Poor eyesight', 'Too many targets', 'The display is too bright'], a: 0, why: 'Detection of rare signals declines within the first 15–30 minutes of a watch in nearly everyone.' },
    { q: 'An inspector becomes more cautious (raises the criterion). What happens?', choices: ['Fewer false alarms and fewer hits', 'More hits and fewer false alarms', 'More of both', 'Nothing changes'], a: 0, why: 'Moving the criterion trades hits against false alarms; only a larger d′ improves both.' },
    { q: 'True or false: when signals become very rare, trained observers still detect them as often as common ones.', a: false, why: 'Rare signals push observers towards a cautious criterion; misses rise sharply (the prevalence effect).' },
    { q: 'At 100 km/h, how far does a car travel during a 1.5 s perception–reaction time?', answer: 41.7, unit: 'm', why: '100/3.6 = 27.8 m/s; 27.8 × 1.5 = 41.7 m.' },
    { q: 'About how many meaningful items can working memory hold at once?', choices: ['About four', 'About fifteen', 'About one', 'Unlimited, with effort'], a: 0, why: 'Current research puts it near four chunks; design should not make people remember codes or values between screens.' }
  ],
  problems: [
    { q: 'An observer has a sensitivity $d\' = 1.5$ and a neutral criterion $c = 0$. What is her hit rate?', answer: 77.3, unit: '%', tol: 0.01, steps: ['$H = \\Phi(d\'/2 - c) = \\Phi(0.75)$.', '$\\Phi(0.75) = 0.773$, so 77.3 %.'] },
    { q: 'Road design assumes a perception–reaction time of 2.5 s. How far does a vehicle travel in that time at 90 km/h?', answer: 62.5, unit: 'm', tol: 0.01, steps: ['90 km/h = 25 m/s.', '$d = 25 \\times 2.5 = 62.5$ m.'] }
  ],
  ranges: [
    { dim: 'Continuous monitoring before a break or change of task', range: [20, 30], unit: 'min', who: 'Operators watching for rare signals: CCTV, radar, X-ray screening, inspection lines', why: 'Detection falls within the first 15–30 min of a watch; a break or rotation restores it.', limits: 'Faint, rare signals decay faster; lively tasks with frequent signals slower. Rotation needs staff and trained reliefs.', setting: ['workshop', 'military', 'civil', 'office'], src: 'Mackworth (1948); Warm, Parasuraman and Matthews (2008)' },
    { dim: 'Auditory warning level above the ambient noise', range: [15, null], unit: 'dB (A-weighted)', who: 'Everyone in the danger zone, including people wearing hearing protectors or with some hearing loss', why: 'The signal is heard reliably above machine noise.', limits: 'Far louder startles and gets muted; hearing protectors and noise spectra change what is audible — test on site.', setting: ['workshop', 'field', 'vehicle', 'military'], src: 'ISO 7731' },
    { dim: 'Frequency of auditory warning signals', range: [500, 3000], unit: 'Hz', who: 'Listeners of all ages, including older people with high-frequency hearing loss', why: 'The ear is most sensitive here; lower tones (below about 1000 Hz) carry farther and bend round obstacles.', limits: 'Must differ from the machine noise spectrum; very high tones are lost with age.', setting: ['all'], src: 'Sanders and McCormick, Human Factors in Engineering and Design' },
    { dim: 'Position of critical visual warnings', range: [0, 15], unit: '° from the normal line of sight', who: 'An operator looking at the primary task', why: 'Seen without a head or eye search, even under workload.', limits: 'Peripheral warnings need flashing or sound to capture attention; glare and clutter hide them.', setting: ['vehicle', 'military', 'workshop'], src: 'MIL-STD-1472' },
    { dim: 'Items a user must hold in mind at once', range: [null, 4], unit: 'items', who: 'All users, fewer under stress, fatigue or with age', why: 'Working memory holds only about four chunks.', limits: 'Experts chunk more; interruptions wipe memory — keep information on the screen or on paper.', setting: ['all'], src: 'Cowan (2001); Miller (1956)' },
    { dim: 'Perception–reaction time to allow for an unexpected hazard', range: [1.5, 2.5], unit: 's', who: 'Drivers and operators surprised by an event', why: 'Stopping and sight distances then cover most people in most conditions.', limits: 'Fatigue, distraction, alcohol and age lengthen it; alert, expecting drivers are faster.', setting: ['vehicle', 'civil'], src: 'AASHTO Green Book (2.5 s); Green (2000)' }
  ],
  applications: [
    'Security screening and quality inspection organised in 20–30 minute spells, with known test items inserted.',
    'Warnings made redundant — sound plus light — and placed within 15° of the line of sight.',
    'Road and junction design with sight distances built on a 2.5 s perception–reaction time.',
    'Control-room displays that highlight what has changed instead of relying on operators to notice.'
  ],
  history: 'Norman Mackworth\'s clock test (1948) grew out of the question why RAF radar operators missed submarines late in their watches. Signal detection theory came from radar engineering and was brought into psychology by Tanner, Swets and Green in the 1950s; Green and Swets\'s book (1966) made it the standard way to separate what people can see from what they choose to report.',
  sources: [
    'C. D. Wickens, J. G. Hollands, S. Banbury and R. Parasuraman, *Engineering Psychology and Human Performance* — attention, signal detection, vigilance.',
    'N. H. Mackworth, "The breakdown of vigilance during prolonged visual search", *Quarterly Journal of Experimental Psychology*, 1948.',
    'D. M. Green and J. A. Swets, *Signal Detection Theory and Psychophysics*, 1966.',
    'J. S. Warm, R. Parasuraman and G. Matthews, "Vigilance requires hard mental work and is stressful", *Human Factors*, 2008.',
    'M. Green, "How long does it take to stop? Methodological analysis of driver perception-brake times", *Transportation Human Factors*, 2000.',
    'ISO 7731, *Ergonomics — Danger signals for public and work areas — Auditory danger signals*.',
    'N. Cowan, "The magical number 4 in short-term memory", *Behavioral and Brain Sciences*, 2001.',
    'MIL-STD-1472, *Human Engineering* (US Department of Defense) — visual and auditory displays.'
  ],
  sim: 'mt-signal-detection'
},

{
  id: 'mental-workload', parent: 'mind-work', title: 'Mental workload', level: 2,
  short: 'The share of a person\'s limited capacity to perceive, think and act that a task takes. Overload brings shed tasks, tunnel vision and errors; underload brings drift and missed events. It is measured by performance, by a secondary task, by ratings such as the NASA Task Load Index and by physiology — and designed by spreading demands across senses and time and keeping reserve for the unexpected.',
  keywords: ['mental workload', 'ISO 10075', 'mental load', 'mental strain', 'overload', 'underload', 'multiple resource theory', 'NASA-TLX', 'task load index', 'detection response task', 'ISO 17488', 'Bedford scale', 'timeline analysis', 'time pressure', 'VACP', 'alarm flood', 'EEMUA 191', 'secondary task', 'inverted U', 'Yerkes-Dodson'],
  prereq: ['perception-attention', 'ergonomics-defined'],
  related: ['human-error', 'situation-awareness', 'decisions-stress', 'control-rooms', 'alarms-warnings', 'fatigue-rest-breaks', 'psychosocial-factors', 'cockpit-ergonomics', 'driver-workspace', 'task-analysis', 'medicine:stress-coping'],
  body: `
Mental workload is the share of a person's limited capacity to perceive, think and act that a task takes up. It cannot be seen or weighed, but its effects can: as demands pile up people slow down, drop tasks, narrow their attention and make errors; when demands fall too low they drift and miss what matters. The aim is not the lowest possible workload but a moderate, steady one with **reserve for the unexpected**.

### Load and strain
ISO 10075 separates the **mental load** — everything the task and its surroundings demand: information, time pressure, responsibility, noise, interruptions — from the **mental strain** it causes in a particular person, which depends on skill, fatigue, health and motivation. The same approach to land is routine for a captain and overwhelming for a trainee. Short-term effects of strain — fatigue, monotony, reduced vigilance, satiation — are what design keeps within bounds.

### Too much and too little
Performance is best at moderate arousal and falls off at both ends — the *inverted U* usually traced to Yerkes and Dodson (1908), a useful but rough picture. **Overload** shows as shedding secondary tasks, fixing on one cue, rushing and skipping checks. **Underload** shows as boredom, slow responses and loss of the picture. The operator of a highly automated plant who must suddenly take over meets both ends within seconds.

### Several pools, not one
People can listen and look, or look and steer, far better than they can read two things at once. Wickens's **multiple-resource theory** describes separate pools of capacity by stage (perceiving and thinking versus responding), by modality (seeing versus hearing), by code (spatial versus verbal) and by visual channel (focal versus ambient). Tasks interfere most when they compete for the same pool:

| Pair of tasks | Shared resources | Interference |
|---|---|---|
| Driving and reading a text message | visual, focal | severe |
| Driving and typing a destination | visual and manual | severe |
| Driving and a hands-free phone call | thinking (the conversation) | moderate: eyes on the road, mind elsewhere |
| Watching a display and hearing a spoken alarm | different senses | small |
| Two spoken messages at once | hearing, verbal | severe |

So warnings go to the ears when the eyes are busy — and a hands-free call is not free, because the conversation still takes thinking capacity.

### Measuring workload
| Family | Examples | Strengths | Limits |
|---|---|---|---|
| Primary-task performance | errors, speed, lane keeping | direct | drops only once capacity is exceeded |
| Secondary task | the detection-response task of ISO 17488: press a button whenever a light or buzzer comes on | shows spare capacity | intrudes on the main task |
| Subjective ratings | NASA-TLX, the Bedford scale, instantaneous self-assessment | cheap, sensitive | after the event, coloured by how it went |
| Physiological | heart rate and its variability, pupil size, blinks, brain activity | continuous, unobtrusive | also driven by physical work, heat and emotion |

The **NASA Task Load Index** (Hart and Staveland, 1988) has people rate six aspects of a task from 0 to 100 — mental demand, physical demand, time pressure, their own performance, effort and frustration — combined with weights from fifteen pairwise comparisons or, more often now, as a plain [[?mean]] (the "raw TLX"). It compares designs and conditions; there is no universal "too hard" threshold.

### Time required over time available
For time-critical work the simplest measure is the ratio of the time the tasks need to the time available. Above 100 % something must be dropped; timeline analysts treat anything above roughly 70–80 % as a warning that an interruption or a slow response will tip the operator into overload.

### Settings
- **Control rooms**: alarm floods after an upset swamp operators. Process-industry guidance (EEMUA 191, ANSI/ISA-18.2) aims at about one alarm per ten minutes in normal operation and no more than about ten in the first ten minutes after an upset ([[control-rooms]], [[alarms-warnings]]).
- **Cockpits**: take-off and landing pack the workload into minutes; crews share tasks and keep talk to the essentials ([[cockpit-ergonomics]]).
- **Vehicles**: screens add visual and manual demand on top of driving ([[driver-workspace]]).
- **Military**: many tasks at once, long hours, threat and protective equipment add strain ([[sustained-operations]]).
- **Health care and offices**: interruptions break tasks in the middle, where errors hide.

In the simulation, pick a scenario and look at the four lanes — seeing, hearing, thinking and responding. Add a secondary task and watch which lane overflows; compress the time or switch the automation off and see where the peaks appear.

> [!tip] Plan workload as a timeline: list the tasks, their durations and the senses they use, and look for moments where one channel is asked for more than it has — then move, automate or share those tasks.

> [!key] Keep workload moderate and steady, spread across senses and time, with reserve for surprises. Measure it several ways and compare designs, not people.
`,
  ideas: [
    'Mental load is what the task demands; mental strain is its effect on a particular person (ISO 10075).',
    'Both overload and underload degrade performance; the aim is a moderate, steady load with reserve.',
    'Tasks that use the same resource (two visual tasks, two verbal ones) interfere far more than tasks using different senses.',
    'Workload is measured by performance, a secondary task, ratings such as NASA-TLX, and physiology — best in combination.',
    'In timeline analysis, demands above about 70–80 % of the time available are a warning sign.'
  ],
  pitfalls: [
    'The lowest workload is the safest — Underload brings drift, slow responses and loss of the picture; a monitoring-only job is not restful.',
    'A hands-free phone makes calling while driving safe — It removes the manual and some visual demand, but the conversation still takes thinking capacity.',
    'A NASA-TLX score above 50 means the task is too demanding — The index compares tasks and designs; it has no universal pass mark.'
  ],
  formulas: [
    {
      name: 'Time pressure: time required over time available',
      expr: 'U = Tr/Ta', tex: 'U = \\dfrac{T_r}{T_a}',
      vars: {
        U: { name: 'time pressure (share of the available time the tasks need)', q: 'ratio', unit: '%' },
        Tr: { name: 'time the tasks require', q: 'time', unit: 's', value: 48, tex: 'T_r' },
        Ta: { name: 'time available', q: 'time', unit: 's', value: 60, tex: 'T_a' }
      },
      note: 'Above 100 % tasks must be dropped; above about 70–80 % there is little reserve for interruptions and slow responses.',
      stories: { U: 'In the last {Ta} before landing the crew\'s tasks take {Tr}. What is the time pressure?', Ta: 'Tasks need {Tr}. How much time must be available to keep the time pressure at {U}?' }
    },
    {
      name: 'Raw NASA Task Load Index',
      expr: 'R = (MD + PD + TD + OP + EF + FR)/6', tex: '\\mathrm{TLX} = \\dfrac{\\mathrm{MD} + \\mathrm{PD} + \\mathrm{TD} + \\mathrm{OP} + \\mathrm{EF} + \\mathrm{FR}}{6}',
      vars: {
        R: { name: 'raw TLX score (0–100)', tex: '\\mathrm{TLX}' },
        MD: { name: 'mental demand rating (0–100)', value: 70, min: 0, max: 100, tex: '\\mathrm{MD}' },
        PD: { name: 'physical demand rating (0–100)', value: 20, min: 0, max: 100, tex: '\\mathrm{PD}' },
        TD: { name: 'temporal demand (time pressure) rating (0–100)', value: 65, min: 0, max: 100, tex: '\\mathrm{TD}' },
        OP: { name: 'own performance rating (0 good – 100 poor)', value: 40, min: 0, max: 100, tex: '\\mathrm{OP}' },
        EF: { name: 'effort rating (0–100)', value: 60, min: 0, max: 100, tex: '\\mathrm{EF}' },
        FR: { name: 'frustration rating (0–100)', value: 55, min: 0, max: 100, tex: '\\mathrm{FR}' }
      },
      note: 'The original index weights each scale by how often it was chosen in fifteen pairwise comparisons (weights sum to 15). The raw form is widely used and ranks tasks much the same.',
      stories: { R: 'An operator rates a task: mental {MD}, physical {PD}, temporal {TD}, performance {OP}, effort {EF}, frustration {FR}. What is the raw TLX score?' }
    }
  ],
  examples: [
    {
      title: 'An alarm flood in a control room',
      q: 'In the ten minutes after a plant upset an operator receives 12 alarms, each needing about 30 s to read, diagnose and act on, plus 2 minutes of phone calls from the field and 1 minute of logging. What is the time pressure? What if alarm rationalisation cuts the flood to 5 alarms?',
      steps: [
        '12 alarms × 30 s = 6 min; plus 2 + 1 min = 9 min required in 10 min available: $U = 9/10 = 90\\,\\%$ — no reserve.',
        '5 alarms × 30 s = 2.5 min; total 5.5 min: $U = 55\\,\\%$ — room for a surprise.',
        'That is the aim of alarm guidance such as EEMUA 191: no more than about ten alarms in the ten minutes after an upset, each one meaningful.'
      ],
      a: '90 % with the flood, 55 % after rationalisation.'
    },
    {
      title: 'Comparing two designs with the raw TLX',
      q: 'Operators rate design A at mental 70, physical 20, temporal 65, performance 40, effort 60, frustration 55, and design B at 50, 20, 40, 30, 45, 30. Compare the raw TLX scores.',
      steps: [
        'A: $(70 + 20 + 65 + 40 + 60 + 55)/6 = 310/6 = 51.7$.',
        'B: $(50 + 20 + 40 + 30 + 45 + 30)/6 = 215/6 = 35.8$.',
        'B is clearly less demanding, mostly through lower time pressure and frustration. The scores rank the designs; neither number is "safe" or "unsafe" on its own.'
      ],
      a: 'A 51.7, B 35.8: design B lowers the workload.'
    }
  ],
  quiz: [
    { q: 'Which secondary task interferes most with watching the road?', choices: ['Reading a text message', 'Listening to the radio', 'A short spoken navigation instruction', 'Humming a tune'], a: 0, why: 'Reading competes for the same focal visual resource as driving.' },
    { q: 'True or false: the lower the workload, the safer the operator.', a: false, why: 'Underload brings drift and slow responses; the target is moderate, steady load with reserve.' },
    { q: 'ISO 10075 distinguishes mental load from mental strain. Strain is…', choices: ['the effect of the load on a particular person', 'the demands of the task', 'the physical effort', 'the number of tasks'], a: 0, why: 'Load is what the task demands; strain is what it does to a person, depending on skill, fatigue and health.' },
    { q: 'Tasks need 45 s in a 50 s window. What is the time pressure, and is there reserve?', choices: ['90 %: almost none', '45 %: plenty', '111 %: impossible', '50 %: enough'], a: 0, why: '45/50 = 90 %, above the 70–80 % warning level.' },
    { q: 'What does the NASA Task Load Index ask for?', choices: ['Ratings of six aspects: mental, physical and time demand, performance, effort, frustration', 'Heart rate during the task', 'The number of errors', 'A single yes/no answer'], a: 0, why: 'It is a subjective, multidimensional rating combined into one score.' }
  ],
  problems: [
    { q: 'In the 60 s before touchdown a pilot\'s tasks take 42 s. What is the time pressure?', answer: 70, unit: '%', tol: 0.01, steps: ['$U = 42/60 = 0.70 = 70\\,\\%$ — at the edge of the warning zone.'] },
    { q: 'A driver rates a navigation task: mental 60, physical 10, temporal 50, performance 30, effort 55, frustration 35. What is the raw TLX?', answer: 40, unit: '', tol: 0.01, steps: ['Sum: 60 + 10 + 50 + 30 + 55 + 35 = 240.', 'Raw TLX = 240/6 = 40.'] }
  ],
  ranges: [
    { dim: 'Time pressure: time required ÷ time available', range: [null, 80], unit: '%', who: 'Operators of time-critical tasks: pilots, drivers, control-room and medical staff', why: 'Leaves reserve for interruptions, slow responses and surprises.', limits: 'An average over a period hides short peaks; novices need more reserve than experts.', setting: ['vehicle', 'military', 'office', 'health'], src: 'Timeline analysis practice; Wickens et al., Engineering Psychology and Human Performance' },
    { dim: 'Alarm rate per operator in normal operation', range: [null, 1], unit: 'alarms per 10 min', who: 'Control-room operators of process plants', why: 'Each alarm can be read, understood and acted on.', limits: 'Averages hide floods; only meaningful alarms count — nuisance alarms teach operators to ignore them.', setting: ['workshop', 'office'], src: 'EEMUA 191; ANSI/ISA-18.2' },
    { dim: 'Alarms in the first 10 minutes after a major upset', range: [null, 10], unit: 'alarms', who: 'Control-room operators during an upset', why: 'The operator can still diagnose rather than just acknowledge.', limits: 'Needs alarm rationalisation, suppression by plant state and priorities designed from the start.', setting: ['workshop', 'office'], src: 'EEMUA 191' }
  ],
  applications: [
    'Alarm rationalisation in refineries, power plants and hospitals.',
    'Cockpit task sharing between the pilot flying and the pilot monitoring.',
    'Assessing in-vehicle screens with the detection-response task before release.',
    'Staffing and shift planning in control rooms and emergency call centres.'
  ],
  history: 'Workload research grew with aviation: test pilots\' ratings of handling (Cooper and Harper, 1969) led to scales for mental workload, and NASA Ames developed the Task Load Index in the 1980s (Hart and Staveland, 1988). Wickens proposed multiple-resource theory around 1980 and restated it in 2002. ISO 10075 set the vocabulary of mental load and strain.',
  sources: [
    'ISO 10075-1, *Ergonomic principles related to mental workload — Part 1: General issues and concepts, terms and definitions*; ISO 10075-2 (design principles); ISO 10075-3 (measurement).',
    'S. G. Hart and L. E. Staveland, "Development of NASA-TLX (Task Load Index): results of empirical and theoretical research", in P. A. Hancock and N. Meshkati (eds.), *Human Mental Workload*, 1988.',
    'C. D. Wickens, "Multiple resources and performance prediction", *Theoretical Issues in Ergonomics Science*, 2002.',
    'ISO 17488, *Road vehicles — Transport information and control systems — Detection-response task (DRT) for assessing attentional effects of cognitive load in driving*.',
    'EEMUA Publication 191, *Alarm systems — a guide to design, management and procurement*; ANSI/ISA-18.2, *Management of alarm systems for the process industries*.',
    'T. H. McCracken and T. B. Aldrich, *Analyses of selected LHX mission functions: implications for operator workload and system automation goals*, US Army, 1984 — the VACP workload scales.'
  ],
  sim: 'mt-workload'
},

{
  id: 'human-error', parent: 'mind-work', title: 'Human error', level: 2,
  short: 'Everyone errs; design decides which errors are possible, how often they happen, whether they are noticed and whether they can be undone. Slips, lapses, mistakes and violations have different causes and different cures; accidents happen when holes in several layers of defence line up. Error-tolerant systems remove the opportunity, force the safe sequence, show the state, allow recovery and check independently.',
  keywords: ['human error', 'slip', 'lapse', 'mistake', 'violation', 'skill rule knowledge', 'GEMS', 'Swiss cheese model', 'latent conditions', 'active failures', 'error-tolerant design', 'forcing function', 'interlock', 'poka-yoke', 'undo', 'mode error', 'human reliability', 'HEART', 'THERP', 'independent check', 'just culture'],
  prereq: ['perception-attention', 'mental-workload', 'ergonomic-principles'],
  related: ['situation-awareness', 'decisions-stress', 'stereotypes-compatibility', 'controls-design', 'alarms-warnings', 'guards-and-people', 'usability', 'ergonomic-risk-assessment', 'task-analysis', 'hmi-screens'],
  body: `
"Human error" appears in accident reports as a cause, but to an ergonomist it is a **symptom**: the visible end of a mismatch between what a system demands and what people can reliably do. Everyone errs many times a day; most errors are caught and corrected unnoticed. Design decides which errors are *possible*, how *likely* they are, whether they are *seen* and whether they can be *undone*.

### A classification that points to the cure
James Reason's scheme, built on Jens Rasmussen's levels of skill-, rule- and knowledge-based behaviour, sorts unsafe acts by what went wrong:

| Type | What happens | Example | Design remedy |
|---|---|---|---|
| **Slip** | right intention, wrong action | pressing the button next to the right one | spacing, shape and colour coding; confirm irreversible actions |
| **Lapse** | a step forgotten | a fuel cap left off, a test switch not reset | checklists, reminders, interlocks: no start until the step is done |
| **Rule-based mistake** | a good rule misapplied, or a bad rule | treating a new alarm as the familiar one | distinct indications; training on the exceptions |
| **Knowledge-based mistake** | reasoning in a new situation goes wrong | misdiagnosing an unfamiliar plant upset | displays of system state, decision aids, time |
| **Violation** | a deliberate deviation from a rule | bypassing a guard to clear a jam faster | make the safe way the easy way; fix the rule, not only the person |

Most violations are **routine** or **situational** — the rule is impractical, the tool is missing, the pace too high — and only rarely reckless. A guard that must come off ten times a shift will be defeated ([[guards-and-people]]).

### Where errors come from
The same error-provoking conditions recur everywhere: time pressure, fatigue, interruptions, unfamiliar tasks, poor feedback, look-alike controls, displays that break expectations ([[stereotypes-compatibility]]), **mode errors** (one button doing different things in different modes), procedures that do not match the work, and automation that hides what it does. In Reason's **Swiss-cheese model** an accident needs holes in several layers of defence to line up. Holes at the sharp end are *active failures*; holes left by design and management are *latent conditions*, waiting.

### How often do people err?
Human-reliability methods give rough nominal [[?probability|probabilities]] per task. HEART (Williams, 1986) starts from about **1 in 2** for a totally unfamiliar task done at speed, **1 in 6** for a complex task needing high skill, **1 in 50** for a routine, rapid, practised task and a few in **10 000** for a completely familiar, well-designed task with time to correct errors — then multiplies them for time shortage, fatigue, poor feedback. Over many opportunities small probabilities add up:

$$P = 1 - (1 - p)^n$$

One chance in a thousand per connection and 200 connections a shift give $1 - 0.999^{200} = 18\\,\\%$ that at least one is wrong. An independent check that catches nine errors in ten leaves $p(1 - d) = 0.0001$ per connection — about 2 % a shift. Checks by the same person, or by a colleague who trusts the first, are far less independent than they look.

### Designing error-tolerant systems
1. **Remove the opportunity**: connectors that fit only one way (medical gas and feeding-tube connectors are made incompatible), parts that assemble only correctly (*poka-yoke*).
2. **Force the safe sequence**: interlocks, two-step actions, covers on irreversible commands.
3. **Show state and consequences**: clear modes, feedback for every action, confirmations that say *what* will happen ("Delete 1,240 records?"), not "Are you sure?".
4. **Allow recovery**: undo, time to notice, automatic safe states, a stop within reach.
5. **Detect**: independent checks, plausibility limits, alarms on out-of-range entries.
6. **Learn**: a just culture that reports near misses without blaming honest error, while not tolerating recklessness.

| Setting | Typical error trap | Typical defence |
|---|---|---|
| Health care | look-alike drugs, rates keyed ten times too high | pump dose limits, barcode checks |
| Workshop and industry | wrong part, step skipped, guard bypassed | poka-yoke fixtures, interlocks, lock-out |
| Process control | wrong valve, wrong mode, alarm floods | plant-state displays, alarm priorities |
| Aviation and military | mode confusion, checklist items skipped | mode annunciation, challenge-and-response checklists |
| Home and public | wrong burner, child opening a bottle | natural mappings, child-resistant closures |

Blame and retraining alone rarely work: the next person in the same system makes the same error.

In the simulation, errors fly at layers of defence whose holes drift as latent conditions come and go. Count what gets through, then make the layers depend on each other — the same tired crew doing the work and the check — and watch the protection collapse.

> [!warn] Do not credit an independent check that is not independent: the same person, the same wrong drawing or the same time pressure opens the same hole in every layer.

> [!key] Treat error as a symptom. Classify it (slip, lapse, mistake, violation), then design it out: remove the opportunity, force the sequence, show the state, allow recovery, check independently.
`,
  ideas: [
    'Slips and lapses are failures of execution and memory; mistakes are failures of the plan; violations are deliberate — each has its own remedy.',
    'Accidents need several defences to fail together: active failures at the sharp end and latent conditions left by design and management.',
    'Small error probabilities add up over many opportunities: P = 1 − (1 − p)ⁿ.',
    'Independent checks multiply the protection only if they really are independent.',
    'Error-tolerant design removes opportunities, forces safe sequences, shows state and allows recovery.'
  ],
  pitfalls: [
    'Human error is the cause, so retrain or discipline the person — The same conditions make the next person err the same way; change the conditions.',
    'Two checks at 90 % each leave only 1 % of errors — Only if they are independent; the same drawing, fatigue or trust in a colleague makes them fail together.',
    'Violations are recklessness — Most are routine or situational workarounds for impractical rules and poor tools.'
  ],
  formulas: [
    {
      name: 'Probability of at least one error over many opportunities',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^{n}',
      vars: {
        P: { name: 'probability of at least one error', q: 'ratio', unit: '%' },
        p: { name: 'error probability per opportunity', q: 'ratio', unit: '%', value: 0.1, min: 0, max: 100 },
        n: { name: 'number of opportunities', q: 'count', value: 200, int: true }
      },
      note: 'Assumes each opportunity is independent with the same p. HEART gives nominal p from a few in 10 000 (familiar, well designed) to about 0.5 (totally unfamiliar, at speed).',
      stories: { P: 'A fitter makes {n} connections a shift with an error probability of {p} each. What is the chance that at least one is wrong?', n: 'With {p} per task, after how many tasks does the chance of at least one error reach {P}?' }
    },
    {
      name: 'Error left after an independent check',
      expr: 'Pr = p*(1 - d)', tex: 'P_r = p\\,(1 - d)',
      vars: {
        Pr: { name: 'residual error probability per task', q: 'ratio', unit: '%', tex: 'P_r' },
        p: { name: 'error probability per task', q: 'ratio', unit: '%', value: 0.1, min: 0, max: 100 },
        d: { name: 'share of errors the check catches', q: 'ratio', unit: '%', value: 90, min: 0, max: 100 }
      },
      note: 'Holds only for a truly independent check. A routine check is often assumed to miss about one error in ten.',
      stories: { Pr: 'A task goes wrong {p} of the time and an independent check catches {d} of errors. What residual error probability remains?', d: 'To bring a {p} error rate down to {Pr}, what share of errors must the check catch?' }
    }
  ],
  examples: [
    {
      title: 'Connections on an assembly line',
      q: 'A fitter makes 200 electrical connections a shift, each with an error probability of 1 in 1000. What is the chance of at least one wrong connection per shift? What if an independent test catches 90 % of errors?',
      steps: [
        '$P = 1 - 0.999^{200} = 1 - e^{200 \\ln 0.999} = 1 - e^{-0.200} = 18.1\\,\\%$.',
        'After the test: $p_r = 0.001 \\times 0.1 = 0.0001$ per connection.',
        '$P = 1 - 0.9999^{200} = 1 - e^{-0.020} = 2.0\\,\\%$ per shift — about one faulty unit every fifty shifts.',
        'A connector that cannot be mated wrongly removes the error altogether — design beats checking.'
      ],
      a: 'About 18 % per shift unchecked, 2 % with the test.'
    },
    {
      title: 'Infusion pump entries',
      q: 'A ward keys 20 infusion rates a shift, 250 shifts a year. Suppose 1 entry in 500 is keyed wrongly (an extra zero, a decimal point missed). How many wrong entries a year? How many remain if dose limits in the pump stop 80 % of them?',
      steps: [
        'Entries a year: $20 \\times 250 = 5000$. Expected errors: $5000/500 = 10$.',
        'With dose limits: $10 \\times (1 - 0.8) = 2$ a year reach the patient unchecked.',
        'The rest need other layers: barcode scanning, a second nurse for high-risk drugs, displays that show the rate in context.'
      ],
      a: 'About 10 a year, 2 after the dose limits (illustrative numbers).'
    }
  ],
  quiz: [
    { q: 'A mechanic forgets to refit an oil filler cap after topping up. What kind of error is it?', choices: ['A lapse (a memory failure)', 'A knowledge-based mistake', 'A violation', 'A rule-based mistake'], a: 0, why: 'The intention was right; a step was forgotten. Remedies: a tethered cap, a checklist, an interlock or an indicator.' },
    { q: 'Operators remove a guard several times a shift to clear jams faster. What is the best response?', choices: ['Redesign so jams can be cleared safely and quickly', 'Discipline the operators', 'Add a sign', 'Weld the guard shut'], a: 0, why: 'This is a routine violation driven by the task; fix the task and the guard, not only the people.' },
    { q: 'In the Swiss-cheese model, what are latent conditions?', choices: ['Weaknesses left by design, management and organisation, waiting to line up', 'Errors made at the moment of the accident', 'Hidden injuries', 'Random equipment faults only'], a: 0, why: 'Latent conditions sit in the system for a long time; active failures at the sharp end complete the trajectory.' },
    { q: 'A task has a 1 % error probability and is done 100 times. What is the chance of at least one error?', answer: 63.4, unit: '%', why: '1 − 0.99¹⁰⁰ = 1 − 0.366 = 63.4 %.' },
    { q: 'True or false: a second check of a calculation by a colleague who watched the first person do it is fully independent.', a: false, why: 'Watching the work, trusting the colleague or sharing the same data makes the checks fail together.' }
  ],
  problems: [
    { q: 'An operation has an error probability of 0.2 % and is performed 500 times a week. What is the chance of at least one error in a week?', answer: 63.2, unit: '%', tol: 0.01, steps: ['$P = 1 - 0.998^{500}$.', '$500 \\ln 0.998 = -1.001$, so $P = 1 - e^{-1.001} = 63.2\\,\\%$.'] },
    { q: 'A task goes wrong 0.5 % of the time. An independent check catches 95 % of errors. What is the residual error probability, in per cent?', answer: 0.025, unit: '%', tol: 0.01, steps: ['$P_r = 0.005 \\times 0.05 = 0.00025 = 0.025\\,\\%$.'] }
  ],
  ranges: [
    { dim: 'Nominal error probability for a routine, well-designed task (for estimates)', range: [0.0004, 0.02], unit: 'per task', who: 'Trained people on familiar, practised tasks', why: 'A realistic starting point for reliability estimates and for comparing designs.', limits: 'Multiply up for time pressure, fatigue, poor feedback and unfamiliar equipment; never treat people as more reliable than 1 in 10 000 without strong evidence.', setting: ['all'], src: 'HEART (Williams, 1986); THERP (Swain and Guttmann, 1983)' },
    { dim: 'Nominal error probability for an unfamiliar, complex or rushed task', range: [0.16, 0.55], unit: 'per task', who: 'Anyone facing a novel situation, at speed or without procedures', why: 'Shows why emergencies and one-off tasks need procedures, time and checks.', limits: 'Rough orders of magnitude only; a task analysis and good design change them.', setting: ['all'], src: 'HEART (Williams, 1986)' },
    { dim: 'Time for an operator response to be credited as a protection layer', range: [10, null], unit: 'min', who: 'Control-room operators responding to a process alarm', why: 'Leaves time to notice, diagnose and act, even under stress.', limits: 'Many companies require 20 min or more; the action must be simple, trained and have a clear alarm.', setting: ['workshop', 'office'], src: 'CCPS, Layer of Protection Analysis (2001)' }
  ],
  applications: [
    'Keyed connectors and fittings that cannot be crossed in hospitals, aircraft and plants.',
    'Interlocks and two-step controls for irreversible commands on machines and screens.',
    'Challenge-and-response checklists in aviation and surgery.',
    'Human-reliability estimates in the safety cases of process plants and power stations.'
  ],
  history: 'In 1947 Paul Fitts and Richard Jones analysed hundreds of so-called pilot errors and found most were invited by the design — look-alike flap and landing-gear levers, for example, which Alphonse Chapanis cured with shape-coded knobs. After Three Mile Island (1979) and Chernobyl (1986), Jens Rasmussen and James Reason built the theory of error types and of organisational accidents that is used today.',
  sources: [
    'J. Reason, *Human Error*, 1990; J. Reason, *Managing the Risks of Organizational Accidents*, 1997.',
    'J. Rasmussen, "Skills, rules, and knowledge; signals, signs, and symbols, and other distinctions in human performance models", *IEEE Transactions on Systems, Man, and Cybernetics*, 1983.',
    'D. A. Norman, *The Design of Everyday Things* — slips, mode errors and forcing functions.',
    'J. C. Williams, "HEART — a proposed method for assessing and reducing human error", 1986.',
    'A. D. Swain and H. E. Guttmann, *Handbook of Human Reliability Analysis with Emphasis on Nuclear Power Plant Applications* (THERP), NUREG/CR-1278, 1983.',
    'CCPS, *Layer of Protection Analysis: Simplified Process Risk Assessment*, 2001.',
    'UK Health and Safety Executive, *Reducing error and influencing behaviour* (HSG48).'
  ],
  sim: 'mt-swiss-cheese'
},

{
  id: 'situation-awareness', parent: 'mind-work', title: 'Situation awareness', level: 2,
  short: 'Knowing what is going on well enough to act: perceiving the elements around you, understanding what they mean and projecting what will happen next (Endsley\'s three levels). It is lost through tunnelling, overload, automation that keeps people out of the loop and mode confusion — and designed in with integrated, predictive displays, glance limits and enough time to take over.',
  keywords: ['situation awareness', 'Endsley', 'perception comprehension projection', 'SAGAT', 'SART', 'out of the loop', 'automation', 'ironies of automation', 'mode confusion', 'takeover', 'SAE J3016', 'UN R157', 'time to collision', 'time headway', 'two-second rule', 'team situation awareness', 'predictive display'],
  prereq: ['perception-attention', 'mental-workload'],
  related: ['decisions-stress', 'human-error', 'driver-workspace', 'cockpit-ergonomics', 'control-rooms', 'displays-design', 'alarms-warnings', 'hmi-screens', 'mobile-machines'],
  body: `
Situation awareness (SA) is knowing what is going on well enough to act. In Mica Endsley's definition (1995) it is the **perception** of the elements around you, the **comprehension** of what they mean and the **projection** of what they will do next. A driver who sees brake lights (level 1), understands that the traffic is stopping (level 2) and expects the car behind to be too close to stop (level 3) acts sooner and better than one who merely sees.

### Three levels, three kinds of failure
| Level | The question | How it fails | Design help |
|---|---|---|---|
| 1 Perception | What is there? | not shown, hidden, not looked at | show it where the eyes are ([[perception-attention]]) |
| 2 Comprehension | What does it mean? | seen but misread; raw numbers needing mental arithmetic | show meaning: margins to limits, states, not raw data |
| 3 Projection | What happens next? | surprise | predictive displays: trends, projected paths, time to a limit |

In studies of aviation incident reports, roughly three-quarters of SA errors were at level 1 — the information was there, but not perceived — which is why *where* and *how strongly* information appears matters so much.

### What erodes it
- **Attentional tunnelling**: fixing on one problem while the rest goes unwatched.
- **Workload and interruptions** ([[mental-workload]]), **fatigue** and stress ([[decisions-stress]]).
- **Out of the loop**: people who monitor automation build a poorer picture than people who do the task themselves. Lisanne Bainbridge's "ironies of automation" (1983): the better the automation, the less practised the person who must take over when it fails.
- **Mode confusion**: the system is in a different mode than the operator believes — a classic in autopilots and in machines with several operating modes.
- **Misplaced salience**: bright, moving or loud things that do not matter.

### Projection is about time
Two quantities describe the traffic ahead. The **time headway** $t_h = D/v$ is how many seconds behind the vehicle in front you are; the **time to collision** is

$$\\mathrm{TTC} = \\frac{D}{v_1 - v_2}$$

for a gap $D$ closing at the [[?delta-change|speed difference]]. Drivers are taught to keep at least 2 s of headway on dry roads (the "two-second rule"), twice that in the wet. Forward-collision warnings sound at a TTC of about 2–2.5 s, enough for a surprised driver to react and brake.

**Automation hand-over** is projection's hardest test. In conditionally automated driving (level 3 in SAE J3016) the driver may look away but must take over when asked. Simulator studies find that drivers need typically 2–3.5 s to put eyes, hands and feet back and act, with a long tail of slower responses, and much longer to rebuild a full picture of the traffic. UN Regulation No. 157 on automated lane keeping therefore gives the driver a transition demand of at least 10 s before the system starts a minimum-risk manoeuvre, except in emergencies. Looking away from the road for more than about 2 s in manual driving multiplies the risk ([[driver-workspace]]).

### Measuring SA
- **SAGAT**: freeze a simulation, blank the displays and ask questions about the situation; compare the answers with the truth.
- **Real-time probes** (such as SPAM): questions while the task runs, timing the answers.
- **Self-ratings** (such as SART): quick, but people are poor judges of what they have missed.

### Designing for SA
Start from a *goal-directed task analysis*: for each goal, what must the operator perceive, understand and predict? Then integrate data into meaning, show trends and margins, keep the operator in the loop with meaningful tasks, make automation's mode and intentions visible, and give teams a shared picture with briefings and call-outs.

| Setting | What must be tracked | Typical support |
|---|---|---|
| Driving | vehicles, people, signals, own speed | glance limits, warnings, head-up displays |
| Cockpit | flight path, terrain, traffic, automation modes | mode annunciators, terrain and traffic alerting ([[cockpit-ergonomics]]) |
| Control rooms | hundreds of slowly changing variables | overview displays, trends, alarm priorities |
| Mobile machines | people near the machine, blind zones | cameras, proximity detection ([[mobile-machines]]) |
| Military | ambiguous, changing situations, the team's positions | a common picture shared by the team |
| Health care | a patient's changing state | early-warning scores, structured handovers |

In the simulation an automated car reaches a lane closure and hands control back. Change the time budget, the driver's state and the warning, and follow the three levels of SA filling up against the distance that remains.

> [!key] Design for all three levels: show what matters where it is seen, turn data into meaning, and show what comes next. Give people time — seconds to act, longer to understand — whenever automation hands back control.
`,
  ideas: [
    'SA has three levels: perceiving the elements, understanding their meaning, projecting their future (Endsley).',
    'Most SA errors are failures to perceive information that was available.',
    'Automation can take people out of the loop; hand-backs need time — seconds to act, longer to understand.',
    'Time headway and time to collision turn a traffic scene into a projection: keep at least 2 s of headway.',
    'Integrated, predictive displays and mode annunciation support SA; raw data and hidden modes erode it.'
  ],
  pitfalls: [
    'If the information is on the display, the operator has it — Level 1 SA needs it to be perceived; most SA errors are information that was available but not taken in.',
    'Drivers of automated cars can take over instantly — Acting takes seconds; understanding the traffic takes much longer.',
    'More automation always improves SA — Monitoring gives a poorer picture than doing; automation must keep people informed and involved.'
  ],
  formulas: [
    {
      name: 'Time to collision',
      expr: 'TTC = D/(v1 - v2)', tex: '\\mathrm{TTC} = \\dfrac{D}{v_1 - v_2}',
      vars: {
        TTC: { name: 'time to collision', q: 'time', unit: 's', tex: '\\mathrm{TTC}' },
        D: { name: 'gap to the vehicle or obstacle ahead', q: 'length', unit: 'm', value: 30 },
        v1: { name: 'own speed', q: 'speed', unit: 'km/h', value: 90, tex: 'v_1' },
        v2: { name: 'speed of the vehicle ahead (0 for a stopped one)', q: 'speed', unit: 'km/h', value: 60, tex: 'v_2' }
      },
      note: 'Valid while the speeds stay constant and v₁ > v₂. Forward-collision warnings sound at about 2–2.5 s.',
      stories: { TTC: 'You drive at {v1}, {D} behind a car doing {v2}. How long until you hit it if nothing changes?', D: 'At {v1} behind a car doing {v2}, what gap gives a time to collision of {TTC}?' }
    },
    {
      name: 'Time headway',
      expr: 'th = D/v', tex: 't_h = \\dfrac{D}{v}',
      vars: {
        th: { name: 'time headway', q: 'time', unit: 's', tex: 't_h' },
        D: { name: 'gap to the vehicle ahead', q: 'length', unit: 'm', value: 25 },
        v: { name: 'own speed', q: 'speed', unit: 'km/h', value: 100 }
      },
      note: 'Keep at least 2 s on dry roads and about 4 s in the wet; more for heavy vehicles and in poor visibility.',
      stories: { th: 'At {v} you follow {D} behind the car ahead. What is your time headway?', D: 'At {v}, what gap gives a headway of {th}?' }
    }
  ],
  examples: [
    {
      title: 'Headway on a motorway',
      q: 'A driver at 100 km/h follows 25 m behind the car ahead. What is the time headway, and what gap does the two-second rule ask for?',
      steps: [
        '100 km/h = 27.8 m/s.',
        '$t_h = 25/27.8 = 0.9$ s — less than half the recommended headway, shorter than most people\'s reaction to a surprise.',
        'Two seconds: $D = 27.8 \\times 2 = 56$ m.'
      ],
      a: '0.9 s; the two-second rule asks for about 56 m.'
    },
    {
      title: 'A take-over at a lane closure',
      q: 'An automated car at 120 km/h asks the driver to take over 250 m before a lane closure. The driver needs 3 s to act when monitoring, 6 s when absorbed in a phone. Braking at 6 m/s², can each driver stop in time?',
      steps: [
        '120 km/h = 33.3 m/s; the time budget is $250/33.3 = 7.5$ s.',
        'Braking distance: $v^2/(2a) = 33.3^2/12 = 93$ m.',
        'Monitoring driver: $33.3 \\times 3 = 100$ m travelled; 150 m remain, more than 93 m — safe.',
        'Absorbed driver: $33.3 \\times 6 = 200$ m travelled; 50 m remain — too little: only a lane change or the system\'s own emergency stop helps.'
      ],
      a: 'The monitoring driver stops with about 57 m to spare; the absorbed driver cannot stop in time.'
    }
  ],
  quiz: [
    { q: 'A pilot reads the altitude correctly but does not realise the autopilot is in a mode that will descend below the safe height. Which level of SA failed?', choices: ['Level 2, comprehension (mode confusion)', 'Level 1, perception', 'Level 3 only', 'None: this is a slip'], a: 0, why: 'The data were perceived, but their meaning — the automation\'s mode and intention — was not understood.' },
    { q: 'True or false: in aviation incident reports most situation-awareness errors were failures to perceive available information.', a: true, why: 'Roughly three-quarters were level 1 errors — the case for designing where and how information appears.' },
    { q: 'You drive at 100 km/h, 40 m behind a car doing 70 km/h. What is the time to collision if nothing changes?', answer: 4.8, unit: 's', why: 'The gap closes at 30 km/h = 8.33 m/s; 40/8.33 = 4.8 s.' },
    { q: 'Why do people monitoring automation often have poorer SA than people doing the task?', choices: ['They are out of the loop: passive monitoring builds a weaker picture', 'Automation gives them less information', 'They are less skilled', 'They have more workload'], a: 0, why: 'Active control keeps a person engaged and updating their picture; watching does not.' },
    { q: 'How does SAGAT measure situation awareness?', choices: ['It freezes a simulation and asks questions about the situation', 'It measures heart rate', 'It counts errors', 'It asks for a rating after the task'], a: 0, why: 'Answers are compared with the true state at the freeze.' }
  ],
  problems: [
    { q: 'What gap does the two-second rule ask for at 80 km/h?', answer: 44.4, unit: 'm', tol: 0.01, steps: ['80 km/h = 22.2 m/s.', '$D = 22.2 \\times 2 = 44.4$ m.'] },
    { q: 'A car at 110 km/h is 50 m behind a truck at 80 km/h. What is the time to collision?', answer: 6.0, unit: 's', tol: 0.01, steps: ['Closing speed 30 km/h = 8.33 m/s.', '$\\mathrm{TTC} = 50/8.33 = 6.0$ s.'] }
  ],
  ranges: [
    { dim: 'Time headway to the vehicle ahead', range: [2, null], unit: 's', who: 'Drivers on dry roads; about double on wet roads', why: 'Covers a surprised driver\'s reaction time before braking begins.', limits: 'Heavy vehicles, poor brakes, ice and fog need more; dense traffic tempts drivers to less.', setting: ['vehicle', 'civil'], src: 'UK Highway Code (two-second rule)' },
    { dim: 'Forward-collision warning lead time (time to collision)', range: '≥ about 2–2.4 s', unit: '', who: 'Drivers not expecting the hazard', why: 'Leaves time to perceive, react and brake.', limits: 'Too early and drivers treat warnings as nuisances; too late and they cannot act.', setting: ['vehicle'], src: 'NHTSA NCAP forward-collision warning test' },
    { dim: 'Transition demand before an automated car starts a minimum-risk manoeuvre', range: [10, null], unit: 's', who: 'Drivers of conditionally automated cars who may be doing something else', why: 'Time to act and to rebuild awareness of the traffic.', limits: 'Emergencies may shorten it; drowsy or absorbed drivers can need longer to understand.', setting: ['vehicle'], src: 'UN Regulation No. 157 (Automated Lane Keeping Systems)' }
  ],
  applications: [
    'Flight-mode annunciators, terrain and traffic alerting in cockpits.',
    'Driver-monitoring cameras and graded take-over warnings in automated cars.',
    'Overview displays with trends and margins in control rooms.',
    'Proximity detection and cameras on mining trucks and construction machines.'
  ],
  history: 'Pilots talked of "situational awareness" long before it had a theory; Mica Endsley defined its three levels and the SAGAT freeze technique in the late 1980s and 1990s. Lisanne Bainbridge\'s "Ironies of automation" (1983) foresaw the out-of-the-loop problem that automated driving meets today.',
  sources: [
    'M. R. Endsley, "Toward a theory of situation awareness in dynamic systems", *Human Factors*, 1995.',
    'M. R. Endsley and D. G. Jones, *Designing for Situation Awareness: An Approach to User-Centered Design*.',
    'M. R. Endsley and E. O. Kiris, "The out-of-the-loop performance problem and level of control in automation", *Human Factors*, 1995.',
    'L. Bainbridge, "Ironies of automation", *Automatica*, 1983.',
    'SAE J3016, *Taxonomy and definitions for terms related to driving automation systems for on-road motor vehicles*.',
    'UN Regulation No. 157, *Automated Lane Keeping Systems (ALKS)*.',
    'A. Eriksson and N. A. Stanton, "Takeover time in highly automated vehicles", *Human Factors*, 2017.'
  ],
  sim: 'mt-takeover'
},

{
  id: 'decisions-stress', parent: 'mind-work', title: 'Decisions under stress', level: 2,
  short: 'Under time pressure people decide by recognising a familiar pattern and doing the first workable thing — fast and usually right, in situations they know. Speed trades against accuracy; stress narrows attention and favours habits; fatigue after 17–19 hours awake impairs like alcohol. Design buys time, strengthens the evidence, decides in advance with checklists and shares the load in a team.',
  keywords: ['decision making', 'time pressure', 'stress', 'recognition-primed decision', 'naturalistic decision making', 'speed-accuracy trade-off', 'drift diffusion model', 'heuristics', 'confirmation bias', 'plan continuation bias', 'startle', 'tunnel vision', 'fatigue', 'sleep loss', 'checklist', 'crew resource management', 'stopping distance', 'inverted U'],
  prereq: ['perception-attention', 'mental-workload', 'situation-awareness'],
  related: ['human-error', 'hick-law', 'alarms-warnings', 'cockpit-ergonomics', 'shift-work', 'fatigue-rest-breaks', 'sustained-operations', 'medicine:stress-coping', 'medicine:adrenal-stress', 'medicine:sleep'],
  body: `
Textbook decisions list the options, weigh them and pick the best. Under time pressure nobody does that. Firefighters, pilots, surgeons and drivers **recognise** the situation as one of a kind they know and do the first workable thing that comes to mind, checking it by imagining it play out — Gary Klein's *recognition-primed decision making*. It is fast and usually good, in situations people have met before. Design and training decide whether they have.

### Speed against accuracy
Every decision gathers evidence until there is enough to act. The drift–diffusion model pictures this as a [[?random-walk|random walk]] of evidence that drifts towards the right answer at a rate $v$ (the quality of the information) until it reaches one of two boundaries a distance $a$ apart (how cautious the decision-maker is). With noise of strength $s$, the chance of reaching the wrong boundary is

$$P_e = \\frac{1}{1 + e^{\\,v a / s^2}}$$

and the mean decision time is $\\frac{a}{2v}\\tanh\\frac{v a}{2 s^2}$, plus the time to see and to move. Time pressure lowers the boundary: decisions come faster but are wrong more often. The only way to be both fast *and* right is better evidence — a larger $v$ — which is what clear displays, distinct alarms and practised patterns provide.

### What stress does
Acute stress — threat, time pressure, noise, heat — narrows attention onto the most salient cues (*tunnel vision*), shrinks working memory, favours habits and makes people stick with a plan. Some arousal sharpens performance; a lot degrades it, complex tasks first. A sudden surprise can cause a **startle**: seconds of confusion, sometimes a reflex in the wrong direction — a factor in accidents where a small fault met an unprepared crew.

### Biases that grow under pressure
| Bias | What happens | Counter |
|---|---|---|
| Confirmation | seeking evidence for the first diagnosis | a checklist step "what else could it be?"; a second opinion |
| Plan continuation | pressing on with an approach, a journey or a job despite cues to stop | decision points set in advance: "not stable by 300 m, go around" |
| Availability | judging by what comes easily to mind | data, base rates, trends |
| Anchoring | staying near the first number heard | independent estimates before discussion |
| Sunk cost | refusing to abandon what has cost a lot | explicit stop criteria |

### Fatigue
After about 17–19 hours awake, performance on reaction and vigilance tasks falls to the level seen at a blood alcohol concentration of about 0.05 %, and after 24 hours to about 0.1 % (Dawson and Reid, 1997; Williamson and Feyer, 2000). Fatigue slows responses, narrows attention and makes people accept risks they would otherwise refuse ([[shift-work]], [[sustained-operations]]).

### Time on the road
A driver's decision starts a chain whose length grows with speed: the stopping distance is the distance travelled while perceiving and reacting plus the braking distance,

$$s = v\\,t_r + \\frac{v^2}{2a}$$

so doubling the speed from 50 to 100 km/h almost triples it. Roads, signals and junctions are designed around this ([[perception-attention]]).

### Designing for decisions under pressure
- **Buy time**: automatic safe states, stable systems, generous margins and stopping distances.
- **Strengthen the evidence**: integrated displays, clear alarm priorities, trends ([[situation-awareness]]).
- **Decide in advance**: checklists and quick-reference procedures for emergencies, few memory items, stop rules agreed before the pressure comes.
- **Share the load**: crew resource management — briefings, structured and assertive communication, a sterile flight deck during critical phases ([[cockpit-ergonomics]]).
- **Train realistically**: rare events rehearsed in simulators build the patterns that recognition needs; surprise and startle can be trained.

| Setting | Typical pressure | Typical support |
|---|---|---|
| Driving | fractions of a second, surprise | margins, warnings, automatic emergency braking |
| Aviation and military | minutes, high stakes, fatigue | checklists, crew resource management, drills, fatigue rules |
| Health care | rapid deterioration, many people | surgical safety checklist, team briefings, early-warning scores |
| Industry and control rooms | alarm floods, rare upsets | automatic shutdown before people must act, alarm priorities |
| Emergency services | uncertainty, danger | incident command structures, practised procedures |

In the simulation each line is one decision: evidence wanders towards the right answer until it hits a boundary. Lower the caution or add a deadline and watch errors appear; raise the evidence quality and see speed and accuracy improve together.

> [!warn] Fatigue and stress impair the judgement people need to recognise that they are impaired. Limits on working hours and agreed stop rules protect people when their own judgement cannot.

> [!key] People under pressure recognise and act; design so that the patterns they recognise are right: strong evidence, time to decide, decisions made in advance and a team that cross-checks.
`,
  ideas: [
    'Under time pressure experts recognise a familiar situation and act on the first workable option.',
    'Speed trades against accuracy; only better evidence gives decisions that are both faster and more accurate.',
    'Stress narrows attention, shrinks working memory and favours habits and the current plan.',
    'After 17–19 hours awake performance is impaired about as much as by a blood alcohol level of 0.05 %.',
    'Checklists, stop rules set in advance and crew resource management protect decisions made under pressure.'
  ],
  pitfalls: [
    'Good decision-makers weigh every option before acting — Under time pressure experts recognise and act; weighing options is for when there is time.',
    'Stress always improves performance by sharpening focus — A little arousal helps; high stress narrows attention and degrades complex decisions first.',
    'An experienced person can judge their own fatigue — Self-assessment fails exactly when fatigue is worst; use hour limits and objective rules.'
  ],
  formulas: [
    {
      name: 'Stopping distance',
      expr: 's = v*t + v^2/(2*a)', tex: 's = v\\,t_r + \\dfrac{v^2}{2a}',
      vars: {
        s: { name: 'stopping distance', q: 'length', unit: 'm' },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 50 },
        t: { name: 'perception–reaction time', q: 'time', unit: 's', value: 1.5, tex: 't_r' },
        a: { name: 'braking deceleration', q: 'accel', unit: 'm/s²', value: 7 }
      },
      note: 'About 7–8 m/s² for hard braking on a dry road; road design assumes a gentler 3.4 m/s² and a 2.5 s reaction.',
      stories: { s: 'A driver at {v} needs {t} to react and brakes at {a}. What is the stopping distance?', v: 'A hazard appears {s} ahead. With {t} to react and braking at {a}, what is the highest speed at which the car can still stop?' }
    },
    {
      name: 'Error rate in the drift–diffusion model',
      expr: 'Pe = 1/(1 + exp(v*a/s^2))', tex: 'P_e = \\dfrac{1}{1 + e^{v a / s^2}}',
      vars: {
        Pe: { name: 'probability of a wrong decision', q: 'ratio', unit: '%', tex: 'P_e' },
        v: { name: 'drift rate: quality of the evidence (per second)', value: 0.2 },
        a: { name: 'boundary separation: caution', value: 0.12 },
        s: { name: 'noise of the evidence', value: 0.1, fixed: true }
      },
      note: 'For a decision starting midway between the boundaries. By convention s = 0.1; typical fitted v are 0.1–0.4 and a 0.08–0.16.',
      stories: { Pe: 'Evidence arrives with drift {v} and the decision-maker waits for a boundary separation {a}. What share of decisions are wrong?', a: 'With drift {v}, how cautious must the decision-maker be to err only {Pe} of the time?' }
    },
    {
      name: 'Mean decision time in the drift–diffusion model',
      expr: 'Td = a/(2*v)*tanh(a*v/(2*s^2))', tex: 'T_d = \\dfrac{a}{2v}\\tanh\\dfrac{a v}{2 s^2}',
      vars: {
        Td: { name: 'mean decision time (without seeing and moving)', q: 'time', unit: 's', tex: 'T_d' },
        a: { name: 'boundary separation: caution', value: 0.12 },
        v: { name: 'drift rate: quality of the evidence (per second)', value: 0.2 },
        s: { name: 'noise of the evidence', value: 0.1, fixed: true }
      },
      note: 'Add about 0.3–0.4 s for perceiving and moving to get the reaction time.',
      stories: { Td: 'With drift {v} and caution {a}, how long does the average decision take?' }
    }
  ],
  examples: [
    {
      title: 'Twice the speed, three times the distance',
      q: 'Compare stopping distances at 50 and 100 km/h for a 1.5 s perception–reaction time and braking at 7 m/s².',
      steps: [
        '50 km/h = 13.9 m/s: $13.9 \\times 1.5 + 13.9^2/14 = 20.8 + 13.8 = 34.6$ m.',
        '100 km/h = 27.8 m/s: $27.8 \\times 1.5 + 27.8^2/14 = 41.7 + 55.1 = 96.8$ m.',
        'The reaction part doubles, the braking part quadruples: 2.8 times the distance in all.'
      ],
      a: 'About 35 m at 50 km/h and 97 m at 100 km/h.'
    },
    {
      title: 'Faster decisions: pressure or better evidence?',
      q: 'A decision-maker has drift $v = 0.2$ and caution $a = 0.12$ ($s = 0.1$). Time pressure lowers the caution to $a = 0.08$. A better display instead doubles the drift to $v = 0.4$ at $a = 0.08$. Compare error rates and decision times.',
      steps: [
        'Start: $va/s^2 = 2.4$, $P_e = 1/(1 + e^{2.4}) = 8.3\\,\\%$; $T_d = 0.3 \\tanh 1.2 = 0.25$ s.',
        'Pressure: $va/s^2 = 1.6$, $P_e = 16.8\\,\\%$; $T_d = 0.2 \\tanh 0.8 = 0.13$ s — faster, but twice the errors.',
        'Better evidence: $va/s^2 = 3.2$, $P_e = 3.9\\,\\%$; $T_d = 0.1 \\tanh 1.6 = 0.09$ s — faster *and* more accurate.'
      ],
      a: 'Pressure: 16.8 % errors in 0.13 s; better evidence: 3.9 % in 0.09 s (start: 8.3 % in 0.25 s).'
    }
  ],
  quiz: [
    { q: 'How do experienced firefighters and pilots usually decide under time pressure?', choices: ['They recognise the situation and act on the first workable option', 'They list all options and score them', 'They choose at random', 'They wait for more information'], a: 0, why: 'Recognition-primed decision making: fast pattern matching checked by mental simulation.' },
    { q: 'A crew continues an unstable approach because they are nearly there. Which bias is this, and what counters it?', choices: ['Plan continuation; stop rules set in advance', 'Anchoring; a second opinion', 'Availability; base rates', 'Sunk cost; more training'], a: 0, why: 'Pressing on despite cues to stop is plan continuation; criteria agreed before the approach ("not stable by 300 m, go around") remove the in-the-moment decision.' },
    { q: 'True or false: after about 17–19 hours awake, reaction and vigilance performance resemble those at a blood alcohol level of about 0.05 %.', a: true, why: 'Dawson and Reid (1997) and Williamson and Feyer (2000) found impairment of that size.' },
    { q: 'What is the stopping distance at 100 km/h with a 1.5 s reaction and 7 m/s² braking?', answer: 96.8, unit: 'm', why: '27.8 × 1.5 + 27.8²/14 = 41.7 + 55.1 = 96.8 m.' },
    { q: 'In the drift–diffusion model, what makes decisions both faster and more accurate?', choices: ['Better evidence (a higher drift rate)', 'Lower caution', 'More noise', 'A deadline'], a: 0, why: 'Lower caution trades accuracy for speed; only a higher drift rate improves both.' }
  ],
  problems: [
    { q: 'A driver at 80 km/h reacts in 1.2 s and brakes at 7 m/s². What is the stopping distance?', answer: 61.9, unit: 'm', tol: 0.01, steps: ['80 km/h = 22.2 m/s.', '$s = 22.2 \\times 1.2 + 22.2^2/14 = 26.7 + 35.3 = 61.9$ m.'] },
    { q: 'With drift $v = 0.3$, caution $a = 0.1$ and noise $s = 0.1$, what share of decisions are wrong?', answer: 4.74, unit: '%', tol: 0.02, steps: ['$va/s^2 = 0.03/0.01 = 3$.', '$P_e = 1/(1 + e^3) = 1/21.1 = 4.74\\,\\%$.'] }
  ],
  ranges: [
    { dim: 'Hours awake before impairment like 0.05 % blood alcohol', range: [17, 19], unit: 'h', who: 'Healthy adults after a normal night\'s sleep', why: 'Plan safety-critical work and journeys to finish well within it.', limits: 'Night work, previous sleep debt and the body-clock low (about 02:00–06:00) bring impairment sooner.', setting: ['all'], src: 'Dawson and Reid (1997); Williamson and Feyer (2000)' },
    { dim: 'Braking deceleration to assume for stopping distances', range: [3.4, 8], unit: 'm/s²', who: 'Drivers of cars: 3.4 m/s² for design (most drivers, wet roads), 7–8 m/s² for an emergency stop on a dry road', why: 'Sight distances and margins that nearly every driver can use.', limits: 'Heavy vehicles, wet or icy roads and worn tyres give much less; standing passengers fall above about 1.5 m/s².', setting: ['vehicle', 'civil'], src: 'AASHTO Green Book (stopping sight distance)' },
    { dim: 'Sleep per 24 hours for adults', range: [7, 9], unit: 'h', who: 'Adults in general; needs vary between people', why: 'Keeps alertness, judgement and reaction time at their best.', limits: 'Shift workers and crews on long operations need planned sleep opportunities and naps; sleep disorders need medical advice.', setting: ['all'], src: 'AASM and Sleep Research Society consensus (2015)' }
  ],
  applications: [
    'Stop rules for approaches, take-offs and hazardous jobs agreed before the pressure comes.',
    'Checklists and crew resource management in aviation, surgery and ship bridges.',
    'Hours-of-work and rest rules for drivers, pilots, doctors and soldiers.',
    'Automatic emergency braking and shutdown systems that act faster than people can decide.'
  ],
  history: 'Yerkes and Dodson described the rise and fall of performance with arousal in 1908. In the 1980s Gary Klein studied fireground commanders and found they rarely compared options. The Tenerife collision (1977) and similar accidents led to a NASA workshop in 1979 and to crew resource management training, now standard in aviation and spreading to medicine.',
  sources: [
    'G. Klein, *Sources of Power: How People Make Decisions*, 1998.',
    'A. Tversky and D. Kahneman, "Judgment under uncertainty: heuristics and biases", *Science*, 1974.',
    'R. Ratcliff, "A theory of memory retrieval", *Psychological Review*, 1978 — the diffusion model of decisions.',
    'D. Dawson and K. Reid, "Fatigue, alcohol and performance impairment", *Nature*, 1997.',
    'A. M. Williamson and A.-M. Feyer, "Moderate sleep deprivation produces impairments in cognitive and motor performance equivalent to legally prescribed levels of alcohol intoxication", *Occupational and Environmental Medicine*, 2000.',
    'N. F. Watson et al., "Recommended amount of sleep for a healthy adult: a joint consensus statement of the American Academy of Sleep Medicine and Sleep Research Society", *Sleep*, 2015.',
    'AASHTO, *A Policy on Geometric Design of Highways and Streets* — stopping sight distance.'
  ],
  sim: 'mt-decision'
},

{
  id: 'usability', parent: 'mind-work', title: 'Usability', level: 2,
  short: 'How well specified users can reach specified goals with a product, in a specified context: effectiveness (do they succeed?), efficiency (at what cost in time and effort?) and satisfaction (how do they feel?) — ISO 9241-11. Designed by the human-centred process of ISO 9241-210 and measured by testing with real users: five users find most problems, and three small rounds beat one big one.',
  keywords: ['usability', 'ISO 9241-11', 'effectiveness', 'efficiency', 'satisfaction', 'context of use', 'ISO 9241-210', 'human-centred design', 'ISO 9241-110', 'interaction principles', 'usability testing', 'think aloud', 'heuristic evaluation', 'System Usability Scale', 'SUS', 'response time', 'IEC 62366', 'use error'],
  prereq: ['human-centred-design', 'human-error', 'mental-workload'],
  related: ['hmi-screens', 'information-design', 'user-trials-mockups', 'controls-design', 'displays-design', 'task-analysis', 'accessible-design', 'fitts-law', 'hick-law'],
  body: `
A machine, a web form or an infusion pump is usable when the people it is meant for can do what they came to do — correctly, without wasted effort and without hating it. ISO 9241-11 makes this measurable. Usability is always *of* a product, *for* specified users, *for* specified goals, *in* a specified context: the same ticket machine may be usable for a commuter and unusable for a tourist with a suitcase and a child.

### Three measures
| Component | The question | Typical measures |
|---|---|---|
| **Effectiveness** | Do users reach the goal, completely and accurately? | task completion rate, errors |
| **Efficiency** | At what cost in time, effort and resources? | time on task, steps, workload |
| **Satisfaction** | How do users feel: comfort, trust, acceptance? | questionnaires such as the System Usability Scale (SUS) |

They do not always agree: an expert tool can be efficient and unpleasant, a friendly app satisfying and ineffective. Measure all three against targets set before testing — "nine in ten first-time users book a ticket in under three minutes without help".

### Context of use
Users (skills, age, language, disabilities, training), tasks (frequency, criticality, time pressure), equipment, and the physical and social surroundings (gloves, sunlight, noise, interruptions, a queue behind). A touchscreen that tests well in an office can fail on a forklift in winter ([[hmi-screens]]).

### Human-centred design
ISO 9241-210 describes the process: understand the context of use, specify the user requirements, produce design solutions, evaluate them with users — and iterate until the requirements are met ([[human-centred-design]]). ISO 9241-110 gives principles for interaction: suited to the task, self-descriptive, as users expect, learnable, controllable, robust against use errors and engaging. For medical devices IEC 62366-1 turns these ideas into a required usability-engineering process aimed at use errors that could cause harm.

### Methods
- **Usability testing**: representative users do real tasks, thinking aloud, while observers note problems. In Nielsen and Landauer's model each user meets a share $L$ of the problems — about 31 % on average in their projects — so $n$ users find $1 - (1 - L)^n$ of them ([[?exponent|a power]] of the share missed): five users about 85 %. Three rounds of five with fixes in between beat one round of fifteen, because each round meets the problems the last one hid.
- **Heuristic evaluation**: a few experts inspect against principles such as Nielsen's ten heuristics — visible system status, match with the real world, user control and freedom, consistency, error prevention, recognition rather than recall, flexibility, minimalist design, help to recover from errors, help and documentation.
- **Questionnaires**: the SUS has ten statements rated 1–5 and gives a score from 0 to 100; across many studies the average is about 68.
- **Field studies and analytics**: what people really do, at scale.

### Response times
Three limits have held for decades: about **0.1 s** feels instantaneous (key feedback, dragging), about **1 s** keeps the flow of thought, about **10 s** holds attention — beyond that, show progress and let people do something else. The same holds for machine controls: a button that responds after half a second gets pressed again.

| Setting | Users and context | What matters most |
|---|---|---|
| Home and public | anyone, untrained, in a hurry | learnability, error tolerance, accessibility |
| Office | trained, daily, long hours | efficiency, consistency, shortcuts |
| Workshop and industry | gloves, noise, dirt, interruptions | large targets, clear states, robustness |
| Health care | stressed staff, critical tasks | preventing use errors (IEC 62366-1) |
| Vehicles and military | glances, vibration, stress | few steps, physical controls, eyes-free use |

In the simulation a product hides thirty problems that users meet with different probabilities. Run one round of fifteen users, then three rounds of five with fixes in between, and compare what is left.

> [!tip] Test early with paper or rough prototypes and five representative users, fix, and test again. Watch what people do; do not ask them what they would do.

> [!key] Usability is effectiveness, efficiency and satisfaction for specified users, goals and contexts. Design it with users, measure it against targets, and iterate.
`,
  ideas: [
    'Usability (ISO 9241-11) is effectiveness, efficiency and satisfaction for specified users, goals and context of use.',
    'Human-centred design (ISO 9241-210) iterates: context, requirements, design, evaluation with users.',
    'Each test user reveals a share of the problems; five users find most of the common ones, and small iterative rounds beat one large test.',
    'Responses within 0.1 s feel instantaneous, within 1 s keep the flow, beyond 10 s need a progress indicator.',
    'Use errors with medical devices and industrial interfaces make usability a safety matter.'
  ],
  pitfalls: [
    'Usability is a property of the product — It depends on who uses it, for what and where; the same product can be usable in one context and not another.',
    'Five users find 85 % of all problems in any product — Only when each problem is met by about a third of users; rare problems and diverse user groups need more users and more rounds.',
    'If users say they like it, it is usable — Satisfaction is one of three measures; users often praise designs they cannot operate correctly.'
  ],
  formulas: [
    {
      name: 'Share of usability problems found by n test users',
      expr: 'Fd = 1 - (1 - L)^n', tex: 'F = 1 - (1 - L)^{n}',
      vars: {
        Fd: { name: 'share of the problems found', q: 'ratio', unit: '%', tex: 'F' },
        L: { name: 'share of the problems one user meets', q: 'ratio', unit: '%', value: 31, min: 0, max: 100 },
        n: { name: 'number of test users', q: 'count', value: 5, int: true }
      },
      note: 'Nielsen and Landauer (1993) found L ≈ 31 % on average; it is lower for large, complex systems and diverse user groups.',
      stories: { Fd: 'Each user meets {L} of the problems. What share do {n} users find?', n: 'Each user meets {L} of the problems. How many users are needed to find {Fd}?' }
    },
    {
      name: 'System Usability Scale score',
      expr: 'SUS = 2.5*(So - Se + 20)', tex: '\\mathrm{SUS} = 2.5\\,(S_o - S_e + 20)',
      vars: {
        SUS: { name: 'SUS score (0–100)', tex: '\\mathrm{SUS}' },
        So: { name: 'sum of the ratings of the odd, positive items 1, 3, 5, 7, 9 (each 1–5)', value: 20, min: 5, max: 25, tex: 'S_o' },
        Se: { name: 'sum of the ratings of the even, negative items 2, 4, 6, 8, 10 (each 1–5)', value: 10, min: 5, max: 25, tex: 'S_e' }
      },
      note: 'The usual scoring — (rating − 1) for odd items, (5 − rating) for even items, sum × 2.5 — written with the two sums. About 68 is average.',
      stories: { SUS: 'A user\'s odd-item ratings add up to {So} and the even-item ratings to {Se}. What is the SUS score?' }
    }
  ],
  examples: [
    {
      title: 'How many test users?',
      q: 'Each user meets 31 % of the problems in a web shop. What share do 5 and 15 users find? In a complex control system each user meets only 10 %: how many users find 90 %?',
      steps: [
        '5 users: $1 - 0.69^5 = 1 - 0.156 = 84\\,\\%$.',
        '15 users: $1 - 0.69^{15} = 99.6\\,\\%$ — but three rounds of five, with fixes in between, also test the fixes and meet the problems hidden behind the first ones.',
        'At $L = 0.1$: $n = \\ln 0.1/\\ln 0.9 = 21.9$, so about 22 users — or several rounds with different user groups.'
      ],
      a: '84 % with five users, 99.6 % with fifteen; about 22 users when each meets only 10 %.'
    },
    {
      title: 'Scoring a SUS questionnaire',
      q: 'A participant rates the ten SUS statements 4, 2, 5, 1, 4, 2, 4, 2, 5, 1. What is the score?',
      steps: [
        'Odd items (1, 3, 5, 7, 9): $4 + 5 + 4 + 4 + 5 = 22$. Even items: $2 + 1 + 2 + 2 + 1 = 8$.',
        '$\\mathrm{SUS} = 2.5\\,(22 - 8 + 20) = 2.5 \\times 34 = 85$.',
        'Well above the average of about 68 — for this participant. Scores are compared as means over many users.'
      ],
      a: '85.'
    }
  ],
  quiz: [
    { q: 'Which three components make up usability in ISO 9241-11?', choices: ['Effectiveness, efficiency and satisfaction', 'Speed, accuracy and beauty', 'Learnability, memorability and errors', 'Safety, cost and comfort'], a: 0, why: 'Each is measured for specified users, goals and context of use.' },
    { q: 'Each user meets 31 % of the problems. About what share do five users find?', answer: 84, unit: '%', why: '1 − 0.69⁵ = 0.84.' },
    { q: 'A machine\'s button takes 0.8 s to show any response. What do users typically do?', choices: ['Press it again, often causing a double action', 'Wait patiently', 'Nothing different', 'Read the manual'], a: 0, why: 'Feedback within about 0.1 s feels immediate; delays invite repeated presses.' },
    { q: 'True or false: usability is a fixed property of a product, whoever uses it.', a: false, why: 'It depends on the users, their goals and the context of use.' },
    { q: 'A product scores a mean SUS of 55. How does it compare?', choices: ['Below the average of about 68', 'Excellent', 'Exactly average', 'The scale has no reference'], a: 0, why: 'Across many studies the mean SUS is about 68.' }
  ],
  problems: [
    { q: 'Each user meets 25 % of the problems. What share do eight users find?', answer: 90, unit: '%', tol: 0.01, steps: ['$1 - 0.75^8 = 1 - 0.100 = 90\\,\\%$.'] },
    { q: 'A participant\'s odd-item SUS ratings sum to 18 and even-item ratings to 12. What is the score?', answer: 65, tol: 0.001, steps: ['$2.5\\,(18 - 12 + 20) = 2.5 \\times 26 = 65$.'] }
  ],
  ranges: [
    { dim: 'System response that feels instantaneous', range: [null, 0.1], unit: 's', who: 'All users of interactive systems and machine controls', why: 'Direct manipulation and key presses feel connected to the result.', limits: 'Networked systems need local feedback first, then the result.', setting: ['all'], src: 'Miller (1968); Card, Robertson and Mackinlay (1991); Nielsen, Usability Engineering (1993)' },
    { dim: 'System response that keeps the flow of thought', range: [null, 1], unit: 's', who: 'Users moving through a task', why: 'Users stay on the task without noticing the delay much.', limits: 'Delays that vary annoy more than steady ones.', setting: ['all'], src: 'Miller (1968); Nielsen (1993)' },
    { dim: 'Longest wait without a progress indicator', range: [null, 10], unit: 's', who: 'Users waiting for a result', why: 'Attention holds for about this long; beyond it users switch tasks or retry.', limits: 'Show progress, time remaining and a way to cancel for longer waits.', setting: ['all'], src: 'Nielsen, Usability Engineering (1993)' },
    { dim: 'Test users per round of iterative usability testing', range: [5, 8], unit: 'users', who: 'Each distinct user group of the product', why: 'Finds most of the common problems cheaply, leaving money for more rounds.', limits: 'Several user groups, rare problems and safety-critical products need more users and summative tests.', setting: ['all'], src: 'Nielsen and Landauer (1993)' },
    { dim: 'Mean SUS score to aim for', range: [68, null], unit: 'points (0–100)', who: 'Representative users after realistic tasks', why: 'At or above the average of many products.', limits: 'Satisfaction only: pair it with completion rates and times.', setting: ['all'], src: 'Brooke (1996); Bangor, Kortum and Miller (2008)' }
  ],
  applications: [
    'Iterative testing of ticket machines, apps, machine HMIs and medical devices.',
    'Usability-engineering files for medical devices under IEC 62366-1.',
    'Acceptance criteria in procurement: completion rate, time on task and SUS targets.',
    'Heuristic reviews of control-room and cockpit displays before user trials.'
  ],
  history: 'Robert Miller\'s response-time limits date from 1968. Usability engineering took shape in the 1980s at IBM, Digital and elsewhere; Jakob Nielsen\'s heuristics (1990, revised 1994) and John Brooke\'s SUS (1986, published 1996) became standard tools. ISO 9241-11 first defined usability in 1998, revised in 2018.',
  sources: [
    'ISO 9241-11, *Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts*.',
    'ISO 9241-210, *Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems*.',
    'ISO 9241-110, *Ergonomics of human-system interaction — Part 110: Interaction principles*.',
    'IEC 62366-1, *Medical devices — Application of usability engineering to medical devices*.',
    'J. Nielsen and T. K. Landauer, "A mathematical model of the finding of usability problems", *Proceedings of INTERCHI*, 1993.',
    'J. Brooke, "SUS: a quick and dirty usability scale", in *Usability Evaluation in Industry*, 1996.',
    'J. Nielsen, *Usability Engineering*, 1993 — heuristics and response-time limits.',
    'A. Bangor, P. T. Kortum and J. T. Miller, "An empirical evaluation of the System Usability Scale", *International Journal of Human-Computer Interaction*, 2008.'
  ],
  sim: 'mt-usability-test'
},

{
  id: 'information-design', parent: 'mind-work', title: 'Labels, signs and information design', level: 2,
  short: 'Text, labels, signs and symbols must be legible from where people stand, readable at a glance and understood as intended. Character height grows in proportion to viewing distance — about 5–10 mm per metre for people on foot, about 3 mm per metre for bold road signs — with strong contrast, plain words and tested symbols. Safety signs follow a shared grammar of shapes and colours (ISO 3864, ISO 7010).',
  keywords: ['information design', 'legibility', 'readability', 'comprehension', 'character height', 'viewing distance', 'visual angle', 'legibility index', 'stroke width', 'contrast', 'line length', 'plain language', 'safety signs', 'ISO 7010', 'ISO 3864', 'ANSI Z535', 'signal words', 'pictograms', 'ISO 9186', 'wayfinding', 'ADA signage', 'Directive 92/58/EEC'],
  prereq: ['perception-attention', 'displays-design', 'glare-colour'],
  related: ['usability', 'alarms-warnings', 'hmi-screens', 'accessible-design', 'visual-ergonomics', 'lighting-levels', 'public-transport', 'driver-workspace', 'machine-ergonomics-principles', 'physics:the-eye', 'medicine:vision'],
  body: `
A label nobody can read from where they stand, a sign that points the wrong way, an instruction that assumes knowledge the reader lacks — each is a design error paid for in time, mistakes and accidents. Information design works on three levels: **legibility** (can the characters be made out?), **readability** (can the text be read quickly and without effort?) and **comprehension** (is the message understood as intended?).

### Legibility: size for the distance
What matters is the angle a character subtends at the eye, not its size in millimetres ([[displays-design]]). For a fixed angle the height is [[?proportional|proportional]] to the distance, so a handy measure is the **legibility ratio** $k$: text of height $h$ can be read from $D = k\\,h$. Typical values:

| Text | Visual angle of a capital | Height per metre of distance | $k$ |
|---|---|---|---|
| Screen text and work labels (ISO 9241-303: 16′ minimum, 20–22′ preferred) | 16–22′ | 4.7–6.4 mm | 155–215 |
| Signs in buildings under the US accessibility rules (ADA), beyond 1.8 m | about 36′ | about 10.5 mm | about 95 |
| Road signs (US practice, 1 inch of letter per 30 ft) | about 10′ | about 2.8 mm | 360 |

Road signs manage with small angles because they use bold, well-spaced, retroreflective letters and familiar words; a label read by an older worker in poor light needs the generous end. Rules that hold everywhere:
- **Stroke width** about 1/6 to 1/10 of the character height — bolder for light characters on a dark ground (they spread by irradiation) and in dim light.
- **Mixed case** for words and phrases (word shapes help); capitals for single short labels (STOP, OFF).
- **Contrast**: at least 4.5 : 1 for text on screens (WCAG), more for older eyes; never grey on grey.
- **Lines** of about 45–75 characters for continuous text, spaced at about 1.2–1.5 times the font size.
- **Plain language**: short sentences, one instruction per step, the action first — "Close the valve before opening the cover".

### Safety signs and warnings
Safety signs share a visual grammar (ISO 3864-1, with the registered symbols of ISO 7010): a red circle with a bar for **prohibition**, a blue circle for a **mandatory action**, a yellow triangle with a black border for a **warning**, a green rectangle for a **safe condition** (exits, first aid), red for fire equipment. In the US, ANSI Z535 grades signal words by severity — DANGER, WARNING, CAUTION — and structures a warning as the hazard, its consequence and how to avoid it. The European safety-signs directive (92/58/EEC) sizes a sign by the distance it must be seen from: an area of at least $L^2/2000$ for distances up to about 50 m.

Warnings are the last line of defence, after designing the hazard out and guarding it ([[machine-ergonomics-principles]]). They work only when they are **noticed** (where the eyes are, at the moment of risk), **understood** (tested with users), **believed** and **cheap to follow**.

### Symbols must be tested
A symbol obvious to its designer is often not obvious to anyone else. ISO 9186-1 describes comprehension tests. Public-information symbols have commonly been accepted at about two-thirds correct answers; ANSI Z535.3 asks 85 % correct with fewer than 5 % *critical confusions* — answers that would lead to the opposite, dangerous action — for safety symbols. Add words wherever a mistake matters, and use registered symbols people already know.

| Setting | Readers and conditions | What changes |
|---|---|---|
| Public spaces and transport | everyone, moving, many languages, low vision | large characters, symbols with text, tactile and audible information ([[public-transport]]) |
| Workshop and machinery | gloves, dirt, glare, noise | durable engraved labels, larger sizes, ISO 7010 signs |
| Office and screens | long reading | typography, contrast, line length |
| Vehicles | glances of about a second, at speed | few words, familiar symbols, road-sign sizes ([[driver-workspace]]) |
| Military and field | night, stress, protective eyewear | lighting compatible with night vision, redundant coding |

In the simulation a label or sign is shown as it would look from the chosen distance: change the character height, the contrast, the lighting and the reader's eyesight, and find the distance at which it becomes legible. For a moving reader the time the sign stays legible is $(D - D_m)/v$.

> [!tip] Size every label for the farthest place it must be read from, test it with the oldest users in the worst light, and pair every symbol that matters with a word.

> [!key] Legible (size by distance, contrast, stroke), readable (plain words, good layout) and understood (tested symbols, the shared sign grammar) — in that order, and for the real readers.
`,
  ideas: [
    'Legibility depends on the visual angle: character height grows in proportion to viewing distance.',
    'About 5–6 mm per metre suits text read at work (20′ of arc); accessible building signs use about 10 mm per metre; road signs about 3 mm per metre with bold letters.',
    'Stroke width, case, contrast, line length and plain words decide readability.',
    'Safety signs follow a shared grammar: red prohibition, blue mandatory, yellow warning, green safe condition.',
    'Symbols must be tested for comprehension; critical confusions are worse than blanks.'
  ],
  pitfalls: [
    'A label size in millimetres is either big enough or not — Legibility depends on distance: 5 mm is fine at 1 m and useless at 5 m.',
    'All-capital text is easier to read — Capitals suit single short labels; words and sentences read faster in mixed case.',
    'A clear symbol needs no words — Many "obvious" symbols fail comprehension tests; add text where a mistake matters.'
  ],
  formulas: [
    {
      name: 'Legibility distance from character height',
      expr: 'D = k*h', tex: 'D = k\\,h',
      vars: {
        D: { name: 'distance from which the text is legible', q: 'length', unit: 'm' },
        k: { name: 'legibility ratio (≈ 170 for 20′ of arc, ≈ 95 for accessible signs, ≈ 360 for road signs)', value: 170, min: 20, max: 600 },
        h: { name: 'character height (capital letter)', q: 'length', unit: 'mm', value: 30 }
      },
      note: 'k = 1/(2 tan(α/2)) for a visual angle α. Use the lower k (bigger letters) for older readers, poor light, low contrast or safety-critical text.',
      stories: { D: 'Capitals {h} tall are designed for a legibility ratio of {k}. From how far can they be read?', h: 'A sign must be read from {D} with a legibility ratio of {k}. How tall must its capitals be?' }
    },
    {
      name: 'Minimum area of a safety sign',
      expr: 'A = L^2/2000', tex: 'A = \\dfrac{L^2}{2000}',
      vars: {
        A: { name: 'minimum area of the sign', q: 'area', unit: 'm²' },
        L: { name: 'greatest distance from which the sign must be understood', q: 'length', unit: 'm', value: 20 }
      },
      note: 'From the European safety-signs directive 92/58/EEC, for distances up to about 50 m, with A in m² and L in m.',
      stories: { A: 'A warning sign must be understood from {L}. What is its minimum area?', L: 'A sign has an area of {A}. From how far can it be relied on?' }
    },
    {
      name: 'Reading time for a moving reader',
      expr: 't = (D - Dm)/v', tex: 't = \\dfrac{D - D_m}{v}',
      vars: {
        t: { name: 'time the sign is legible', q: 'time', unit: 's' },
        D: { name: 'legibility distance', q: 'length', unit: 'm', value: 80 },
        Dm: { name: 'distance at which the sign leaves the field of view', q: 'length', unit: 'm', value: 15, tex: 'D_m' },
        v: { name: 'speed of the reader', q: 'speed', unit: 'km/h', value: 50 }
      },
      note: 'Signs read on the move need few, familiar words; the reader also needs time to decide and act after reading.',
      stories: { t: 'A sign is legible from {D} and leaves the driver\'s view at {Dm}. How long can a driver at {v} read it?', D: 'A driver at {v} needs {t} to read a sign that leaves the view at {Dm}. From how far must it be legible?' }
    }
  ],
  examples: [
    {
      title: 'A wall sign read from 8 m',
      q: 'How tall must the capitals of a room sign be to be read from 8 m at 20′ of arc? What does the ADA rule for visual characters give (16 mm up to 1.83 m, plus 3.2 mm for every 305 mm beyond)?',
      steps: [
        '20′: $k = 1/(2 \\tan 10\') = 172$, so $h = 8000/172 = 46.5$ mm.',
        'ADA: $16 + 3.2 \\times (8000 - 1830)/305 = 16 + 64.7 = 81$ mm.',
        'The accessibility rule is almost twice as generous, allowing for low vision and signs seen at an angle.'
      ],
      a: 'About 47 mm at 20′; about 81 mm under the ADA rule.'
    },
    {
      title: 'Sizing a warning sign',
      q: 'A warning sign at a loading bay must be understood from 20 m. What minimum area does 92/58/EEC give, and what side for a square sign? What for 50 m?',
      steps: [
        '$A = 20^2/2000 = 0.2$ m²; a square of $\\sqrt{0.2} = 0.45$ m side.',
        '50 m: $A = 2500/2000 = 1.25$ m², a square of 1.12 m.',
        'Put it where drivers and walkers look as they approach the hazard, and light it.'
      ],
      a: '0.2 m² (about 450 mm square) for 20 m; 1.25 m² for 50 m.'
    }
  ],
  quiz: [
    { q: 'A label is legible at 1 m with 6 mm capitals. How tall must they be to be legible at 3 m?', choices: ['18 mm', '6 mm', '12 mm', '54 mm'], a: 0, why: 'For the same visual angle the height scales with distance: three times as far, three times as tall.' },
    { q: 'What does a blue circle with a white symbol mean on a safety sign?', choices: ['A mandatory action', 'A prohibition', 'A warning', 'A safe condition'], a: 0, why: 'ISO 3864-1: blue circles for mandatory actions (wear hearing protection), red circles with a bar for prohibitions.' },
    { q: 'With a legibility ratio of 170, from how far can 35 mm capitals be read?', answer: 5.95, unit: 'm', why: 'D = k h = 170 × 35 mm = 5950 mm.' },
    { q: 'Where do warnings stand among the ways of controlling a hazard?', choices: ['Last: after designing the hazard out and guarding it', 'First: they are cheapest', 'Instead of guarding', 'They replace training'], a: 0, why: 'Warnings depend on being noticed, understood and obeyed; design and guards do not.' },
    { q: 'True or false: a symbol that 80 % of test users understand, but 10 % read as the opposite action, is acceptable for a safety sign.', a: false, why: 'Critical confusions are the worst outcome; ANSI Z535.3 asks for fewer than 5 % together with 85 % correct.' }
  ],
  problems: [
    { q: 'A safety sign must be understood from 15 m. What is its minimum area under 92/58/EEC?', answer: 0.1125, unit: 'm²', tol: 0.01, steps: ['$A = 15^2/2000 = 225/2000 = 0.1125$ m² (a square of about 335 mm).'] },
    { q: 'Signs in a warehouse must be read from 12 m at a legibility ratio of 170. How tall must the capitals be?', answer: 70.6, unit: 'mm', tol: 0.01, steps: ['$h = D/k = 12\\,000/170 = 70.6$ mm.'] }
  ],
  ranges: [
    { dim: 'Character height per metre of viewing distance (people on foot, at work)', range: [4.7, 10.5], unit: 'mm per m', who: 'From 16–22′ of arc (normal vision, good light) up to the ADA rule for signs (low vision, oblique views)', why: 'Text legible at a glance from where people stand.', limits: 'Older readers, poor light, low contrast and safety-critical text need the upper end; very large signs may be seen too close.', setting: ['office', 'workshop', 'civil'], src: 'ISO 9241-303; 2010 ADA Standards for Accessible Design (703.5)' },
    { dim: 'Letter height per metre of legibility distance on road signs', range: [2.8, null], unit: 'mm per m', who: 'Drivers with normal vision, bold retroreflective letters', why: 'Signs are read in time at speed.', limits: 'Older drivers, night and rain need more; many words on a sign cannot be read in time at any size.', setting: ['vehicle', 'civil'], src: 'US Manual on Uniform Traffic Control Devices (legibility index 30 ft/in)' },
    { dim: 'Stroke width to character height', range: '1:6 – 1:10', unit: '', who: 'All readers; bolder for light-on-dark text and in dim light', why: 'Characters neither blur together nor break up.', limits: 'Too bold closes the counters of e, a and s at small sizes.', setting: ['all'], src: 'Sanders and McCormick, Human Factors in Engineering and Design' },
    { dim: 'Line length for continuous text', range: [45, 75], unit: 'characters', who: 'Readers of manuals, procedures and screens', why: 'The eye finds the next line easily and reads without strain.', limits: 'Labels and signs need far fewer words; narrow columns suit quick scanning.', setting: ['office', 'workshop', 'all'], src: 'R. Bringhurst, The Elements of Typographic Style' },
    { dim: 'Line spacing', range: [1.2, 1.5], unit: '× font size', who: 'Readers of continuous text, including people with low vision or dyslexia', why: 'Lines do not crowd, the eye returns to the right line.', limits: 'WCAG expects text to stay usable when readers set 1.5 or more.', setting: ['office', 'all'], src: 'Typographic practice; WCAG 2.1 (text spacing)' },
    { dim: 'Minimum area of a safety sign', range: '≥ L²/2000 (L up to about 50 m)', unit: '', who: 'People who must understand the sign from distance L', why: 'The sign\'s shape, colour and symbol are recognised in time.', limits: 'Poor light, clutter and older eyes need more; placement matters as much as size.', setting: ['workshop', 'civil', 'field'], src: 'Directive 92/58/EEC (safety signs at work)' },
    { dim: 'Symbol comprehension in user tests', range: [67, 85], unit: '% correct', who: 'Representative users, including people unfamiliar with the product', why: 'The symbol works without training for most people.', limits: 'Safety symbols at the upper end, with fewer than 5 % critical confusions; add words where mistakes matter.', setting: ['all'], src: 'ISO 9186-1; ANSI Z535.3' }
  ],
  applications: [
    'Machine labels and nameplates sized for the operator\'s working distance.',
    'Wayfinding signs in stations, hospitals and airports.',
    'Safety signs at loading bays, plant rooms and construction sites.',
    'Procedures and instruction handbooks written in plain language.'
  ],
  history: 'Road-sign lettering was developed by testing legibility distances with drivers in the mid-twentieth century; the Highway Gothic letters in the US and the Transport lettering designed by Jock Kinneir and Margaret Calvert for British roads in the late 1950s and 1960s came from that work. Safety-sign shapes and colours were harmonised internationally in ISO 3864, and a registered set of symbols followed in ISO 7010.',
  sources: [
    'ISO 3864-1, *Graphical symbols — Safety colours and safety signs — Part 1: Design principles for safety signs and safety markings*.',
    'ISO 7010, *Graphical symbols — Safety colours and safety signs — Registered safety signs*.',
    'ISO 9186-1, *Graphical symbols — Test methods — Part 1: Method for testing comprehensibility*.',
    'ANSI Z535 series, *Safety signs and colors* (Z535.3: criteria for safety symbols).',
    'Council Directive 92/58/EEC on the minimum requirements for the provision of safety and/or health signs at work.',
    'ISO 9241-303, *Ergonomics of human-system interaction — Requirements for electronic visual displays*.',
    '2010 ADA Standards for Accessible Design, section 703 (signs).',
    'M. S. Sanders and E. J. McCormick, *Human Factors in Engineering and Design* — alphanumeric displays and labels.'
  ],
  sim: 'mt-legibility'
},

{
  id: 'vehicle-seating', parent: 'vehicle-topic', title: 'Vehicle seats and the seating reference point', level: 2,
  short: 'A vehicle seat places the body where the eyes see the road, the feet reach the pedals and the hands reach the wheel — for small women and large men — and holds it there for hours while the vehicle shakes. Designers work from the H-point and the seating reference point, fore–aft travel of about 200–250 mm in cars, a backrest reclined about 20–30°, adjustable lumbar support, and suspension seats tuned to about 1.5–2 Hz to isolate the vibration the body feels most.',
  keywords: ['vehicle seat', 'driver seat', 'H-point', 'seating reference point', 'SgRP', 'SAE J826', 'SAE J1100', 'SAE J4004', 'ISO 6549', 'accelerator heel point', 'seat track', 'seat height', 'backrest angle', 'lumbar support', 'driving posture', 'head restraint', 'suspension seat', 'SEAT value', 'transmissibility', 'whole-body vibration', 'ISO 2631-1'],
  prereq: ['sitting-dimensions', 'office-chair', 'design-for-range'],
  related: ['driver-workspace', 'truck-bus-cabs', 'mobile-machines', 'whole-body-vibration', 'spinal-loading', 'cockpit-ergonomics', 'crew-stations', 'combining-percentiles', 'physics:driven-oscillations', 'physics:damped-oscillations'],
  body: `
A vehicle seat is not furniture. It places the body where the eyes can see the road, the feet reach the pedals and the hands reach the wheel — for everyone from a small woman to a large man — and then holds it there for hours while the vehicle brakes, corners and shakes.

### The reference points
Vehicle packaging starts from the **H-point**, the pivot between the torso and thigh of a standard manikin; the H-point machine of SAE J826 and ISO 6549 finds it in a real seat. The **seating reference point** (SgRP) is the designer's chosen H-point for the driver — usually the rearmost normal driving position — and the layout is measured from it and from the **accelerator heel point**, where the driver's heel rests: the seat height above the heel (called H30 in the SAE J1100 dimension code), the distance to the pedals, the eye positions (the "eyellipse" of SAE J941), head room and reach ([[driver-workspace]]).

| Vehicle | Seat height above the heel (typical, rounded) | Posture |
|---|---|---|
| Sports car | about 150–200 mm | legs stretched, strongly reclined |
| Saloon car | about 250–300 mm | legs forward, back reclined |
| SUV, van | about 300–400 mm | more upright |
| Truck, bus, tractor | about 400–500 mm or more | upright, close to an office chair |

### Fitting the range
Small drivers sit forward and high to reach the pedals and see over the bonnet; large drivers sit back and low for leg and head room. The fore–aft travel must cover the difference in effective leg length between the 5th-percentile woman and the 95th-percentile man — about 200–250 mm in cars; SAE J4004 gives a statistical model of where drivers of a given stature choose to sit. Seat height adjustment helps small drivers see out; a steering column that tilts and telescopes, and sometimes adjustable pedals, do the rest.

Driving-posture studies (for example Rebiffé, 1969; Porter and Gyi, 1998) report comfortable joint angles of roughly: knee 100–135°, trunk–thigh 95–120°, ankle 90–110°, with the backrest reclined about 20–30° from the vertical in cars and more upright in trucks and buses.

### The seat itself
- **Cushion length** no more than the buttock–popliteal length of small users — about 440 mm for the 5th-percentile woman — so the front edge clears the back of the knee; long-thighed drivers get an extendable cushion.
- **Cushion width** at least the hip breadth of large users plus clothing: about 480–500 mm (women's hips are the wider here).
- **Lumbar support** adjustable in depth and height, its peak roughly 150–250 mm above the compressed seat, as in office chairs ([[office-chair]]).
- **Head restraint** high and close enough to catch the head in a rear impact: its top at least 800 mm above the H-point and no more than 55 mm behind the head in the US rule for front seats.

### Vibration
Roads and terrain shake the seat base. A seat on a spring and damper is a driven oscillator ([[physics:driven-oscillations|driven oscillations]]): it amplifies near its natural frequency $f_n$ and isolates only above about [[?square-root|$\\sqrt{2}\\,f_n$]]. The seated body is most sensitive to vertical vibration around 4–8 Hz (ISO 2631-1). A foam seat alone resonates near 4 Hz — right in that band — so trucks, buses and off-road machines use **suspension seats** tuned to about 1.5–2 Hz. The **SEAT value** compares the frequency-weighted vibration on the seat with that on the floor: below 100 % the seat helps. A seat tuned for a truck's high-frequency road vibration can make a tractor's 2 Hz pitching worse, and a suspension that hits its end stops on rough ground adds shocks. Match the seat to the vehicle, adjust it to the driver's weight, and keep speeds and roads smooth ([[whole-body-vibration]]).

| Setting | Seat | What limits it |
|---|---|---|
| Cars | reclined, adjustable, lumbar support | fit and comfort over hours, crash protection |
| Trucks and buses | air suspension, upright, wide adjustment | long shifts, vibration, getting in and out ([[truck-bus-cabs]]) |
| Forklifts, earth-movers, tractors | suspension tuned to the machine, belts, swivel for reversing | whole-body vibration, twisting ([[mobile-machines]]) |
| Military vehicles | energy-absorbing seats, room for armour and kit | clearance with helmets and body armour ([[crew-stations]]) |

In the simulations, set a driver in the package and watch the seat move along its track; then put a seat on a vibrating floor and tune its suspension to the vehicle.

> [!warn] Long hours on a vibrating seat — tractors, earth-movers, off-road trucks — are linked with low back pain. Reduce the vibration at the source first, then with the seat; limit the daily exposure. Back pain that persists needs a doctor or physiotherapist.

> [!key] Fit the range with fore–aft travel, height and a tilting, telescoping wheel; size the cushion to small thighs and wide hips; support the lumbar spine; tune the suspension below the frequencies that matter.
`,
  ideas: [
    'The seating reference point and the accelerator heel point anchor the whole driver layout.',
    'Fore–aft travel of about 200–250 mm covers the 5th-percentile woman to the 95th-percentile man in cars.',
    'Comfortable driving postures have the knees at about 100–135° and the backrest reclined about 20–30°.',
    'A suspension seat amplifies near its natural frequency and isolates above about √2 times it; the body is most sensitive around 4–8 Hz.',
    'The SEAT value (seat ÷ floor vibration) shows whether a seat helps; seats must be matched to the vehicle.'
  ],
  pitfalls: [
    'A suspension seat always reduces vibration — It amplifies near its natural frequency and can bottom out; a seat tuned for trucks may make a tractor worse.',
    'A longer seat cushion is always more comfortable — It presses into the back of small drivers\' knees; long thighs need an adjustable extension instead.',
    'Upright is always better for the back — A moderate recline of about 20–30° with lumbar support lowers disc pressure while driving.'
  ],
  formulas: [
    {
      name: 'Transmissibility of a suspension seat',
      expr: 'T = sqrt((1 + (2*z*f/fn)^2)/((1 - (f/fn)^2)^2 + (2*z*f/fn)^2))', tex: 'T = \\sqrt{\\dfrac{1 + (2\\zeta r)^2}{(1 - r^2)^2 + (2\\zeta r)^2}}, \\quad r = \\dfrac{f}{f_n}',
      vars: {
        T: { name: 'transmissibility (seat ÷ floor)' },
        z: { name: 'damping ratio', value: 0.3, min: 0.01, max: 1, tex: '\\zeta' },
        f: { name: 'vibration frequency', q: 'frequency', unit: 'Hz', value: 4, min: 0.1, max: 30 },
        fn: { name: 'natural frequency of the seat', q: 'frequency', unit: 'Hz', value: 1.8, min: 0.5, max: 10, tex: 'f_n' }
      },
      note: 'A single-degree-of-freedom model of seat and person on a spring and damper. T > 1 amplifies (near f = fₙ), T < 1 isolates (above about 1.41 fₙ).',
      stories: { T: 'A seat with natural frequency {fn} and damping ratio {z} sits on a floor vibrating at {f}. What fraction of the vibration reaches the seat?' }
    },
    {
      name: 'SEAT value of a seat',
      expr: 'S = as/af', tex: '\\mathrm{SEAT} = \\dfrac{a_s}{a_f}',
      vars: {
        S: { name: 'seat effective amplitude transmissibility', q: 'ratio', unit: '%', tex: '\\mathrm{SEAT}' },
        as: { name: 'frequency-weighted acceleration on the seat', q: 'accel', unit: 'm/s²', value: 0.6, tex: 'a_s' },
        af: { name: 'frequency-weighted acceleration on the floor', q: 'accel', unit: 'm/s²', value: 0.8, tex: 'a_f' }
      },
      note: 'Below 100 % the seat reduces the vibration felt; above 100 % it amplifies it. Laboratory tests for machine seats: ISO 7096 (earth-moving), EN 13490 (industrial trucks).',
      stories: { S: 'The weighted vibration is {af} on the cab floor and {as} on the seat. What is the SEAT value?', as: 'A seat with a SEAT value of {S} sits on a floor vibrating at {af}. What reaches the driver?' }
    }
  ],
  examples: [
    {
      title: 'How much seat travel?',
      q: 'Estimate the difference in effective leg length between the 5th-percentile woman and the 95th-percentile man, using buttock–knee length plus knee height (representative data: women 580 ± 29 and 510 ± 26 mm; men 610 ± 30 and 555 ± 29 mm).',
      steps: [
        '5th-percentile woman: $(580 - 1.645 \\times 29) + (510 - 1.645 \\times 26) = 532 + 467 = 999$ mm.',
        '95th-percentile man: $(610 + 1.645 \\times 30) + (555 + 1.645 \\times 29) = 659 + 603 = 1262$ mm.',
        'Difference: 263 mm — an overestimate, because adding the percentiles of two dimensions exaggerates the spread ([[combining-percentiles]]). With the knees bent at driving angles, the hip-to-pedal distance changes by less: about 150–230 mm.',
        'Drivers of the same size also prefer different postures; SAE J4004 turns both effects into seat-track lengths, and a fitting trial checks them.'
      ],
      a: 'Roughly 150–230 mm for the body sizes alone; with posture preferences, the 200–250 mm of seat travel found in cars.'
    },
    {
      title: 'The right seat for the vehicle',
      q: 'A suspension seat has $f_n = 1.8$ Hz and damping ratio 0.3. What fraction of the vibration does it pass at 2 Hz (a tractor pitching), 4 Hz and 8 Hz (a forklift on a rough floor)?',
      steps: [
        '2 Hz: $r = 1.11$, $T = \\sqrt{(1 + 0.667^2)/((1 - 1.235)^2 + 0.667^2)} = \\sqrt{1.444/0.500} = 1.70$ — amplified by 70 %.',
        '4 Hz: $r = 2.22$, $T = \\sqrt{2.778/17.29} = 0.40$.',
        '8 Hz: $r = 4.44$, $T = \\sqrt{8.11/358.7} = 0.15$.',
        'Good for the forklift, bad for the tractor: a tractor needs a softer seat (lower $f_n$) or cab and axle suspension.'
      ],
      a: 'About 170 % at 2 Hz, 40 % at 4 Hz, 15 % at 8 Hz.'
    }
  ],
  quiz: [
    { q: 'A suspension seat with a natural frequency of 1.8 Hz is fitted to a vehicle whose floor shakes mainly at 1.8 Hz. What happens?', choices: ['The vibration is amplified — resonance', 'It is isolated', 'Nothing changes', 'It depends only on the cushion'], a: 0, why: 'At the natural frequency a lightly damped seat amplifies the motion; it isolates only above about 1.4 fₙ.' },
    { q: 'A seat\'s SEAT value is 120 %. What does it mean?', choices: ['The seat makes the vibration worse', 'The seat removes 20 % of the vibration', 'The seat is 20 % too soft', 'The exposure is 120 % of the limit'], a: 0, why: 'SEAT is seat ÷ floor weighted vibration: above 100 % the seat amplifies.' },
    { q: 'Which driver limits the most forward seat position?', choices: ['The smallest, who must reach the pedals', 'The largest, who needs leg room', 'The average driver', 'Nobody — it is set by crash tests'], a: 0, why: 'Reach to the pedals is limited by the shortest legs; the rearmost position by the longest.' },
    { q: 'True or false: at a frequency √2 times the natural frequency, a spring–damper seat transmits exactly the floor\'s vibration, whatever its damping.', a: true, why: 'All transmissibility curves cross T = 1 at r = √2; isolation starts above it.' },
    { q: 'Why should a fixed seat cushion not be longer than about 440 mm?', choices: ['Its front edge would press into the back of small drivers\' knees', 'It would not fit in the car', 'Crash rules forbid it', 'Large drivers would slide forward'], a: 0, why: 'The 5th-percentile woman\'s buttock–popliteal length is about 440 mm.' }
  ],
  problems: [
    { q: 'A seat has fₙ = 1.5 Hz and a damping ratio of 0.25. What transmissibility does it have at 6 Hz?', answer: 0.148, tol: 0.02, steps: ['$r = 4$, $2\\zeta r = 2$.', '$T = \\sqrt{(1 + 4)/((1 - 16)^2 + 4)} = \\sqrt{5/229} = 0.148$.'] },
    { q: 'The weighted vibration is 1.0 m/s² on a cab floor and 0.7 m/s² on the seat. What is the SEAT value?', answer: 70, unit: '%', tol: 0.01, steps: ['$\\mathrm{SEAT} = 0.7/1.0 = 70\\,\\%$.'] }
  ],
  ranges: [
    { dim: 'Fore–aft seat travel (cars)', range: [200, 250], unit: 'mm', who: '5th-percentile woman (forward) to 95th-percentile man (rearward)', why: 'Everyone reaches the pedals with the knees comfortably bent.', limits: 'Very tall and very short drivers, and pregnancy, need the extremes; the steering wheel and view must follow the seat.', setting: 'vehicle', src: 'SAE J4004; estimate from body dimensions' },
    { dim: 'Backrest angle from the vertical', range: [20, 30], unit: '°', who: 'Car drivers; trucks, buses and machines more upright', why: 'Lowers the load on the lumbar discs while keeping the view and reach.', limits: 'Too reclined and small drivers lose reach and view; upright cabs need stronger lumbar support.', setting: 'vehicle', src: 'Rebiffé (1969); Porter and Gyi (1998)' },
    { dim: 'Knee angle while driving', range: [100, 135], unit: '°', who: 'Drivers of all sizes, with the seat set for them', why: 'Pedals pressed without over-stretching or cramped knees.', limits: 'Clutch and brake travel need extra room at full depression.', setting: 'vehicle', src: 'Rebiffé (1969); Porter and Gyi (1998)' },
    { dim: 'Seat cushion length (fixed)', range: [null, 440], unit: 'mm', who: '5th-percentile woman\'s buttock–popliteal length (about 440 mm)', why: 'The front edge clears the back of the knee: no pressure on vessels and nerves.', limits: 'Tall drivers lack thigh support — add an adjustable extension.', setting: ['vehicle', 'military'], src: 'Body dimensions (ISO 7250-1 definitions); Pheasant and Haslegrave, Bodyspace' },
    { dim: 'Seat cushion width', range: [480, null], unit: 'mm', who: '95th-percentile woman\'s sitting hip breadth (about 450 mm) plus clothing', why: 'Wide hips fit without pressure from side bolsters.', limits: 'Winter clothing, body armour and tool belts add more; bolsters must still hold in corners.', setting: ['vehicle', 'military'], src: 'Body dimensions; Pheasant and Haslegrave, Bodyspace' },
    { dim: 'Head restraint: height above the H-point; gap behind the head', range: '≥ 800 mm; ≤ 55 mm', unit: '', who: 'Tall occupants in front seats', why: 'Catches the head early in a rear impact, reducing neck injury.', limits: 'Set it for each driver; a low or distant restraint lets the head whip back.', setting: 'vehicle', src: 'FMVSS No. 202a (US); UN Regulation No. 17 is similar' },
    { dim: 'Natural frequency of suspension seats', range: [1.5, 2], unit: 'Hz', who: 'Drivers of trucks, buses and off-road machines', why: 'Isolates the 4–8 Hz range where the seated body is most sensitive.', limits: 'Amplifies slow pitching (tractors, about 2 Hz); needs enough travel and adjustment to the driver\'s weight.', setting: ['vehicle', 'field', 'workshop'], src: 'M. J. Griffin, Handbook of Human Vibration; ISO 2631-1' }
  ],
  applications: [
    'Seat tracks, height adjusters and tilting, telescoping steering columns in cars.',
    'Air-suspension seats in trucks and buses, adjusted to the driver\'s weight.',
    'Suspension seats matched to forklifts, earth-movers and tractors, tested to ISO 7096 or EN 13490.',
    'Energy-absorbing crew seats in military vehicles.'
  ],
  history: 'The SAE H-point machine — a weighted manikin of shells and links — has been the industry\'s reference for seat geometry since the 1960s. Studies of drivers\' preferred postures, such as Rebiffé\'s in 1969, turned seat design from styling into measurement; suspension seats spread from tractors to trucks and buses as whole-body vibration came to be linked with back disorders.',
  sources: [
    'SAE J1100, *Motor vehicle dimensions*; SAE J826, *Devices for use in defining and measuring vehicle seating accommodation*.',
    'ISO 6549, *Road vehicles — Procedure for H- and R-point determination*.',
    'SAE J4004, *Positioning the H-point design tool — seating reference point and seat track length*; SAE J941, *Motor vehicle drivers\' eye locations*.',
    'ISO 2631-1, *Mechanical vibration and shock — Evaluation of human exposure to whole-body vibration — Part 1: General requirements*.',
    'M. J. Griffin, *Handbook of Human Vibration*, 1990.',
    'R. Rebiffé, "Le siège du conducteur: son adaptation aux exigences fonctionnelles et anthropométriques", *Ergonomics*, 1969.',
    'J. M. Porter and D. E. Gyi, "Exploring the optimum posture for driver comfort", *International Journal of Vehicle Design*, 1998.',
    'US FMVSS No. 202a, *Head restraints*.'
  ],
  sim: ['mt-driver-package', 'mt-seat-vibration']
},

{
  id: 'driver-workspace', parent: 'vehicle-topic', title: 'The driver\'s workspace', level: 2,
  short: 'Around the seat: pedals, wheel, hand controls, displays, mirrors and windows, all placed from where drivers\' eyes and hands really are. Controls within the reach of small drivers (about 670 mm forward), glances inside the car of no more than 2 s, direct vision over the bonnet and past the pillars, and mirrors and cameras for the blind zones that remain.',
  keywords: ['driver workspace', 'vehicle packaging', 'eyellipse', 'SAE J941', 'SAE J287', 'reach envelope', 'steering wheel', 'pedals', 'brake pedal force', 'glance', 'distraction', 'NHTSA guidelines', 'touchscreen', 'physical controls', 'A-pillar', 'UN R125', 'direct vision', 'blind spot', 'mirrors', 'UN R46', 'rear-view camera', 'FMVSS 111', 'down vision', 'up vision'],
  prereq: ['vehicle-seating', 'functional-reach', 'perception-attention'],
  related: ['truck-bus-cabs', 'mobile-machines', 'situation-awareness', 'controls-design', 'displays-design', 'hmi-screens', 'stereotypes-compatibility', 'information-design', 'field-computing', 'crew-stations'],
  body: `
Around the seat lies the workspace: pedals under the feet, a wheel in the hands, controls within reach, displays and mirrors within a glance, and windows onto the road. Each is placed relative to where drivers' eyes and hands actually are — and those differ by 20 cm and more between the smallest and the largest driver.

### Where eyes, heads and hands are
Packaging engineers use statistical tools built from measured drivers: the **eyellipse** (SAE J941) contains most drivers' eye positions for a seat layout; head contours set the roof; **reach envelopes** (SAE J287) show how far drivers reach with the shoulders on the backrest. Small drivers sit forward with their eyes low; tall drivers sit back with their eyes high and far back. Every view and control is checked at both ends ([[vehicle-seating]]).

### Seeing out directly
- **Down, over the bonnet**: the line of sight grazing the bonnet edge or window sill hides everything closer and lower. A small child close in front of a high bonnet or a truck cab can be completely hidden. The hidden distance follows from [[?proportional|similar triangles]]: a point of height $h$ becomes visible $x = L\\,(H_e - h)/(H_e - H_b)$ ahead of the eyes, for an edge at height $H_b$ a distance $L$ ahead.
- **Up, to signals**: the top of the windscreen limits the view of overhead traffic lights, worst for tall drivers in low cars.
- **Past the pillars**: the A-pillars, strong for roll-over protection, hide a sector of the scene. A pedestrian or cyclist on a collision course keeps a constant bearing — and can stay behind the pillar all the way to the junction. UN Regulation No. 125 limits each A-pillar's binocular obstruction to about 6°; drivers must still move their heads.
- **Behind**: rear visibility is poor in most vehicles, and back-over victims are mostly small children. Since 2018 the US has required a rear-view camera showing a zone about 3 m wide and 6 m long behind new light vehicles (FMVSS 111).

### Seeing out indirectly
UN Regulation No. 46 sets classes of mirrors — interior, main exterior, wide-angle, close-proximity and front — each with a field of view defined on the ground. Convex mirrors show more but make things look smaller and farther away; camera screens belong near the natural line of sight ([[truck-bus-cabs]]).

### Hands and feet
- **Hand controls used while driving** within the reach of the smallest drivers with their shoulders on the backrest: about 670 mm forward grip reach for the 5th-percentile woman (representative data), less to the side and downwards ([[functional-reach]]).
- **Steering wheel** adjustable for reach and tilt so that the elbows stay moderately bent and the top of the wheel does not hide the instruments. Airbags need room: US safety advice is to keep the breastbone at least about 25 cm (10 in) from the centre of the wheel — small drivers who sit forward to reach the pedals should push the wheel away.
- **Pedals** far enough apart for boots, with the brake reachable at full depression by short legs; full service braking in cars must need no more than 500 N on the pedal (UN Regulation No. 13-H).
- **Stereotypes**: controls that move in the direction of their effect, the same layout from car to car ([[stereotypes-compatibility]]).

### Glances and distraction
Every glance inside is road not seen: at 100 km/h a 2 s glance covers 56 m. The US guidelines for in-vehicle devices (NHTSA, 2013) ask that a task be possible in glances of no more than 2 s each and 12 s in total, and naturalistic-driving research found that glances away of more than about 2 s roughly doubled the risk of a crash or near crash. Touchscreens must be looked at; physical buttons can be found by touch — Euro NCAP has announced that it expects physical controls for basic functions such as indicators, hazard lights, horn and wipers ([[hmi-screens]]).

| Setting | Drivers and task | What the workspace adds |
|---|---|---|
| Private cars | anyone, short and long trips | full adjustment, controls by touch |
| Taxis and delivery vans | many hours, frequent getting in and out | low sill, durable seat, easy doors |
| Trucks and buses | professional drivers, long shifts | high eyes but big blind zones, mirrors, cameras ([[truck-bus-cabs]]) |
| Emergency vehicles | high speed, radios, screens | controls usable by touch, secured equipment |
| Military vehicles | helmets, armour, periscopes, night vision | clearance, compatible lighting ([[crew-stations]]) |

In the simulations, set a driver of any size in a car, an SUV or a truck and follow the sight lines over the bonnet and under the roof; then look down on the vehicle and drag a child around it to find the blind zones.

> [!warn] Before moving a vehicle with large blind zones — trucks, buses, vans, agricultural and construction machines — check that nobody is close in front, beside or behind; children and people bending down are the first to disappear.

> [!key] Place everything from real eye and hand positions of small and large drivers; keep glances short and controls findable by touch; design out blind zones first, then cover the rest with mirrors and cameras.
`,
  ideas: [
    'Eye positions (the eyellipse), head contours and reach envelopes from measured drivers anchor the layout.',
    'A high bonnet or window sill hides small children close in front; the hidden distance follows from similar triangles.',
    'A-pillars can hide a pedestrian or cyclist on a collision course all the way to a junction.',
    'Glances inside the vehicle should last no more than 2 s each and 12 s per task.',
    'Mirrors and cameras cover blind zones, but design for direct vision first.'
  ],
  pitfalls: [
    'If the mirrors are adjusted there is no blind spot — Every vehicle has zones that neither windows nor mirrors show, especially close to trucks, buses and vans.',
    'A touchscreen is as quick to use as buttons — It needs the eyes; buttons can be found and operated by touch.',
    'Tall drivers see everything — Their eyes sit high and far back: the roof, the mirror and the sun visor can hide traffic lights and the near kerb.'
  ],
  formulas: [
    {
      name: 'Where an object in front becomes visible over the bonnet',
      expr: 'x = L*(He - h)/(He - Hb)', tex: 'x = L\\,\\dfrac{H_e - h}{H_e - H_b}',
      vars: {
        x: { name: 'horizontal distance from the eyes beyond which the top of the object is visible', q: 'length', unit: 'm' },
        L: { name: 'horizontal distance from the eyes to the bonnet edge or window sill', q: 'length', unit: 'm', value: 0.85 },
        He: { name: 'eye height above the road', q: 'length', unit: 'm', value: 2.35, tex: 'H_e' },
        h: { name: 'height of the object (a small child about 1.0 m)', q: 'length', unit: 'm', value: 1.0 },
        Hb: { name: 'height of the bonnet edge or window sill', q: 'length', unit: 'm', value: 1.95, tex: 'H_b' }
      },
      note: 'Similar triangles along the line of sight that grazes the edge. Subtract the distance from the eyes to the vehicle front to get the hidden zone in front of the vehicle.',
      stories: { x: 'A truck driver\'s eyes are {He} above the road; the lower window edge is {Hb} high and {L} ahead of the eyes. Beyond what distance from the eyes does a child {h} tall become visible?', Hb: 'Eyes at {He}; a child {h} tall must be visible from {x} ahead of the eyes. How low must an edge {L} ahead be?' }
    },
    {
      name: 'Binocular obstruction of a pillar',
      expr: 'phi = 2*atan((w - s)/(2*d))', tex: '\\varphi = 2\\arctan\\dfrac{w - s}{2d}',
      vars: {
        phi: { name: 'angle hidden from both eyes', q: 'angle', unit: '°', tex: '\\varphi' },
        w: { name: 'pillar width seen by the driver', q: 'length', unit: 'mm', value: 110 },
        s: { name: 'distance between the eyes', q: 'length', unit: 'mm', value: 65 },
        d: { name: 'distance from the eyes to the pillar', q: 'length', unit: 'mm', value: 700 }
      },
      note: 'An approximation: each eye sees round one side of the pillar, so only a width w − s is hidden from both. UN R125 limits it to about 6° per A-pillar.',
      stories: { phi: 'An A-pillar {w} wide is {d} from the eyes; the eyes are {s} apart. What angle does it hide from both eyes?', w: 'To keep the obstruction to {phi} at {d}, how wide may the pillar be?' }
    }
  ],
  examples: [
    {
      title: 'A child in front of a truck',
      q: 'A truck driver\'s eyes are 2.35 m above the road; the lower edge of the windscreen is 1.95 m high and 0.85 m ahead of the eyes; the cab front is 0.9 m ahead of the eyes. How close can a child 1.0 m tall stand in front of the cab without being seen?',
      steps: [
        '$x = 0.85 \\times (2.35 - 1.0)/(2.35 - 1.95) = 0.85 \\times 3.375 = 2.87$ m ahead of the eyes.',
        'Minus 0.9 m to the cab front: the child is hidden anywhere within about 2.0 m of the front.',
        'A lower window edge (a low-entry cab with a glass lower panel) or a front mirror or camera closes the zone.'
      ],
      a: 'Hidden up to about 2 m in front of the cab.'
    },
    {
      title: 'What an A-pillar hides',
      q: 'An A-pillar 110 mm wide sits 700 mm from the driver\'s eyes (eyes 65 mm apart). What angle does it hide, and how wide a band at 15 m?',
      steps: [
        '$\\varphi = 2 \\arctan(45/1400) = 2 \\times 1.84° = 3.7°$.',
        'At 15 m: $15 \\times \\tan 3.7° = 0.97$ m — wide enough to hide a pedestrian or a cyclist.',
        'On a collision course the bearing does not change, so the person can stay hidden until the last seconds; drivers must move their heads.'
      ],
      a: 'About 3.7°, a band about 1 m wide at 15 m.'
    }
  ],
  quiz: [
    { q: 'What do the US in-vehicle distraction guidelines ask of a single glance at a device?', choices: ['No more than 2 s', 'No more than 10 s', 'No more than 0.1 s', 'No limit if the car is on a straight road'], a: 0, why: 'Glances longer than about 2 s sharply raise crash risk; total eyes-off-road time per task is limited to 12 s.' },
    { q: 'Why can a cyclist approaching a junction stay hidden behind an A-pillar?', choices: ['On a collision course the bearing stays constant, so the cyclist stays in the same sector', 'Cyclists are too small to see', 'Pillars are transparent', 'Mirrors cover the pillar'], a: 0, why: 'Two road users on a collision course keep a constant angle to each other; the pillar hides that angle all the way.' },
    { q: 'How far does a car at 90 km/h travel during a 2 s glance at a screen?', answer: 50, unit: 'm', why: '90 km/h = 25 m/s; 25 × 2 = 50 m.' },
    { q: 'True or false: a truck driver sitting high sees small children close in front of the cab better than a car driver would in front of a car.', a: false, why: 'The high eye position and window sill hide everything close and low in front of the cab — often a zone of 1–2 m.' },
    { q: 'Which driver limits the placement of hand controls used while driving?', choices: ['The smallest, with shoulders against the backrest', 'The largest', 'The average', 'The front passenger'], a: 0, why: 'Reach is limited by the shortest arms; if they can reach, everyone can.' }
  ],
  problems: [
    { q: 'An SUV driver\'s eyes are 1.45 m above the road; the bonnet edge is 1.10 m high and 2.0 m ahead of the eyes. Beyond what distance from the eyes does the top of a 1.0 m child become visible?', answer: 2.57, unit: 'm', tol: 0.01, steps: ['$x = 2.0 \\times (1.45 - 1.0)/(1.45 - 1.10) = 2.0 \\times 1.286 = 2.57$ m — just beyond the bonnet edge.'] },
    { q: 'A pillar 90 mm wide is 650 mm from the eyes, which are 65 mm apart. What angle does it hide from both eyes?', answer: 2.2, unit: '°', tol: 0.02, steps: ['$\\varphi = 2 \\arctan(25/1300) = 2 \\times 1.10° = 2.2°$.'] }
  ],
  ranges: [
    { dim: 'Single glance away from the road at an in-vehicle device', range: [null, 2], unit: 's', who: 'Drivers of all ages, including older drivers who glance longer', why: 'Keeps the unseen road short; longer glances sharply raise crash risk.', limits: 'Tasks that need many glances are unsafe even if each is short: limit the total.', setting: 'vehicle', src: 'NHTSA Visual-Manual Driver Distraction Guidelines (2013)' },
    { dim: 'Total eyes-off-road time for one task on an in-vehicle device', range: [null, 12], unit: 's', who: 'Drivers doing tasks while moving', why: 'Limits the time spent looking away for any one task.', limits: 'Lock out long tasks while moving; voice control still loads the mind.', setting: 'vehicle', src: 'NHTSA Visual-Manual Driver Distraction Guidelines (2013)' },
    { dim: 'Forward reach to hand controls used while driving', range: [null, 670], unit: 'mm', who: '5th-percentile woman\'s forward grip reach, shoulders against the backrest (representative data)', why: 'Every driver reaches the controls without leaning out of the seat and belt.', limits: 'Less reach to the sides and downwards; seat belts and thick clothing reduce it further.', setting: ['vehicle', 'military'], src: 'SAE J287 (reach envelopes); body dimensions' },
    { dim: 'Binocular obstruction by each A-pillar', range: [null, 6], unit: '°', who: 'Drivers at the design eye points', why: 'Limits the sector a pedestrian or cyclist can hide in.', limits: 'Thick pillars for roll-over strength conflict with vision; drivers must still move their heads.', setting: 'vehicle', src: 'UN Regulation No. 125' },
    { dim: 'Area shown by a rear-view camera behind a light vehicle', range: 'about 3.0 m wide × 6.1 m long (10 × 20 ft)', unit: '', who: 'Small children and people bending down behind a reversing vehicle', why: 'Shows the zone where back-over victims are found.', limits: 'A camera helps only if looked at; add sensors and automatic braking for reversing.', setting: ['vehicle', 'civil'], src: 'US FMVSS No. 111' },
    { dim: 'Breastbone to the centre of the steering wheel (airbag)', range: [250, null], unit: 'mm', who: 'Small drivers who sit forward to reach the pedals', why: 'Keeps the chest out of the zone where a deploying airbag strikes hardest.', limits: 'Needs a telescopic column or adjustable pedals for the smallest drivers; children belong in the back seat.', setting: 'vehicle', src: 'NHTSA advice on air bags (10 in)' },
    { dim: 'Brake pedal force for full service braking (cars)', range: [null, 500], unit: 'N', who: 'Drivers with the leg strength of small, older people', why: 'Everyone can brake fully in an emergency.', limits: 'Power assistance can fail; heavy vehicles use air brakes with small pedal forces.', setting: 'vehicle', src: 'UN Regulation No. 13-H' }
  ],
  applications: [
    'Vehicle packaging with eyellipses, head contours and reach envelopes.',
    'Low-bonnet and glass-panel designs that shrink the blind zone in front.',
    'Rear-view cameras, parking sensors and automatic reversing brakes.',
    'In-vehicle screens designed and tested against glance limits before release.'
  ],
  history: 'The eyellipse and reach envelopes were developed by the motor industry and the SAE from measurements of drivers in the 1960s. Distraction research grew with car phones and navigation screens; the US guidelines for in-vehicle devices followed naturalistic-driving studies that filmed ordinary drivers for months.',
  sources: [
    'SAE J941, *Motor vehicle drivers\' eye locations*; SAE J287, *Driver hand control reach*; SAE J1100, *Motor vehicle dimensions*.',
    'UN Regulation No. 125, *Forward field of vision of motor vehicle drivers*; UN Regulation No. 46, *Devices for indirect vision*.',
    'NHTSA, *Visual-Manual NHTSA Driver Distraction Guidelines for In-Vehicle Electronic Devices*, 2013.',
    'S. G. Klauer et al., *The impact of driver inattention on near-crash/crash risk: an analysis using the 100-Car Naturalistic Driving Study data*, NHTSA, 2006.',
    'US FMVSS No. 111, *Rear visibility*; UN Regulation No. 13-H, *Braking of passenger cars*.',
    'Pheasant and Haslegrave, *Bodyspace* — vehicle workspaces.'
  ],
  sim: ['mt-driver-package', 'mt-blind-zones']
},

{
  id: 'cockpit-ergonomics', parent: 'vehicle-topic', title: 'Aircraft cockpits', level: 2,
  short: 'The flight deck is where modern ergonomics was born. Pilots adjust their seats to put their eyes at the design eye position, from which the view over the nose and every primary display were laid out; controls fit crews from 1.57 to 1.91 m tall in transport aircraft; levers are shape-coded; alerts are graded red and amber; the cockpit stays dark when all is well; and automation modes, checklists and crew procedures manage the workload peaks.',
  keywords: ['cockpit', 'flight deck', 'design eye position', 'eye reference point', 'over-the-nose vision', 'basic T', 'shape coding', 'Chapanis', 'pilot error', 'flight crew alerting', 'master warning', 'master caution', 'dark cockpit', 'glass cockpit', 'mode awareness', '14 CFR 25.1302', '25.777', 'control forces', 'sterile flight deck', 'g tolerance', 'helmet-mounted display'],
  prereq: ['driver-workspace', 'displays-design', 'situation-awareness'],
  related: ['controls-design', 'stereotypes-compatibility', 'alarms-warnings', 'mental-workload', 'decisions-stress', 'human-error', 'crew-stations', 'military-human-factors', 'aerodynamics:load-factor', 'aerodynamics:takeoff-landing'],
  body: `
The aircraft cockpit — the flight deck — is the workstation on which modern ergonomics was born. In the Second World War many "pilot error" accidents turned out to be design errors: look-alike levers side by side, instruments that were easy to misread. Today a transport aircraft's flight deck is certified against explicit human-factors rules, and its lessons — fit the range, code the controls, grade the alerts, keep the crew in the loop — carry over to every vehicle.

### The design eye position
The flight deck is laid out from one point in space, the **design eye position**: from it the pilot must see out — over the nose on approach, to the sides in turns — and see every primary display without moving the head. Pilots of every size adjust the seat up, down, fore and aft until their eyes are at that point (many airliners have a small sighting device on the centre windscreen post to help), then set the rudder pedals to their legs. The US and European rules for transport aircraft (14 CFR and CS 25.777) require each control to be fully usable by crew members from 1.57 to 1.91 m (5 ft 2 in to 6 ft 3 in) tall. Military cockpits define their own ranges of stature, sitting height, reach and body mass, with helmets, survival equipment and ejection seats.

### Seeing out
Design guidance for transport aircraft (FAA AC 25.773-1, SAE AS580) sets minimum angles of vision from the design eye position. The most critical is **over the nose**, of the order of 15–20° down straight ahead: on a low approach the ground hidden below the nose — the *obscured segment* — must leave enough approach and runway lights in view to land,

$$d = \\frac{h}{\\tan(\\theta - p)}$$

for a height $h$, an over-nose angle $\\theta$ and a nose-up pitch attitude $p$ (the [[?sine-cosine|tangent]] turns the angle into a slope). A pilot who sits too low has a smaller angle and sees fewer lights — the reason for aligning the eyes before flight (see the simulation).

### Displays and controls
Since the 1950s primary flight instruments have followed the **basic T**: attitude in the centre, airspeed to the left, altitude to the right, heading below — so the scan is the same in every aircraft. Glass cockpits keep that layout on screens and add what supports understanding and projection: speed trends, margins to stall and overspeed, predicted flight paths ([[situation-awareness]]). Controls follow the stereotypes (pull back, nose up; thrust levers forward, more power), are **shape-coded** — a wheel-shaped landing-gear lever, a flap-shaped flap lever, Alphonse Chapanis's cure for the gear–flap confusions — and critical switches are guarded. Control forces are limited too: in the US transport rules, 75 lbf (334 N) for a short pull or push on the pitch control with two hands and 10 lbf (44 N) held for long.

### Alerts and the dark cockpit
Alerts are graded: red **warnings** need immediate action, amber **cautions** need awareness and later action, advisories inform (14 CFR 25.1322). Master warning and caution lights sit in front of each pilot. In a **dark cockpit** nothing is lit when all is normal, so any light means something. Floods of consequential alerts overwhelm crews; alerting systems suppress and prioritise them ([[alarms-warnings]]).

### Automation, crews and workload
Autopilots and flight-management systems remove routine work but bring **mode awareness** problems: the crew must know what the automation is doing and will do next. Flight-mode annunciators, call-outs and the division of work between the pilot flying and the pilot monitoring keep people in the loop. Crew resource management and the **sterile flight deck** — only essential talk during taxi, take-off, landing and below 10 000 ft (14 CFR 121.542) — protect the workload peaks ([[mental-workload]], [[decisions-stress]]). Since 2013 the US rule 14 CFR 25.1302 has required installed flight-deck equipment to be shown usable by the crew, error-tolerant and free of hidden modes.

### Military cockpits
Fighters add g-forces ([[aerodynamics:load-factor|load factor]]). Under sustained head-to-foot acceleration the pressure needed to lift blood from the heart to the eyes is $\\Delta p = \\rho\\,g\\,n\\,h$; when it approaches the pressure at the heart, vision greys out first, at around 4–5 g for a relaxed person. Reclined seats (30° in the F-16) shorten $h$; anti-g suits and straining raise tolerance further. Helmet-mounted displays and night-vision goggles load the neck — a real limit for smaller, lighter pilots ([[crew-stations]]).

| Setting | Particular demands |
|---|---|
| Airliners | two crew, automation modes, certified alerting |
| General aviation | single pilot, varied training, weather |
| Helicopters | vibration, low flying, hover workload |
| Military jets | g-forces, helmets, ejection seats, night vision |
| Air traffic and drones | the "cockpit" is a control room ([[control-rooms]]) |

> [!key] Lay the flight deck out from a design eye position that every pilot can reach; code controls by shape and stereotype; grade alerts and keep the deck dark when all is normal; design automation that shows its modes.
`,
  ideas: [
    'Pilots adjust the seat to put their eyes at the design eye position, from which the views and displays were laid out.',
    'Transport-aircraft controls must suit crew members from 1.57 to 1.91 m tall (14 CFR and CS 25.777).',
    'The basic T, shape-coded levers and control stereotypes make every flight deck read and work alike.',
    'Alerts are graded — red warning, amber caution — and the cockpit stays dark when all is normal.',
    'Automation needs mode awareness; crew procedures and the sterile flight deck protect the workload peaks.'
  ],
  pitfalls: [
    'Pilot error means a careless pilot — Studies since 1947 found that most "pilot errors" were invited by the design of controls and displays.',
    'A seat position that is comfortable is good enough — If the eyes are below the design eye position, the view over the nose on approach shrinks.',
    'More alerts make a safer flight deck — Floods of alerts overwhelm crews; alerts must be graded, prioritised and suppressed when consequential.'
  ],
  formulas: [
    {
      name: 'Ground hidden below the nose on approach',
      expr: 'd = h/tan(theta - p)', tex: 'd = \\dfrac{h}{\\tan(\\theta - p)}',
      vars: {
        d: { name: 'obscured segment: ground hidden ahead of the eyes', q: 'length', unit: 'm' },
        h: { name: 'height of the eyes above the runway', q: 'length', unit: 'm', value: 60 },
        theta: { name: 'over-the-nose vision angle below the aircraft\'s horizontal datum', q: 'angle', unit: '°', value: 17, min: 5, max: 40, tex: '\\theta' },
        p: { name: 'nose-up pitch attitude on approach', q: 'angle', unit: '°', value: 3, min: -5, max: 15, signed: true }
      },
      note: 'Flat ground, straight ahead. Everything nearer than d is hidden by the nose; everything farther is visible (in good visibility).',
      stories: { d: 'At {h} above the runway, with an over-nose angle of {theta} and a pitch attitude of {p}, how much ground ahead is hidden below the nose?', theta: 'To see the ground from {d} ahead at {h} with a pitch of {p}, what over-nose angle is needed?' }
    },
    {
      name: 'Blood-pressure difference from heart to eyes under g',
      expr: 'dp = rho*g*n*h', tex: '\\Delta p = \\rho\\,g\\,n\\,h',
      vars: {
        dp: { name: 'pressure needed to lift blood from heart to eye level', q: 'pressure', unit: 'mmHg', tex: '\\Delta p' },
        rho: { name: 'density of blood', q: 'density', unit: 'kg/m³', value: 1060, tex: '\\rho' },
        g: { const: 'g' },
        n: { name: 'load factor (head-to-foot g)', value: 4.5, min: 0, max: 12 },
        h: { name: 'vertical distance from heart to eyes', q: 'length', unit: 'm', value: 0.3 }
      },
      note: 'When Δp approaches the mean arterial pressure at the heart (roughly 90–100 mmHg at rest), blood flow to the eyes fails first. Reclining the seat shortens h; anti-g suits and straining raise the pressure at the heart.',
      stories: { dp: 'At {n} g, with the eyes {h} above the heart, what pressure is needed to keep blood reaching the eyes?', n: 'The heart can supply {dp} of pressure difference to the eyes {h} above it. At what load factor does that run out?' }
    }
  ],
  examples: [
    {
      title: 'Sitting too low on approach',
      q: 'From the design eye position the over-nose angle is 17°. At 60 m above the runway with a 3° nose-up attitude, how much ground is hidden? A pilot who sits 60 mm too low, with the nose edge 0.9 m ahead, loses about 3.6° of that angle. How much is hidden then?',
      steps: [
        'Design eye: $d = 60/\\tan(17° - 3°) = 60/0.249 = 241$ m.',
        'Too low: $\\theta \\approx 17° - 3.6° = 13.4°$; $d = 60/\\tan 10.4° = 60/0.184 = 327$ m.',
        'About 86 m more of the approach lights is hidden — at 70 m/s, more than a second less of the visual cues needed to land.'
      ],
      a: 'About 241 m hidden from the design eye position, about 327 m from 60 mm too low.'
    },
    {
      title: 'Why fighter seats recline',
      q: 'The eyes are 0.30 m above the heart when sitting upright. What pressure difference is needed at 5 g? What if the seat back is reclined 30°, putting the eyes only 0.26 m above the heart?',
      steps: [
        'Upright: $\\Delta p = 1060 \\times 9.81 \\times 5 \\times 0.30 = 15\\,600$ Pa = 117 mmHg — more than the heart supplies at rest: vision greys out.',
        'Reclined: $1060 \\times 9.81 \\times 5 \\times 0.26 = 13\\,500$ Pa = 101 mmHg — about 13 % less.',
        'Put the other way, the same pressure now supports about 15 % more g ($0.30/0.26 = 1.15$); anti-g suits and straining add more.'
      ],
      a: 'About 117 mmHg upright, 101 mmHg reclined.'
    }
  ],
  quiz: [
    { q: 'What should a pilot do with the seat before flight?', choices: ['Adjust it so the eyes are at the design eye position', 'Set it to the most comfortable height', 'Leave it as the previous pilot set it', 'Lower it fully for head room'], a: 0, why: 'The views out and the displays were laid out from that point; sitting low shrinks the view over the nose.' },
    { q: 'An amber light comes on at the top of the panel. What does it signal in the usual alerting scheme?', choices: ['A caution: awareness now, action later', 'A warning: immediate action', 'Normal operation', 'An advisory only'], a: 0, why: 'Red is a warning needing immediate action; amber a caution; other colours advisories and status.' },
    { q: 'Why is the landing-gear lever shaped like a wheel?', choices: ['Shape coding so it cannot be confused with the flap lever by touch', 'Decoration', 'To make it stronger', 'Regulations require round knobs'], a: 0, why: 'Chapanis\'s shape coding cured gear–flap confusions found in wartime accident studies.' },
    { q: 'At 4 g, with the eyes 0.3 m above the heart, what pressure difference is needed (ρ = 1060 kg/m³)?', answer: 93.6, unit: 'mmHg', why: '1060 × 9.81 × 4 × 0.3 = 12 478 Pa = 93.6 mmHg.' },
    { q: 'True or false: in a dark cockpit, every light that is on means something needs attention or is in a non-normal state.', a: true, why: 'With nothing lit in normal operation, any light stands out.' }
  ],
  problems: [
    { q: 'At 30 m above the runway, with an over-nose angle of 15° and a 4° nose-up attitude, how much ground ahead is hidden?', answer: 154, unit: 'm', tol: 0.01, steps: ['$d = 30/\\tan(11°) = 30/0.194 = 154$ m.'] },
    { q: 'What pressure difference (in mmHg) is needed at 6 g if the eyes are 0.25 m above the heart (ρ = 1060 kg/m³)?', answer: 117, unit: 'mmHg', tol: 0.01, steps: ['$\\Delta p = 1060 \\times 9.81 \\times 6 \\times 0.25 = 15\\,600$ Pa.', '15 600 Pa / 133.3 = 117 mmHg.'] }
  ],
  ranges: [
    { dim: 'Crew stature for full use of every control (transport aircraft)', range: [1575, 1905], unit: 'mm', who: 'Flight crew from 5 ft 2 in to 6 ft 3 in tall', why: 'Every pilot in that range can reach and move each control fully from the adjusted seat.', limits: 'Covers most but not all adults; smaller or taller pilots need checks, cushions or pedal extensions; military ranges differ.', setting: ['vehicle', 'military'], src: '14 CFR 25.777; EASA CS 25.777' },
    { dim: 'Over-the-nose vision from the design eye position, straight ahead', range: 'of the order of 15–20° below the horizontal', unit: '', who: 'Pilots with their eyes at the design eye position', why: 'Enough approach and runway lights in view on a low approach.', limits: 'Lost if the pilot sits low; pitch attitude and wet windscreens reduce it further.', setting: 'vehicle', src: 'FAA AC 25.773-1; SAE AS580' },
    { dim: 'Short-term pitch control force, two hands (transport aircraft)', range: [null, 334], unit: 'N', who: 'Pilots of small stature and strength', why: 'Every pilot can recover the aircraft briefly by hand.', limits: 'One hand: 50 lbf (222 N); roll and yaw have their own limits.', setting: 'vehicle', src: '14 CFR 25.143' },
    { dim: 'Prolonged pitch control force (transport aircraft)', range: [null, 44], unit: 'N', who: 'Pilots holding a force for a long time', why: 'Holding it does not tire the pilot.', limits: 'Trim systems must remove steady forces.', setting: 'vehicle', src: '14 CFR 25.143' },
    { dim: 'Altitude below which only essential talk is allowed (sterile flight deck)', range: [null, 10000], unit: 'ft (about 3050 m)', who: 'Airline crews during taxi, take-off, landing and flight below 10 000 ft', why: 'Protects the busiest, most critical phases from distraction.', limits: 'Cruise below 10 000 ft is excepted; the principle suits any critical phase of any job.', setting: 'vehicle', src: '14 CFR 121.542' }
  ],
  applications: [
    'Eye-alignment sights and adjustable seats and pedals in airliners.',
    'Shape-coded levers and guarded switches on every flight deck.',
    'Graded alerting with master warning and caution lights, and the dark-cockpit philosophy.',
    'Reclined seats, anti-g suits and helmet-mass limits in fighters.'
  ],
  history: 'In 1947 Paul Fitts and Richard Jones analysed hundreds of "pilot-error" reports and found that confusing controls and instruments caused many of them. Alphonse Chapanis introduced shape-coded knobs for landing gear and flaps. The basic T was standardised in the 1950s; glass cockpits arrived in the 1980s, bringing mode-awareness problems that led, in 2013, to the human-factors rule 14 CFR 25.1302.',
  sources: [
    '14 CFR Part 25 and EASA CS-25 (§ 25.143 control forces, 25.773 pilot compartment view, 25.777 cockpit controls, 25.1302 installed systems for use by the flight crew, 25.1322 flight crew alerting).',
    'FAA Advisory Circular AC 25.773-1, *Pilot compartment view design considerations*; FAA AC 25.1322-1, *Flightcrew alerting*.',
    '14 CFR 121.542, *Flight crewmember duties* (the sterile flight deck rule).',
    'P. M. Fitts and R. E. Jones, *Analysis of factors contributing to 460 "pilot-error" experiences in operating aircraft controls*, 1947.',
    'D. Harris, *Human Performance on the Flight Deck*, 2011.',
    'MIL-STD-1472, *Human Engineering* (US Department of Defense) — crew stations.'
  ],
  sim: 'mt-cockpit'
},

{
  id: 'truck-bus-cabs', parent: 'vehicle-topic', title: 'Truck and bus cabs', level: 2,
  short: 'A truck or bus cab is a workplace for eight to ten hours a day. Drivers climb in and out dozens of times (steps with equal risers, the first no higher than about 600 mm, grab handles on both sides for three points of contact), sit on air-suspension seats, watch up to six mirrors and several screens, and must see the pedestrians and cyclists close to the cab. Driving-time rules limit the fatigue.',
  keywords: ['truck cab', 'bus driver workplace', 'ISO 16121', 'cab access', 'steps', 'grab handles', 'three points of contact', 'first step height', 'jumping from the cab', 'mirror classes', 'UN R46', 'close-proximity mirror', 'front mirror', 'blind spot information system', 'UN R151', 'moving off information system', 'UN R159', 'direct vision', 'low-entry cab', 'driving time', 'Regulation 561/2006', 'hours of service'],
  prereq: ['driver-workspace', 'vehicle-seating', 'stairs-ergonomics'],
  related: ['mobile-machines', 'public-transport', 'whole-body-vibration', 'fatigue-rest-breaks', 'shift-work', 'situation-awareness', 'decisions-stress', 'working-at-height', 'crew-stations'],
  body: `
A truck or bus cab is a workplace for eight to ten hours a day and, for long-distance drivers, a home for days at a time. The driver climbs in and out many times a shift — dozens of times on delivery and refuse rounds — sits on a vibrating seat for hours, and controls a vehicle that can kill a pedestrian it cannot see.

### Getting in and out
Falls from cabs, steps and trailers — often a slip from a step or a jump down — are among the commonest injuries of truck drivers. The cures are geometric:

| Element | Recommendation | Limited by |
|---|---|---|
| First step above the ground | as low as practical; at most about 600 mm (US rule for commercial vehicles: 24 in, 610 mm) | the step-up of small and older drivers |
| Further steps | equal risers of about 250–400 mm, each tread deep enough for a booted foot, set so the shin clears the step above | a regular rhythm; mud, snow and ice |
| Grab handles | on both sides of the door, the lowest grip reachable from the ground by small users (at most about 1.5 m), running up past the cab floor; 25–40 mm thick with room for a gloved hand | the 5th-percentile woman's reach; gloves |
| Use | three points of contact — two hands and a foot, or two feet and a hand — facing the cab, never jumping | haste, carrying things |

Jumping down from a cab floor 1.3 m up lands at $v = \\sqrt{2gh} \\approx 5$ m/s (the speed grows with the [[?square-root|square root]] of the height, the energy with the height itself); from a last step of 0.45 m at 3 m/s — a third of the energy. In the simulation, climb a high cab, a low-entry cab, a low-floor bus and a wheel loader with people of different sizes.

### The seat, the wheel and the controls
Trucks and buses sit their drivers upright on air-suspension seats with wide fore–aft, height and weight adjustment ([[vehicle-seating]]); the steering wheel lies flatter than in a car and tilts and telescopes. For city buses ISO 16121 sets ergonomic requirements for the whole driver's workplace — seat, steering, pedals, controls, view, climate and the driver's protective screen — so that one specification fits the range of drivers an operator employs.

### Seeing round the vehicle
A high cab puts the eyes about 2.3–2.5 m above the road: far view is excellent, but the zone close in front of the cab and along the passenger side can hide a child, a cyclist or even a crouching adult ([[driver-workspace]]). The defences, in order:
1. **Direct vision** — low-entry cabs with the eyes lower and glass down to knee height in the passenger door. London's Direct Vision Standard rates trucks by how much of the surrounding space the driver sees directly, and the EU's General Safety Regulation (2019/2144) adds direct-vision requirements for new truck designs.
2. **Mirrors** — UN Regulation No. 46 requires main, wide-angle, close-proximity and front mirrors on heavy goods vehicles: up to six mirrors to scan, each shrinking what it shows.
3. **Cameras and detection** — blind-spot information systems for turning (UN R151) and moving-off information systems that detect people in front of a stationary vehicle (UN R159), now required on new trucks and buses in the EU.

### Hours and fatigue
Professional driving is long, monotonous and often at night ([[decisions-stress]], [[shift-work]]). In the EU (Regulation (EC) No 561/2006) a driver may drive at most 4.5 h before a break of at least 45 min, normally at most 9 h a day (10 h twice a week) and 56 h a week. In the US the hours-of-service rules let property-carrying drivers drive up to 11 h within a 14 h window after 10 h off duty, with a 30 min break after 8 h of driving. Sleeper cabs make rest possible; rules on paper do not make it restful.

| Vehicle | Particular demands |
|---|---|
| Long-haul truck | long hours, nights, sleeping in the cab, whole-body vibration |
| Urban delivery truck or van | many entries and exits a day, loading, cyclists and pedestrians close by |
| Refuse truck | a crew climbing in and out constantly; low-entry cabs |
| City bus | frequent stops, passengers, door mirrors, conflict at the ticket desk |
| Coach | long journeys, night driving, luggage |
| Military truck | high cabs, armour, helmets, rough terrain ([[crew-stations]]) |

> [!warn] Never jump down from a cab or a load bed: climb down facing the cab with three points of contact. Keep steps clean and replace broken handholds.

> [!key] Design access with low, equal steps and handholds reachable by the smallest users; design the cab for direct vision first, then mirrors and detection; and plan hours so that drivers can rest.
`,
  ideas: [
    'Falls getting in and out of cabs are a leading injury of drivers; low, equal steps and long handholds prevent them.',
    'Three points of contact, facing the cab, and never jumping down.',
    'High cabs give far view but hide people close to the front and passenger side; low-entry cabs and glass lower panels restore direct vision.',
    'Mirrors, cameras and detection systems (UN R46, R151, R159) cover what the windows cannot.',
    'Driving-time rules (EU: 4.5 h before a 45 min break; 9 h a day) limit fatigue.'
  ],
  pitfalls: [
    'Six mirrors mean the driver can see everything — Each mirror must be looked at, shows a shrunken image and leaves gaps; direct vision is faster and surer.',
    'Jumping from the cab is quicker and harmless — Landing from 1.3 m at about 5 m/s loads the knees and ankles hard, and a slip on a wet step is the classic fall.',
    'A driver who feels fine can keep driving — Fatigue impairs judgement of fatigue itself; the hour limits exist for that reason.'
  ],
  formulas: [
    {
      name: 'Equal risers from the ground to the cab floor',
      expr: 'r = H/n', tex: 'r = \\dfrac{H}{n}',
      vars: {
        r: { name: 'height of each riser (the first step included)', q: 'length', unit: 'mm' },
        H: { name: 'cab floor height above the ground', q: 'length', unit: 'mm', value: 1350 },
        n: { name: 'number of risers (steps plus the step onto the floor)', q: 'count', value: 4, int: true }
      },
      note: 'Choose n so that every riser, the first one included, stays within about 250–400 mm and the first no higher than about 600 mm.',
      stories: { r: 'A cab floor is {H} above the ground, reached by {n} equal risers. How high is each?', n: 'A cab floor is {H} up and each riser should be about {r}. How many risers are needed?' }
    },
    {
      name: 'Landing speed when jumping down',
      expr: 'v = sqrt(2*g*h)', tex: 'v = \\sqrt{2 g h}',
      vars: {
        v: { name: 'speed on landing', q: 'speed', unit: 'm/s' },
        g: { const: 'g' },
        h: { name: 'height of the jump', q: 'length', unit: 'm', value: 1.3 }
      },
      note: 'The energy to absorb grows with h; stepping down reduces h to one riser at a time, with hands on the rails.',
      stories: { v: 'A driver jumps down from a cab floor {h} above the ground. How fast does she land?' }
    }
  ],
  examples: [
    {
      title: 'Steps for a high cab',
      q: 'A cab floor is 1350 mm above the ground. How many equal risers keep each within 250–400 mm, and how high is the first step?',
      steps: [
        'Three risers: $1350/3 = 450$ mm — too high.',
        'Four risers: $1350/4 = 338$ mm — within the range; the first step is 338 mm above the ground.',
        'So three steps plus the step onto the floor, with handholds on both sides from about 1.2 m up to above the floor.'
      ],
      a: 'Four risers of about 340 mm (three steps).'
    },
    {
      title: 'A delivery driver\'s day',
      q: 'A delivery driver gets in and out 60 times a day. The cab floor is 1.2 m up. Compare jumping down with stepping down one 0.3 m riser at a time.',
      steps: [
        'Jumping: $v = \\sqrt{2 \\times 9.81 \\times 1.2} = 4.9$ m/s, sixty times a day.',
        'Stepping: each riser $v = \\sqrt{2 \\times 9.81 \\times 0.3} = 2.4$ m/s, with hands on the rails taking part of the load.',
        'The kinetic energy per landing falls fourfold; the fall risk falls further with three points of contact. A low-entry cab removes most of the climb.'
      ],
      a: 'About 4.9 m/s jumping against 2.4 m/s per step.'
    }
  ],
  quiz: [
    { q: 'What is the safe way to leave a truck cab?', choices: ['Climb down facing the cab with three points of contact', 'Jump clear of the steps', 'Step down facing outwards holding a bag', 'Slide down the handrail'], a: 0, why: 'Facing the cab keeps both hands and feet on the steps and rails; most cab falls happen when jumping or facing out.' },
    { q: 'Which mirror shows the zone directly in front of a truck cab?', choices: ['The front mirror (class VI)', 'The main mirror (class II)', 'The interior mirror', 'The wide-angle mirror (class IV)'], a: 0, why: 'UN R46 class VI mirrors cover the ground in front of the cab; class V covers the passenger side close to the cab.' },
    { q: 'How fast does a person land after jumping from 1.3 m?', answer: 5.05, unit: 'm/s', why: 'v = √(2 × 9.81 × 1.3) = 5.05 m/s.' },
    { q: 'Under the EU rules, how long may a truck driver drive before a break of at least 45 minutes?', choices: ['4.5 h', '2 h', '8 h', '11 h'], a: 0, why: 'Regulation (EC) No 561/2006: 4.5 h of driving, then 45 min of break (which may be split 15 + 30).' },
    { q: 'True or false: a low-entry cab reduces both the climb and the blind zone in front of the truck.', a: true, why: 'The floor and the driver\'s eyes are lower and the glass reaches further down.' }
  ],
  problems: [
    { q: 'A bus driver\'s cab floor is 900 mm above the road, reached by equal risers of no more than 330 mm. How many risers are needed?', answer: 3, tol: 0.001, steps: ['$900/330 = 2.7$, so 3 risers of 300 mm.'] },
    { q: 'What is the landing speed after a jump from a 0.45 m step?', answer: 2.97, unit: 'm/s', tol: 0.01, steps: ['$v = \\sqrt{2 \\times 9.81 \\times 0.45} = 2.97$ m/s.'] }
  ],
  ranges: [
    { dim: 'First step above the ground (trucks and buses)', range: [null, 610], unit: 'mm', who: 'Small and older drivers, in work boots', why: 'A step-up that everyone can make with the handholds, without jumping.', limits: 'Suspension travel and ground clearance push it up; off-road machines have their own access standard (ISO 2867).', setting: 'vehicle', src: 'US 49 CFR Part 399, subpart L (24 in)' },
    { dim: 'Riser between steps (vehicle and machine access)', range: [250, 400], unit: 'mm', who: 'Drivers and operators from the 5th-percentile woman up', why: 'A regular climbing rhythm without very high knee lifts.', limits: 'Keep all risers equal, first one included; fixed ladders use 225–300 mm (ISO 14122-4).', setting: ['vehicle', 'field'], src: 'Access-system standards for vehicles and machines (ISO 2867, SAE J185); Pheasant and Haslegrave' },
    { dim: 'Handhold diameter', range: [25, 40], unit: 'mm', who: 'Bare and gloved hands, small and large', why: 'A secure power grip that can hold the body\'s weight in a slip.', limits: 'Needs a clearance behind the rail for gloved fingers; non-slip in rain and cold.', setting: ['vehicle', 'field', 'workshop'], src: 'Pheasant and Haslegrave, Bodyspace (power grip); ISO 2867' },
    { dim: 'Lowest grip of the entry handholds above the ground', range: [null, 1500], unit: 'mm', who: '5th-percentile woman standing on the ground (shoulder about 1.26 m in shoes, grip reach about 1.8 m)', why: 'A firm hold is possible before the first step.', limits: 'The rails must continue upwards to beyond the cab floor so that tall drivers and people inside can hold them too.', setting: 'vehicle', src: 'Body dimensions (representative data)' },
    { dim: 'Driving before a break of at least 45 minutes (EU)', range: [null, 4.5], unit: 'h', who: 'Drivers of goods vehicles over 3.5 t and of buses and coaches', why: 'Limits time-on-task fatigue.', limits: 'National rules differ; a legal schedule can still be exhausting at night.', setting: 'vehicle', src: 'Regulation (EC) No 561/2006' },
    { dim: 'Daily driving time (EU; US)', range: '9 h (10 h twice a week) in the EU; 11 h within 14 h on duty in the US', unit: '', who: 'Professional drivers', why: 'Keeps the daily fatigue within bounds.', limits: 'Loading, waiting and other work add to the day; sleep quality in the cab matters as much.', setting: 'vehicle', src: 'Regulation (EC) No 561/2006; US FMCSA hours of service (49 CFR Part 395)' }
  ],
  applications: [
    'Low-entry cabs for refuse collection and urban delivery.',
    'Step and handhold layouts designed with three points of contact in mind.',
    'Blind-spot, moving-off and camera systems on new trucks and buses.',
    'Driver-workplace specifications for city buses based on ISO 16121.'
  ],
  history: 'London introduced a Direct Vision Standard in the late 2010s after a run of fatal collisions between trucks and cyclists and pedestrians; the EU followed with direct-vision requirements for new trucks. For city buses, the ergonomic requirements for the driver\'s workplace were brought together in the international standard ISO 16121.',
  sources: [
    'ISO 16121, *Road vehicles — Ergonomic requirements for the driver\'s workplace in line-service buses*.',
    'UN Regulation No. 46, *Devices for indirect vision*; UN Regulation No. 151, *Blind spot information systems*; UN Regulation No. 159, *Moving off information systems*.',
    'Regulation (EU) 2019/2144, the General Safety Regulation for motor vehicles.',
    'Regulation (EC) No 561/2006 on driving times and rest periods; US FMCSA hours of service, 49 CFR Part 395.',
    'US 49 CFR Part 399, subpart L, *Step, handhold, and deck requirements for commercial motor vehicles*.',
    'ISO 2867, *Earth-moving machinery — Access systems*; ISO 14122-4, *Safety of machinery — Permanent means of access — Fixed ladders*.',
    'Transport for London, *Direct Vision Standard*.'
  ],
  sim: ['mt-steps-access', 'mt-blind-zones']
},

{
  id: 'mobile-machines', parent: 'vehicle-topic', title: 'Forklifts and mobile machines', level: 2,
  short: 'Forklifts, loaders, excavators, tractors and telehandlers are machines that drive: masts, loads and booms hide people close by, rough ground shakes the operator, looking back twists the neck, and controls are worked for hours. Design for direct vision and test it (ISO 5006, ISO 13564), separate people from machines, match suspension seats to the machine, keep daily vibration below the EU action value of 0.5 m/s², and restrain the operator inside the protective structure.',
  keywords: ['forklift', 'lift truck', 'mobile machinery', 'earth-moving machinery', 'visibility', 'ISO 5006', 'ISO 13564', 'blind zone', 'reversing', 'pedestrian segregation', 'proximity detection', 'whole-body vibration', 'A(8)', 'Directive 2002/44/EC', 'suspension seat', 'operator restraint', 'ROPS', 'controls', 'ISO 6682', 'ISO 10968', 'ISO 2867', 'twisting'],
  prereq: ['vehicle-seating', 'driver-workspace', 'whole-body-vibration'],
  related: ['truck-bus-cabs', 'machine-ergonomics-principles', 'operator-positions', 'controls-design', 'stereotypes-compatibility', 'construction-ergonomics', 'agriculture-ergonomics', 'material-flow-layout', 'situation-awareness', 'noise-exposure'],
  body: `
Forklifts, wheel loaders, excavators, dumpers, tractors, telehandlers and mobile cranes are machines that drive. Their operators face the hazards of both: they must see people moving close to a large machine, sit on it for hours while it shakes, twist round to look behind, work its controls all shift, and climb on and off it.

### Seeing people around the machine
Masts, booms, buckets, loads, cabs and counterweights hide large zones, and pedestrians are killed in them — very often while the machine reverses. Visibility is therefore tested: ISO 5006 for earth-moving machinery places light sources at the operator's eye positions and measures the shadows ("maskings") they cast on a 12 m circle and on a boundary 1 m round the machine; ISO 13564-1 does the same for industrial trucks. The remedies, in order:
1. **Design for direct vision**: slim masts with wide windows between the channels, low bonnets and engine covers, glass down to the floor.
2. **Separate people from machines**: marked pedestrian routes, barriers, exclusion zones, one-way traffic, loading bays where people and trucks are not in the same place at the same time ([[material-flow-layout]]).
3. **Operating rules**: travel with the load low — typically 100–150 mm above the floor with the mast tilted back — and drive in reverse when a load blocks the view forward (see the simulation).
4. **Aids**: mirrors, cameras, proximity detection that warns or slows the machine.

### Whole-body vibration and shocks
Rough floors and ground, hard tyres and little suspension deliver vibration mostly between about 1 and 10 Hz, with shocks from potholes, kerbs and bucket impacts. The EU vibration directive 2002/44/EC sets a daily exposure action value of 0.5 m/s² and a limit value of 1.15 m/s², where the daily exposure is

$$A(8) = a_w \\sqrt{\\frac{T}{8\\,\\mathrm{h}}}$$

for a frequency-weighted acceleration $a_w$ during $T$ hours ([[?square-root|square root]] of the time: halving the exposure time lowers A(8) by only 29 %). Many machines on rough ground reach the action value within the day. Reduce it at the source first — smooth floors and haul roads, lower speeds, correct tyre pressures, cab and axle suspension — then with suspension seats matched to the machine and adjusted to the operator's weight ([[vehicle-seating]], [[whole-body-vibration]]), and finally by limiting exposure time.

### Posture: twisting to look back
Counterbalance forklift operators may reverse for half their driving time, twisting the neck and trunk each time. Swivel or angled seats, a rear grab handle, reversing cameras and a second set of controls reduce the twist. Excavator operators look down into trenches; crane and reach-truck operators look up at loads for hours — overhead windows and tilting seats help.

### Controls, access and restraint
- **Controls** in the comfort zones around the seated operator (ISO 6682), joysticks on armrests that move with the seat, and standard control patterns (ISO 10968) — machines with different patterns on one site invite errors ([[stereotypes-compatibility]]).
- **Access**: steps and handholds for three points of contact (ISO 2867), like truck cabs ([[truck-bus-cabs]]).
- **Restraint**: in a tip-over the protective structure (ROPS) protects only the operator who stays inside it. Seat belts or restraining doors keep them there; jumping clear of a tipping forklift is the classic fatal error.

| Machine | Main ergonomic problems |
|---|---|
| Counterbalance forklift | reversing, loads blocking the view, twisting, vibration on uneven floors, pedestrians |
| Reach truck | standing all shift, looking up at high racks, sideways driving position |
| Wheel loader, dumper | vibration and shocks, reversing blind zones, climbing on |
| Excavator | views into trenches and behind the counterweight, joysticks for hours |
| Tractor | slow pitching near 2 Hz, twisting to watch implements, noise |
| Telehandler, mobile crane | booms hiding the view, stability, long-reach controls |
| Military engineering vehicles | protected cabs with small windows, periscopes and cameras ([[crew-stations]]) |

> [!warn] Keep people out of the working area of mobile machines. Never walk behind a reversing machine, never ride on forks or buckets, and wear the seat belt: in a tip-over, stay in the seat and hold on.

> [!key] See people first (direct vision, separation, then cameras), shake the operator less (source, seat, time), twist them less, and keep them inside the protective structure.
`,
  ideas: [
    'Masts, loads, booms and counterweights hide people; visibility is measured with lights at the operator\'s eyes (ISO 5006, ISO 13564).',
    'Separate pedestrians from machines first; travel with loads low and reverse when a load blocks the view.',
    'Daily vibration exposure A(8) = a_w √(T/8 h); the EU action value is 0.5 m/s² and the limit 1.15 m/s².',
    'Reversing forces constant twisting; swivel seats, cameras and rear handles reduce it.',
    'Seat belts keep the operator inside the protective structure in a tip-over; jumping clear kills.'
  ],
  pitfalls: [
    'A reversing alarm makes reversing safe — People get used to it and it does not tell the operator anyone is there; separation and detection do.',
    'Halving the time on a vibrating machine halves the exposure — A(8) falls only with the square root of time: 29 % less.',
    'In a forklift tip-over the operator should jump clear — The mast or overhead guard lands on those who jump; staying belted inside the protective structure saves lives.'
  ],
  formulas: [
    {
      name: 'Daily vibration exposure',
      expr: 'A8 = aw*sqrt(T/T0)', tex: 'A_{8} = a_w\\sqrt{\\dfrac{T}{T_0}}',
      vars: {
        A8: { name: 'daily exposure A(8)', q: 'accel', unit: 'm/s²', tex: 'A_{8}' },
        aw: { name: 'frequency-weighted r.m.s. acceleration (the dominant axis)', q: 'accel', unit: 'm/s²', value: 0.8, tex: 'a_w' },
        T: { name: 'daily exposure time', q: 'time', unit: 'h', value: 6 },
        T0: { name: 'reference duration', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'ISO 2631-1 weighting; EU action value 0.5 m/s², limit value 1.15 m/s². Solve for T to find how long a machine can be used before reaching the action value.',
      stories: { A8: 'An operator drives a machine vibrating at {aw} for {T} a day. What is the daily exposure?', T: 'A machine vibrates at {aw}. How many hours a day bring the operator to {A8}?' }
    },
    {
      name: 'Daily exposure from two machines',
      expr: 'A8 = sqrt((a1^2*T1 + a2^2*T2)/T0)', tex: 'A_{8} = \\sqrt{\\dfrac{a_1^2 T_1 + a_2^2 T_2}{T_0}}',
      vars: {
        A8: { name: 'daily exposure A(8)', q: 'accel', unit: 'm/s²', tex: 'A_{8}' },
        a1: { name: 'vibration of the first machine', q: 'accel', unit: 'm/s²', value: 1.0, tex: 'a_1' },
        T1: { name: 'time on the first machine', q: 'time', unit: 'h', value: 3, tex: 'T_1' },
        a2: { name: 'vibration of the second machine', q: 'accel', unit: 'm/s²', value: 1.2, tex: 'a_2' },
        T2: { name: 'time on the second machine', q: 'time', unit: 'h', value: 2, tex: 'T_2' },
        T0: { name: 'reference duration', q: 'time', unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'Energy-equivalent combination of partial exposures, as used with the EU directive.',
      stories: { A8: 'An operator drives a loader at {a1} for {T1} and a dumper at {a2} for {T2}. What is the daily exposure?' }
    }
  ],
  examples: [
    {
      title: 'A forklift on an uneven floor',
      q: 'A forklift on a cracked yard floor gives $a_w = 0.8$ m/s². What is A(8) for 6 h of driving, and how long can it be driven before the action value is reached? What if repairing the floor brings $a_w$ down to 0.55 m/s²?',
      steps: [
        '$A(8) = 0.8\\sqrt{6/8} = 0.69$ m/s² — above the 0.5 m/s² action value.',
        'Time to the action value: $T = 8\\,(0.5/0.8)^2 = 3.1$ h.',
        'After the repair: $A(8) = 0.55\\sqrt{6/8} = 0.48$ m/s² — below the action value for the whole 6 h.'
      ],
      a: '0.69 m/s² (action value reached after 3.1 h); 0.48 m/s² after the floor repair.'
    },
    {
      title: 'Two machines in a day',
      q: 'An operator drives a wheel loader at 1.0 m/s² for 3 h and a dumper at 1.2 m/s² for 2 h. What is the daily exposure?',
      steps: [
        '$A(8) = \\sqrt{(1.0^2 \\times 3 + 1.2^2 \\times 2)/8} = \\sqrt{5.88/8} = 0.86$ m/s².',
        'Above the action value, below the 1.15 m/s² limit: a programme of measures is required — smoother haul roads, better seats, shorter spells.'
      ],
      a: 'About 0.86 m/s².'
    }
  ],
  quiz: [
    { q: 'A forklift carries a load that blocks the view ahead. What should the operator do?', choices: ['Travel in reverse, looking in the direction of travel', 'Drive forward slowly, leaning out', 'Raise the load high to see under it', 'Ask a pedestrian to walk ahead'], a: 0, why: 'Reversing keeps the view clear; raising the load makes the truck unstable.' },
    { q: 'What is A(8) for 4 h at 1.0 m/s²?', answer: 0.707, unit: 'm/s²', why: '1.0 × √(4/8) = 0.71 m/s².' },
    { q: 'What happens to A(8) when the exposure time is halved?', choices: ['It falls by about 29 %', 'It halves', 'It falls by 75 %', 'It does not change'], a: 0, why: 'A(8) scales with √T: √0.5 = 0.71.' },
    { q: 'True or false: in a forklift tip-over, an operator wearing a seat belt should stay in the seat.', a: true, why: 'The overhead guard protects the operator only inside it; jumping clear exposes them to being crushed.' },
    { q: 'How does ISO 5006 test an earth-moving machine\'s visibility?', choices: ['Lights at the operator\'s eye positions cast shadows measured on a 12 m circle and a 1 m boundary', 'A driver describes what they can see', 'Cameras must cover 360°', 'By counting mirrors'], a: 0, why: 'The shadows ("maskings") show what the operator cannot see directly.' }
  ],
  problems: [
    { q: 'A tractor vibrates at 0.9 m/s². How many hours a day bring the driver to the 0.5 m/s² action value?', answer: 2.47, unit: 'h', tol: 0.01, steps: ['$T = 8\\,(0.5/0.9)^2 = 8 \\times 0.309 = 2.47$ h.'] },
    { q: 'An operator spends 5 h on a machine at 0.6 m/s². What is A(8)?', answer: 0.474, unit: 'm/s²', tol: 0.01, steps: ['$A(8) = 0.6\\sqrt{5/8} = 0.6 \\times 0.791 = 0.474$ m/s² — just below the action value.'] }
  ],
  ranges: [
    { dim: 'Daily whole-body vibration exposure A(8) to aim for', range: [null, 0.5], unit: 'm/s²', who: 'Operators of forklifts, earth-moving machines, tractors and trucks', why: 'Below the EU exposure action value: low risk of back disorders from vibration.', limits: 'Shocks (potholes, kerbs) add risk that A(8) understates; measure the dominant axis, often vertical.', setting: ['workshop', 'field', 'vehicle'], src: 'Directive 2002/44/EC; ISO 2631-1' },
    { dim: 'Daily whole-body vibration exposure limit value A(8)', range: [null, 1.15], unit: 'm/s²', who: 'Every operator, every day', why: 'The legal limit in the EU; above it exposure must be reduced at once.', limits: 'Other countries use guidance values rather than limits; the action value is the design target.', setting: ['workshop', 'field', 'vehicle'], src: 'Directive 2002/44/EC' },
    { dim: 'Fork height while travelling with a load', range: [100, 150], unit: 'mm', who: 'Counterbalance forklift operators', why: 'The truck stays stable and the load clears floor irregularities.', limits: 'Tilt the mast back; if the load blocks the view, travel in reverse rather than raising it.', setting: 'workshop', src: 'Forklift operator training practice (e.g. HSE L117)' }
  ],
  applications: [
    'Pedestrian routes and exclusion zones in warehouses, yards and quarries.',
    'Proximity detection and cameras on mining trucks, loaders and forklifts.',
    'Vibration risk assessments and seat selection for fleets of machines.',
    'Seat belts and restraining doors on forklifts.'
  ],
  history: 'Visibility tests with lamps at the operator\'s eye were developed for earth-moving machinery and became ISO 5006. Whole-body vibration moved from a comfort question to a legal one with the EU Physical Agents (Vibration) Directive of 2002, which set the action and limit values still in force.',
  sources: [
    'ISO 5006, *Earth-moving machinery — Operator\'s field of view — Test method and performance criteria*.',
    'ISO 13564-1, *Powered industrial trucks — Test methods for verification of visibility*.',
    'Directive 2002/44/EC on the minimum health and safety requirements regarding the exposure of workers to the risks arising from vibration.',
    'ISO 2631-1, *Mechanical vibration and shock — Evaluation of human exposure to whole-body vibration*.',
    'ISO 6682, *Earth-moving machinery — Zones of comfort and reach for controls*; ISO 10968, *Earth-moving machinery — Operator\'s controls*.',
    'ISO 2867, *Earth-moving machinery — Access systems*; ISO 7096 and EN 13490 (laboratory tests of operator seat vibration).',
    'UK HSE, *Rider-operated lift trucks: operator training and safe use* (L117).'
  ],
  sim: ['mt-blind-zones', 'mt-seat-vibration']
},

{
  id: 'public-transport', parent: 'vehicle-topic', title: 'Public transport', level: 2,
  short: 'Buses, trams and trains must carry everyone at once — children, older people, wheelchair users, parents with buggies — many of them standing in a vehicle that brakes and turns. Step-free boarding (low floors, kneeling, ramps, level platforms), wheelchair spaces of about 750 × 1300 mm, grab rails and poles within everyone\'s reach, enough knee room, and a ride that standing passengers can withstand: about 1.5 m/s² at most in normal service.',
  keywords: ['public transport', 'low-floor bus', 'kneeling bus', 'step height', 'level boarding', 'platform gap', 'ramp', 'wheelchair space', 'UN R107', 'TSI PRM', 'ADA vehicles', '49 CFR 38', 'grab rails', 'stanchions', 'handholds', 'standing passengers', 'balance', 'acceleration', 'jerk', 'priority seats', 'stop request', 'accessibility'],
  prereq: ['accessible-design', 'ramps-accessibility', 'standing-dimensions'],
  related: ['stairs-ergonomics', 'disability-inclusive', 'age-children-elderly', 'information-design', 'truck-bus-cabs', 'doors-corridors', 'physics:center-of-mass', 'physics:friction'],
  body: `
Public transport is designed for everyone at once: children and very old people, wheelchair users, parents with buggies, travellers with luggage, people who cannot read the signs — often in a hurry, often standing in a vehicle that brakes and turns. Its ergonomics is inclusive design in motion.

### Getting on and off
- **Low-floor buses** put the floor at the doors about 320–350 mm above the road; **kneeling** lowers the entry side by several centimetres, and a ramp bridges to the kerb for wheelchairs and buggies. UN Regulation No. 107 sets step heights and accessibility for European buses, including a low first step at an accessible door and ramps of no more than about 12 % gradient.
- **Trains and trams**: level boarding with a small gap is best for everyone. European rail rules (TSI PRM) standardise platform heights of 550 and 760 mm; US rules for new rail vehicles at level-boarding platforms allow a horizontal gap of no more than 3 in (76 mm) and a height difference within ±5/8 in (16 mm).
- Doors with handholds on both sides, contrasting step edges, and enough dwell time for slow passengers.

### Standing passengers
A standing passenger is an inverted pendulum. Without holding on, the body stays up while the "tilted gravity" of the vehicle's acceleration still passes through the feet — roughly while

$$a \\le g\\,\\frac{b}{2h}$$

for a base of support $b$ (the length of the stance in the direction of the acceleration) and a centre of mass at height $h$, about 55 % of stature ([[physics:center-of-mass|centre of mass]]): the tolerable acceleration is [[?proportional|proportional]] to the stance. Feet together, facing forward, $b \\approx 0.25$–$0.3$ m and $h \\approx 0.95$ m give about 1.3–1.5 m/s² — and passengers step or grab beyond it. Classic reviews of ride comfort (Hoberock, 1977) put the acceptable longitudinal acceleration for standing passengers at about 0.11–0.15 g (1.1–1.5 m/s²) and the jerk at about 0.3 g/s. Emergency braking is several times harder: then only a firm hold keeps people up. Holding a pole or rail at height $h_r$ adds a moment; the hand must supply about $F = m\\,(a h - g b/2)/h_r$ — the higher the grip, the smaller the force. Many passenger falls happen as the bus pulls away before people are seated; smooth driving is the first safety measure.

### Rails, poles and buttons
- **Vertical poles** by the doors and along the aisle; **horizontal overhead rails** low enough for small passengers — at most about 1.8 m, since the 5th-percentile woman's vertical grip reach is about 1.77 m barefoot — plus straps and seat-back handles lower down.
- **Diameter** about 30–40 mm, round, with room for the hand, in a colour that contrasts with the surroundings for partially sighted passengers.
- **Stop buttons** within reach of seated passengers and wheelchair users — between about 380 and 1220 mm above the floor (the US accessibility reach range).

### Seats and spaces
- **Knee room**: the 95th-percentile man's buttock–knee length is about 660 mm; with the seat back and a clearance, rows about 700–780 mm apart leave room for tall passengers' knees.
- **Wheelchair spaces**: about 750 × 1300 mm in European buses and 30 × 48 in (760 × 1220 mm) in US vehicles, with a backrest or restraint and a request button within reach; priority seats near the doors.

### Information
Next-stop displays and announcements, both visual and audible, large characters readable while standing, and clear route information at stops ([[information-design]]).

| Mode | Boarding | Standing | Particular needs |
|---|---|---|---|
| City bus | low floor, kneeling, ramp | many standing, stop–start driving | smooth driving, rails everywhere |
| Tram, light rail | level platforms, gap fillers | standing, sudden braking in street traffic | poles within reach of every standing place |
| Metro | level boarding | crowded standing | platform gaps, doors, crowd flow |
| Coach, long-distance rail | steps or lifts | mostly seated | luggage lifting, toilets, long sitting |
| Paratransit, taxis | lifts, ramps | seated, secured wheelchairs | securement, headroom for wheelchair users |

In the simulation a passenger of any size stands in a bus that pulls away and brakes: change the stance, the grip and the driving and watch the tilted gravity leave the feet.

> [!key] Step-free boarding, rails within everyone's reach, room for wheelchairs and knees, and gentle acceleration: public transport fits the whole population or it fails the people who need it most.
`,
  ideas: [
    'Step-free boarding — low floors, kneeling, ramps, level platforms — serves everyone, not only wheelchair users.',
    'A standing passenger stays up while a ≤ g·b/(2h); about 1.1–1.5 m/s² is the comfortable limit in service.',
    'A grip higher up needs less force: F = m(a h − g b/2)/h_r.',
    'Overhead rails no higher than about 1.8 m reach the smallest passengers; poles and straps fill the gaps.',
    'Wheelchair spaces of about 750 × 1300 mm (Europe) or 760 × 1220 mm (US), with request buttons within reach.'
  ],
  pitfalls: [
    'Low-floor buses are only for wheelchair users — Everybody boards faster and falls less; older people, parents and travellers benefit most.',
    'Passengers can hold on in any braking — Emergency stops need several times the force of normal braking; smooth driving and rails at every standing place matter.',
    'High overhead rails suit everyone — Small passengers cannot reach them; add vertical poles, straps and seat-back handles.'
  ],
  formulas: [
    {
      name: 'Acceleration a standing passenger can take without holding on',
      expr: 'a = g*b/(2*h)', tex: 'a = g\\,\\dfrac{b}{2h}',
      vars: {
        a: { name: 'largest acceleration or deceleration without a hold (static)', q: 'accel', unit: 'm/s²' },
        g: { const: 'g' },
        b: { name: 'length of the base of support in the direction of the acceleration', q: 'length', unit: 'm', value: 0.28 },
        h: { name: 'height of the centre of mass (about 55 % of stature)', q: 'length', unit: 'm', value: 0.95 }
      },
      note: 'A static estimate: the line of the tilted gravity reaches the edge of the feet. Real people use ankle and hip movements and steps, and older people have smaller margins.',
      stories: { a: 'A passenger stands with a base of {b} in the direction of travel and a centre of mass {h} high. What acceleration can she take without holding on?', b: 'To stand through {a} without a hold with the centre of mass at {h}, how long must the stance be?' }
    },
    {
      name: 'Hand force to stay upright holding a pole or rail',
      expr: 'F = m*(a*h - g*b/2)/hr', tex: 'F = \\dfrac{m\\,(a h - g b/2)}{h_r}',
      vars: {
        F: { name: 'horizontal force the hand must supply', q: 'force', unit: 'N' },
        m: { name: 'body mass', q: 'mass', unit: 'kg', value: 70 },
        a: { name: 'acceleration or deceleration of the vehicle', q: 'accel', unit: 'm/s²', value: 3 },
        h: { name: 'height of the centre of mass', q: 'length', unit: 'm', value: 0.95 },
        g: { const: 'g' },
        b: { name: 'length of the base of support', q: 'length', unit: 'm', value: 0.28 },
        hr: { name: 'height of the hand on the pole or rail', q: 'length', unit: 'm', value: 1.0, tex: 'h_r' }
      },
      note: 'Moments about the edge of the feet, static. Only meaningful when a exceeds g·b/(2h); a higher grip needs less force.',
      stories: { F: 'A {m} passenger holds a pole at {hr} while the bus brakes at {a}. What force must the hand supply?', a: 'A passenger of {m} can hold {F} at {hr}. What deceleration can she stand?' }
    }
  ],
  examples: [
    {
      title: 'Stance matters',
      q: 'A passenger\'s centre of mass is 0.95 m high. What acceleration can she stand without holding on with her feet together facing forward (base 0.25 m) and in a stride facing forward (base 0.5 m)?',
      steps: [
        'Feet together: $a = 9.81 \\times 0.25/1.9 = 1.29$ m/s² — about the comfort limit of normal service.',
        'Stride: $a = 9.81 \\times 0.5/1.9 = 2.58$ m/s² — twice as much.',
        'What counts is the length of the base along the direction of travel. Facing forward with the feet side by side it is only a foot\'s length; a stride, or standing sideways with the feet apart, spreads the feet along the vehicle — which is why seasoned passengers ride sideways, feet apart.'
      ],
      a: 'About 1.3 m/s² with the feet together, 2.6 m/s² in a stride.'
    },
    {
      title: 'Holding on in hard braking',
      q: 'A 70 kg passenger (centre of mass 0.95 m, base 0.28 m) holds a vertical pole at 1.0 m while the bus brakes at 3 m/s². What force must the hand supply? And holding an overhead rail at 1.75 m?',
      steps: [
        'Moment needed: $a h - g b/2 = 3 \\times 0.95 - 9.81 \\times 0.14 = 2.85 - 1.37 = 1.48$ m²/s².',
        'Pole at 1.0 m: $F = 70 \\times 1.48/1.0 = 103$ N.',
        'Rail at 1.75 m: $F = 70 \\times 1.48/1.75 = 59$ N — a higher grip halves the effort. Older passengers, with weaker grips, need both.'
      ],
      a: 'About 103 N on the pole, 59 N on the overhead rail.'
    }
  ],
  quiz: [
    { q: 'Which stance is most stable for a standing passenger when the bus brakes?', choices: ['Feet spread along the vehicle: a stride, or standing sideways with the feet apart', 'Facing forward with the feet side by side', 'Feet together, facing forward', 'On tiptoe'], a: 0, why: 'What counts is the length of the base in the direction of the deceleration; spreading the feet along the vehicle lengthens it.' },
    { q: 'About what longitudinal acceleration do comfort studies accept for standing passengers?', choices: ['1.1–1.5 m/s²', '5–6 m/s²', '0.1 m/s²', '9.8 m/s²'], a: 0, why: 'About 0.11–0.15 g (Hoberock, 1977); beyond it passengers must hold on or step.' },
    { q: 'A passenger with a base of 0.3 m and a centre of mass at 1.0 m: what acceleration can she take without a hold?', answer: 1.47, unit: 'm/s²', why: 'a = 9.81 × 0.3/(2 × 1.0) = 1.47 m/s².' },
    { q: 'Why must overhead rails not be too high?', choices: ['The smallest passengers must be able to reach them', 'They would hit the roof', 'Rules forbid rails above 1.5 m', 'Tall passengers prefer low rails'], a: 0, why: 'The 5th-percentile woman\'s vertical grip reach is about 1.77 m barefoot; higher rails exclude her.' },
    { q: 'True or false: low-floor buses benefit only wheelchair users.', a: false, why: 'Older people, parents with buggies, travellers with luggage and everyone boarding in a hurry benefit.' }
  ],
  problems: [
    { q: 'A 60 kg passenger (centre of mass 0.9 m, base 0.25 m) holds a pole at 1.1 m as the bus brakes at 2.5 m/s². What hand force is needed?', answer: 55.8, unit: 'N', tol: 0.02, steps: ['$a h - g b/2 = 2.25 - 1.226 = 1.024$.', '$F = 60 \\times 1.024/1.1 = 55.8$ N.'] },
    { q: 'A bus ramp bridges 150 mm from the floor to the kerb. How long must it be for a 12 % gradient?', answer: 1.25, unit: 'm', tol: 0.01, steps: ['$L = 0.150/0.12 = 1.25$ m.'] }
  ],
  ranges: [
    { dim: 'Floor height at the doors of low-floor buses', range: [320, 350], unit: 'mm', who: 'All passengers; kneeling lowers it further for those who need it', why: 'One low step or a short ramp from the kerb.', limits: 'Low floors cost space over the wheels and ground clearance; high kerbs at stops help as much as the bus.', setting: ['vehicle', 'civil'], src: 'Low-floor bus practice; UN Regulation No. 107' },
    { dim: 'Gradient of a boarding ramp (buses)', range: [null, 12], unit: '%', who: 'Wheelchair users, people with buggies and walking aids', why: 'Manageable with help or a powered chair over the short length of a vehicle ramp.', limits: 'Building ramps are gentler (8.3 %, 1:12); many manual wheelchair users need help above that.', setting: ['vehicle', 'civil'], src: 'UN Regulation No. 107; ISO 21542 and the ADA Standards for buildings' },
    { dim: 'Level boarding at rail platforms (US): gap and step', range: 'gap ≤ 76 mm (3 in); step within ±16 mm (5/8 in)', unit: '', who: 'Wheelchair users, people with walking aids, buggies', why: 'Wheels and feet cross without catching or dropping.', limits: 'Curved platforms and worn wheels open gaps; bridging plates and gap fillers help.', setting: ['vehicle', 'civil'], src: '49 CFR Part 38 (ADA accessibility specifications for transportation vehicles)' },
    { dim: 'Wheelchair space', range: 'about 750 × 1300 mm (Europe); 760 × 1220 mm, 30 × 48 in (US)', unit: '', who: 'Wheelchair users, including large powered chairs', why: 'Room to enter, turn and park safely, with a backrest or restraint.', limits: 'Large powered chairs and scooters need more; keep the approach free of poles.', setting: ['vehicle', 'civil'], src: 'UN Regulation No. 107; 49 CFR Part 38 and the ADA Standards' },
    { dim: 'Longitudinal acceleration in normal service (standing passengers)', range: [null, 1.5], unit: 'm/s²', who: 'Standing passengers, including older people', why: 'Most can stay upright with a light hold.', limits: 'Older passengers and people with balance problems need less; emergency braking is far above it.', setting: ['vehicle', 'civil'], src: 'Hoberock (1977)' },
    { dim: 'Jerk (rate of change of acceleration) in normal service', range: [null, 3], unit: 'm/s³', who: 'Standing passengers', why: 'Gives passengers time to adjust their balance.', limits: 'Traffic and emergencies force faster changes; smooth driving and good rails make up for them.', setting: ['vehicle', 'civil'], src: 'Hoberock (1977)' },
    { dim: 'Height of overhead grab rails', range: [null, 1800], unit: 'mm', who: '5th-percentile woman\'s vertical grip reach (about 1.77 m barefoot, 1.8 m in shoes)', why: 'Small passengers can hold on.', limits: 'Run them beside, not across, walking routes so tall passengers\' heads (about 1.9 m in shoes) clear them; add poles and straps.', setting: ['vehicle', 'civil'], src: 'Body dimensions (representative data)' },
    { dim: 'Diameter of grab rails and poles', range: [30, 40], unit: 'mm', who: 'Hands of children, older people and large adults', why: 'A secure power grip for holding the body in braking.', limits: 'Contrasting colour for partially sighted passengers; clear space around the rail for the hand.', setting: ['vehicle', 'civil'], src: 'TSI PRM (EU rail); Pheasant and Haslegrave, Bodyspace' }
  ],
  applications: [
    'Low-floor, kneeling buses with ramps and raised kerbs at stops.',
    'Level boarding at metro and tram platforms, with gap fillers.',
    'Rail and pole layouts that give every standing passenger a hold within reach.',
    'Driver training in smooth acceleration and braking to prevent passenger falls.'
  ],
  history: 'Low-floor buses spread in Europe in the 1990s and were followed by accessibility rules for buses (UN R107) and for trains (the EU TSI on persons with reduced mobility); in the US the Americans with Disabilities Act of 1990 brought accessibility specifications for transport vehicles. Studies of passenger comfort in the 1960s and 1970s, reviewed by Hoberock (1977), set the acceleration and jerk limits still quoted.',
  sources: [
    'UN Regulation No. 107, *Uniform provisions concerning the approval of category M2 or M3 vehicles with regard to their general construction* (including the accessibility annex).',
    'Commission Regulation (EU) No 1300/2014, *Technical specification for interoperability relating to accessibility for persons with disabilities and persons with reduced mobility* (TSI PRM).',
    'US 49 CFR Part 38, *Americans with Disabilities Act (ADA) accessibility specifications for transportation vehicles*; 2010 ADA Standards for Accessible Design.',
    'L. L. Hoberock, "A survey of longitudinal acceleration comfort studies in ground transportation vehicles", *Journal of Dynamic Systems, Measurement, and Control*, 1977.',
    'ISO 21542, *Building construction — Accessibility and usability of the built environment*.',
    'Pheasant and Haslegrave, *Bodyspace* — public spaces and transport.'
  ],
  sim: ['mt-standing-passenger', 'mt-steps-access']
}

);
