/* HYPER-BIOLOGY · content/behaviour.js — Animal Behaviour: innate and learned behaviour, communication,
 * social behaviour and altruism, optimal foraging, migration and navigation, biological rhythms.
 * Simulations in sims/behaviour.js (prefix beh-). */
Hyper.add(

{
  id: 'innate-learned', parent: 'behaviour-topic', title: 'Innate and learned behaviour', level: 1,
  short: 'Some behaviour appears in every normal member of a species without practice — a gull chick pecking at a red spot, a goose rolling back an egg. Other behaviour is shaped by experience: habituation, conditioning, imprinting and insight. Tinbergen\'s four questions ask how a behaviour works, how it develops, what it is for and how it evolved.',
  keywords: ['innate behaviour', 'instinct', 'learning', 'Tinbergen\'s four questions', 'proximate', 'ultimate', 'fixed action pattern', 'sign stimulus', 'supernormal stimulus', 'habituation', 'classical conditioning', 'operant conditioning', 'imprinting', 'insight', 'Pavlov', 'Lorenz', 'Rescorla–Wagner', 'matching law', 'ethology'],
  prereq: ['natural-selection', 'animal-nervous-systems', 'polygenic-traits'],
  related: ['communication', 'social-behaviour', 'migration-navigation', 'medicine:neurons', 'medicine:brain-regions', 'experimental-design', 'model-organisms'],
  body: `
A herring gull chick a few hours out of the egg pecks at the red spot near the tip of its parent's bill, and the parent coughs up food. Nobody taught the chick. A rat in a box presses a lever by accident, gets a food pellet, and within a session or two presses it steadily. **Innate** behaviour develops reliably in every normal member of a species without any particular experience; **learned** behaviour is changed by the individual's own experience. The line is blurred — every behaviour is built by genes and environment together — but the two ends of the range are real.

### Tinbergen's four questions
In 1963 Niko Tinbergen pointed out that "why does it do that?" has four different answers, and a full explanation needs all of them:

| Question | Asks | For the gull chick's pecking |
|---|---|---|
| Mechanism (causation) | Which stimuli, nerves and hormones produce it? | A red spot on a long, thin, downward-pointing, moving bill |
| Development (ontogeny) | How does it arise during the animal's life? | Present at hatching; the aim improves with practice over the first days |
| Function (adaptive value) | How does it help survival and reproduction? | It makes the parent regurgitate food |
| Evolution (phylogeny) | How did it arise in the ancestors? | Related gulls share the bill spot and the pecking |

The first two are **proximate** questions (how), the last two **ultimate** ones (why, in evolutionary terms). Mixing them up causes endless arguments: "the bird sings because the days are getting longer" and "the bird sings to attract a mate" are both true.

### Sign stimuli and fixed action patterns
Tinbergen tested gull chicks with cardboard heads. A bill with no spot drew only a fraction of the pecks a red-spotted one did, and a thin red rod with white bands near its tip drew *more* pecks than a lifelike head — a **supernormal stimulus**. The chick responds to a few key features, the **sign stimulus**, not to the whole parent. Male three-spined sticklebacks in breeding colours attack crude models with a red underside but ignore a lifelike model without one.

A greylag goose that sees an egg outside its nest stretches out and rolls it back with the underside of its bill. If the egg is taken away mid-roll, the goose finishes the movement with nothing there — a **fixed action pattern**: stereotyped, released by a sign stimulus and, once begun, run to completion (only the small sideways corrections, steered by touch, stop). Geese also roll back balls and tin cans, and prefer giant model eggs to their own. Innate responses pay where mistakes are costly and there is no chance to practise: a spider's first web, the first escape from a predator.

### Kinds of learning
| Kind | What changes | Classic example |
|---|---|---|
| Habituation | A response to a repeated, harmless stimulus fades | Prairie dogs stop calling at passing walkers; the sea slug *Aplysia* stops withdrawing its gill |
| Classical conditioning | A neutral stimulus comes to predict a meaningful one | Pavlov's dogs salivating at a sound that signalled food |
| Operant conditioning | A behaviour becomes more or less frequent through its consequences | Thorndike's cats escaping puzzle boxes ever faster; a rat pressing a lever for food |
| Imprinting | Learning limited to a short sensitive period | Lorenz's greylag goslings following him as their mother |
| Spatial learning | Landmarks are remembered | A digger wasp finding its burrow by a ring of pine cones |
| Insight | A new problem solved without trial and error | Köhler's chimpanzees stacking boxes to reach bananas; a New Caledonian crow bending wire into a hook |

Learning is itself an evolved ability, and animals learn most easily what matters in their way of life. Rats that fall ill hours after tasting a new food avoid that taste after a single experience, yet can hardly learn to link illness with a light or a click (Garcia and Koelling, 1966).

### Learning in numbers
Conditioning follows a simple rule found by Robert Rescorla and Allan Wagner (1972): on each pairing the associative strength $V$ grows by a fixed fraction $k$ of what is still left to learn, $\\Delta V = k(\\lambda - V)$, so after $n$ pairings

$$V_n = \\lambda\\left[1 - (1 - k)^n\\right]$$

— quick at first, then levelling off: the shape of nearly every learning curve. The rule also explains **blocking**: if a light already predicts food perfectly, adding a tone teaches almost nothing about the tone, because nothing is left to learn. In operant choice, pigeons and rats share their responses between two options in proportion to the rewards each gives — the **matching law** — the same rule by which foragers share out patches ([[foraging]]).

### Genes and experience together
White-crowned sparrows hatch with a rough template of their species' song but must hear the real song in their first couple of months to sing it properly. Blackcaps from southern Germany migrate south-west and those from Austria south-east; hand-raised hybrids head roughly south, in between — the direction is inherited ([[migration-navigation]]). None of this means behaviour is fixed by genes: in humans above all, genes and upbringing act together, and no single gene "determines" a behaviour.

> [!note] Modern behaviour research is planned around the 3Rs — **replace** animals where possible, **reduce** the numbers used and **refine** methods to minimise distress — and needs ethical approval. Several classic experiments would not be done the same way today.
`,
  ideas: [
    'Innate behaviour develops without a specific experience; learned behaviour is changed by experience — but every behaviour is built by genes and environment together.',
    'Tinbergen\'s four questions: mechanism and development (proximate), function and evolution (ultimate). A full explanation answers all four.',
    'Sign stimuli release fixed action patterns; exaggerated versions (supernormal stimuli) can work even better than the real thing.',
    'Habituation, classical and operant conditioning, imprinting, spatial learning and insight are different ways experience changes behaviour.',
    'Learning curves rise quickly and then level off: each experience teaches a fraction of what is left to learn (Rescorla–Wagner).'
  ],
  pitfalls: [
    'Innate behaviour cannot change — Gull chicks aim better after practice, a goose\'s egg-rolling is steered by touch, and imprinting is learning whose timing is innate. Innate means reliably developing, not rigid.',
    '"It does it to feed its young" and "hormones make it do it" are competing explanations — They answer different Tinbergen questions (function and mechanism) and can both be right.',
    'A trait with a genetic basis is fixed and unaffected by the environment — Heritability describes variation in a particular population and environment; genes act through development, and experience shapes how they are expressed.'
  ],
  formulas: [
    {
      name: 'Learning curve (Rescorla–Wagner)',
      expr: 'V = lambda*(1 - (1 - k)^n)', tex: 'V_n = \\lambda\\left[1 - (1 - k)^n\\right]',
      vars: {
        V: { name: 'associative strength after n pairings', tex: 'V_n' },
        lambda: { name: 'maximum strength the reward can support', value: 1, tex: '\\lambda' },
        k: { name: 'learning rate (fraction learned per pairing)', value: 0.25, min: 0.001, max: 0.999 },
        n: { name: 'number of pairings', int: true, value: 6 }
      },
      note: 'Each pairing of the signal with the reward closes a fraction k of the gap to λ. Extinction, when the reward stops, runs the other way: V falls by the fraction k of what remains on each unrewarded trial.',
      practice: { unknowns: ['V', 'n', 'k'] },
      stories: {
        V: 'A dog hears a bell before food; it learns a fraction {k} of what is left on each pairing. How strong is the association after {n} pairings (as a fraction of the maximum {lambda})?',
        n: 'With a learning rate of {k} per pairing, how many pairings does it take to reach an associative strength of {V} (maximum {lambda})?',
        k: 'After {n} pairings an animal\'s associative strength is {V} of a possible {lambda}. What is its learning rate?'
      }
    },
    {
      name: 'The matching law',
      expr: 'f = r1/(r1 + r2)', tex: 'f_1 = \\frac{B_1}{B_1 + B_2} = \\frac{r_1}{r_1 + r_2}',
      vars: {
        f: { name: 'share of responses made to option 1', q: 'ratio', unit: '%', tex: 'f_1' },
        r1: { name: 'reward rate on option 1', q: 'rate', unit: '1/h', value: 40, tex: 'r_1' },
        r2: { name: 'reward rate on option 2', q: 'rate', unit: '1/h', value: 20, tex: 'r_2' }
      },
      note: 'Found by Richard Herrnstein (1961) with pigeons pecking two keys that paid out food at random times; B₁ and B₂ are the numbers of responses. Real animals often match slightly less than perfectly ("undermatching").',
      stories: {
        f: 'A pigeon can peck two keys: one pays out food at a rate of {r1}, the other at {r2}. What share of its pecks goes to the first key?',
        r2: 'A rat makes {f} of its lever presses on lever 1, which is rewarded at {r1}. How often is lever 2 rewarded?'
      }
    }
  ],
  examples: [
    {
      title: 'How many pairings to learn?',
      q: 'A dog learns that a bell means food with a Rescorla–Wagner learning rate $k = 0.3$ per pairing. After how many pairings does its associative strength first reach 90 % of the maximum?',
      steps: [
        'The gap still to learn after $n$ pairings is $(1 - k)^n = 0.7^n$ of the maximum; we need it below 0.10.',
        { text: 'Take logarithms:', tex: 'n \\ge \\frac{\\ln 0.10}{\\ln 0.7} = \\frac{-2.303}{-0.357} = 6.46' },
        'Check: after 6 pairings $V = 1 - 0.7^6 = 0.882$; after 7, $V = 1 - 0.7^7 = 0.918$.'
      ],
      a: '7 pairings (88 % after six, 92 % after seven).'
    },
    {
      title: 'A pigeon matching its pecks',
      q: 'Key A pays out food about 40 times an hour and key B about 20 times an hour, at unpredictable moments. A pigeon pecks 3000 times in the hour. How are the pecks shared?',
      steps: [
        'Matching law: $f_A = 40/(40 + 20) = 0.667$.',
        'So about $0.667 \\times 3000 = 2000$ pecks go to A and 1000 to B.',
        'The pigeon does not peck only at the richer key: B still pays out when it is checked now and then, so matching is close to the best a forager can do on such schedules.'
      ],
      a: 'About two thirds (≈ 2000 pecks) on key A, one third on key B.'
    },
    {
      title: 'Four answers for a cuckoo chick',
      q: 'Within a day or two of hatching, a common cuckoo chick heaves every egg and nestling of its foster parents over the rim of the nest. Answer Tinbergen\'s four questions for this behaviour.',
      steps: [
        '**Mechanism:** touch on a hollow in the chick\'s back triggers a stereotyped backward-climbing movement — a fixed action pattern.',
        '**Development:** it appears without learning in the first days after hatching and fades after a few days, while the chick is blind.',
        '**Function:** the chick gets all the food the foster parents bring; it will soon need as much as a whole brood of reed warblers.',
        '**Evolution:** it belongs to the brood-parasite way of life that evolved in the cuckoo lineage; hosts in turn evolved to reject odd-looking eggs.'
      ],
      a: 'Mechanism: a touch-released fixed action pattern. Development: innate, in a short window after hatching. Function: monopolising the foster parents\' food. Evolution: part of brood parasitism in cuckoos.'
    }
  ],
  quiz: [
    { q: 'A goose rolling an egg back into its nest keeps making the rolling movement after the egg is taken away. This shows that egg-rolling is…', choices: ['a fixed action pattern', 'habituation', 'operant conditioning', 'insight learning'], a: 0, why: 'Once released by the sign stimulus (an egg outside the nest), the movement runs to completion even without the egg — the defining feature of a fixed action pattern.' },
    { q: '"Gull chicks peck at the red spot because pecking makes the parent regurgitate food." Which of Tinbergen\'s questions does this answer?', choices: ['Mechanism', 'Development', 'Function', 'Evolution'], a: 2, why: 'It explains what the behaviour achieves for survival — its adaptive value, or function. The red spot as a trigger would be the mechanism.' },
    { q: 'Snails on a table tapped once a minute withdraw into their shells less and less. A sudden, stronger tap brings the full withdrawal back at once. The waning was…', choices: ['habituation', 'muscle fatigue', 'classical conditioning', 'imprinting'], a: 0, why: 'Fatigue would weaken every response; here a new stimulus restores the full response, so the animal had learned to ignore the harmless repeated tap — habituation.' },
    { q: 'Innate behaviour cannot be changed by experience.', a: false, why: 'Gull chicks peck more accurately after a few days of practice, and imprinting is learning whose timing is innate. Innate means "develops reliably without a specific experience", not "unchangeable".' },
    { q: 'With a Rescorla–Wagner learning rate k = 0.5, what percentage of the maximum associative strength is reached after 3 pairings?', answer: 87.5, unit: '%', why: '$1 - 0.5^3 = 1 - 0.125 = 0.875$.' }
  ],
  problems: [
    { q: 'Food comes from key A about 30 times an hour and from key B about 10 times an hour. By the matching law, what percentage of a pigeon\'s pecks go to key B?', answer: 25, unit: '%', tol: 0.02, steps: ['$f_B = 10/(30 + 10) = 0.25$, so a quarter of the pecks go to key B.'] },
    { q: 'An animal learns with k = 0.2 per pairing. After how many pairings does its associative strength first exceed half of the maximum?', answer: 4, tol: 0.01, hint: 'Find the smallest n with 0.8ⁿ below 0.5.', steps: ['After 3 pairings: $1 - 0.8^3 = 0.488$ — not yet.', 'After 4 pairings: $1 - 0.8^4 = 0.590$ — past half.'] }
  ],
  applications: [
    'Training detection animals — dogs that find explosives or drugs, giant pouched rats that sniff out landmines — by operant conditioning with rewards.',
    'Conservation: taste-aversion training teaches endangered northern quolls in Australia to avoid poisonous cane toads; captive-reared cranes have been imprinted on ultralight aircraft that led them on their first migration.',
    'Animal welfare and zoo enrichment, which rely on knowing what each species is motivated to do.',
    'Exposure therapies for phobias in people build on the extinction of conditioned fear.'
  ],
  history: 'Ethology, the biology of behaviour, was founded by Konrad Lorenz, Niko Tinbergen and Karl von Frisch, who shared the 1973 Nobel Prize in Physiology or Medicine. Lorenz described imprinting in greylag geese in 1935; Lorenz and Tinbergen analysed egg-rolling in 1938; Tinbergen\'s "On aims and methods of ethology" (1963) set out the four questions. In parallel, Ivan Pavlov (around 1900) and Edward Thorndike (1898) founded the experimental study of learning.',
  sim: 'beh-conditioning'
},

{
  id: 'communication', parent: 'behaviour-topic', title: 'Animal communication', level: 2,
  short: 'Signals are acts or structures that evolved to change what other animals do: scents, calls, colours, dances. A honeybee\'s waggle dance tells nestmates the direction of food as an angle to the sun and its distance as the length of the waggle run; vervet monkeys name the predator; costly signals keep communication honest.',
  keywords: ['signal', 'cue', 'pheromone', 'waggle dance', 'round dance', 'honeybee', 'von Frisch', 'alarm call', 'vervet monkey', 'honest signal', 'handicap principle', 'stotting', 'deception', 'infrasound', 'bombykol'],
  prereq: ['innate-learned', 'natural-selection', 'sexual-selection'],
  related: ['social-behaviour', 'foraging', 'migration-navigation', 'biological-rhythms', 'physics:sound-waves', 'physics:polarization', 'medicine:hearing-balance', 'finance:game-theory'],
  body: `
A **signal** is an act or structure that evolved *because* it changes the behaviour of other animals — the receivers — in a way that benefits the sender. A **cue** carries information without having been shaped for the purpose: mosquitoes find us by the carbon dioxide we breathe out, but our breath did not evolve to call mosquitoes. Communication works only if receivers, on average, also gain from responding; otherwise selection would teach them to ignore it.

### Channels
| Channel | Strengths | Weaknesses | Example |
|---|---|---|---|
| Chemical | Works in the dark, lasts, carries far downwind | Slow; hard to switch off | A male silk moth's antenna responds to single molecules of the female's pheromone, bombykol |
| Sound | Fast, bends round obstacles, works at night | Also tells predators where the caller is | Elephant rumbles (about 14–35 Hz) carry several kilometres |
| Visual | Fast, precise, easy to aim | Needs light and a clear line of sight | Firefly flash codes; a peacock's train |
| Touch and vibration | Private, works in the dark | Very short range | Honeybee dances on the comb; treehoppers drumming on stems |
| Electric | Works in murky water | About a metre | Weakly electric fish discharging hundreds of times a second |

### The dance language of honeybees
A forager that has found good flowers returns to the dark hive and dances on the vertical face of the comb. In the **waggle dance** she runs straight ahead, waggling her abdomen 13–15 times a second, circles back to the start on one side, runs and waggles again, circles back on the other side — a figure of eight, repeated dozens to over a hundred times, more eagerly for richer flowers. Other workers follow her closely and read two things:

- **Direction.** The angle of the waggle run from straight up equals the angle between the food and the sun's azimuth, measured clockwise. Straight up means "fly towards the sun", straight down "away from the sun", 60° right of vertical "60° to the right of the sun".
- **Distance.** The longer each waggle run lasts, the farther the food: roughly one second of waggling per kilometre, though calibrations measured in different colonies and races range from about 0.7 to 1.4 km per second.

$$\\varphi = A_{\\mathrm{food}} - A_{\\mathrm{sun}}, \\qquad d = k\\,T$$

Bees gauge distance by optic flow — how far the image of the ground slides past their eyes. Foragers trained to fly through a narrow tunnel a few metres long, lined with a busy pattern, danced as if the food were a couple of hundred metres away. For flowers closer than about 50–100 m the waggle runs are so short that the dance looks like a circle, the "round dance". And because the sun's azimuth moves about 15° an hour, a bee dancing for an hour in the dark hive slowly turns her runs to keep pace: she carries a clock ([[biological-rhythms]]).

### Alarm calls that name the predator
Vervet monkeys give different alarms for leopards, eagles and snakes, and each sends the troop to the right refuge: up into trees at a leopard bark, looking up and diving into bushes at an eagle cough, standing tall to scan the grass at a snake chutter. When the calls were played from hidden loudspeakers with no predator about, the monkeys still made the right escape — the call itself carries the meaning. Young vervets at first give eagle alarms to almost anything overhead and learn to be choosier. Black-capped chickadees add more "dee" notes to their mobbing call for small, agile owls and hawks, which are the most dangerous to them.

### Honest signals
If a signal can be faked, why trust it? Amotz Zahavi's **handicap principle** (1975) proposed that signals stay honest when they cost something only a high-quality signaller can afford. A Thomson's gazelle that sees wild dogs may leap stiff-legged high into the air — **stotting** — instead of fleeing flat out; the dogs more often chase gazelles that stot less, and those that stot most tend to escape. Red deer stags size each other up by roaring before they fight, and roaring rate tracks stamina. Other signals cannot be faked at all: a male toad's croak is deeper the bigger he is, and rivals are less likely to attack a mating male when a deep croak is played to them.

Deceit exists but must stay rare to work: female *Photuris* fireflies answer the flash code of another genus's females and eat the males they lure.

> [!key] Direction from the angle, distance from the duration: the waggle dance is a map drawn relative to the sun. Signals persist only if, on average, they are worth believing.
`,
  ideas: [
    'A signal evolved to change the receiver\'s behaviour; a cue is information that was not shaped for the purpose.',
    'Each channel — chemical, sound, sight, touch, electricity — has its own range, speed and risk of eavesdropping.',
    'In the waggle dance, the angle of the run from vertical is the angle of the food from the sun; the duration of the run grows with distance (about 1 s per km).',
    'Some alarm calls are referential: vervet monkeys have different calls, and different escapes, for leopards, eagles and snakes.',
    'Signals stay honest when they are costly or physically tied to quality; deception can persist only while it is rare.'
  ],
  pitfalls: [
    'Animals signal to help the group or the species — Signals evolve because they benefit the sender\'s genes; receivers respond because it pays them. Group benefit alone does not keep a signal going.',
    'The waggle dance points to the food like a compass needle — It encodes the angle relative to the sun\'s azimuth, so the dance for the same flowers turns through the day as the sun moves.',
    'A costly signal is wasteful and should be selected against — Its cost is what makes it believable; only a signaller in good condition can pay it, so receivers can trust it.'
  ],
  formulas: [
    {
      name: 'Distance from the waggle run',
      expr: 'd = k*T', tex: 'd = k\\,T',
      vars: {
        d: { name: 'distance from hive to food', q: 'length', unit: 'm' },
        k: { name: 'calibration: metres of flight per second of waggling', q: false, unit: 'm/s', value: 1000 },
        T: { name: 'duration of one waggle run', q: 'time', unit: 's', value: 1.8 }
      },
      note: 'Linear over the usual foraging range (up to about 10 km). The calibration k differs between colonies, races and landscapes (it depends on optic flow): published values run from about 700 to 1400 m of flight per second of waggling.',
      stories: {
        d: 'A forager\'s waggle runs last {T}. In a colony whose calibration is {k}, how far away is the food?',
        T: 'Flowers are {d} from the hive. How long should a dancer\'s waggle runs last, with a calibration of {k}?',
        k: 'Bees trained to a feeder {d} away make waggle runs of {T}. What is the colony\'s calibration?'
      }
    },
    {
      name: 'Direction from the waggle run',
      expr: 'phi = Af - As', tex: '\\varphi = A_{\\mathrm{food}} - A_{\\mathrm{sun}}',
      vars: {
        phi: { name: 'angle of the waggle run, clockwise from straight up', q: 'angle', unit: '°', signed: true, tex: '\\varphi' },
        Af: { name: 'compass bearing of the food from the hive', q: 'angle', unit: '°', value: 200, min: 0, max: 360, tex: 'A_{\\mathrm{food}}' },
        As: { name: 'azimuth of the sun', q: 'angle', unit: '°', value: 135, min: 0, max: 360, tex: 'A_{\\mathrm{sun}}' }
      },
      note: 'Bearings are measured clockwise from north. Add or subtract 360° to bring the dance angle between −180° and +180°; negative means to the left of vertical.',
      stories: {
        phi: 'The sun is at azimuth {As} and the flowers lie on a bearing of {Af} from the hive. At what angle from vertical does the dancer run?',
        Af: 'The sun\'s azimuth is {As}; a dancer\'s waggle runs point {phi} clockwise from vertical. On what bearing is the food?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a dance',
      q: 'At 10 a.m. the sun\'s azimuth is 130°. A forager\'s waggle runs point 40° to the *left* of straight up, and each lasts about 2.0 s. Where is the food? Take 1 km of flight per second of waggling.',
      steps: [
        'Left of vertical is anticlockwise, so $\\varphi = -40°$.',
        '$A_{\\mathrm{food}} = A_{\\mathrm{sun}} + \\varphi = 130° - 40° = 90°$: due east.',
        '$d = kT = 1000\\ \\mathrm{m/s} \\times 2.0\\ \\mathrm{s} = 2000$ m.'
      ],
      a: 'About 2 km due east of the hive.'
    },
    {
      title: 'The same flowers in the afternoon',
      q: 'By 3 p.m. the sun\'s azimuth has moved to about 235°. How does a dance for the same patch (bearing 90°, 2 km) look now?',
      steps: [
        '$\\varphi = 90° - 235° = -145°$: the waggle runs point 145° to the left of vertical — down the comb and to the left.',
        'The duration does not change: still about 2 s per run, since the distance is the same.',
        'Over the five hours the dance angle has turned 105° anticlockwise, following the sun.'
      ],
      a: 'Waggle runs about 145° left of vertical, still about 2 s long.'
    }
  ],
  quiz: [
    { q: 'On the vertical comb, a waggle run pointing straight down tells recruits to fly…', choices: ['towards the sun', 'directly away from the sun', 'down, towards the ground', 'north'], a: 1, why: 'Straight up stands for the sun\'s direction, so straight down (180° from vertical) stands for the opposite direction.' },
    { q: 'A dancer\'s waggle runs become twice as long. The food is…', choices: ['about twice as far away', 'twice as rich', 'in the opposite direction', 'at the same distance but in more demand'], a: 0, why: 'Duration codes distance, roughly in proportion. Richness shows in how many circuits she dances and how vigorously, not in the length of each run.' },
    { q: 'The carbon dioxide a person breathes out is a signal to mosquitoes.', a: false, why: 'It is a cue: it carries information that mosquitoes exploit, but it did not evolve to influence them — and responding to it does the person no good.' },
    { q: 'Why is stotting thought to be an honest signal to predators?', choices: ['It costs time and effort that a weak gazelle could not spare, and predators that heed it do better', 'It is a reflex that gazelles cannot control', 'Its only purpose is to warn other gazelles', 'It makes the gazelle look bigger than it is'], a: 0, why: 'Wild dogs mostly chase gazelles that stot less, and those gazelles are more often caught: the display reliably reveals condition because only a fit animal can afford it.' },
    { q: 'Vervet monkeys hear a recorded eagle alarm from a hidden loudspeaker, with no eagle about. What do they do?', choices: ['Nothing, because there is no eagle', 'Look up and dive into bushes', 'Climb the nearest tree', 'Stand up and scan the grass'], a: 1, why: 'The call alone is enough to produce the eagle escape — evidence that the call refers to the kind of predator.' }
  ],
  problems: [
    { q: 'A colony\'s calibration is 1.2 km of flight per second of waggling. A forager\'s waggle runs last 2.5 s. How far away is the food?', answer: 3, unit: 'km', tol: 0.02, steps: ['$d = kT = 1.2\\ \\mathrm{km/s} \\times 2.5\\ \\mathrm{s} = 3.0$ km.'] },
    { q: 'The sun is at azimuth 250°. A dancer\'s waggle runs point 30° to the right of vertical. What is the compass bearing of the food?', answer: 280, unit: '°', tol: 0.01, steps: ['Right of vertical is clockwise: $\\varphi = +30°$.', '$A_{\\mathrm{food}} = 250° + 30° = 280°$ — a little north of west.'] }
  ],
  applications: [
    'Researchers decode waggle dances filmed in observation hives to map where colonies forage through the season, and so which habitats pollinators depend on.',
    'Pheromone traps and mating disruption control insect pests such as the codling moth with far less insecticide.',
    'Playing distress and alarm calls keeps birds away from airports and crops.',
    'Costly-signalling theory is also used in economics to explain why credentials and guarantees are believed.'
  ],
  history: 'Karl von Frisch trained bees to feeding dishes and decoded the dance in the 1940s, sharing the 1973 Nobel Prize with Lorenz and Tinbergen. In the 1960s Adrian Wenner argued that recruits found food by smell alone; experiments with deliberately misdirected dances (James Gould, 1975), a robot bee that recruited real bees (Axel Michelsen and colleagues, 1992) and radar tracking of recruits\' flights (2005) settled the question in favour of the dance.',
  sim: 'beh-waggle'
},

{
  id: 'social-behaviour', parent: 'behaviour-topic', title: 'Social behaviour and altruism', level: 2,
  short: 'Living in groups brings safety and costs. Animals that sacrifice themselves for others are explained by kin selection — Hamilton\'s rule rB > C — and, between non-relatives, by reciprocity, which game theory analyses as the prisoner\'s dilemma, where tit-for-tat does remarkably well.',
  keywords: ['social behaviour', 'altruism', 'kin selection', 'Hamilton\'s rule', 'inclusive fitness', 'coefficient of relatedness', 'haplodiploidy', 'eusociality', 'worker policing', 'reciprocal altruism', 'prisoner\'s dilemma', 'tit-for-tat', 'Axelrod', 'dilution effect', 'selfish herd', 'vampire bats', 'game theory'],
  prereq: ['natural-selection', 'meiosis', 'communication', 'math:probability'],
  related: ['innate-learned', 'foraging', 'hardy-weinberg', 'genetic-drift', 'sexual-selection', 'invertebrates', 'biofilms', 'finance:game-theory', 'math:expected-value'],
  body: `
A starling flock of tens of thousands, a wolf pack, a colony of 50 000 honeybees: living with others brings benefits and costs. In a group each animal is less likely to be the one a predator takes (**dilution** — with $N$ animals and one victim per attack the risk is $1/N$), predators are spotted sooner (**many eyes**), and each can shelter behind the others (the **selfish herd**, W. D. Hamilton, 1971). Groups also find and defend food and huddle for warmth. The costs are competition for food and mates, the easy spread of parasites and disease, and being conspicuous. Selection sets group size where the benefits minus the costs are greatest for the individual, not for the group.

### The puzzle of altruism
In biology, **altruism** is behaviour that lowers the actor's own lifetime reproduction and raises another's. Worker honeybees never breed and die defending the hive with a barbed sting; Belding's ground squirrels give alarm calls that draw predators to themselves; young Florida scrub-jays stay home for years helping their parents raise more young. Darwin called sterile worker castes a "special difficulty" for his theory. How can genes for self-sacrifice spread?

### Kin selection and Hamilton's rule
Relatives share genes by common descent, so an allele that makes its carrier help relatives helps copies of itself. William Hamilton (1964) put this in one inequality: an allele for altruism spreads when

$$rB > C$$

where $C$ is the cost to the actor and $B$ the benefit to the recipient, both counted in offspring, and $r$ is the **coefficient of relatedness** — the probability that a gene in the actor is also present in the recipient by common descent. Success counted this way, own offspring plus the extra offspring of relatives weighted by $r$, is **inclusive fitness**.

| Relationship (diploid, outbred) | $r$ |
|---|---|
| Identical twins | 1 |
| Parent and offspring; full siblings | 1/2 |
| Half-siblings; grandparent and grandchild; aunt and niece | 1/4 |
| First cousins | 1/8 |
| Honeybee workers with the same father | 3/4 |
| Honeybee worker and her brother | 1/4 |

J. B. S. Haldane is said to have joked that he would lay down his life for two brothers or eight cousins — exactly where $rB = C$. Ground squirrels fit the rule: Paul Sherman found that females with close kin nearby called more often than females without, while males, which leave their relatives behind, seldom called at all.

### Haplodiploidy and the social insects
Male ants, bees and wasps hatch from unfertilised eggs and are haploid, so a father passes his *whole* genome to every daughter. Sisters with the same father share all their paternal genes and half their maternal ones: $r = \\tfrac12 \\times 1 + \\tfrac12 \\times \\tfrac12 = \\tfrac34$ — more than a mother shares with her own daughter. Hamilton suggested this is why worker castes arose so often in this group. The idea has limits: a honeybee queen mates with 10–20 males, so most workers are half-sisters with an average $r$ nearer 0.3, and termites and naked mole-rats are diploid yet have sterile workers. What seems crucial is that colonies began with a single, once-mated mother, which kept relatedness high when worker castes first evolved. Multiple mating also explains **worker policing**: workers destroy eggs laid by other workers, because they are more closely related to the queen's sons ($r = 1/4$) than to the average nephew.

### Reciprocity and the prisoner's dilemma
Unrelated animals cooperate too. A vampire bat that fails to feed for two or three nights may starve; roost-mates regurgitate blood to it, favouring relatives and bats that fed them before. Robert Trivers (1971) called this **reciprocal altruism**, and game theory shows when it can work. In the **prisoner's dilemma** each player can cooperate (C) or defect (D):

| | Partner cooperates | Partner defects |
|---|---|---|
| **I cooperate** | $R = 3$ (reward) | $S = 0$ (sucker's payoff) |
| **I defect** | $T = 5$ (temptation) | $P = 1$ (punishment) |

With $T > R > P > S$, defecting pays whatever the partner does, so in a single encounter both defect and get 1 each instead of 3. But when the same pair may meet again, with probability $w$, cooperation can pay. In Robert Axelrod's computer tournaments (1980) the winner was the simplest entry, Anatol Rapoport's **tit-for-tat**: cooperate first, then copy the partner's last move. It is nice (never defects first), retaliates, forgives and is easy to read. It can never score more than its partner in a match, yet it collects the most points overall by drawing others into cooperation. It resists invasion by constant defectors when $w \\ge (T - R)/(T - P)$ — one half with these payoffs. Where mistakes happen, more forgiving rules such as generous tit-for-tat and win-stay, lose-shift do better.

> [!key] Help relatives when $rB > C$; help others when the favour is likely to come back. Kin selection and reciprocity explain most cooperation in nature without any appeal to "the good of the species".
`,
  ideas: [
    'Groups dilute each member\'s risk, detect predators sooner and find food, but bring competition and disease; group size reflects the individual\'s gain.',
    'Altruism means lowering one\'s own reproduction to raise another\'s; kin selection explains it: an altruism allele spreads when rB > C.',
    'r is the probability that a gene in the actor is shared by descent with the recipient: 1/2 for full siblings, 1/8 for cousins, 3/4 for honeybee sisters with the same father.',
    'Haplodiploidy raises sister–sister relatedness, but once-mated founding mothers — not haplodiploidy alone — best explain the origin of worker castes.',
    'Between non-relatives, cooperation can be stable when encounters repeat: in the iterated prisoner\'s dilemma, tit-for-tat resists defectors when w ≥ (T − R)/(T − P).'
  ],
  pitfalls: [
    'Animals behave for the good of the species — Genes that sacrifice their carriers for unrelated strangers are replaced by selfish alternatives; altruism persists when it is directed at relatives or repaid.',
    'Kin selection requires animals to know their relatedness — Simple rules such as "help those you grew up with" or "help those that smell like the nest" direct help to relatives without any calculation.',
    'Tit-for-tat wins by beating its opponents — It never outscores a partner in a single match; it wins overall because it earns the cooperative payoff with every strategy willing to cooperate.'
  ],
  formulas: [
    {
      name: 'Hamilton\'s rule',
      expr: 'H = r*B - C', tex: 'H = rB - C',
      vars: {
        H: { name: 'net inclusive-fitness effect (offspring equivalents)', signed: true },
        r: { name: 'coefficient of relatedness, actor to recipient', value: 0.5, min: 0, max: 1 },
        B: { name: 'extra offspring the recipient gains', value: 3 },
        C: { name: 'offspring the actor gives up', value: 1 }
      },
      note: 'Altruism is favoured when H > 0, that is rB > C. B and C must be counted in the same currency (offspring, or survival weighted by future reproduction).',
      practice: { unknowns: ['H', 'r', 'C'] },
      stories: {
        H: 'Helping a relative with r = {r} costs the helper {C} offspring and gives the relative {B} more. What is the net inclusive-fitness effect?',
        r: 'An act costs the actor {C} offspring and gives the recipient {B}. What relatedness makes it exactly break even (net effect {H})?',
        C: 'A helper with relatedness {r} to the recipient adds {B} offspring to it. What is the largest cost for which the net effect is {H}?'
      }
    },
    {
      name: 'Relatedness along a family tree',
      expr: 'r = n*0.5^L', tex: 'r = n\\left(\\tfrac{1}{2}\\right)^{L}',
      vars: {
        r: { name: 'coefficient of relatedness' },
        n: { name: 'number of routes through different common ancestors', int: true, value: 2 },
        L: { name: 'parent–child links along each route', int: true, value: 4 }
      },
      note: 'For diploid, outbred relatives: count the links from one individual up to a shared ancestor and down to the other. First cousins: two routes (the two shared grandparents), four links each, so r = 2 × 1/16 = 1/8. Does not apply to haplodiploid males, where a father passes on his whole genome.',
      stories: {
        r: 'Two animals are connected through {n} common ancestors, by {L} parent–child links along each route. What is their relatedness?',
        L: 'Two relatives share {n} common ancestors and have r = {r}. How many parent–child links separate them along each route?'
      }
    },
    {
      name: 'When tit-for-tat resists defectors',
      expr: 'w = (T - R)/(T - P)', tex: 'w = \\frac{T - R}{T - P}',
      vars: {
        w: { name: 'least probability of meeting the same partner again', min: 0, max: 1 },
        T: { name: 'temptation: defecting on a cooperator', value: 5 },
        R: { name: 'reward: both cooperate', value: 3 },
        P: { name: 'punishment: both defect', value: 1 }
      },
      note: 'Payoffs of the prisoner\'s dilemma with T > R > P > S. A population of tit-for-tat players cannot be invaded by always-defect when the chance of a further round is at least w. The expected number of rounds per pair is 1/(1 − w).',
      stories: {
        w: 'In a prisoner\'s dilemma with T = {T}, R = {R} and P = {P}, how likely must another encounter be for tit-for-tat to resist always-defect?',
        R: 'With temptation {T}, punishment {P} and a chance {w} of meeting again, what reward for mutual cooperation puts tit-for-tat exactly on the edge?'
      }
    }
  ],
  examples: [
    {
      title: 'Haldane\'s bet',
      q: 'As a thought experiment: jumping into a river to save a drowning relative carries a 10 % risk of drowning yourself, so it costs on average 0.1 of your future reproduction ($C = 0.1$). It saves all of the relative\'s future reproduction, taken equal to yours ($B = 1$). For which relatives does kin selection favour the jump?',
      steps: [
        'Brother ($r = 1/2$): $rB = 0.5 > 0.1$ — favoured by a wide margin.',
        'First cousin ($r = 1/8$): $rB = 0.125 > 0.1$ — only just.',
        'Second cousin ($r = 1/32$): $rB = 0.031 < 0.1$ — not favoured. At a 20 % risk even the cousin would not qualify.'
      ],
      a: 'For a sibling easily, for a first cousin barely, for more distant relatives not at all.'
    },
    {
      title: 'Relatedness in a real hive',
      q: 'A honeybee queen mated with 15 drones, each fathering an equal share of the workers. What is the average relatedness between two workers, and between a worker and the son of another worker?',
      steps: [
        'Maternal half: two workers share each maternal gene with probability 1/2, so this half contributes $\\tfrac12 \\times \\tfrac12 = 0.25$.',
        'Paternal half: the same father with probability 1/15, and then all paternal genes are shared: $\\tfrac12 \\times \\tfrac{1}{15} = 0.033$.',
        'Average worker–worker $r = 0.25 + 0.033 = 0.283$, far below the 0.75 of full sisters.',
        'A worker\'s son carries half his mother\'s genes, so a worker\'s relatedness to him is half her relatedness to his mother: $0.283/2 = 0.142$ — less than her relatedness to the queen\'s sons, her brothers ($0.25$). Hence workers police each other\'s eggs.'
      ],
      a: 'About 0.28 between workers; about 0.14 to another worker\'s son, against 0.25 to a brother.'
    },
    {
      title: 'Can a defector invade tit-for-tat?',
      q: 'With payoffs $T = 5$, $R = 3$, $P = 1$, $S = 0$ and a probability $w = 0.9$ that a pair meets again, compare the total expected payoffs.',
      steps: [
        'Tit-for-tat against tit-for-tat cooperates every round: $R/(1 - w) = 3/0.1 = 30$.',
        'Always-defect against tit-for-tat gets $T$ once, then $P$ every later round: $5 + 0.9 \\times 1/0.1 = 14$.',
        'Since 14 < 30, a rare defector does worse than the tit-for-tat players around it and cannot spread. (Conversely, tit-for-tat against always-defect gets $0 + 9 = 9$, less than the defectors\' 10 among themselves — so cooperation must start in a cluster.)'
      ],
      a: 'Tit-for-tat earns 30 per partner, an invading defector only 14: cooperation is stable because 0.9 > (5 − 3)/(5 − 1) = 0.5.'
    }
  ],
  quiz: [
    { q: 'What is the coefficient of relatedness between two honeybee workers with the same mother and the same father?', answer: 0.75, why: 'Their haploid father gives each the same genes (shared with probability 1); the mother\'s half is shared with probability 1/2: $\\tfrac12 \\times 1 + \\tfrac12 \\times \\tfrac12 = \\tfrac34$.' },
    { q: 'An act costs the actor 1 offspring and gives a half-sibling 3 extra offspring. Is it favoured by kin selection?', choices: ['Yes: rB = 1.5 > 1', 'No: rB = 0.75 < 1', 'Yes: B is bigger than C', 'No: altruism can never be favoured'], a: 1, why: 'Half-siblings have r = 1/4, so rB = 0.75, less than the cost of 1. Comparing B with C alone ignores that the recipient carries only some of the actor\'s genes.' },
    { q: 'In a single, one-off prisoner\'s dilemma, which move gives the higher payoff whatever the partner does?', choices: ['Cooperate', 'Defect', 'It depends on the partner', 'Both give the same'], a: 1, why: 'If the partner cooperates, defecting gives T > R; if the partner defects, it gives P > S. Defection dominates — which is the dilemma, since mutual defection leaves both worse off than mutual cooperation.' },
    { q: 'Tit-for-tat won Axelrod\'s tournaments because it scored more than each opponent it played.', a: false, why: 'Tit-for-tat never outscores its partner in a match — at best it ties. It won on total points because it earned the cooperative payoff with every strategy willing to cooperate and lost little to defectors.' },
    { q: 'Female Belding\'s ground squirrels with close relatives nearby give more alarm calls than females without. This best supports…', choices: ['kin selection', 'reciprocal altruism', 'the handicap principle', 'group selection for the good of the species'], a: 0, why: 'The calls are risky for the caller and benefit those nearby; calling more when kin are present is what Hamilton\'s rule predicts.' }
  ],
  problems: [
    { q: 'An act costs the actor 2 offspring and gives the recipient 5. What is the smallest coefficient of relatedness for which kin selection favours it?', answer: 0.4, tol: 0.01, steps: ['Break-even: $rB = C$, so $r = C/B = 2/5 = 0.4$.', 'Full siblings (0.5) qualify; half-siblings (0.25) do not.'] },
    { q: 'What is the coefficient of relatedness between an aunt and her sister\'s daughter, in an ordinary diploid species?', answer: 0.25, tol: 0.01, hint: 'Count the routes through shared ancestors and the links along each.', steps: ['The shared ancestors are the aunt\'s two parents (the niece\'s grandparents): two routes.', 'Each route has 3 links: aunt ← grandparent → mother → niece.', '$r = 2 \\times (1/2)^3 = 1/4$.'] },
    { q: 'With payoffs T = 6, R = 4, P = 1 and S = 0, how likely must a further round be for tit-for-tat to resist always-defect?', answer: 0.4, tol: 0.01, steps: ['$w \\ge (T - R)/(T - P) = (6 - 4)/(6 - 1) = 0.4$.'] }
  ],
  applications: [
    'Cooperative breeders such as scrub-jays and meerkats need territories big enough for whole family groups — a point for their conservation.',
    'Colony relatedness and worker policing matter for managing honeybees and bumblebees that pollinate crops.',
    'Bacteria that share iron-scavenging molecules can be exploited by non-producing "cheats"; kin selection predicts when cooperation holds up in infections and biofilms.',
    'The iterated prisoner\'s dilemma is used in economics and in designing reputation systems for online markets.'
  ],
  history: 'William Hamilton published "The genetical evolution of social behaviour" in 1964, while still a graduate student; Haldane\'s remark about brothers and cousins is said to date from a pub conversation in the 1950s. Robert Trivers described reciprocal altruism in 1971, John Maynard Smith introduced evolutionarily stable strategies in 1973, and Robert Axelrod and Hamilton\'s paper "The evolution of cooperation" (1981) brought the prisoner\'s dilemma into biology.',
  sim: ['beh-hamilton', 'beh-ipd']
},

{
  id: 'foraging', parent: 'behaviour-topic', title: 'Optimal foraging', level: 3,
  short: 'Foragers that gain energy faster leave more offspring, so selection should shape which prey they take and how long they stay in a patch. The prey model says rank prey by energy per handling time; the marginal value theorem says leave a patch when its rate falls to the habitat average.',
  keywords: ['optimal foraging', 'profitability', 'handling time', 'prey model', 'diet choice', 'marginal value theorem', 'Charnov', 'patch', 'giving-up time', 'travel time', 'functional response', 'Holling disc equation', 'ideal free distribution', 'risk-sensitive foraging', 'currency'],
  prereq: ['natural-selection', 'energy-flow', 'math:derivative'],
  related: ['social-behaviour', 'innate-learned', 'predator-prey', 'competition-niches', 'scaling-allometry', 'math:optimization'],
  body: `
A foraging animal makes decisions all day: which prey to take and which to ignore, how long to stay in a patch before moving on, where to go when others are feeding too. **Optimal foraging theory** asks which choices natural selection should favour and turns the answer into numbers that can be tested. It needs a **currency** (usually the net rate of energy intake — energy per unit time, a power in watts), the **decisions** open to the animal, and the **constraints**: how long it takes to find and handle food, what the animal can perceive, the risk of being eaten.

### Which prey to eat
Each kind of prey has an energy content $E$ and a **handling time** $h$, the time to catch, subdue and eat it. Its **profitability** is $E/h$. A forager that eats only one kind, meeting it at a rate $\\lambda$ while searching, gains energy at

$$R = \\frac{\\lambda E}{1 + \\lambda h}$$

(C. S. Holling's "disc equation" for a predator's intake, 1959). The prey model predicts:

1. Rank prey by profitability; the most profitable kind is always taken.
2. Add the next kind only if its profitability exceeds the rate $R$ the better kinds give on their own.
3. Whether a poor prey is eaten depends on how common the *better* prey are — not on how common the poor prey itself is.

John Krebs and colleagues (1977) let great tits pick mealworm pieces off a conveyor belt carrying large and small pieces. When large pieces came by often, the birds ignored the small ones however many passed; when large ones were scarce, they took both — as predicted, though the switch was less abrupt than the theory's all-or-nothing rule. Shore crabs prefer medium mussels, which give the most energy per second of cracking; northwestern crows choose the largest whelks and drop them onto rocks from about five metres, close to the height that minimises the total climbing needed to break one.

### When to leave a patch: the marginal value theorem
Food usually comes in patches — a bush of berries, a mudflat of worms — and a patch runs down as the forager eats. The longer it stays the slower it gains, but moving on costs a travel time $T$ with no food. Eric Charnov (1976) showed that the best leaving time $t^*$ is when the rate of gain in the patch has fallen to the **average rate for the whole habitat**, travel included. With a gain curve $g(t) = G(1 - e^{-t/\\tau})$, the long-term rate is

$$R(t) = \\frac{g(t)}{t + T}$$

and it peaks where $g'(t^*) = g(t^*)/(t^* + T)$ — on a graph, where a line from the point $-T$ on the time axis just touches the gain curve. Two predictions follow: **the longer the journey between patches, the longer the stay**, and **the richer the habitat as a whole, the sooner each patch is left**. Great tits in an aviary stayed longer at each patch when travel between patches was made harder, and starlings feeding chicks carried bigger beakfuls of leatherjackets the farther the feeding site was from the nest, both close to the predicted amounts.

### Beyond energy
- **Danger.** Young bluegill sunfish feed in safe but poorer weed beds while bass are about, and move out to the richer open water once they are too big to be eaten.
- **Nutrients.** Moose on Isle Royale balance energy-rich leaves against sodium-rich but bulky water plants, in proportions close to a linear-programming solution of the two limits.
- **Competitors.** When many animals share patches, each should go where its own intake is highest. The outcome, the **ideal free distribution**, is that numbers match the food supply: six sticklebacks fed twice as fast at one end of a tank as at the other soon split four to two.
- **Risk.** Juncos facing a cold night on an empty stomach prefer a variable food source to a steady one with the same average — the gamble may be their only chance of getting enough.

> [!note] "Optimal" is a hypothesis to test, not a claim that animals are perfect. When a prediction fails, the mismatch shows which currency or constraint the model left out.
`,
  ideas: [
    'Optimal foraging models need a currency (usually net energy per unit time), the decisions available and the constraints.',
    'Rank prey by profitability E/h; a poorer prey is worth taking only if its profitability beats the rate from the better prey alone — regardless of its own abundance.',
    'The marginal value theorem: leave a depleting patch when its instantaneous rate of gain falls to the average rate for the habitat, travel included.',
    'Longer travel between patches means longer stays; a richer habitat means earlier departures.',
    'With competitors, the ideal free distribution matches the numbers of foragers to the supply of food at each site.'
  ],
  pitfalls: [
    'A forager should stay until a patch is empty — The last scraps come slowly; leaving earlier and spending the time in a fresh patch gives more energy per hour overall.',
    'A predator should eat more of a poor prey when that prey becomes common — The prey model says the decision depends on the abundance of the better prey. Plentiful poor prey are still ignored while good prey are easy to find.',
    'Optimal foraging theory assumes animals calculate — Selection shapes simple rules of thumb (leave after a set time without a find, for example) that approximate the optimum without any arithmetic.'
  ],
  formulas: [
    {
      name: 'Intake rate on one kind of prey (Holling\'s disc equation)',
      expr: 'R = l*E/(1 + l*h)', tex: 'R = \\frac{\\lambda E}{1 + \\lambda h}',
      vars: {
        R: { name: 'energy intake rate', q: 'power', unit: 'W' },
        l: { name: 'encounter rate while searching', q: 'rate', unit: '1/min', value: 1.2, tex: '\\lambda' },
        E: { name: 'energy gained per prey item', q: 'energy', unit: 'J', value: 50 },
        h: { name: 'handling time per item', q: 'time', unit: 's', value: 5 }
      },
      note: 'Searching and handling cannot overlap. At high encounter rates R approaches the profitability E/h: the forager spends all its time handling. Adding a second, poorer prey kind pays only if its E/h exceeds this R.',
      stories: {
        R: 'A great tit meets a caterpillar {l} while searching; each gives {E} and takes {h} to handle. At what rate does it gain energy?',
        l: 'A forager gains {R} from prey worth {E} each, handling each for {h}. How often does it meet one while searching?'
      }
    },
    {
      name: 'Long-term rate from depleting patches',
      expr: 'R = G*(1 - exp(-t/tau))/(t + T)', tex: 'R = \\frac{G\\left(1 - e^{-t/\\tau}\\right)}{t + T}',
      vars: {
        R: { name: 'average energy intake rate, travel included', q: 'power', unit: 'W' },
        G: { name: 'energy a patch would yield if emptied', q: 'energy', unit: 'J', value: 300 },
        t: { name: 'time spent in each patch', q: 'time', unit: 's', value: 50 },
        tau: { name: 'depletion time constant of a patch', q: 'time', unit: 's', value: 60, tex: '\\tau' },
        T: { name: 'travel time between patches', q: 'time', unit: 's', value: 30 }
      },
      note: 'The gain curve g(t) = G(1 − e^(−t/τ)) rises quickly, then levels off as the patch runs down. For a given R there are usually two patch times, one too short and one too long; the best one maximises R.',
      practice: { unknowns: ['R', 'G', 'T'] },
      stories: {
        R: 'A bird spends {t} in each bush (worth {G} if stripped bare, depletion time constant {tau}) and {T} flying between bushes. What is its average intake rate?',
        T: 'A forager staying {t} in each patch (worth {G}, time constant {tau}) averages {R}. How long does it spend travelling between patches?'
      }
    },
    {
      name: 'The marginal value theorem: best time in a patch',
      expr: 'exp(-t/tau)/tau = (1 - exp(-t/tau))/(t + T)', tex: '\\frac{e^{-t^*/\\tau}}{\\tau} = \\frac{1 - e^{-t^*/\\tau}}{t^* + T}',
      vars: {
        t: { name: 'optimal time in each patch', q: 'time', unit: 's', tex: 't^*' },
        tau: { name: 'depletion time constant of a patch', q: 'time', unit: 's', value: 60, tex: '\\tau' },
        T: { name: 'travel time between patches', q: 'time', unit: 's', value: 30 }
      },
      solveFor: 't',
      note: 'The rate of gain in the patch, g′(t*) (left, divided by G), equals the average rate g(t*)/(t* + T) (right, divided by G): leave when the patch is no better than the habitat as a whole. The patch size G cancels. With x = t*/τ it reduces to eˣ = 1 + x + T/τ.',
      stories: {
        t: 'Patches deplete with a time constant of {tau} and lie {T} apart. How long should a forager stay in each?',
        T: 'A forager in patches with a depletion time constant of {tau} stays {t} in each, which is optimal. How far apart (in travel time) must the patches be?'
      }
    },
    {
      name: 'The ideal free distribution',
      expr: 'n1 = N*r1/(r1 + r2)', tex: 'n_1 = N\\,\\frac{r_1}{r_1 + r_2}',
      vars: {
        n1: { name: 'foragers at site 1', tex: 'n_1' },
        N: { name: 'foragers in all', int: true, value: 6 },
        r1: { name: 'food supply rate at site 1', q: 'rate', unit: '1/min', value: 20, tex: 'r_1' },
        r2: { name: 'food supply rate at site 2', q: 'rate', unit: '1/min', value: 10, tex: 'r_2' }
      },
      note: 'Assumes equal competitors free to move at no cost ("ideal" knowledge, "free" movement): everyone then ends up with the same intake. The same proportion rule as the matching law of operant learning.',
      stories: {
        n1: '{N} fish are fed at two ends of a tank, at {r1} and {r2}. How many should settle at the first end?',
        r2: '{N} ducks share two bread-throwers; {n1} gather at the one throwing {r1}. How fast is the other throwing?'
      }
    }
  ],
  examples: [
    {
      title: 'Travel time and the best time to stay',
      q: 'Patches deplete with a time constant $\\tau = 60$ s and hold $G = 300$ J. Find the best time to stay in each, and the average intake rate, when patches are 30 s apart and when they are 60 s apart.',
      steps: [
        'With $x = t^*/\\tau$ and $a = T/\\tau$ the optimum condition becomes $e^x = 1 + x + a$.',
        '$T = 30$ s ($a = 0.5$): $e^x = 1.5 + x$ gives $x = 0.858$, so $t^* = 51$ s.',
        '$T = 60$ s ($a = 1$): $e^x = 2 + x$ gives $x = 1.146$, so $t^* = 69$ s — a longer journey, a longer stay.',
        'At the optimum the average rate equals the rate in the patch, $Ge^{-x}/\\tau$: $300 \\times 0.424/60 = 2.12$ W, and $300 \\times 0.318/60 = 1.59$ W.'
      ],
      a: 'Stay 51 s (2.1 W) when patches are 30 s apart, 69 s (1.6 W) when they are 60 s apart.'
    },
    {
      title: 'Should the tit take the small caterpillars?',
      q: 'Large caterpillars give 50 J and take 5 s to handle; small ones give 10 J and also take 5 s. Should a bird eat the small ones when it meets large ones (a) 1.2 times a minute, (b) 12 times a minute?',
      steps: [
        'Profitabilities: large $50/5 = 10$ W, small $10/5 = 2$ W.',
        '(a) $\\lambda = 0.02$ s⁻¹: eating large only gives $R = 0.02 \\times 50/(1 + 0.02 \\times 5) = 0.91$ W. Small caterpillars (2 W) beat this, so take them.',
        '(b) $\\lambda = 0.2$ s⁻¹: $R = 0.2 \\times 50/(1 + 0.2 \\times 5) = 5$ W. Small caterpillars (2 W) would lower the rate: ignore them, however many there are.'
      ],
      a: '(a) Yes — large prey are too scarce. (b) No — specialising on large prey gives 5 W, more than a small caterpillar\'s 2 W.'
    },
    {
      title: 'Ducks and bread',
      q: 'Thirty-three ducks are on a pond. One person throws a piece of bread every 5 s, another every 10 s, at opposite ends. How do the ducks spread out?',
      steps: [
        'Supply rates are 12 and 6 pieces a minute, a ratio of 2 : 1.',
        '$n_1 = 33 \\times 12/(12 + 6) = 22$, so $n_2 = 11$.',
        'In the real experiment (Cambridge, 1982) mallards settled close to this split within a minute or two — before most had even eaten a piece.'
      ],
      a: 'About 22 at the faster thrower and 11 at the slower.'
    }
  ],
  quiz: [
    { q: 'Patches become farther apart, so the travel time between them doubles. According to the marginal value theorem, a forager should…', choices: ['stay longer in each patch', 'leave each patch sooner', 'stay exactly as long as before', 'stop moving between patches'], a: 0, why: 'A longer journey lowers the habitat\'s average rate, so the patch rate takes longer to fall to it: the tangent from −T touches the gain curve further along.' },
    { q: 'Large prey become scarce while small prey stay just as common. In the prey model, whether small prey are eaten depends on…', choices: ['the abundance of the large prey', 'the abundance of the small prey', 'both equally', 'neither'], a: 0, why: 'Small prey are included when their profitability beats the rate obtainable from large prey alone, which depends on how often large prey are met.' },
    { q: 'Prey A gives 60 J and takes 10 s to handle; prey B gives 30 J and takes 3 s. Which is more profitable?', choices: ['A: 6 W', 'B: 10 W', 'They are equal', 'It depends on how many there are'], a: 1, why: 'Profitability is energy per handling time: 60/10 = 6 W against 30/3 = 10 W. The smaller prey wins because it is so quick to eat.' },
    { q: 'A forager in a patch should leave as soon as its rate of gain starts to fall.', a: false, why: 'On a depleting patch the rate falls from the first moment. The forager should stay until it falls to the average rate for the habitat, travel included.' },
    { q: 'Thirty ducks share two bread-throwers; one throws twice as fast as the other. How many ducks does the ideal free distribution predict at the faster thrower?', answer: 20, why: '30 × 2/(2 + 1) = 20: numbers in proportion to supply, so each duck gets the same intake.' }
  ],
  problems: [
    { q: 'A predator meets prey 6 times a minute while searching; each gives 20 J and takes 4 s to handle. What is its intake rate?', answer: 1.43, unit: 'W', tol: 0.02, steps: ['$\\lambda = 0.1$ s⁻¹.', '$R = 0.1 \\times 20/(1 + 0.1 \\times 4) = 2/1.4 = 1.43$ W.'] },
    { q: 'Twelve fish are fed at two feeders, at 30 and 10 food items a minute. How many should be at the richer feeder?', answer: 9, tol: 0.01, steps: ['$n_1 = 12 \\times 30/40 = 9$.'] },
    { q: 'Patches deplete with a time constant of 40 s and lie 40 s apart. How long should a forager stay in each?', answer: 45.8, unit: 's', tol: 0.03, hint: 'Write x = t*/τ: the condition is eˣ = 1 + x + T/τ.', steps: ['$T/\\tau = 1$, so solve $e^x = 2 + x$: $x = 1.146$.', '$t^* = 1.146 \\times 40 = 45.8$ s.'] }
  ],
  applications: [
    'Predicting where shorebirds feed on estuaries, and how many birds an estuary can support, when mudflats are lost to development.',
    'Pollination: how many flowers a bee visits on each plant before moving on decides how far pollen travels between plants — a question the marginal value theorem helps to frame.',
    'Fisheries: fleets moving between fishing grounds face the same trade-off between staying on a dwindling ground and travelling to a fresh one.',
    'Anthropology: prey-choice models explain some of the hunting decisions of hunter-gatherers such as the Aché of Paraguay.'
  ],
  history: 'Robert MacArthur and Eric Pianka, and separately J. Merritt Emlen, launched optimal foraging theory in 1966. C. S. Holling derived his disc equation in 1959 from an experiment in which a blindfolded assistant searched a table by touch for sandpaper discs. Eric Charnov published the marginal value theorem in 1976, and David Stephens and John Krebs gathered the field in their book Foraging Theory (1986).',
  sim: 'beh-mvt'
},

{
  id: 'migration-navigation', parent: 'behaviour-topic', title: 'Migration and navigation', level: 2,
  short: 'Arctic terns fly about 70 000 km a year and godwits cross the Pacific without a stop. Migrants prepare by fattening, steer by the sun (with a clock to allow for its movement), the stars and the Earth\'s magnetic field, and experienced animals add a map that lets them home from places they have never been.',
  keywords: ['migration', 'navigation', 'arctic tern', 'bar-tailed godwit', 'monarch butterfly', 'Zugunruhe', 'sun compass', 'clock-shift', 'star compass', 'magnetic compass', 'inclination compass', 'cryptochrome', 'homing pigeon', 'true navigation', 'path integration', 'displacement experiment', 'Perdeck'],
  prereq: ['innate-learned', 'biological-rhythms', 'physics:magnetic-field'],
  related: ['communication', 'animal-nervous-systems', 'vertebrates', 'climate-ecosystems', 'conservation-biology', 'physics:polarization', 'math:vector-addition', 'medicine:vision'],
  body: `
**Migration** is a regular, usually seasonal, return journey between places that are good at different times of year. The Arctic summer brings round-the-clock daylight and a flush of insects for raising chicks; the same places are deadly in winter. Some two billion songbirds fly from Europe to Africa each autumn, and back in spring.

| Traveller | Journey | Notes |
|---|---|---|
| Arctic tern | Greenland and Iceland to the Weddell Sea and back: about 70 000 km a year | Tracked with 1.4 g geolocators (2010); about 2 million km in a 30-year life |
| Bar-tailed godwit | Alaska to New Zealand non-stop: 11 000–13 500 km in 8–11 days | Does not feed or drink on the way; over half its departure mass is fat |
| Monarch butterfly | Eastern North America to central Mexico: up to 4 000 km | The return north takes three or four generations |
| Humpback whale | Polar feeding grounds to tropical breeding grounds: up to 8 000 km each way | Hardly feeds while away from the poles |
| European eel | European rivers to the Sargasso Sea: 5 000–6 000 km | Spawns once and dies; the larvae drift back |
| Atlantic salmon | River to ocean and back to the stream where it hatched | Recognises its home stream by smell |

### Getting ready
Migration is prepared weeks ahead by internal calendars and day length ([[biological-rhythms]]). In the right season caged migratory birds become restless at night — **Zugunruhe**, migratory restlessness — and hop mostly in their migratory direction. Many nearly double their weight. The fuel is fat, which yields about 39 kJ per gram, more than twice as much as protein or carbohydrate and without the water that glycogen is stored with. Godwits even shrink their gut and liver before leaving: dead weight on a flight with no stops. How far a fat load goes is simple arithmetic — energy stored divided by power burnt gives the flying time, and times speed, the range.

### Three ways to find the way
Donald Griffin distinguished **piloting** (following familiar landmarks), **compass orientation** (holding a direction) and **true navigation** (knowing where you are relative to the goal: a map as well as a compass). In 1958 A. C. Perdeck ringed some 11 000 starlings caught in the Netherlands on their way to Britain and northern France, and released them in Switzerland. Young birds on their first migration kept flying south-west and ended up in Spain and southern France; adults corrected towards the north-west and reached their usual wintering grounds. The young carry an inherited compass course and a programme for how long to fly; adults have learned a map.

### Compasses
- **The sun.** Gustav Kramer found around 1950 that caged starlings orient in their migratory direction when they can see the sun, and turn by the same angle when mirrors shift its apparent position. The sun's azimuth moves on average 15° an hour, so a sun compass needs a clock. Pigeons kept for several days on a light schedule six hours ahead of real time misread the sun and set off roughly 90° off course on sunny days.
- **The stars.** Stephen Emlen raised indigo buntings in a planetarium. Birds that grew up under a sky turning about Betelgeuse later treated Betelgeuse as north: they learn the point the night sky rotates about, not particular constellations.
- **The Earth's magnetic field.** Wolfgang and Roswitha Wiltschko (1972) showed that European robins have an **inclination compass**: they sense the angle the field lines (25–65 µT) make with the horizontal and tell "towards the pole" from "towards the equator", not north from south. The sensor is thought to be light-driven chemistry in a retinal protein, cryptochrome; weak radio-frequency noise in a city was found to upset it.
- **Polarised light** in the sky, strongest in a band 90° from the sun, helps calibrate the other compasses at dusk and dawn.

### Maps and homing
Homing pigeons return from unfamiliar sites hundreds of kilometres away. Pigeons deprived of smell do poorly from unfamiliar places, pointing to an odour map, while close to home GPS-tracked pigeons follow roads and rivers. Sea turtles read the local strength and inclination of the magnetic field as coordinates: hatchling loggerheads exposed in the laboratory to the field of a point on their ocean circuit swim in the direction that keeps them within the North Atlantic gyre. Desert ants on featureless salt flats **integrate their path** — they count their steps and take their direction from the sky, so they always know the straight line home. Ants given stilts overshoot the nest; ants with shortened legs stop short.

> [!note] Migrants need every link of the chain — breeding sites, stopovers and wintering grounds. Lost stopover mudflats, artificial lights that draw night migrants and hatchling turtles off course, and power lines across flyways threaten species that no single country can protect alone.
`,
  ideas: [
    'Migration is a regular return journey between places that are good at different seasons; it is timed by internal calendars and day length.',
    'Fat (about 39 kJ/g) is the fuel; range ≈ speed × energy stored ÷ power in flight.',
    'Piloting uses landmarks, compass orientation holds a direction, true navigation needs a map as well: young starlings displaced abroad kept their compass course, adults corrected.',
    'Compasses: the sun (with a clock for its 15° an hour), the rotation centre of the night sky, the inclination of the magnetic field, polarised light.',
    'Maps may use smells, magnetic intensity and inclination; ants find home by path integration.'
  ],
  pitfalls: [
    'Birds know north from south with their magnetic sense — The avian compass reads the inclination of the field lines, so it tells poleward from equatorward; at the magnetic equator, where the lines are horizontal, it gives no direction.',
    'A sun compass only needs to see the sun — The sun moves across the sky, so the animal must also know the time; animals with a shifted clock head off in predictably wrong directions.',
    'Migratory animals learn their routes from their parents — Many young birds migrate alone on their first journey, guided by an inherited direction and distance programme; cuckoos never meet their parents at all.'
  ],
  formulas: [
    {
      name: 'Sun-compass error after a clock shift',
      expr: 'err = w*s', tex: '\\Delta\\theta = \\omega_{\\mathrm{sun}}\\,\\Delta t',
      vars: {
        err: { name: 'predicted deflection of the chosen direction', q: false, unit: '°', signed: true, tex: '\\Delta\\theta' },
        w: { name: 'average rate at which the sun\'s azimuth moves', q: false, unit: '°/h', value: 15, tex: '\\omega_{\\mathrm{sun}}' },
        s: { name: 'clock shift (positive: the internal clock is ahead)', q: false, unit: 'h', value: 6, signed: true, tex: '\\Delta t' }
      },
      note: 'In the northern hemisphere a bird whose clock runs ahead turns anticlockwise, one whose clock runs behind turns clockwise. The sun\'s azimuth moves unevenly — fastest around noon in summer and at low latitudes — so 15° an hour is only the daily average; real pigeons are often deflected less because they also consult the magnetic field.',
      stories: {
        err: 'Pigeons are kept on a light schedule shifted by {s}. With the sun\'s azimuth moving about {w}, by how much should they misjudge their homeward direction on a sunny day?',
        s: 'Clock-shifted pigeons set off {err} away from the homeward direction. Taking the sun\'s azimuth to move {w}, how far was their clock shifted?'
      }
    },
    {
      name: 'Range on a fat load',
      expr: 'D = v*m*ef/P', tex: 'D = \\frac{v\\,m_{\\mathrm{fat}}\\,e_{\\mathrm{fat}}}{P}',
      vars: {
        D: { name: 'distance flown', q: 'length', unit: 'km' },
        v: { name: 'flight speed over the ground', q: 'speed', unit: 'km/h', value: 58 },
        m: { name: 'mass of fat burnt', q: 'mass', unit: 'g', value: 250, tex: 'm_{\\mathrm{fat}}' },
        ef: { name: 'energy released per unit mass of fat', q: 'specificenergy', unit: 'MJ/kg', value: 39, tex: 'e_{\\mathrm{fat}}' },
        P: { name: 'metabolic power in flight', q: 'power', unit: 'W', value: 14 }
      },
      note: 'A rough estimate at constant power. A bird needs less power as it gets lighter, and tailwinds add to the ground speed, so real ranges can be longer; headwinds make them shorter. The default values are illustrative for a large shorebird such as a godwit.',
      practice: { unknowns: ['D', 'm', 'P'] },
      stories: {
        D: 'A bird carrying {m} of fat flies at {v}, burning energy at {P}. Fat yields {ef}. How far can it fly on its fat?',
        m: 'A bird must cover {D} at {v} with a flight power of {P}. How much fat (at {ef}) must it carry at least?'
      }
    },
    {
      name: 'Home vector after two legs (path integration)',
      expr: 'Dh = sqrt(a^2 + b^2 + 2*a*b*cos(theta))', tex: 'D_{\\mathrm{home}} = \\sqrt{a^2 + b^2 + 2ab\\cos\\theta}',
      vars: {
        Dh: { name: 'straight-line distance home', q: 'length', unit: 'm', tex: 'D_{\\mathrm{home}}' },
        a: { name: 'length of the first leg', q: 'length', unit: 'm', value: 40 },
        b: { name: 'length of the second leg', q: 'length', unit: 'm', value: 30 },
        theta: { name: 'turn between the two legs', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'The two legs are added as vectors ([[math:vector-addition|vector addition]]): a turn of 0° means carrying straight on, 180° turning right round. A desert ant keeps this sum going continuously, leg after leg.',
      stories: {
        Dh: 'A desert ant runs {a} from its nest, turns through {theta} and runs another {b}. How far is it from the nest in a straight line?',
        theta: 'An ant runs {a}, turns and runs {b}; it is then {Dh} from home. Through what angle did it turn?'
      }
    }
  ],
  examples: [
    {
      title: 'An arctic tern\'s lifetime',
      q: 'Tracked arctic terns fly about 70 900 km a year. Some live 30 years. How far is that in a lifetime, compared with the Moon\'s distance of 384 400 km?',
      steps: [
        '$70\\,900\\ \\mathrm{km/yr} \\times 30\\ \\mathrm{yr} = 2.13 \\times 10^6$ km.',
        'A return trip to the Moon is $2 \\times 384\\,400 = 768\\,800$ km.',
        '$2.13 \\times 10^6 / 768\\,800 = 2.8$.'
      ],
      a: 'About 2.1 million km — nearly three return trips to the Moon.'
    },
    {
      title: 'A clock-shifted pigeon',
      q: 'Pigeons are kept for a week with lights on and off six hours earlier than real time, so their clocks run 6 h ahead. At real noon they are released south of their loft, so home is due north (0°). Which way do they fly on a sunny day?',
      steps: [
        'At real noon the sun is due south, at azimuth 180°.',
        'The pigeon\'s clock says 18:00, when it expects the sun about $6 \\times 15° = 90°$ further on, at 270° (west).',
        'North lies 90° clockwise from where it believes the sun is (270° + 90° = 360°), so it flies 90° clockwise from the real sun: 180° + 90° = 270°, due west.',
        'Home is at 0°, so the pigeons are deflected 90° anticlockwise, as the rule predicts.'
      ],
      a: 'Roughly due west: a 90° anticlockwise error. (Real birds often show a smaller error, helped by their magnetic compass.)'
    },
    {
      title: 'How far can a godwit go?',
      q: 'A godwit carries 250 g of fat and flies at 58 km/h. Taking a flight power of 14 W and 39 MJ/kg for fat, how far can it fly?',
      steps: [
        'Energy stored: $0.25\\ \\mathrm{kg} \\times 39 \\times 10^6\\ \\mathrm{J/kg} = 9.75 \\times 10^6$ J.',
        'Flying time: $9.75 \\times 10^6 / 14 = 6.96 \\times 10^5$ s $= 193$ h, about 8 days.',
        'Range: $58\\ \\mathrm{km/h} \\times 193\\ \\mathrm{h} = 11\\,200$ km — roughly Alaska to New Zealand.'
      ],
      a: 'About 11 000 km in about 8 days, as tracked godwits do.'
    }
  ],
  quiz: [
    { q: 'Young starlings caught in the Netherlands and released in Switzerland flew on south-west to Spain, while adults turned north-west to their usual wintering area. The young birds were relying on…', choices: ['an inherited compass direction, without a map', 'a learned map of Europe', 'following the adults', 'landmarks'], a: 0, why: 'They kept their normal compass course from the wrong starting point, so they could not have known where they were relative to the goal. The adults, which corrected, had a map.' },
    { q: 'In a laboratory field, the vertical component of the magnetic field is reversed while the horizontal component is left unchanged. A migrating robin…', choices: ['reverses its direction', 'keeps its direction', 'loses all orientation', 'turns 90°'], a: 0, why: 'An inclination compass reads the angle of the field lines to the horizontal. Flipping the vertical part makes the "poleward" direction point the other way, so the bird reverses — though a polarity compass would not have noticed.' },
    { q: 'Indigo buntings are born knowing which star is the pole star.', a: false, why: 'Emlen\'s planetarium experiments showed that young buntings learn the centre of the sky\'s rotation. Birds raised under a sky rotating about Betelgeuse later used Betelgeuse as north.' },
    { q: 'By how many degrees should a pigeon whose clock has been shifted 4 hours misjudge direction with its sun compass, taking 15° per hour?', answer: 60, unit: '°', why: '4 h × 15°/h = 60°.' },
    { q: 'The monarch butterflies that arrive in Mexico in autumn are the same individuals that set off north the next spring and reach Canada.', a: false, why: 'The overwintering generation flies back only as far as the southern United States and lays eggs there; three or four short-lived generations complete the return to Canada.' }
  ],
  problems: [
    { q: 'A songbird carries 8 g of fat (39 kJ per gram), flies at 40 km/h and burns energy at 1.2 W. How far can it fly on its fat?', answer: 2890, unit: 'km', tol: 0.03, steps: ['Energy: $8 \\times 39 = 312$ kJ.', 'Time: $312\\,000/1.2 = 260\\,000$ s $= 72.2$ h.', 'Range: $40 \\times 72.2 = 2890$ km — enough to cross the Sahara.'] },
    { q: 'A desert ant runs 60 m north from its nest, then turns 90° and runs 80 m east. How far is it from the nest?', answer: 100, unit: 'm', tol: 0.01, steps: ['$D = \\sqrt{60^2 + 80^2 + 2 \\cdot 60 \\cdot 80 \\cos 90°} = \\sqrt{3600 + 6400} = 100$ m.'] }
  ],
  applications: [
    'Satellite tags, GPS loggers and tiny geolocators reveal migration routes and stopovers, and so which sites must be protected — such as the Yellow Sea mudflats used by godwits and knots.',
    'Weather radar tracks nights of mass migration; some cities dim building lights on those nights to spare birds.',
    'Beach lighting rules protect hatchling sea turtles, which head for the brightest horizon — normally the sea.',
    'Research on magnetoreception has become a test case for chemistry that depends on quantum spin in living tissue.'
  ],
  history: 'In 1822 a white stork shot in northern Germany turned out to have an African spear through its neck — proof that storks spend the winter in Africa rather than hibernating, as many had believed. Scientific bird ringing began with Hans Christian Mortensen in Denmark in 1899. Gustav Kramer discovered the sun compass around 1950, A. C. Perdeck published his starling displacements in 1958, and the Wiltschkos described the magnetic compass of robins in 1972.',
  sim: 'beh-compass'
},

{
  id: 'biological-rhythms', parent: 'behaviour-topic', title: 'Biological rhythms', level: 2,
  short: 'Most organisms keep time with internal clocks. Circadian clocks run with a period close to, but not exactly, 24 hours when left alone and are reset each day by light. A loop of clock genes drives them; in mammals a master clock in the brain keeps the rest in step. Jet lag is the clock catching up. Other clocks follow the tides, the moon and the year.',
  keywords: ['biological rhythm', 'circadian clock', 'free-running period', 'entrainment', 'zeitgeber', 'phase response curve', 'jet lag', 'shift work', 'suprachiasmatic nucleus', 'melatonin', 'melanopsin', 'period gene', 'clock genes', 'temperature compensation', 'Q10', 'circannual', 'circatidal', 'lunar rhythm', 'actogram'],
  prereq: ['eukaryotic-regulation', 'animal-hormones', 'animal-nervous-systems'],
  related: ['migration-navigation', 'photoperiodism', 'innate-learned', 'model-organisms', 'medicine:sleep', 'medicine:endocrine-system', 'physics:driven-oscillations', 'math:trig-graphs'],
  body: `
In 1729 the French astronomer Jean-Jacques d'Ortous de Mairan shut a mimosa plant in a dark cupboard. Its leaves went on opening by day and folding at night: the rhythm came from inside the plant. Almost every organism studied since, from cyanobacteria to people, keeps time with an internal **circadian clock** (from *circa diem*, "about a day").

### The signature of a clock
| Property | What it means | Numbers |
|---|---|---|
| Free-running | The rhythm continues in constant conditions with its own period $\\tau$ | Humans about 24.2 h; laboratory mice 23.5–23.8 h; golden hamsters about 24.1 h |
| Entrainment | Daily cues — **zeitgebers** — reset it to exactly 24 h | Light is the strongest; also temperature, meals, social contact |
| Temperature compensation | The period barely changes with temperature | $Q_{10}$ of 0.8–1.2, against 2–3 for most chemical reactions |

Because $\\tau$ is not exactly 24 h, a free-running rhythm drifts against clock time by $\\tau - 24$ h every day. A person living in a cave without time cues, with $\\tau = 24.2$ h, falls asleep about 12 minutes later each day — six hours later after a month. A nocturnal mouse in constant darkness with $\\tau = 23.6$ h starts running 24 minutes earlier each evening. Recorded day after day and stacked row under row, such a rhythm draws a slanting line: an **actogram**.

### Entrainment and the phase response curve
Light does not shift the clock by the same amount at every hour. Light early in the subjective night **delays** the clock; light late in the subjective night **advances** it; light in the middle of the subjective day does almost nothing — the "dead zone". Plotting the shift against the time of a light pulse gives the **phase response curve**. Each day dawn and dusk nudge the clock just enough to cancel $\\tau - 24$ h: a human clock with $\\tau = 24.2$ h must be advanced about 0.2 h a day, mostly by morning light. There are limits: people cannot entrain to 20-hour or 28-hour days.

### The gears of the clock
The clock is a loop of genes that switch themselves off. In mammals the proteins CLOCK and BMAL1 switch on the *Period* and *Cryptochrome* genes; their products, PER and CRY, build up, are modified by kinases, enter the nucleus hours later and shut down CLOCK–BMAL1 — and with it their own production. Once they have been broken down, the cycle starts again; the delays add up to about 24 hours. Fruit flies with mutations in the *period* gene have 19-hour or 28-hour rhythms, or none (Ronald Konopka and Seymour Benzer, 1971). Cyanobacteria manage with just three proteins, KaiA, KaiB and KaiC, which keep a 24-hour cycle of phosphorylation going in a test tube with only ATP added.

### The master clock
In mammals the master clock is the **suprachiasmatic nucleus** (SCN): about 20 000 neurons in the hypothalamus, just above where the optic nerves cross. Hamsters whose SCN is destroyed lose their daily rhythms; an SCN transplanted from another hamster restores them — with the period of the *donor*. Light reaches the SCN from a small set of retinal ganglion cells containing the pigment melanopsin, most sensitive to blue light near 480 nm; they can work even in some people who are blind to images. The SCN times the pineal gland's release of melatonin at night and keeps the clocks of the liver, gut and other organs in step; meal times can reset those organ clocks too.

### Jet lag and shift work
After a flight across time zones the SCN shifts only about an hour a day — somewhat faster after flying west, which needs a delay, than after flying east, which needs an advance — and the organ clocks follow at their own rates. For several days the body's clocks disagree with local time and with each other. Night work imposes a similar mismatch for years and is associated with poorer sleep and with metabolic and other health problems ([[medicine:sleep|sleep]]).

### Other rhythms
- **Circannual** clocks run for about a year: golden-mantled ground squirrels kept at constant temperature and day length went on hibernating at intervals of 10–12 months, and caged warblers show migratory restlessness in the right seasons ([[migration-navigation]]). Day length keeps these calendars in step, as it times flowering in plants ([[photoperiodism]]).
- **Circatidal** rhythms of about 12.4 hours: shore crabs brought into the laboratory stay most active at the times of high tide on their home beach for days.
- **Lunar and semilunar** rhythms: the marine midge *Clunio* emerges only at the low spring tides, and corals on the Great Barrier Reef spawn together a few nights after a full moon in late spring.
`,
  ideas: [
    'Circadian clocks free-run in constant conditions with a period τ close to but not exactly 24 h; the rhythm drifts by τ − 24 h a day.',
    'Zeitgebers, above all light, entrain the clock; the phase response curve shows that light in the early subjective night delays and in the late subjective night advances.',
    'The clock is a transcription–translation feedback loop (CLOCK–BMAL1 switch on Per and Cry; PER–CRY switch them off), temperature compensated.',
    'In mammals the suprachiasmatic nucleus is the master clock, set by melanopsin cells in the retina; organ clocks follow it and meal times.',
    'Jet lag is the slow re-entrainment of the clocks, about an hour a day; there are also tidal, lunar and annual clocks.'
  ],
  pitfalls: [
    'Daily rhythms are just responses to light and dark — They persist for weeks in constant conditions, with a period that is not exactly 24 h: they come from an internal clock.',
    'A bright light at any hour moves the clock forward — The direction depends on the clock\'s phase: light before the middle of the subjective night delays it, light after advances it, light in the subjective day does little.',
    'A clock that speeds up in the warmth, like other chemistry, would work just as well — It would give the wrong time on every warm or cold day; temperature compensation (Q₁₀ near 1) is what makes it a clock.'
  ],
  formulas: [
    {
      name: 'Drift of a free-running rhythm',
      expr: 'D = n*(tau - T)', tex: 'D = n\\,(\\tau - T)',
      vars: {
        D: { name: 'drift against clock time (positive: later)', q: 'time', unit: 'h', signed: true },
        n: { name: 'days in constant conditions', int: true, value: 30 },
        tau: { name: 'free-running period', q: 'time', unit: 'h', value: 24.2, tex: '\\tau' },
        T: { name: 'length of the solar day', q: 'time', unit: 'h', value: 24, fixed: true }
      },
      note: 'With no zeitgebers the rhythm slips by τ − 24 h each day: later if τ is longer than 24 h, earlier if shorter. Measuring D over many days is how τ is found.',
      practice: { unknowns: ['D', 'tau', 'n'] },
      stories: {
        D: 'A volunteer with a free-running period of {tau} lives {n} in a bunker with no time cues. How far has their sleep drifted from clock time?',
        tau: 'A mouse in constant darkness starts running {D} (negative = earlier) out of step with the clock after {n}. What is its free-running period?',
        n: 'With a free-running period of {tau}, after how many days does the rhythm drift by {D}?'
      }
    },
    {
      name: 'Temperature compensation (Q₁₀ of a clock)',
      expr: 'Q10 = (tau1/tau2)^(10/(T2 - T1))', tex: 'Q_{10} = \\left(\\frac{\\tau_1}{\\tau_2}\\right)^{10/(T_2 - T_1)}',
      vars: {
        Q10: { name: 'temperature coefficient (rate change for 10 °C)', tex: 'Q_{10}' },
        tau1: { name: 'free-running period at the lower temperature', q: 'time', unit: 'h', value: 24.4, tex: '\\tau_1' },
        tau2: { name: 'free-running period at the higher temperature', q: 'time', unit: 'h', value: 24, tex: '\\tau_2' },
        T1: { name: 'lower temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        T2: { name: 'higher temperature', q: 'temperature', unit: '°C', value: 30, tex: 'T_2' }
      },
      note: 'The rate of the clock is 1/τ, so the ratio of rates is τ₁/τ₂. Most enzyme reactions have Q₁₀ of 2–3; circadian clocks 0.8–1.2.',
      practice: { unknowns: ['Q10', 'tau2'] },
      stories: {
        Q10: 'A fungus has a free-running period of {tau1} at {T1} and {tau2} at {T2}. What is the Q₁₀ of its clock?',
        tau2: 'A clock with Q₁₀ = {Q10} runs with a period of {tau1} at {T1}. What is its period at {T2}?'
      }
    },
    {
      name: 'Days to get over jet lag (rule of thumb)',
      expr: 'd = s/v', tex: 'd = \\frac{\\Delta}{v}',
      vars: {
        d: { name: 'days for the clock to catch up', q: false, unit: 'days' },
        s: { name: 'shift of local time (time zones crossed)', q: false, unit: 'h', value: 6, tex: '\\Delta' },
        v: { name: 'rate at which the clock re-sets', q: false, unit: 'h per day', value: 1 }
      },
      note: 'A rough guide for the master clock: about 1 h a day after flying east (advancing), up to about 1.5 h a day after flying west (delaying). Organ clocks and individuals differ, and light exposure at the wrong time of day can slow the shift.',
      stories: {
        d: 'A traveller crosses {s} of time zones; the clock re-sets at about {v}. Roughly how many days until it has caught up?',
        v: 'After a flight across {s} of time zones, a traveller feels adjusted after {d}. How fast did their clock re-set?'
      }
    }
  ],
  examples: [
    {
      title: 'A month in a cave',
      q: 'A volunteer with a free-running period of 24.2 h lives for 30 days in a cave with no clocks or daylight. How far does their sleep drift? When would they be sleeping through the middle of the real day?',
      steps: [
        'Drift per day: $\\tau - 24\\ \\mathrm{h} = 0.2$ h = 12 min, later each day.',
        'After 30 days: $D = 30 \\times 0.2 = 6$ h. Someone who fell asleep at 23:00 now falls asleep around 05:00.',
        'A full 12-hour inversion needs $12/0.2 = 60$ days.'
      ],
      a: '6 hours later after a month; day and night fully swapped after about two months.'
    },
    {
      title: 'A mouse running early',
      q: 'A mouse with a free-running period of 23.6 h is moved from a light–dark cycle to constant darkness. It used to start running at lights-off, 19:00. When does it start after 14 days?',
      steps: [
        'Drift per day: $23.6 - 24 = -0.4$ h, 24 minutes earlier each day.',
        'After 14 days: $D = 14 \\times (-0.4) = -5.6$ h.',
        '19:00 − 5 h 36 min = 13:24.'
      ],
      a: 'Around 13:24 — in the actogram the onsets form a line slanting to the left.'
    },
    {
      title: 'East and west',
      q: 'A traveller flies 8 time zones east, and returns a fortnight later. Using about 1 h a day for advancing and 1.5 h a day for delaying, compare the recovery times.',
      steps: [
        'Eastward the local day starts 8 h earlier, so the clock must advance 8 h: $8/1 = 8$ days.',
        'Westward on the way back it must delay 8 h: $8/1.5 \\approx 5$ days.',
        'Human clocks run slightly longer than 24 h and find delays easier. After very large eastward shifts some people re-set by delaying 16 h instead.'
      ],
      a: 'About 8 days after the eastward flight, about 5 after the westward one.'
    }
  ],
  quiz: [
    { q: 'In constant darkness a hamster starts running 10 minutes later each day. Its free-running period is…', choices: ['24 h 10 min', '23 h 50 min', 'exactly 24 h', 'impossible to tell'], a: 0, why: 'Each cycle lasts 10 minutes longer than a day, so τ = 24 h 10 min.' },
    { q: 'A light pulse given late in an animal\'s subjective night, shortly before its subjective dawn, will most likely…', choices: ['advance the clock', 'delay the clock', 'have no effect', 'stop the clock'], a: 0, why: 'The phase response curve to light has delays in the early subjective night and advances in the late subjective night — the clock treats the light as an early dawn.' },
    { q: 'Hamsters without an SCN are given an SCN transplant from a mutant hamster with a 20-hour rhythm. Their restored rhythm has a period of about 20 h. This shows that…', choices: ['the SCN sets the period of the whole animal\'s rhythm', 'any brain tissue restores rhythms', 'the period is set by the light cycle', 'the recipient\'s genes set the period'], a: 0, why: 'The rhythm takes the period of the donor tissue, so the transplanted SCN itself is the pacemaker.' },
    { q: 'A clock whose period shortened by half with every 10 °C of warming would keep time just as well.', a: false, why: 'Its time would depend on the weather. Temperature compensation — Q₁₀ close to 1 — is one of the defining properties of a true biological clock.' },
    { q: 'A free-running rhythm has a period of 24.5 h. After how many days has it drifted by 12 h?', answer: 24, why: '12 h ÷ 0.5 h per day = 24 days.' }
  ],
  problems: [
    { q: 'A mouse has a free-running period of 23.5 h. By how many hours has its activity moved earlier after 20 days in constant darkness?', answer: 10, unit: 'h', tol: 0.01, steps: ['$D = 20 \\times (23.5 - 24) = -10$ h: ten hours earlier.'] },
    { q: 'A fungus has a free-running period of 25.0 h at 15 °C and 24.0 h at 25 °C. What is the Q₁₀ of its clock?', answer: 1.04, tol: 0.02, steps: ['$Q_{10} = (25.0/24.0)^{10/10} = 1.042$ — close to 1, as for a temperature-compensated clock.'] },
    { q: 'A traveller crosses 9 time zones eastward. At about 1 h a day, how many days does the clock need to catch up?', answer: 9, unit: 'day', tol: 0.01, steps: ['$d = 9/1 = 9$ days.'] }
  ],
  applications: [
    'Chronotherapy: some medicines and cancer treatments work better, or cause fewer side effects, at particular times of day — a question for the treating team, not for self-adjustment.',
    'Lighting design for homes, hospitals and spacecraft: bright, blue-rich light by day and dim, warm light in the evening support the clock.',
    'Farming: poultry lighting schedules and greenhouse day lengths control laying and flowering.',
    'Shift rosters that rotate forward (morning, then evening, then night) are easier on the clock than backward rotations.'
  ],
  history: 'De Mairan\'s mimosa (1729) was the first evidence of an internal clock. Erwin Bünning showed in the 1930s that the period is inherited in bean plants. Colin Pittendrigh and Jürgen Aschoff worked out the rules of entrainment in the 1950s and 1960s, Aschoff and Rütger Wever keeping volunteers for weeks in an underground bunker in Bavaria. Konopka and Benzer found the period gene in 1971, and Jeffrey Hall, Michael Rosbash and Michael Young shared the 2017 Nobel Prize for unravelling the molecular loop.',
  sim: 'beh-clock'
}

);
