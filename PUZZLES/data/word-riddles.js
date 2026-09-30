/* The Puzzle Cabinet · data/word-riddles.js
 * Wordplay in English: anagrams, hidden words, words with strange properties, letter riddles,
 * charades, spoonerisms and cryptic clues. Every statement, hint and explanation is written afresh;
 * the folk riddles are traditional. Every word property was checked by script when the puzzle was made. */
Cabinet.family({
  id: 'word-riddles', engine: 'question', cat: 'riddles', name: 'Wordplay', order: 7,
  blurb: 'Anagrams, hidden words, charades, letter riddles and cryptic clues: puzzles that live in the spelling and sound of English.',
  origin: { year: 975, who: 'Old English riddle-poets and many later hands', note: 'Playing with letters is very old: Hebrew poets wrote alphabet acrostics, and the Old English riddles of the Exeter Book (copied in the tenth century) are full of puns. Anagrams, palindromes and charades were parlour games long before the cryptic crossword clue, a twentieth-century invention, packed all the tricks into a single line.' },
  concepts: ['lateral']
}, [
  /* ---------- easy ---------- */
  {
    id: 'word-silent', title: 'Quiet, Please', diff: 1,
    text: `Take the six letters of **LISTEN** and shuffle them into a new word — using every letter exactly once — that means *making no sound at all*.`,
    hints: [
      `The answer is an adjective, the kind of word you might see on a sign in a library.`,
      `It begins with S, and the I stays in second place, just as in LISTEN.`,
      `S, I, L, then E and N — and the T that sat in the middle of LISTEN has slipped to the end.`
    ],
    explain: `**Silent.** LISTEN and SILENT are built from exactly the same six letters, which is why the pair is the favourite example of an *anagram*: to listen well, you must be silent. (*Enlist*, *tinsel* and *inlets* use the same letters too, but none of them means quiet.)`,
    data: {
      answer: { text: ['silent'], exact: true },
      traps: [
        { match: ['quiet', 'silence'], msg: `Right idea, but the word must be built from exactly the letters of LISTEN: six of them, no more, no fewer.` },
        { match: ['enlist', 'tinsel', 'inlets'], msg: `Yes, that is an anagram of LISTEN too — but does it mean making no sound?` }
      ],
      glyph: '🤫'
    },
    concepts: ['lateral'], tags: ['anagram'], links: ['word-they-see', 'word-eleven-plus-two']
  },
  {
    id: 'word-letter-m', title: 'Once, Twice, Never', diff: 1,
    source: 'A traditional style of riddle, retold in new words.',
    text: `One letter of the alphabet appears **once** in the word *minute*, **twice** in the word *moment*, and **not at all** in the words *a thousand years*.\n\nWhich letter?`,
    hints: [
      `Write out *moment* and look for a letter that turns up twice.`,
      `That same letter is also the first letter of *minute*.`
    ],
    explain: `The letter **M**: one in *minute*, two in *moment*, none in *a thousand years*. The words are there only to be counted; what they mean does not matter at all.`,
    data: { answer: { text: ['the letter M', 'M', 'letter M', 'an M'], exact: true }, glyph: 'M' },
    concepts: ['lateral'], tags: ['letters'], links: ['word-eternity']
  },
  {
    id: 'word-snow', title: 'Three in One', diff: 1,
    text: `One short word can go in front of all three of these, making a new word each time:\n\n**___ball · ___man · ___flake**\n\nWhat is it?`,
    hints: [
      `It is something that happens in winter, when it is cold enough.`,
      `White stuff falls from the sky, and you can roll it into a ball or build a person out of it.`
    ],
    explain: `**Snow**: snowball, snowman, snowflake. Words that can be glued together like this are called *compounds*; English makes new ones all the time.`,
    data: {
      answer: { text: ['snow'], exact: true },
      traps: [{ match: ['rain', 'ice', 'fire'], msg: `Try your word in all three places at once. Does it work with every one of them?` }],
      glyph: '❄'
    },
    tags: ['compound'], links: ['word-horse']
  },
  {
    id: 'word-six-seven', title: 'Why Six Was Afraid', diff: 1,
    source: 'A traditional joke.',
    text: `An old joke depends on two words that sound the same and are spelled differently. It goes: *Why was six afraid of seven?*\n\nWhat is the punchline?`,
    hints: [
      `The joke works when it is spoken aloud, not when it is written down.`,
      `Say the numbers in a row: seven, eight, nine. Now say *seven ate nine* quickly.`
    ],
    explain: `**Because seven ate nine**: 7, 8, 9. The word *ate* sounds just like *eight*, and eight sits between seven and nine. Two words that sound alike but are spelled differently are called **homophones**.`,
    data: {
      answer: { choice: 1, choices: [`Because seven is much bigger`, `Because seven ate nine`, `Because seven owes it money`, `Because seven is a lucky number`] },
      traps: [{ match: 0, msg: `Seven is bigger, true, but that is not the joke. Listen to the words instead of counting.` }],
      glyph: '789'
    },
    concepts: ['lateral'], tags: ['homophone', 'joke'], links: ['word-queue']
  },
  {
    id: 'word-incorrectly', title: 'Always Wrong', diff: 1,
    source: 'A traditional pun.',
    text: `Here is a riddle for a spelling bee:\n\n*Which word is always spelled wrong?*`,
    hints: [
      `Nobody is making a mistake. The riddle is about the word itself.`,
      `Read the question literally: the word that is spelled W-R-O-N-G.`
    ],
    explain: `**Wrong.** Whenever you spell it, you spell "wrong", so it is always spelled *wrong*. The pun plays on *wrong* as the name of the word and *wrong* as a mistake. (*Incorrectly* works the same way, so it is accepted too.)`,
    data: { answer: { text: ['wrong', 'incorrectly'], exact: true }, glyph: '✍' },
    concepts: ['lateral'], tags: ['pun', 'spelling'], links: ['word-accommodate']
  },
  {
    id: 'word-carpet', title: 'My First, My Second', diff: 1,
    source: 'The charade is a traditional parlour game; these lines are new.',
    text: `A *charade* is a riddle told in pieces: each small word is a clue of its own, and the pieces stuck together make the whole word.\n\n*My first will drive you to the shops;*<br>*my second sits purring by the fire;*<br>*my whole lies underfoot in the hall.*`,
    hints: [
      `The whole word is something you might vacuum. Try splitting it in two.`,
      `My first has four wheels and an engine; my second is a household pet.`
    ],
    explain: `**Car** + **pet** = **carpet**. That is the whole trick of a charade: each half is an ordinary word in its own right.`,
    data: {
      answer: { text: ['carpet', 'carpets'], exact: true },
      traps: [{ match: ['rug', 'mat', 'rugs'], msg: `A rug lies underfoot too, but where is the vehicle in it?` }],
      glyph: '🚗'
    },
    tags: ['charade'], links: ['word-hamlet']
  },
  {
    id: 'word-say-enemy', title: 'Say the Letters', diff: 1,
    text: `Say the names of these three letters out loud, one after another, without a pause:\n\n**N · M · E**\n\nWhat word do you hear? (It is not a friendly one.)`,
    hints: [
      `Use the names of the letters: *en*, *em*, *ee*.`,
      `Someone on the other side of a quarrel or a war.`
    ],
    explain: `**Enemy**: en-em-ee. Text messages and car number plates play the same game, letting the names of the letters do the spelling.`,
    data: { answer: { text: ['enemy', 'enemies', 'an enemy'], exact: true }, glyph: 'NME' },
    tags: ['homophone', 'letters'], links: ['word-queue']
  },
  {
    id: 'word-rhythm', title: 'No Vowels Needed', diff: 1,
    text: `Which six-letter word for *a regular pattern of beats* has not a single **A, E, I, O or U** in it?`,
    hints: [
      `A word needs a vowel sound, so one of its letters must be playing the part of a vowel. It is not A, E, I, O or U.`,
      `The stand-in vowel is Y: the word starts R-H-Y.`
    ],
    explain: `**Rhythm**: the Y does the work of a vowel. Other words that get by without A, E, I, O or U include *myth*, *gym*, *crypt*, *nymph* and *tryst*.`,
    data: {
      answer: { text: ['rhythm', 'rhythms'] },
      traps: [{ match: ['rhyme', 'tempo'], msg: `That word has a vowel in it. Which six-letter word for a pattern of beats needs none?` }],
      glyph: '♩'
    },
    tags: ['spelling', 'vowels'], links: ['word-facetious']
  },
  {
    id: 'word-goose', title: 'Plural Trouble', diff: 1,
    text: `Three of these four animals have a plural that looks exactly like the singular: *one ___, two ___*. The fourth changes its shape.\n\nWhich is the odd one out?`,
    hints: [
      `Say each one in a sentence: "I can see two …" and listen for the one that sounds odd.`,
      `One of them flies south for the winter in a V-shaped flock.`
    ],
    explain: `**Goose**: two *geese*. Sheep, deer and salmon keep the same form in the plural, and so do fish, moose and swine. Goose belongs to another old group that changes the vowel, like *foot* → *feet* and *tooth* → *teeth*.`,
    data: {
      answer: { choice: 2, choices: [`Sheep`, `Deer`, `Goose`, `Salmon`] },
      traps: [
        { match: 0, msg: `One sheep, two sheep. Look for the animal whose plural is spelled differently.` },
        { match: 1, msg: `One deer, two deer. Look for the animal whose plural is spelled differently.` },
        { match: 3, msg: `One salmon, two salmon. Look for the animal whose plural is spelled differently.` }
      ],
      glyph: '🦆'
    },
    tags: ['odd-one-out', 'plural']
  },
  {
    id: 'word-hidden-number', title: 'Where Is the Number?', diff: 1,
    text: `Four of these five words hide a number, spelled out in letters (from *one* to *ten*), somewhere among their letters. One does not.\n\nWhich word is the odd one out?`,
    hints: [
      `Look inside each word for a number: one, two, three … ten.`,
      `Try the endings: PH-ONE, FR-EIGHT, OF-TEN, CA-NINE.`
    ],
    explain: `**Plate.** *Phone* hides *one*, *freight* hides *eight*, *often* hides *ten* and *canine* hides *nine*. Plate only sounds as though it might: *ate* is a homophone of *eight*, but the letters E-I-G-H-T are not there.`,
    data: {
      answer: { choice: 0, choices: [`Plate`, `Phone`, `Freight`, `Often`, `Canine`] },
      traps: [
        { match: 1, msg: `Look at the last three letters of PHONE.` },
        { match: 2, msg: `Look at the last five letters of FREIGHT.` },
        { match: 3, msg: `Look at the last three letters of OFTEN.` },
        { match: 4, msg: `Look at the last four letters of CANINE.` }
      ],
      glyph: '10'
    },
    concepts: ['lateral'], tags: ['hidden', 'numbers'], links: ['word-goat-hidden']
  },
  {
    id: 'word-cryptic-rose', title: 'Up in the Garden', diff: 1,
    text: `A cryptic crossword clue says two things at once. The simplest kind, the *double definition*, gives two different meanings of the same word, one after the other. The number in brackets is the number of letters in the answer.\n\n**A flower stood up (4)**`,
    hints: [
      `Both halves are definitions: *a flower*, and *stood up*. One word does both jobs.`,
      `It is the past tense of the verb *rise*.`
    ],
    explain: `**Rose** is a flower, and it is also what you did when you *rose* from your chair. Two meanings, one spelling: that is all a double definition is.`,
    data: {
      answer: { text: ['rose', 'a rose'], exact: true },
      traps: [{ match: ['lily', 'iris'], msg: `That is a four-letter flower — but can it also mean *stood up*?` }],
      glyph: '🌹'
    },
    concepts: ['lateral'], tags: ['cryptic', 'double-definition'], links: ['word-cryptic-canoe']
  },

  /* ---------- fair ---------- */
  {
    id: 'word-goat-hidden', title: 'Hide and Seek', diff: 2,
    text: `An animal is hiding in this sentence. It is not inside any single word: it straddles the join between two neighbouring words.\n\n*Shall we go at once to the fair?*\n\nWhich animal?`,
    hints: [
      `Ignore the spaces and read the sentence as one long string of letters.`,
      `The animal is small enough to hide in two short words near the beginning: *go* and *at*.`
    ],
    explain: `**Goat**: shall we **go at** once. Push the words together — SHALLWEGOATONCETOTHEFAIR — and the animal jumps out from across the join.`,
    data: { answer: { text: ['goat', 'a goat'], exact: true }, glyph: '🐐' },
    tags: ['hidden'], links: ['word-hidden-two-animals', 'word-hidden-capital']
  },
  {
    id: 'word-short', title: 'A Longer Short Word', diff: 2,
    source: 'A traditional riddle.',
    text: `What five-letter word becomes **shorter** when you add two letters to it?`,
    hints: [
      `Do not think about the length in letters. Think about what the word *means*.`,
      `It is an adjective, and the two letters turn it into a comparison.`
    ],
    explain: `**Short**. Add *er* and you get *shorter*. The word is now two letters longer, but it has become a word that says *more short*: a pun between length in letters and length in meaning.`,
    data: {
      answer: { text: ['short'], exact: true },
      traps: [{ match: ['brief', 'small', 'little', 'tiny'], msg: `Close in meaning, but which word turns into *shorter* itself when you add two letters?` }],
      glyph: '↔'
    },
    concepts: ['lateral'], tags: ['letters', 'pun'], links: ['word-letter-m']
  },
  {
    id: 'word-they-see', title: 'What the Eyes Do', diff: 2,
    text: `The letters of **THE EYES** can be rearranged into a two-word sentence that says what eyes do. Use all seven letters, once each.\n\nWhat is the sentence?`,
    hints: [
      `Both new words are short, and the first is a pronoun like *we* or *you*.`,
      `Begin with T-H-E-Y.`
    ],
    explain: `**They see.** THE EYES has seven letters — T, H, E, E, Y, E, S — and THEY SEE uses exactly the same seven. An anagram that says something true about the phrase it comes from is the prize every anagram-maker hopes for.`,
    data: { answer: { text: ['they see', 'theysee'], exact: true }, glyph: '👀' },
    tags: ['anagram'], links: ['word-silent', 'word-morse-code']
  },
  {
    id: 'word-anagram-odd', title: 'Three Are Twins', diff: 2,
    text: `Three of these four words are anagrams of each other: the same six letters in a different order. One of them is not.\n\nWhich is the odd one out?`,
    hints: [
      `Count how many times each letter appears in a word. Does any word have a letter twice?`,
      `Three words share the letters A, E, L, P, S and T. One has two of the same letter.`
    ],
    explain: `**Please** has two E's, so it cannot be made from the letters of the others. *Petals*, *plates* and *staple* all use A, E, L, P, S and T once each (so do *pastel*, *palest* and *pleats*, if you want more of the family).`,
    data: {
      answer: { choice: 0, choices: [`Please`, `Petals`, `Plates`, `Staple`] },
      traps: [
        { match: 1, msg: `PETALS uses P, E, T, A, L, S. Compare it with the others.` },
        { match: 2, msg: `PLATES uses P, L, A, T, E, S. Compare it with the others.` },
        { match: 3, msg: `STAPLE uses S, T, A, P, L, E. Compare it with the others.` }
      ],
      glyph: 'abc'
    },
    tags: ['anagram', 'odd-one-out'], links: ['word-silent']
  },
  {
    id: 'word-bookkeeper', title: 'Double, Double, Double', diff: 2,
    text: `A familiar word names the person who looks after a firm's accounts. It has ten letters, and in the middle something happens that hardly ever happens in English: **three pairs of double letters in a row**, side by side, with no other letter between them.\n\nWhat is the word?`,
    hints: [
      `The job involves *keeping* the books.`,
      `It starts with something you read, and it ends with someone who holds on to things.`
    ],
    explain: `**Bookkeeper**: b-**oo**-**kk**-**ee**-p-e-r. It is a well-known example of a word with three double letters in a row; *bookkeeping* does it too. Most words never manage more than one pair.`,
    data: {
      answer: { text: ['bookkeeper', 'book keeper', 'bookkeepers', 'bookkeeping', 'book keeping'] },
      traps: [{ match: ['accountant', 'clerk', 'cashier'], msg: `That is a person with a similar job, but the word we want has three pairs of double letters in a row.` }],
      glyph: 'kk'
    },
    tags: ['spelling', 'double-letters'], links: ['word-accommodate', 'word-rhythm']
  },
  {
    id: 'word-left-hand', title: 'One-Handed Typing', diff: 2,
    text: `On a standard keyboard (the QWERTY layout) the left hand looks after the letters **Q W E R T**, **A S D F G** and **Z X C V B**. Every other letter belongs to the right hand.\n\nOnly one of these long words can be typed with the left hand alone. Which?`,
    hints: [
      `Cross out any word that has a right-hand letter in it: Y U I O P H J K L N M.`,
      `Each of the wrong words has a right-hand letter hiding in it: one has an H, one an M, one an I. Which word has none?`
    ],
    explain: `**Aftereffects** uses only A, F, T, E, R, C and S: all left-hand keys. Several other long words pass the test too, such as *stewardesses*, *reverberated* and *desegregated*. The culprits in the others: the H in sweetheart, the M, L, O and N in watermelons, and the I in reactivated.`,
    data: {
      answer: { choice: 1, choices: [`Sweetheart`, `Aftereffects`, `Watermelons`, `Reactivated`] },
      traps: [
        { match: 0, msg: `SWEETHEART: the H belongs to the right hand.` },
        { match: 2, msg: `WATERMELONS starts well — W, A, T, E, R — but then comes M.` },
        { match: 3, msg: `REACTIVATED goes well until the I.` }
      ],
      glyph: '⌨'
    },
    tags: ['keyboard', 'spelling'], links: ['word-typewriter']
  },
  {
    id: 'word-typewriter', title: 'The Top Row', diff: 2,
    text: `The top row of a QWERTY keyboard holds the letters **Q W E R T Y U I O P**.\n\nOne ten-letter word can be typed without your fingers ever leaving that row — and it names the very machine the QWERTY layout was arranged for.\n\nWhat is the word?`,
    hints: [
      `The machine has a ribbon, a carriage return and, in the old models, a little bell at the end of each line.`,
      `Type + writer.`
    ],
    explain: `**Typewriter**: T-Y-P-E-W-R-I-T-E-R, every letter on the top row. The QWERTY layout was arranged for typewriters in the 1870s, and it stayed on our keyboards long after the levers and ribbons disappeared. Other ten-letter words live on the top row too (*proprietor* and *repertoire* are two), but only one of them names the machine.`,
    data: {
      answer: { text: ['typewriter', 'type writer', 'typewriters'] },
      traps: [{ match: ['keyboard', 'computer', 'laptop'], msg: `That word uses letters from other rows. Every letter of the answer sits on the top row.` }],
      glyph: 'QWE'
    },
    tags: ['keyboard'], links: ['word-left-hand']
  },
  {
    id: 'word-almost', title: 'Climbing the Alphabet', diff: 2,
    text: `Six letters, and they stand in **alphabetical order** from the first to the last: each letter is the same as, or later in the alphabet than, the one before it.\n\nThe word means *nearly*. What is it?`,
    hints: [
      `It starts with A, and the letters that follow never step back down the alphabet.`,
      `It ends with S-T, and has an M in the middle.`
    ],
    explain: `**Almost**: A-L-M-O-S-T climbs the alphabet without a single step back. Others that do the same include *biopsy*, *chintz*, *begins* and *ghost*.`,
    data: {
      answer: { text: ['almost'] },
      traps: [{ match: ['nearly', 'nearby'], msg: `Same meaning, but the letters of *nearly* go N, E, A — down the alphabet. Find the word that always climbs.` }],
      glyph: 'A→Z'
    },
    tags: ['spelling', 'alphabet'], links: ['word-forty']
  },
  {
    id: 'word-noon', title: 'Any Way You Turn It', diff: 2,
    source: 'A traditional riddle.',
    text: `There is a four-letter word that, written in capital letters, looks exactly the same when you read it backwards *and* when you turn the page upside down.\n\nWhat is the word?`,
    hints: [
      `It is a time of day.`,
      `It is when the sun is highest, at twelve o'clock.`
    ],
    explain: `**Noon.** Backwards it is still NOON. Turned upside down, the letters are turned over and reversed in order, and N and O look the same both ways up, so it is NOON again. (SWIMS does the same trick with five letters: turned round, the W and the M turn into each other.)`,
    data: {
      answer: { text: ['noon', 'a noon'], exact: true },
      traps: [
        { match: ['mom', 'wow'], msg: `Turn it upside down: MOM becomes WOW! It has to look exactly the same.` },
        { match: ['toot', 'deed', 'peep', 'boob'], msg: `It reads the same backwards, but try turning it upside down: the letters do not survive.` }
      ],
      glyph: 'oo'
    },
    concepts: ['symmetry'], tags: ['palindrome', 'upside-down'], links: ['word-upside-down', 'word-panama']
  },
  {
    id: 'word-eternity', title: 'Beginnings and Ends', diff: 2,
    source: 'A traditional style of riddle, written here in new words.',
    text: `*I open <b>eternity</b> and close <b>time</b>;*<br>*I begin every <b>end</b> and finish every <b>place</b>.*\n\nWhich letter am I?`,
    hints: [
      `Look at the letters I mention: the first letter of *eternity*, the last letter of *time*, and so on.`,
      `I am the most common letter in English.`
    ],
    explain: `**E**: the first letter of *eternity* and of *end*, and the last letter of *time* and of *place*.`,
    data: { answer: { text: ['the letter E', 'E', 'letter E', 'an E'], exact: true }, glyph: 'E' },
    concepts: ['lateral'], tags: ['letters'], links: ['word-letter-m']
  },
  {
    id: 'word-initials-numbers', title: 'What Comes Next?', diff: 2,
    text: `Here are the first letters of some familiar words, in order:\n\n**O · T · T · F · F · S · S · E · N · ?**\n\nWhich letter comes next?`,
    hints: [
      `This is not a pattern in the alphabet. Think of the letters as the first letters of words you know very well.`,
      `They are words you say when you count.`,
      `One, two, three, four, five, six, seven, eight, nine — and then?`
    ],
    explain: `**T**, for *ten*. The letters are the first letters of one, two, three, four, five, six, seven, eight and nine, and the next number is ten.`,
    data: { answer: { text: ['the letter T', 'T', 'letter T', 'ten'], exact: true }, glyph: 'OTT' },
    concepts: ['sequence'], tags: ['initials', 'sequence'], links: ['word-first-a']
  },
  {
    id: 'word-acrostic', title: 'The Hidden Visitor', diff: 2,
    source: 'An acrostic; the verse is new.',
    text: `This little poem describes a frosty morning. But somebody is hiding in it. Read the first letter of each line, from top to bottom.\n\n*Beneath the hedge the frost lay thin,*<br>*A silver hush on field and lane;*<br>*Dew had frozen on the whin,*<br>*Grass was stiff with ice again;*<br>*Every window dark and blind,*<br>*Rooks still sleeping, none to mind.*\n\nWhich creature is hiding?`,
    hints: [
      `Do not read along the lines. Look down the left-hand edge.`,
      `The six capital letters at the starts of the lines spell out the visitor.`
    ],
    explain: `**Badger**: B-A-D-G-E-R down the left-hand edge. A poem whose first letters spell a word is called an *acrostic*.`,
    data: { answer: { text: ['badger', 'a badger', 'badgers'], exact: true }, glyph: '🦡' },
    tags: ['acrostic', 'hidden'], links: ['word-goat-hidden']
  },
  {
    id: 'word-queue', title: 'Four Letters to Spare', diff: 2,
    text: `There is a five-letter word that sounds exactly the same after you rub out its last four letters. Only the first letter is left standing, and the sound does not change at all.\n\nWhat is the word?`,
    hints: [
      `The letter that is left standing has a name that sounds like a word of its own: *kyoo*.`,
      `In Britain you join one at a bus stop.`
    ],
    explain: `**Queue**: the letter Q on its own is pronounced "kyoo", exactly like the whole word. The other four letters — U, E, U, E — are silent passengers.`,
    data: {
      answer: { text: ['queue', 'queues'], exact: true },
      traps: [{ match: ['cue', 'q'], msg: `Yes, that is how it sounds. But the word we want has five letters, and four of them are silent.` }],
      glyph: 'Q'
    },
    concepts: ['lateral'], tags: ['homophone', 'spelling'], links: ['word-six-seven', 'word-say-enemy']
  },
  {
    id: 'word-hamlet', title: 'Village or Prince', diff: 2,
    source: 'A charade; the lines are new.',
    text: `*My first is a pink, salty slice on a plate;*<br>*my second means "allow";*<br>*my whole is a very small village — and, with a capital letter, a prince who could not make up his mind.*`,
    hints: [
      `My first is a kind of pork.`,
      `Ham, and a word that means *permit*.`
    ],
    explain: `**Ham** + **let** = **hamlet**. A charade with a bonus: a hamlet is a tiny village, and *Hamlet* is Shakespeare's prince of Denmark.`,
    data: {
      answer: { text: ['hamlet', 'hamlets'] },
      traps: [{ match: ['village', 'town'], msg: `A village is the right kind of place, but the answer is a word made of two small words.` }],
      glyph: '🏘'
    },
    tags: ['charade'], links: ['word-carpet']
  },
  {
    id: 'word-horse', title: 'One Word, Three Fronts', diff: 2,
    text: `One word fits in front of all three of these, making a new word each time:\n\n**___fly · ___shoe · ___radish**\n\nWhat is it?`,
    hints: [
      `Think of an animal you can ride. One of the three words is a lucky charm that people nail above a door.`,
      `The animal has hooves and a mane.`
    ],
    explain: `**Horse**: horsefly, horseshoe, horseradish. (The *horse* in horseradish is usually explained as meaning "large" or "coarse".)`,
    data: {
      answer: { text: ['horse'], exact: true },
      traps: [{ match: ['butter', 'house', 'shoe'], msg: `Try your word in all three places at once. Does it work with every one of them?` }],
      glyph: '🐴'
    },
    tags: ['compound'], links: ['word-snow']
  },
  {
    id: 'word-accommodate', title: 'Two Doubles', diff: 2,
    text: `Only one of these four spellings is right. The word means *to provide room for*, and it is one that people are proud to get right, because it contains **two different pairs of double letters**.\n\nWhich is spelled correctly?`,
    hints: [
      `The word has two different pairs of double letters, not one.`,
      `One pair is C-C, and the other is M-M.`
    ],
    explain: `**Accommodate**: a-**cc**-o-**mm**-o-d-a-t-e, a double C and a double M. A way to remember it: the word is roomy enough to hold two of each.`,
    data: {
      answer: { choice: 2, choices: [`accomodate`, `acommodate`, `accommodate`, `acomodate`] },
      traps: [
        { match: 0, msg: `This one has the double C, but only one M.` },
        { match: 1, msg: `This one has the double M, but only one C.` },
        { match: 3, msg: `Not a single pair of doubles here. The word has two.` }
      ],
      glyph: 'cc'
    },
    tags: ['spelling', 'double-letters'], links: ['word-bookkeeper', 'word-incorrectly']
  },
  {
    id: 'word-cryptic-canoe', title: 'Rough Ocean', diff: 2,
    text: `In an *anagram* clue a word or phrase is shuffled to make the answer, and an indicator such as *rough*, *broken*, *wild* or *mixed* tells you to shuffle. The number in brackets is the number of letters in the answer.\n\n**Rough ocean gives a small boat (5)**`,
    hints: [
      `The clue has a definition (*a small boat*) and an instruction (*rough*: shuffle the next word).`,
      `Shuffle the letters O-C-E-A-N into a different five-letter word. Start with C.`
    ],
    explain: `**Canoe**: OCEAN with its letters tumbled. The definition is *a small boat*; *rough* says shuffle; *ocean* is what gets shuffled.`,
    data: { answer: { text: ['canoe', 'a canoe'], exact: true }, glyph: '🛶' },
    concepts: ['lateral'], tags: ['cryptic', 'anagram'], links: ['word-cryptic-rose', 'word-cryptic-eagle']
  },
  {
    id: 'word-ladder-warm', title: 'Cold to Warm', diff: 2,
    text: `A **word ladder** changes one letter at a time, and every rung must be a real word. For example, CAT → COT → DOT → DOG takes three steps.\n\nClimb from **COLD** to **WARM**. What is the smallest number of steps?`,
    hints: [
      `Each step changes exactly one letter. Compare COLD and WARM place by place: in how many places do they differ?`,
      `All four places differ, so no ladder can be shorter than four steps. Now look for one with exactly four.`,
      `Start COLD → CORD → …`
    ],
    explain: `**4.** COLD → CORD → CARD → WARD → WARM. All four letters of COLD differ from those of WARM, and a single step changes only one letter, so nobody can manage it in fewer than four steps. Lewis Carroll invented the game in the 1870s and called it *Doublets*.`,
    data: {
      answer: { num: 4 },
      traps: [
        { match: 3, msg: `Every one of the four letters of COLD is different from WARM, and one step can change only one letter. Count again.` },
        { match: [5, 6, 7], msg: `That ladder exists, but you can do better. What is the fewest steps?` }
      ],
      glyph: '🪜'
    },
    concepts: ['state-space'], tags: ['word-ladder'], links: ['word-ladder-gold']
  },
  {
    id: 'word-pangram', title: 'Every Letter Present', diff: 2,
    text: `A **pangram** is a sentence that uses every letter of the alphabet at least once. These four sentences look almost the same, but only one of them is a true pangram.\n\nWhich?`,
    hints: [
      `You will have to check letters. Writing A to Z on paper and crossing letters off as you read helps.`,
      `Ask what each small change would lose: the S of *jumps*, the D and G of *dog*, the J and M of *jumps*.`
    ],
    explain: `The classic sentence, **The quick brown fox jumps over the lazy dog**, contains all 26 letters. *Jumped* loses the S, *cat* loses the D and the G, and *leaps* loses the J and the M.`,
    data: {
      answer: { choice: 3, choices: [`The quick brown fox jumped over the lazy dog.`, `The quick brown fox jumps over the lazy cat.`, `The quick brown fox leaps over the lazy dog.`, `The quick brown fox jumps over the lazy dog.`] },
      traps: [
        { match: 0, msg: `Look for the letter S in that sentence.` },
        { match: 1, msg: `Where would the D and the G come from?` },
        { match: 2, msg: `Look for a J and an M in that sentence.` }
      ],
      glyph: 'A–Z'
    },
    tags: ['pangram', 'alphabet'], links: ['word-almost']
  },
  {
    id: 'word-panama', title: 'Read It Backwards', diff: 2,
    text: `A **palindrome** reads the same forwards and backwards once spaces and punctuation are ignored. This one is among the most famous:\n\n*A man, a plan, a canal — ___*\n\nWhich word finishes it?`,
    hints: [
      `Write the sentence without spaces and read it from the far end: the missing word has to mirror the beginning.`,
      `The canal joins two oceans in Central America.`
    ],
    explain: `**Panama.** Written without spaces it is AMANAPLANACANALPANAMA, which is the same from either end. The canal was dug across the country of the same name.`,
    data: {
      answer: { text: ['Panama'], exact: true },
      traps: [{ match: ['suez', 'suez canal'], msg: `Suez is a great canal too, but check the palindrome: the sentence must read the same from the other end.` }],
      glyph: '⇄'
    },
    concepts: ['symmetry'], tags: ['palindrome'], links: ['word-noon', 'word-fall-leaves']
  },
  {
    id: 'word-f-count', title: 'Count the Fs', diff: 2,
    text: `Read this sentence once, carefully, and count how many times the letter **F** appears in it, capital or small:\n\n*A life of fun for a fifth of the fishing fleet, after a fortnight of fog off the coast.*`,
    hints: [
      `Go slowly, word by word. Some words have more than one F.`,
      `Do not skip the little word *of*. It appears three times.`
    ],
    explain: `There are **15** Fs: life 1, of 1, fun 1, for 1, fifth 2, of 1, fishing 1, fleet 1, after 1, fortnight 1, of 1, fog 1, off 2. Most people skip the little word *of*, because the eye reads it as a joining word and not as a word with an F in it; that gives 12.`,
    data: {
      answer: { num: 15 },
      traps: [{ match: 12, msg: `You skipped something: the little word *of* has an F, and it appears three times.` }],
      glyph: 'F?'
    },
    tags: ['counting', 'letters'], links: ['word-letter-m']
  },
  {
    id: 'word-four', title: 'Exactly as Long as Itself', diff: 2,
    text: `Number names come in different lengths: *one* has three letters, *seven* has five. Among the positive whole numbers there is exactly one whose name has **as many letters as the number itself**.\n\nWhich number is it?`,
    hints: [
      `It is a small number. The bigger the number, the further its name falls behind it.`,
      `Try the numbers from one upwards, and count the letters in each name until the count catches up with the number.`
    ],
    explain: `**4**: *four* has four letters. *One* has three letters (too many for 1), *two* has three (too many for 2), *three* has five (too many for 3), *four* has four (just right), and from then on the names grow far more slowly than the numbers do: *five* has only four letters, and even *seventy-seven* has just twelve.`,
    data: {
      answer: { num: 4 },
      traps: [
        { match: 3, msg: `THREE has five letters, not three.` },
        { match: 5, msg: `FIVE has only four letters.` }
      ],
      glyph: '4=4'
    },
    concepts: ['sequence'], tags: ['numbers', 'counting'], links: ['word-sentence-count', 'word-first-a']
  },
  {
    id: 'word-reward', title: 'Turn It Around', diff: 2,
    text: `Something you get for a job well done becomes a **sliding compartment in a desk or a chest of drawers** when you spell it backwards.\n\nWhat word is it?`,
    hints: [
      `Write the word backwards, letter by letter, and see what appears.`,
      `Think of a prize, a bonus, or the money offered for finding a lost dog.`
    ],
    explain: `**Reward** backwards is **drawer**. Words that turn into other words when read backwards are called *semordnilaps* — which is *palindromes* spelled backwards.`,
    data: {
      answer: { text: ['reward', 'a reward', 'rewards'], exact: true },
      traps: [{ match: ['prize', 'bonus', 'medal', 'trophy'], msg: `A good thought, but does it turn into a drawer when you read it backwards?` }],
      glyph: '⇆'
    },
    tags: ['reversal'], links: ['word-cryptic-desserts']
  },

  /* ---------- tricky ---------- */
  {
    id: 'word-facetious', title: 'All Five in Order', diff: 3,
    text: `Here is a nine-letter word for *joking at a moment when a joke is not wanted*: treating a serious matter as though it were funny.\n\nIt has a remarkable property: it contains all five vowels, **A, E, I, O, U**, exactly once each, and they come in **alphabetical order**.\n\nWhat is the word?`,
    hints: [
      `The word starts with F, and the first vowel, A, comes second.`,
      `It ends in -TIOUS: F-A-C-E-T-…`
    ],
    explain: `**Facetious**: f-**A**-c-**E**-t-**I**-**O**-**U**-s. Another nine-letter word with the vowels in order is *arsenious* (a chemistry word) and *abstemious* does it with ten letters, but *facetious* is the one everyone quotes.`,
    data: {
      answer: { text: ['facetious', 'facetous'], exact: true },
      traps: [{ match: ['abstemious', 'arsenious'], msg: `That does have all five vowels in order, but it does not mean *joking at the wrong moment*.` }],
      glyph: 'AEI'
    },
    tags: ['spelling', 'vowels'], links: ['word-rhythm', 'word-almost']
  },
  {
    id: 'word-cleave', title: 'Its Own Opposite', diff: 3,
    text: `Some words are their own opposites. One short verb can mean **to split something apart** and also **to stick firmly to something**: a butcher does the first with a chopper, and a faithful friend does the second.\n\nWhat is the word?`,
    hints: [
      `It rhymes with *leave* and *weave*.`,
      `It begins with C. A butcher's chopper, a *cleaver*, is a relative.`
    ],
    explain: `**Cleave**: "the axe cleaved the log in two" and "they cleaved to one another". The two meanings come from two different Old English verbs that ended up with the same spelling. A word that is its own opposite is called a *contronym* or auto-antonym.`,
    data: {
      answer: { text: ['cleave', 'cleaves', 'cleaving', 'to cleave'], exact: true },
      traps: [{ match: ['sanction', 'bolt', 'dust', 'clip', 'leave'], msg: `That may be a word with two opposite meanings, or a near neighbour, but it is not this one: split apart, and stick together.` }],
      glyph: '⇋'
    },
    concepts: ['lateral'], tags: ['contronym'], links: ['word-short']
  },
  {
    id: 'word-forty', title: 'Numbers in Order', diff: 3,
    text: `Write out the numbers from **one** to **one hundred** in words (*twenty-one*, *ninety-nine*, and so on) and look at their letters. Exactly one of them has its letters in **alphabetical order**, from the first letter to the last.\n\nWhich number is it?`,
    hints: [
      `Rule out the small numbers first. ONE fails at once: the N comes before the O.`,
      `Try the tens: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety. Only one of them climbs.`,
      `F, O, R, T, Y.`
    ],
    explain: `**Forty**: F-O-R-T-Y climbs the alphabet. (By the same test, **one** is the only number up to a hundred whose letters run steadily the other way: O, N, E.)`,
    data: {
      answer: { text: ['forty', '40'], exact: true },
      traps: [{ match: ['four', '4'], msg: `FOUR is close: F, O, U, R — but the R comes before the U.` }],
      glyph: '40'
    },
    concepts: ['sequence'], tags: ['numbers', 'alphabet'], links: ['word-almost', 'word-first-a']
  },
  {
    id: 'word-upside-down', title: 'Turn the Page', diff: 3,
    text: `Turn a word upside down (half a turn, as if you spun the page round on the table) and some capital letters survive while others do not. **H, I, N, O, S, X** and **Z** look the same after the turn, and **M** and **W** turn into each other.\n\nWhich of these words, written in plain capital letters, read **exactly the same** when turned upside down? There may be more than one.`,
    hints: [
      `A half turn does two things: it reverses the order of the letters, and it turns each letter over.`,
      `MOM turns into WOW. Try the others in the same way.`,
      `T and D have no upside-down twin among the capitals.`
    ],
    explain: `**SWIMS** and **MOW**. A half turn reverses the order of the letters and turns each one over. In SWIMS the W and the M swap places and turn into each other, and the S and I look the same, so the word survives; MOW works the same way. MOM would give WOW, and TOOT and HOOD contain letters (T and D) that do not turn into letters.`,
    data: {
      answer: { multi: [0, 2], choices: [`SWIMS`, `MOM`, `MOW`, `TOOT`, `HOOD`] },
      glyph: '↻'
    },
    concepts: ['symmetry'], tags: ['upside-down'], links: ['word-noon']
  },
  {
    id: 'word-fall-leaves', title: 'Backwards by the Word', diff: 3,
    text: `A **word palindrome** reverses the *words*, not the letters. Read this autumn sentence forwards or backwards, word by word, and it comes out the same:\n\n*Fall leaves after ___ ___.*\n\nWhich two words finish it?`,
    hints: [
      `The sentence has five words, and the middle one is *after*. The words on either side must mirror each other.`,
      `The first word is *fall*, so the last word must be *fall* as well. What mirrors the second word, *leaves*?`
    ],
    explain: `**Leaves fall**: "Fall leaves after leaves fall." Around the middle word the others mirror each other: fall, leaves, after, leaves, fall. It even makes sense, with each word used twice in two ways: *fall* (the season) *leaves* (goes away) after *leaves* (on the trees) *fall* (drop).`,
    data: {
      answer: { text: ['leaves fall'], exact: true },
      traps: [{ match: ['fall leaves'], msg: `Read your sentence backwards, word by word. Does it say the same thing?` }],
      glyph: '⇄'
    },
    concepts: ['symmetry'], tags: ['palindrome', 'word-palindrome'], links: ['word-panama']
  },
  {
    id: 'word-ladder-gold', title: 'Lead into Gold', diff: 3,
    text: `The alchemists never managed it, but a word ladder can. Change **LEAD** into **GOLD**, one letter at a time, in **three steps**, and every step must be a real word:\n\n**LEAD → ? → ? → GOLD**\n\nWhat are the two words in the middle, in order?`,
    hints: [
      `LEAD and GOLD differ in three places, so each step fixes exactly one of them. Only the first three letters need to change; the D stays.`,
      `The first step changes the E: LEAD → L?AD, something you put on a lorry.`,
      `The second step turns the L into a G.`
    ],
    explain: `**LEAD → LOAD → GOAD → GOLD.** A goad is a pointed stick for driving cattle. No other three-step route works: changing the first letter first would give GEAD, and changing the third letter first would give LELD, and neither is a word.`,
    data: {
      answer: { text: ['load goad', 'load then goad', 'lead load goad gold', 'load goad gold', 'load → goad', 'load > goad', 'load to goad'], exact: true },
      traps: [{ match: ['lead gold', 'gold lead'], msg: `Those are the two ends of the ladder. What are the words in between?` }],
      glyph: 'Au'
    },
    concepts: ['state-space'], tags: ['word-ladder'], links: ['word-ladder-warm']
  },
  {
    id: 'word-spoonerism', title: 'The Slip of the Tongue', diff: 3,
    text: `A **spoonerism** swaps the opening sounds of two words. The name comes from the Reverend William Spooner, an Oxford don whose slips became famous; many of the stories about him were probably invented by other people.\n\nOne of them is supposed to have been aimed at a student: *"You have hissed all my mystery lectures."*\n\nWhat did he mean to say?`,
    hints: [
      `Two of the words have swapped their opening sounds. They are *hissed* and *mystery*.`,
      `Put an M sound in front of *-issed*, and an H sound in front of *-istery*, and listen to the results.`
    ],
    explain: `He meant *"You have missed all my history lectures."* The H of *history* and the M of *missed* changed places, so *missed* became *hissed* and *history* became *mystery*. Most of the Spooner collection is legend, but the trick of swapping opening sounds is real, and it makes a very good joke.`,
    data: {
      answer: { text: ['you have missed all my history lectures', 'missed all my history lectures', 'you missed all my history lectures', 'you have missed my history lectures', 'missed my history lectures'], exact: true },
      glyph: '🥄'
    },
    concepts: ['lateral'], tags: ['spoonerism'], links: ['word-say-enemy']
  },
  {
    id: 'word-hidden-two-animals', title: 'Two in the Sentence', diff: 3,
    text: `Two animals are hiding in this sentence, one small and one large. Neither is inside a single word: each straddles the join between neighbouring words.\n\n*We could not cheer at the bus that came late.*\n\nWhich two animals?`,
    hints: [
      `Ignore the spaces and read the letters as one long string.`,
      `The small one is a rodent, hidden where *cheer* meets *at*. The big one lives in the desert.`
    ],
    explain: `**Rat** and **camel**: CHEE**R AT** hides the rat, and **CAME L**ATE hides the camel (*came* plus the L of *late*). Each animal hides where one word ends and the next begins.`,
    data: {
      answer: { text: ['rat and camel', 'camel and rat', 'rat camel', 'camel rat', 'rat & camel', 'camel & rat'], exact: true },
      traps: [{ match: ['rat', 'camel', 'a rat', 'a camel'], msg: `That is one of them. There are two animals hiding.` }],
      glyph: '🐪'
    },
    tags: ['hidden'], links: ['word-goat-hidden', 'word-hidden-capital']
  },
  {
    id: 'word-hidden-capital', title: 'City Break', diff: 3,
    text: `A capital city is hiding in this sentence, spread across two neighbouring words:\n\n*Steam from the spa rising over the hills drifted away.*\n\nWhich city?`,
    hints: [
      `Run the letters together and look for a place name.`,
      `It is a European capital.`,
      `Look at the word *spa* and the word that follows it.`
    ],
    explain: `**Paris**: SPA + RISING gives S**PARIS**ING. The city hides in the join.`,
    data: { answer: { text: ['Paris'], exact: true }, glyph: '🗼' },
    tags: ['hidden'], links: ['word-goat-hidden', 'word-hidden-two-animals']
  },
  {
    id: 'word-cryptic-eagle', title: 'Found in Part', diff: 3,
    text: `In a *hidden-word* clue the answer is written out, letter after letter, inside the clue itself, across two or more words. Phrases like "found in", "some of" or "part of" show where to look.\n\n**Bird found in the sea gleaming (5)**`,
    hints: [
      `The words *found in* are the signpost: the answer is in the clue, unchanged.`,
      `Ignore the spaces in *the sea gleaming* and look for a five-letter bird.`
    ],
    explain: `**Eagle**: s**EA GLE**aming. The definition is *bird*, and *found in* says that the answer sits inside the words that follow.`,
    data: {
      answer: { text: ['eagle', 'an eagle'], exact: true },
      traps: [{ match: ['seagull', 'gull', 'sea gull'], msg: `The answer has five letters and sits inside the clue. Look through the letters of *the sea gleaming*.` }],
      glyph: '🦅'
    },
    concepts: ['lateral'], tags: ['cryptic', 'hidden'], links: ['word-cryptic-canoe', 'word-cryptic-desserts']
  },
  {
    id: 'word-cryptic-desserts', title: 'Stressed, Going Back', diff: 3,
    text: `In a *reversal* clue one word is written backwards, and words like "back", "returned" or "going west" tell you so.\n\n**Stressed, going back, for sweet courses (8)**`,
    hints: [
      `The clue has a definition (*sweet courses*) and wordplay (*stressed, going back*).`,
      `Take the word *stressed* and read it from the last letter to the first.`
    ],
    explain: `**Desserts**: STRESSED read backwards is DESSERTS. *Stressed* is a famous word that turns into another when it is reversed, which is why setters love it.`,
    data: {
      answer: { text: ['desserts'], exact: true },
      traps: [{ match: ['puddings', 'sweets', 'pudding', 'sweet'], msg: `That is what the answer means, but which word is it? Read *stressed* backwards.` }],
      glyph: '🍰'
    },
    concepts: ['lateral'], tags: ['cryptic', 'reversal'], links: ['word-reward', 'word-cryptic-eagle']
  },
  {
    id: 'word-eleven-plus-two', title: 'A Sum in Disguise', diff: 3,
    text: `A true sum can hide inside another. Shuffle all the letters of **ELEVEN PLUS TWO** (thirteen letters, none left over) to spell a sum with two *new* numbers: a number, then PLUS, then another number.\n\nWhat does it say?`,
    hints: [
      `Both sums make the same total, 13, so you are looking for another pair of numbers that adds up to thirteen.`,
      `Keep the word PLUS. One of the new numbers is a teen and the other is a single digit.`,
      `The teen is the one just above eleven.`
    ],
    explain: `**Twelve plus one** (or *one plus twelve*). ELEVEN PLUS TWO and TWELVE PLUS ONE use the same thirteen letters, and 11 + 2 = 12 + 1 = 13, so the anagram is true as well as clever. And, by chance, there are thirteen letters in each phrase.`,
    data: {
      answer: { text: ['twelve plus one', 'one plus twelve', 'twelve + one', 'one + twelve'], exact: true },
      glyph: '13'
    },
    tags: ['anagram', 'numbers'], links: ['word-morse-code', 'word-silent']
  },
  {
    id: 'word-first-a', title: 'The First A', diff: 3,
    text: `Count upward from one, and write each number in words the American way — *one hundred twenty-three* — without an "and". As you count, watch for the letter **A**.\n\nWhich is the first number whose name contains an A?`,
    hints: [
      `Go through the words in turn: the units, the teens, the tens. None of them has an A. What about *hundred*?`,
      `*Hundred* has no A either, so the answer is bigger than 999.`
    ],
    explain: `**1000**: *one thousand* is the first number with an A, because the units, the teens, the tens and *hundred* have none. (Other firsts: the first number with a D in its name is 100, with an I it is 5, and with an L it is 11.)`,
    data: {
      answer: { num: 1000 },
      traps: [{ match: 101, msg: `In British speech 101 is *one hundred and one*, and that "and" has an A. But here numbers are written without "and": one hundred one.` }],
      glyph: '1000'
    },
    concepts: ['sequence'], tags: ['numbers', 'letters'], links: ['word-initials-numbers', 'word-forty']
  },
  {
    id: 'word-uncopyrightable', title: 'Fifteen Different Letters', diff: 3,
    text: `A word in which no letter appears twice is called an *isogram*. Most isograms are short. This one has **fifteen letters**, and it means *not able to be protected by the law that stops other people copying a book or a song*.\n\nWhat is the word?`,
    hints: [
      `The law in question is called copyright. Begin with the little piece that means *not*.`,
      `Un- + copyright + -able.`
    ],
    explain: `**Uncopyrightable**: u-n-c-o-p-y-r-i-g-h-t-a-b-l-e, fifteen different letters. It is a well-known isogram; *dermatoglyphics* (the study of the ridges on fingertips) is another with fifteen.`,
    data: {
      answer: { text: ['uncopyrightable', 'uncopyrightible'], exact: true },
      traps: [{ match: ['dermatoglyphics'], msg: `That is a fifteen-letter isogram too, but it is not about the law of copying.` }],
      glyph: '15'
    },
    tags: ['isogram', 'spelling'], links: ['word-bookkeeper']
  },

  /* ---------- hard ---------- */
  {
    id: 'word-cryptic-anaesthetic', title: 'A Number for the Dentist', diff: 4,
    text: `Cryptic setters love to bend a word into another part of speech. Take **number**: most readers see a noun, but a solver can read it as the comparative of the adjective *numb*: *more numb*.\n\n**Number that helps at the dentist's (11)**`,
    hints: [
      `The word *number* is the trick: think of something that makes you *more numb*.`,
      `It is given by injection before the drill. It starts A-N-A.`
    ],
    explain: `**Anaesthetic** (American: *anesthetic*, ten letters): a "number" is anything that numbs you. It is one of the standard tricks of the cryptic crossword; in the same way a *flower* can be a river, because it flows.`,
    data: {
      answer: { text: ['anaesthetic', 'anesthetic', 'anaesthetics', 'anesthetics', 'anasthetic'], exact: true },
      traps: [{ match: ['painkiller', 'drug', 'medicine'], msg: `The right idea, but the answer has eleven letters, and a *number* is anything that makes you more numb.` }],
      glyph: '💉'
    },
    concepts: ['lateral'], tags: ['cryptic', 'definition'], links: ['word-cryptic-pirate']
  },
  {
    id: 'word-cryptic-pirate', title: 'Rat in the Pie', diff: 4,
    text: `In a *container* clue one piece of wordplay goes **inside** another; words like "inside", "holds", "about" or "swallows" show which one wraps which.\n\n**Sea robber, dessert with a rodent inside (6)**`,
    hints: [
      `The clue has a definition (*sea robber*) and instructions for building the word.`,
      `A three-letter dessert goes on the outside, and a three-letter rodent goes into the middle of it.`,
      `The dessert is PIE. It opens after its second letter, and the rodent slips in.`
    ],
    explain: `**Pirate**: PIE with RAT inside: PI + RAT + E. The definition is *sea robber*; *dessert* gives PIE; *with … inside* says to put the rodent within it.`,
    data: { answer: { text: ['pirate', 'a pirate', 'pirates'], exact: true }, glyph: '☠' },
    concepts: ['lateral'], tags: ['cryptic', 'container'], links: ['word-cryptic-anaesthetic', 'word-cryptic-anagram']
  },
  {
    id: 'word-cryptic-anagram', title: 'A Clue About Itself', diff: 4,
    text: `Some clues talk about themselves. This one is an anagram, and it tells you so.\n\n**A nag ram, mixed up — that's what this clue is (7)**`,
    hints: [
      `The words *mixed up* are the signpost: shuffle the words in front of them.`,
      `A NAG RAM has seven letters, and so does the answer. Shuffle them into a word you have met many times in this drawer.`
    ],
    explain: `**Anagram**: A NAG RAM, mixed up, is ANAGRAM — and *what this clue is* is an anagram. The definition and the wordplay describe each other.`,
    data: { answer: { text: ['anagram', 'an anagram', 'the anagram'], exact: true }, glyph: 'A→A' },
    concepts: ['lateral'], tags: ['cryptic', 'anagram'], links: ['word-cryptic-canoe', 'word-cryptic-pirate']
  },
  {
    id: 'word-morse-code', title: 'Dots and Dashes', diff: 4,
    text: `The twelve letters of **THE MORSE CODE** can be rearranged into a three-word announcement that is true of the code itself: it is made of dots.\n\nWhat is the announcement? Use all twelve letters, once each.`,
    hints: [
      `The three words are all short: four letters each.`,
      `One word greets a newcomer, and one is what the code is made of, besides dashes.`,
      `HERE … DOTS.`
    ],
    explain: `**Here come dots.** THE MORSE CODE and HERE COME DOTS use exactly the same twelve letters, and Morse code really is made of dots (and dashes). It is a favourite example of an anagram that fits its subject.`,
    data: {
      answer: { text: ['here come dots', 'here dots come', 'come here dots', 'come dots here', 'dots here come', 'dots come here'], exact: true },
      glyph: '· – ·'
    },
    tags: ['anagram'], links: ['word-they-see', 'word-eleven-plus-two']
  },
  {
    id: 'word-sentence-count', title: 'The Honest Sentence', diff: 4,
    text: `This sentence tells the truth about itself once you fill in the gap with a number written out in words:\n\n*This sentence has ___ letters.*\n\nCount letters only: no spaces, no hyphens. There are exactly **two** numbers that make the sentence true. What are they? (Give them as digits, separated by a comma.)`,
    hints: [
      `The words *This sentence has* and *letters* contain 22 letters between them. The number word must supply exactly enough more to make the total equal the number itself.`,
      `So you are looking for a number whose name has that number minus 22 letters. The numbers are in the thirties.`,
      `One of them is thirty-one: nine letters, and 22 + 9 = 31. The other is very close by.`
    ],
    explain: `**31 and 33.** *This sentence has* and *letters* hold 22 letters between them. *Thirty-one* has 9 letters and 22 + 9 = 31; *thirty-three* has 11 letters and 22 + 11 = 33. (*Thirty-two* also has 9 letters, which would make 31, not 32, so it does not work.)`,
    data: { answer: { nums: [31, 33], ordered: false }, glyph: '31' },
    concepts: ['lateral'], tags: ['numbers', 'self-reference', 'counting'], links: ['word-four', 'word-f-count']
  }
]);
