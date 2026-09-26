/* HYPER-MEDICINE · content/wellbeing.js — Mind and Mental Health: what mental health is,
 * and stress and coping. Written for the general public, including people who are
 * struggling right now: warm, accurate, non-stigmatising; it explains and never diagnoses. */
(function () {
  'use strict';

  // the same crisis wording on every page of the branch
  const CRISIS = 'If you or someone you know is thinking about suicide or might act on thoughts of self-harm, reach out now — you do not have to wait until things get worse. Crisis lines listen at any hour: **988** in the US and Canada (call or text), **Samaritans 116 123** in the UK and Ireland, **ERAN 1201** in Israel; elsewhere, find a line through your health service or the International Association for Suicide Prevention. If a life is in immediate danger, call your local emergency number.';

  Hyper.add(

  /* ================================================================ WHAT MENTAL HEALTH IS */
  {
    id: 'mental-health-basics', parent: 'wellbeing', title: 'What mental health is', level: 1,
    short: 'Mental health is how we think, feel, cope and connect with others. Everyone has it, it moves along a continuum from thriving to unwell, and it is shaped by biology, experience and circumstance together.',
    keywords: ['mental health', 'wellbeing', 'well-being', 'mental illness', 'mental disorder', 'continuum', 'dual continuum', 'biopsychosocial', 'stigma', 'resilience', 'DSM-5-TR', 'ICD-11', 'when to get help', 'emotional health', 'psychological health'],
    prereq: ['brain-regions', 'nervous-system-organization'],
    related: ['stress-coping', 'depression', 'anxiety-disorders', 'suicide-prevention', 'mental-health-treatment', 'sleep', 'physical-activity', 'finance:money-anxiety'],
    body: `
Maya is twenty-six, and for most of last year she would have said she was fine. She went to work, saw friends and slept well enough. Then her father fell ill, a project at work collapsed and the rent went up, all in the same month. She began waking at three in the morning, snapped at people she loved and stopped answering messages. Nothing was wrong with Maya as a person, and she was not weak — her mental health had shifted, as anyone's can. After some honest conversations, a few changes at work and eight sessions with a counsellor, it shifted back.

### What it is
Mental health is how we think, feel, cope and relate to other people. In the World Health Organization's description it is what lets a person handle the ordinary stresses of life, use their abilities, learn and work, and take part in their community. Like physical health, everybody has it, and it changes — with circumstances, with the stages of life, sometimes from one week to the next.

It helps to picture a line rather than two boxes marked "well" and "ill":

| Thriving | Coping, under strain | Struggling | Unwell |
|---|---|---|---|
| sleeping and eating as usual, enjoying things | more worried or irritable, but managing | low or anxious most days, pulling back from people | symptoms most of the time, daily life seriously affected |

People move along it in both directions. A **mental disorder** — [[depression]], an [[anxiety-disorders|anxiety disorder]], [[psychosis]] and others — is recognised when a particular pattern of symptoms lasts long enough and causes enough distress or disruption. Clinicians share two classifications for this: the American DSM-5-TR (2022) and the World Health Organization's ICD-11 (in use since 2022). Health and illness are not simple opposites, though: a person living with a diagnosed condition can flourish, and a person with no diagnosis can be quietly languishing. This "dual continuum" idea, from the research of the sociologist Corey Keyes, is why wellbeing is worth looking after whether or not anything is "wrong".

### How common
WHO estimated that about 970 million people — roughly one in eight — were living with a mental disorder in 2019, with anxiety and depression by far the most common. Large international surveys suggest that about one person in two will have one at some point in life (2023). About half of these conditions begin before the age of 18 and most by the mid-twenties, which is why support for young people matters so much. In many countries most people who need care still do not receive it.

### What shapes it
No single cause explains mental health. Doctors speak of the **biopsychosocial** picture — three kinds of influence that interact:
- **biological**: genes (which raise or lower risk but rarely decide it), brain development, hormones, physical illness, [[sleep]], [[alcohol]] and drugs;
- **psychological**: habits of thinking, ways of coping learned early, and experiences — especially adversity in childhood;
- **social**: relationships and loneliness, poverty and debt, work, housing, discrimination, violence and war.

A helpful image is a bucket. Vulnerability sets its size, stresses pour in, and coping — rest, support, activity, treatment — is the tap that drains it. The same stress overflows one bucket and not another, which is why "other people cope, so why can't I?" is an unfair question to ask yourself.

### Looking after it
The evidence supports some unglamorous basics: regular [[physical-activity|physical activity]], enough sleep, time with people who matter, doing things that bring pleasure or a sense of achievement, learning something new, helping others, and keeping alcohol low. None of them cures an illness, but together they build resilience.

### When to seek help
Talk to a doctor, nurse or other health professional if low mood, worry, or changes in sleep, appetite or energy last more than about two weeks, keep coming back, or make work, study or relationships hard — or if you are relying on alcohol or drugs to get through. Asking early is good sense, not weakness: most mental disorders respond to [[mental-health-treatment|treatment]], and earlier help usually means a quicker recovery.

> [!warn] ${CRISIS}
`,
    ideas: [
      'Mental health is part of health: everyone has it, and it moves along a continuum from thriving to unwell and back.',
      'A mental disorder is a recognised pattern of symptoms that lasts and causes distress or disruption; DSM-5-TR and ICD-11 describe them.',
      'Causes are biological, psychological and social at once — the biopsychosocial picture — and they interact.',
      'Health and illness are separate axes: people with a diagnosis can flourish, people without one can languish.',
      'Asking for help early is effective, and most mental disorders respond to treatment.'
    ],
    pitfalls: [
      'Mental illness is a sign of weakness or a failure of character — It is a health condition with biological, psychological and social causes, like asthma or diabetes. Strength has nothing to do with who becomes ill; asking for help is itself a strong and sensible act.',
      'You are either mentally healthy or mentally ill — Mental health is a continuum that everyone moves along, and wellbeing and illness are partly independent: people living with a diagnosis can thrive.',
      'People with mental illness are dangerous — The great majority are never violent, and people with serious mental illness are far more likely to be victims of violence than to harm others.'
    ],
    examples: [
      {
        title: 'Maya\'s bad year',
        q: 'Maya, 26, has had three weeks of early waking, irritability and pulling away from friends after several stresses at once. What might help, and when should she seek professional help?',
        steps: [
          'Name what is happening without judging it: several large stresses arrived together, and her sleep, mood and patience show the strain — she has moved from "coping" towards "struggling" on the continuum.',
          'Look at the three kinds of influence. Biological: broken sleep, more coffee and wine than usual. Psychological: she tells herself she "should" manage alone. Social: her father\'s illness, a hard month at work, money worries.',
          'Start with what she can change: a regular bedtime, a daily walk, telling one friend honestly how things are, asking her manager for a lighter fortnight.',
          'Because the changes have lasted more than two weeks and are affecting her work, she books an appointment with her family doctor, who listens, checks for depression and anxiety, and refers her for short-term counselling.',
          'Six weeks later she is sleeping better and back in touch with friends; she knows the early signs to watch for next time.'
        ],
        a: 'Self-care and support first, and a professional opinion because the changes lasted over two weeks and affected daily life — early help shortened the difficult stretch.'
      },
      {
        title: 'Worried about a friend',
        q: 'Sam notices that a flatmate has barely left his room for two weeks, has stopped eating with the others and seems flat. What is a good way to help?',
        steps: [
          'Choose a quiet, private moment and say what you have noticed, kindly and specifically: "You\'ve seemed really low lately, and I\'m worried about you."',
          'Listen more than you talk. Resist the urge to fix, argue or say "cheer up"; showing you understand matters more than having answers.',
          'Ask directly about safety if you are worried — asking about suicide does not put the idea in anyone\'s head (see [[suicide-prevention]]).',
          'Encourage professional help and offer practical support: finding a doctor, going along to the first appointment.',
          'Keep in touch afterwards, and look after yourself too.'
        ],
        a: 'Notice, ask, listen without judging, encourage professional help, and stay in touch — and act at once if there is any risk to life.'
      }
    ],
    quiz: [
      { q: 'Which statement best describes the relation between mental health and mental illness?', choices: ['They are opposites: having one means lacking the other', 'They are related but separate: a person with a diagnosis can still flourish', 'Mental health only matters for people who are ill', 'Mental illness is permanent once it starts'], a: 1,
        why: 'The dual-continuum research shows wellbeing and illness vary partly independently. Many people living with a diagnosed condition have good lives, and illness is very often temporary or well controlled with treatment.' },
      { q: 'Two colleagues go through the same redundancy. One copes; the other becomes depressed. What is the most accurate explanation?', choices: ['The second one is weaker', 'The second one is exaggerating', 'People differ in vulnerability and in the support and coping they have, and these interact with the stress', 'Redundancy cannot cause depression'], a: 2,
        why: 'Vulnerability (genes, earlier experiences, health), current support and the way stress lands all differ between people. Comparing buckets of different sizes says nothing about character.' },
      { q: 'Most mental disorders first appear in later adult life, after 40.', a: false,
        why: 'About half begin before the age of 18 and most by the mid-twenties, which is why support in schools, universities and early adulthood matters so much.' },
      { q: 'People living with a serious mental illness are…', choices: ['usually violent', 'more likely to be victims of violence than perpetrators', 'unable to work or study', 'always unwell'], a: 1,
        why: 'The stereotype of dangerousness is one of the most harmful and least accurate. Most people with serious mental illness are never violent, many work and study, and they are more often harmed by others.' },
      { q: 'When is it sensible to talk to a professional about how you feel?', choices: ['Only when you cannot get out of bed', 'When low mood, worry or changes in sleep or appetite last more than about two weeks or interfere with daily life', 'Never — it should be handled privately', 'Only if someone else insists'], a: 1,
        why: 'Seeking help early usually means faster recovery. Anyone having thoughts of suicide should seek help straight away, through a crisis line or the local emergency number.' }
    ],
    applications: [
      'Mental health first-aid courses that teach people to notice, ask, listen and encourage help.',
      'Workplace and school wellbeing programmes built on the biopsychosocial picture.',
      'Public campaigns against stigma, which make people more willing to seek help early.',
      'Primary care, where most common mental health problems are first recognised and treated.'
    ],
    history: 'For centuries mental illness was explained by humours, moral failure or possession, and people were often confined rather than treated. The psychiatrist George Engel proposed the biopsychosocial model in 1977; community-based care, modern psychotherapies and medicines, and the recovery movement led by people with lived experience have since changed what is possible.',
    sim: { id: 'mh-mood-chart', params: { pattern: 'everyday' } }
  },

  /* ================================================================ STRESS AND COPING */
  {
    id: 'stress-coping', parent: 'wellbeing', title: 'Stress and coping', level: 1,
    short: 'Stress is the body\'s response to demands it sees as a threat: helpful in short bursts, harmful when it never switches off. Coping means changing the problem when you can and caring for how it feels when you cannot.',
    keywords: ['stress', 'coping', 'fight or flight', 'cortisol', 'adrenaline', 'HPA axis', 'chronic stress', 'allostatic load', 'burnout', 'burn-out', 'Yerkes-Dodson', 'inverted U', 'resilience', 'relaxation', 'breathing', 'mindfulness', 'problem solving'],
    prereq: ['mental-health-basics', 'adrenal-stress', 'homeostasis-feedback'],
    related: ['anxiety-disorders', 'depression', 'sleep', 'hypertension', 'physical-activity', 'alcohol', 'finance:money-anxiety'],
    body: `
Daniel's week: a deadline on Friday, a child with a fever and a car that will not start. His heart races when his manager's name appears on his phone, his shoulders ache, and he wakes at four and cannot get back to sleep. By Saturday, the deadline met, he sleeps for ten hours and feels almost himself again. That is stress doing its job — and then switching off. The trouble starts when it does not switch off.

### The stress response
When the brain judges that a demand is a threat — a dog running at you, or an email marked "urgent" — two systems respond. Within seconds the **sympathetic nervous system** releases adrenaline and noradrenaline: the heart speeds up, blood pressure rises, breathing quickens, muscles tense, sugar floods into the blood and digestion pauses. Over minutes the **hypothalamic–pituitary–adrenal (HPA) axis** raises cortisol (see [[adrenal-stress|the adrenal glands and stress]]), which keeps fuel available and damps inflammation, and then, by negative feedback, turns itself down. In short bursts this fight-or-flight response is healthy: it sharpens attention and helps us rise to a challenge.

Some arousal improves performance and too much spoils it. The old Yerkes–Dodson idea draws this as an inverted U, with the peak at lower arousal for complex tasks than for simple ones. It is a simplification — the original 1908 experiments were on mice and later evidence is mixed — but it is a useful picture: a few nerves before an exam help, panic does not.

### When stress becomes chronic
The same response, switched on day after day without recovery — caring for an ill relative, debt, an unsafe home, discrimination, a job with high demands and little control — begins to cost more than it gives. Researchers call the accumulated wear and tear **allostatic load**. Common signs:
- **body**: tension headaches, aching muscles, stomach upsets, raised blood pressure, infections that linger, poor sleep;
- **mind**: constant worry, irritability, poor concentration, feeling overwhelmed or numb;
- **behaviour**: withdrawing from people, more alcohol, caffeine or smoking, eating much more or less than usual.

Long-lasting stress raises the risk of [[depression]], [[anxiety-disorders|anxiety disorders]], [[hypertension|high blood pressure]] and heart disease. **Burn-out** is described in ICD-11 as an occupational phenomenon — exhaustion, growing distance or cynicism about one's work, and a sense of achieving less — rather than a medical illness, but it deserves to be taken just as seriously.

### Coping
The psychologists Richard Lazarus and Susan Folkman described stress as two judgements: *is this a threat?* and *do I have what it takes to deal with it?* That suggests two families of coping:
- **problem-focused**, which changes the situation: break a task into steps, ask for help, say no, deal with the unopened bill, make a plan;
- **emotion-focused**, which changes how it feels when the situation cannot change: talk to someone, move your body, breathe slowly, get outdoors, write it down, practise mindfulness, allow some humour.

Both are useful; the skill lies in choosing. Coping that numbs — alcohol, drugs, endless scrolling, avoiding everything — buys relief tonight at the price of more stress tomorrow.

What the evidence supports: physical activity, even brisk walking, reduces stress and anxiety; [[sleep]] protects against almost everything on this page; social support is one of the strongest buffers known; structured problem-solving and relaxation training help; mindfulness programmes bring small to moderate benefits. Money worries are among the commonest stresses of all — see [[finance:money-anxiety|money fears and financial anxiety]].

> [!tip] A two-minute reset: breathe in gently through the nose for about four seconds and out for about six, for a few minutes. Slow breathing with a longer out-breath nudges the nervous system towards its calming, parasympathetic side.

### When to seek help
See a doctor or other professional if stress lasts for weeks, if you feel constantly on edge or low, cannot sleep, have panic attacks, rely on alcohol or drugs to cope, or feel you cannot go on. Physical symptoms deserve to be checked rather than put down to "just stress".

> [!warn] Chest pain, severe breathlessness, fainting or sudden weakness need urgent assessment — call your local emergency number. ${CRISIS}
`,
    ideas: [
      'Stress is the brain and body preparing to meet a demand: adrenaline within seconds, cortisol within minutes, then feedback switches it off.',
      'Short bursts of stress are healthy; stress that never switches off wears the body and mind down (allostatic load).',
      'Some arousal helps performance and too much harms it — the inverted U, a useful simplification.',
      'Problem-focused coping changes the situation; emotion-focused coping soothes what cannot be changed. Numbing strategies backfire.',
      'Sleep, activity and people who support you are the best-evidenced buffers against stress.'
    ],
    pitfalls: [
      'All stress is bad and should be avoided — Short-lived stress sharpens attention and helps us perform; the harm comes from stress that is intense, uncontrollable and without recovery.',
      'A drink is a good way to unwind after a stressful day — Alcohol relaxes briefly, but it fragments sleep and raises anxiety as it wears off, so the stress returns stronger; used regularly it becomes a problem of its own.',
      'Burn-out means you are just not tough enough for the job — Burn-out comes from sustained demands with too little control, recovery or support. It is a signal that the situation needs to change, not a verdict on the person.'
    ],
    examples: [
      {
        title: 'Sorting the problems from the feelings',
        q: 'Leah, a nurse on night shifts, is caring for her mother and falling behind on bills. She feels overwhelmed and has started sleeping badly. How can she tackle it?',
        steps: [
          'Write every source of stress down; seeing them on paper already makes them feel more manageable.',
          'Mark what can be changed (the bills, the shift pattern, help with caring) and what cannot, for now (her mother\'s illness).',
          'Problem-focused steps for the changeable: phone the utility company about a payment plan, ask her manager about fewer consecutive nights, find out what carer support is available locally.',
          'Emotion-focused steps for the rest: a weekly call with her sister, a twenty-minute walk after each shift, slow breathing before sleep.',
          'Review after two weeks. If she still cannot sleep or feels hopeless, she will see her doctor.'
        ],
        a: 'Separate what can change from what cannot, act on the first, care for yourself around the second, and review — with professional help if it is not lifting.'
      },
      {
        title: 'Is it only stress?',
        q: 'Omar has felt low and tired for six weeks since a promotion. He has lost interest in football, which he loved, and drinks more at weekends. He says it is "only stress". What should he consider?',
        steps: [
          'Stress usually eases when the pressure eases. Six weeks of low mood with loss of interest is longer and broader than ordinary stress.',
          'Loss of interest, tiredness and low mood for more than two weeks are core features of [[depression]], which stress can trigger.',
          'Drinking more is a common, understandable, but unhelpful way of coping.',
          'He sees his doctor, who asks about his mood, sleep, drinking and safety, and suggests a talking therapy; they agree to cut back on alcohol and review in a month.'
        ],
        a: 'When low mood and loss of interest last more than a couple of weeks, it is worth a professional assessment — it may be depression, which is treatable.'
      }
    ],
    quiz: [
      { q: 'Which is an example of problem-focused coping?', choices: ['Going for a run after a hard day', 'Asking the bank to set up a repayment plan for a debt that worries you', 'Practising slow breathing', 'Talking to a friend about how you feel'], a: 1,
        why: 'Problem-focused coping changes the source of the stress. The other three are emotion-focused — valuable, especially when the problem cannot be changed.' },
      { q: 'According to the inverted-U picture of arousal and performance, for a complex, unfamiliar task the best performance comes with…', choices: ['very high arousal', 'lower arousal than for a simple task', 'no arousal at all', 'the same arousal as for any task'], a: 1,
        why: 'The peak shifts to lower arousal for complex tasks: a little alertness helps, but high arousal disrupts the attention and working memory complex tasks need. The model is a simplification, but it captures this.' },
      { q: 'Stress that is short-lived and followed by recovery is part of normal, healthy functioning.', a: true,
        why: 'The stress response evolved to help us meet challenges. Harm comes mainly from stress that is chronic, severe or uncontrollable, with no chance to recover.' },
      { q: 'A friend says a few glasses of wine each night are "the only thing that helps" with stress. What is most accurate?', choices: ['Alcohol is an effective long-term treatment for stress', 'Alcohol eases tension briefly but worsens sleep and anxiety over time, and can become a problem in itself', 'Alcohol has no effect on mood', 'Only spirits cause problems'], a: 1,
        why: 'Alcohol gives short relief but disrupts sleep and brings a rebound of anxiety as it wears off, and regular use to cope is a risk for dependence. Gentler alternatives and, if needed, professional help work better.' },
      { q: 'Which of these is best supported by evidence as a buffer against stress?', choices: ['Avoiding every situation that causes stress', 'Social support from people you trust', 'Working longer hours to get ahead', 'Keeping problems to yourself'], a: 1,
        why: 'Support from others is one of the most consistently protective factors. Avoidance and isolation tend to make stress, anxiety and low mood worse.' }
    ],
    applications: [
      'Workplace design that gives people more control and recovery time, which reduces burn-out.',
      'Stress-management and problem-solving courses in primary care, schools and universities.',
      'Recognising when "stress" has become depression or an anxiety disorder that needs treatment.',
      'Blood-pressure and heart-health advice, where chronic stress is one of several risk factors.'
    ],
    history: 'The physiologist Walter Cannon described the fight-or-flight response in the 1910s–1920s, and Hans Selye popularised "stress" as a biological idea in the 1930s–1950s. Richard Lazarus and Susan Folkman\'s 1984 model placed appraisal and coping at the centre, and Bruce McEwen introduced allostatic load in the 1990s.',
    sim: 'mh-stress-curve'
  }

  );
})();
