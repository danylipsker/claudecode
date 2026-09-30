/* The Puzzle Cabinet · data/ancient-riddles.js
 * The oldest riddles we have, retold in our own words from their sources.
 * (The ancient texts are old; every retelling here is new, so no modern translation is copied.) */
Cabinet.family({
  id: 'ancient-riddles', engine: 'question', cat: 'riddles', name: 'The oldest riddles', order: 1,
  blurb: 'Riddles from myth, scripture and the first books: the Sphinx, Samson, the Exeter Book and more.',
  origin: { year: -1000, who: 'Many hands', note: 'Riddles are older than writing; the first written ones come from Sumer, the Hebrew Bible and Greek poetry.' },
  concepts: ['lateral']
}, [
  {
    id: 'riddle-sphinx', title: 'The Riddle of the Sphinx', diff: 1, year: -470,
    source: 'Greek myth of Oedipus and the Sphinx of Thebes; the riddle is given by Athenaeus and the scholia to Euripides.',
    text: 'On a rock outside Thebes sits the Sphinx, and she eats every traveller who cannot answer her:\n\n*What goes on four feet in the morning, on two at noon, and on three in the evening?*',
    hints: ['Morning, noon and evening are not times of one day.', 'Think of a whole life.'],
    explain: 'A **human being**: crawling on all fours as a baby, walking on two legs as an adult, and leaning on a stick — a third foot — in old age. Oedipus answered, and the Sphinx threw herself from her rock.',
    data: { answer: { text: ['a human', 'human', 'man', 'a man', 'person', 'human being', 'people', 'mankind', 'humans'] }, glyph: '𓃬' }
  },
  {
    id: 'riddle-samson', title: 'Samson\'s Wedding Riddle', diff: 3, year: -1000,
    source: 'The Book of Judges, chapter 14.',
    text: 'At his wedding feast Samson wagers thirty linen garments that his guests cannot answer this in seven days:\n\n*Out of the eater came something to eat; out of the strong came something sweet.*\n\nOn his way to the wedding Samson had passed the body of a lion he had killed, and seen something in it.',
    hints: ['The eater and the strong one are the same animal.', 'Something sweet that bees make.'],
    explain: 'Bees had made a hive in the lion\'s carcass: **honey** from a lion. The guests only answered by coaxing the secret out of Samson\'s bride — and Samson told them that if they had not ploughed with his heifer they would not have found out his riddle.',
    data: { answer: { text: ['honey', 'honey from the lion', 'honey in a lion', 'bees honey', 'honeycomb'] }, glyph: '🍯' }
  },
  {
    id: 'riddle-rhind-79', title: 'Seven Houses', diff: 2, year: -1650,
    source: 'Rhind Mathematical Papyrus, problem 79 (copied by the scribe Ahmes about 1650 BC).',
    text: 'In an inventory from ancient Egypt: there are 7 houses; in each house 7 cats; each cat catches 7 mice; each mouse would have eaten 7 ears of spelt; each ear would have given 7 hekat of grain.\n\nHow many things are counted altogether — houses, cats, mice, ears and hekat?',
    hints: ['Each line is seven times the one before: 7, 49, …', 'Add 7 + 49 + 343 + 2401 + 16807.'],
    explain: '7 + 49 + 343 + 2401 + 16807 = **19607**. The scribe got it by a quicker route: 2801 × 7, since 2801 = 1 + 7 + 49 + 343 + 2401. The English rhyme about the man going to St Ives with seven wives, seven sacks, seven cats and seven kits is the same puzzle 3,000 years later — with a trick answer.',
    data: { answer: { num: 19607 }, traps: [{ match: 16807, msg: 'That is just the grain. Add the houses, cats, mice and ears too.' }], glyph: '7' },
    concepts: ['geometric-series']
  },

  /* ---------- the Bible and the Jewish tradition ---------- */
  {
    id: 'anc-agur-leech', title: 'The Daughters Who Say Give', diff: 3, year: -400,
    source: 'The Book of Proverbs, chapter 30 (the words of Agur).',
    text: 'The wise man Agur, in the last chapter of Proverbs, collects things that are never satisfied. He opens with a riddle in one line:\n\n*It has two daughters, and they cry: Give! Give!*\n\nWhat is the mother?',
    hints: ['The daughters are two mouths, or two suckers, that only ever ask for more.', 'It lives in ponds and fastens on the skin of anyone who wades in.'],
    explain: 'A **leech**: two suckers, always pleading for more blood. (Some scholars read the Hebrew word differently, but the leech is the reading that has stuck.) Agur then lists four things that never say “Enough”: the grave, the childless womb, the thirsty earth and fire.',
    data: { answer: { text: ['a leech', 'leech', 'horseleech', 'the leech', 'bloodsucker', 'vampire'] }, glyph: '🩸' },
    concepts: ['lateral'], links: ['anc-agur-four']
  },
  {
    id: 'anc-agur-four', title: 'The Way Without a Trace', diff: 4, year: -400,
    source: 'The Book of Proverbs, chapter 30, verses 18–19.',
    text: 'A little further on, Agur admits that four things are beyond him:\n\n*The way of an eagle in the sky; the way of a snake on a rock; the way of a ship in the heart of the sea; and the way of a man with a young woman.*\n\nWhat do the first three share that makes their “way” so mysterious?',
    hints: ['Try following each of them the next morning.', 'Look for what is missing after each has passed by.'],
    explain: 'They **leave no track behind them**. The air closes behind the eagle, the hot rock keeps no mark of the snake, and the sea smooths over the wake of the ship. Agur sets the fourth beside them for the same reason: a love that leaves nothing you can measure.',
    data: {
      answer: { choice: 0, choices: ['They leave no track behind them', 'They are all faster than a man can run', 'They are all dangerous to travellers', 'They all belong to the gods alone'] },
      traps: [{ match: 1, msg: 'A snake on a rock is not so very fast.' }, { match: 2, msg: 'A ship is not dangerous in itself. What do the three leave when they pass?' }],
      glyph: '🦅'
    },
    links: ['anc-agur-leech']
  },
  {
    id: 'anc-sheba-nine', title: 'Nine Go Out', diff: 3,
    source: 'A riddle of the Queen of Sheba in the later Jewish retellings of her visit to King Solomon (the Aramaic Targum Sheni to Esther and the Midrash on Proverbs, medieval).',
    text: 'The Bible says only that the Queen of Sheba came to test Solomon “with hard questions”. Later storytellers supplied them. One of them:\n\n*Nine go out, two pour, and one drinks.*\n\nWhat is she talking about?',
    hints: ['Think of the months of something, and of what comes in pairs.', 'Who drinks? Someone who has just arrived.'],
    explain: 'A **baby**: the nine months before birth, the mother’s two breasts, and the one child who feeds. Solomon answered at once — as the story tells it, he always did.',
    data: { answer: { text: ['a baby', 'baby', 'a child', 'child', 'infant', 'pregnancy', 'birth', 'nursing', 'breastfeeding', 'breast feeding', 'a nursing baby'] }, glyph: '9·2·1' },
    concepts: ['lateral'], links: ['anc-sheba-flowers', 'anc-sheba-sea']
  },
  {
    id: 'anc-sheba-flowers', title: 'Real Flowers, Made Flowers', diff: 3,
    source: 'A test of the Queen of Sheba in the later Jewish retellings of her visit to King Solomon (the Targum Sheni to Esther and later midrash, medieval).',
    text: 'In the storytellers’ version, the Queen of Sheba sends Solomon a test. Two bouquets are set at the far end of the hall: one of real blossoms, one of flowers so cleverly made that no eye can tell them apart. Solomon may not go near them, touch them or smell them.\n\nHe calls for something to be done — and settles it in a minute. What?',
    hints: ['He needs a judge who is much better at flowers than any person.', 'Open a window, and see who comes in.'],
    explain: '**Bees.** Solomon had the windows opened, and the bees flew straight to the real flowers. The nose of a bee is a far better judge of a flower than the eye of a king. It is a small lesson in lateral thinking: when you cannot do the test yourself, look for someone who can.',
    data: { answer: { text: ['bees', 'bee', 'let in bees', 'let bees in', 'a bee', 'honeybees', 'a swarm of bees', 'insects', 'let in insects'] }, glyph: '🐝' },
    concepts: ['lateral'], links: ['anc-sheba-nine', 'anc-sheba-sea']
  },
  {
    id: 'anc-sheba-sea', title: 'The Land That Saw the Sun Once', diff: 4,
    source: 'A riddle of the Queen of Sheba in the later Jewish retellings of her visit to King Solomon (the Targum Sheni to Esther, medieval).',
    text: 'Another of the queen’s riddles, as the storytellers tell them:\n\n*What is the land that saw the sun only once, and never again?*',
    hints: ['A land, not a country. Something that lay covered — and was uncovered only for a short while.', 'Recall the crossing of Israel out of Egypt in the Book of Exodus.'],
    explain: 'The **bed of the Red Sea**. When the waters were parted for the Israelites the sea floor lay dry under the sun for the first time, and then the waters closed over it again. Solomon, of course, knew his Exodus.',
    data: {
      answer: { choice: 0, choices: ['The floor of the Red Sea, dry while Israel crossed', 'A cave in the mountains of Sinai', 'The Arabian desert at midnight', 'The far side of the moon'] },
      traps: [{ match: 1, msg: 'A cave never sees the sun at all.' }, { match: 2, msg: 'A desert sees the sun every day.' }],
      glyph: '🌊'
    },
    links: ['anc-sheba-nine', 'anc-sheba-flowers']
  },
  {
    id: 'anc-talmud-mule-salt', title: 'Salt That Loses Its Taste', diff: 3,
    source: 'Babylonian Talmud, tractate Bekhorot 8b (the sages of Athens question Rabbi Joshua ben Hananiah; compiled about AD 500).',
    text: 'The Talmud tells of the wise men of Athens who set a string of trick questions to Rabbi Joshua ben Hananiah, to see whether a Jewish sage could keep up with a Greek one. One of them:\n\n*If salt goes bad, with what do you salt it?*\n\nThe rabbi answered instantly, and left them with nothing to reply. Which answer was it?',
    hints: ['A trick question deserves a trick answer: give something that is just as impossible as the situation.', 'Think of something that mules cannot do.'],
    explain: 'He said: “With the afterbirth of a mule.” The Athenians objected: a mule does not give birth, so it has no afterbirth. The rabbi replied: “And does salt go bad?” If salt cannot spoil, the question has no answer, and he showed it by giving an answer that could not exist either.',
    data: {
      answer: { choice: 0, choices: ['With the afterbirth of a mule', 'With more salt', 'With sea water', 'It cannot be done'] },
      traps: [{ match: 1, msg: 'That is what a sensible person would say — but the Athenians were not asking a sensible question.' }, { match: 3, msg: 'True, but the rabbi did not stop at true. He answered the trick with a trick.' }],
      glyph: '🧂'
    },
    concepts: ['lateral']
  },
  {
    id: 'anc-ecclesiastes-age', title: 'The House in Winter', diff: 4, year: -250,
    source: 'The Book of Ecclesiastes (Qoheleth), chapter 12, verses 3–5 (an allegory that Jewish and Christian readers have long taken as a riddle of old age).',
    text: 'The Preacher closes his book with a picture of a great house falling into ruin: *the keepers of the house tremble; the strong men are bent; the grinders stop because they are few; those who look through the windows grow dim; the doors to the street are shut; the sound of the mill is low, and one wakes at the sound of a bird.*\n\nWhat is the house?',
    hints: ['The keepers, strong men, grinders and window-watchers are all parts of one body.', 'Hands, legs, teeth and eyes: the house is a person, at what time of life?'],
    explain: 'It is **old age**, and the house is the body: trembling hands (the keepers), stooping legs (the strong men), fewer teeth (the grinders), failing eyes (the windows), deafness (the low sound of the mill) and light sleep (waking at a bird). It is the most poetic riddle in the Bible.',
    data: { answer: { text: ['old age', 'a person in old age', 'getting old', 'the body in old age', 'ageing', 'aging', 'growing old', 'an old person', 'the human body', 'the body'] }, glyph: '🏚' },
    concepts: ['lateral'], links: ['riddle-sphinx']
  },

  /* ---------- Greece ---------- */
  {
    id: 'anc-cleobulus-year', title: 'Cleobulus and the Twelve Sons', diff: 2, year: -600,
    source: 'Attributed to Cleobulus of Lindos, one of the Seven Sages of Greece (about 600 BC); preserved in Diogenes Laertius, *Lives of the Eminent Philosophers* 1.91, and in the Greek Anthology, book 14.',
    text: 'There is one father, and he has twelve sons. Each son has thirty daughters, and the daughters do not look alike: half are fair and half are dark. Not one of them stays for long; and yet, they say, not one of them dies.\n\n*Who is the father?*',
    hints: ['The sons and daughters are not people. Count what twelve times thirty comes to.', 'Fair and dark, coming and going without end: the day and the night.'],
    explain: 'The father is the **year**. His twelve sons are the months, and the thirty daughters of each are the days, each with a bright half (day) and a dark half (night). Each comes and goes, yet they return year after year. A thousand years earlier a poet of India had asked almost the same question with a wheel.',
    data: {
      answer: { text: ['a year', 'year', 'the year', 'one year', 'a calendar year'] },
      traps: [{ match: ['month', 'months', 'a month', 'the months'], msg: 'The twelve sons are the months — but who is their father?' }, { match: ['day', 'days', 'a day', 'night', 'day and night'], msg: 'Those are the daughters. Who is the father of the whole family?' }],
      glyph: '12'
    },
    concepts: ['lateral'], links: ['anc-rigveda-wheel']
  },
  {
    id: 'anc-homer-lice', title: 'Homer and the Fishing Boys', diff: 2, year: 150,
    source: 'The *Contest of Homer and Hesiod* and the *Life of Homer* ascribed to Herodotus (Roman imperial period, about the 2nd century AD).',
    text: 'The old legend says that the blind Homer, walking along the shore of the island of Ios, met some boys sitting by their boats. He asked whether they had caught anything. The boys, who had caught nothing, answered with a riddle:\n\n*What we caught, we left behind. What we did not catch, we carry with us.*\n\nWhat were they carrying?',
    hints: ['They had been sitting on the sand for a while, and not only fishing.', 'A pest that lives in hair and clothes.'],
    explain: '**Lice.** The bored boys had been picking the lice from their clothes and leaving the ones they caught on the ground; the ones they had missed were still with them. According to the story Homer could not solve it, and died of vexation soon after. It is a nasty tale about a very great poet, and almost certainly untrue.',
    data: {
      answer: { text: ['lice', 'louse', 'head lice', 'nits', 'fleas', 'flea'] },
      traps: [{ match: ['fish', 'fishes', 'a fish'], msg: 'They caught no fish — that is why they were bored.' }],
      glyph: '🐟'
    },
    concepts: ['lateral']
  },
  {
    id: 'anc-antiphanes-letter', title: 'The Mother with Voiceless Children', diff: 3, year: -350,
    source: 'A riddle from the comedy *Sappho* by Antiphanes (4th century BC), quoted by Athenaeus, *Deipnosophistae* book 10.',
    text: 'In a Greek comedy the poet Sappho is made to pose riddles. This is her best:\n\n*There is a woman who carries her babies safe inside her. The babies have no voice, yet they call out across the sea and over the whole land, to anyone she chooses; and someone who is not even there can hear them — and a deaf man too may hear.*\n\nWhat is she?',
    hints: ['The voiceless babies are marks; they “speak” only to someone who looks.', 'The traveller across the sea carries her; she can be sealed.'],
    explain: 'A **letter** (an epistle). The “babies” are the letters of the alphabet, silent in themselves, yet they can carry a message across a sea to someone who is nowhere near, and a deaf man can “hear” them by reading.',
    data: { answer: { text: ['a letter', 'letter', 'epistle', 'a written letter', 'a message', 'writing', 'a written message', 'a dispatch', 'letters'] }, glyph: '✉' },
    concepts: ['lateral']
  },
  {
    id: 'anc-cupping-glass', title: 'Bronze Glued with Fire', diff: 4, year: -335,
    source: 'Aristotle, *Poetics* 22 (about 335 BC); later writers give the riddle to the poet Cleobulina, daughter of Cleobulus.',
    text: 'Aristotle says the essence of a riddle is to describe a real thing in words that seem impossible, and he gives this as an example:\n\n*I saw a man who glued bronze onto another man with fire.*\n\nWhat was going on?',
    hints: ['Neither man was a smith, and neither of them was hurt by the fire; one of them was a doctor.', 'The bronze is a small vessel; the fire is used for a moment, then thrown away.'],
    explain: 'A doctor was **cupping** a patient. He warmed a bronze cup with a flame and pressed it to the skin; as the air inside cooled it made a partial vacuum and the cup held fast, drawing blood to the surface. So bronze was “glued” to a man with fire. Notice that every word of the riddle is true — that is what makes it a good riddle.',
    data: {
      answer: { choice: 0, choices: ['A doctor fixing a heated bronze cup to a patient’s skin (cupping)', 'A smith riveting armour onto a soldier', 'A sculptor casting a bronze statue of a man', 'A soldier tempering his sword in a fire'] },
      traps: [{ match: 1, msg: 'Armour is fastened with straps, and nobody is glued.' }, { match: 2, msg: 'A statue is not a man, and nothing is glued in the riddle.' }],
      glyph: '🔥'
    },
    concepts: ['lateral']
  },
  {
    id: 'anc-delphi-wooden-wall', title: 'The Wall of Wood', diff: 2, year: -430,
    source: 'Herodotus, *Histories* 7.141–143 (the oracle of Delphi to the Athenians before the Persian invasion of 480 BC).',
    text: 'Xerxes of Persia is marching on Greece. The Athenians send to Delphi, and the priestess tells them that nearly everything will fall; but *Zeus grants Athena a wall of wood, which alone will not be taken, and will save you and your children.*\n\nThe elders say the wall of wood is the old thorn hedge around the Acropolis. The general Themistocles says they are wrong. What is the wall of wood?',
    hints: ['A wall that can move, and that does not need to be defended from inside.', 'Athens was a sea power, with a new fleet in the harbour.'],
    explain: 'The **ships**. Themistocles persuaded Athens to leave the city, board the fleet and fight at sea, and in 480 BC the Greek ships won the battle of Salamis. The hedge on the Acropolis was burned by the Persians. The oracle was true in either reading; the difference was which one you chose to believe.',
    data: {
      answer: { text: ['ships', 'the ships', 'the fleet', 'fleet', 'wooden ships', 'warships', 'a fleet', 'navy', 'the navy', 'boats', 'ship', 'triremes'] },
      traps: [{ match: ['hedge', 'the hedge', 'a hedge', 'the acropolis', 'acropolis', 'palisade', 'fence'], msg: 'That is what the elders thought. Themistocles thought of something a good deal more useful.' }],
      glyph: '⛵'
    },
    concepts: ['lateral'], links: ['anc-croesus-empire']
  },
  {
    id: 'anc-croesus-empire', title: 'The Great Empire', diff: 1, year: -430,
    source: 'Herodotus, *Histories* 1.53 and 1.91 (Croesus of Lydia and the oracle of Delphi, about 546 BC).',
    text: 'Croesus, the fabulously rich king of Lydia, wonders whether to go to war with the growing Persian empire. He sends splendid gifts to Delphi and asks the oracle. The answer:\n\n*If Croesus crosses the river Halys, he will destroy a great empire.*\n\nCroesus is delighted, crosses the river, and — an empire is destroyed. Whose?',
    hints: ['The oracle did not say whose empire it would be.', 'It was the one that stood in the way of the Persians.'],
    explain: 'His **own** — the Lydian kingdom fell to Cyrus of Persia. When Croesus complained, Delphi answered that he had never asked *which* empire, and that he should have. Every clause of an oracle should be read for what it leaves out.',
    data: {
      answer: { text: ['his own', 'his own empire', 'his own kingdom', 'lydia', 'the lydian empire', 'croesus', 'the kingdom of lydia', 'his own land'] },
      traps: [{ match: ['persia', 'the persian empire', 'persian', 'cyrus', 'the persians'], msg: 'That is what he hoped. What actually happened to Croesus?' }],
      glyph: '👑'
    },
    concepts: ['lateral'], links: ['anc-delphi-wooden-wall', 'anc-herodotus-scythians']
  },
  {
    id: 'anc-alexander-living-dead', title: 'The Living and the Dead', diff: 2, year: 100,
    source: 'Plutarch, *Life of Alexander* 64 (the questions of Alexander to the Indian sages, about AD 100).',
    text: 'Plutarch tells how Alexander the Great met ten wise men of India, whom the Greeks called the “naked philosophers”. He put hard questions to them and warned that whoever answered worst would pay with his life. The first question:\n\n*Which are more numerous, the living or the dead?*',
    hints: ['The sage answered as a logician, not as a historian.', 'What is the status of someone who is dead?'],
    explain: 'The **living**, said the sage, “since the dead are no more.” It is a fine bit of logic: the dead do not exist, so there is nothing to count. (Alexander was not entirely satisfied, and the sages lived to answer more questions.)',
    data: {
      answer: { choice: 0, choices: ['The living: the dead no longer exist', 'The dead: there have been so many more of them', 'They are equal in number', 'No one can know'] },
      traps: [{ match: 1, msg: 'It is a good answer for a historian. The sage thought about the word “are”.' }],
      glyph: '☠'
    },
    concepts: ['lateral'], links: ['anc-alexander-day-night']
  },
  {
    id: 'anc-alexander-day-night', title: 'Night or Day First', diff: 3, year: 100,
    source: 'Plutarch, *Life of Alexander* 64 (the questions of Alexander to the Indian sages, about AD 100).',
    text: 'Another of Alexander’s questions to the sages of India:\n\n*Which was made first, the day or the night?*\n\nThe sage’s answer was short, and Alexander was surprised by it.',
    hints: ['The answer was “strange”, and the sage said so himself.', 'The difference is a matter of counting how many days there were.'],
    explain: '“**Day — by one day.**” The king was startled, and the sage told him that hard questions must have hard answers. (Genesis, for what it is worth, counts the evening first: “there was evening and there was morning, one day”.)',
    data: {
      answer: { choice: 0, choices: ['Day, by one day', 'Night, by one day', 'They were made at the same moment', 'Neither: the sun made them both'] },
      traps: [{ match: 1, msg: 'A natural guess — but that is not what the sage said, and Alexander would not have been surprised.' }],
      glyph: '☀'
    },
    concepts: ['lateral'], links: ['anc-alexander-living-dead']
  },
  {
    id: 'anc-herodotus-scythians', title: 'The Scythian Gifts', diff: 3, year: -430,
    source: 'Herodotus, *Histories* 4.131–132 (the Scythians and Darius of Persia, about 512 BC).',
    text: 'Darius of Persia has chased the Scythian nomads across the steppe for weeks without once bringing them to battle. One day a herald arrives with a strange present: **a bird, a mouse, a frog and five arrows.** Darius is pleased: the Scythians are surrendering their land and water. Gobryas, one of his officers, is not so sure. What is the gift really saying?',
    hints: ['Each animal lives in a different place: the sky, the ground, the water.', 'And the arrows are for the Persians.'],
    explain: 'Gobryas read it correctly: “Unless you turn into birds and fly away, or into mice and hide in the ground, or into frogs and leap into the lakes, you will never get home — you will be shot by these arrows.” The Persians soon decided it was time to go.',
    data: {
      answer: { choice: 1, choices: ['A surrender: the Scythians are giving up their land, water and sky', 'A threat: unless you can fly, burrow or swim away, you will be shot', 'A gift of good luck for the journey home', 'A challenge to a duel of five archers'] },
      traps: [{ match: 0, msg: 'That was what Darius thought — and a general who agreed with him was very nearly disastrous.' }],
      glyph: '🏹'
    },
    concepts: ['lateral'], links: ['anc-croesus-empire', 'anc-herodotus-corn']
  },
  {
    id: 'anc-herodotus-corn', title: 'The Tallest Ears of Corn', diff: 3, year: -430,
    source: 'Herodotus, *Histories* 5.92 (Periander of Corinth and Thrasybulus of Miletus, about 600 BC).',
    text: 'Periander, the new tyrant of Corinth, sends a messenger to Thrasybulus, tyrant of Miletus, to ask how best to keep power. Thrasybulus says nothing. He takes the messenger for a walk through a field of corn, and as they go, he cuts off every ear that grows taller than the rest. Then he sends the man home without a word.\n\nPeriander, when he hears about the walk, understands the whole reply. What is it?',
    hints: ['The corn is a metaphor for the citizens of a city.', 'What does a ruler do who does not want anyone to stand above him?'],
    explain: 'The advice is: **remove the most outstanding citizens**. The tallest ears are the leading men, who might rival the tyrant. Periander understood at once and began to have the notables of Corinth put to death. Herodotus tells the story as an example of a message that needs no words.',
    data: {
      answer: { choice: 0, choices: ['Get rid of every leading citizen who stands out above the rest', 'Grow more corn than your neighbours', 'Trust nobody who carries a knife', 'Rule gently, and cut nothing'] },
      traps: [{ match: 1, msg: 'The corn is not the point — the cutting is.' }, { match: 3, msg: 'Just the opposite: it was a lesson in ruthlessness.' }],
      glyph: '🌾'
    },
    concepts: ['lateral'], links: ['anc-herodotus-scythians']
  },
  {
    id: 'anc-thales-wisest', title: 'The Wisest Thing There Is', diff: 3, year: 250,
    source: 'Diogenes Laertius, *Lives of the Eminent Philosophers* 1.35 (the sayings of Thales of Miletus, about 600 BC; recorded about AD 250).',
    text: 'The first Greek philosopher, Thales of Miletus, was said to be a great man for short answers. Asked what was the oldest of all things, he said “God, for he was never born”; the most beautiful, “the universe”; the swiftest, “the mind”; the strongest, “necessity”.\n\nAnd the **wisest** of all things?',
    hints: ['Wisdom is learning what is true. What finds out every secret in the end?', 'It is on every clock.'],
    explain: '**Time**, said Thales, “for it discovers everything.” Secrets, crimes, mistakes and truths all come out in the end, and time is what they come out in.',
    data: {
      answer: { choice: 1, choices: ['Death', 'Time', 'The sea', 'The mind'] },
      traps: [{ match: 3, msg: 'Thales gave the mind another prize: it was the swiftest of all things.' }],
      glyph: '⏳'
    }
  },

  /* ---------- Rome and the first Latin riddle books ---------- */
  {
    id: 'anc-symphosius-egg', title: 'The House Without a Door', diff: 1, year: 400,
    source: 'After Symphosius, *Aenigmata* (about AD 400), his riddle of the egg. Symphosius wrote one hundred three-line riddles in Latin, each with a title.',
    text: 'Symphosius wrote a hundred three-line riddles in Latin, and they became the model for many riddle books after him. Retold in our words, one of them goes:\n\n*I am a small white house with no door and no window. Inside the walls is a golden treasure, and inside the treasure a guest is sleeping, who will one day break the house open from the inside.*\n\nWhat am I?',
    hints: ['Nobody lives in it for long; a bird moves out.', 'It is on your breakfast plate.'],
    explain: 'An **egg**: the white shell is the house, the yolk is the golden treasure, and the chick is the sleeping guest.',
    data: { answer: { text: ['an egg', 'egg', 'hens egg', 'a hens egg', 'a bird’s egg', 'eggs'] }, glyph: '🥚' }
  },
  {
    id: 'anc-symphosius-ice', title: 'Born of Water', diff: 2, year: 400,
    source: 'After Symphosius, *Aenigmata* (about AD 400), his riddle of ice.',
    text: 'Another of Symphosius’s hundred riddles, told again:\n\n*Water is my mother, and I am water’s child. Cold made me, and the sun who warms the rest of the world will unmake me. I am hard as a stone in the morning, and by noon I am a puddle running through your fingers.*\n\nWhat am I?',
    hints: ['Cold is the father; the sun is the enemy.', 'You put me in your drink in summer.'],
    explain: '**Ice**: born of water, hardened by the cold, and turned back into water by warmth. The whole life-story of ice fits in three lines, which is exactly what a good riddle should do.',
    data: {
      answer: { text: ['ice', 'an ice', 'frozen water', 'icicle', 'ice cube', 'an icicle', 'a piece of ice', 'a lump of ice'] },
      traps: [{ match: ['snow', 'snowflake', 'snowflakes'], msg: 'Snow is a close relation, but the riddle says hard as stone.' }, { match: ['water', 'water itself'], msg: 'Water is the mother, not the child.' }],
      glyph: '🧊'
    },
    links: ['anc-symphosius-egg']
  },
  {
    id: 'anc-symphosius-garlic', title: 'The One-Eyed Seller', diff: 3, year: 400,
    source: 'After Symphosius, *Aenigmata* (about AD 400): the riddle of the one-eyed garlic seller.',
    text: 'A third riddle from the book of Symphosius, told again:\n\n*I have only one eye, and I stand in the market, where hundreds of heads lie on my stall. Not one of these heads has an eye at all.*\n\nWhat is he selling?',
    hints: ['The heads are not the heads of animals, and not the heads of people.', 'Each head is divided into cloves, and vampires do not like it.'],
    explain: '**Garlic**: the one-eyed vendor (the riddle is about him) sells heads of garlic — every head has cloves, but not one eye. The joke is in the play on “head”, which needs no translation.',
    data: {
      answer: { text: ['garlic', 'heads of garlic', 'cloves of garlic', 'bulbs of garlic', 'a head of garlic', 'garlics'] },
      traps: [{ match: ['onion', 'onions', 'cabbage', 'cabbages', 'lettuce', 'leeks', 'leek'], msg: 'Close in the kitchen, but this one has cloves — and a smell you remember for a day.' }],
      glyph: '🧄'
    },
    concepts: ['lateral']
  },
  {
    id: 'anc-aldhelm-earth', title: 'The Mother of All', diff: 2, year: 700,
    source: 'After Aldhelm of Malmesbury (died 709), *Aenigmata*, the first of his hundred Latin riddles, on the Earth.',
    text: 'Aldhelm, the abbot of Malmesbury, wrote a hundred riddles in Latin, of which this is the first, and each of the first ones speaks in the first person:\n\n*Everything that lives comes from me, and everything that dies comes home to me. I carry forests and mountains on my back and I never grow tired. The sun makes me green, and the frost turns me grey — and yet the whole sky wheels above me.*\n\nWho am I?',
    hints: ['You are standing on me.', 'Seeds, roots and graves all go into me.'],
    explain: 'The **earth**: mother of all living things and their last home, bearer of forests and hills, green in summer and grey in winter. Aldhelm began his hundred riddles with the biggest thing there is, and worked his way down to a fountain pen.',
    data: { answer: { text: ['earth', 'the earth', 'ground', 'the ground', 'soil', 'land', 'mother earth', 'terra', 'the world', 'the land'] }, glyph: '🌍' }
  },

  /* ---------- the Exeter Book ---------- */
  {
    id: 'anc-exeter-key', title: 'At My Master’s Side', diff: 1, year: 975,
    source: 'After a riddle of the Exeter Book (Old English verse, copied about 975): the well-known riddle of the key.',
    text: 'The Exeter Book is a huge manuscript of Old English poetry, copied about 975, which holds nearly a hundred riddles — none with its answer written in. This one is told (a little less cheekily than the original) in our words:\n\n*I hang at my master’s side under his cloak. I am small, stiff and hard, with a hole in my head, and I know my work well: when he is ready, I open up what has been shut.*\n\nWhat am I?',
    hints: ['You have one in your pocket.', 'What opens what is shut, and hangs from a belt?'],
    explain: 'A **key**. The Old English original is full of double meanings, which its readers have been happily pointing out ever since — but the plain answer has never been in doubt.',
    data: { answer: { text: ['a key', 'key', 'door key', 'keys', 'the key'] }, glyph: '🗝' }
  },
  {
    id: 'anc-exeter-onion', title: 'The Garden Guest', diff: 1, year: 975,
    source: 'After a riddle of the Exeter Book (Old English verse, copied about 975): the riddle solved as “onion”.',
    text: 'From the Exeter Book, rendered freely:\n\n*I am a strange creature that grows in the ground. I harm no one — unless someone tries to cut me up, and then I make even the toughest cook weep. Nobody has ever hit me, and yet I cause tears.*\n\nWhat am I?',
    hints: ['You will find me in the kitchen and the vegetable patch.', 'The tears are the point.'],
    explain: 'An **onion**. (The original riddle is notoriously double-edged, and scholars have enjoyed pointing that out; the plain answer is the one in the kitchen.)',
    data: { answer: { text: ['an onion', 'onion', 'onions', 'the onion'] }, glyph: '🧅' }
  },
  {
    id: 'anc-exeter-storm', title: 'No Hands, No Feet', diff: 2, year: 975,
    source: 'After a riddle of the Exeter Book (Old English verse, copied about 975): the storm riddles at the start of the collection.',
    text: 'The opening riddles of the Exeter Book are about the weather. Retold in our words, one says:\n\n*I have neither hands nor feet, yet I can tear down towers. I lash the sea into hills, I drive the clouds across the sky, and sometimes I roar and sometimes I whisper, and no rope or wall has ever held me.*\n\nWhat am I?',
    hints: ['You cannot hold me, and you can hear me.', 'Sailors dread me and windmills need me.'],
    explain: 'The **wind**, or the storm it becomes — scholars have accepted both. The riddle says nothing that is not literally true, which is why it feels so powerful when read aloud.',
    data: { answer: { text: ['wind', 'the wind', 'a storm', 'storm', 'the storm', 'gale', 'a gale', 'tempest', 'hurricane', 'a tempest', 'storm wind'] }, glyph: '🌪' }
  },
  {
    id: 'anc-exeter-cuckoo', title: 'Brought Up by Strangers', diff: 2, year: 975,
    source: 'After a riddle of the Exeter Book (Old English verse, copied about 975): the riddle solved as “cuckoo”.',
    text: 'A riddle of the Exeter Book, freely told:\n\n*My parents left me lifeless on the ground, and a kind stranger warmed me and fed me as her own. When I grew, I was too big for the nest and I crowded out my foster brothers. Now everyone calls me by my own song.*\n\nWhat am I?',
    hints: ['A bird, and a lazy parent.', 'You may hear me in the spring; my name is my two-note song.'],
    explain: 'The **cuckoo**, which lays its eggs in other birds’ nests and lets the foster parents raise the chick. The young cuckoo hatches early and pushes the other eggs out. The Anglo-Saxon poet knew all this a thousand years ago.',
    data: {
      answer: { text: ['cuckoo', 'a cuckoo', 'the cuckoo'] },
      traps: [{ match: ['bird', 'a bird', 'sparrow', 'a sparrow'], msg: 'Yes, a bird — which one has a name that is also its song?' }],
      glyph: '🐦'
    }
  },
  {
    id: 'anc-exeter-swan', title: 'The Singing Wings', diff: 2, year: 975,
    source: 'After a riddle of the Exeter Book (Old English verse, copied about 975): the riddle solved as “swan”.',
    text: 'An Exeter Book riddle, told again in our own words:\n\n*On the earth and on the water I say nothing at all. But lift me above the roofs, into the sky, and my feathers sing out loud and clear. I am a wanderer between air and earth, and my song is not in my throat.*\n\nWhat am I?',
    hints: ['A big white bird of lakes and rivers.', 'Mute on the ground, and yet the beat of its wings can be heard a long way away.'],
    explain: 'A **swan**: on the water it is silent, and in flight its wing-feathers make a strong humming, singing sound — it is the wings that sing, not the bird. (The mute swan is named for being so quiet on the water; its wingbeats make a loud, throbbing hum in flight.)',
    data: {
      answer: { text: ['swan', 'a swan', 'the swan', 'a mute swan', 'swans'] },
      traps: [{ match: ['bird', 'a bird', 'goose', 'a goose', 'duck', 'a duck', 'eagle', 'a eagle', 'heron'], msg: 'A bird, yes — but which one is silent on the water and white as snow?' }],
      glyph: '🦢'
    },
    links: ['anc-exeter-cuckoo']
  },
  {
    id: 'anc-exeter-bookworm', title: 'The Thief in the Dark', diff: 3, year: 975,
    source: 'After Exeter Book riddle 47 (Old English verse, copied about 975): the bookworm.',
    text: 'One of the best-loved Old English riddles was probably written by a monk who had opened a favourite book and found it eaten. Retold freely:\n\n*Something crept into the library at night and ate the words: the songs of the poets, the sayings of the wise, and the very page on which they were written. The thief swallowed it all, and was not one whit wiser.*\n\nWhat was the thief?',
    hints: ['It is small, it feeds on parchment and glue, and it is not a mouse.', 'A grub that lives among old books.'],
    explain: 'A **bookworm** (in the real world, the larva of a moth or a beetle, which bores into the bindings of old books). The last line is the best: it ate all that wisdom and remained exactly as ignorant as before.',
    data: {
      answer: { text: ['bookworm', 'a bookworm', 'book worm', 'a moth', 'moth', 'a worm', 'worm', 'moth larva', 'woodworm', 'a book worm', 'silverfish', 'bookworms'] },
      traps: [{ match: ['mouse', 'a mouse', 'rat', 'a rat', 'mice'], msg: 'A mouse might nibble a page — but this thief was in the words, and the words themselves went.' }],
      glyph: '📖'
    },
    links: ['anc-exeter-book']
  },
  {
    id: 'anc-exeter-book', title: 'From Calf to Gospel', diff: 3, year: 975,
    source: 'After Exeter Book riddle 26 (Old English verse, copied about 975): the Gospel book.',
    text: 'A riddle of the Exeter Book, told again in our words:\n\n*An enemy took my life and my strength. He soaked me in water, took me out and set me in the sun, where my hair fell from me. A knife cut me smooth, and the fingers of a wise man folded me. Then a bird’s wing drew across me and left dark drops, and boards were bound about me, and I was covered in gold.*\n\n*Now I tell of the Saviour’s glory, and I am worth more than the treasures that hold me.*\n\nWhat am I?',
    hints: ['I began as the hide of an animal.', 'The feather is a quill; the dark drops are ink; the boards are the cover.'],
    explain: 'A **book** — a Gospel book, or Bible. The riddle tells how parchment is made: the calf killed, its hide soaked, scraped and dried in the sun, cut smooth with a knife, written on with a quill and ink, bound in boards and adorned with gold. Books were so precious that they were stories of their own.',
    data: {
      answer: { text: ['a book', 'book', 'bible', 'the bible', 'gospel', 'gospel book', 'a gospel book', 'a bible', 'holy book', 'manuscript', 'a manuscript', 'codex', 'psalter', 'the gospels'] },
      traps: [{ match: ['calf', 'a calf', 'cow', 'a cow', 'leather', 'parchment', 'vellum'], msg: 'That is what I began as. What did I become at the end?' }],
      glyph: '📜'
    },
    links: ['anc-exeter-bookworm']
  },
  {
    id: 'anc-exeter-shield', title: 'Wounded by Iron', diff: 4, year: 975,
    source: 'After an Exeter Book riddle (Old English verse, copied about 975): the riddle solved as “shield”.',
    text: 'A riddle of the Exeter Book, told in our words:\n\n*I am alone and wounded: iron has hurt me and swords have scarred me, and I am weary of battle. I have seen many fights and hard men, and never a healer who could mend my wounds; the blows come again every day.*\n\nWhat am I?',
    hints: ['The speaker is an object that is hit on purpose.', 'A warrior holds it and stays alive by it, and it takes the blows for him.'],
    explain: 'A **shield**, hacked by swords and spears for the man who carried it. (Some scholars have argued for a spear or a helmet, but only the shield gets hit from the front by every enemy and never heals.)',
    data: {
      answer: { text: ['a shield', 'shield', 'the shield', 'a warriors shield', 'buckler'] },
      traps: [{ match: ['sword', 'a sword', 'spear', 'a spear', 'helmet', 'a helmet', 'armour', 'armor', 'warrior', 'a warrior'], msg: 'A weapon hits; what is it that gets hit?' }],
      glyph: '🛡'
    }
  },
  {
    id: 'anc-exeter-horn', title: 'Once a Weapon', diff: 4, year: 975,
    source: 'After an Exeter Book riddle (Old English verse, copied about 975): the riddle solved as “horn”.',
    text: 'An Exeter Book riddle in our words:\n\n*I was once a weapon on the head of an animal, and it ripped its way through a hundred fights. Then a craftsman took me, trimmed me and bound me in silver and gold. Now, by turns, I carry a man’s drink to his lips, and, when a warrior puts his mouth to me, I call the whole crowd of men to arms.*\n\nWhat am I?',
    hints: ['An animal’s weapon that grows on its head.', 'Two uses at a feast and a fight: it can hold ale, or be blown.'],
    explain: 'A **horn**: first the horn of a bull or ox, then a drinking horn with silver rims, and also a war-horn that sounds the alarm. It has three lives in one riddle.',
    data: {
      answer: { text: ['a horn', 'horn', 'drinking horn', 'a drinking horn', 'ox horn', 'a war horn', 'war horn', 'the horn', 'bugle'] },
      traps: [{ match: ['tusk', 'a tusk', 'antler', 'antlers', 'an antler', 'a bull', 'bull'], msg: 'That is where it began. What did it become?' }],
      glyph: '📯'
    }
  },

  /* ---------- Alcuin and the Norse riddles ---------- */
  {
    id: 'anc-alcuin-sea', title: 'What Is the Sea?', diff: 1, year: 790,
    source: 'After Alcuin of York, *Disputatio Pippini cum Albino* (Pepin’s dispute with Alcuin, written for Charlemagne’s son about AD 790).',
    text: 'Alcuin of York, the English scholar who taught at Charlemagne’s court, wrote a little schoolbook for the prince Pepin in the form of questions and answers. Pepin asks, “What is the sea?” and Alcuin replies with four titles in a row:\n\n*The road for the daring, the border of the land, the inn of the rivers, the well of the rains.*\n\nWhat is Pepin asking about?',
    hints: ['The rivers all stop here, and the rain starts here.', 'You have to cross it to reach England.'],
    explain: 'The **sea**: the road that only the bold will take, the edge of the land, the lodging where all rivers end, and the source of the rain, since rain is the sea drawn up and sent back. The *Disputatio* is full of definitions like this, which are half riddle and half poetry.',
    data: { answer: { text: ['the sea', 'sea', 'the ocean', 'ocean'] }, glyph: '🌊' },
    links: ['anc-alcuin-tongue', 'anc-alcuin-fire']
  },
  {
    id: 'anc-alcuin-tongue', title: 'The Whip of the Air', diff: 2, year: 790,
    source: 'After Alcuin of York, *Disputatio Pippini cum Albino* (about AD 790).',
    text: 'In the same little schoolbook, Alcuin defines a part of the human body in just four words:\n\n*The whip of the air.*\n\nIt stirs the air into words, it lives behind your teeth, and you are using it right now if you read this aloud.',
    hints: ['It cracks like a whip, and speech is the crack.', 'You have one in your mouth.'],
    explain: 'The **tongue**, which lashes the air into words as a whip lashes it into a crack. (In the same book Alcuin calls writing the guardian of history, and a dream the illusion of the sleeping mind.)',
    data: {
      answer: { text: ['the tongue', 'tongue', 'a tongue', 'human tongue'] },
      traps: [{ match: ['wind', 'the wind', 'lips', 'the lips', 'mouth', 'the mouth', 'voice', 'the voice', 'breath'], msg: 'Nearer — think of the thing that does the whipping, inside the mouth.' }],
      glyph: '👅'
    },
    links: ['anc-alcuin-sea']
  },
  {
    id: 'anc-alcuin-fire', title: 'The Dead Give Birth', diff: 3, year: 790,
    source: 'After Alcuin of York, *Disputatio Pippini cum Albino* (about AD 790): the riddle of the dead and the living.',
    text: 'In the second half of the *Disputatio*, prince Pepin puts a riddle to his teacher. Alcuin poses it in the first person:\n\n*I saw the dead give birth to the living, and the breath of the living devoured the dead.*\n\nWhat was he watching?',
    hints: ['The “dead” is something once alive that has been cut and dried.', 'A spark is born; then you blow on it.'],
    explain: '**Fire**: two dry sticks rubbed together (dead wood) give birth to a live spark, and the living flame, fed by the breath that blows on it, then devours the dead wood. The riddle is a small tour of how the first people made fire.',
    data: {
      answer: { text: ['fire', 'a fire', 'flame', 'a flame', 'fire from wood', 'lighting a fire', 'making fire', 'kindling', 'a campfire', 'a spark'] },
      traps: [{ match: ['wood', 'a tree', 'tree', 'smoke', 'ashes', 'ash'], msg: 'That is what dies in the riddle. What lives, and eats it?' }],
      glyph: '🔥'
    },
    links: ['anc-alcuin-sea']
  },
  {
    id: 'anc-norse-sleipnir', title: 'Ten Feet and Three Eyes', diff: 3, year: 1250,
    source: 'After *Hervarar saga ok Heiðreks* (the Saga of Hervor and Heidrek, Iceland, 13th century), the Riddles of Gestumblindi.',
    text: 'In the Icelandic saga of King Heidrek, a stranger who calls himself Gestumblindi (“Guest-blind”) challenges the king to a riddle contest. Heidrek must solve each one, or lose. One of the riddles:\n\n*Who are the two that ride on ten feet, have three eyes and just one tail?*',
    hints: ['Count: two riders with two feet; the other feet must belong to something else.', 'The horse has eight legs, and its rider has only one eye.'],
    explain: '**Odin riding Sleipnir**: the one-eyed god, and his eight-legged horse. Ten feet (two of Odin, eight of Sleipnir), three eyes (one of Odin, two of the horse) and one tail. The riddle is a piece of mental arithmetic, and it tells you that you have to know your gods.',
    data: {
      answer: { text: ['odin', 'odin on sleipnir', 'odin and sleipnir', 'sleipnir', 'odin riding sleipnir', 'odin riding his horse', 'woden', 'wotan'] },
      traps: [{ match: ['horse', 'a horse', 'a man on a horse', 'man on a horse', 'a rider', 'a knight'], msg: 'A horse and rider would have six feet and three eyes at most... unless the horse is a very unusual one.' }],
      glyph: '10',
      figure: {
        w: 400, h: 230,
        svg: (function () {
          let s = '<ellipse cx="200" cy="125" rx="100" ry="30" fill="#e9dfc4" stroke="#3a3020" stroke-width="3"/>';
          [118, 138, 158, 178, 226, 246, 266, 286].forEach(function (x, i) {
            s += '<path d="M' + x + ' 145 L' + (x + (i % 2 ? 6 : -4)) + ' 200" stroke="#3a3020" stroke-width="5" stroke-linecap="round" fill="none"/>';
          });
          s += '<path d="M292 110 Q330 70 322 60 L344 66 Q352 88 322 128 Q305 130 292 120 Z" fill="#e9dfc4" stroke="#3a3020" stroke-width="3" stroke-linejoin="round"/>';
          s += '<circle cx="332" cy="72" r="3.2" fill="#3a3020"/>';
          s += '<path d="M104 118 Q66 118 66 172 Q84 140 108 132" fill="none" stroke="#3a3020" stroke-width="4" stroke-linecap="round"/>';
          s += '<rect x="185" y="64" width="26" height="46" rx="8" fill="#3a6ea5" stroke="#3a3020" stroke-width="3"/>';
          s += '<circle cx="198" cy="50" r="11" fill="#f5e6c8" stroke="#3a3020" stroke-width="3"/>';
          s += '<path d="M182 46 L198 26 L216 46 Z" fill="#3a3020"/>';
          s += '<circle cx="193.5" cy="50" r="2" fill="#3a3020"/><path d="M199 46 L207 54" stroke="#3a3020" stroke-width="2.2"/>';
          s += '<path d="M192 110 L184 150 M204 110 L212 148" stroke="#b0472f" stroke-width="6" stroke-linecap="round"/>';
          s += '<text x="200" y="222" text-anchor="middle" font-size="14" font-family="Georgia,serif" fill="#3a3020">two riders · ten feet · three eyes · one tail</text>';
          return s;
        })()
      }
    },
    links: ['anc-norse-stranger']
  },
  {
    id: 'anc-norse-stranger', title: 'The Guest Who Was Blind', diff: 2, year: 1250,
    source: 'After *Hervarar saga ok Heiðreks* (Iceland, 13th century), the last riddle of Gestumblindi.',
    text: 'When King Heidrek has answered every riddle, the stranger Gestumblindi has one more, and it is not really a riddle at all:\n\n*What did Odin whisper in his son Baldr’s ear before Baldr was laid on the pyre?*\n\nHeidrek is furious. “Only you know that,” he says, “you wretch, and you alone.” And the stranger leaves quickly.\n\nWho is the stranger?',
    hints: ['Only one being in all the worlds could know what he said.', 'The stranger’s name means “Guest-blind”, and the one you want has one eye.'],
    explain: 'The stranger is **Odin** himself, who had come in disguise to test the king. The question was the one no-one but the god who said the words could answer. Some readers see it as the first “last riddle” trap: it works only if the person asked already knows the answer.',
    data: {
      answer: { text: ['odin', 'woden', 'wotan', 'the god odin', 'odin himself', 'allfather'] },
      traps: [{ match: ['baldr', 'balder', 'thor', 'loki', 'heidrek'], msg: 'Close to the story, but not the one who could know what was said.' }],
      glyph: '👁'
    },
    links: ['anc-norse-sleipnir']
  },

  /* ---------- India ---------- */
  {
    id: 'anc-rigveda-wheel', title: 'The Wheel with Twelve Spokes', diff: 3, year: -1200,
    source: 'The Rigveda, hymn 1.164 (the “riddle hymn” of Dirghatamas), verse 48. The Rigveda was composed in India between about 1500 and 1000 BC.',
    text: 'The Rigveda, the oldest book of India, contains a hymn made of riddles. One verse says:\n\n*A wheel with twelve spokes and three hubs, and on it are fixed three hundred and sixty pegs that never work loose. Who understands this?*\n\nWhat is the wheel?',
    hints: ['A wheel that turns for ever, and keeps time.', 'Twelve and three hundred and sixty are numbers you know from a calendar.'],
    explain: 'The **year**: twelve months (the spokes), around three hundred and sixty days (the pegs), and — commentators say — three seasons (the hubs) of the old Vedic year. Compare this with the Greek riddle of Cleobulus, composed some six centuries later: two poets, who never met, chose the same riddle.',
    data: {
      answer: { text: ['a year', 'year', 'the year', 'the year of twelve months', 'time', 'the calendar', 'calendar'] },
      traps: [{ match: ['a wheel', 'wheel', 'a cart wheel', 'the sun', 'sun'], msg: 'It is a wheel only in the poet’s picture. What turns once every 360 days?' }],
      glyph: '☸',
      figure: {
        w: 400, h: 226,
        svg: (function () {
          let s = '<circle cx="200" cy="104" r="88" fill="none" stroke="#3a3020" stroke-width="5"/><circle cx="200" cy="104" r="76" fill="none" stroke="#b0472f" stroke-width="2" stroke-dasharray="2 4"/>';
          for (let k = 0; k < 12; k++) {
            const a = k * Math.PI / 6;
            s += '<line x1="200" y1="104" x2="' + (200 + 84 * Math.cos(a)).toFixed(1) + '" y2="' + (104 + 84 * Math.sin(a)).toFixed(1) + '" stroke="#3a3020" stroke-width="3"/>';
          }
          s += '<circle cx="200" cy="104" r="22" fill="#fbf8ef" stroke="#3a3020" stroke-width="3"/><circle cx="200" cy="104" r="14" fill="none" stroke="#3a6ea5" stroke-width="3"/><circle cx="200" cy="104" r="6" fill="#3a3020"/>';
          s += '<text x="200" y="216" text-anchor="middle" font-size="14" font-family="Georgia,serif" fill="#3a3020">twelve spokes · three hubs · 360 pegs</text>';
          return s;
        })()
      }
    },
    concepts: ['lateral'], links: ['anc-cleobulus-year']
  },
  {
    id: 'anc-yaksha-mind', title: 'Swifter than the Wind', diff: 1, year: -200,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira). The epic took its shape between about 400 BC and AD 400.',
    text: 'In the *Mahabharata*, four of the five Pandava brothers drink from a haunted lake and fall dead. The eldest, Yudhishthira, comes last, and hears a voice: a Yaksha, a spirit of the lake, will let him drink only if he answers its questions. The first is:\n\n*What is swifter than the wind?*',
    hints: ['It can be in the mountains and by the sea in the same moment.', 'You are using it to read this.'],
    explain: 'The **mind**, answers Yudhishthira: thought can reach any place before the wind has started. The spirit is pleased, and asks many more questions, praising each answer, and in the end restores all four brothers to life.',
    data: {
      answer: { text: ['the mind', 'mind', 'thought', 'thoughts', 'the human mind', 'a thought', 'imagination'] },
      traps: [{ match: ['light', 'lightning', 'the light', 'the sun', 'a bird', 'an eagle'], msg: 'Fast — but the wind is also outrun by something that has no body at all.' }],
      glyph: '💭'
    },
    links: ['anc-yaksha-mother', 'anc-yaksha-wonder']
  },
  {
    id: 'anc-yaksha-mother', title: 'Heavier than the Earth', diff: 2, year: -200,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira; the epic took its shape between about 400 BC and AD 400).',
    text: 'At the haunted lake in the *Mahabharata*, the spirit of the lake asks Yudhishthira one riddle after another. Two go together:\n\n*What is heavier than the earth? What is higher than the sky?*\n\nThe first answer is one word: who bears the greater weight?',
    hints: ['She carried you for nine months and for years afterwards.', 'The answer to the second riddle is her partner.'],
    explain: 'A **mother**, said Yudhishthira, for she bears her child for months and cares for it for years. And the father is higher than the sky. Both answers turn heaviness and height into ways of measuring love and duty.',
    data: { answer: { text: ['a mother', 'mother', 'the mother', 'mothers', 'mum', 'mom'] }, glyph: '♥' },
    links: ['anc-yaksha-mind', 'anc-yaksha-wonder']
  },
  {
    id: 'anc-yaksha-wonder', title: 'The Greatest Wonder', diff: 3, year: -200,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira; the epic took its shape between about 400 BC and AD 400).',
    text: 'The spirit’s last great question at the lake in the *Mahabharata* is:\n\n*What is the greatest wonder in the world?*\n\nYudhishthira thinks for a moment. What is his answer?',
    hints: ['It is not a natural wonder or a marvel of craft.', 'It concerns a fact that everybody knows and everybody manages to forget.'],
    explain: 'Yudhishthira says: **every day beings go to the house of Death, and yet those who are left behind hope to live for ever**. The Yaksha is delighted, and it is one of the best-known answers in the whole epic; in the end the spirit restores all four brothers to life.',
    data: {
      answer: { choice: 1, choices: ['That the sun rises every morning', 'That every day people die, and those who remain hope to live for ever', 'That water falls from the sky', 'That a small seed grows into a great tree'] },
      traps: [{ match: 0, msg: 'It is a wonder, but the Yaksha was looking for something that is more troubling than beautiful.' }],
      glyph: '?!'
    },
    links: ['anc-yaksha-mind', 'anc-yaksha-mother']
  },
  {
    id: 'anc-khusro-sky', title: 'The Plate of Pearls', diff: 2, year: 1300,
    source: 'A *paheli* traditionally attributed to Amir Khusrau (1253–1325), poet and musician of the Delhi sultanate, who wrote riddles in Hindavi.',
    text: 'The poet Amir Khusrau, at the court of Delhi, is said to have composed riddles in the everyday speech of the people. This one is still recited:\n\n*A dish is full of pearls, and it is turned upside down over every head. It goes around, all round us, and not a single pearl falls.*\n\nWhat is the dish?',
    hints: ['It is over everybody’s head, at night.', 'The pearls are small and shining, and the dish goes round once a day.'],
    explain: 'The **sky at night**, scattered with stars: a great dish turned upside down over everyone, turning slowly through the night, and its pearls never fall.',
    data: {
      answer: { text: ['the sky', 'sky', 'night sky', 'the night sky', 'the heavens', 'heavens', 'the stars', 'stars', 'the sky at night', 'starry sky'] },
      glyph: '✨',
      figure: {
        w: 400, h: 200,
        svg: (function () {
          let s = '<path d="M50 168 A150 150 0 0 1 350 168 Z" fill="#3a6ea5" opacity="0.88" stroke="#3a3020" stroke-width="4"/>';
          const dots = [[110, 132], [140, 100], [170, 128], [200, 70], [230, 112], [262, 84], [290, 130], [318, 148], [96, 152], [186, 146], [246, 148], [154, 152], [274, 112], [214, 96], [126, 118], [302, 108], [176, 96], [236, 132]];
          dots.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#fbf8ef" stroke="#3a3020" stroke-width="1.5"/>'; });
          s += '<line x1="40" y1="170" x2="360" y2="170" stroke="#3a3020" stroke-width="4"/>';
          return s;
        })()
      }
    },
    concepts: ['lateral']
  },

  /* ---------- China ---------- */
  {
    id: 'anc-xunzi-silkworm', title: 'Soft as a Girl, Head of a Horse', diff: 2, year: -240,
    source: 'After Xunzi (about 240 BC), chapter 26, the “Fu” (riddle-poems) on ritual, knowledge, clouds, the silkworm and the needle.',
    text: 'The Chinese philosopher Xunzi ended his book with five short poems that pose a riddle and let the reader guess: ritual, knowledge, clouds, the silkworm and the needle. The silkworm poem says, in our words:\n\n*It is soft and supple like a young girl, yet its head is like a horse’s. It sleeps and wakes three times; it loves the mulberry leaf and dreads the wet and the heat. When it is grown it wraps itself up and shuts itself in. At the end it clothes the ruler.*\n\nWhat is it?',
    hints: ['It feeds on mulberry leaves.', 'What wraps itself up and later becomes cloth?'],
    explain: 'The **silkworm**: the soft caterpillar with a horse-like head, sleeping between its moults (Xunzi counts three), feeding on mulberry leaves, and spinning itself into a cocoon whose thread is spun into silk for the ruler’s robes.',
    data: {
      answer: { text: ['a silkworm', 'silkworm', 'silk worm', 'silk moth', 'silkmoth', 'silk', 'a silk worm', 'silkworms'] },
      traps: [{ match: ['a caterpillar', 'caterpillar', 'a butterfly', 'butterfly', 'a worm', 'worm'], msg: 'Yes, that kind of creature — but which caterpillar lives on mulberry leaves and gives us cloth?' }],
      glyph: '🐛'
    },
    links: ['anc-xunzi-needle']
  },
  {
    id: 'anc-xunzi-needle', title: 'The Slender Traveller', diff: 3, year: -240,
    source: 'After Xunzi (about 240 BC), chapter 26, the “Fu” (riddle-poems): the needle.',
    text: 'Xunzi’s last riddle-poem is about something small. In our own words:\n\n*It is slim and straight, and has no feet, but it can travel. Its tail follows behind it — a long thin thing that trails after it wherever it goes. It goes in and out and joins what was apart, without any glue.*\n\nWhat is it?',
    hints: ['It works on cloth, and it has an eye.', 'The trailing tail is what it drags through the fabric.'],
    explain: 'A **needle** and its thread: the needle goes in and out of the cloth, and the thread trails behind it like a tail, stitching two pieces together without a drop of glue.',
    data: {
      answer: { text: ['a needle', 'needle', 'sewing needle', 'a sewing needle', 'a needle and thread', 'needle and thread', 'the needle', 'needles'] },
      traps: [{ match: ['thread', 'a thread', 'string', 'a pin', 'pin'], msg: 'Nearer — but what does the thread follow?' }],
      glyph: '🪡'
    },
    links: ['anc-xunzi-silkworm']
  },
  {
    id: 'anc-zimi-zuo', title: 'Two People on the Ground', diff: 2,
    source: 'A traditional Chinese character riddle (*zimi*). Riddles hung on lanterns for the Lantern Festival were a favourite game in China from the Song dynasty (960–1279).',
    text: 'Chinese characters are built from parts, and a favourite Chinese riddle game describes a character by its parts. Here is one:\n\n**Two people on the ground.**\n\nEach person is drawn 人, and the earth is drawn 土. Which character is it?',
    hints: ['Put the two people above the earth.', 'It is a very common verb, and you do it as you read this.'],
    explain: 'The character is **坐** (*zuò*, “to sit”): two people 人人 above the earth 土. The picture is exactly what it says — two people sitting on the ground.',
    data: {
      answer: { choice: 0, choices: ['坐', '座', '从', '生'] },
      traps: [{ match: 1, msg: '座 (a seat) has 坐 inside it — but it has something else on top.' }, { match: 2, msg: '从 has two people, but no earth under them.' }],
      glyph: '坐'
    },
    links: ['anc-zimi-zhong', 'anc-zimi-gao']
  },
  {
    id: 'anc-zimi-zhong', title: 'A Thousand Miles Meet', diff: 3,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'Another character riddle, this time by putting two words together:\n\n**A thousand and a mile, meeting.**\n\nThe character for “thousand” is 千, and the character for a Chinese mile (*li*) is 里. Which single character do they make when they meet?',
    hints: ['Put 千 on top of 里.', 'The character means “heavy”.'],
    explain: 'The character is **重** (*zhòng*, “heavy”), with 千 on top of 里. The riddle works because the answer really is those two characters stacked, and a thousand miles is a heavy journey.',
    data: {
      answer: { choice: 0, choices: ['重', '童', '量', '里'] },
      traps: [{ match: 1, msg: '童 (a child) has 里 under something else — not 千.' }, { match: 2, msg: '量 looks similar, but the top part is not 千.' }],
      glyph: '重'
    },
    links: ['anc-zimi-zuo', 'anc-zimi-gao']
  },
  {
    id: 'anc-zimi-gao', title: 'A Mouth Bites the Ox’s Tail', diff: 3,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'One more character riddle, and this one has a little story:\n\n**A mouth bites off the tail of an ox.**\n\nThe character for a mouth is 口, and for an ox, 牛. The tail of 牛 is its last vertical stroke. Which character is left?',
    hints: ['Remove the bottom stroke of 牛, and put the mouth 口 underneath what remains.', 'The character means “to tell”.'],
    explain: 'The character is **告** (*gào*, “to tell”): 牛 with the tail bitten off (𠂉), plus the mouth 口 underneath.',
    data: {
      answer: { choice: 0, choices: ['告', '吉', '舌', '牛'] },
      traps: [{ match: 1, msg: '吉 is a scholar 士 over a mouth — but the riddle bites an ox.' }, { match: 3, msg: 'That is the ox before it lost its tail.' }],
      glyph: '告'
    },
    links: ['anc-zimi-zuo', 'anc-zimi-zhong']
  },

  {
    id: 'anc-vafthrudnir-night', title: 'The Horse of the Night', diff: 3, year: 1000,
    source: 'The *Vafþrúðnismál* (“Sayings of Vafthrudnir”) in the Poetic Edda, Iceland (composed about the 10th century, written down in the 13th).',
    text: 'In the Old Norse poem *Vafþrúðnismál*, the god Odin, disguised as a wanderer called Gagnráð, visits the wise giant Vafthrudnir and challenges him to a contest of knowledge: whoever fails a question loses his head. One of Odin’s questions is:\n\n*What is the name of the horse that draws the night across the sky, over the world of men?*',
    hints: ['In Norse myth, day and night each ride across the sky on a horse, and each horse’s name means its mane.', 'The horse of the night is “Frosty-Mane”, from whose bit drops of dew fall on the valleys.'],
    explain: '**Hrímfaxi**, “Frost-mane”: the giant tells Odin that the dew that falls in the valleys drips from his bit, while Skinfaxi, “Shining-mane”, draws the day. Vafthrudnir answers every question correctly, until Odin asks the one only he can answer: what did Odin whisper in his son’s ear? The giant then knows his guest and accepts that he has lost.',
    data: {
      answer: { choice: 2, choices: ['Sleipnir, Odin’s eight-legged horse', 'Skinfaxi, “Shining-mane”', 'Hrímfaxi, “Frost-mane”', 'Gullfaxi, “Golden-mane”'] },
      traps: [{ match: 1, msg: 'Skinfaxi draws the day. Its mane shines on all the world.' }, { match: 0, msg: 'Sleipnir belongs to Odin himself, and does not draw anything across the sky.' }],
      glyph: '🌙'
    },
    links: ['anc-norse-stranger', 'anc-norse-sleipnir']
  },
].map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
