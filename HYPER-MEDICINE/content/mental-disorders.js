/* HYPER-MEDICINE · content/mental-disorders.js — Mind and Mental Health: depression, anxiety
 * disorders, bipolar disorder, schizophrenia and psychosis, trauma and PTSD, eating disorders
 * and addiction. Current classification (DSM-5-TR, ICD-11) in plain words, causes as
 * interacting biological, psychological and social factors, treatments with their evidence.
 * Safe-messaging rules apply throughout: no method details, person-first language, and on
 * eating disorders no numbers about weight, food or body size. */
(function () {
  'use strict';

  // the same crisis wording on every page of the branch
  const CRISIS = 'If you or someone you know is thinking about suicide or might act on thoughts of self-harm, reach out now — you do not have to wait until things get worse. Crisis lines listen at any hour: **988** in the US and Canada (call or text), **Samaritans 116 123** in the UK and Ireland, **ERAN 1201** in Israel; elsewhere, find a line through your health service or the International Association for Suicide Prevention. If a life is in immediate danger, call your local emergency number.';

  Hyper.add(

  /* ================================================================ DEPRESSION */
  {
    id: 'depression', parent: 'mental-disorders', title: 'Depression', level: 1,
    short: 'More than sadness: weeks of low mood or lost interest, with changes in sleep, energy, thinking and self-worth. It is common, it has many interacting causes, and talking therapies, medicines or both help most people recover.',
    keywords: ['depression', 'major depressive disorder', 'depressive episode', 'low mood', 'anhedonia', 'loss of interest', 'persistent depressive disorder', 'dysthymia', 'postnatal depression', 'perinatal depression', 'seasonal depression', 'grief', 'antidepressant', 'CBT', 'behavioural activation', 'PHQ-9'],
    prereq: ['mental-health-basics', 'stress-coping', 'synapses'],
    related: ['anxiety-disorders', 'bipolar-disorder', 'suicide-prevention', 'mental-health-treatment', 'sleep', 'thyroid', 'physical-activity', 'alcohol'],
    body: `
For Ana, a 45-year-old teacher, it did not arrive as sadness. It arrived as tiredness that sleep did not fix, then as a flatness in which lessons she had loved felt like wading through mud. She woke at four with a knot of dread, stopped seeing friends and told herself she was a burden to her family. It took two months and a colleague's gentle question before she saw her doctor. Treatment — a course of talking therapy and, later, an antidepressant — did not work overnight, but by the summer she recognised herself again.

### What it is
Everyone feels low sometimes. **Depression** — major depressive disorder in the American DSM-5-TR, a depressive episode in the WHO's ICD-11 — is different in depth and in length: for **at least two weeks**, most of the day and nearly every day, a person has **low mood** or a **loss of interest or pleasure** in things they usually enjoy, together with several of:
- sleeping much less or much more than usual;
- a change in appetite, eating much less or more;
- tiredness and loss of energy, or feeling slowed down — or restless;
- difficulty concentrating or making decisions;
- feelings of worthlessness or excessive guilt;
- thoughts of death or of suicide.

It is graded mild, moderate or severe by how many symptoms there are and how much they disrupt life. Related patterns include **persistent depressive disorder** (milder but lasting two years or more), depression in pregnancy or after birth (**perinatal depression**, which affects fathers too), and depression that returns with the seasons. Grief after a loss can look similar, but it usually comes in waves tied to reminders of the person, and self-worth is kept; grief that stays severe and disabling for many months is recognised as prolonged grief disorder.

People describe depression less as sadness than as heaviness, numbness or greyness. Thinking slows and turns harsh. **Hopelessness is a symptom of the illness, not an accurate forecast** — which is why it is worth holding on to the fact that most people recover.

### How common
WHO estimated that about 280 million people were living with depression in 2019 — roughly one adult in twenty at any time — and that it is one of the leading causes of disability worldwide. It is about one and a half times as common in women as in men, though men are less likely to seek help and more likely to show it as irritability, anger or heavy drinking.

### What causes it
There is no single cause. Genes contribute (twin studies put heritability at roughly a third), and so do stressful events — loss, conflict, unemployment, debt — early adversity, loneliness, long-term physical illness and pain, some medicines, [[alcohol]] and drugs, and conditions such as an underactive [[thyroid]]. In the brain, depression is linked with changes in stress-hormone regulation, in the networks that handle reward and emotion, and in the brain's ability to form new connections. The popular story that depression is simply "low serotonin" is too simple — reviews have not found consistent evidence for it — but that does not mean antidepressants fail: trials show they help many people, probably through slower changes that follow their first effect at the [[synapses]].

### Treatment
Care is usually **stepped**: the less intensive options first, more when needed.
- **Talking therapies**: cognitive behavioural therapy (CBT), behavioural activation, interpersonal therapy, counselling and problem-solving; for milder depression, guided self-help, group courses and structured exercise programmes.
- **Antidepressant medicines**, most often SSRIs or SNRIs (see [[mental-health-treatment]]). They take two to four weeks to begin working and six to eight to judge; after recovery they are usually continued for months to prevent a relapse, and stopped gradually with medical advice.
- For moderate to severe depression, **therapy and medicine together** tend to work better than either alone. If the first treatment does not help, a different one often does; for severe or persistent depression there are further options, including electroconvulsive therapy under anaesthesia and brain stimulation.

What helps alongside: small, planned activities even when motivation is absent (motivation often follows action, not the other way round), a regular sleep pattern, daily movement, keeping in touch with people, and cutting down on alcohol.

> [!warn] Seek help urgently if someone with depression talks about suicide or not wanting to live, stops eating or drinking, or seems out of touch with reality. ${CRISIS}
`,
    ideas: [
      'Depression means at least two weeks of low mood or loss of interest, with changes in sleep, energy, appetite, concentration and self-worth.',
      'It arises from interacting biological, psychological and social causes; "low serotonin" is an oversimplification.',
      'Talking therapies and antidepressants both help; for moderate to severe depression, the combination often works best.',
      'Antidepressants take weeks to work and should be stopped gradually with medical advice.',
      'Hopelessness is a symptom, not a prediction: most people with depression recover.'
    ],
    pitfalls: [
      'Depression is just sadness, and people could snap out of it if they tried — It is an illness that changes sleep, energy, thinking and the capacity for pleasure. Telling someone to cheer up does not work; support and treatment do.',
      'Antidepressants are "happy pills" that change your personality — They do not make people artificially happy; when they work they lift the weight of the illness so the person feels more like themselves. Side effects are real and worth discussing with the prescriber.',
      'If the first treatment does not help, nothing will — Response varies from person to person. Many people who do not improve with a first therapy or medicine improve with a different one, a higher intensity, or a combination.'
    ],
    examples: [
      {
        title: 'Ana gets help',
        q: 'Ana, 45, has had two months of low mood, early waking, exhaustion and feelings of worthlessness. How is she assessed and helped?',
        steps: [
          'Her doctor listens to her story, asks about sleep, appetite, energy, alcohol and any thoughts of suicide, and uses a short questionnaire (the PHQ-9) to gauge severity: moderate.',
          'Blood tests rule out an underactive thyroid and anaemia, which can mimic depression.',
          'They agree on a course of CBT. The first step is behavioural activation: scheduling small activities she used to value — a walk with a friend, twenty minutes in the garden — and noting how she feels afterwards.',
          'After six weeks she is a little better but still waking early, so she decides with her doctor to add an SSRI; she is told to expect side effects in the first weeks and benefits after two to four.',
          'By three months her PHQ-9 score has fallen into the mild range. She continues the medicine for several months after feeling well, then reduces it gradually with her doctor.'
        ],
        a: 'Careful assessment, a talking therapy, then a medicine added when progress stalled — improvement was gradual, and recovery came over months.'
      },
      {
        title: 'A new father',
        q: 'Six weeks after his daughter\'s birth, Yusuf feels numb, irritable and guilty that he does not feel the joy he expected. What is going on, and what can help?',
        steps: [
          'Depression after a birth affects mothers and, less often but significantly, fathers; sleep loss and big life changes add to the risk.',
          'His partner encourages him to mention it at the baby\'s check-up; the nurse suggests he sees his own doctor.',
          'He is offered a talking therapy; they also plan more sleep for both parents by taking turns at night, and he reconnects with a friend who is also a new father.',
          'Over two months the numbness lifts. Knowing that it was an illness, not a failure as a father, eased his guilt.'
        ],
        a: 'Perinatal depression can affect either parent; naming it and getting help early led to recovery.'
      }
    ],
    quiz: [
      { q: 'Which of these is one of the two core features of depression?', choices: ['Hearing voices', 'Loss of interest or pleasure in usual activities', 'Racing thoughts and needing little sleep', 'Fear of specific objects'], a: 1,
        why: 'Depression requires low mood or loss of interest or pleasure (anhedonia) for at least two weeks. Racing thoughts with little need for sleep suggest mania; hearing voices is a psychotic symptom.' },
      { q: 'Depression is a sign of personal weakness that people could overcome by trying harder.', a: false,
        why: 'Depression is a health condition with biological, psychological and social causes. It affects people of every temperament and background, and it responds to treatment, not to willpower alone.' },
      { q: 'A friend started an antidepressant five days ago and says it is not working, so she will stop. What is the most accurate thing to know?', choices: ['If it has not worked in five days it never will', 'Antidepressants usually take two to four weeks to start helping, and stopping or changing is best discussed with the prescriber', 'She should double the dose herself', 'Side effects mean it is working'], a: 1,
        why: 'Benefits usually build over weeks, while some side effects come early and often fade. Any change should be discussed with the prescriber; doses should never be altered without advice.' },
      { q: 'What is the best current description of the cause of depression?', choices: ['A simple lack of serotonin', 'Purely a reaction to bad events', 'Interacting biological, psychological and social factors that differ from person to person', 'A character flaw'], a: 2,
        why: 'Genes, brain changes, stress, early experiences, illness and social circumstances combine differently in each person. The "chemical imbalance" story is too simple, even though medicines that act on brain chemistry help many people.' },
      { q: 'For moderate to severe depression, the evidence suggests that combining a talking therapy with an antidepressant is often more effective than either alone.', a: true,
        why: 'Pooled trials show a modest extra benefit from combining the two in moderate to severe depression, and therapy may lower the risk of relapse after treatment ends.' }
    ],
    applications: [
      'Screening for depression in primary care with short questionnaires such as the PHQ-9.',
      'Perinatal mental health care for mothers and fathers before and after birth.',
      'Stepped-care services that match the intensity of treatment to the severity of depression.',
      'Care for people with long-term physical illnesses, among whom depression is common and often missed.'
    ],
    sim: [{ id: 'mh-mood-chart', params: { pattern: 'depression' } }, 'mh-recovery']
  },

  /* ================================================================ ANXIETY DISORDERS */
  {
    id: 'anxiety-disorders', parent: 'mental-disorders', title: 'Anxiety disorders', level: 1,
    short: 'Anxiety is the body\'s alarm. In an anxiety disorder the alarm goes off too often, too loudly or at the wrong things, and avoidance keeps it that way. They are the commonest mental disorders — and among the most treatable.',
    keywords: ['anxiety', 'anxiety disorder', 'panic attack', 'panic disorder', 'generalised anxiety disorder', 'GAD', 'worry', 'social anxiety', 'phobia', 'agoraphobia', 'avoidance', 'exposure therapy', 'CBT', 'fight or flight', 'OCD', 'health anxiety'],
    prereq: ['mental-health-basics', 'stress-coping', 'adrenal-stress'],
    related: ['depression', 'ptsd', 'mental-health-treatment', 'sleep', 'heart-attack', 'thyroid', 'finance:money-anxiety'],
    body: `
The first time it happened, Tom was nineteen and on a packed train. His heart hammered, his hands tingled, he could not get his breath and he was certain he was dying. At the hospital his heart was checked and found healthy. But afterwards he began to dread the train, then buses, then anywhere he could not leave quickly — until his world had shrunk to home and the corner shop. Twelve sessions of cognitive behavioural therapy later, he was commuting again.

### What it is
Anxiety is the stress response aimed at the future: the brain predicts danger, and the body gets ready — faster heart, quick breathing, tight muscles, a churning stomach, a mind scanning for threat. It is protective and normal. It becomes an **anxiety disorder** when it is out of proportion to the real danger, lasts, and leads to avoidance or distress that disrupts life. The main types (grouped as anxiety or fear-related disorders in ICD-11 and DSM-5-TR):

| Type | The core of it |
|---|---|
| Generalised anxiety disorder | worry about many things, hard to control, most days for months, with tension, poor sleep and tiredness |
| Panic disorder | repeated unexpected panic attacks and fear of the next one |
| Agoraphobia | fear of places where escape or help might be hard — crowds, transport, being out alone |
| Social anxiety disorder | intense fear of being judged or embarrassed in social situations |
| Specific phobia | fear of a particular thing — heights, animals, needles, flying |
| Separation anxiety disorder | excessive fear of being apart from people one is attached to |

Close relatives are classified separately: obsessive-compulsive disorder (intrusive thoughts and repeated rituals), health anxiety, and [[ptsd]] after a traumatic event.

A **panic attack** is a sudden surge of fear that peaks within minutes: pounding heart, chest tightness, breathlessness, dizziness, tingling, a sense of unreality, the fear of dying or losing control. It is terrifying but not dangerous in itself, and it passes.

### How common
WHO estimated about 300 million people were living with an anxiety disorder in 2019 — about one person in twenty-five — making them the commonest mental disorders. They often start in childhood or adolescence and are more common in women.

### Why it keeps going
Anxiety feeds on a loop. A situation triggers a prediction of danger; the body's alarm rises; the person escapes, avoids or uses a **safety behaviour** (sitting by the door, carrying water, rehearsing every sentence); the anxiety falls, and the relief teaches the brain that escaping was what saved them. The fear is never tested, so it stays — or spreads. Worry works in a similar way: it feels like problem-solving but mostly keeps attention locked on threat.

The causes are the familiar mixture: an inherited, sensitive temperament; stressful or frightening experiences; learning from others; ongoing stress; and physical contributors such as too much caffeine, an overactive thyroid and some drugs.

### Treatment
- **Cognitive behavioural therapy** is the first choice for most anxiety disorders. Its central ingredient is **exposure**: facing feared situations gradually and on purpose, step by step up a ladder, staying long enough to learn that the feared outcome does not happen or can be coped with, and dropping safety behaviours. For generalised anxiety, guided self-help and applied relaxation also help.
- **Medicines**: SSRIs and SNRIs are the usual first choice, and help many people, often combined with therapy. Benzodiazepines calm anxiety quickly but bring tolerance and dependence, so they are for short-term use only.
- **Helping yourself**: less caffeine, regular exercise, slow breathing, noticing avoidance and approaching things in small steps, a set "worry time" each day instead of all day.

> [!warn] Chest pain, especially the first time, severe breathlessness or fainting should always be checked — call your local emergency number rather than assume it is panic. ${CRISIS}
`,
    ideas: [
      'Anxiety is a normal alarm; a disorder is when it is out of proportion, persistent and disruptive.',
      'Avoidance and safety behaviours bring relief now but keep the fear alive, because it is never tested.',
      'Panic attacks are frightening but not dangerous in themselves, and they pass within minutes.',
      'CBT with graded exposure is the first-choice treatment; SSRIs and SNRIs help too, and benzodiazepines are only for short-term use.',
      'Anxiety disorders are the commonest mental disorders and among the most treatable.'
    ],
    pitfalls: [
      'The best way to handle anxiety is to avoid what triggers it — Avoidance gives quick relief but teaches the brain that the situation was dangerous, so the fear grows. Gradually facing it, with support, is what lets it shrink.',
      'A panic attack can make your heart stop or make you faint — The racing heart of panic is a healthy heart working hard. Fainting from panic is rare (except in people with a blood or needle phobia). Chest pain should still be checked the first time, because panic and heart problems can feel alike.',
      'Anxiety disorders are just nerves or shyness — They can be as disabling as major physical illnesses, limiting work, study and relationships for years if untreated; they deserve proper treatment.'
    ],
    examples: [
      {
        title: 'Tom gets back on the train',
        q: 'After a panic attack on a train, Tom avoids public transport and crowded places. How does CBT help him?',
        steps: [
          'Understanding: his therapist draws his panic cycle — the racing heart is read as a heart attack, the fear makes the heart race more — and explains why avoidance has kept the fear going.',
          'Testing the fear of the sensations: in the session he deliberately makes his heart race, by running on the spot, and learns that the feelings are uncomfortable but harmless.',
          'A fear ladder: from standing at the station, to one stop off-peak, to a rush-hour journey. He climbs it over weeks, staying in each situation until he has learned something new, and gradually stops carrying his "safety" bottle of water.',
          'Setbacks are expected: a bad day in week six is treated as information, not failure.',
          'After twelve sessions he commutes daily. He keeps a relapse-prevention plan: notice any new avoidance and approach it early.'
        ],
        a: 'Understanding the cycle, testing the feared sensations and graded exposure broke the link between panic and avoidance.'
      },
      {
        title: 'Worry that never stops',
        q: 'Priya, 38, has worried about her children, her health, money and work nearly every day for a year. She sleeps badly and has constant neck pain. What might help?',
        steps: [
          'Her doctor recognises generalised anxiety disorder and checks for depression, alcohol use and an overactive thyroid.',
          'She starts guided self-help based on CBT: writing worries down, sorting practical problems (which she solves) from hypothetical "what ifs" (which she practises letting pass), and a fixed daily worry time.',
          'After two months she is better but still struggling, so she is offered individual CBT, and she and her doctor discuss an SSRI as an option; she decides to try it.',
          'She also cuts her coffee from five cups to one and walks at lunchtime. Over four months the worry becomes manageable.'
        ],
        a: 'Stepped care — guided self-help, then CBT with an optional medicine — plus lifestyle changes brought the worry under control.'
      }
    ],
    quiz: [
      { q: 'What mainly keeps an anxiety disorder going?', choices: ['Facing the feared situation', 'Avoidance and safety behaviours that prevent the fear from being tested', 'Too much exercise', 'Talking about it'], a: 1,
        why: 'Relief after escaping teaches the brain that the situation was dangerous and that escaping saved you. Graded exposure breaks this loop.' },
      { q: 'A panic attack is dangerous and can cause lasting harm to a healthy heart.', a: false,
        why: 'Panic produces intense but harmless sensations that peak within minutes and pass. A new chest pain should still be checked, because the sensations can resemble a heart problem.' },
      { q: 'Maria is very afraid of dogs. Which approach has the best evidence?', choices: ['Never going near dogs', 'Being made to hold a large dog at once, against her will', 'A planned, gradual series of steps towards dogs that she agrees to', 'Taking a benzodiazepine every time she goes out'], a: 2,
        why: 'Graded, collaborative exposure is the most effective treatment for specific phobias — often in only a few sessions. Forced flooding is not appropriate, and benzodiazepines can interfere with learning and cause dependence.' },
      { q: 'Why are benzodiazepines recommended only for short-term use in anxiety?', choices: ['They do not reduce anxiety', 'Tolerance and dependence develop, and stopping after long use can cause withdrawal', 'They are illegal', 'They cause mania'], a: 1,
        why: 'They work quickly but the body adapts: the same dose does less, and stopping after regular use brings rebound anxiety and withdrawal. Longer-term options include CBT and SSRIs or SNRIs.' },
      { q: 'How does social anxiety disorder differ from ordinary shyness?', choices: ['It does not differ', 'The fear of judgement is intense and persistent, and leads to avoidance that seriously limits life', 'It only affects children', 'It is caused by being unfriendly'], a: 1,
        why: 'Many people are shy; social anxiety disorder is recognised when fear of scrutiny is severe, lasting and disabling — avoiding work, study or relationships. It responds well to CBT.' }
    ],
    applications: [
      'CBT and exposure-based treatment in primary care and specialist clinics, often delivered in groups or online.',
      'Emergency departments, where recognising panic after a heart problem has been ruled out spares people repeated visits.',
      'School programmes that teach children about worry and coping before anxiety becomes entrenched.',
      'Treating fear of needles and of medical procedures, so people do not miss vaccines or care.'
    ],
    sim: 'mh-anxiety-cycle'
  },

  /* ================================================================ BIPOLAR DISORDER */
  {
    id: 'bipolar-disorder', parent: 'mental-disorders', title: 'Bipolar disorder', level: 2,
    short: 'Episodes of depression and of abnormally high or irritable mood and energy — mania or hypomania — lasting days to months, with stable stretches between. It is lifelong but very treatable, and many people live full lives with it.',
    keywords: ['bipolar disorder', 'manic depression', 'mania', 'hypomania', 'bipolar I', 'bipolar II', 'cyclothymia', 'mood stabiliser', 'lithium', 'mood episode', 'mixed features', 'mood chart', 'early warning signs', 'postpartum psychosis'],
    prereq: ['depression', 'mental-health-basics', 'sleep'],
    related: ['psychosis', 'suicide-prevention', 'mental-health-treatment', 'thyroid', 'chronic-kidney-disease', 'pregnancy'],
    body: `
At twenty-two, in the weeks after his final exams, Kofi hardly slept and did not feel tired. His thoughts raced, he talked so fast that friends could not follow, he spent his savings on equipment for a business that would "change the world", and he became angry when anyone doubted it. His family took him to hospital. The diagnosis — bipolar disorder — was a shock, and so was the deep depression that came the following winter. Today, ten years on, Kofi works as an engineer, takes a mood stabiliser, keeps a mood diary and knows that sleeping less is his early warning sign.

### What it is
Bipolar disorder (once called manic depression) causes **episodes** — lasting days, weeks or months — of mood and energy far outside a person's usual range, with periods of stable mood in between. These are not the ordinary ups and downs of a day.
- **Mania**: an elevated, expansive or irritable mood with a surge of energy and activity lasting at least a week (or any length if hospital care is needed), with several of: much less need for sleep, racing thoughts, fast or pressured speech, inflated self-esteem or grand ideas, distractibility, and risky behaviour — spending, driving, sex or business ventures. Severe mania can include psychotic symptoms and needs urgent care.
- **Hypomania**: similar but milder and shorter (at least four days), noticeable to others but without severe disruption or psychosis. It can feel good, which is why it is often not reported.
- **Depression**: as in [[depression]]; in bipolar disorder the depressive episodes are often longer and more frequent than the highs.

The classifications (DSM-5-TR, ICD-11) distinguish **bipolar I** (at least one manic episode), **bipolar II** (hypomania and depressive episodes, with depression usually the heavier burden) and **cyclothymia** (two years or more of milder ups and downs). Episodes can also have **mixed features** — the energy of mania with the despair of depression — a particularly risky state.

### How common
WHO estimated about 40 million people were living with bipolar disorder in 2019. Roughly one person in a hundred will have bipolar I or II over a lifetime, more if milder forms are counted. It usually begins in the late teens or twenties, and because the first episodes are often depressive, it can take years to be recognised.

### What causes it
Bipolar disorder is among the most strongly inherited mental disorders, although no single gene causes it and most children of a parent with it do not develop it. Episodes can be triggered by lost sleep, jet lag and disrupted routines, stress, drugs and alcohol, the weeks after childbirth, and — in some people — an antidepressant taken without a mood stabiliser.

### Treatment
- **Mood stabilisers**. Lithium is the best-established medicine for preventing both highs and lows, and it lowers the risk of suicide; it needs regular blood tests of its level and of kidney and thyroid function. Some anticonvulsant and antipsychotic medicines are also used. Valproate can seriously harm a baby in the womb, so it is avoided for anyone who could become pregnant unless strict conditions are met.
- **Antidepressants** are used cautiously and, in bipolar I, not on their own, because they can trigger mania in some people.
- **Psychological care**: learning about the condition, CBT, family-focused therapy and approaches that stabilise daily rhythms of sleep, meals and activity all reduce relapses.
- **Self-management**: a regular sleep pattern, a mood chart, a written list of personal early warning signs, a plan agreed in advance with family and care team, and low alcohol and drug use.

If someone seems to be becoming manic, stay calm, avoid arguing, reduce noise and stimulation, and contact their care team or a doctor early — people in mania often do not feel unwell.

> [!warn] Mania with dangerous behaviour, several nights with almost no sleep, confusion or losing touch with reality, or any talk of suicide needs urgent help — the risk of suicide is higher in bipolar disorder, especially during depressive and mixed episodes. A new mother who becomes suddenly confused, agitated or paranoid in the days after birth needs emergency care. ${CRISIS}
`,
    ideas: [
      'Bipolar disorder causes episodes of depression and of mania or hypomania lasting days to months, with stable periods between.',
      'Bipolar I involves at least one manic episode; bipolar II involves hypomania and depression; cyclothymia is a milder, long-lasting pattern.',
      'It is strongly heritable, and episodes are often triggered by lost sleep, stress, substances or childbirth.',
      'Lithium and other mood stabilisers prevent relapses; psychological care and regular routines add to their effect.',
      'Early warning signs, a mood chart and a plan made in advance let many people manage it well.'
    ],
    pitfalls: [
      'Bipolar disorder means someone\'s mood swings many times a day — It involves distinct episodes lasting days, weeks or months, not quick changes of feeling within a day; everyday moodiness is not bipolar disorder.',
      'Mania is just being very happy and productive — Mania often brings irritability, poor judgement, risky decisions and exhaustion, and can lead to debts, broken relationships or psychosis. The person may not recognise it as illness.',
      'People with bipolar disorder cannot hold jobs or have families — With treatment and self-management many people work, study, raise children and lead full lives; stability is the usual goal and often achieved.'
    ],
    examples: [
      {
        title: 'Kofi\'s plan for staying well',
        q: 'After two episodes, Kofi wants to reduce his chance of relapse. What does a relapse-prevention plan contain?',
        steps: [
          'Medicine: he and his psychiatrist choose lithium, with blood tests every few months to check its level and his kidney and thyroid function.',
          'A mood chart: each evening he scores his mood and notes his hours of sleep, which shows patterns he could not see before.',
          'Early warning signs, written with his sister: sleeping less without feeling tired, starting many projects at once, spending more — and, for depression, withdrawing from friends.',
          'An action plan: if two signs appear, he protects his sleep, cancels non-essential commitments and contacts his care team within days, not weeks.',
          'Steady routines: regular times for sleep, meals and exercise, and very little alcohol.'
        ],
        a: 'Medicine, monitoring, known early warning signs and a pre-agreed action plan made his episodes rarer and caught them earlier.'
      }
    ],
    quiz: [
      { q: 'How is bipolar disorder different from ordinary mood swings?', choices: ['There is no difference', 'It involves episodes of abnormal mood and energy lasting days to months, with changes in sleep, thinking and behaviour', 'It means changing mood several times an hour', 'It only causes happiness'], a: 1,
        why: 'Bipolar disorder is defined by distinct episodes — mania or hypomania and depression — each lasting days or longer, not by quick changes of feeling.' },
      { q: 'What distinguishes hypomania from mania?', choices: ['Hypomania is milder and shorter, without severe disruption or psychosis', 'Hypomania involves depression', 'Hypomania lasts longer', 'Hypomania needs hospital care'], a: 0,
        why: 'Hypomania lasts at least four days and is noticeable to others but does not cause severe impairment or psychosis; mania lasts at least a week (or needs hospital care) and can include psychosis.' },
      { q: 'Why are antidepressants not usually given on their own to someone with bipolar I disorder?', choices: ['They never work in depression', 'They can trigger a switch into mania in some people', 'They cause weight loss', 'They are addictive'], a: 1,
        why: 'In some people with bipolar disorder an antidepressant alone can provoke mania or rapid cycling, so it is combined with a mood stabiliser or avoided.' },
      { q: 'Sleeping much less than usual without feeling tired can be an early warning sign of a manic episode.', a: true,
        why: 'A reduced need for sleep is one of the earliest and most reliable signs, and lost sleep can itself push mood upwards, so protecting sleep is part of prevention.' },
      { q: 'Many people with bipolar disorder work, study and raise families.', a: true,
        why: 'With treatment, self-management and support, long periods of stability are common. The condition is lifelong but manageable.' }
    ],
    applications: [
      'Specialist mood-disorder clinics and lithium monitoring programmes.',
      'Planning pregnancy and the weeks after birth, when the risk of relapse is higher.',
      'Mood-tracking apps and diaries that help people and clinicians spot early warning signs.',
      'Advance statements that let a person set out how they wish to be treated if they become unwell.'
    ],
    history: 'The Australian psychiatrist John Cade reported the effect of lithium on mania in 1949 — one of the first specific medicines in psychiatry — and it remains a cornerstone of treatment.',
    sim: { id: 'mh-mood-chart', params: { pattern: 'bipolar1' } }
  },

  /* ================================================================ PSYCHOSIS AND SCHIZOPHRENIA */
  {
    id: 'psychosis', parent: 'mental-disorders', title: 'Schizophrenia and psychosis', level: 2,
    short: 'Psychosis means losing touch with shared reality — hearing voices, holding unshakeable false beliefs, disorganised thinking. It has many causes; schizophrenia is one. Early treatment with medicine, therapy and family support helps many people recover.',
    keywords: ['psychosis', 'schizophrenia', 'hallucinations', 'hearing voices', 'delusions', 'paranoia', 'negative symptoms', 'antipsychotic', 'clozapine', 'early intervention', 'first episode psychosis', 'dopamine', 'cannabis', 'schizoaffective', 'CBT for psychosis', 'recovery'],
    prereq: ['mental-health-basics', 'synapses', 'brain-regions'],
    related: ['bipolar-disorder', 'depression', 'mental-health-treatment', 'dementia', 'sleep', 'metabolic-syndrome', 'smoking'],
    body: `
In her second year at university, Leila began to hear a voice commenting on what she did. She became sure that her neighbours had put cameras in her room and stopped going to lectures. Her brother noticed she had barely eaten in days and persuaded her to see a doctor. She was referred to an early intervention team, who offered a low dose of an antipsychotic medicine, talking therapy for psychosis and sessions with her family, and helped her return to her course part-time. Two years later she graduated.

### What psychosis is
**Psychosis** describes experiences in which a person loses some contact with the reality others share:
- **hallucinations** — hearing, seeing or feeling things that others do not; hearing voices is the commonest;
- **delusions** — firmly held beliefs that are not true and do not change with evidence, often of being watched, followed or harmed;
- **disorganised thinking** — speech that jumps between ideas or is hard to follow.

Psychosis is a symptom, not a single illness. It can come with [[bipolar-disorder|bipolar disorder]] or severe [[depression]]; from drugs, especially frequent use of high-potency cannabis and stimulants, or from alcohol withdrawal; from physical illness such as infections, brain conditions and delirium; after childbirth; in [[dementia]]; and even after extreme lack of [[sleep]].

**Schizophrenia** is diagnosed when psychotic symptoms persist — for at least a month in ICD-11, and with signs of the illness lasting six months in DSM-5-TR — and are not explained by another cause. Alongside hallucinations and delusions it often brings **negative symptoms** (reduced motivation, flatter expression of emotion, withdrawal from others) and **cognitive difficulties** with attention, memory and planning, which frequently affect daily life most. Schizophrenia does not mean a "split personality"; that is a different and much rarer condition.

### How common
WHO estimated about 24 million people were living with schizophrenia in 2019, roughly one person in 300. It usually starts between the late teens and early thirties, often after months of subtler change — withdrawal, suspiciousness, falling behind at school or work.

### What causes it
Many genes each add a small risk, and they interact with events in brain development, complications in pregnancy and birth, childhood adversity, heavy cannabis use in adolescence, and social stresses such as isolation, discrimination and migration. In the brain, psychosis is linked to overactive dopamine signalling in certain pathways: ordinary things start to feel intensely significant, and the mind builds explanations around them. Antipsychotic medicines reduce this signalling by blocking dopamine receptors at the [[synapses]].

### Treatment and recovery
- **Early intervention** services aim to shorten the time a person spends with untreated psychosis, which is linked to better outcomes.
- **Antipsychotic medicines** reduce hallucinations and delusions and lower the risk of relapse. Side effects — weight gain and metabolic changes, sleepiness, restlessness, stiffness — vary between medicines and are managed with the prescriber; stopping suddenly raises the risk of relapse. For people who have not improved with two antipsychotics, clozapine helps many, with regular blood tests.
- **Psychological and social support**: CBT for psychosis, family intervention (which reduces relapses), supported employment and education, and help with housing and money.
- **Physical health**: people with schizophrenia live on average 10–20 years less, mostly from preventable heart and lung disease linked to smoking, side effects and poorer access to care — so regular checks matter.

Outcomes vary widely: some people have a single episode and recover fully, many have long periods of stability, and some live with continuing symptoms while still building good lives. People living with schizophrenia are far more likely to be harmed by others than to harm anyone.

If someone you know seems psychotic: stay calm, speak simply, do not argue about their beliefs or pretend to share them, acknowledge how frightening it must feel, and help them reach a doctor.

> [!warn] Get urgent help if someone with psychosis may harm themselves or someone else, is not eating or drinking, or becomes suddenly confused — sudden confusion can be a medical emergency. Psychosis in the weeks after childbirth is an emergency too. ${CRISIS}
`,
    ideas: [
      'Psychosis — hallucinations, delusions, disorganised thinking — is a symptom with many possible causes, from drugs and physical illness to mental disorders.',
      'Schizophrenia is diagnosed when psychosis persists; negative and cognitive symptoms often affect daily life most.',
      'Causes combine many small genetic risks with developmental, drug-related and social factors; overactive dopamine signalling is central to psychosis.',
      'Early intervention, antipsychotic medicine, family support and help with work and study give the best outcomes.',
      'People living with schizophrenia are far more often victims of violence than perpetrators, and many recover or live well.'
    ],
    pitfalls: [
      'Schizophrenia means having a split personality — It means psychosis that persists, often with reduced motivation and difficulties with thinking. "Multiple personalities" belong to dissociative identity disorder, a different condition.',
      'People with schizophrenia are violent — The vast majority are never violent and are much more likely to be victims. The small rise in risk is mostly linked to drug and alcohol use and untreated symptoms, and falls with treatment.',
      'Once someone has had psychosis they will never recover — Many people recover fully after a first episode, especially with early treatment, and many more live stable, meaningful lives with ongoing support.'
    ],
    examples: [
      {
        title: 'Leila and the early intervention team',
        q: 'Leila, 20, hears a critical voice and believes she is being watched. How does an early intervention service help?',
        steps: [
          'Assessment rules out physical causes and drug use, and asks about safety, sleep, eating and family history.',
          'She is offered a low dose of an antipsychotic, chosen with her, with checks of weight, blood sugar and blood fats because of possible metabolic side effects.',
          'In CBT for psychosis she learns to notice when the voice gets louder (when stressed or short of sleep), to test her beliefs about being watched, and to respond to the voice rather than obey it.',
          'Family sessions help her parents and brother understand psychosis and reduce tension at home, which lowers the risk of relapse.',
          'An employment and education worker arranges a part-time return to university. Over a year the voice fades and she graduates on time.'
        ],
        a: 'Fast, joined-up care — medicine, therapy, family work and practical support — led to recovery and a return to study.'
      },
      {
        title: 'Talking with someone who is paranoid',
        q: 'Carlos\'s father is convinced the neighbours are poisoning his water. Carlos wants to help without making things worse. What works?',
        steps: [
          'He avoids arguing about the belief, which usually strengthens it, and also avoids pretending to agree.',
          'He responds to the feeling: "That sounds really frightening. I can see how worried you are."',
          'He looks for common ground: "You haven\'t been sleeping. Shall we see the doctor about the stress this is causing?"',
          'He contacts his father\'s doctor, and he knows that if his father becomes a danger to himself or others he will call the emergency number.'
        ],
        a: 'Acknowledge the fear, do not argue or collude, find a shared goal such as sleep or stress, and involve professionals.'
      }
    ],
    quiz: [
      { q: 'Schizophrenia means that a person has more than one personality.', a: false,
        why: 'Schizophrenia involves persistent psychosis and often negative and cognitive symptoms. Multiple identities belong to a different, much rarer condition, dissociative identity disorder.' },
      { q: 'Which of the following can cause psychosis?', choices: ['Only schizophrenia', 'Many things, including drugs, physical illness, severe sleep loss, bipolar disorder and severe depression', 'Only drugs', 'Only stress'], a: 1,
        why: 'Psychosis is a symptom with many causes, which is why a careful assessment, including a physical examination, comes first.' },
      { q: 'A friend tells you he is being followed by secret agents. What is the most helpful response?', choices: ['Tell him firmly that he is wrong and prove it', 'Agree with him so he feels supported', 'Acknowledge how frightening it must feel, without arguing or agreeing, and encourage him to see a doctor', 'Ignore it'], a: 2,
        why: 'Arguing tends to entrench a delusion and agreeing reinforces it. Empathy for the feeling, calm, and a push towards help work best.' },
      { q: 'Why do early intervention services try to treat psychosis as soon as possible?', choices: ['A shorter time with untreated psychosis is linked to better outcomes', 'Psychosis always gets better on its own', 'Medicines only work in the first week', 'To avoid involving the family'], a: 0,
        why: 'The longer psychosis goes untreated, the poorer the outcome tends to be; fast, comprehensive care improves recovery and return to work or study.' },
      { q: 'People living with schizophrenia have a shorter average life expectancy mainly because of…', choices: ['violence', 'preventable physical illness such as heart and lung disease', 'the illness itself damaging the heart', 'nothing — life expectancy is normal'], a: 1,
        why: 'The gap of 10–20 years is driven mostly by cardiovascular and respiratory disease, linked to smoking, medicine side effects and poorer access to care — which is why physical health checks are part of good care.' }
    ],
    applications: [
      'Early intervention in psychosis services for young people with a first episode.',
      'Physical-health monitoring clinics for people taking antipsychotic medicines.',
      'Public health messages about high-potency cannabis and the adolescent brain.',
      'Individual placement and support schemes that help people with psychosis into paid work.'
    ]
  },

  /* ================================================================ TRAUMA AND PTSD */
  {
    id: 'ptsd', parent: 'mental-disorders', title: 'Trauma and PTSD', level: 2,
    short: 'After a terrifying event most people recover over weeks. In post-traumatic stress disorder the memory stays raw — returning as if it were happening now — with avoidance and constant alertness. Trauma-focused therapies help most people, even years later.',
    keywords: ['PTSD', 'post-traumatic stress disorder', 'trauma', 'flashbacks', 'nightmares', 'complex PTSD', 'hypervigilance', 'avoidance', 'trauma-focused CBT', 'cognitive processing therapy', 'prolonged exposure', 'EMDR', 'psychological first aid', 'acute stress reaction', 'debriefing'],
    prereq: ['stress-coping', 'anxiety-disorders', 'brain-regions'],
    related: ['depression', 'addiction', 'suicide-prevention', 'mental-health-treatment', 'sleep', 'adrenal-stress'],
    body: `
Eighteen months after a lorry crushed the front of her car, Ruth still could not drive past the junction. The crash replayed without warning — the noise, the smell of the airbag — and in her nightmares it was always about to happen again. She jumped at every horn, snapped at her children and slept in snatches. She had told herself she should be over it. A course of trauma-focused cognitive behavioural therapy, twelve sessions, gave her back the road — and her sleep.

### Trauma and recovery
A **traumatic event** involves actual or threatened death, serious injury or sexual violence — experienced directly, witnessed, learned about when it happens to someone close, or met again and again at work, as by paramedics, police and firefighters. Surveys across many countries suggest most people go through at least one such event in their lives. In the days and weeks after, shock, fear, poor sleep, replaying the event and feeling numb are **normal reactions**, and for most people they fade over a month or so.

### What PTSD is
In **post-traumatic stress disorder** they do not fade. The DSM-5-TR describes four groups of symptoms lasting more than a month:
- **re-experiencing**: unwanted memories, nightmares and **flashbacks** in which the event feels as if it is happening now, with strong distress or body reactions to reminders;
- **avoidance** of reminders — places, people, conversations, thoughts;
- **negative changes in thoughts and mood**: persistent fear, guilt, shame or anger, blaming oneself, feeling cut off from others, being unable to feel happiness;
- **heightened alertness**: being constantly on guard, startling easily, irritability, poor concentration and sleep, sometimes reckless behaviour.

ICD-11 defines PTSD more narrowly around re-experiencing in the present, avoidance and a persistent sense of current threat, and adds **complex PTSD**: the same core plus lasting problems with managing emotions, a deeply negative view of oneself and difficulty in relationships — usually after prolonged or repeated trauma such as childhood abuse, domestic violence, torture or captivity.

International surveys suggest that roughly one person in 25 has had PTSD at some point in life; the figure is higher among people who have lived through war, disaster or assault.

### Why the memory stays raw
Under extreme threat the brain stores vivid sensory fragments — sounds, smells, images — but poorly labels them with *when* and *where*. A reminder then triggers the memory as a present danger rather than a past event. The alarm system stays primed, and avoidance, understandable as it is, prevents the memory from being revisited in safety and filed as "over".

### Treatment
- **Trauma-focused psychological therapies** are the first choice: trauma-focused CBT (including cognitive processing therapy, cognitive therapy for PTSD and prolonged exposure) and eye movement desensitisation and reprocessing (EMDR). Each helps the person revisit the memory safely, update its meaning ("it was not my fault"; "it is over") and reclaim avoided parts of life. Most people improve substantially, often within 8–16 sessions, even decades after the event.
- **Medicines**: some antidepressants, such as sertraline or venlafaxine, are an option when therapy is not wanted or available, or alongside it.
- **Soon after a trauma**, the best-evidenced help is practical and human — safety, calm, connection with loved ones, information, and follow-up about a month later to see who is still struggling. A single compulsory "debriefing" session for everyone does not prevent PTSD and may make it worse for some, so guidelines advise against it.

Helping someone: be available without pushing them to talk, keep routines, reduce alcohol, and encourage help if symptoms persist beyond a month. During a flashback, grounding can help — notice five things you can see, four you can touch, three you can hear.

> [!warn] If someone is still in danger — from domestic violence, for example — or is thinking about suicide, get help now. ${CRISIS}
`,
    ideas: [
      'Most people exposed to trauma recover naturally over weeks; PTSD is when the reactions persist beyond a month.',
      'PTSD combines re-experiencing (flashbacks, nightmares), avoidance, negative changes in mood and thinking, and constant alertness.',
      'Traumatic memories are stored vividly but without a clear sense of "then", so reminders feel like present danger.',
      'Trauma-focused CBT and EMDR are the best-evidenced treatments and work even years later.',
      'Soon after trauma, practical support and follow-up help; single compulsory debriefing sessions are not recommended.'
    ],
    pitfalls: [
      'Everyone who goes through a traumatic event develops PTSD — Most people recover over the following weeks. PTSD affects a minority, and the risk depends on the event, earlier experiences and, very much, on the support people receive afterwards.',
      'It is best to make people talk through the event straight away — Forcing a detailed account soon after trauma can make things worse for some. Offer safety, practical help and a listening ear, and follow up later.',
      'If PTSD has lasted for years, it is too late to treat — Trauma-focused therapies work for people whose trauma was many years or decades ago.'
    ],
    examples: [
      {
        title: 'Ruth drives again',
        q: 'Ruth has had nightmares, flashbacks and avoidance of driving since a crash 18 months ago. How does trauma-focused CBT help?',
        steps: [
          'Assessment confirms PTSD and checks for depression, alcohol use and safety.',
          'She learns how trauma memories work, which makes her symptoms feel less frightening: they are an understandable reaction, not a sign that something is wrong with her mind.',
          'With her therapist she goes through the memory in detail, in the safety of the room, and updates its "hot spots": she had believed she should have seen the lorry, but the timings show she had under a second.',
          'She learns to tell "then" from "now" when reminders trigger her: the smell of an airbag then, her kitchen now.',
          'She gradually returns to the junction, first as a passenger, then driving. By the end of 12 sessions the flashbacks are rare and she sleeps through most nights.'
        ],
        a: 'Revisiting the memory safely, correcting the self-blame and gradually reclaiming avoided places resolved most of her symptoms.'
      },
      {
        title: 'After a disaster at work',
        q: 'A factory explosion injures several workers. How should colleagues and managers support those involved in the first weeks?',
        steps: [
          'Meet basic needs first: safety, medical care, contact with family, practical information about what happens next.',
          'Offer a listening ear to those who want to talk, without pressing anyone to describe the event.',
          'Encourage people to use their usual sources of support and to go easy on alcohol.',
          'Arrange a follow-up about a month later to identify anyone whose symptoms have not settled, and refer them for trauma-focused therapy.'
        ],
        a: 'Practical, compassionate support now, and screening and treatment for those who do not recover — not compulsory debriefing.'
      }
    ],
    quiz: [
      { q: 'Most people who go through a traumatic event go on to develop PTSD.', a: false,
        why: 'Most people have strong reactions at first that fade over weeks. PTSD develops in a minority, more often when the trauma is severe or repeated and when support afterwards is lacking.' },
      { q: 'What is a flashback?', choices: ['A pleasant memory', 'Re-experiencing a traumatic event as if it were happening now, with strong fear and body reactions', 'Forgetting the event completely', 'A dream about the future'], a: 1,
        why: 'In a flashback the memory intrudes with the vividness of the present, a hallmark of PTSD caused by memories stored without a clear sense of time and place.' },
      { q: 'Which treatments have the strongest evidence for PTSD?', choices: ['Trauma-focused CBT and EMDR', 'Benzodiazepines', 'Avoiding all reminders indefinitely', 'A single debriefing session for everyone'], a: 0,
        why: 'Trauma-focused psychological therapies are first-line in international guidelines. Benzodiazepines do not treat PTSD, avoidance maintains it, and routine single-session debriefing is not recommended.' },
      { q: 'What does ICD-11 add in "complex PTSD"?', choices: ['Hallucinations', 'Lasting problems with emotions, self-image and relationships, usually after prolonged or repeated trauma', 'A requirement that the trauma was recent', 'Physical injuries'], a: 1,
        why: 'Complex PTSD includes the core PTSD symptoms plus disturbances in self-organisation, typically after long-lasting or repeated trauma such as abuse or captivity.' }
    ],
    applications: [
      'Trauma-focused therapy services for veterans, refugees, survivors of violence and emergency workers.',
      'Psychological first aid after disasters, accidents and terrorist attacks.',
      'Trauma-informed care in hospitals, schools and prisons, which avoids retraumatising people.',
      'Screening in emergency departments and after intensive care, where PTSD is common and often missed.'
    ],
    sim: { id: 'mh-anxiety-cycle', params: { fear: 'reminder' }, title: 'How avoidance keeps fear going' }
  },

  /* ================================================================ EATING DISORDERS */
  {
    id: 'eating-disorders', parent: 'mental-disorders', title: 'Eating disorders', level: 2,
    short: 'Serious mental illnesses in which eating, and often thoughts about body shape, take over a person\'s life. They affect people of every age, gender and body size, can be dangerous to physical health, and recovery is possible — the sooner help begins, the better.',
    keywords: ['eating disorder', 'anorexia nervosa', 'bulimia nervosa', 'binge eating disorder', 'ARFID', 'avoidant restrictive food intake disorder', 'OSFED', 'body image', 'family-based treatment', 'CBT-E', 'recovery', 'warning signs'],
    prereq: ['mental-health-basics', 'anxiety-disorders', 'depression'],
    related: ['suicide-prevention', 'mental-health-treatment', 'arrhythmias', 'bone-calcium', 'reproductive-hormones', 'child-growth'],
    body: `
Noa was fifteen and a keen runner when she began skipping lunch "to be healthier". Over the months her rules about food grew stricter, she trained harder even when injured, and she was always cold and tired. At meals she became tense and tearful. Her parents did not know what was wrong but knew something was, and took her to the family doctor, who referred her to a specialist eating disorder service. In family-based treatment her parents took charge of meals for a while, supported by the team, and slowly Noa's health, and then her old sense of humour, returned. A year later she was running with her team again.

> [!note] This page deliberately gives no numbers about weight, food or body size. They are not needed to understand eating disorders, and they can be unhelpful for someone who is unwell.

### What they are
Eating disorders are **serious mental illnesses**, not lifestyle choices, vanity or diets taken too far. They affect people of every gender, age, ethnicity, income and body size — and most people with an eating disorder are not underweight, so you cannot tell by looking. The main types, as described in DSM-5-TR and ICD-11:
- **Anorexia nervosa**: restricting food so that body weight becomes too low for the person's health, with an intense fear of gaining weight and a distorted view of one's body or of its importance.
- **Bulimia nervosa**: repeated episodes of binge eating — eating a large amount with a sense of loss of control — followed by behaviours to make up for it, such as making oneself sick or exercising compulsively.
- **Binge eating disorder**: repeated binges with loss of control and marked distress, without regular compensating behaviours. It is the most common eating disorder.
- **ARFID** (avoidant/restrictive food intake disorder): eating very little or a very narrow range of foods because of sensory sensitivity, fear of choking or being sick, or little interest in eating — not because of body image.
- **Other specified feeding or eating disorders**: serious illnesses that do not fit the patterns above exactly, and deserve just as much care.

WHO estimated that about 14 million people were living with an eating disorder in 2019, including nearly 3 million children and adolescents, and many cases go unrecognised — especially in boys and men, older adults and people in larger bodies.

### Why they matter
Malnutrition and purging affect the whole body — the heart's rhythm, the balance of salts in the blood, bones, hormones and periods, the gut and the brain. Anorexia nervosa has one of the highest death rates of any mental illness, through medical complications and suicide. Yet **recovery is possible**, and many people recover fully, especially with early treatment, though it can take time.

### What causes them
Genes play a substantial part, particularly in anorexia, along with temperament (perfectionism, anxiety), puberty, stress and trauma, teasing and weight stigma, cultural pressure about appearance, and sports or careers that focus on body shape. Dieting is a common trigger. Starvation itself changes thinking — making it rigid and preoccupied with food — which helps keep the illness going and is one reason why restoring nourishment is part of treatment.

### Treatment
Early assessment by a doctor and referral to specialist services make a real difference.
- For children and adolescents with anorexia, **family-based treatment**, in which parents are supported to take charge of meals for a time, has the best evidence.
- For adults, eating-disorder-focused **CBT** and other specialist therapies; for bulimia and binge eating disorder, guided self-help based on CBT is often the first step.
- Care from dietitians and regular **medical monitoring**; hospital care when physical health is at risk. Medicines play a limited, supporting role, for example for co-occurring depression or anxiety.

### Helping someone
Choose a calm, private moment; talk about specific things you have noticed and about how the person seems — tired, anxious, withdrawn — not about their weight or appearance. Expect denial or anger; the illness often resists help. Avoid comments about bodies and dieting, including praise for weight loss, and keep meals as calm as possible. For a child or teenager, act promptly and see a doctor. Carers need support too.

> [!warn] Fainting, chest pain, a racing or irregular heartbeat, severe weakness, confusion or vomiting blood need urgent medical care — call your local emergency number. ${CRISIS}
`,
    ideas: [
      'Eating disorders are serious mental illnesses that affect people of every age, gender and body size — you cannot tell by looking.',
      'The main types are anorexia nervosa, bulimia nervosa, binge eating disorder (the most common), ARFID and other specified eating disorders.',
      'They affect the whole body, and anorexia has one of the highest death rates of any mental illness — but recovery is possible.',
      'Family-based treatment for young people and specialist CBT for adults have the best evidence; early help improves outcomes.',
      'When worried about someone, talk about behaviour and feelings, not weight or appearance.'
    ],
    pitfalls: [
      'You can tell someone has an eating disorder by how thin they are — Most people with an eating disorder are not underweight, and serious medical danger can exist at any body size. Behaviour, thoughts and physical symptoms matter, not appearance.',
      'Eating disorders only affect teenage girls — They affect boys and men, adults of all ages, and people of every background and body size; these groups are often diagnosed late because of this myth.',
      'Eating disorders are a choice, or about vanity — They are illnesses with genetic, psychological and social causes. No one chooses them, and willpower alone does not end them; specialist treatment does.'
    ],
    examples: [
      {
        title: 'Noa and family-based treatment',
        q: 'Noa, 15, has been restricting food and over-exercising for months. How does family-based treatment work?',
        steps: [
          'A specialist team assesses her physical health — heart rate, blood tests, temperature — and decides she can be treated at home with close monitoring.',
          'Phase one: her parents, coached by the therapist, take charge of meals, treating the illness — not Noa — as the problem. The whole family attends sessions.',
          'Phase two: as her health improves, control over eating is handed back to Noa step by step.',
          'Phase three: the focus shifts to adolescence — friendships, independence, running with her team — and to spotting early signs of relapse.',
          'Throughout, her doctor monitors her physical health, and her parents get support for themselves.'
        ],
        a: 'Parents supported to lead on nourishment, then a gradual handing back of control, with medical monitoring — the best-evidenced approach for young people.'
      },
      {
        title: 'Binge eating in adulthood',
        q: 'Marcus, 34, has had frequent episodes of eating that feel out of control, followed by shame, for several years. He has never told anyone. What help is available?',
        steps: [
          'He tells his doctor, who listens without judgement, recognises binge eating disorder and checks his physical and mental health.',
          'He starts guided self-help based on CBT: regular, planned eating through the day (skipping meals tends to set off binges), noticing triggers such as stress and boredom, and finding other ways to cope with them.',
          'He learns that shame and harsh dieting feed the cycle, so the programme deliberately avoids strict dieting.',
          'Over four months his episodes become rare; he has a plan for the stressful times when they might return.'
        ],
        a: 'Binge eating disorder is common and treatable; guided CBT self-help, with regular eating and managing triggers, is an effective first step.'
      }
    ],
    quiz: [
      { q: 'You can reliably tell whether someone has an eating disorder by looking at their body.', a: false,
        why: 'Most people with an eating disorder are not underweight, and serious illness can exist at any body size. Behaviours, thoughts and physical symptoms are what matter.' },
      { q: 'Which is the most common eating disorder?', choices: ['Anorexia nervosa', 'Bulimia nervosa', 'Binge eating disorder', 'ARFID'], a: 2,
        why: 'Binge eating disorder is the most common, yet it is often unrecognised because people hide it out of shame and because it does not match the stereotype.' },
      { q: 'You are worried about a friend who seems to be restricting food. Which opening is most helpful?', choices: ['"You look far too thin."', '"I\'ve noticed you seem really tired and you\'ve stopped coming to lunch — I\'m worried about you. How are you doing?"', '"Just eat more and you\'ll be fine."', '"Everyone diets, don\'t worry about it."'], a: 1,
        why: 'Focusing on specific behaviours and on how the person is feeling, rather than on weight or appearance, is less likely to feed the illness and more likely to open a conversation.' },
      { q: 'For children and adolescents with anorexia nervosa, which treatment has the strongest evidence?', choices: ['Family-based treatment', 'Medicines alone', 'Waiting for them to grow out of it', 'Encouraging more exercise'], a: 0,
        why: 'Family-based treatment, in which parents are supported to lead on nourishment before gradually handing back control, has the best evidence in young people.' },
      { q: 'Eating disorders are mainly about vanity and could be stopped by choice.', a: false,
        why: 'They are serious illnesses with genetic, psychological and social causes; the illness itself changes thinking. Specialist treatment, not willpower, leads to recovery.' }
    ],
    applications: [
      'Specialist eating disorder services for children, adolescents and adults, including day and inpatient care.',
      'Training for family doctors, teachers and sports coaches to spot early signs.',
      'Guidance for the media and the fitness industry on avoiding weight stigma and harmful messages.',
      'Medical monitoring of heart rhythm, blood salts and bone health in people who are unwell.'
    ]
  },

  /* ================================================================ ADDICTION */
  {
    id: 'addiction', parent: 'mental-disorders', title: 'Addiction', level: 2,
    short: 'Addiction is a health condition in which a substance or activity takes over: craving, loss of control and carrying on despite harm. It changes how the brain learns and chooses, it has many causes, and treatment and recovery are common.',
    keywords: ['addiction', 'substance use disorder', 'dependence', 'tolerance', 'withdrawal', 'craving', 'alcohol use disorder', 'opioid use disorder', 'gambling disorder', 'gaming disorder', 'dopamine', 'reward', 'relapse', 'recovery', 'harm reduction', 'naloxone', 'methadone', 'buprenorphine', 'motivational interviewing'],
    prereq: ['synapses', 'how-drugs-work', 'mental-health-basics'],
    related: ['alcohol', 'smoking', 'poisoning-overdose', 'liver-disease', 'hiv', 'depression', 'ptsd', 'dose-response', 'finance:present-bias'],
    body: `
Mark's drinking began as a way to unwind after long shifts. Over the years one drink became several, then drinking started in the morning to stop the shaking. He tried to stop on his own and felt so ill that he gave up after a day. At 45, frightened by a liver test, he told his doctor everything. A medically supervised withdrawal, a medicine to reduce cravings, counselling and a weekly recovery group followed. Two years on, he says the hardest part was the first conversation.

### What it is
**Addiction** is when using a substance or doing an activity becomes compulsive: strong cravings, trouble controlling how much or how often, giving it priority over other things that matter, and carrying on despite clear harm. DSM-5-TR calls it a **substance use disorder** and grades it mild, moderate or severe according to how many of eleven criteria apply — covering impaired control, effects on work and relationships, risky use, and the body's adaptation (tolerance and withdrawal). ICD-11 distinguishes a **harmful pattern of use** from **dependence**. Both classifications also recognise **gambling disorder**, and ICD-11 adds **gaming disorder**.

**Tolerance** means the brain adapts to a drug, so the same dose does less. **Withdrawal** is the rebound when the drug stops and the adaptation is left unopposed — often the opposite of the drug's effects. These are *physical dependence*, which can occur with medicines taken exactly as prescribed, such as some painkillers or antidepressants, without any addiction. Addiction is about the loss of control and the harm.

### What happens in the brain
Every addictive drug raises dopamine in the brain's reward circuit. Dopamine is less a pleasure chemical than a teaching signal — "this matters, do it again". With repeated use, cues such as places, people and moods come to trigger powerful craving; ordinary rewards feel flatter; the brain's stress systems grow more active, so using becomes a way to escape feeling bad; and the prefrontal "brakes" on impulse weaken. How much this should be called a brain disease is debated, but it explains why addiction is not simply a matter of willpower.

### How common, and who is at risk
WHO estimated that around 400 million people lived with an alcohol use disorder in 2019, and the UN Office on Drugs and Crime around 64 million with a drug use disorder in 2022; nicotine addiction ([[smoking]]) is more widespread still. Risk rises with genes (roughly half of the variation), starting young, trauma and adversity, mental health conditions such as anxiety, depression, ADHD and [[ptsd]], easy availability, poverty and isolation. Connection, purpose and support protect.

### Treatment and recovery
Addiction responds to treatment about as well as other long-term conditions such as asthma or high blood pressure, and relapse, like a flare-up, is a reason to adjust treatment, not to give up. Surveys suggest that most people who once had a substance use disorder no longer have one years later.
- **Alcohol**: medically supervised withdrawal for people who are dependent, then medicines that reduce cravings or support abstinence (acamprosate, naltrexone, disulfiram), talking therapy and mutual-help groups.
- **Opioids**: treatment with methadone or buprenorphine, which cuts the risk of death by half or more while people stay in it, and helps them rebuild their lives; naloxone reverses an overdose.
- **Stimulants**: contingency management, which rewards drug-free tests, has the strongest evidence.
- **For everyone**: motivational interviewing, CBT, family approaches, mutual-help groups, and harm reduction — needle and syringe programmes, naloxone — which save lives and prevent HIV and hepatitis without increasing drug use.

Words matter: "a person with a substance use disorder" or "a person in recovery", rather than labels that shame people away from help. Families do better with calm, positive communication than with confrontation, and they need support themselves.

> [!warn] Someone who cannot be woken, is breathing very slowly or not at all, or has blue lips after taking drugs or alcohol needs help now — call your local emergency number, give naloxone if opioids may be involved and it is available, and see [[poisoning-overdose]]. Stopping heavy daily drinking or long-term sedative medicines suddenly can cause seizures or confusion; get medical advice first. ${CRISIS}
`,
    ideas: [
      'Addiction is compulsive use despite harm, with craving and loss of control; DSM-5-TR grades substance use disorder as mild, moderate or severe.',
      'Tolerance and withdrawal are the brain adapting to a drug; physical dependence alone is not the same as addiction.',
      'Addictive drugs hijack dopamine\'s learning signal, so cues trigger craving while ordinary rewards feel flatter.',
      'Effective treatments exist — medicines for alcohol, opioid and nicotine dependence, psychological therapies, mutual help and harm reduction.',
      'Recovery is common, and relapse is part of many recoveries rather than a sign of failure.'
    ],
    pitfalls: [
      'Addiction is a lack of willpower or a moral failing — It is a health condition shaped by genes, brain changes, experiences and circumstances. Shame keeps people from seeking help; compassion and treatment help them recover.',
      'Anyone who has withdrawal symptoms when stopping a medicine is addicted — Physical dependence, with tolerance and withdrawal, can occur with medicines taken exactly as prescribed. Addiction means loss of control and continued use despite harm.',
      'Harm reduction encourages drug use — Needle and syringe programmes, naloxone and opioid treatment reduce deaths and infections and help people into care, without increasing drug use.'
    ],
    examples: [
      {
        title: 'Mark stops drinking safely',
        q: 'Mark, 45, drinks heavily every day and shakes in the morning. How is he helped?',
        steps: [
          'His doctor assesses how much and how often he drinks, his withdrawal symptoms, his liver tests and his mood, without judgement.',
          'Because he is physically dependent, stopping suddenly could cause seizures or delirium, so he has a planned withdrawal under medical supervision, with medicine to prevent these complications.',
          'Afterwards he chooses a medicine to reduce cravings and starts counselling that uses motivational interviewing and CBT to plan for high-risk times.',
          'He joins a weekly mutual-help group and reconnects with his brother.',
          'A slip at a wedding six months in is discussed openly with his counsellor and becomes a lesson for his plan, not the end of his recovery.'
        ],
        a: 'Safe, supervised withdrawal followed by medicine, therapy, peer support and a plan for setbacks.'
      },
      {
        title: 'From prescription to treatment',
        q: 'Jess was prescribed opioid painkillers after an injury and, over two years, began using more than prescribed and buying extra. What helps?',
        steps: [
          'She tells her doctor, who responds without blame and explains opioid use disorder as a treatable health condition.',
          'She starts buprenorphine, which eases cravings and withdrawal and greatly lowers the risk of a fatal overdose.',
          'She receives a naloxone kit, and her partner learns how to use it.',
          'Counselling and help with her pain through physiotherapy and other approaches address why she started using more.',
          'A year later she is working, and she and her doctor review her treatment together regularly.'
        ],
        a: 'Opioid agonist treatment, naloxone, counselling and better pain care — treating the condition, not punishing the person.'
      }
    ],
    quiz: [
      { q: 'People with addiction simply lack willpower.', a: false,
        why: 'Addiction involves changes in how the brain learns, values rewards and controls impulses, shaped by genes, experiences and circumstances. Treatment and support work far better than blame.' },
      { q: 'A man has taken a prescribed painkiller exactly as directed for months after surgery, and feels unwell when he stops. What does this show?', choices: ['He is addicted', 'Physical dependence — his body has adapted — which is not the same as addiction', 'The medicine was fake', 'He was never in pain'], a: 1,
        why: 'Tolerance and withdrawal show adaptation (physical dependence). Addiction means compulsive use, loss of control and continuing despite harm. Tapering off with his doctor avoids withdrawal.' },
      { q: 'Which treatment for opioid use disorder is most strongly linked to fewer deaths?', choices: ['Stopping suddenly without support', 'Methadone or buprenorphine treatment', 'Short detox with no follow-up', 'Prison'], a: 1,
        why: 'Opioid agonist treatment cuts the risk of death by half or more while people remain in it. Detox alone is followed by a high risk of relapse and overdose, because tolerance has fallen.' },
      { q: 'Why can the same dose of a drug have less effect after regular use?', choices: ['The drug becomes weaker over time', 'The brain adapts and pushes back against the drug\'s effect (tolerance)', 'The person is imagining it', 'The liver stops working'], a: 1,
        why: 'Counter-adaptations in the brain oppose the drug, so more is needed for the same effect — and when the drug stops, the unopposed adaptation shows up as withdrawal.' },
      { q: 'Needle and syringe programmes increase drug use in a community.', a: false,
        why: 'Large studies show they reduce HIV and hepatitis C transmission and connect people with treatment, without increasing drug use.' }
    ],
    applications: [
      'Opioid agonist treatment and take-home naloxone programmes.',
      'Alcohol screening and brief advice in primary care and emergency departments.',
      'Stop-smoking services combining medicines with behavioural support.',
      'Gambling support services and financial safeguards such as self-exclusion schemes.'
    ],
    sim: 'mh-tolerance'
  }

  );
})();
