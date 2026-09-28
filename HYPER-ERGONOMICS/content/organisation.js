/* HYPER-ERGONOMICS · content/organisation.js — organising work: shift work, fatigue and rest breaks, energy
 * expenditure and work–rest cycles, job rotation and job design, psychosocial factors, participatory ergonomics and
 * the ageing workforce. Simulations in sims/organisation.js (prefix or-). */
Hyper.add(

{
  id: 'shift-work', parent: 'org-topic', title: 'Shift work', level: 2,
  short: 'Working when the body clock expects sleep costs sleep, alertness and, over years, health. Rosters cannot remove that cost, but they can keep it small: few nights in a row, forward rotation, at least 11 h between shifts, 8-h shifts for heavy or safety-critical work, sensible start times and a say in the schedule.',
  keywords: ['shift work', 'night shift', 'rotating shifts', 'roster', 'rota', 'circadian rhythm', 'body clock', 'forward rotation', 'backward rotation', 'quick return', '12-hour shifts', 'permanent nights', 'working time directive', 'sleep debt', 'three-process model', 'on-call', 'watch system'],
  prereq: ['fatigue-rest-breaks', 'ergonomic-principles', 'medicine:sleep'],
  related: ['work-rest-scheduling', 'sustained-operations', 'ageing-workforce', 'psychosocial-factors', 'human-error', 'mental-workload', 'control-rooms', 'truck-bus-cabs', 'patient-handling', 'medicine:sleep-apnea'],
  body: `
Power stations, hospitals, police, armies, airlines, bakeries and data centres run around the clock, and roughly one European worker in five works shifts of some kind (European Working Conditions Survey, 2015). The trouble is not the hours themselves but **when** they fall.

### The body clock
A clock in the brain runs a rhythm of a little more than 24 h (about 24.2 h on average), reset each day mainly by light. Body temperature, the hormone melatonin and alertness follow it: alertness is lowest at roughly **02:00–06:00**, with a smaller dip in the early afternoon. A night worker works through the trough and tries to sleep at the peak, in daylight and household noise, so day sleep is typically one to several hours shorter and more broken. Most people never fully adapt: a review of melatonin studies (Folkard, 2008) found complete adjustment in only a few per cent of permanent night workers, because days off in daylight pull the clock back.

Alertness is well described by two processes added together: a sleep pressure that falls [[?exponential|exponentially]] while we are awake and recovers during sleep, and a circadian swing, close to a [[?sine-cosine|cosine]] with a 24-h period, whose timing ([[?phase]]) sets the trough (Åkerstedt and Folkard's three-process model). In the **body-clock simulation**, watch the first night shift: alertness stays below a day worker's bedtime level for almost the whole shift and is lowest near its end, after about 23 h awake. A nap before the shift lifts it.

### What the incident data say
Reviews pooling European studies (Folkard and Tucker, 2003) found these approximate trends:

| Factor | Relative risk of incidents |
|---|---|
| Shift | afternoons about 15–20 % and nights about 30 % above mornings |
| Consecutive nights | 2nd night +6 %, 3rd +17 %, 4th +36 % against the 1st |
| Shift length | 10 h about +13 %, 12 h about +27 % against 8 h |
| Hours on duty | rising after about the 9th hour |

### Designing a roster
| Choice | Recommendation | Why | Limitation |
|---|---|---|---|
| Direction | **forward**: morning → afternoon → night | the clock delays more easily than it advances; no short rests | the health evidence on direction is mixed |
| Speed | **fast**: 2–3 of each shift | few nights in a row, little disruption | the clock never adapts, by design |
| Rest | **≥ 11 h** between shifts; 2 full nights' sleep after a night block | time to travel, eat and sleep | backward rotation creates 8-h "quick returns" |
| Length | **8 h** for heavy, hot, monotonous or critical work; ≤ 12 h otherwise | risk rises with hours on duty | 12 h gives more days off, which many prefer |
| Early start | not before about **06:00–07:00** | people cannot fall asleep early enough | process and transport needs |

In the **roster simulation**, compare fast forward with fast backward rotation: the backward pattern shows two quick returns every cycle. A continuous 24/7 post at about 42 h a week needs 168/42 = 4 crews, and in practice five to cover leave and training.

### Settings
- **Health care**: 12-h nursing shifts are common; shifts beyond about 12 h have been linked to more errors (Rogers and colleagues, 2004). Doctors' hours are capped — 48 h a week on average in the EU, 80 h averaged over four weeks for US residents (ACGME).
- **Industry and process plants**: 8-h fast rotation or 12-h rosters; handovers need time and a checklist.
- **Offices and IT**: on-call rotas and work across time zones — set limits on calls and messages outside hours.
- **Military**: watches at sea and sustained operations (see [[sustained-operations]]); after collisions in 2017 the US Navy moved surface ships to watch schedules aligned with the body clock.
- **Field and transport**: drivers' hours rules, fly-in fly-out mining rosters of 12-h shifts, long harvest days.

> [!warn] The drive home after a night shift is one of the riskiest parts of it: nap first, share transport or use public transport. Persistent insomnia or sleepiness can be a treatable sleep disorder — see a doctor. Night work is classed as probably carcinogenic (IARC Group 2A); this page explains risks and is not medical advice.

> [!key] Few nights in a row, forward and fast rotation, at least 11 h between shifts, 8 h for hard or critical work, no very early starts — and let workers help design the roster.
`,
  ideas: [
    'The body clock runs about 24.2 h and is reset by light; alertness is lowest at roughly 02:00–06:00.',
    'Most night workers never fully adapt: days off in daylight pull the clock back.',
    'Incident risk rises on nights, over consecutive nights, and with shift length beyond 8 h.',
    'Forward, fast rotation with at least 11 h between shifts avoids quick returns and long runs of nights.',
    'Continuous cover needs about 168 / (weekly hours) crews, plus allowance for leave and training.'
  ],
  pitfalls: [
    'Permanent nights are best because the body adapts — Only a small minority adapt fully; most revert on days off and carry a lasting sleep debt.',
    'Twelve-hour shifts are always worse than eight — For light or moderate work with good breaks and few nights in a row they can work well; they are risky with heavy, hot or critical work and with overtime.',
    'A rota is fine if it meets the weekly-hours limit — Weekly averages hide quick returns, long runs of nights and very early starts, which drive most of the fatigue.'
  ],
  formulas: [
    {
      name: 'Rest between two shifts',
      expr: 'R = 24*d + s2 - s1 - L', tex: 'R = 24\\,d + s_2 - s_1 - L',
      vars: {
        R: { name: 'rest from the end of one shift to the start of the next', q: false, unit: 'h' },
        d: { name: 'days between the two start dates', value: 1, int: true },
        s2: { name: 'start of the next shift (clock hour)', q: false, unit: 'h', value: 6, min: 0, max: 24, tex: 's_2' },
        s1: { name: 'start of the first shift (clock hour)', q: false, unit: 'h', value: 14, min: 0, max: 24, tex: 's_1' },
        L: { name: 'length of the first shift, with overtime', q: false, unit: 'h', value: 8 }
      },
      note: 'Clock hours after midnight. A rest under 11 h is a "quick return": after travel, meals and winding down, little is left for sleep.',
      stories: { R: 'A shift starts at {s1} h and lasts {L}; the next one starts at {s2} h, {d} day later. How long is the rest?', L: 'A shift starts at {s1} h and the next at {s2} h, {d} day later. How long may the first shift last if {R} of rest must remain?' }
    },
    {
      name: 'Average weekly hours of a roster',
      expr: 'H = 7*n*L/c', tex: 'H = \\dfrac{7\\,n\\,L}{c}',
      vars: {
        H: { name: 'average weekly working hours', q: false, unit: 'h' },
        n: { name: 'shifts in one cycle of the roster', value: 4, int: true },
        L: { name: 'length of a shift', q: false, unit: 'h', value: 12 },
        c: { name: 'days in one cycle', value: 8, int: true }
      },
      note: 'Two 12-h days, two 12-h nights and four days off (an 8-day cycle) average 42 h a week.',
      stories: { H: 'A roster has {n} shifts of {L} in a cycle of {c} days. What are the average weekly hours?' }
    },
    {
      name: 'People needed for round-the-clock cover',
      expr: 'N = 168*k/H', tex: 'N = \\dfrac{168\\,k}{H}',
      vars: {
        N: { name: 'people (or crews) needed, before leave and training' },
        k: { name: 'people needed on duty at every hour', value: 1, int: true },
        H: { name: 'average weekly hours per person', q: false, unit: 'h', value: 42 }
      },
      note: 'A week has 168 h. Add roughly a fifth or more for holidays, sickness and training — which is why continuous plants often run five crews.',
      stories: { N: 'A post must be staffed by {k} people at every hour of the week, and each works {H} a week on average. How many people are needed?' }
    }
  ],
  examples: [
    {
      title: 'A quick return',
      q: 'A worker on a backward rotation finishes an afternoon shift (14:00–22:00) and starts a morning shift at 06:00 the next day. How long is the rest, and what is left for sleep?',
      steps: [
        '$R = 24 \\times 1 + 6 - 14 - 8 = 8$ h.',
        'Take away about 1 h of travel, a meal and some time to wind down: perhaps 5–6 h of sleep, and it starts late in the evening, when falling asleep is hard.',
        'That breaks the EU minimum of 11 h. A forward rotation (morning, then afternoon the next day) gives $24 + 14 - 6 - 8 = 24$ h instead.'
      ],
      a: '8 h — a quick return; forward rotation gives 24 h.'
    },
    {
      title: 'Crews for a control room',
      q: 'A control room needs one operator at every hour of the year. The roster is two 12-h days, two 12-h nights and four days off. How many operators are needed?',
      steps: [
        'Weekly hours: $H = 7 \\times 4 \\times 12 / 8 = 42$ h.',
        'Crews: $N = 168 \\times 1 / 42 = 4$.',
        'Holidays, sickness and training take roughly a fifth of each person\'s year, so a fifth crew or a relief pool is needed in practice.'
      ],
      a: 'Four crews on paper, about five in practice.'
    }
  ],
  quiz: [
    { q: 'Which pattern creates the most rests shorter than 11 h?', choices: ['Fast backward rotation: nights, afternoons, mornings', 'Fast forward rotation: mornings, afternoons, nights', 'Fixed day work', 'Weekly forward rotation'], a: 0, why: 'Going backwards each change starts the next shift earlier: night to afternoon and afternoon to morning each leave about 8 h.' },
    { q: 'Compared with the first night of a run, incident risk on the fourth consecutive night is roughly…', choices: ['a third higher', 'the same', 'half as high', 'ten times higher'], a: 0, why: 'Pooled studies found about +6 %, +17 % and +36 % on the second, third and fourth nights, as sleep debt builds.' },
    { q: 'Most people on permanent nights adapt fully to night work within a few weeks.', a: false, why: 'Melatonin studies show full adaptation in only a few per cent; daylight and normal life on days off pull the clock back.' },
    { q: 'A shift ends at 23:00 and the next begins at 07:00. How many hours of rest are there?', answer: 8, unit: 'h', why: 'From 23:00 to 07:00 is 8 h — below the 11-h minimum.' },
    { q: 'When are 12-h shifts least suitable?', choices: ['Heavy, hot or safety-critical work, or with overtime', 'Light work with good breaks', 'When workers want more days off', 'With few consecutive nights'], a: 0, why: 'Risk rises with hours on duty; heavy work, heat, critical tasks and overtime add to it.' }
  ],
  problems: [
    { q: 'An afternoon shift starts at 15:00 and runs 9 h with overtime. The next morning shift starts at 07:00. How long is the rest?', answer: 7, unit: 'h', tol: 0.01, steps: ['$R = 24 \\times 1 + 7 - 15 - 9 = 7$ h — a quick return of only 7 h.'] },
    { q: 'A ward needs 2 nurses on duty at every hour, and each nurse works 37.5 h a week on average. How many nurses are needed before leave is added?', answer: 8.96, unit: '', tol: 0.01, steps: ['$N = 168 \\times 2 / 37.5 = 8.96$ — nine nurses, and more once holidays and sickness are covered.'] }
  ],
  ranges: [
    { dim: 'Rest between the end of one shift and the start of the next', range: [11, null], unit: 'h', who: 'every worker; more after a block of nights', why: 'Time to travel, eat and still sleep 7–8 h.', limits: 'Exceptions exist by collective agreement (often in health care). After nights allow two full nights of sleep before day work.', setting: 'all', src: 'Directive 2003/88/EC (daily rest); HSE HSG256' },
    { dim: 'Length of a shift, including overtime', range: [8, 12], unit: 'h', who: '8 h for heavy, hot, monotonous, safety-critical or night work; up to 12 h for light or moderate work with good breaks', why: 'Incident risk rises with hours on duty — about +13 % at 10 h and +27 % at 12 h against 8 h.', limits: '12-h rosters give more days off and fewer handovers; combined with overtime or long runs of nights they are the riskiest.', setting: ['workshop', 'health', 'field'], src: 'HSE HSG256; Folkard and Tucker (2003)' },
    { dim: 'Night work in heavy or hazardous jobs', range: [null, 8], unit: 'h per 24 h', who: 'night workers whose work involves special hazards or heavy physical or mental strain', why: 'Keeps the hours worked at the low point of the body clock short.', limits: 'Applies in the EU; other countries leave it to sector rules.', setting: ['workshop', 'health', 'field'], src: 'Directive 2003/88/EC, Article 8' },
    { dim: 'Consecutive night shifts in a rotating roster', range: [2, 3], unit: 'nights', who: 'rotating shift workers', why: 'Sleep debt builds night by night; risk on the 4th night is about a third higher than on the 1st.', limits: 'Some 12-h and permanent-night rosters work 4 or more; then keep runs short and follow them with at least 2 days off.', setting: ['workshop', 'health', 'military'], src: 'HSE HSG256; Folkard and Tucker (2003)' },
    { dim: 'Rotation of a shift system', range: 'forward (morning → afternoon → night), fast (2–3 of each)', unit: '', who: 'rotating shift workers', why: 'Delays suit the body clock; fast rotation keeps runs of nights short and avoids quick returns.', limits: 'Slow rotation or fixed shifts suit some people better; individual preference and family life matter.', setting: 'all', src: 'Knauth and Hornberger (2003); HSE HSG256' },
    { dim: 'Start of an early (morning) shift', range: 'not before about 06:00–07:00', unit: '', who: 'morning-shift workers, especially evening types and long commuters', why: 'Few people can fall asleep early enough; sleep before very early starts is cut short.', limits: 'Transport, bakeries and process handovers may need earlier starts — then keep runs of early shifts short.', setting: ['workshop', 'health', 'field'], src: 'HSE HSG256' },
    { dim: 'Weekly working time, averaged', range: [null, 48], unit: 'h', who: 'every worker in the EU, averaged over up to 4 months', why: 'Leaves time for recovery; long weekly hours bring more accidents and poorer health.', limits: 'Some countries allow individual opt-outs; US federal law sets no general limit — only sector rules (drivers, pilots, resident doctors).', setting: 'all', src: 'Directive 2003/88/EC' }
  ],
  applications: [
    'Designing rosters for hospitals, control rooms, process plants, police and emergency services.',
    'Fatigue risk management in aviation, rail and road transport, where duty-time rules and fatigue models are used together.',
    'Checking a proposed roster for quick returns, long runs of nights and early starts before it is agreed; the time ranges of this page are collected in [the Dimension finder](#/tools/ranges).',
    'Planning naps, lighting and transport home for night workers.'
  ],
  history: 'Robert Owen called for "eight hours labour, eight hours recreation, eight hours rest" in 1817; the first convention of the International Labour Organization (1919) set 8 h a day and 48 h a week for industry, and the ILO\'s Night Work Convention (No. 171, 1990) added protection for night workers. The science of the body clock grew from the 1960s, and studies of shift rosters, accidents and sleep since the 1970s underlie today\'s guidance.',
  sources: [
    'Directive 2003/88/EC of the European Parliament and of the Council concerning certain aspects of the organisation of working time.',
    'Health and Safety Executive, *Managing shiftwork: Health and safety guidance*, HSG256 (2006).',
    'S. Folkard and P. Tucker, "Shift work, safety and productivity", *Occupational Medicine* 53 (2003).',
    'P. Knauth and S. Hornberger, "Preventive and compensatory measures for shift workers", *Occupational Medicine* 53 (2003).',
    'S. Folkard, "Do permanent night workers show circadian adjustment? A review based on the endogenous melatonin rhythm", *Chronobiology International* 25 (2008).',
    'T. Åkerstedt and S. Folkard, "The three-process model of alertness and its extension to performance, sleep latency and sleep length", *Chronobiology International* 14 (1997).',
    'IARC Monographs on the Identification of Carcinogenic Hazards to Humans, volume 124, *Night Shift Work* (2020).',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, chapters on fatigue, night and shift work.'
  ],
  sim: ['or-roster', 'or-body-clock']
},

{
  id: 'fatigue-rest-breaks', parent: 'org-topic', title: 'Fatigue and rest breaks', level: 2,
  short: 'Fatigue builds with time on task and time awake, and recovery is fastest in the first minutes of a rest. So short, frequent breaks — before fatigue sets in — beat long, rare ones for the same total rest. Legal minimums set a floor; screen, repetitive, monitoring and driving work each have their own rhythm of breaks.',
  keywords: ['fatigue', 'rest break', 'micro-break', 'micropause', 'break schedule', 'time on task', 'vigilance decrement', 'recovery', 'mental fatigue', 'muscle fatigue', 'sleepiness', 'drivers hours', 'screen breaks', 'work recovery ratio', 'fatigue risk management'],
  prereq: ['static-muscle-work', 'mental-workload', 'ergonomic-principles'],
  related: ['shift-work', 'work-rest-scheduling', 'job-rotation', 'repetitive-strain', 'standing-all-day', 'assembly-lines', 'keyboard-mouse', 'control-rooms', 'truck-bus-cabs', 'sustained-operations', 'perception-attention', 'medicine:sleep'],
  body: `
Fatigue is a loss of capacity that rest restores. It comes in several kinds, and each needs its own kind of rest:

| Kind | What builds it | What relieves it | Recovery takes |
|---|---|---|---|
| Local muscle | holding, gripping, repeating one movement | pauses, changing posture and task | seconds to minutes |
| Whole-body | heavy dynamic work, heat | rest, cooling, drinking | minutes to hours |
| Mental | sustained attention, complex decisions | a change of task, a break away from it | minutes |
| Sleepiness | time awake, night work, sleep loss | sleep (a nap helps briefly) | hours |
| Monotony | dull, repetitive, low-demand work | variety, activity, company | minutes |

### Recovery is fastest at the start
After an effort, recovery follows roughly an [[?exponential]] curve: the fraction recovered after a rest of length $t$ is about $1 - e^{-t/\\tau}$, with a time constant $\\tau$ that depends on the kind of fatigue. With $\\tau$ = 6 min, 3 min of rest restores about 40 %, 6 min about 63 % and 15 min about 92 %: the first minutes are worth the most. Fatigue also builds faster the more fatigued a muscle already is — the rest needed grows faster than the time worked (Rohmert). Both facts point the same way: **break before fatigue builds, and break often**. In the **break-schedule simulation**, give the same total rest as two 15-min breaks or as a few minutes every hour: the peaks are lower with frequent breaks. A field study by NIOSH (Galinsky and colleagues, 2000) added four 5-min breaks to data-entry work and found less discomfort and eyestrain with no loss of output.

### Time on task
- **Risk between breaks.** In a plant with a break every 2 h, incident risk rose steadily through each spell, to about double in the last half hour compared with the first half hour after the break (Tucker, Folkard and Macdonald, 2003).
- **Vigilance.** Watching for rare signals — radar, X-ray baggage screening, CCTV, process alarms — gets harder quickly: in Mackworth's clock test (1948) detection fell within the first half hour. Rotate monitoring tasks every 20–30 min or so. The **vigilance simulation** shows the sawtooth.
- **Time awake.** After 17–19 h awake, performance on some tests is as poor as at a blood alcohol concentration of 0.05 %, and after about 24 h as at 0.10 % (Dawson and Reid, 1997; Williamson and Feyer, 2000).

### Break schedules, by setting
| Setting | Typical rhythm | Basis |
|---|---|---|
| Any job over 6 h | a break; 20 min in the UK, 30 min (6–9 h) or 45 min (> 9 h) in Germany | Directive 2003/88/EC and national law |
| Screen work | 5–10 min after 50–60 min, better than 15 min every 2 h | EU display-screen directive; HSE guidance |
| Repetitive hand work | about 10 min of recovery in each hour (≈ 5 : 1) | OCRA method, ISO 11228-3 |
| Monitoring | a different task after about 20–30 min | vigilance research |
| Driving | 45 min after 4.5 h of driving (EU); 30 min after 8 h (US trucks) | EU Regulation 561/2006; FMCSA |
| Health care, military | protected breaks and naps on long shifts; rotating sentries | practice |

The US sets no general federal break rule for adults; some states do. A **micro-break** is a change, not a phone: stand, shake out the hands, look into the distance.

### Virtues and limits
Scheduled breaks protect the workers who would not take them — on paced lines, in understaffed wards, in control rooms. They cost less output than they seem to: rested people work faster and make fewer errors. But breaks do not fix a task that overloads: a lift with a lifting index of 3 stays risky however often it is interrupted (see [[job-rotation]]).

> [!warn] Falling asleep at work or at the wheel, or fatigue that rest does not relieve, needs attention — the second may be a medical problem (see a doctor). This page is not medical advice.

> [!key] Rest early and often: short, frequent breaks before fatigue builds, a change of task for monitoring work, and schedules that do not leave breaks to chance.
`,
  ideas: [
    'Fatigue comes in kinds — muscle, whole-body, mental, sleepiness, monotony — and each needs its own rest.',
    'Recovery is roughly exponential: the first minutes of a break restore the most.',
    'Short, frequent breaks keep fatigue lower than long, rare ones with the same total rest.',
    'Risk rises through each spell of work; vigilance falls within 20–30 min of monitoring.',
    'Legal minimum breaks are a floor; screen, repetitive, monitoring and driving work need their own rhythm.'
  ],
  pitfalls: [
    'Breaks cost output in proportion to their length — Studies of added short breaks found less discomfort with no loss of output: rested people work faster and more accurately.',
    'A long break at lunch makes up for a morning without pauses — Recovery is fastest at the start of a rest and fatigue builds faster when it is already high; short, frequent breaks are more efficient.',
    'Workers will take breaks when they need them — On paced lines, in short-staffed wards and in control rooms they often cannot; breaks must be scheduled and covered.'
  ],
  formulas: [
    {
      name: 'Recovery during a break (a simple model)',
      expr: 'f = 1 - exp(-t/tau)', tex: 'f = 1 - e^{-t/\\tau}',
      vars: {
        f: { name: 'fraction of the fatigue recovered', q: 'ratio', unit: '%' },
        t: { name: 'length of the break', q: 'time', unit: 'min', value: 5 },
        tau: { name: 'recovery time constant', q: 'time', unit: 'min', value: 6, tex: '\\tau' }
      },
      note: 'An exponential model of recovery. The time constant ranges from seconds (a light local effort) to hours (heavy whole-body work); sleepiness needs sleep.',
      stories: { f: 'Recovery has a time constant of {tau}. What fraction is recovered in a break of {t}?', t: 'With a time constant of {tau}, how long must a break be to recover {f}?' }
    },
    {
      name: 'Share of the shift spent in short breaks',
      expr: 'b = n*tb/T', tex: 'b = \\dfrac{n\\,t_b}{T}',
      vars: {
        b: { name: 'share of the shift in the breaks', q: 'ratio', unit: '%' },
        n: { name: 'number of breaks', value: 24, int: true },
        tb: { name: 'length of each break', q: 'time', unit: 'min', value: 1, tex: 't_b' },
        T: { name: 'length of the shift', q: 'time', unit: 'h', value: 8 }
      },
      note: 'Micro-breaks cost little time: a minute every 20 min is 5 % of the shift.',
      stories: { b: '{n} breaks of {tb} are taken in a {T} shift. What share of the shift is that?' }
    }
  ],
  examples: [
    {
      title: 'The first minutes are worth the most',
      q: 'Suppose recovery from a repetitive task has a time constant of 6 min. How much is recovered after 3, 6 and 15 min of rest?',
      steps: [
        '3 min: $1 - e^{-0.5} = 0.39$, about 39 %.',
        '6 min: $1 - e^{-1} = 0.63$, about 63 %.',
        '15 min: $1 - e^{-2.5} = 0.92$, about 92 %.',
        'The first 3 min give about 13 points a minute; minutes 6–15 give about 3 points a minute.'
      ],
      a: 'About 39 %, 63 % and 92 % — frequent short breaks use the steep start of the curve.'
    },
    {
      title: 'A driver\'s day in the EU',
      q: 'A truck driver in the EU may drive 4.5 h before a 45-min break and up to 9 h a day. Plan a 9-h driving day.',
      steps: [
        'Drive 4.5 h, then take 45 min (or 15 min followed later by 30 min).',
        'Drive the second 4.5 h.',
        'The day then spans at least 9 h 45 min, before loading, other work and the daily rest.'
      ],
      a: 'Two spells of 4.5 h with at least 45 min between them.'
    }
  ],
  quiz: [
    { q: 'For the same total rest in a shift, which schedule usually keeps fatigue lowest?', choices: ['Many short breaks spread through the shift', 'One long break in the middle', 'All the rest at the end', 'It makes no difference'], a: 0, why: 'Recovery is fastest at the start of a rest and fatigue builds faster when it is already high, so frequent short breaks are more efficient.' },
    { q: 'In a plant with a break every 2 h, how did incident risk in the last half hour before a break compare with the first half hour after it?', choices: ['About double', 'About the same', 'About half', 'Ten times higher'], a: 0, why: 'Tucker, Folkard and Macdonald (2003) found risk rising steadily between breaks, to about twice the level just after the break.' },
    { q: 'After about 17–19 h awake, performance on some tests resembles that at a blood alcohol concentration of about…', choices: ['0.05 %', '0.005 %', '0.5 %', '0 % — time awake has no such effect'], a: 0, why: 'Studies comparing sleep loss with alcohol found 17–19 h awake similar to 0.05 %, and about 24 h similar to 0.10 %.' },
    { q: 'Extra short breaks in data-entry work reduce output in proportion to their length.', a: false, why: 'NIOSH\'s field study added 5-min breaks and found less discomfort and eyestrain with no loss of output.' },
    { q: 'A monitoring task (rare targets on a screen) should be changed or rotated about every…', choices: ['20–30 min', '4 h', '8 h', 'never — practice keeps performance steady'], a: 0, why: 'The vigilance decrement appears within the first half hour; changing task restores detection.' }
  ],
  problems: [
    { q: 'A worker takes a 1-min micro-break every 20 min through an 8-h shift (24 breaks). What share of the shift do they take?', answer: 5, unit: '%', tol: 0.01, steps: ['$b = 24 \\times 1 / 480 = 0.05$, that is 5 %.'] },
    { q: 'If recovery has a time constant of 8 min, how long a break recovers 80 %?', answer: 12.9, unit: 'min', tol: 0.02, steps: ['$0.8 = 1 - e^{-t/8}$, so $t = -8 \\ln 0.2 = 12.9$ min.'] }
  ],
  ranges: [
    { dim: 'Rest break in a working day over 6 h', range: [20, 45], unit: 'min', who: 'every worker; 20 min in the UK, 30 min (6–9 h) or 45 min (over 9 h) in Germany', why: 'A real pause to eat, drink and recover once in a long spell.', limits: 'A legal floor, not a design: it does nothing for the fatigue that builds in the hours between.', setting: 'all', src: 'Directive 2003/88/EC and national law' },
    { dim: 'Screen work: a break or change of activity', range: [5, 10], unit: 'min per 50–60 min', who: 'people at display screens', why: 'Rests the eyes, neck, shoulders and hands before discomfort builds.', limits: 'Changing to other work counts; short frequent pauses beat longer rare ones.', setting: 'office', src: 'Directive 90/270/EEC; HSE guidance on display screen equipment' },
    { dim: 'Micro-breaks in repetitive or static work', range: 'about 30 s – 2 min every 20–30 min', unit: '', who: 'keyboard, assembly, laboratory and surgical work', why: 'Uses the steep start of recovery; restores blood flow to held muscles.', limits: 'Must be a real change of posture or activity; on paced lines they need cover or buffers.', setting: ['office', 'workshop', 'health'], src: 'Studies of micro-breaks (e.g. McLean et al., 2001); Kroemer and Grandjean' },
    { dim: 'Recovery in repetitive hand and arm work', range: 'about 10 min in each hour (work : recovery ≈ 5 : 1)', unit: '', who: 'assembly, packing, checkout and processing work', why: 'Lets tendons and muscles recover; hours without recovery raise the risk of disorders.', limits: 'Recovery may be a break or a task that rests the same body region.', setting: 'workshop', src: 'OCRA method, ISO 11228-3' },
    { dim: 'Continuous monitoring before a change of task', range: [20, 30], unit: 'min', who: 'radar, X-ray screening, CCTV and alarm monitoring', why: 'Detection of rare signals falls within the first half hour.', limits: 'Depends on target rate, difficulty and time of day; nights need shorter spells.', setting: ['civil', 'military', 'workshop'], src: 'Vigilance research since Mackworth (1948)' },
    { dim: 'Longest spell of work without a break in safety-critical work', range: [null, 2], unit: 'h', who: 'operators, drivers, machine and process workers', why: 'Incident risk roughly doubles over a 2-h spell.', limits: 'Shorter for heavy, hot or monotonous work and at night.', setting: ['workshop', 'field', 'vehicle'], src: 'Tucker, Folkard and Macdonald (2003)' },
    { dim: 'Driving before a break (truck and bus drivers)', range: [null, 4.5], unit: 'h', who: 'professional drivers in the EU: then 45 min of break', why: 'Limits time-on-task fatigue on long drives.', limits: 'US truck drivers: 30 min after 8 h of driving; other countries differ. Breaks do not cure sleepiness from sleep loss.', setting: 'vehicle', src: 'Regulation (EC) No 561/2006; US FMCSA hours of service' }
  ],
  applications: [
    'Break schedules for assembly lines, checkouts, call centres and control rooms.',
    'Rotation of X-ray screeners, CCTV operators and sentries.',
    'Drivers\' hours rules and fatigue risk management in transport and aviation.',
    'Micro-break prompts and task variety in screen work.'
  ],
  history: 'During the First World War the British Health of Munition Workers Committee found that cutting very long working weeks did not reduce output — output per hour rose — and the Industrial Fatigue Research Board that followed studied breaks, hours and output. Norman Mackworth\'s clock test (1948), built to understand why radar operators missed submarine echoes, founded the study of vigilance.',
  sources: [
    'P. Tucker, S. Folkard and I. Macdonald, "Rest breaks and accident risk", *The Lancet* 361 (2003).',
    'T. R. Galinsky, N. G. Swanson, S. L. Sauter et al., "A field study of supplementary rest breaks for data-entry operators", *Ergonomics* 43 (2000).',
    'N. H. Mackworth, "The breakdown of vigilance during prolonged visual search", *Quarterly Journal of Experimental Psychology* 1 (1948).',
    'D. Dawson and K. Reid, "Fatigue, alcohol and performance impairment", *Nature* 388 (1997); A. M. Williamson and A.-M. Feyer, "Moderate sleep deprivation produces impairments in cognitive and motor performance equivalent to legally prescribed levels of alcohol intoxication", *Occupational and Environmental Medicine* 57 (2000).',
    'Council Directive 90/270/EEC on work with display screen equipment; Directive 2003/88/EC on working time; Regulation (EC) No 561/2006 on drivers\' hours.',
    'ISO 11228-3, *Ergonomics — Manual handling — Part 3: Handling of low loads at high frequency* (the OCRA method).',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, chapters on fatigue and rest pauses.'
  ],
  sim: ['or-breaks', 'or-vigilance']
},

{
  id: 'work-rest-scheduling', parent: 'org-topic', title: 'Energy expenditure and work–rest cycles', level: 2,
  short: 'Heavy work spends energy faster than the body can keep up with for a whole shift, and heat adds a second bill. Over 8 h people sustain about a third of their aerobic capacity; above that, rest must be built into every hour — more for smaller, older or less fit workers, and more again in the heat, unless the rest area is cool.',
  keywords: ['metabolic rate', 'energy expenditure', 'work-rest cycle', 'rest allowance', 'Murrell', 'aerobic capacity', 'VO2max', 'oxygen uptake', 'heavy work', 'heat stress', 'WBGT', 'NIOSH REL', 'acclimatisation', 'heart rate', 'ISO 8996', 'ISO 7243', 'kcal/min'],
  prereq: ['fatigue-rest-breaks', 'heat-stress', 'physics:power'],
  related: ['shift-work', 'job-rotation', 'ageing-workforce', 'outdoor-heat-sun', 'extreme-environments', 'load-carriage', 'construction-ergonomics', 'agriculture-ergonomics', 'carrying-loads', 'thermal-comfort', 'medicine:metabolism-energy', 'medicine:heat-cold', 'medicine:physical-activity'],
  body: `
The body is an engine that runs on oxygen. At rest an adult burns about 100–120 W; shovelling fast, 500 W or more. Each litre of oxygen used releases about 20 kJ, so an oxygen uptake of 1 L/min is roughly 340 W — or 5 kcal/min, the classic unit of work physiology. A person's ceiling is the **aerobic capacity** ($\\dot V_{O_2\\,\\mathrm{max}}$): about 2–2.5 L/min for young women and 3–3.5 L/min for young men, falling by roughly 10 % a decade with age, with wide differences in fitness.

### How hard is the work?
ISO 8996 sorts work into classes of metabolic rate per square metre of body surface; for a typical adult (1.8 m²):

| Class | W/m² | Watts | Examples |
|---|---|---|---|
| Resting | 65 | ≈ 115 | sitting at ease |
| Low | 100 | ≈ 180 | light hand work sitting, driving, light assembly standing |
| Moderate | 165 | ≈ 300 | steady arm work, hammering, walking 3.5–5.5 km/h |
| High | 230 | ≈ 415 | heavy arm and trunk work, carrying, shovelling, sawing |
| Very high | 290 | ≈ 520 | fast digging or shovelling, climbing stairs or ladders |

### What a person can sustain
Over a full shift most people settle at about **30–40 % of their aerobic capacity** — about a third. Above that, fatigue builds and must be paid back with rest. **Murrell's rest allowance** (1965) sizes the pay-back:

$$R = T\\,\\frac{M - S}{M - M_r}$$

where $M$ is the rate while working, $M_r$ ≈ 105 W (1.5 kcal/min) the rate at rest, and $S$ the level that can be sustained all day — Murrell took 5 kcal/min, about 350 W. The idea: rest is the time needed to bring the shift's average down to $S$. Its virtue is a number instead of a guess. Its limitation is $S$: 350 W is about a third of a fit young man's capacity, but well over a third for a 55-year-old woman with 1.8 L/min (606 W). Scale $S$ to the actual workers.

In the **work–rest simulation**, pick very heavy work at 520 W and change the worker from a 25-year-old man to a 55-year-old woman of average fitness: the rest needed in each hour grows from about a quarter of an hour to three quarters.

### Heat adds a second bill
In the heat, the same work also loads the circulation and sweating (see [[heat-stress]]). Limits for heat combine the [[?logarithm]] of the metabolic rate with the wet-bulb globe temperature (WBGT). NIOSH (2016) recommends, for acclimatised workers,

$$\\mathrm{WBGT}_{\\lim} = 56.7 - 11.5\\,\\log_{10} M$$

and $59.9 - 14.1\\,\\log_{10} M$ for workers who are not; both $M$ and WBGT are averaged over the hour. At 300 W that is about 28 °C and 25 °C. Two levers follow: less work in each hour — schedules of 45/15, 30/30 and 15/45 min as WBGT rises — and a **cool, shaded rest area**, which lowers the hour's average WBGT and buys work time. In the simulation, cool the rest area from 30 °C to 25 °C and watch the work share rise.

### Settings
- **Workshops and industry**: foundries, glass, laundries, kitchens — hot and heavy in bursts; spot cooling and cool rest rooms.
- **Construction, agriculture and field work**: sun, radiant heat and long days; start early, rest in shade, rotate heavy tasks (see [[outdoor-heat-sun]]).
- **Military**: marches with loads (see [[load-carriage]]) and protective suits that trap heat; work–rest tables are part of doctrine.
- **Health care**: patient handling is heavy in short peaks; the average is moderate, the peaks are the problem (see [[patient-handling]]).
- **Offices**: sitting is about 1–1.2 times the resting rate; energy is not the issue, sitting still is.

> [!warn] Heat illness can kill. Confusion, collapse or hot skin in a hot environment is an emergency — cool the person and call your local emergency number. New workers must acclimatise over about a week. This page is not medical advice.

> [!key] Keep the hour's average near a third of the workers' own capacity, build rest into every hour of heavy work, and in the heat give both shorter work spells and a cool place to rest.
`,
  ideas: [
    'One litre of oxygen a minute is about 340 W (5 kcal/min); aerobic capacity sets each person\'s ceiling.',
    'Over a full shift people sustain about 30–40 % of their aerobic capacity.',
    'Murrell\'s rest allowance brings the shift\'s average energy expenditure down to a sustainable level.',
    'The sustainable level must match the workers: 350 W suits fit young men, not everyone.',
    'In the heat, WBGT limits fall with metabolic rate; shorter work spells and a cool rest area both help.'
  ],
  pitfalls: [
    'Heavy work only needs a longer lunch — The rest must be spread through every hour, or fatigue and heat strain build up within the hour.',
    '5 kcal/min is a safe limit for everyone — It was set for fit young men; for smaller, older or less fit workers the sustainable level is much lower.',
    'Resting in the hot workplace is as good as resting elsewhere — The hour is judged by its average WBGT: a cool, shaded rest area allows more work time.'
  ],
  formulas: [
    {
      name: 'Murrell\'s rest allowance',
      expr: 'R = T*(M - S)/(M - Mr)', tex: 'R = T\\,\\dfrac{M - S}{M - M_r}',
      vars: {
        R: { name: 'rest needed in the period', q: 'time', unit: 'min' },
        T: { name: 'length of the period (a shift, or an hour)', q: 'time', unit: 'min', value: 480 },
        M: { name: 'metabolic rate while working', q: 'power', unit: 'W', value: 560 },
        S: { name: 'rate that can be sustained all day (Murrell: 350 W)', q: 'power', unit: 'W', value: 350 },
        Mr: { name: 'metabolic rate at rest', q: 'power', unit: 'W', value: 105, tex: 'M_r' }
      },
      note: 'For M above S only. 5 kcal/min ≈ 350 W; 1.5 kcal/min ≈ 105 W. Take S as about a third of the actual workers\' aerobic capacity.',
      stories: { R: 'A worker shovels at {M} for a {T} shift. The sustainable level is {S} and resting costs {Mr}. How much rest is needed?', S: 'A task at {M} needs {R} of rest in {T} (rest at {Mr}). What sustainable level does that assume?' }
    },
    {
      name: 'Heat limit for acclimatised workers (NIOSH REL)',
      expr: 'W = 56.7 - 11.5*log(M)', tex: '\\mathrm{WBGT}_{\\lim} = 56.7 - 11.5\\,\\log_{10} M',
      vars: {
        W: { name: 'WBGT limit, averaged over the hour', q: false, unit: '°C', tex: '\\mathrm{WBGT}_{\\lim}' },
        M: { name: 'metabolic rate, averaged over the hour', q: false, unit: 'W', value: 300, min: 80, max: 1000 }
      },
      note: 'NIOSH (2016); ISO 7243:2017 uses the same curve. For workers who are not acclimatised use 59.9 − 14.1 log₁₀ M. For a standard worker of about 70 kg and 1.8 m²; clothing adjustments apply.',
      stories: { W: 'Acclimatised workers average {M} over the hour. Up to what WBGT may they work?', M: 'The WBGT is {W}. What average metabolic rate may acclimatised workers keep up?' }
    },
    {
      name: 'Metabolic rate from oxygen uptake',
      expr: 'M = 1000*k*V/60', tex: 'M = \\dfrac{1000\\,k\\,\\dot V}{60}',
      vars: {
        M: { name: 'metabolic rate', q: false, unit: 'W' },
        k: { name: 'energy per litre of oxygen', q: false, unit: 'kJ/L', value: 20.2, fixed: true },
        V: { name: 'oxygen uptake', q: false, unit: 'L/min', value: 1.2, tex: '\\dot V' }
      },
      note: 'k is about 19.6 kJ/L when burning fat and 21.1 kJ/L when burning carbohydrate; 20.2 kJ/L suits a mixed diet.',
      stories: { M: 'A worker uses {V} of oxygen. What is the metabolic rate?', V: 'What oxygen uptake does a metabolic rate of {M} need?' }
    }
  ],
  examples: [
    {
      title: 'Rest for shovelling',
      q: 'A labourer shovels at 560 W (8 kcal/min). With Murrell\'s standard of 350 W and 105 W at rest, how much of an 8-h shift must be rest?',
      steps: [
        '$R = 480 \\times (560 - 350)/(560 - 105) = 480 \\times 210/455 = 222$ min.',
        'Work time: $480 - 222 = 258$ min — about 28 min of rest in every hour.',
        'Spread the rest through each hour: 30 min of shovelling, then 30 min of rest, would let fatigue build within the hour.'
      ],
      a: 'About 220 min of rest in 8 h — close to half of every hour.'
    },
    {
      title: 'The same task, a different worker',
      q: 'A 55-year-old woman has an aerobic capacity of 1.8 L/min. Her task runs at 300 W. Using a third of her capacity as the sustainable level, how much rest does she need in each hour?',
      steps: [
        'Capacity: $1000 \\times 20.2 \\times 1.8/60 = 606$ W; a third is 202 W.',
        '$R = 60 \\times (300 - 202)/(300 - 105) = 60 \\times 98/195 = 30$ min in each hour.',
        'With Murrell\'s 350 W the task (300 W) would seem to need no rest at all: the standard fits fit young men.'
      ],
      a: 'About 30 min in each hour — the fixed standard would have said none.'
    },
    {
      title: 'A cool rest area buys work time',
      q: 'Acclimatised workers do moderate work (300 W) at a WBGT of 30 °C; seated rest costs 115 W. How much of each hour may they work if they rest (a) in the same heat, (b) in shade at 25 °C?',
      steps: [
        '(a) The hour\'s average WBGT is 30 °C, so the average metabolic rate may be at most $10^{(56.7-30)/11.5} = 210$ W.',
        'Mixing 300 W and 115 W: work share $(210 - 115)/(300 - 115) = 0.51$ — about 31 min of work and 29 min of rest.',
        '(b) Now the average WBGT falls with the rest time too. Solving $56.7 - 11.5 \\log_{10}(115 + 185x) = 25 + 5x$ gives $x \\approx 0.78$ — about 47 min of work and 13 min of rest.'
      ],
      a: '(a) about 30/30; (b) about 47/13 — the cool rest area adds a quarter of an hour of work.'
    }
  ],
  quiz: [
    { q: 'Over a full 8-h shift, roughly what share of their aerobic capacity can most people sustain?', choices: ['About a third (30–40 %)', 'About 80 %', 'About 10 %', '100 % — capacity is what can be sustained'], a: 0, why: 'Work physiology finds people settle at about a third of capacity for a shift; higher levels need rest to pay back.' },
    { q: 'Two workers do the same 300 W task. Who needs more rest?', choices: ['A 55-year-old woman with 1.8 L/min capacity', 'A 25-year-old man with 3.5 L/min capacity', 'Both the same — the task sets the rest', 'Neither'], a: 0, why: 'The same task is a larger share of a smaller capacity: about half of her capacity against a quarter of his.' },
    { q: 'Why does a cool, shaded rest area allow more work in hot conditions?', choices: ['The hour is judged by its time-weighted WBGT, which the cool rest lowers', 'Shade lowers the metabolic rate of the work', 'It does not — only the work area matters', 'Cool air makes workers acclimatise faster'], a: 0, why: 'Heat limits use the hour\'s average WBGT and metabolic rate; cooler rest lowers the average.' },
    { q: 'Using the NIOSH REL, what is the WBGT limit for acclimatised workers averaging 415 W?', answer: 26.6, unit: '°C', why: '$56.7 - 11.5 \\log_{10} 415 = 56.7 - 30.1 = 26.6$ °C.' },
    { q: 'Once a worker is acclimatised, the metabolic rate of a task no longer matters for heat stress.', a: false, why: 'Acclimatisation raises the limit by a few degrees, but it still falls as the work gets heavier.' }
  ],
  problems: [
    { q: 'Digging runs at 450 W. With Murrell\'s standard (350 W) and 105 W at rest, how much rest is needed in an 8-h (480-min) shift?', answer: 139, unit: 'min', tol: 0.01, steps: ['$R = 480 \\times (450 - 350)/(450 - 105) = 480 \\times 100/345 = 139$ min.'] },
    { q: 'What is the NIOSH REL (acclimatised) for very heavy work averaging 520 W?', answer: 25.5, unit: '°C', tol: 0.01, steps: ['$\\log_{10} 520 = 2.716$.', '$56.7 - 11.5 \\times 2.716 = 25.5$ °C.'] }
  ],
  ranges: [
    { dim: 'Average energy expenditure over an 8-h shift', range: [250, 350], unit: 'W', who: 'about 4–5 kcal/min; 350 W (5 kcal/min) was Murrell\'s level for fit young men', why: 'Work below this level can go on all shift without building fatigue.', limits: 'Lower for smaller, older or less fit workers — use about a third of the actual workers\' capacity; heat lowers it further.', setting: ['workshop', 'field', 'military'], src: 'Murrell (1965); Kroemer and Grandjean' },
    { dim: 'Share of aerobic capacity sustained over a shift', range: [30, 40], unit: '%', who: 'healthy adults over about 8 h', why: 'Keeps heart rate and fatigue steady through the shift.', limits: 'Shorter spells allow more, longer shifts less; peaks above it need rest to follow.', setting: ['workshop', 'field', 'military'], src: 'Work-physiology texts (Åstrand and Rodahl; Kroemer and Grandjean)' },
    { dim: 'Average working heart rate above resting', range: 'about 30–40 beats/min', unit: '', who: 'rule of thumb for a full shift of physical work', why: 'A simple field check that the work is sustainable.', limits: 'Heat, stress and static work raise heart rate too; medicines and fitness change it. A screening check, not a diagnosis.', setting: ['workshop', 'field'], src: 'Rules of thumb in work physiology' },
    { dim: 'WBGT limit for moderate work (≈ 300 W)', range: 'about 25 °C (not acclimatised) to 28 °C (acclimatised)', unit: '', who: 'workers in normal work clothing, averaged over the hour', why: 'Keeps core temperature within safe limits for nearly all healthy workers.', limits: 'Protective clothing lowers the limit by several degrees; individual risk factors vary.', setting: ['workshop', 'field', 'military'], src: 'NIOSH (2016); ISO 7243:2017' },
    { dim: 'Work–rest regimen in the heat', range: 'continuous → 45/15 → 30/30 → 15/45 min per hour', unit: '', who: 'hot work as WBGT rises above the limit for continuous work', why: 'Brings the hour\'s averages of metabolic rate and WBGT back under the limit.', limits: 'Rest must be in a cooler place to help fully; at extreme heat stop work or change the task.', setting: ['workshop', 'field', 'military'], src: 'ACGIH TLVs for heat stress; NIOSH (2016)' },
    { dim: 'Time in the heat on the first day for a new worker', range: [null, 20], unit: '% of the usual time', who: 'new workers, then no more than 20 % more each day', why: 'Acclimatisation over about a week raises sweating and lowers heart rate.', limits: 'Workers returning after a week or more away need to re-acclimatise (NIOSH: about 50, 60, 80 and 100 % on days 1–4).', setting: ['workshop', 'field', 'military'], src: 'NIOSH (2016)' },
    { dim: 'Drinking during hot work', range: 'about 250 mL every 15–20 min, no more than about 1.4 L an hour', unit: '', who: 'workers sweating heavily', why: 'Replaces sweat before thirst and dehydration build.', limits: 'Too much plain water over many hours can also harm; long shifts need food or electrolytes — follow local occupational health advice.', setting: ['workshop', 'field', 'military'], src: 'NIOSH (2016); OSHA heat guidance' }
  ],
  applications: [
    'Rest schedules for foundries, glass works, laundries and commercial kitchens.',
    'Work–rest tables for construction, agriculture and military training in hot weather.',
    'Choosing which heavy tasks to mechanise first: the ones that push workers furthest above a third of their capacity.',
    'Planning hot-weather shifts: early starts, shaded rest areas, water and acclimatisation — check a WBGT with [the heat-stress calculator](#/tools/environment/heat).'
  ],
  history: 'Work physiology grew in the early 20th century from measurements of oxygen uptake during work. K. F. H. Murrell, who is credited with coining the word *ergonomics* in 1949, gave his rest allowance in *Ergonomics: Man in his Working Environment* (1965). The WBGT index was developed in the 1950s for US military training camps to cut heat casualties.',
  sources: [
    'ISO 8996, *Ergonomics of the thermal environment — Determination of metabolic rate*.',
    'ISO 7243:2017, *Ergonomics of the thermal environment — Assessment of heat stress using the WBGT (wet bulb globe temperature) index*.',
    'NIOSH, *Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments*, DHHS (NIOSH) Publication 2016-106.',
    'K. F. H. Murrell, *Ergonomics: Man in his Working Environment* (Chapman and Hall, 1965) — the rest allowance.',
    'P.-O. Åstrand, K. Rodahl et al., *Textbook of Work Physiology* — aerobic capacity and sustained work.',
    'K. H. E. Kroemer and E. Grandjean, *Fitting the Task to the Human*, chapters on heavy work and energy expenditure.'
  ],
  sim: ['or-work-rest', { id: 'or-work-rest', params: { mode: 'heat' } }]
},

{
  id: 'job-rotation', parent: 'org-topic', title: 'Job rotation and job design', level: 1,
  short: 'Moving people between tasks spreads the load over different muscles, eyes and minds and breaks monotony — if the tasks really differ. Rotation cannot make a hazardous task safe: it spreads a noise or vibration dose over more people, and a task that is too heavy stays too heavy. Fix the worst task first, then rotate, enlarge and enrich the job.',
  keywords: ['job rotation', 'task rotation', 'job enlargement', 'job enrichment', 'job design', 'work organisation', 'variety', 'monotony', 'exposure', 'noise dose', 'vibration exposure', 'A(8)', 'LEX,8h', 'cycle time', 'repetitive work', 'teamwork', 'job characteristics'],
  prereq: ['repetitive-strain', 'lifting-index-risk', 'noise-exposure'],
  related: ['fatigue-rest-breaks', 'assembly-lines', 'hand-arm-vibration', 'psychosocial-factors', 'participatory-ergonomics', 'work-rest-scheduling', 'ergonomic-risk-assessment', 'retail-checkouts', 'patient-handling'],
  body: `
Job rotation moves people between tasks in the course of a shift. Done well, it gives tired tissues and tired minds a rest while the work goes on. Done badly, it is a way of sharing out harm.

### Three ways to redesign a job
| Approach | What changes | Example |
|---|---|---|
| **Rotation** | people move between existing tasks | every 2 h at the breaks: assembly → inspection → kitting |
| **Enlargement** | one job takes in more, different tasks | a longer work cycle that includes fetching parts and checking quality |
| **Enrichment** | the job gains planning, control and responsibility | a team plans its own work, solves quality problems, orders parts |

Hackman and Oldham's job characteristics model names what makes a job motivating: skill variety, a whole identifiable piece of work, significance, autonomy and feedback. Rotation adds only variety; enlargement and enrichment can add the rest (see [[psychosocial-factors]]).

### What rotation can do
- **Spread the load over different body regions**: palletising (back), overhead work (shoulders), small-part assembly (hands) and inspection (eyes) rest each other.
- **Break monotony and the vigilance decrement** in inspection and monitoring (see [[fatigue-rest-breaks]]).
- **Build skills and cover**: people who can do several jobs can cover absences.

### What it cannot do
- **Make a hazardous task safe.** A lift with a lifting index of 3 hurts whoever does it (see [[lifting-index-risk]]). Rotation shortens each person's exposure; it does not change the task.
- **Dilute energy doses much.** Noise adds on an energy scale, so the loud task dominates. Four hours at 95 dB(A) and four at 80 give

$$L_{EX,8h} = 10\\log_{10}\\frac{4\\cdot 10^{9.5} + 4\\cdot 10^{8}}{8} = 92\\ \\text{dB(A)},$$

still above the 85 dB(A) upper action value. To reach 85, only about 34 min a day could be spent at 95 dB(A). The [[?logarithm]] hides how much energy the loud task carries.
- **Help when the tasks load the same tissues.** Moving from wiring harnesses to screwing panels keeps the same wrists busy.
- **Avoid spreading exposure.** Rotating a grinder with 4 m/s² vibration among four people cuts each person's A(8) from 4.0 to 2.0 m/s² — below the 2.5 action value — but four people are now exposed instead of one.

Systematic reviews (Leider and colleagues, 2015; Padula and colleagues, 2017) found the evidence that rotation alone prevents musculoskeletal disorders to be mixed; it works best as part of a wider programme.

In the **rotation simulation**, rotate everyone through all four stations: noise doses converge towards the loudest task and more people exceed 85 dB(A). Then fit the quieter grinder and the lift table — fixing the tasks helps everyone.

### Designing a rotation
1. **Assess every task** and fix the worst first (lifting index above 1, noise, vibration, extreme postures).
2. **Pair tasks that load different regions** — back with hands, standing with sitting, visual with manual.
3. **Rotate every 1–2 h**, usually at the breaks; more often for monitoring.
4. **Train everyone** for every station, and include the workers in the design (see [[participatory-ergonomics]]).
5. **Check the combined doses**: noise and vibration per person, time at the heaviest task.

### Settings
- **Assembly lines and workshops**: rotation plans by station, with a matrix of skills and body loads (see [[assembly-lines]]).
- **Retail**: checkout alternating with shelf filling and customer service (see [[retail-checkouts]]).
- **Health care**: spreading heavy patient handling across the team and the day (see [[patient-handling]]).
- **Military and security**: rotating sentries, drivers and screeners to keep attention.
- **Field work**: harvest crews alternate cutting, carrying and loading.

> [!key] Fix the task first, then rotate between tasks that really differ — and count the doses per person and the number of people exposed.
`,
  ideas: [
    'Rotation moves people between tasks; enlargement widens a job; enrichment adds planning, control and responsibility.',
    'Rotation helps only when the tasks load different body regions or different kinds of attention.',
    'It cannot make a hazardous task safe; it shortens each person\'s exposure and spreads it to more people.',
    'Noise doses add on an energy scale, so the loudest task dominates a rotation.',
    'Fix the worst tasks first, then design the rotation with the workers.'
  ],
  pitfalls: [
    'Rotation solves the ergonomic problems of a line — It spreads them; a task that is too heavy, too loud or too repetitive must be redesigned.',
    'Half the day at 95 dB(A) and half at 80 averages to about 87 dB(A) — Decibels add as energy: the result is about 92 dB(A).',
    'Any change of task is a rest — Moving between tasks that use the same muscles and joints gives them no recovery.'
  ],
  formulas: [
    {
      name: 'Daily noise exposure of a two-task rotation',
      expr: 'L = 10*log((t1*10^(L1/10) + t2*10^(L2/10))/T0)', tex: 'L_{EX,8h} = 10\\log_{10}\\dfrac{t_1\\,10^{L_1/10} + t_2\\,10^{L_2/10}}{T_0}',
      vars: {
        L: { name: 'daily noise exposure level', q: 'soundlevel', unit: 'dB', tex: 'L_{EX,8h}' },
        t1: { name: 'time at the first task', q: false, unit: 'h', value: 4, tex: 't_1' },
        L1: { name: 'level at the first task, dB(A)', q: 'soundlevel', unit: 'dB', value: 95, tex: 'L_1' },
        t2: { name: 'time at the second task', q: false, unit: 'h', value: 4, tex: 't_2' },
        L2: { name: 'level at the second task, dB(A)', q: 'soundlevel', unit: 'dB', value: 80, tex: 'L_2' },
        T0: { name: 'reference day', q: false, unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'ISO 9612 and Directive 2003/10/EC. Action values 80 and 85 dB(A), limit 87 dB(A) (the limit counts the hearing protection worn).',
      stories: { L: 'A worker spends {t1} at {L1} and {t2} at {L2}. What is the daily exposure?', t1: 'The rest of the day is at {L2}. How long may a worker spend at {L1} if the daily exposure is to stay at {L}?' }
    },
    {
      name: 'Daily hand-arm vibration exposure of a rotation',
      expr: 'A = sqrt((a1^2*t1 + a2^2*t2)/T0)', tex: 'A_{8} = \\sqrt{\\dfrac{a_1^2\\,t_1 + a_2^2\\,t_2}{T_0}}',
      vars: {
        A: { name: 'daily exposure A(8)', q: 'accel', unit: 'm/s²', tex: 'A_{8}' },
        a1: { name: 'vibration of the first tool', q: 'accel', unit: 'm/s²', value: 4, tex: 'a_1' },
        t1: { name: 'trigger time with the first tool', q: false, unit: 'h', value: 2, tex: 't_1' },
        a2: { name: 'vibration of the second tool', q: 'accel', unit: 'm/s²', value: 1, tex: 'a_2' },
        t2: { name: 'trigger time with the second tool', q: false, unit: 'h', value: 6, tex: 't_2' },
        T0: { name: 'reference day', q: false, unit: 'h', value: 8, fixed: true, tex: 'T_0' }
      },
      note: 'ISO 5349-1 and Directive 2002/44/EC: action value 2.5 m/s², limit 5 m/s². Count trigger time, not time at the station.',
      stories: { A: 'A worker uses a tool at {a1} for {t1} and another at {a2} for {t2}. What is A(8)?', t1: 'A worker also uses a tool at {a2} for {t2}. How long may they use a tool at {a1} before A(8) reaches {A}?' }
    }
  ],
  examples: [
    {
      title: 'Rotating the grinder',
      q: 'A grinder runs at 95 dB(A) and 4 m/s² of hand-arm vibration. Today one person grinds for 8 h. What happens to noise and vibration if four people take 2 h each and spend the rest of the day at 80 dB(A) with no vibration?',
      steps: [
        'Vibration: one person, 8 h: A(8) = 4.0 m/s² — above the 2.5 action value. Four people, 2 h each: $\\sqrt{16 \\times 2/8} = 2.0$ m/s² each, below it.',
        'Noise: one person, 8 h at 95: 95 dB(A). Four people: $10\\log_{10}[(2 \\times 10^{9.5} + 6 \\times 10^{8})/8] = 89.4$ dB(A) each — still above 85.',
        'So vibration falls below the action value for everyone, noise does not — and now four people, not one, carry both exposures.'
      ],
      a: 'Vibration 4.0 → 2.0 m/s² per person; noise 95 → 89 dB(A) per person, for four people instead of one.'
    },
    {
      title: 'How long at the loud task?',
      q: 'The rest of the day is at 80 dB(A). How long can someone work at 95 dB(A) and keep $L_{EX,8h}$ at 85 dB(A)?',
      steps: [
        'Set $10\\log_{10}[(t \\times 10^{9.5} + (8 - t) \\times 10^{8})/8] = 85$.',
        '$t \\times 3.162 \\times 10^{9} + (8 - t) \\times 10^{8} = 8 \\times 3.162 \\times 10^{8}$, so $t = 1.730/3.062 = 0.565$ h.',
        'About 34 min a day — rotation alone cannot bring a 95 dB(A) task into line; quiet the machine or enclose it.'
      ],
      a: 'About 34 min a day.'
    }
  ],
  quiz: [
    { q: 'A worker rotates hourly between wiring harnesses and screwing small panels. Which body region gets a rest?', choices: ['Almost none — both load the hands and wrists', 'The hands', 'The back', 'The eyes'], a: 0, why: 'Rotation helps only when the tasks load different tissues; these two load the same ones.' },
    { q: 'Four hours at 95 dB(A) and four at 80 dB(A) give a daily exposure of about…', choices: ['92 dB(A)', '87.5 dB(A)', '80 dB(A)', '95 dB(A)'], a: 0, why: 'Sound energy, not decibels, averages: $10\\log_{10}[(4 \\cdot 10^{9.5} + 4 \\cdot 10^{8})/8] \\approx 92$.' },
    { q: 'Rotating a noisy task among more workers reduces the total noise the machine makes.', a: false, why: 'The machine is as loud as before; rotation lowers each person\'s dose but exposes more people.' },
    { q: 'A palletising task has a lifting index of 2.5. What should come first?', choices: ['Redesign the task (lift table, vacuum lifter, smaller loads)', 'Rotate it every hour', 'Choose stronger workers', 'Add a longer lunch break'], a: 0, why: 'Rotation shortens exposure but leaves each lift hazardous; engineering fixes remove the risk.' },
    { q: 'Adding planning, quality checks and control over the pace of work to a job is…', choices: ['Job enrichment', 'Job rotation', 'Job enlargement', 'Job evaluation'], a: 0, why: 'Enrichment adds responsibility and control; enlargement adds more tasks of the same level; rotation moves people between tasks.' }
  ],
  problems: [
    { q: 'A worker spends 3 h at 92 dB(A) and 5 h at 82 dB(A). What is the daily exposure $L_{EX,8h}$?', answer: 88.4, unit: 'dB', tol: 0.005, steps: ['$10^{9.2} = 1.585 \\times 10^{9}$ and $10^{8.2} = 1.585 \\times 10^{8}$.', '$(3 \\times 1.585 \\times 10^{9} + 5 \\times 1.585 \\times 10^{8})/8 = 6.93 \\times 10^{8}$.', '$10\\log_{10}(6.93 \\times 10^{8}) = 88.4$ dB(A).'] },
    { q: 'A worker uses a breaker at 6 m/s² for 2 h and a drill at 1 m/s² for 6 h. What is A(8)?', answer: 3.12, unit: 'm/s²', tol: 0.01, steps: ['$A(8) = \\sqrt{(36 \\times 2 + 1 \\times 6)/8} = \\sqrt{9.75} = 3.12$ m/s² — above the 2.5 action value.'] }
  ],
  ranges: [
    { dim: 'Rotation interval', range: [1, 2], unit: 'h', who: 'workers rotating between physical tasks; usually at the breaks', why: 'Long enough to learn and settle in, short enough to relieve the loaded tissues.', limits: 'Monitoring and inspection need shorter spells (20–30 min); very short intervals add errors and changeover time.', setting: ['workshop', 'health', 'civil'], src: 'Industrial practice; reviews by Leider et al. (2015) and Padula et al. (2017)' },
    { dim: 'Tasks in a rotation', range: 'two or more that load different body regions', unit: '', who: 'every rotation plan', why: 'Only a different load gives the tissues a rest.', limits: 'Every worker must be trained for every task; workers with restrictions need their own plan.', setting: ['workshop', 'health', 'civil'], src: 'Kroemer and Grandjean; ISO 11228-3' },
    { dim: 'Daily noise exposure of each rotating worker', range: [null, 85], unit: 'dB(A)', who: 'upper action value (lower action value 80 dB(A); limit 87 with protection)', why: 'Keeps the hearing of every person in the rotation within the action values.', limits: 'Rotation barely lowers the dose from a loud task; control noise at the source.', setting: ['workshop', 'field', 'military'], src: 'Directive 2003/10/EC; ISO 9612' },
    { dim: 'Daily hand-arm vibration exposure A(8)', range: [null, 2.5], unit: 'm/s²', who: 'action value per person (limit 5 m/s²)', why: 'Protects nerves and blood vessels in the fingers and hands.', limits: 'Rotation spreads exposure to more people; choose lower-vibration tools first.', setting: ['workshop', 'field'], src: 'Directive 2002/44/EC; ISO 5349-1' },
    { dim: 'Lifting index of each task in a rotation', range: [null, 1], unit: '', who: 'every lifting task, by the revised NIOSH equation', why: 'Protects nearly all workers from overexertion of the back.', limits: 'Tasks with an index above about 3 need redesign, not rotation.', setting: ['workshop', 'health'], src: 'Waters et al. (1993); NIOSH Applications Manual (1994)' },
    { dim: 'Cycle time of a repetitive task', range: [30, null], unit: 's', who: 'hand and arm work on lines and benches', why: 'Cycles under about 30 s (or the same motions for over half the cycle) count as highly repetitive and raise the risk of hand–wrist disorders.', limits: 'Force and posture matter as much as repetition; enlarging the job lengthens the cycle.', setting: 'workshop', src: 'Silverstein, Fine and Armstrong (1986)' }
  ],
  applications: [
    'Rotation plans with a skills and body-load matrix on assembly lines; check each person\'s dose with [the noise calculator](#/tools/environment/noise), [the vibration calculator](#/tools/environment/vibration) and [the lifting calculator](#/tools/lifting/niosh).',
    'Rotating checkout, stocking and service tasks in retail.',
    'Spreading heavy patient handling across nursing teams and shifts.',
    'Team-based assembly and job enrichment in car and electronics plants.'
  ],
  history: 'Frederick Herzberg argued in 1968 that jobs motivate through responsibility and achievement, and J. Richard Hackman and Greg Oldham\'s *Work Redesign* (1980) gave the job characteristics model. Volvo\'s Kalmar plant (1974) and Uddevalla plant (1989) replaced the moving line with teams building large parts of a car — famous experiments in enlarged and enriched work.',
  sources: [
    'J. R. Hackman and G. R. Oldham, *Work Redesign* (Addison-Wesley, 1980).',
    'P. C. Leider, J. S. Boschman, M. H. W. Frings-Dresen and H. F. van der Molen, "Effects of job rotation on musculoskeletal complaints and related work exposures: a systematic literature review", *Ergonomics* 58 (2015).',
    'R. S. Padula, M. L. C. Comper, E. H. Sparer and J. T. Dennerlein, "Job rotation designed to prevent musculoskeletal disorders and control risk in manufacturing industries: a systematic review", *Applied Ergonomics* 58 (2017).',
    'B. A. Silverstein, L. J. Fine and T. J. Armstrong, "Hand wrist cumulative trauma disorders in industry", *British Journal of Industrial Medicine* 43 (1986).',
    'Directive 2003/10/EC (noise) and Directive 2002/44/EC (vibration); ISO 9612 and ISO 5349-1.',
    'ISO 11228-3, *Ergonomics — Manual handling — Part 3: Handling of low loads at high frequency*.'
  ],
  sim: 'or-rotation'
},

{
  id: 'psychosocial-factors', parent: 'org-topic', title: 'Psychosocial factors', level: 2,
  short: 'How work is organised and managed — how much is asked, how much say people have, the help and the recognition they get — shapes strain, errors, back and neck pain and long-term health as surely as benches and hoists do. High demands with little control and little support, and high effort with little reward, are the patterns to design out.',
  keywords: ['psychosocial', 'work stress', 'job strain', 'demand control support', 'Karasek', 'effort reward imbalance', 'Siegrist', 'time pressure', 'machine pacing', 'recognition', 'long working hours', 'ISO 45003', 'management standards', 'burnout', 'right to disconnect', 'workload'],
  prereq: ['ergonomics-defined', 'mental-workload', 'medicine:stress-coping'],
  related: ['job-rotation', 'participatory-ergonomics', 'shift-work', 'assembly-lines', 'repetitive-strain', 'human-error', 'decisions-stress', 'retail-checkouts', 'patient-handling', 'medicine:wellbeing', 'medicine:adrenal-stress', 'medicine:heart-disease'],
  body: `
Two workshops can have the same benches, lights and hoists and very different rates of back pain, errors and people leaving. The difference often lies in how the work is organised: how much is asked, how much say people have, whether they get help and recognition. These are the **psychosocial factors** of work, and ISO 45003 (2021) treats them as risks to be managed like any physical hazard.

### Demand, control and support
Karasek's model (1979) crosses the demands of a job with the control people have over it:

| | Low control | High control |
|---|---|---|
| **High demands** | **High strain** — time pressure without a say | **Active** — hard work with the means to handle it; learning |
| **Low demands** | **Passive** — little to do or decide | **Low strain** |

Johnson and Hall (1988) added **support** from colleagues and supervisors: high strain with little support ("iso-strain") is the riskiest corner. A pooled analysis of European cohorts (Kivimäki and colleagues, 2012) linked job strain to roughly 1.2 times the risk of coronary heart disease; in the Whitehall II study of British civil servants, low job control was linked to more heart disease.

### Effort and reward
Siegrist's model (1996) looks at the exchange: effort (time pressure, interruptions, responsibility, overtime) against rewards (pay, esteem and recognition, job security, prospects). The **effort–reward ratio** compares the two scores, corrected for the number of questions in each:

$$\\mathrm{ERI} = \\frac{E\\,n_R}{R\\,n_E}$$

A ratio above 1 means effort outweighs reward.

### Why it matters for physical ergonomics
- **Musculoskeletal complaints**: time pressure and low control go with more neck, shoulder and back pain — through muscle tension, fewer pauses and no time for the safe method (fetching the hoist takes minutes).
- **Errors**: rushing, interruptions and fatigue (see [[human-error]]).
- **Long hours**: WHO and ILO estimated that working 55 h or more a week caused about 745 000 deaths from stroke and heart disease in 2016 (Pega and colleagues, 2021).

### The design levers
| Risk | Lever | Limitation |
|---|---|---|
| High demands, time pressure | staff for the peaks, realistic takt times, fewer interruptions | costs money; demands creep back |
| Low control | self-pacing, buffers between paced stations, a say in methods and rosters | some processes are paced by nature |
| Little support | trained team leaders, peer help, an easy way to ask for help | needs time for people to talk |
| Low reward | feedback, recognition, fair pay, training and prospects | recognition must be sincere and specific |
| Unclear roles, badly managed change | clear roles, consultation before change | slower decisions |

The UK HSE's Management Standards group the same ideas into six areas: demands, control, support, relationships, role and change. More demand is not harmful in itself: the **active** corner — high demands with high control and support — is where people learn and stay motivated.

In the **job-strain simulation**, load the call-centre preset, then press *More control* twice: the point moves from high strain to active without lowering the workload.

### Settings
- **Offices**: e-mail and chat load, interruptions, being always reachable; France gave many employees a right to disconnect in 2017.
- **Health care**: emotional demands, aggression, short staffing — support and staffing matter most.
- **Workshops and lines**: machine pacing, piece rates, electronic monitoring (see [[assembly-lines]]).
- **Military**: very high demands, but training, cohesion and clear roles give control and support; human factors only here.
- **Field work**: lone and remote work, isolation in fly-in fly-out camps.

> [!warn] Stress is not an illness, but long-lasting stress can harm health. Persistent low mood, anxiety or thoughts of self-harm are reasons to talk to a doctor or a mental-health service; in a crisis, call your local emergency number or a crisis line. This page is not medical advice.

> [!key] Design the organisation as carefully as the machine: demands people can meet, control over how and when, help when it is needed, and recognition for the effort.
`,
  ideas: [
    'Psychosocial factors — demands, control, support, effort and reward — are risks to design out, like physical hazards.',
    'High demands with low control (job strain), worst with low support, carry the highest risk.',
    'High effort with low reward (an effort–reward ratio above 1) is a second pattern of strain.',
    'Time pressure and low control raise musculoskeletal complaints and errors, not only stress.',
    'High demands are fine with high control and support: that is where people learn.'
  ],
  pitfalls: [
    'Stress is a personal weakness, dealt with by resilience training — Most of it comes from how work is designed; training helps little if demands, control and support stay the same.',
    'Physical ergonomics and psychosocial factors are separate — Time pressure and low control raise muscle tension, cut pauses and push people to skip safe methods.',
    'The solution is always less work — Lack of control, support and reward often matters as much; more control can turn a strained job into an active one.'
  ],
  formulas: [
    {
      name: 'Effort–reward ratio',
      expr: 'ER = E*nR/(R*nE)', tex: '\\mathrm{ERI} = \\dfrac{E\\,n_R}{R\\,n_E}',
      vars: {
        ER: { name: 'effort–reward ratio (above 1: imbalance)', tex: '\\mathrm{ERI}' },
        E: { name: 'effort score (sum of the effort items)', value: 10 },
        nR: { name: 'number of reward items', value: 7, int: true, fixed: true, tex: 'n_R' },
        R: { name: 'reward score (sum of the reward items)', value: 16 },
        nE: { name: 'number of effort items', value: 3, int: true, fixed: true, tex: 'n_E' }
      },
      note: 'Siegrist\'s model. The short questionnaire has 3 effort and 7 reward items, each scored 1–4. A measure for groups and surveys, not a diagnosis for one person.',
      stories: { ER: 'A worker scores {E} for effort on {nE} items and {R} for reward on {nR} items. What is the effort–reward ratio?', R: 'With an effort score of {E}, what reward score would bring the ratio to {ER}?' }
    }
  ],
  examples: [
    {
      title: 'An effort–reward survey',
      q: 'On the short questionnaire (3 effort items, 7 reward items, each 1–4), a team averages an effort score of 10 and a reward score of 16. What is the ratio, and what reward score would balance it?',
      steps: [
        '$\\mathrm{ERI} = 10 \\times 7/(16 \\times 3) = 70/48 = 1.46$ — effort clearly outweighs reward.',
        'For a ratio of 1: $R = 10 \\times 7/3 = 23.3$.',
        'Rewards include esteem, security and prospects, not only pay: recognition and a clear future can move the score as much as money.'
      ],
      a: 'About 1.46; a reward score of about 23 would balance it.'
    },
    {
      title: 'Redesigning a paced line',
      q: 'Workers on a machine-paced line report high time pressure, no say over pace and little help at peaks. Which changes act on which factor?',
      steps: [
        'Control: small buffers between stations so each worker can run ahead or catch up; let the team plan its rotation.',
        'Support: a floating helper at peaks and a team leader who can stop the line.',
        'Demands: a takt time set from real cycle times of all variants, not the fastest one.',
        'Reward: feedback on quality, recognition of suggestions, training for other stations.'
      ],
      a: 'Buffers and team planning for control, a helper for support, a realistic takt for demands, feedback and training for reward.'
    }
  ],
  quiz: [
    { q: 'In Karasek\'s model, which job has the highest strain?', choices: ['High demands, low control', 'High demands, high control', 'Low demands, high control', 'Low demands, low control'], a: 0, why: 'Demands without the means to handle them produce strain; with high control the same demands make an active, learning job.' },
    { q: 'Which change is most likely to lower strain on a machine-paced line without lowering output?', choices: ['Buffers that let workers set their own pace within limits', 'A faster line with longer breaks', 'Stricter electronic monitoring', 'A poster about stress'], a: 0, why: 'Buffers add control over pace, moving the job from high strain towards active.' },
    { q: 'An effort–reward ratio above 1 means…', choices: ['effort outweighs rewards', 'rewards outweigh effort', 'the job is passive', 'the person is ill'], a: 0, why: 'The ratio compares effort with reward; above 1 the exchange is unbalanced. It describes a job, not a diagnosis.' },
    { q: 'Psychosocial factors affect only mental health, not back or neck pain.', a: false, why: 'Time pressure and low control are linked to more musculoskeletal complaints, through tension, fewer pauses and skipped safe methods.' },
    { q: 'WHO and ILO estimated deaths from stroke and heart disease attributable to working 55 h or more a week in 2016 at about…', choices: ['745 000', '7 450', '74 500 000', 'none — long hours are not linked to disease'], a: 0, why: 'Their joint estimate (Pega and colleagues, 2021) was about 745 000 deaths.' }
  ],
  problems: [
    { q: 'On the short questionnaire (3 effort items, 7 reward items), a group scores 9 for effort and 18 for reward. What is the effort–reward ratio?', answer: 1.167, unit: '', tol: 0.01, steps: ['$\\mathrm{ERI} = 9 \\times 7/(18 \\times 3) = 63/54 = 1.17$ — a moderate imbalance.'] }
  ],
  ranges: [
    { dim: 'Average weekly working hours', range: [null, 48], unit: 'h', who: 'every worker in the EU, averaged over up to 4 months', why: 'Time for recovery, family and sleep; 55 h or more a week is linked to more stroke and heart disease.', limits: 'Opt-outs exist in some countries and US federal law sets no general limit; unpaid overtime and messages outside hours are often uncounted.', setting: 'all', src: 'Directive 2003/88/EC; WHO/ILO estimates (Pega et al., 2021)' },
    { dim: 'Effort–reward ratio of a group', range: [null, 1], unit: '', who: 'teams surveyed with Siegrist\'s questionnaire', why: 'Above 1, effort outweighs reward — a pattern linked to strain and poorer health.', limits: 'A survey measure for groups; use it to find where to act, never to judge a person.', setting: 'all', src: 'Siegrist (1996) and the short ERI questionnaire' },
    { dim: 'Control over the pace of work', range: 'self-paced where possible; buffers between paced stations', unit: '', who: 'line, checkout, call-centre and processing work', why: 'Control turns high demands into active work instead of strain.', limits: 'Some processes are paced by nature; then give control over methods, rotation and breaks.', setting: ['workshop', 'office', 'civil'], src: 'Karasek and Theorell (1990); ISO 10075-2' },
    { dim: 'Work messages and calls outside working hours', range: 'none expected, except agreed on-call', unit: '', who: 'office and knowledge workers', why: 'Protects recovery and sleep; being always reachable keeps demands going.', limits: 'Emergency services and on-call work need rules instead: limits, rest after calls and compensation.', setting: 'office', src: 'Right to disconnect (France, 2017); ISO 45003' },
    { dim: 'Consultation on changes to work', range: 'before the change, not after', unit: '', who: 'everyone whose work a change affects', why: 'Keeps control and support during change, and brings workers\' knowledge into it.', limits: 'Takes time; urgent changes still need explanation and review.', setting: 'all', src: 'HSE Management Standards; ISO 45003' }
  ],
  applications: [
    'Risk assessments that include demands, control, support, reward, role and change (ISO 45003; the HSE Management Standards).',
    'Designing paced lines, call centres and checkouts with buffers, rotation and a say over pace.',
    'Staffing and support in hospitals and care homes.',
    'Policies on working hours, on-call work and messages outside hours.'
  ],
  history: 'Robert Karasek published the demand–control model in 1979; Jeffrey Johnson and Ellen Hall added social support in 1988, and Johannes Siegrist the effort–reward imbalance model in 1996. The Whitehall II study of British civil servants linked low job control to heart disease in the 1990s, and ISO 45003 (2021) became the first international standard on managing psychosocial risks at work.',
  sources: [
    'R. A. Karasek, "Job demands, job decision latitude, and mental strain: implications for job redesign", *Administrative Science Quarterly* 24 (1979); R. Karasek and T. Theorell, *Healthy Work* (Basic Books, 1990).',
    'J. V. Johnson and E. M. Hall, "Job strain, work place social support, and cardiovascular disease", *American Journal of Public Health* 78 (1988).',
    'J. Siegrist, "Adverse health effects of high-effort/low-reward conditions", *Journal of Occupational Health Psychology* 1 (1996).',
    'ISO 45003:2021, *Occupational health and safety management — Psychological health and safety at work — Guidelines for managing psychosocial risks*.',
    'ISO 10075-2, *Ergonomic principles related to mental workload — Part 2: Design principles*.',
    'M. Kivimäki et al., "Job strain as a risk factor for coronary heart disease: a collaborative meta-analysis of individual participant data", *The Lancet* 380 (2012).',
    'F. Pega et al., "Global, regional, and national burdens of ischemic heart disease and stroke attributable to exposure to long working hours for 194 countries, 2000–2016", *Environment International* 154 (2021).',
    'Health and Safety Executive, *Management Standards for work-related stress*.'
  ],
  sim: 'or-job-strain'
},

{
  id: 'participatory-ergonomics', parent: 'org-topic', title: 'Participatory ergonomics', level: 1,
  short: 'The people who do a job know its problems best. Participatory ergonomics involves them — with engineers, supervisors, maintenance staff and ergonomists — in finding problems, designing and testing fixes and checking the results. Who takes part matters as much as how many: a problem only the small, the left-handed or the night shift meet is found only if they are in the room.',
  keywords: ['participatory ergonomics', 'worker involvement', 'employee participation', 'ergonomics team', 'kaizen', 'continuous improvement', 'ergonomic checkpoints', 'mock-up', 'user trial', 'body mapping', 'co-design', 'human-centred design', 'WISE', 'WIND', 'consultation'],
  prereq: ['human-centred-design', 'user-trials-mockups', 'task-analysis'],
  related: ['psychosocial-factors', 'job-rotation', 'ergonomic-risk-assessment', 'design-for-range', 'guards-and-people', 'maintenance-ergonomics', 'patient-handling', 'agriculture-ergonomics', 'usability', 'ergonomics-productivity'],
  body: `
The people who do a job every day know things nobody else does: which part sticks, which shelf the small operator cannot reach, where the cleaner has to kneel on a wet floor, what goes wrong on nights. **Participatory ergonomics** involves them in finding the problems and designing the fixes, with specialists as advisers rather than owners of the answer. The term was coined in Japan in the 1980s (Noro and Imada); the practice also draws on quality circles and the Scandinavian tradition of worker involvement.

### Why it works
- **Knowledge**: workers see problems designers and managers miss, especially the occasional ones — at night, on a rare variant, during cleaning or a breakdown.
- **Acceptance**: people use and look after solutions they helped shape; imposed changes are bypassed (see [[guards-and-people]]).
- **Cost**: many good solutions are cheap. The ILO's *Ergonomic Checkpoints* collect 132 low-cost improvements.
- **Capability**: a team that has learnt to spot and fix problems keeps doing it.

### Who is in the room
If each participant notices a given problem with [[?probability]] $p$, the chance that at least one of $n$ participants notices it is

$$P = 1 - (1 - p)^n.$$

In usability tests Nielsen and Landauer (1993) found an average $p$ of about 0.31, so five testers find about 84 % of the problems and ten about 98 %. The formula hides a trap: for a problem that only the smallest users meet, $p$ is zero for everyone else — **no number of tall participants will find it**. And a randomly picked team of five has a 59 % chance of including no left-hander when one worker in ten is left-handed. Choose participants to cover the range: both ends of the body-size range (see [[design-for-range]]), every shift, older and newer workers, maintenance and cleaning staff.

In the **participation simulation**, invite only the manager and the engineer: most problems are ringed in red, because nobody in the team ever meets them. Add the night shift, a small operator and the maintenance technician: whole groups of problems appear.

### How far participation goes
The Participatory Ergonomics Framework (Haines and colleagues, 2002) describes a programme along several dimensions:

| Dimension | From | To |
|---|---|---|
| Permanence | a one-off project | a standing team |
| Involvement | representatives | everyone affected |
| Level | one workstation | the whole organisation |
| Decisions | workers consulted | decisions delegated to the group |
| Mix | workers only | workers, supervisors, engineers, maintenance, specialists |
| Remit | find problems | design, implement and evaluate |

### A typical cycle
1. **Commitment**: time, a budget and a promise that every proposal gets an answer.
2. **A small team**, trained in basics: body maps of discomfort, simple checklists, video of the task.
3. **Find and rank problems** from discomfort surveys, observation and near misses.
4. **Design and mock up** solutions in cardboard or wood; try them with users of different sizes (see [[user-trials-mockups]]).
5. **Implement and check**: discomfort, errors, time — and report back to everyone.

### Settings
- **Offices**: chairs and desks chosen by trial; workstation assessments done with the user.
- **Workshops and industry**: kaizen teams and ergonomics committees; operators on the design team of a new line.
- **Health care**: nurses and porters choose hoists, slings and beds; patient-handling teams (see [[patient-handling]]).
- **Military**: user trials with soldiers wearing their full equipment, part of human-systems integration.
- **Field and agriculture**: the ILO's WIND programme for farming families; toolbox talks on building sites (see [[agriculture-ergonomics]]).

> [!warn] Token participation — asking and then not acting — destroys trust faster than not asking at all.

> [!key] Bring in the people who do the work, chosen to cover the whole range of users and shifts, give them time and support, and answer every proposal.
`,
  ideas: [
    'The people who do a job see problems that designers, managers and specialists miss.',
    'Solutions workers helped shape are used and kept; imposed ones are bypassed.',
    'The chance that a team finds a problem is 1 − (1 − p)ⁿ — but only if someone present can meet the problem at all.',
    'Choose participants to cover the range: small and tall, every shift, older and newer workers, maintenance and cleaning.',
    'Participation needs management commitment, time, a budget and an answer to every proposal.'
  ],
  pitfalls: [
    'More participants always find more problems — Only people who meet a problem can report it: ten tall day-shift workers will not find what the small night-shift operator meets.',
    'Once workers are involved, ergonomists and engineers are not needed — Workers find the problems and judge the fixes; technical solutions still need engineering and ergonomics knowledge.',
    'Participation is a one-off workshop — The benefits come from a standing process that implements, checks and reports back.'
  ],
  formulas: [
    {
      name: 'Chance that at least one participant finds a problem',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^n',
      vars: {
        P: { name: 'chance the team finds the problem', q: 'ratio', unit: '%' },
        p: { name: 'chance one participant notices it', q: 'ratio', unit: '%', value: 31, min: 0.1, max: 99.9 },
        n: { name: 'number of participants who meet the problem', value: 5, min: 1, max: 50 }
      },
      note: 'Participants notice independently. Nielsen and Landauer found p ≈ 31 % on average in usability tests; for people who never meet the problem, p = 0.',
      stories: { P: 'Each participant notices a problem with a chance of {p}. What is the chance that at least one of {n} notices it?', n: 'Each participant notices a problem with a chance of {p}. How many participants give a {P} chance of finding it?' }
    },
    {
      name: 'Chance that a random team includes nobody from a group',
      expr: 'Q = (1 - f)^n', tex: 'Q = (1 - f)^n',
      vars: {
        Q: { name: 'chance the team has nobody from the group', q: 'ratio', unit: '%' },
        f: { name: 'share of the workforce in the group', q: 'ratio', unit: '%', value: 10, min: 0.1, max: 99.9 },
        n: { name: 'people picked at random', value: 5, min: 1, max: 50 }
      },
      note: 'For a large workforce. Picking at random leaves small groups out surprisingly often — choose the members on purpose.',
      stories: { Q: '{f} of the workers are left-handed. What is the chance that {n} people picked at random include none?' }
    }
  ],
  examples: [
    {
      title: 'How many testers?',
      q: 'In a trial of a new workstation each user notices a given problem with a chance of 31 %. How many problems do 5 users find, and 10?',
      steps: [
        '5 users: $1 - 0.69^5 = 1 - 0.156 = 0.84$.',
        '10 users: $1 - 0.69^{10} = 1 - 0.024 = 0.976$.',
        'The second five add only 13 points — better spent on a second round after fixing what the first five found.'
      ],
      a: 'About 84 % with 5 users and 98 % with 10.'
    },
    {
      title: 'A random team',
      q: 'One worker in ten is left-handed and one in five works nights. What is the chance that a team of 5 picked at random has no left-hander, and no night worker?',
      steps: [
        'No left-hander: $0.9^5 = 0.59$.',
        'No night worker: $0.8^5 = 0.33$.',
        'Pick members to cover the groups whose problems you must find.'
      ],
      a: '59 % and 33 %.'
    }
  ],
  quiz: [
    { q: 'A team of eight tall day-shift operators reviews a workstation. Which problem are they least likely to find?', choices: ['A shelf the smallest operators cannot reach', 'A tool that is hard to grip', 'A confusing label', 'A noisy machine'], a: 0, why: 'Nobody in the team meets that problem: their chance of noticing it is near zero however many they are.' },
    { q: 'If each tester notices a problem with a chance of 31 %, about how many of the problems do five testers find?', choices: ['About 84 %', 'About 31 %', '100 %', 'About 155 %'], a: 0, why: '$1 - 0.69^5 \\approx 0.84$.' },
    { q: 'Once workers take part, ergonomists and engineers are no longer needed.', a: false, why: 'Workers bring knowledge of the problems and judge the fixes; technical solutions still need specialists.' },
    { q: 'What most quickly destroys a participatory programme?', choices: ['Asking for suggestions and never acting on them', 'Using cardboard mock-ups', 'Including the night shift', 'Training the team in body mapping'], a: 0, why: 'Token participation teaches people that speaking up is pointless.' }
  ],
  problems: [
    { q: 'Each participant notices a problem with a chance of 31 %. How many participants are needed for a 90 % chance of finding it (round up)?', answer: 7, unit: '', tol: 0.01, steps: ['$n = \\ln(0.1)/\\ln(0.69) = 6.2$.', 'Round up: 7 participants.'] },
    { q: 'A fifth of a factory\'s workers are on the night shift. What is the chance that 6 people picked at random include no night worker?', answer: 26.2, unit: '%', tol: 0.02, steps: ['$0.8^6 = 0.262$, about 26 %.'] }
  ],
  ranges: [
    { dim: 'Users in one round of a fitting trial or design workshop', range: [5, 8], unit: 'people', who: 'chosen to cover the range: the smallest and largest users, women and men, left-handers, older and newer workers, every shift', why: 'If each notices about a third of the problems, five to eight find most of them.', limits: 'Problems that only a small group meets are found only if that group is present; complex systems need several rounds.', setting: 'all', src: 'Nielsen and Landauer (1993); ISO 9241-210' },
    { dim: 'Who takes part', range: 'every group that meets the task', unit: '', who: 'operators of each shift and size, maintenance, cleaning, supervisors, engineers, an ergonomist', why: 'Each group sees different problems; together they cover the task\'s whole life.', limits: 'Large teams slow down; use a core team and bring in others for trials.', setting: 'all', src: 'Haines et al. (2002); ISO 27500' },
    { dim: 'Answer to every proposal', range: 'yes, no with the reason, or when', unit: '', who: 'every suggestion the team or a worker makes', why: 'Keeps trust and shows that participation changes things.', limits: 'Not every idea can be done; the reason why not matters as much as the yes.', setting: 'all', src: 'ILO and IEA, *Ergonomic Checkpoints*; practice' }
  ],
  applications: [
    'Kaizen and ergonomics teams in factories, warehouses and hospitals.',
    'Fitting trials of chairs, benches, vehicles and personal equipment with representative users.',
    'Low-cost improvement programmes in small enterprises and on farms.',
    'Designing new lines, wards and control rooms with the people who will work there.'
  ],
  history: 'Kageyu Noro and Andrew Imada named participatory ergonomics in the 1980s and published *Participatory Ergonomics* in 1991. The ILO\'s participatory programmes — WISE for small enterprises and WIND for farming families, led by Kazutaka Kogi and colleagues — took the approach worldwide, and the ILO and IEA\'s *Ergonomic Checkpoints* (2nd edition, 2010) collected its low-cost solutions.',
  sources: [
    'K. Noro and A. Imada (eds), *Participatory Ergonomics* (Taylor and Francis, 1991).',
    'H. Haines, J. R. Wilson, P. Vink and E. Koningsveld, "Validating a framework for participatory ergonomics (the PEF)", *Ergonomics* 45 (2002).',
    'International Labour Office and International Ergonomics Association, *Ergonomic Checkpoints*, 2nd edition (2010).',
    'J. Nielsen and T. K. Landauer, "A mathematical model of the finding of usability problems", *Proceedings of INTERCHI \'93* (1993).',
    'ISO 9241-210, *Ergonomics of human-system interaction — Human-centred design for interactive systems*; ISO 27500, *The human-centred organization*.'
  ],
  sim: 'or-participation'
},

{
  id: 'ageing-workforce', parent: 'org-topic', title: 'The ageing workforce', level: 2,
  short: 'With age, near focus recedes, less light reaches the retina, high tones fade, strength and aerobic capacity fall and recovery slows — on average, with wide differences between people. Experience and skill often grow. Design answers with more light and less glare, larger characters, lower-pitched alarms, lower forces, handling aids and choice over shifts — changes that help every worker.',
  keywords: ['ageing workforce', 'older workers', 'age', 'presbyopia', 'near point', 'accommodation', 'retinal illuminance', 'glare', 'presbycusis', 'hearing thresholds', 'ISO 7029', 'grip strength', 'aerobic capacity', 'work ability index', 'shift-work tolerance', 'age management', 'design for all'],
  prereq: ['age-children-elderly', 'design-for-range', 'strength-and-force'],
  related: ['shift-work', 'work-rest-scheduling', 'visual-ergonomics', 'lighting-levels', 'glare-colour', 'alarms-warnings', 'displays-design', 'monitor-placement', 'accessible-design', 'disability-inclusive', 'handling-aids', 'medicine:ageing', 'medicine:vision', 'medicine:hearing-balance'],
  body: `
In many countries the workforce is getting older: people work longer, and fewer young people join. Ageing changes the body in ways design can answer — and design for older workers turns out to be good design for everyone.

### What changes, on average
| Capacity | Typical change | What it means at work |
|---|---|---|
| **Near vision** | the eye's focusing power falls from about 10 dioptres at 25 to 1–2 by 55 | small print and close screens blur without glasses, typically from the mid-40s |
| **Light and glare** | a 60-year-old's retina receives roughly a third of the light of a 20-year-old's (Weale); more stray light | needs more light, much less glare, more contrast; slower adjustment to darkness |
| **Hearing** | high tones fade first (ISO 7029) | high-pitched alarms and speech in noise are harder |
| **Strength** | grip in the mid-60s some 20–25 % below its peak (British norms, Dodds and colleagues, 2014) | forces and weights near people's limits become too much |
| **Aerobic capacity** | about 10 % less per decade, less in people who stay active | heavy work is a larger share of capacity (see [[work-rest-scheduling]]) |
| **Balance, reaction** | choice reactions slow; balance worsens | falls on stairs and uneven ground; time-critical tasks harder |
| **Recovery** | slower after heavy work, heat and injury; sleep lighter and earlier | night shifts harder, morning shifts easier |
| **Experience** | knowledge, skill and judgement in familiar work often grow | fewer injuries in many statistics, but longer recovery when hurt |

Age changes the [[?mean]], but people of the same age differ more than the averages of different ages do: a fit 60-year-old may outwork a sedentary 30-year-old. Design for the range, not for the birthday.

### Eyes: the numbers
The nearest point the eye can focus is the [[?inverse]] of its focusing power (the amplitude of accommodation). Hofstetter's average, $A = 18.5 - 0.3\\,\\text{age}$ dioptres, gives a near point of 200 mm at 45 and 286 mm at 50; the least able people of each age (15 − 0.25 age) are at 267 mm and 400 mm. Comfortable close work uses only about half the available focusing power, so reading at 400 mm becomes tiring in the mid-40s. Reading glasses and progressive lenses help, but progressives make people tilt the head back to see a high screen through the bottom of the lens: lower the screen or use single-vision screen glasses. Characters should subtend at least about 20–22 minutes of arc (ISO 9241-303): at 700 mm that is 4.5 mm.

### Ears: the numbers
Decibels are a [[?logarithm|logarithmic]] scale. In the 2000 edition of ISO 7029 the median age-related loss grows with the square of (age − 18): at 4 kHz a 60-year-old man's median threshold is about 28 dB worse than at 18, a woman's about 16 dB; at 1 kHz both about 7 dB. Noise at work adds to this. Alarms with most of their energy below about 2 kHz (ISO 7731 asks for components in roughly 500–2500 Hz), backed by lights, reach older ears.

In the **ageing simulation**, move the age slider from 25 to 65: watch the focus range slide past the label, the light needed climb, the 4 kHz threshold drop and the strength bar shrink — then add reading glasses, light and a lower-pitched alarm.

### What design does
- **Light**: EN 12464-1 lets the designer raise the illuminance by a step (500 → 750 lx) where workers' sight is below normal; control glare and give adjustable task lights.
- **Information**: larger characters, high contrast, no blue-on-black; controls that can be told apart by feel.
- **Forces**: lower push, pull and grip forces, lift assists and power tools (see [[handling-aids]]).
- **Movement**: handrails, even floors, good light on stairs; fewer time-critical tasks.
- **Organisation**: choice of shifts and fewer nights, more recovery after heavy days, training at the learner's pace, mixed-age teams. Finland's Work Ability Index (7–49 points) is used to follow a workforce and act early.

### Settings
- **Offices**: progressive lenses and screen height, font size, glare from windows.
- **Workshops**: task lighting, lift assists, quieter machines, alarms that everyone hears.
- **Health care**: an older nursing workforce needs patient-handling equipment and fewer night shifts.
- **Military**: older aircrew and technicians — displays readable at arm's length with reading correction.
- **Field and agriculture**: about a third of EU farm managers are 65 or older (Eurostat, 2016): steps, handholds and cabs must suit them.
- **Vehicles**: glare at night, instrument characters and mirrors for older drivers.

> [!warn] Sudden changes in vision or hearing, or loss of balance, need a doctor — they are not "just age". This page is not medical advice.

> [!key] Design for the whole working life: more light and less glare, larger characters, lower-pitched alarms with lights, lower forces, handling aids and choice over shifts — every worker gains.
`,
  ideas: [
    'Near focus, light reaching the retina, high-frequency hearing, strength and aerobic capacity all decline on average with age.',
    'People of the same age differ more than the averages of different ages: design for the range.',
    'The near point is the inverse of the focusing power; comfortable close work uses only about half of it.',
    'Older eyes need more light, much less glare and larger characters; older ears hear lower-pitched alarms best.',
    'Design changes for older workers — light, text, forces, aids, shift choice — help everyone.'
  ],
  pitfalls: [
    'Older workers are less safe — In many statistics they have fewer injuries, though they take longer to recover; experience compensates for much of the change.',
    'A brighter lamp solves older workers\' vision problems — More light helps only without glare: the older eye scatters more light, so badly placed bright lamps make things worse.',
    'Age is a good way to select people for heavy work — Capacity varies more within an age group than between groups; reduce the demands instead.'
  ],
  formulas: [
    {
      name: 'Near point from age (Hofstetter\'s average)',
      expr: 'd = 1000/(18.5 - 0.3*a)', tex: 'd_n = \\dfrac{1000}{18.5 - 0.3\\,a}',
      vars: {
        d: { name: 'nearest distance in focus', q: false, unit: 'mm', tex: 'd_n' },
        a: { name: 'age', q: false, unit: 'yr', value: 45, min: 10, max: 58 }
      },
      note: 'Hofstetter (1950): average amplitude of accommodation 18.5 − 0.3 age dioptres (the least able: 15 − 0.25 age). Beyond about 55 the amplitude levels off near 0.5–1 D.',
      stories: { d: 'What is the average near point at the age of {a}?', a: 'At what age does the average near point reach {d}?' }
    },
    {
      name: 'Character height for a visual angle',
      expr: 'h = 2*D*tan(theta/2)', tex: 'h = 2\\,D\\tan\\dfrac{\\theta}{2}',
      vars: {
        h: { name: 'character height (capital letter)', q: 'length', unit: 'mm' },
        D: { name: 'viewing distance', q: 'length', unit: 'mm', value: 700 },
        theta: { name: 'visual angle of the character', q: 'angle', unit: '′', value: 22, min: 1, max: 600, tex: '\\theta' }
      },
      note: 'ISO 9241-303 prefers about 20–22 minutes of arc for reading; older readers and poor conditions need the upper end or more.',
      stories: { h: 'Text is read from {D} and must subtend {theta}. How tall must the characters be?', D: 'Characters {h} tall must subtend {theta}. From how far may they be read?' }
    },
    {
      name: 'Median age-related hearing loss (ISO 7029:2000)',
      expr: 'dH = alpha*(Y - 18)^2', tex: '\\Delta H = \\alpha\\,(Y - 18)^2',
      vars: {
        dH: { name: 'median threshold shift from age 18', q: false, unit: 'dB', tex: '\\Delta H' },
        alpha: { name: 'coefficient for the frequency and sex (men at 4 kHz: 0.016)', q: false, unit: 'dB/yr²', value: 0.016, tex: '\\alpha' },
        Y: { name: 'age', q: false, unit: 'yr', value: 60, min: 18, max: 100 }
      },
      note: 'Median of otologically normal people, 2000 edition of ISO 7029 (the 2017 edition uses a revised model). Men: 0.004 at 1 kHz, 0.007 at 2 kHz, 0.016 at 4 kHz, 0.022 at 8 kHz; women: 0.004, 0.006, 0.009, 0.015.',
      stories: { dH: 'For a coefficient of {alpha}, how much has the median threshold shifted by the age of {Y}?' }
    }
  ],
  examples: [
    {
      title: 'Reading a label at 50',
      q: 'A 50-year-old checks labels at 350 mm. Using Hofstetter\'s average and least-able amplitudes, can they focus? What changes with +1.5 D reading glasses?',
      steps: [
        'Average: $A = 18.5 - 0.3 \\times 50 = 3.5$ D, near point $1000/3.5 = 286$ mm — just in focus, but using most of the focusing power: tiring.',
        'Least able: $A = 15 - 0.25 \\times 50 = 2.5$ D, near point 400 mm — the label is blurred.',
        'With +1.5 D: the near point moves to $1000/(3.5 + 1.5) = 200$ mm and the far limit to $1000/1.5 = 667$ mm — the label at 350 mm is comfortable, but a screen at 800 mm is out of focus.'
      ],
      a: 'The average 50-year-old just focuses, the least able cannot; +1.5 D gives a sharp range of about 200–670 mm.'
    },
    {
      title: 'How big must the text be?',
      q: 'Characters should subtend about 22 minutes of arc. How tall must they be on a screen at 700 mm and on a machine panel read from 1.5 m?',
      steps: [
        '22′ = 0.367°; half of it is 0.183°, and $\\tan 0.183° = 0.0032$.',
        'Screen: $h = 2 \\times 700 \\times 0.0032 = 4.5$ mm.',
        'Panel: $h = 2 \\times 1500 \\times 0.0032 = 9.6$ mm.'
      ],
      a: 'About 4.5 mm at 700 mm and 9.6 mm at 1.5 m.'
    },
    {
      title: 'Which alarm does a 60-year-old hear?',
      q: 'Using the ISO 7029 (2000) medians for men, how much has the threshold shifted at 1 kHz and at 4 kHz by the age of 60?',
      steps: [
        '$(60 - 18)^2 = 1764$.',
        '1 kHz: $0.004 \\times 1764 = 7$ dB. 4 kHz: $0.016 \\times 1764 = 28$ dB.',
        'A 4 kHz beeper loses about 21 dB more audibility than a 1 kHz tone for the median 60-year-old man — before any noise-induced loss.'
      ],
      a: 'About 7 dB at 1 kHz and 28 dB at 4 kHz.'
    }
  ],
  quiz: [
    { q: 'Why do many people need reading glasses from their mid-40s?', choices: ['The eye\'s focusing power falls, so the near point moves beyond reading distance', 'The eye gets longer', 'The retina loses cells in the centre', 'Screens are too bright'], a: 0, why: 'The lens stiffens and the amplitude of accommodation falls; comfortable reading at 400 mm needs about 5 D, reached by the average person around 45.' },
    { q: 'Which alarm is most likely to be heard by older workers in a noisy workshop?', choices: ['A tone with most of its energy between about 500 Hz and 2 kHz, plus a flashing light', 'A 6 kHz beep', 'A very quiet chime', 'A voice message at 4 kHz'], a: 0, why: 'Age-related loss is greatest at high frequencies; lower tones and a second sense reach everyone.' },
    { q: 'People of the same age differ more in strength and fitness than the averages of different age groups do.', a: true, why: 'Individual variation is large; a fit 60-year-old may exceed a sedentary 30-year-old — so design for the range.' },
    { q: 'How tall must characters be to subtend 20 minutes of arc at 600 mm?', answer: 3.49, unit: 'mm', why: '$h = 2 \\times 600 \\times \\tan(10′) = 1200 \\times 0.00291 = 3.5$ mm.' },
    { q: 'The best answer to lower average strength in an older workforce is…', choices: ['Lower the forces and add handling aids for everyone', 'Move older workers out of physical jobs', 'Strength tests at hiring', 'Longer lunch breaks'], a: 0, why: 'Reducing demands helps every worker and keeps experienced people in the job.' }
  ],
  problems: [
    { q: 'Using Hofstetter\'s average, what is the near point of a 48-year-old?', answer: 244, unit: 'mm', tol: 0.01, steps: ['$A = 18.5 - 0.3 \\times 48 = 4.1$ D.', '$d = 1000/4.1 = 244$ mm.'] },
    { q: 'Using the ISO 7029 (2000) coefficient for men at 8 kHz (0.022), what is the median threshold shift at 65?', answer: 48.6, unit: 'dB', tol: 0.01, steps: ['$(65 - 18)^2 = 2209$.', '$0.022 \\times 2209 = 48.6$ dB.'] }
  ],
  ranges: [
    { dim: 'Character height on screens, panels and labels', range: 'at least about 20–22′ of arc', unit: '', who: 'older readers at the far end of the viewing distance', why: 'Readable without strain even as near focus and contrast sensitivity decline.', limits: 'More for poor light, low contrast or vibration; 22′ is 4.5 mm at 700 mm and 9.6 mm at 1.5 m.', setting: ['office', 'workshop', 'vehicle'], src: 'ISO 9241-303' },
    { dim: 'Illuminance where workers are older', range: 'one step above the task value (e.g. 750 lx instead of 500 lx)', unit: '', who: 'workers whose sight is below normal — common after about 50', why: 'Makes up part of the light lost in the older eye.', limits: 'Only with glare controlled; adjustable task lights suit mixed ages better than brighter ceilings.', setting: ['office', 'workshop', 'health'], src: 'EN 12464-1 (context modifiers)' },
    { dim: 'Main frequencies of auditory alarms', range: [500, 2500], unit: 'Hz', who: 'the oldest workers, and anyone with high-frequency hearing loss or hearing protection', why: 'Age-related and noise-induced losses are smallest at these frequencies.', limits: 'The alarm must still stand out from the background noise; add a visual signal.', setting: 'all', src: 'ISO 7731; ISO 7029' },
    { dim: 'Forces and weights in tasks for a mixed-age workforce', range: 'set from the weaker end of the oldest group', unit: '', who: 'older women at the low end of the strength range', why: 'Grip strength in the mid-60s averages some 20–25 % below its peak; tasks set for the young exclude them.', limits: 'Individual differences are large; aids and lower forces help everyone.', setting: 'all', src: 'Dodds et al. (2014); ISO/TR 22411' },
    { dim: 'Night shifts for older workers', range: 'fewer, or a choice of day work, from about the mid-40s on request', unit: '', who: 'shift workers whose sleep and recovery suffer with age', why: 'Sleep gets lighter and the body clock earlier with age, so shift-work tolerance often falls.', limits: 'Many older workers cope well; offer choice rather than rules by age.', setting: ['workshop', 'health', 'field'], src: 'Reviews of shift-work tolerance (e.g. Costa, 2003); HSE HSG256' }
  ],
  applications: [
    'Lighting, signage and screen design for workplaces with many older workers — see [the lighting tool](#/tools/environment/light) and every recommended range in [the Dimension finder](#/tools/ranges).',
    'Alarm and warning design that reaches ears with age-related loss.',
    'Handling aids and lower forces to keep experienced workers in physical jobs.',
    'Age management: shift choice, training and Work Ability Index follow-up.'
  ],
  history: 'Spectacles for reading appeared in Italy around 1290. Hofstetter\'s simple age formulas for the eye\'s focusing power date from 1950. From the 1980s Juhani Ilmarinen and colleagues at the Finnish Institute of Occupational Health followed ageing municipal workers, developed the concept of work ability and the Work Ability Index, and argued that work should be adapted to people throughout their working life.',
  sources: [
    'ISO 7029, *Acoustics — Statistical distribution of hearing thresholds related to age and gender* (the median model quoted here is from the 2000 edition).',
    'ISO 9241-303, *Ergonomics of human-system interaction — Requirements for electronic visual displays*; ISO 7731, *Ergonomics — Danger signals for public and work areas — Auditory danger signals*; EN 12464-1, *Light and lighting — Lighting of work places — Part 1: Indoor work places*.',
    'ISO/IEC Guide 71, *Guide for addressing accessibility in standards*, and ISO/TR 22411, ergonomics data for addressing the needs of older persons and persons with disabilities.',
    'H. W. Hofstetter, "A useful age-amplitude formula" (1950) — average, least and greatest amplitudes of accommodation by age.',
    'R. M. Dodds et al., "Grip strength across the life course: normative data from twelve British studies", *PLoS ONE* 9 (2014).',
    'R. A. Weale, *The Senescence of Human Vision* (Oxford University Press, 1992).',
    'J. Ilmarinen, *Towards a Longer Worklife! Ageing and the Quality of Worklife in the European Union* (Finnish Institute of Occupational Health, 2006).',
    'G. Costa, "Factors influencing health of workers and tolerance to shift work", *Theoretical Issues in Ergonomics Science* 4 (2003).'
  ],
  sim: 'or-ageing'
}

);
