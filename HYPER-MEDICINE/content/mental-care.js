/* HYPER-MEDICINE · content/mental-care.js — Mind and Mental Health: getting help.
 * Suicide warning signs and how to help (written to safe-messaging practice: crisis help
 * first, no method details, no sensational language, hope and how to reach help), and how
 * psychotherapy and psychiatric medicines work, with the evidence stated honestly. */
(function () {
  'use strict';

  // the same crisis wording on every page of the branch
  const LINES = 'Crisis lines listen at any hour: **988** in the US and Canada (call or text), **Samaritans 116 123** in the UK and Ireland, **ERAN 1201** in Israel; elsewhere, find a line through your health service or the International Association for Suicide Prevention.';
  const CRISIS = 'If you or someone you know is thinking about suicide or might act on thoughts of self-harm, reach out now — you do not have to wait until things get worse. ' + LINES + ' If a life is in immediate danger, call your local emergency number.';

  Hyper.add(

  /* ================================================================ SUICIDE PREVENTION */
  {
    id: 'suicide-prevention', parent: 'mental-care', title: 'Suicide: warning signs and how to help', level: 1,
    short: 'Suicide is preventable. Thoughts of suicide usually come from pain that feels unbearable and endless — yet crises pass and help works. Knowing the warning signs, asking directly and staying with someone while they get help can save a life.',
    keywords: ['suicide', 'suicide prevention', 'suicidal thoughts', 'warning signs', 'crisis line', 'helpline', '988', 'Samaritans', 'ERAN', 'self-harm', 'safety plan', 'asking about suicide', 'how to help', 'crisis', 'hope', 'bereaved by suicide'],
    prereq: ['depression', 'mental-health-basics'],
    related: ['mental-health-treatment', 'bipolar-disorder', 'psychosis', 'addiction', 'ptsd', 'stress-coping', 'first-aid-basics', 'finance:money-anxiety'],
    body: `
> [!warn] **If you are thinking about suicide right now**, please reach out — you deserve support, and these feelings can change. ${LINES} If you might act on your thoughts, or someone's life is in immediate danger, call your local emergency number or go to the nearest emergency department. If you can, tell someone near you and stay with them.

Two years ago Hana could not see any way forward. After months of depression and a breakup, she felt like a burden and was sure nothing would ever change. One night she sent a message to a crisis line. The volunteer who answered did not argue or lecture; she listened, asked Hana directly whether she was thinking of ending her life, and helped her plan how to get through the night and see her doctor in the morning. Treatment took time. Today Hana says the certainty that things could never improve was the illness talking — and that it was wrong.

### Understanding suicidal thoughts
Thoughts of suicide are more common than many people realise, and having them does not make someone weak or selfish. They usually arise when pain — from depression, loss, trauma, debt, illness, shame or isolation — feels unbearable, inescapable and endless. Most people in that place do not want to die so much as want the pain to stop. Suicidal crises are often **temporary**, and most people who have suicidal thoughts do not act on them. Most people who survive a suicidal crisis go on to live, and do not later die by suicide. That is why getting through the worst hours, and getting help, matters so much.

WHO estimates that more than 700,000 people die by suicide each year, and every death deeply affects families, friends and communities. Suicide is preventable, and prevention works at every level — from a friend who asks, to good treatment, to communities that reduce access to the means of harm.

Risk is higher with a mental health condition such as [[depression]], [[bipolar-disorder|bipolar disorder]], [[psychosis]] or [[addiction]]; after a previous suicide attempt; after a loss, a relationship ending, a financial crisis, or a legal or work crisis; with chronic pain or illness, isolation, bullying or discrimination; and after being bereaved by suicide. But no one can predict precisely who is at risk — which is why noticing and asking matter more than calculating.

### Warning signs
Take these seriously, especially when they are new, or linked to a painful event:
- talking about wanting to die, being a burden, having no reason to live, or feeling trapped or in unbearable pain;
- looking for ways to end one's life;
- withdrawing from people, saying goodbye, giving away valued things;
- drinking or using drugs more, acting recklessly;
- big changes in sleep, rage, agitation, or extreme mood swings;
- a sudden calm after a period of deep distress, which can sometimes mean a decision has been made.

### How to help someone
1. **Ask directly.** "Are you thinking about suicide?" Using the word is clear and shows you can hear the answer. Research has found that asking about suicide does **not** put the idea into someone's head or raise their risk; many people feel relief at being asked.
2. **Listen.** Stay calm, take them seriously, and let them talk. Do not argue, lecture, minimise or promise to keep it secret. Thank them for telling you.
3. **Help keep them safe.** If they may act soon, do not leave them alone; call your local emergency number. With their agreement, put distance between them and anything they could use to harm themselves — crises pass, and time and distance save lives.
4. **Connect them with help.** Call or text a crisis line together, help them contact their doctor or mental health team, or go with them to an emergency department.
5. **Follow up.** Stay in touch over the following days and weeks. Feeling connected protects, and the time after a crisis is when contact matters most.

A **safety plan**, written with a professional or a trusted person when things are calmer, lists personal warning signs, things that help get through a hard moment, people and places that help, who to call, how to make the surroundings safer, and reasons for living. Safety planning has been shown to reduce suicidal behaviour.

### If you are struggling
Tell one person — a friend, a family member, a doctor or a crisis line. Focus on getting through the next hour, not the rest of your life. Go somewhere safer, where other people are around, and move away from anything you could use to hurt yourself. Put off any big decision. Treatments that address suicidal thoughts directly, and treatment for the illness behind them, work for most people.

**Self-harm** — hurting oneself, sometimes without intending to die — is usually a way of coping with overwhelming feelings. It always deserves kindness and proper care, never dismissal as "attention-seeking". People bereaved by suicide need support too; many services offer it.

> [!warn] ${CRISIS}
`,
    ideas: [
      'Suicide is preventable: crises are often temporary, most people with suicidal thoughts do not act on them, and help works.',
      'Warning signs include talk of death or being a burden, withdrawal, saying goodbye, more drinking or drug use, and sudden changes in mood or behaviour.',
      'Asking directly — "Are you thinking about suicide?" — does not plant the idea; it opens the door to help.',
      'Listen without judging, help keep the person safe, connect them with a crisis line or professional, and follow up.',
      'Crisis lines, emergency services and treatment are there at any hour: in immediate danger, call your local emergency number.'
    ],
    pitfalls: [
      'Asking someone about suicide might put the idea in their head — Studies show that asking directly does not increase suicidal thoughts and often brings relief. Not asking leaves the person alone with it.',
      'People who talk about suicide will not act on it — Many people who die by suicide have spoken about it or shown warning signs. Every mention deserves to be taken seriously and answered with care.',
      'If someone has decided to end their life, nothing can stop them — Most people are torn between wanting to die and wanting to live, and crises pass. Support, time, a safer environment and treatment save lives.'
    ],
    examples: [
      {
        title: 'Asking a friend',
        q: 'Lina\'s close friend has been withdrawn for weeks, recently lost his job, and last night texted "everyone would be better off without me". What can she do?',
        steps: [
          'She calls him and says what she has noticed: "Your message worried me. You\'ve been going through so much."',
          'She asks directly: "Are you thinking about suicide?" He pauses, then says yes — he has been thinking about it a lot.',
          'She stays calm and listens, without arguing or lecturing, and thanks him for telling her. She says she is glad he did and that she wants to help him stay safe.',
          'She asks whether he feels he might act on the thoughts tonight. He is not sure, so she goes to be with him and they call a crisis line together; the counsellor helps them make a plan for the night.',
          'The next morning she goes with him to his doctor, and she keeps checking in over the following weeks.'
        ],
        a: 'Notice, ask directly, listen, help keep him safe, connect him with a crisis line and his doctor, and follow up.'
      },
      {
        title: 'Writing a safety plan',
        q: 'After a crisis, Daniel and his therapist write a safety plan. What goes in it?',
        steps: [
          'His own warning signs: not sleeping, cancelling plans, the thought "I can\'t do this any more".',
          'Things he can do on his own to get through a hard moment: a long shower, loud music, walking the dog.',
          'People and places that help distract him: his cousin\'s house, the park café.',
          'People he can ask for help: his sister and a friend, with their numbers.',
          'Professionals and crisis lines: his care team\'s number, the local crisis line and the emergency number.',
          'Making his surroundings safer: he agrees with his sister on what she will keep for him for now.',
          'His reasons for living: his daughter, his dog, the trip he has planned with his cousin.'
        ],
        a: 'A short, personal, written plan for getting through a crisis, made while calm and kept where it can be found quickly.'
      }
    ],
    quiz: [
      { q: 'Asking someone directly whether they are thinking about suicide increases their risk.', a: false,
        why: 'Research consistently shows that asking does not plant the idea or raise risk. Most people feel relieved that someone noticed and cared enough to ask.' },
      { q: 'Which of these is a warning sign that someone may be thinking about suicide?', choices: ['Talking about being a burden to others', 'Giving away valued possessions', 'Withdrawing from friends and family', 'All of these'], a: 3,
        why: 'All are recognised warning signs, especially when they are new or follow a painful event. Take them seriously and ask.' },
      { q: 'A friend tells you they are thinking about ending their life and asks you not to tell anyone. What is best?', choices: ['Promise to keep it secret so they trust you', 'Tell them they are being dramatic', 'Listen, take it seriously, and explain that you care too much to keep it secret — then help them contact a crisis line or professional', 'Change the subject to cheer them up'], a: 2,
        why: 'Safety comes before secrecy. Listening with care, and then helping them reach support — and calling the emergency number if they are in immediate danger — is the right response.' },
      { q: 'Why do crisis support and putting time and distance between a person and the means of harm save lives?', choices: ['Because suicidal crises are often temporary, and getting through them gives treatment and support a chance to help', 'Because people forget their problems', 'They do not help', 'Because they make people feel watched'], a: 0,
        why: 'Intense suicidal crises often pass. Most people who survive one do not later die by suicide, so getting through the crisis safely matters enormously.' },
      { q: 'Having thoughts of suicide means a person is weak or selfish.', a: false,
        why: 'Suicidal thoughts come from overwhelming pain and often from illness such as depression. They are a reason for compassion and help, not judgement — and they can change.' }
    ],
    applications: [
      'Crisis lines, text and chat services staffed by trained volunteers and professionals.',
      'Gatekeeper training that teaches teachers, employers, pharmacists and others to notice, ask and refer.',
      'Follow-up contact after a person leaves hospital or an emergency department.',
      'National prevention strategies that restrict access to means, support responsible media reporting and improve care.'
    ]
  },

  /* ================================================================ TREATMENT */
  {
    id: 'mental-health-treatment', parent: 'mental-care', title: 'Psychotherapy and psychiatric medicines', level: 2,
    short: 'How talking therapies and psychiatric medicines work, what they are good for, how well they work according to the evidence, and how to find help. Most people are helped by one or both.',
    keywords: ['psychotherapy', 'talking therapy', 'CBT', 'cognitive behavioural therapy', 'thought record', 'interpersonal therapy', 'psychodynamic', 'DBT', 'EMDR', 'mindfulness', 'antidepressant', 'SSRI', 'SNRI', 'mood stabiliser', 'lithium', 'antipsychotic', 'benzodiazepine', 'number needed to treat', 'placebo', 'stepped care', 'ECT'],
    prereq: ['depression', 'anxiety-disorders', 'how-drugs-work', 'synapses'],
    related: ['bipolar-disorder', 'psychosis', 'ptsd', 'eating-disorders', 'addiction', 'clinical-trials', 'side-effects-interactions', 'risk-communication', 'sleep'],
    body: `
Elena, a 31-year-old accountant living with depression, doubted that "just talking" could help. In her third session of cognitive behavioural therapy her therapist asked her to write down the thought that went through her mind when her manager did not reply to an email: *"She thinks my work is useless — I'm going to lose my job."* Then they looked at the evidence, for and against. The manager had praised her report the week before and was on leave that day. Nothing about Elena's life changed that afternoon, but she felt the grip of the thought loosen — and over twelve weeks, practising the same skill, her mood lifted.

### Who helps
Care is shared between family doctors, who treat most common mental health problems; psychiatrists, who are medical doctors and can prescribe; clinical psychologists, psychotherapists and counsellors; mental health nurses, social workers and occupational therapists; and peer support workers who have lived experience of recovery. Many health systems use **stepped care**: guided self-help or group courses first for milder problems, individual therapy and medicines for more severe or persistent ones, and specialist teams for the most complex.

### Talking therapies
- **Cognitive behavioural therapy (CBT)** links thoughts, feelings, body sensations and behaviour. It teaches people to catch **automatic thoughts**, spot **thinking traps** — catastrophising, mind-reading, all-or-nothing thinking — and test them against evidence and through behavioural experiments, and it includes graded exposure for anxiety and planned activity for depression. It has the broadest evidence: depression, anxiety disorders, OCD, PTSD, eating disorders, insomnia, and as an addition to care in psychosis.
- **Interpersonal therapy** focuses on relationships, conflicts, losses and life changes; **psychodynamic therapy** explores patterns rooted in earlier experience; both have been shown to help in depression, interpersonal therapy in more trials.
- **Dialectical behaviour therapy** teaches skills to manage intense emotions and is used for repeated self-harm; **EMDR** and trauma-focused CBT treat PTSD; **mindfulness-based cognitive therapy** reduces relapses in people who have had several episodes of depression; family therapy helps young people with eating disorders and families living with psychosis.

Across all of them, one of the strongest predictors of success is the **therapeutic relationship** — feeling understood and working towards agreed goals. It is fine to ask a therapist how they work, and to look for another if the fit is poor. Guided online CBT works well for many people with milder problems.

### Medicines
Psychiatric medicines are grouped by what they are used for (see [[how-drugs-work]]):
- **Antidepressants** — SSRIs such as sertraline and fluoxetine, SNRIs such as venlafaxine, and others such as mirtazapine — for depression and for anxiety disorders, OCD and PTSD. Benefits build over two to six weeks. Early side effects can include nausea, sleep changes and a brief rise in anxiety; sexual side effects are common and worth raising. People under 25 are usually seen more often in the first weeks, because in a minority suicidal thoughts can increase early on. They are not addictive, but stopping suddenly can cause discontinuation symptoms, so they are reduced gradually with the prescriber.
- **Mood stabilisers** such as lithium, for bipolar disorder.
- **Antipsychotics**, for psychosis and in bipolar disorder; clozapine for psychosis that has not responded to others.
- **Benzodiazepines** and similar sedatives, for short-term use only, because of tolerance and dependence.
- Medicines for ADHD, and for alcohol, opioid and nicotine dependence (see [[addiction]]).

The choice is shared: previous response, side effects that matter to the person, other illnesses, pregnancy and interactions — including with herbal remedies such as St John's wort — all count ([[side-effects-interactions]]).

### How well does it work?
Honest numbers help. In pooled trials of adults with moderate to severe depression, around half improve substantially on an antidepressant within about eight weeks, compared with a third or more on placebo; talking therapies show gains of a similar size against usual care; and the combination is more effective than either alone. The **number needed to treat** turns such results into one figure:

$$\\text{NNT} = \\frac{1}{p_t - p_c}$$

where $p_t$ and $p_c$ are the proportions who improve with the treatment and with the comparison. For 50 % against 35 % it is about 7: for every seven people treated, one more improves than would have without the treatment. Many people in the placebo group also get better, through natural recovery and the support of being in a trial. Estimates vary between analyses, and the gain over placebo tends to be larger in more severe depression. Improvement is usually gradual and uneven, and people who do not respond to a first treatment often respond to a second. For severe depression that has not responded, electroconvulsive therapy under anaesthesia, brain stimulation and other options remain.

> [!warn] ${CRISIS}
`,
    ideas: [
      'Talking therapies and medicines both work, for different people and conditions; for moderate to severe depression the combination often works best.',
      'CBT teaches people to notice automatic thoughts, test them against evidence and change behaviour; its evidence base is the broadest.',
      'The therapeutic relationship predicts success across therapies — fit matters.',
      'Psychiatric medicines are grouped by use: antidepressants, mood stabilisers, antipsychotics, and short-term sedatives; choices are shared and reviewed.',
      'The number needed to treat, 1 / (difference in improvement rates), turns trial results into an honest single figure.'
    ],
    pitfalls: [
      'Therapy is "just talking" and has no real evidence — Structured psychological therapies are tested in randomised trials like medicines, and for many conditions they are first-line treatments with effects comparable to medication and longer-lasting protection against relapse.',
      'Antidepressants are addictive, so they should be stopped as soon as you feel better — They do not cause craving or loss of control, but the body adapts, so stopping suddenly can cause discontinuation symptoms. Stopping too early raises the risk of relapse; reduce gradually with the prescriber.',
      'An NNT of 7 means the treatment only works for one person in seven — It means one extra person improves for every seven treated, on top of those who would have improved anyway. Many more people in the treated group feel better than the NNT suggests.'
    ],
    formulas: [
      {
        name: 'Number needed to treat',
        expr: 'NNT = 1/(pt - pc)', tex: '\\text{NNT} = \\frac{1}{p_t - p_c}',
        vars: {
          NNT: { name: 'number needed to treat', tex: '\\text{NNT}' },
          pt: { name: 'proportion improving with the treatment', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: 'p_t' },
          pc: { name: 'proportion improving with the comparison', q: 'ratio', unit: '%', value: 35, min: 0, max: 100, tex: 'p_c' }
        },
        solveFor: 'NNT',
        note: 'Both proportions must come from the same trial or pooled analysis, over the same time and with the same definition of improvement. The NNT only makes sense when the treatment beats the comparison ($p_t > p_c$); it describes an average, not what will happen to one person.',
        practice: { unknowns: ['NNT', 'pc'] },
        stories: {
          NNT: 'In a trial, {pt} of people with depression improved on a talking therapy and {pc} with usual care. How many people need the therapy for one extra person to improve?',
          pc: 'A treatment helps {pt} of people and has a number needed to treat of {NNT}. What proportion improved in the comparison group?'
        }
      }
    ],
    examples: [
      {
        title: 'Elena\'s thought record',
        q: 'Elena feels a surge of dread when her manager does not reply to an email. How does a CBT thought record work through it?',
        steps: [
          'Situation: the manager has not replied to her email all day.',
          'Automatic thought: "She thinks my work is useless — I\'m going to lose my job." She believes it 85 %.',
          'Feelings: anxious 80 %, ashamed 60 %.',
          'Thinking traps: mind-reading (guessing what the manager thinks) and catastrophising (jumping to losing her job).',
          'Evidence for: the manager has been brisk with her lately. Evidence against: she praised Elena\'s report last week; she is on leave today; no one has raised concerns about her work.',
          'Balanced thought: "She is away, and her feedback has been good. If there is a problem, I can ask about it." Re-rated: belief in the first thought 30 %, anxiety 35 %.'
        ],
        a: 'Writing the thought down, naming the trap and weighing the evidence produced a more balanced thought and less distress — not no distress, but a proportionate amount.'
      },
      {
        title: 'Reading a trial',
        q: 'A pooled analysis reports that 48 % of adults with depression improved on an antidepressant and 36 % on placebo over eight weeks. What is the number needed to treat, and what does it mean?',
        steps: [
          'Difference in improvement: $0.48 - 0.36 = 0.12$.',
          { text: 'Number needed to treat:', tex: '\\text{NNT} = \\frac{1}{0.12} \\approx 8.3' },
          'About eight or nine people need the medicine for one extra person to improve, compared with placebo.',
          'But 48 of every 100 treated people improved; 36 of them would probably have improved anyway, through natural recovery and trial support. The medicine added about 12.',
          'For an individual, this is a reason to try treatment, review progress after a few weeks, and change approach if it is not helping.'
        ],
        a: 'NNT ≈ 8: a real but modest average benefit, on top of substantial improvement in the comparison group.'
      }
    ],
    quiz: [
      { q: 'In a trial, 60 % of people improve with a treatment and 40 % with placebo. What is the number needed to treat?', answer: 5,
        why: 'NNT = 1 / (0.60 − 0.40) = 1 / 0.20 = 5: five people treated for one extra person to improve.' },
      { q: 'Across many kinds of psychotherapy, which factor most consistently predicts a good outcome?', choices: ['The length of the therapist\'s training alone', 'A good therapeutic relationship, with shared goals', 'Having sessions every day', 'Talking only about childhood'], a: 1,
        why: 'The alliance between person and therapist — feeling understood and working together on agreed goals — is one of the strongest predictors of improvement across approaches.' },
      { q: 'Structured talking therapies such as CBT have been tested in randomised trials and are first-line treatments for many conditions.', a: true,
        why: 'CBT and other structured therapies have large evidence bases and are recommended first for many anxiety disorders, depression, PTSD, eating disorders and insomnia.' },
      { q: 'Someone has felt well on an antidepressant for two months and wants to stop. What is best?', choices: ['Stop immediately — antidepressants are addictive', 'Talk to the prescriber, who will usually suggest continuing for some months and then reducing gradually', 'Double the dose first', 'Swap it for a friend\'s medicine'], a: 1,
        why: 'Continuing for several months after recovery lowers the risk of relapse, and reducing gradually avoids discontinuation symptoms. Decisions are made with the prescriber.' },
      { q: 'Why are young people under 25 usually seen more often when starting an antidepressant?', choices: ['The medicines do not work in young people', 'In a minority, suicidal thoughts can increase in the first weeks, so closer contact keeps them safe', 'Young people need higher doses', 'To check their height'], a: 1,
        why: 'Trials found a small rise in suicidal thoughts early in treatment in young people, so guidelines recommend early and frequent review — without denying effective treatment.' }
    ],
    applications: [
      'Stepped-care talking therapy services and online CBT programmes.',
      'Shared decision-making about medicines, weighing benefits, side effects and preferences.',
      'Reading drug trials and health news with the number needed to treat in mind.',
      'Relapse prevention: continuing treatment after recovery, mindfulness-based therapy, and early-warning plans.'
    ],
    history: 'Aaron Beck developed cognitive therapy for depression in the 1960s, building on the behavioural therapies of the 1950s; the first antidepressants were discovered by chance in the 1950s, and the SSRIs followed in the late 1980s.',
    sim: ['mh-thought-record', 'mh-recovery']
  }

  );
})();
