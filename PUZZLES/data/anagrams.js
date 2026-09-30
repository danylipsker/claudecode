/* The Puzzle Cabinet · data/anagrams.js — made by tools/gen/words.js
 * Themed anagrams with clues; each answer is the only one of its theme (or of the dictionary) that the letters spell. */
Cabinet.family({
  id: 'anagrams', engine: 'words', cat: 'riddles', name: 'Anagrams', order: 9,
  blurb: 'Letter tiles in a jumble: slide them into the one word, or the famous pair, that they spell.',
  origin: { year: 1610, who: 'Galileo Galilei', note: 'Anagrams are ancient. In the seventeenth century scientists used them to claim a discovery without giving it away: Galileo announced what he had seen at Saturn in 1610 as a string of scrambled Latin letters, and Robert Hooke hid his law of springs in the letters CEIIINOSSSTTUV, which unscramble to *ut tensio, sic vis* — as the stretch, so the force.' },
  concepts: ['combinatorics']
}, [
  {
    id: "anagram-goat",
    title: "Animal: ATGO",
    diff: 1,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Climbs cliffs, and will eat almost anything."],
    data: {"kind":"anagram","words":["goat"],"theme":"animal","letters":"atgo"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-lion",
    title: "Animal: LNIO",
    diff: 1,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["A big cat with a mane: the king of beasts."],
    data: {"kind":"anagram","words":["lion"],"theme":"animal","letters":"lnio"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-maze",
    title: "Puzzle word: ZEAM",
    diff: 1,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["A puzzle you walk through."],
    data: {"kind":"anagram","words":["maze"],"theme":"puzzle","letters":"zeam"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-peru",
    title: "Country: EPUR",
    diff: 1,
    text: "Unscramble the letters to make **a country**.",
    hints: ["Llamas, and the ruins of Machu Picchu."],
    data: {"kind":"anagram","words":["peru"],"theme":"country","letters":"epur"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-spot",
    title: "Any word: PTOS",
    diff: 1,
    text: "Rearrange all 4 letters to make **any English word**.",
    hints: ["There is more than one answer: any word that uses all four letters counts."],
    data: {"kind":"anagram","words":["spot"],"theme":null,"any":true,"letters":"ptos"},
    concepts: ["combinatorics"],
    tags: ["anagram","any"]
  },
  {
    id: "anagram-amber",
    title: "Colour: ERMAB",
    diff: 1,
    text: "Unscramble the letters to make **a colour**.",
    hints: ["The traffic light between red and green — and fossil tree resin."],
    data: {"kind":"anagram","words":["amber"],"theme":"colour","letters":"ermab"},
    concepts: ["combinatorics"],
    tags: ["anagram","colour"]
  },
  {
    id: "anagram-baker",
    title: "Job: EKABR",
    diff: 1,
    text: "Unscramble the letters to make **a job**.",
    hints: ["Up before dawn to make the bread."],
    data: {"kind":"anagram","words":["baker"],"theme":"job","letters":"ekabr"},
    concepts: ["combinatorics"],
    tags: ["anagram","job"]
  },
  {
    id: "anagram-camel",
    title: "Animal: ELAMC",
    diff: 1,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["The ship of the desert."],
    data: {"kind":"anagram","words":["camel"],"theme":"animal","letters":"elamc"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-cello",
    title: "Instrument: ELOCL",
    diff: 1,
    text: "Unscramble the letters to make **a musical instrument**.",
    hints: ["Played sitting down and held between the knees."],
    data: {"kind":"anagram","words":["cello"],"theme":"music","letters":"elocl"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-comet",
    title: "Sky and space: OEMTC",
    diff: 1,
    text: "Unscramble the letters to make **something in the sky or in space**.",
    hints: ["A dirty snowball with a glowing tail."],
    data: {"kind":"anagram","words":["comet"],"theme":"space","letters":"oemtc"},
    concepts: ["combinatorics"],
    tags: ["anagram","space"]
  },
  {
    id: "anagram-crate",
    title: "Any word: ECART",
    diff: 1,
    text: "Rearrange all 5 letters to make **any English word**.",
    hints: ["There is more than one answer: any word that uses all five letters counts."],
    data: {"kind":"anagram","words":["crate"],"theme":null,"any":true,"letters":"ecart"},
    concepts: ["combinatorics"],
    tags: ["anagram","any"]
  },
  {
    id: "anagram-daisy",
    title: "Tree or flower: DYAIS",
    diff: 1,
    text: "Unscramble the letters to make **a tree or a flower**.",
    hints: ["Pluck its petals: she loves me, she loves me not."],
    data: {"kind":"anagram","words":["daisy"],"theme":"plant","letters":"dyais"},
    concepts: ["combinatorics"],
    tags: ["anagram","plant"]
  },
  {
    id: "anagram-egypt",
    title: "Country: PETYG",
    diff: 1,
    text: "Unscramble the letters to make **a country**.",
    hints: ["The Nile and the pyramids."],
    data: {"kind":"anagram","words":["egypt"],"theme":"country","letters":"petyg"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-frost",
    title: "Weather: SFTRO",
    diff: 1,
    text: "Unscramble the letters to make **a kind of weather**.",
    hints: ["Paints ferns on the window on cold mornings."],
    data: {"kind":"anagram","words":["frost"],"theme":"weather","letters":"sftro"},
    concepts: ["combinatorics"],
    tags: ["anagram","weather"]
  },
  {
    id: "anagram-grape",
    title: "Fruit or veg: GEPAR",
    diff: 1,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["Grows in bunches; dried, it becomes a raisin."],
    data: {"kind":"anagram","words":["grape"],"theme":"food","letters":"gepar"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-heron",
    title: "Bird: EHNOR",
    diff: 1,
    text: "Unscramble the letters to make **a bird**.",
    hints: ["Stands on one leg in the shallows, waiting for a fish."],
    data: {"kind":"anagram","words":["heron"],"theme":"bird","letters":"ehnor"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-italy",
    title: "Country: ALYTI",
    diff: 1,
    text: "Unscramble the letters to make **a country**.",
    hints: ["Shaped like a boot."],
    data: {"kind":"anagram","words":["italy"],"theme":"country","letters":"alyti"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-japan",
    title: "Country: PANJA",
    diff: 1,
    text: "Unscramble the letters to make **a country**.",
    hints: ["The land of the rising sun."],
    data: {"kind":"anagram","words":["japan"],"theme":"country","letters":"panja"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-koala",
    title: "Animal: LOAAK",
    diff: 1,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Sleeps most of the day up a eucalyptus tree."],
    data: {"kind":"anagram","words":["koala"],"theme":"animal","letters":"loaak"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-mango",
    title: "Fruit or veg: NGAOM",
    diff: 1,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["A tropical fruit with a big flat stone."],
    data: {"kind":"anagram","words":["mango"],"theme":"food","letters":"ngaom"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-otter",
    title: "Animal: OTRTE",
    diff: 1,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Floats on its back and cracks shellfish on its tummy."],
    data: {"kind":"anagram","words":["otter"],"theme":"animal","letters":"otrte"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-piano",
    title: "Instrument: PNIAO",
    diff: 1,
    text: "Unscramble the letters to make **a musical instrument**.",
    hints: ["Eighty-eight keys, black and white."],
    data: {"kind":"anagram","words":["piano"],"theme":"music","letters":"pniao"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-pilot",
    title: "Job: LTOPI",
    diff: 1,
    text: "Unscramble the letters to make **a job**.",
    hints: ["Flies the plane."],
    data: {"kind":"anagram","words":["pilot"],"theme":"job","letters":"ltopi"},
    concepts: ["combinatorics"],
    tags: ["anagram","job"]
  },
  {
    id: "anagram-rebus",
    title: "Puzzle word: URSEB",
    diff: 1,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["A puzzle that spells words with pictures."],
    data: {"kind":"anagram","words":["rebus"],"theme":"puzzle","letters":"urseb"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-robin",
    title: "Bird: NBROI",
    diff: 1,
    text: "Unscramble the letters to make **a bird**.",
    hints: ["Red breast, winter garden, Christmas card."],
    data: {"kind":"anagram","words":["robin"],"theme":"bird","letters":"nbroi"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-scarf",
    title: "Clothes: ASRCF",
    diff: 1,
    text: "Unscramble the letters to make **something to wear**.",
    hints: ["Wound round your neck in winter."],
    data: {"kind":"anagram","words":["scarf"],"theme":"clothes","letters":"asrcf"},
    concepts: ["combinatorics"],
    tags: ["anagram","clothes"]
  },
  {
    id: "anagram-spoon",
    title: "Kitchen: NOPSO",
    diff: 1,
    text: "Unscramble the letters to make **something in the kitchen**.",
    hints: ["Soup's best friend."],
    data: {"kind":"anagram","words":["spoon"],"theme":"kitchen","letters":"nopso"},
    concepts: ["combinatorics"],
    tags: ["anagram","kitchen"]
  },
  {
    id: "anagram-stale",
    title: "Any word: SATEL",
    diff: 1,
    text: "Rearrange all 5 letters to make **any English word**.",
    hints: ["There is more than one answer: any word that uses all five letters counts."],
    data: {"kind":"anagram","words":["stale"],"theme":null,"any":true,"letters":"satel"},
    concepts: ["combinatorics"],
    tags: ["anagram","any"]
  },
  {
    id: "anagram-tulip",
    title: "Tree or flower: ULPIT",
    diff: 1,
    text: "Unscramble the letters to make **a tree or a flower**.",
    hints: ["Holland is full of them in spring."],
    data: {"kind":"anagram","words":["tulip"],"theme":"plant","letters":"ulpit"},
    concepts: ["combinatorics"],
    tags: ["anagram","plant"]
  },
  {
    id: "anagram-zebra",
    title: "Animal: ZARBE",
    diff: 1,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["A horse in striped pyjamas."],
    data: {"kind":"anagram","words":["zebra"],"theme":"animal","letters":"zarbe"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-banana",
    title: "Fruit or veg: NABNAA",
    diff: 2,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["Comes in its own wrapper, and bends."],
    data: {"kind":"anagram","words":["banana"],"theme":"food","letters":"nabnaa"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-brazil",
    title: "Country: ILZBAR",
    diff: 2,
    text: "Unscramble the letters to make **a country**.",
    hints: ["The biggest country in South America."],
    data: {"kind":"anagram","words":["brazil"],"theme":"country","letters":"ilzbar"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-canada",
    title: "Country: AAACDN",
    diff: 2,
    text: "Unscramble the letters to make **a country**.",
    hints: ["Maple leaves and an enormous number of lakes."],
    data: {"kind":"anagram","words":["canada"],"theme":"country","letters":"aaacdn"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-carrot",
    title: "Fruit or veg: RRAOCT",
    diff: 2,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["Orange and crunchy, and good for your eyes — or so grandmothers say."],
    data: {"kind":"anagram","words":["carrot"],"theme":"food","letters":"rraoct"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-cat-dog",
    title: "Two animals: GOCADT",
    diff: 2,
    text: "These letters make **two animals** (3 + 3 letters).",
    hints: ["Two pets that do not always get on."],
    data: {"kind":"anagram","words":["cat","dog"],"theme":"animal","letters":"gocadt"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-cipher",
    title: "Puzzle word: HCERIP",
    diff: 2,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["Secret writing — like the puzzles in the drawer next door."],
    data: {"kind":"anagram","words":["cipher"],"theme":"puzzle","letters":"hcerip"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-donkey",
    title: "Animal: KYNDEO",
    diff: 2,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Long ears, a loud bray and a stubborn streak."],
    data: {"kind":"anagram","words":["donkey"],"theme":"animal","letters":"kyndeo"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-galaxy",
    title: "Sky and space: ALAXGY",
    diff: 2,
    text: "Unscramble the letters to make **something in the sky or in space**.",
    hints: ["Billions of stars in one great spiral."],
    data: {"kind":"anagram","words":["galaxy"],"theme":"space","letters":"alaxgy"},
    concepts: ["combinatorics"],
    tags: ["anagram","space"]
  },
  {
    id: "anagram-guitar",
    title: "Instrument: GRIATU",
    diff: 2,
    text: "Unscramble the letters to make **a musical instrument**.",
    hints: ["Six strings and a round sound hole."],
    data: {"kind":"anagram","words":["guitar"],"theme":"music","letters":"griatu"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-indigo",
    title: "Colour: DNIOGI",
    diff: 2,
    text: "Unscramble the letters to make **a colour**.",
    hints: ["Between blue and violet in the rainbow."],
    data: {"kind":"anagram","words":["indigo"],"theme":"colour","letters":"dniogi"},
    concepts: ["combinatorics"],
    tags: ["anagram","colour"]
  },
  {
    id: "anagram-jacket",
    title: "Clothes: AJTCKE",
    diff: 2,
    text: "Unscramble the letters to make **something to wear**.",
    hints: ["A short coat."],
    data: {"kind":"anagram","words":["jacket"],"theme":"clothes","letters":"ajtcke"},
    concepts: ["combinatorics"],
    tags: ["anagram","clothes"]
  },
  {
    id: "anagram-jigsaw",
    title: "Puzzle word: SGIWAJ",
    diff: 2,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["Hundreds of pieces and one picture on the box."],
    data: {"kind":"anagram","words":["jigsaw"],"theme":"puzzle","letters":"sgiwaj"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-kettle",
    title: "Kitchen: TKTLEE",
    diff: 2,
    text: "Unscramble the letters to make **something in the kitchen**.",
    hints: ["Whistles when it boils."],
    data: {"kind":"anagram","words":["kettle"],"theme":"kitchen","letters":"tktlee"},
    concepts: ["combinatorics"],
    tags: ["anagram","kitchen"]
  },
  {
    id: "anagram-norway",
    title: "Country: OWNARY",
    diff: 2,
    text: "Unscramble the letters to make **a country**.",
    hints: ["Fjords, and the midnight sun."],
    data: {"kind":"anagram","words":["norway"],"theme":"country","letters":"ownary"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-owl-hen",
    title: "Two birds: LWNOHE",
    diff: 2,
    text: "These letters make **two birds** (3 + 3 letters).",
    hints: ["One hoots at night; the other lays eggs by day."],
    data: {"kind":"anagram","words":["owl","hen"],"theme":"bird","letters":"lwnohe"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-parrot",
    title: "Bird: PTROAR",
    diff: 2,
    text: "Unscramble the letters to make **a bird**.",
    hints: ["Talks a lot, but never says anything new."],
    data: {"kind":"anagram","words":["parrot"],"theme":"bird","letters":"ptroar"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-riddle",
    title: "Puzzle word: EDDILR",
    diff: 2,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["It has a question in it and hides its answer."],
    data: {"kind":"anagram","words":["riddle"],"theme":"puzzle","letters":"eddilr"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-tennis",
    title: "Sport: NNSEIT",
    diff: 2,
    text: "Unscramble the letters to make **a sport**.",
    hints: ["A game in which love means nothing."],
    data: {"kind":"anagram","words":["tennis"],"theme":"sport","letters":"nnseit"},
    concepts: ["combinatorics"],
    tags: ["anagram","sport"]
  },
  {
    id: "anagram-tomato",
    title: "Fruit or veg: OTATOM",
    diff: 2,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["A fruit that everyone treats as a vegetable."],
    data: {"kind":"anagram","words":["tomato"],"theme":"food","letters":"otatom"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-walrus",
    title: "Animal: WRSAUL",
    diff: 2,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Tusks and whiskers — and a Carroll poem about some unlucky oysters."],
    data: {"kind":"anagram","words":["walrus"],"theme":"animal","letters":"wrsaul"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-willow",
    title: "Tree or flower: IWOLLW",
    diff: 2,
    text: "Unscramble the letters to make **a tree or a flower**.",
    hints: ["A weeping tree by the river."],
    data: {"kind":"anagram","words":["willow"],"theme":"plant","letters":"iwollw"},
    concepts: ["combinatorics"],
    tags: ["anagram","plant"]
  },
  {
    id: "anagram-pea-bean",
    title: "Two fruits and vegetables: NEAEABP",
    diff: 2,
    text: "These letters make **two fruits and vegetables** (3 + 4 letters).",
    hints: ["Two vegetables that grow in pods."],
    data: {"kind":"anagram","words":["pea","bean"],"theme":"food","letters":"neaeabp"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-bamboo",
    title: "One word: AOOBBM",
    diff: 3,
    text: "Unscramble the letters to make a word — there is only one.",
    hints: ["The giant grass that pandas eat."],
    data: {"kind":"anagram","words":["bamboo"],"theme":null,"letters":"aoobbm"},
    concepts: ["combinatorics"],
    tags: ["anagram","word"]
  },
  {
    id: "anagram-oxygen",
    title: "One word: YENOXG",
    diff: 3,
    text: "Unscramble the letters to make a word — there is only one.",
    hints: ["You are breathing it now."],
    data: {"kind":"anagram","words":["oxygen"],"theme":null,"letters":"yenoxg"},
    concepts: ["combinatorics"],
    tags: ["anagram","word"]
  },
  {
    id: "anagram-rhythm",
    title: "One word: HRMYHT",
    diff: 3,
    text: "Unscramble the letters to make a word — there is only one.",
    hints: ["Music has it, and so does poetry — and it has no ordinary vowels."],
    data: {"kind":"anagram","words":["rhythm"],"theme":null,"letters":"hrmyht"},
    concepts: ["combinatorics"],
    tags: ["anagram","word"]
  },
  {
    id: "anagram-sphinx",
    title: "One word: HPIXNS",
    diff: 3,
    text: "Unscramble the letters to make a word — there is only one.",
    hints: ["It asked the most famous riddle of all."],
    data: {"kind":"anagram","words":["sphinx"],"theme":null,"letters":"hpixns"},
    concepts: ["combinatorics"],
    tags: ["anagram","word"]
  },
  {
    id: "anagram-wizard",
    title: "One word: AZIRDW",
    diff: 3,
    text: "Unscramble the letters to make a word — there is only one.",
    hints: ["Merlin was one."],
    data: {"kind":"anagram","words":["wizard"],"theme":null,"letters":"azirdw"},
    concepts: ["combinatorics"],
    tags: ["anagram","word"]
  },
  {
    id: "anagram-archery",
    title: "Sport: AECRRYH",
    diff: 3,
    text: "Unscramble the letters to make **a sport**.",
    hints: ["Bows, arrows and a target."],
    data: {"kind":"anagram","words":["archery"],"theme":"sport","letters":"aecrryh"},
    concepts: ["combinatorics"],
    tags: ["anagram","sport"]
  },
  {
    id: "anagram-giraffe",
    title: "Animal: FAEIGRF",
    diff: 3,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["The tallest animal alive."],
    data: {"kind":"anagram","words":["giraffe"],"theme":"animal","letters":"faeigrf"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-iceland",
    title: "Country: ENLACDI",
    diff: 3,
    text: "Unscramble the letters to make **a country**.",
    hints: ["Glaciers and volcanoes side by side."],
    data: {"kind":"anagram","words":["iceland"],"theme":"country","letters":"enlacdi"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-octopus",
    title: "Animal: POOSUCT",
    diff: 3,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Eight arms, three hearts and blue blood."],
    data: {"kind":"anagram","words":["octopus"],"theme":"animal","letters":"poosuct"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-paradox",
    title: "Puzzle word: ROAAPDX",
    diff: 3,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["A statement that seems to contradict itself."],
    data: {"kind":"anagram","words":["paradox"],"theme":"puzzle","letters":"roaapdx"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-penguin",
    title: "Bird: IEUNNGP",
    diff: 3,
    text: "Unscramble the letters to make **a bird**.",
    hints: ["A bird in evening dress that swims instead of flying."],
    data: {"kind":"anagram","words":["penguin"],"theme":"bird","letters":"ieunngp"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-plumber",
    title: "Job: PMEURLB",
    diff: 3,
    text: "Unscramble the letters to make **a job**.",
    hints: ["Mends the pipes."],
    data: {"kind":"anagram","words":["plumber"],"theme":"job","letters":"pmeurlb"},
    concepts: ["combinatorics"],
    tags: ["anagram","job"]
  },
  {
    id: "anagram-pumpkin",
    title: "Fruit or veg: MPNUKIP",
    diff: 3,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["A fairy godmother turned one into a coach."],
    data: {"kind":"anagram","words":["pumpkin"],"theme":"food","letters":"mpnukip"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-scarlet",
    title: "Colour: RETLSCA",
    diff: 3,
    text: "Unscramble the letters to make **a colour**.",
    hints: ["A brilliant red."],
    data: {"kind":"anagram","words":["scarlet"],"theme":"colour","letters":"retlsca"},
    concepts: ["combinatorics"],
    tags: ["anagram","colour"]
  },
  {
    id: "anagram-sweater",
    title: "Clothes: TSAEWRE",
    diff: 3,
    text: "Unscramble the letters to make **something to wear**.",
    hints: ["A warm knitted top."],
    data: {"kind":"anagram","words":["sweater"],"theme":"clothes","letters":"tsaewre"},
    concepts: ["combinatorics"],
    tags: ["anagram","clothes"]
  },
  {
    id: "anagram-thunder",
    title: "Weather: RUHETDN",
    diff: 3,
    text: "Unscramble the letters to make **a kind of weather**.",
    hints: ["Count the seconds after the lightning."],
    data: {"kind":"anagram","words":["thunder"],"theme":"weather","letters":"ruhetdn"},
    concepts: ["combinatorics"],
    tags: ["anagram","weather"]
  },
  {
    id: "anagram-toaster",
    title: "Kitchen: TOTREAS",
    diff: 3,
    text: "Unscramble the letters to make **something in the kitchen**.",
    hints: ["Pops up at breakfast."],
    data: {"kind":"anagram","words":["toaster"],"theme":"kitchen","letters":"totreas"},
    concepts: ["combinatorics"],
    tags: ["anagram","kitchen"]
  },
  {
    id: "anagram-trumpet",
    title: "Instrument: TPMEURT",
    diff: 3,
    text: "Unscramble the letters to make **a musical instrument**.",
    hints: ["Brass, with three valves."],
    data: {"kind":"anagram","words":["trumpet"],"theme":"music","letters":"tpmeurt"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-bow-arrow",
    title: "Famous pair: AORWWORB",
    diff: 3,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (3 + 5 letters).",
    hints: ["Robin Hood never went anywhere without them."],
    data: {"kind":"anagram","words":["bow","arrow"],"theme":"pairs","letters":"aorwworb"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-harp-drum",
    title: "Two musical instruments: PAMRDRHU",
    diff: 3,
    text: "These letters make **two musical instruments** (4 + 4 letters).",
    hints: ["You pluck one and beat the other."],
    data: {"kind":"anagram","words":["harp","drum"],"theme":"music","letters":"pamrdrhu"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-fish-chips",
    title: "Famous pair: HFHSICSIP",
    diff: 3,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (4 + 5 letters).",
    hints: ["Wrapped in paper, with vinegar."],
    data: {"kind":"anagram","words":["fish","chips"],"theme":"pairs","letters":"hfhsicsip"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-knife-fork",
    title: "Famous pair: KNOIFKEFR",
    diff: 3,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (5 + 4 letters).",
    hints: ["Laid on either side of the plate."],
    data: {"kind":"anagram","words":["knife","fork"],"theme":"pairs","letters":"knoifkefr"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-blizzard",
    title: "Weather: IARZZLDB",
    diff: 4,
    text: "Unscramble the letters to make **a kind of weather**.",
    hints: ["Snow driven by a howling wind."],
    data: {"kind":"anagram","words":["blizzard"],"theme":"weather","letters":"iarzzldb"},
    concepts: ["combinatorics"],
    tags: ["anagram","weather"]
  },
  {
    id: "anagram-broccoli",
    title: "Fruit or veg: CCBILORO",
    diff: 4,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["Looks like a tiny green tree."],
    data: {"kind":"anagram","words":["broccoli"],"theme":"food","letters":"ccbiloro"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-elephant",
    title: "Animal: HEATNELP",
    diff: 4,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["The biggest animal on land, with a trunk for a nose."],
    data: {"kind":"anagram","words":["elephant"],"theme":"animal","letters":"heatnelp"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-flamingo",
    title: "Bird: LMNFIGOA",
    diff: 4,
    text: "Unscramble the letters to make **a bird**.",
    hints: ["Pink because of what it eats, and often standing on one leg."],
    data: {"kind":"anagram","words":["flamingo"],"theme":"bird","letters":"lmnfigoa"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-football",
    title: "Sport: AOOFTLLB",
    diff: 4,
    text: "Unscramble the letters to make **a sport**.",
    hints: ["Kicked around the whole world."],
    data: {"kind":"anagram","words":["football"],"theme":"sport","letters":"aooftllb"},
    concepts: ["combinatorics"],
    tags: ["anagram","sport"]
  },
  {
    id: "anagram-kangaroo",
    title: "Animal: NRAOOAKG",
    diff: 4,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Hops everywhere and carries its baby in a pouch."],
    data: {"kind":"anagram","words":["kangaroo"],"theme":"animal","letters":"nraooakg"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-portugal",
    title: "Country: PTLROAUG",
    diff: 4,
    text: "Unscramble the letters to make **a country**.",
    hints: ["At the south-western corner of Europe."],
    data: {"kind":"anagram","words":["portugal"],"theme":"country","letters":"ptlroaug"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-robin-eagle",
    title: "Two birds: GIORLNBEEA",
    diff: 4,
    text: "These letters make **two birds** (5 + 5 letters).",
    hints: ["A small one with a red breast and a great one with a hooked beak."],
    data: {"kind":"anagram","words":["robin","eagle"],"theme":"bird","letters":"giorlnbeea"},
    concepts: ["combinatorics"],
    tags: ["anagram","bird"]
  },
  {
    id: "anagram-salt-pepper",
    title: "Famous pair: TAPPESLEPR",
    diff: 4,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (4 + 6 letters).",
    hints: ["On every dinner table."],
    data: {"kind":"anagram","words":["salt","pepper"],"theme":"pairs","letters":"tappeslepr"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-spain-italy",
    title: "Two countries: ISTLANIYPA",
    diff: 4,
    text: "These letters make **two countries** (5 + 5 letters).",
    hints: ["Two sunny neighbours of the Mediterranean."],
    data: {"kind":"anagram","words":["spain","italy"],"theme":"country","letters":"istlaniypa"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-tiger-zebra",
    title: "Two animals: IGERBRTZEA",
    diff: 4,
    text: "These letters make **two animals** (5 + 5 letters).",
    hints: ["Both wear stripes."],
    data: {"kind":"anagram","words":["tiger","zebra"],"theme":"animal","letters":"igerbrtzea"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-bucket-spade",
    title: "Famous pair: CATESUKDPBE",
    diff: 4,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (6 + 5 letters).",
    hints: ["Taken to the beach to build sandcastles."],
    data: {"kind":"anagram","words":["bucket","spade"],"theme":"pairs","letters":"catesukdpbe"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-piano-violin",
    title: "Two musical instruments: ONINIPLOVAI",
    diff: 4,
    text: "These letters make **two musical instruments** (5 + 6 letters).",
    hints: ["One has keys and the other a bow."],
    data: {"kind":"anagram","words":["piano","violin"],"theme":"music","letters":"oniniplovai"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-astronaut",
    title: "Sky and space: TSNRUOATA",
    diff: 5,
    text: "Unscramble the letters to make **something in the sky or in space**.",
    hints: ["Someone who travels into space."],
    data: {"kind":"anagram","words":["astronaut"],"theme":"space","letters":"tsnruoata"},
    concepts: ["combinatorics"],
    tags: ["anagram","space"]
  },
  {
    id: "anagram-australia",
    title: "Country: ASAULAIRT",
    diff: 5,
    text: "Unscramble the letters to make **a country**.",
    hints: ["A country that is also a whole continent."],
    data: {"kind":"anagram","words":["australia"],"theme":"country","letters":"asaulairt"},
    concepts: ["combinatorics"],
    tags: ["anagram","country"]
  },
  {
    id: "anagram-carpenter",
    title: "Job: RTRENCPEA",
    diff: 5,
    text: "Unscramble the letters to make **a job**.",
    hints: ["Works in wood — and shared a Carroll poem with a walrus."],
    data: {"kind":"anagram","words":["carpenter"],"theme":"job","letters":"rtrencpea"},
    concepts: ["combinatorics"],
    tags: ["anagram","job"]
  },
  {
    id: "anagram-chameleon",
    title: "Animal: CONAMEHLE",
    diff: 5,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Changes colour, and looks two ways at once."],
    data: {"kind":"anagram","words":["chameleon"],"theme":"animal","letters":"conamehle"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-crocodile",
    title: "Animal: COERDOLCI",
    diff: 5,
    text: "Unscramble the letters to make **an animal**.",
    hints: ["Smiles at you from the river. Do not smile back."],
    data: {"kind":"anagram","words":["crocodile"],"theme":"animal","letters":"coerdolci"},
    concepts: ["combinatorics"],
    tags: ["anagram","animal"]
  },
  {
    id: "anagram-crossword",
    title: "Puzzle word: SWRCROOSD",
    diff: 5,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["Black and white squares, clues across and down."],
    data: {"kind":"anagram","words":["crossword"],"theme":"puzzle","letters":"swrcroosd"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-dandelion",
    title: "Tree or flower: ODNADNIEL",
    diff: 5,
    text: "Unscramble the letters to make **a tree or a flower**.",
    hints: ["Blow its clock of seeds to tell the time."],
    data: {"kind":"anagram","words":["dandelion"],"theme":"plant","letters":"odnadniel"},
    concepts: ["combinatorics"],
    tags: ["anagram","plant"]
  },
  {
    id: "anagram-detective",
    title: "Job: ETITDCEEV",
    diff: 5,
    text: "Unscramble the letters to make **a job**.",
    hints: ["Finds out who did it."],
    data: {"kind":"anagram","words":["detective"],"theme":"job","letters":"etitdceev"},
    concepts: ["combinatorics"],
    tags: ["anagram","job"]
  },
  {
    id: "anagram-hurricane",
    title: "Weather: REHUCNRIA",
    diff: 5,
    text: "Unscramble the letters to make **a kind of weather**.",
    hints: ["A tropical storm with a calm eye."],
    data: {"kind":"anagram","words":["hurricane"],"theme":"weather","letters":"rehucnria"},
    concepts: ["combinatorics"],
    tags: ["anagram","weather"]
  },
  {
    id: "anagram-labyrinth",
    title: "Puzzle word: IRABLHTNY",
    diff: 5,
    text: "Unscramble the letters to make **a word about puzzles**.",
    hints: ["Where the Minotaur lived."],
    data: {"kind":"anagram","words":["labyrinth"],"theme":"puzzle","letters":"irablhtny"},
    concepts: ["combinatorics"],
    tags: ["anagram","puzzle"]
  },
  {
    id: "anagram-pineapple",
    title: "Fruit or veg: ELPINEPAP",
    diff: 5,
    text: "Unscramble the letters to make **a fruit or vegetable**.",
    hints: ["Neither a pine nor an apple."],
    data: {"kind":"anagram","words":["pineapple"],"theme":"food","letters":"elpinepap"},
    concepts: ["combinatorics"],
    tags: ["anagram","food"]
  },
  {
    id: "anagram-saxophone",
    title: "Instrument: OXHEPSAON",
    diff: 5,
    text: "Unscramble the letters to make **a musical instrument**.",
    hints: ["Made of brass, but played with a reed like a clarinet."],
    data: {"kind":"anagram","words":["saxophone"],"theme":"music","letters":"oxhepsaon"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-sunflower",
    title: "Tree or flower: EUWRSFNLO",
    diff: 5,
    text: "Unscramble the letters to make **a tree or a flower**.",
    hints: ["A tall yellow flower that turns to face the sun."],
    data: {"kind":"anagram","words":["sunflower"],"theme":"plant","letters":"euwrsfnlo"},
    concepts: ["combinatorics"],
    tags: ["anagram","plant"]
  },
  {
    id: "anagram-telescope",
    title: "Sky and space: LEOSETECP",
    diff: 5,
    text: "Unscramble the letters to make **something in the sky or in space**.",
    hints: ["Galileo pointed one at the sky in 1609."],
    data: {"kind":"anagram","words":["telescope"],"theme":"space","letters":"leosetecp"},
    concepts: ["combinatorics"],
    tags: ["anagram","space"]
  },
  {
    id: "anagram-xylophone",
    title: "Instrument: XOHYLPOEN",
    diff: 5,
    text: "Unscramble the letters to make **a musical instrument**.",
    hints: ["Wooden bars struck with little hammers."],
    data: {"kind":"anagram","words":["xylophone"],"theme":"music","letters":"xohylpoen"},
    concepts: ["combinatorics"],
    tags: ["anagram","music"]
  },
  {
    id: "anagram-needle-thread",
    title: "Famous pair: ELDNREEDHAET",
    diff: 5,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (6 + 6 letters).",
    hints: ["For sewing a button back on."],
    data: {"kind":"anagram","words":["needle","thread"],"theme":"pairs","letters":"eldnreedhaet"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-stars-stripes",
    title: "Famous pair: STSEIRRTSPAS",
    diff: 5,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (5 + 7 letters).",
    hints: ["The flag of the United States."],
    data: {"kind":"anagram","words":["stars","stripes"],"theme":"pairs","letters":"stseirrtspas"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  },
  {
    id: "anagram-pride-prejudice",
    title: "Famous pair: DUCIPEDPERJEIR",
    diff: 5,
    text: "These letters make a famous pair — two words that go together, like *salt and pepper* (5 + 9 letters).",
    hints: ["Jane Austen's most famous novel."],
    data: {"kind":"anagram","words":["pride","prejudice"],"theme":"pairs","letters":"ducipedperjeir"},
    concepts: ["combinatorics"],
    tags: ["anagram","pairs"]
  }
]);
