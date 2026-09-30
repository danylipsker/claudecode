/* The Puzzle Cabinet · data/world-riddles.js
 * Riddles, riddle-tales and word-games from the world's oral and written traditions,
 * retold in our own words. Every source line names a tradition or a book; where the
 * exact origin is not certain the line says "traditional" and names only the region.
 * (No translation is copied: each statement, hint and explanation is new.) */
(function () {
'use strict';

/* Ogham, the Irish tree alphabet: strokes on a stem line. Group 1 hangs below the line,
 * group 2 stands above it, group 3 slants across it, group 4 (the vowels) are short notches across it. */
const OGHAM = { B: [1, 1], L: [1, 2], F: [1, 3], S: [1, 4], N: [1, 5], H: [2, 1], D: [2, 2], T: [2, 3], C: [2, 4], Q: [2, 5], M: [3, 1], G: [3, 2], NG: [3, 3], Z: [3, 4], R: [3, 5], A: [4, 1], O: [4, 2], U: [4, 3], E: [4, 4], I: [4, 5] };
function oghamLetter(L, x, y) {
  const g = OGHAM[L][0], n = OGHAM[L][1], gap = 8, w = (n - 1) * gap;
  let s = '';
  for (let i = 0; i < n; i++) {
    const px = +(x - w / 2 + i * gap).toFixed(1);
    if (g === 1) s += '<line x1="' + px + '" y1="' + y + '" x2="' + px + '" y2="' + (y + 16) + '"/>';
    else if (g === 2) s += '<line x1="' + px + '" y1="' + y + '" x2="' + px + '" y2="' + (y - 16) + '"/>';
    else if (g === 3) s += '<line x1="' + (px - 6) + '" y1="' + (y + 13) + '" x2="' + (px + 6) + '" y2="' + (y - 13) + '"/>';
    else s += '<line x1="' + px + '" y1="' + (y - 7) + '" x2="' + px + '" y2="' + (y + 7) + '"/>';
  }
  return s;
}
// the inscription (a list of letters) with the key of all twenty letters below it
function oghamFigure(word) {
  const n = word.length, step = 58, x0 = 200 - (n - 1) * step / 2, y = 44;
  let s = '<g stroke="#3a3020" stroke-width="3.2" stroke-linecap="round" fill="none">';
  s += '<line x1="' + (x0 - 40) + '" y1="' + y + '" x2="' + (x0 + (n - 1) * step + 40) + '" y2="' + y + '" stroke-width="4.5"/>';
  word.forEach(function (L, i) { s += oghamLetter(L, x0 + i * step, y); });
  s += '</g>';
  s += '<line x1="30" y1="86" x2="370" y2="86" stroke="#3a3020" stroke-width="1" stroke-dasharray="3 4" opacity=".5"/>';
  s += '<text x="200" y="104" text-anchor="middle" font-size="13" font-family="Georgia,serif" fill="#3a3020">the key</text>';
  const rows = [['B', 'L', 'F', 'S', 'N'], ['H', 'D', 'T', 'C', 'Q'], ['M', 'G', 'NG', 'Z', 'R'], ['A', 'O', 'U', 'E', 'I']];
  const names = ['below the line', 'above the line', 'slanting across', 'notches across'];
  rows.forEach(function (r, ri) {
    const yy = 124 + ri * 62;
    s += '<text x="14" y="' + (yy + 4) + '" font-size="11" font-family="Georgia,serif" font-style="italic" fill="#3a3020">' + names[ri] + '</text>';
    r.forEach(function (L, ci) {
      const cx = 168 + ci * 50;
      s += '<g stroke="#3a3020" stroke-width="2.6" stroke-linecap="round" fill="none"><line x1="' + (cx - 24) + '" y1="' + yy + '" x2="' + (cx + 24) + '" y2="' + yy + '" stroke-width="3"/>' + oghamLetter(L, cx, yy) + '</g>';
      s += '<text x="' + cx + '" y="' + (yy + 31) + '" text-anchor="middle" font-size="13" font-weight="700" font-family="Georgia,serif" fill="#b0472f">' + L + '</text>';
    });
  });
  return s;
}

Cabinet.concepts([
  { id: 'riddle-craft', name: 'How riddles work', see: ['lateral', 'homophones'],
    text: 'Riddles on every continent use the same handful of tricks. The **impossible description that is true** (a house with no door, a bird with no wings). The **thing that speaks about itself**. The **pun** that only works in one language. The **paradox** with a hidden third way out, and the **riddle-tale**, where the question is put to a king, a sage or a trickster and the answer is a piece of quick thinking.\n\nMany peoples also have a spoken ritual for beginning: the Swahili riddler calls *Kitendawili!* and the listeners answer *Tega!* (“set it!”); in Yoruba the call is *Àló o!* and the answer *Àló!*. A riddle is a small contest, and every culture has agreed how to start it.' },
  { id: 'homophones', name: 'Puns and look-alike sounds', see: ['riddle-craft'],
    text: 'Words that sound alike, or characters that look alike, are the riddle-maker\'s favourite raw material. Chinese lantern riddles take a character apart into its pieces; Chinese *xiehouyu* end on a pun (“Confucius moves house”: all *shū*, which means both “books” and “losses”); a Spanish *adivinanza* finishes with a word that is also a command; a Japanese *nazo* hangs on two meanings of one sound. Puns do not travel well, so each of these puzzles explains the pun in the notes.' }
]);
Cabinet.family({
  id: 'world-riddles', engine: 'question', cat: 'riddles', name: 'Riddles of the world', order: 10,
  blurb: 'Lantern riddles from China, adivinanzas from Spain and Mexico, the Hodja\'s answers, a Yiddish counting song, Māori proverbs, a Zulu proverb and more: one riddle at a time from all over the world.',
  origin: { who: 'Storytellers everywhere', note: 'Riddles were told long before they were written, and every culture has its own way of asking: the Sanskrit prahelika, the Chinese dengmi on a festival lantern, the Filipino bugtong, the Māori whakataukī, the Swahili kitendawili. These are retold in fresh words, each with a note on where it comes from.' },
  concepts: ['lateral', 'riddle-craft']
}, [

  /* ---------- the Hebrew Bible, the Talmud and Yiddish tradition ---------- */
  {
    id: 'world-heb-solomon', title: 'The Sword and the Baby', diff: 1,
    source: 'The First Book of Kings, chapter 3 (the judgment of Solomon), told again.',
    text: 'Two women share a house, and each has a newborn son. One night one of the babies dies, and now both women swear the living baby is theirs. They bring their quarrel to King Solomon, and there are no witnesses.\n\nThe king calls for a sword. “Cut the living child in two,” he says, “and give half to each of them.”\n\nHow does he know which woman is the mother?',
    hints: ['Solomon never meant to use the sword. Listen to what each woman says when she hears the order.', 'One woman is content to see the baby divided. The other cries out.'],
    explain: 'The true mother cried, “Give her the living child, only do not kill it!” The other said, “Divide it; then it will be neither mine nor yours.” Solomon gave the baby to the first. The threat was a test: love that would rather lose the child than see it hurt shows itself in a moment. Versions of this trial are told in India and China as well: see [[world-ind-mahosadha]] and [[world-chn-chalk-circle]].',
    data: {
      ask: 'How does Solomon decide?',
      answer: { choice: 1, choices: ['He gives the baby to the woman who spoke first', 'He gives the baby to the woman who begged him to spare it, even at the price of losing it', 'He gives it to the woman who can name its birthmarks', 'He divides the baby, since fair is fair'] },
      traps: [{ match: 0, msg: 'Speaking first proves only that she spoke first. Look at what each said about the sword.' }, { match: 3, msg: 'Solomon would never have done it: the sword was only a test of the two women.' }],
      glyph: '⚔'
    },
    concepts: ['lateral'], links: ['world-ind-mahosadha', 'world-chn-chalk-circle']
  },
  {
    id: 'world-heb-mene', title: 'The Writing on the Wall', diff: 3,
    source: 'The Book of Daniel, chapter 5 (the feast of Belshazzar; the four words are in Aramaic).',
    text: 'King Belshazzar of Babylon is feasting with a thousand lords, and they are drinking from the golden cups taken from the Temple in Jerusalem, when the fingers of a human hand appear and write four words on the plaster of the wall:\n\n**MENE, MENE, TEKEL, UPHARSIN**\n\nNo one in Babylon can read them. At last the old exile Daniel is sent for. The words are the names of a coin and two weights, but Daniel hears verbs in them. What message does he read?',
    hints: ['The words are units of weight and money: a mina, a shekel, and half-pieces. Daniel turns each into an action done to the king.', 'What do you do with money? You count it. What do you do on a scale?'],
    explain: 'Daniel reads: God has **numbered** your kingdom and brought it to an end (*mene*); you have been **weighed** on the scales and found too light (*tekel*); your kingdom is **divided** (*peres*, the singular of *upharsin*) and given to the Medes and the Persians (the word *peres* sounds like *Paras*, “Persia”). The book says that very night the king was killed. The saying “the writing on the wall” comes from this feast.',
    data: {
      ask: 'What does the message say?',
      answer: { choice: 0, choices: ['Numbered, numbered, weighed, divided', 'Fire, water, earth, air', 'Come, see, conquer, rule', 'Gold, silver, bronze, iron'] },
      traps: [{ match: 3, msg: 'Gold, silver, bronze and iron are the metals of the great statue in an earlier dream of Daniel’s. Here the words are about counting and weighing.' }],
      glyph: '✋'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-heb-susanna', title: 'Under Which Tree?', diff: 2,
    source: 'The story of Susanna, in the Greek additions to the Book of Daniel (retold; it is not part of the Hebrew text).',
    text: 'Susanna, a respected woman of Babylon, is bathing in her garden when two elders, judges of the town who have been watching her, threaten her: give in to us or we will say we saw you with a young man. She refuses, and they carry out the threat. The assembly believes the two judges and condemns her to death.\n\nAs she is led away a young man named Daniel shouts that the town is killing an innocent woman without questioning the witnesses. He has the two elders separated, and asks each of them one question about the place where they say they saw the crime.\n\nWhat question does he ask?',
    hints: ['Two liars can agree on a story; they seldom agree on details they never planned.', 'It is a question about the garden, and it can be answered with one word.'],
    explain: 'Daniel asked, “Under which tree did you see them together?” The first elder said a mastic tree; the second, a holm-oak. Their stories did not agree, and the crowd, who a moment before were ready to stone Susanna, turned on her accusers. (In the Greek text Daniel plays on the names of the trees, which sound like the Greek for “cut you in two” and “saw you in two”.) The tale is sometimes called the first detective story.',
    data: {
      ask: 'What does Daniel ask?',
      answer: { choice: 0, choices: ['Under which tree did you see them together?', 'How tall was the young man?', 'What time of day was it?', 'What was Susanna wearing?'] },
      traps: [{ match: 1, msg: 'They could have agreed on that beforehand. Daniel asked about something in the garden that liars might not have thought to plan.' }, { match: 2, msg: 'A cunning liar has a time ready. Daniel’s question is about something the elders could see on the spot.' }],
      glyph: '🌳'
    },
    concepts: ['deduction'], links: ['world-ind-mahosadha']
  },
  {
    id: 'world-heb-echad-nine', title: 'Who Knows Nine?', diff: 2,
    source: 'The Passover Seder song *Echad Mi Yodea* (“Who knows one?”), a medieval counting song sung at the end of the Haggadah.',
    text: 'At the end of the Passover meal, families sing *Echad Mi Yodea*. Each verse is a small riddle that counts up: *Who knows one? I know one: our God. Who knows two? I know two: the two tablets of the covenant. Who knows three? I know three: the three fathers.* And so on, each verse adding one more and repeating all the earlier ones.\n\nSomewhere in the song comes the line: **Who knows nine? I know nine.** Nine what?',
    hints: ['The verses count things from the Bible and from Jewish life. Think of a number of months.', 'Nine is how long a baby is carried before it is born.'],
    explain: 'Nine **months of birth** (the months of a pregnancy). The song goes on: ten commandments, eleven stars (see [[world-heb-echad-eleven]]), twelve tribes, thirteen attributes of God. The same nine months lie behind the Queen of Sheba’s riddle *Nine go out, two pour, one drinks*: [[anc-sheba-nine]].',
    data: { answer: { text: ['nine months', 'months of pregnancy', 'months of birth', 'months of childbirth', 'months', 'pregnancy', 'childbirth', 'the months of pregnancy', 'the months of childbirth', 'nine months of pregnancy'] }, glyph: '9' },
    links: ['world-heb-echad-eleven', 'anc-sheba-nine']
  },
  {
    id: 'world-heb-echad-eleven', title: 'Who Knows Eleven?', diff: 3,
    source: 'The Passover Seder song *Echad Mi Yodea* (“Who knows one?”); the eleven stars are from Genesis 37:9.',
    text: 'In the Seder song *Echad Mi Yodea*, each number is a riddle. The verse for eleven asks: **Who knows eleven? I know eleven.**\n\nThe answer is a picture from a dream in the Book of Genesis, told by a boy to his brothers: *the sun, the moon and — how many? — bowed down to me.* Eleven what?',
    hints: ['Joseph, the second-youngest of twelve brothers, dreamed that the sun and the moon and eleven of these were bowing to him.', 'They are in the sky at night.'],
    explain: 'Eleven **stars**: in Joseph’s dream they stand for his eleven brothers, who bow to him. The brothers were not delighted with the dream, and sold him into Egypt, where the dream came true. (The song’s other numbers: five books of the Torah, six orders of the Mishnah, seven days of the week, eight days before circumcision.)',
    data: { answer: { text: ['stars', 'eleven stars', 'the stars', 'the eleven stars', 'stars in joseph’s dream', 'the stars of joseph’s dream', 'joseph’s stars', 'joseph’s brothers', 'the brothers', 'brothers'] }, glyph: '★' },
    links: ['world-heb-echad-nine']
  },
  {
    id: 'world-heb-avot-rich', title: 'Who Is Rich?', diff: 2,
    source: '*Pirkei Avot* (Sayings of the Fathers), chapter 4, the teaching of Ben Zoma, a Jewish sage of the second century.',
    text: 'The *Pirkei Avot*, the best-loved short book of Jewish wisdom, records a little quiz by the sage Ben Zoma. Each of his questions gets a surprising answer: *Who is wise? Who is strong? Who is honoured? Who is rich?*\n\nWhat does Ben Zoma say about **who is rich**?',
    hints: ['His answer is not about how much a person has.', 'It is about what a person feels about what they have.'],
    explain: '“Who is rich? The one who is glad with his portion.” The other answers are of the same kind: the wise person is the one who learns from everybody; the strong one, the one who masters his own impulses; the honoured one, the one who honours others. In each case he swaps a thing you can display for a habit of the heart.',
    data: {
      ask: 'Who is rich, according to Ben Zoma?',
      answer: { choice: 0, choices: ['The one who is glad with what he has', 'The one with the fullest barns', 'The one who owes nothing to anyone', 'The one who lends at good interest'] },
      traps: [{ match: 1, msg: 'A full barn is precisely the answer Ben Zoma was arguing against.' }, { match: 3, msg: 'That is how one becomes richer, not how one is rich.' }],
      glyph: '☺'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-heb-jotham-trees', title: 'The Trees Choose a King', diff: 2,
    source: 'The Book of Judges, chapter 9 (the fable of Jotham), told again.',
    text: 'The trees decided to appoint a king and went first to the **olive**. “Rule over us!” The olive answered: “Shall I give up my oil, which honours gods and men, to go and sway over the trees?” They asked the **fig**, who would not give up its sweetness and good fruit; and the **vine**, who would not give up its wine, which cheers gods and men.\n\nAt last they turned to a fourth plant. Which one said yes?',
    hints: ['The three useful trees all refuse. The one that accepts is the one with the least to lose.', 'It is a thorny plant that gives no fruit and hardly any shade.'],
    explain: 'The **bramble**, which said: “If you really want me as king, come and take shelter in my shade; if not, may fire come out of me and burn up the cedars of Lebanon.” Jotham told this fable to the people of Shechem, who had just made a murderous man king. The point: those who have something worth doing do not seek power, and those who seek it hardest may have nothing else to offer.',
    data: {
      ask: 'Which one agreed?',
      answer: { choice: 3, choices: ['The olive', 'The fig', 'The vine', 'The bramble'] },
      traps: [{ match: 0, msg: 'The olive turned it down: it had oil to give.' }, { match: 1, msg: 'The fig preferred its sweet fruit to ruling.' }, { match: 2, msg: 'The vine would not give up its wine.' }],
      glyph: '🌿'
    },
    concepts: ['lateral']
  },

  /* ---------- Arabic and Persian ---------- */
  {
    id: 'world-ara-palm', title: 'The Tree That Never Sheds', diff: 2,
    source: 'A report in the collections of the sayings of the Prophet Muhammad (*hadith*), among them the *Sahih al-Bukhari* (ninth century), told again.',
    text: 'A well-known report tells how the Prophet Muhammad once asked his companions a riddle: *“Among the trees there is one whose leaves never fall, and it is like a believer. Tell me which tree it is.”*\n\nThe men began to think of the trees of the desert valleys. A boy among them, Abdullah, son of Umar, thought of the answer at once but was too shy to speak in front of his elders. Which tree was it?',
    hints: ['It always stays green, and it is useful in every part: fruit, fibre, shade, wood.', 'It is the tree of every oasis and gives dates.'],
    explain: 'The **date palm**: evergreen, and useful all the year round in every one of its parts, like a good person in the Prophet’s comparison. When the boy told his father afterwards, his father said he wished the boy had spoken.',
    data: {
      answer: { text: ['date palm', 'the date palm', 'palm', 'a palm', 'palm tree', 'date palm tree', 'date tree', 'a date palm', 'a palm tree'] },
      traps: [{ match: ['olive', 'an olive', 'an olive tree', 'olive tree', 'cedar', 'acacia', 'cypress', 'pine', 'a pine'], msg: 'It is evergreen, but think of the tree that every desert household knows for its fruit.' }],
      glyph: '🌴'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-ara-ali-knowledge', title: 'Knowledge or Wealth?', diff: 2,
    source: 'A saying ascribed to Ali ibn Abi Talib (seventh century) in *Nahj al-Balagha*, a collection compiled some centuries later; scholars debate the ascriptions.',
    text: 'A saying in the Arabic tradition, attributed to Ali ibn Abi Talib, sets two kinds of riches against each other: knowledge and money. It says that knowledge is the better of the two, and gives a reason based on who has to look after whom.\n\nWhat is the reason?',
    hints: ['Think of who does the guarding: a rich person needs a lock and a watchman.', 'And what happens to each when you spend it?'],
    explain: '“Knowledge guards you, but you have to guard wealth.” The saying goes on: wealth shrinks when you spend it and knowledge grows when you share it; the rich man has many enemies and the learned man has many friends. It was a favourite of teachers, who quoted it to schoolboys.',
    data: {
      ask: 'Which reason is given?',
      answer: { choice: 0, choices: ['Knowledge guards you, but you must guard wealth', 'Wealth can buy knowledge, but knowledge cannot buy wealth', 'Knowledge is lighter to carry on a journey', 'Wealth lasts longer than knowledge'] },
      traps: [{ match: 1, msg: 'That is a clever thing to say, but the saying is about who protects whom.' }, { match: 3, msg: 'The saying says the opposite: knowledge grows when it is spent, wealth shrinks.' }],
      glyph: '📚'
    }
  },
  {
    id: 'world-per-simorgh', title: 'Thirty Birds', diff: 3, year: 1177,
    source: 'Farid ud-Din Attar, *The Conference of the Birds* (*Mantiq al-Tayr*), a Persian poem of the twelfth century.',
    text: 'In Attar’s great Persian poem the birds of the world set out to find their king, the **Simorgh**, who lives beyond seven valleys. The way is terrible, and thousands turn back, fall or die. At last just **thirty** birds arrive at the palace, bare-feathered and ashamed. They are led in — and there is no king. There is only a bright mirror in which they see each other.\n\nThen the poet makes his pun: in Persian *si* means “thirty” and *morgh* means “bird”. Who is the Simorgh?',
    hints: ['Read the name of the king as two words.', 'Who is standing at the palace when the mirror is held up?'],
    explain: 'The thirty birds themselves: *si-morgh*, “thirty birds”. The poem is a Sufi allegory in which the seeker and what is sought turn out to be one: the birds had the king in themselves all along, and only the long journey could show it. It is one of the great riddle-poems of the world, and the pun holds the whole poem together.',
    data: {
      ask: 'Who is the Simorgh?',
      answer: { choice: 0, choices: ['The thirty birds themselves: *si-morgh* means “thirty birds”', 'A giant bird who has flown away from the mountain', 'The hoopoe who led them there', 'No one: the king does not exist'] },
      traps: [{ match: 2, msg: 'The hoopoe is the guide of the journey, not the king.' }, { match: 3, msg: 'There is a king in the poem; the surprise is who he turns out to be.' }],
      glyph: '🐦'
    },
    concepts: ['lateral'], tags: ['pun']
  },
  {
    id: 'world-per-serendip', title: 'The Camel Nobody Saw', diff: 2,
    source: 'A Persian tale told by the poet Amir Khusrau (1302), retold in Italian in 1557 as the tale of the *Three Princes of Serendip*; it gave English the word serendipity (Horace Walpole, 1754).',
    text: 'Three young princes of Serendip (an old name of Sri Lanka) are travelling when a camel-driver asks whether they have seen his lost camel.\n\n“Was it blind in the right eye?” asks the eldest. “Was a tooth missing?” asks the second. “And was it lame?” asks the third. The driver is delighted: “Then you have seen it! Where?”\n\n“We have not seen it at all,” say the princes. The driver, of course, accuses them of stealing it, until the camel is found. How could the princes tell, from the road alone, that the camel was blind in the right eye?',
    hints: ['Where along the road would a hungry camel stop to eat?', 'Some of the grass at the roadside was bitten and some was not.'],
    explain: 'The grass at the **left** edge of the road had been eaten, while the fresher grass on the right had not been touched: the camel had eaten on the side it could see. The other clues were of the same kind: bits of chewed grass dropped where a tooth was missing, and a hoof-print dragged where the animal was lame. Sherlock Holmes would have been proud of them.',
    data: {
      ask: 'What did they see?',
      answer: { choice: 0, choices: ['Grass was eaten only at the left edge of the road', 'One footprint was deeper than the others', 'The tracks turned left at every bend', 'A villager told them'] },
      traps: [{ match: 1, msg: 'That is the sort of sign that shows a lame camel. What would show a blind eye?' }, { match: 3, msg: 'They said they had not seen the camel, and nobody told them: it was all in the tracks.' }],
      glyph: '🐪'
    },
    concepts: ['deduction']
  },

  /* ---------- Turkey: the Hodja ---------- */
  {
    id: 'world-tur-moon', title: 'Sun or Moon?', diff: 1,
    source: 'A story of Nasreddin Hodja, the wise fool of Turkish (and Persian, Arab and Central Asian) folklore. A Yiddish tale about the people of Chelm has the same answer.',
    text: 'Someone asks Nasreddin Hodja a serious question: “Which is more useful to us, the sun or the moon?”\n\nWhat does the Hodja answer?',
    hints: ['Think about when each of them shines.', 'One of them shines when it is dark anyway.'],
    explain: '“The moon, of course! The sun only shines in the daytime, when it is light already; the moon comes out at night, when we need it.” The story is also told in Yiddish about the wise men of Chelm. It is a fool’s answer, but it is very hard to argue with.',
    data: {
      ask: 'What does the Hodja say?',
      answer: { choice: 0, choices: ['The moon, because the sun shines when it is light anyway', 'The sun, because it makes the crops grow', 'Neither: both are too far away', 'The moon, because it is lonely'] },
      traps: [{ match: 1, msg: 'That is what a wise man would say. Nasreddin argues from a different direction.' }],
      glyph: '🌙'
    },
    concepts: ['lateral'], links: ['world-tur-key']
  },
  {
    id: 'world-tur-key', title: 'The Lost Key', diff: 1,
    source: 'A story of Nasreddin Hodja, told across Turkey, Iran, Central Asia and the Arab world (where he is called Juha).',
    text: 'Late one evening a neighbour finds Nasreddin on his hands and knees in the street, searching under a lamp-post. “What have you lost?” “My key.” The neighbour kneels down to help. After a long time he asks: “Are you sure you dropped it here?”\n\n“No,” says the Hodja, “I lost it in the house.”\n\n“Then why are we looking out here?” What does Nasreddin say?',
    hints: ['He has a reason, and it is not a good one.', 'It is about what you can see.'],
    explain: '“Because there is more light here than in the house.” The tale is told to point out a very common mistake: we search where searching is easy, not where the thing is. Scientists now call this the “streetlight effect”.',
    data: {
      ask: 'How does Nasreddin answer?',
      answer: { choice: 0, choices: ['There is more light here than in the house', 'A thief may have carried it into the street', 'The neighbour insisted on looking here', 'Keys roll downhill'] },
      traps: [{ match: 1, msg: 'That would be a reason. But Nasreddin’s reason is not a good one, it is a funny one.' }],
      glyph: '🔑'
    },
    concepts: ['lateral'], links: ['world-tur-moon']
  },
  {
    id: 'world-tur-pot', title: 'The Pot That Had a Baby', diff: 2,
    source: 'A story of Nasreddin Hodja, told across Turkey, Iran, Central Asia and the Arab world.',
    text: 'Nasreddin borrows a big cooking pot from his neighbour. When he brings it back there is a small pot inside. “What is that?” “Your pot had a baby while it was at my house.” The neighbour is delighted, and keeps both.\n\nA month later the Hodja borrows the pot again and does not bring it back. When the neighbour comes to ask, Nasreddin sighs: “I am sorry, your pot has died.”\n\n“Pots do not die!” cries the neighbour. What does Nasreddin reply?',
    hints: ['He is using the neighbour’s own words against him.', 'If a pot can have a baby...'],
    explain: '“You believed it could give birth. Why not believe that it can die?” The Hodja has caught the neighbour in his own greed: he cannot accept the small pot and reject the death. The story is told as a joke about people who believe only what suits them.',
    data: {
      ask: 'What does Nasreddin say?',
      answer: { choice: 0, choices: ['You believed it could have a baby: why not that it could die?', 'It has run away', 'It died of shame', 'You must have broken it yourself'] },
      traps: [{ match: 1, msg: 'A good excuse, but Nasreddin’s reply is a piece of logic.' }],
      glyph: '🍲'
    },
    concepts: ['paradox'], links: ['world-tur-coat']
  },
  {
    id: 'world-tur-coat', title: 'Eat, My Coat!', diff: 1,
    source: 'A story of Nasreddin Hodja, told across Turkey, Iran, Central Asia and the Arab world.',
    text: 'Nasreddin is invited to a rich man’s feast, but he arrives in his everyday clothes and the servants take no notice of him. He sits at the far end and no one brings him anything. He goes home, puts on his finest fur coat and comes back. This time he is bowed in and given the best seat and the best dishes.\n\nNasreddin takes a fold of his sleeve, dips it into the soup and says, loud enough for the whole room: ...\n\nWhat does he say?',
    hints: ['He believes it was not really him who was invited.', 'He speaks to the coat.'],
    explain: '“Eat, my coat, eat! It was you who were invited to the feast, not I.” He had learned something about who is welcome, and gave the company the choice of laughing or blushing.',
    data: {
      ask: 'What does he say?',
      answer: { choice: 0, choices: ['Eat, my coat, eat: it was you who were invited', 'This soup is not good enough for a coat', 'I am warming my sleeve', 'I am making a will for my coat'] },
      traps: [{ match: 1, msg: 'A rude thing to say, but Nasreddin makes a gentler point.' }],
      glyph: '🧥'
    },
    concepts: ['lateral'], links: ['world-tur-pot']
  },
  {
    id: 'world-tur-donkeys', title: 'Nine Donkeys', diff: 1,
    source: 'A story of Nasreddin Hodja; the counting mistake is told across the world, from India to Chelm.',
    text: 'Nasreddin sets out for the market riding a donkey and leading nine more. He counts them: nine! He gets down and counts again: ten! He climbs back up. Nine. “One of them disappears every time I get on!”\n\nEventually he decides it is better to walk than to ride and lose a donkey.\n\nWhich donkey keeps vanishing?',
    hints: ['Count the ones you can see from the saddle.', 'The Hodja forgets one animal every time.'],
    explain: 'The one **he is sitting on**. The Hodja counts only the donkeys ahead of him and forgets the one under him. The same mistake sits at the heart of a very old story of ten travellers who cross a river and count only nine.',
    data: {
      ask: 'Which one vanishes?',
      answer: { choice: 1, choices: ['The last one in the row', 'The one he is riding', 'The smallest one', 'None: he counted them wrongly on purpose'] },
      traps: [{ match: 0, msg: 'It is not the last: he can see all the ones in front. It is the one he cannot see.' }, { match: 3, msg: 'It is an honest mistake. He never counts one of them.' }],
      glyph: '🫏'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-tur-lecture', title: 'Do You Know What I Will Say?', diff: 2,
    source: 'A story of Nasreddin Hodja, told across Turkey, Iran, Central Asia and the Arab world.',
    text: 'One Friday Nasreddin climbs into the pulpit and asks the crowd: “Do you know what I am going to say?” “No,” answer the people. “Then there is no point in my telling you,” he says, and climbs down.\n\nThe next Friday he asks again. This time the crowd has learned, and shouts: “Yes!” “Then there is no need for me to tell you,” says the Hodja, and goes home.\n\nOn the third Friday half the people shout “Yes” and half shout “No”. What does the Hodja say?',
    hints: ['He needs an answer that works for both halves at once.', 'Who should tell whom?'],
    explain: '“Then let those who know tell those who do not!” He has beaten every possible answer: yes, no, and even yes and no. The story is a small lesson in how to close a trap; there is no way to answer the Hodja that he has not already prepared for.',
    data: {
      ask: 'What does he say?',
      answer: { choice: 2, choices: ['Then you are all wrong', 'Then I shall speak twice', 'Then let those who know tell those who do not', 'Then we will vote'] },
      traps: [{ match: 0, msg: 'He does not insult his audience. He gives half of them a job.' }, { match: 3, msg: 'A modern answer! The Hodja’s is quicker.' }],
      glyph: '📣'
    },
    concepts: ['lateral']
  },

  /* ---------- Russia and the Slavic lands ---------- */
  {
    id: 'world-rus-book', title: 'Not a Bush, Yet It Has Leaves', diff: 1,
    source: 'A traditional Russian riddle (*zagadka*), told again; the Russian original rhymes.',
    text: 'Three things it is not, and one it is:\n\n*It is not a bush, yet it has leaves. It is not a shirt, yet it is sewn. It is not a person, yet it tells you stories.*\n\nWhat is it?',
    hints: ['The “leaves” are the kind you turn.', 'The stitching holds them together at the spine.'],
    explain: 'A **book**: its leaves are pages, it is sewn (or stitched) at the back, and it tells stories without being anyone. The riddle first says what it is *not*, three times, which is a favourite trick in Russian riddles.',
    data: {
      answer: { text: ['a book', 'book', 'books', 'storybook', 'a storybook', 'novel', 'a novel', 'notebook'] },
      traps: [{ match: ['tree', 'a tree', 'bush', 'a bush', 'plant', 'shirt', 'a shirt', 'person', 'a person', 'man'], msg: 'That is one of the three things it is *not*! What has leaves and stitching and tells stories?' }],
      glyph: '📖'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-mushroom', title: 'Little Anton', diff: 1,
    source: 'A traditional Russian riddle (*zagadka*), told again with extra clues.',
    text: 'Little Anton stands on one leg, in a hat, in the forest. Children come looking for him in autumn and put him in a basket, and he never once complains.\n\nWho is Little Anton?',
    hints: ['He has a hat but no head, and one leg but no foot.', 'He grows in the shade of the trees and is good in soup.'],
    explain: 'A **mushroom**, with its single stalk and its cap. In Russia “going for mushrooms” is a national pastime, and the riddle gives the mushroom a friendly human name.',
    data: {
      answer: { text: ['a mushroom', 'mushroom', 'toadstool', 'a toadstool', 'mushrooms', 'fungus', 'a fungus', 'porcini', 'a boletus', 'boletus', 'cep'] },
      glyph: '🍄'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-frost', title: 'A Painter with No Hands', diff: 1,
    source: 'A traditional Russian riddle about winter (*zagadka*), told again.',
    text: 'It has no hands and no feet, and yet it paints wonderful pictures on the window in the night. It has no teeth, and yet it will bite your nose and your cheeks.\n\nWho is it?',
    hints: ['You can see it on the glass on a very cold morning.', 'The pictures look like ferns and feathers.'],
    explain: '**Frost** (in Russian tales, Grandfather Frost). It draws ferns and flowers on the inside of a cold window, and it nips noses. The riddle is told to children on winter mornings.',
    data: {
      answer: { text: ['frost', 'jack frost', 'grandfather frost', 'the frost', 'ded moroz', 'freezing cold', 'winter', 'the cold', 'ice', 'hoar frost', 'hoarfrost'] },
      traps: [{ match: ['snow', 'snowflake', 'wind', 'a painter', 'a ghost'], msg: 'Close to winter, but this one paints on the glass and nips at faces.' }],
      glyph: '❄'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-carrot', title: 'The Maiden in the Dungeon', diff: 2,
    source: 'A traditional Russian riddle (*zagadka*), told again.',
    text: '*A red maiden sits in a dark dungeon, and her green braid hangs out in the street.*\n\nWhat is she?',
    hints: ['The dungeon is a place under the ground.', 'The braid is what you pull to get her out.'],
    explain: 'A **carrot**, sitting in the dark earth with its green tops in the open air. (The word “red” in Russian folk tales also means “lovely”; a beetroot or radish would fit the picture almost as well, and the riddle-teller would accept them with a smile.)',
    data: {
      answer: { text: ['a carrot', 'carrot', 'carrots', 'beetroot', 'a beetroot', 'beet', 'a beet', 'radish', 'a radish', 'turnip', 'a turnip', 'root vegetable'] },
      traps: [{ match: ['a girl', 'girl', 'a maiden', 'maiden', 'a princess', 'princess', 'a prisoner'], msg: 'It is a maiden only in the riddle. What grows in the dark earth with its braid of green in the air?' }],
      glyph: '🥕'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-icicle', title: 'Growing Head-Down', diff: 2,
    source: 'A traditional Russian riddle (*zagadka*), told again.',
    text: '*She grows with her head downwards. She grows not in the summer but in the winter. But when the sun warms her, she weeps and dies.*\n\nWhat is she?',
    hints: ['She hangs from the edge of the roof.', 'She is clear and pointed, and she cries in the sunshine.'],
    explain: 'An **icicle**: it grows downwards from the eaves, only in winter, and the warm sun melts it into drops, which the riddle calls tears.',
    data: {
      answer: { text: ['an icicle', 'icicle', 'icicles', 'a frozen drip', 'ice', 'a stalactite', 'stalactite'] },
      traps: [{ match: ['a tree', 'tree', 'a plant', 'a carrot', 'a person', 'a bat', 'snow'], msg: 'A good try at something upside-down! But this one is made of water and goes in the spring sun.' }],
      glyph: '🧊'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-snow', title: 'It Roars When It Dies', diff: 2,
    source: 'A traditional Russian riddle (*zagadka*), told again.',
    text: '*It flies without a sound. It lies without a sound. But when it dies, then it roars.*\n\nWhat is it?',
    hints: ['It comes down in winter and lies on the ground.', 'When it “dies” in spring, you hear the streams.'],
    explain: '**Snow**: it falls quietly and lies quietly, and when it melts in spring the streams and gutters roar with the water. A riddle that ends on the sound of the thaw is a Russian favourite.',
    data: {
      answer: { text: ['snow', 'the snow', 'snowflakes', 'snowfall', 'a snowflake', 'snowflake'] },
      traps: [{ match: ['rain', 'hail', 'a bird', 'a cloud', 'the wind', 'wind', 'a thunderstorm', 'thunder'], msg: 'Not quite: it lies on the ground for weeks and roars only when it melts.' }],
      glyph: '🌨'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-year-oak', title: 'The Oak with Twelve Boughs', diff: 3,
    source: 'A traditional Russian riddle about the year, recorded in the nineteenth-century collections of folk riddles, told again.',
    text: '*An oak stands, and on the oak there are twelve boughs. On every bough are four nests, and in every nest are seven eggs.*\n\nWhat is the oak?',
    hints: ['Twelve, four and seven are numbers that go with a calendar.', 'Twelve boughs, and on each four smaller things, and on each of those seven.'],
    explain: 'The **year**: twelve months, each of four weeks, each week of seven days. (Four weeks a month makes 12 × 4 × 7 = 336 days, a little short of the 365 a year really has: riddles round their numbers.) Two other riddles in the cabinet ask the same question in other ways: the Greek [[anc-cleobulus-year]] and the Sanskrit [[anc-rigveda-wheel]], all built on twelve.',
    data: {
      answer: { text: ['the year', 'year', 'a year', 'one year', 'the calendar', 'calendar', 'a calendar year', 'time'] },
      traps: [{ match: ['a tree', 'tree', 'an oak', 'oak', 'an oak tree', 'a bird'], msg: 'It is an oak in the picture only. What is made of twelve, then four, then seven?' }, { match: ['month', 'months', 'the months', 'week', 'weeks', 'day', 'days'], msg: 'Those are the branches. What is the whole tree made of them?' }],
      glyph: '336',
      figure: {
        w: 400, h: 230,
        svg: (function () {
          let s = '<path d="M200 198 L200 130" stroke="#3a3020" stroke-width="12" stroke-linecap="round"/>';
          for (let k = 0; k < 12; k++) {
            const a = (-160 + k * (140 / 11)) * Math.PI / 180;
            const x = 200 + 150 * Math.cos(a), y = 130 + 118 * Math.sin(a) * 0.9;
            s += '<path d="M200 138 Q' + (200 + 70 * Math.cos(a)).toFixed(1) + ' ' + (138 + 60 * Math.sin(a)).toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + '" fill="none" stroke="#3a3020" stroke-width="4" stroke-linecap="round"/>';
            for (let n = 0; n < 4; n++) {
              const t = 0.4 + n * 0.17;
              const nx = 200 + (x - 200) * t, ny = 138 + (y - 138) * t;
              s += '<circle cx="' + nx.toFixed(1) + '" cy="' + ny.toFixed(1) + '" r="4.2" fill="#e9dfc4" stroke="#b0472f" stroke-width="1.6"/>';
            }
          }
          s += '<text x="200" y="222" text-anchor="middle" font-size="13" font-family="Georgia,serif" fill="#3a3020">twelve boughs · four nests each · seven eggs a nest</text>';
          return s;
        })()
      }
    },
    concepts: ['lateral', 'geometric-series'], links: ['anc-cleobulus-year', 'anc-rigveda-wheel']
  },
  {
    id: 'world-rus-riders', title: 'The Three Riders', diff: 1,
    source: 'The Russian fairy tale *Vasilisa the Beautiful*, collected by Alexander Afanasyev in the 1850s.',
    text: 'In the Russian tale, a girl called Vasilisa is sent by her stepmother into the forest to fetch a light from the witch Baba Yaga. As she walks she meets three riders. First comes a rider all in white, on a white horse, and dawn breaks. Then comes a rider all in red on a red horse, and the sun rises. Last, a rider all in black on a black horse, and night falls.\n\nWhen Vasilisa asks Baba Yaga who they are, the witch says: “The white one is my bright day, the black one is my dark night, and the red one is ...”\n\nWho is the red rider?',
    hints: ['The three riders are the three parts of a day.', 'The red rider comes between the white one and the black one, and the sun rises with him.'],
    explain: '“My red sun.” The three riders are day, sun and night, all Baba Yaga’s faithful servants, and Vasilisa does well not to ask more about them: the witch warns that too many questions make one old very quickly.',
    data: {
      ask: 'Who is the red rider?',
      answer: { choice: 1, choices: ['My bright day', 'My red sun', 'My dark night', 'My cold winter'] },
      traps: [{ match: 0, msg: 'The bright day is the white rider, who came first.' }, { match: 2, msg: 'The night is the black rider, who came last.' }],
      glyph: '🐎'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-rus-wise-girl', title: 'Neither Clothed nor Naked', diff: 3,
    source: 'The folk tale of the clever peasant girl, told in Grimm’s collection (no. 94, “The Peasant’s Clever Daughter”) and in many Slavic versions.',
    text: 'A king, impressed by a peasant’s clever daughter, declares that he will marry her if she can come to him:\n\n**neither clothed nor naked, neither riding nor driving, and neither on the road nor off the road.**\n\nShe is up to it. Which of these is how she arrives?',
    hints: ['Every one of the three conditions has a way round it, and all three use things you can find around a farm.', 'A net is not clothing and does not leave you bare either.'],
    explain: 'She wraps herself in a **fishing net**, so she is neither clothed nor naked. She ties the net to the tail of a **donkey** that drags her along, so she is neither riding nor driving. And the donkey drags her along in the wheel-rut, so that only her **big toe** touches the road: neither on the road nor off it. (In some Slavic tellings the king also demands that she come neither with a gift nor without, and she brings a bird that flies away when he reaches for it.) The king married her.',
    data: {
      ask: 'How does she come?',
      answer: { choice: 0, choices: ['Wrapped in a fishing net, dragged behind a donkey, with one toe in the wheel-rut', 'In a nightgown, on horseback, at the very edge of the road', 'In her best dress, in a sedan chair, down the middle of the road', 'In a sack, on foot, along the ditch'] },
      traps: [{ match: 1, msg: 'A nightgown counts as clothing, and she would be riding.' }, { match: 2, msg: 'That satisfies none of the three conditions!' }, { match: 3, msg: 'A sack is a garment, and she would be walking. She has to find a third way in each pair.' }],
      glyph: '🕸'
    },
    concepts: ['lateral', 'paradox']
  },

  /* ---------- Scandinavia and the Old North ---------- */
  {
    id: 'world-nor-alvis', title: 'The Dwarf and the Dawn', diff: 2,
    source: 'The Old Norse poem *Alvíssmál* (“The Sayings of All-Wise”) in the Poetic Edda, Iceland (written down in the thirteenth century).',
    text: 'The dwarf Alvis (“All-Wise”) arrives to claim the daughter of the god Thor, who was promised to him while Thor was away. Thor eyes the pale, short-legged bridegroom and says he must pass a test first: name, in the language of each world, the earth, the sky, the moon, the sun, the wind, the sea, fire, and more.\n\nAlvis answers each question perfectly. And yet at the end of the night he loses everything. How does Thor beat him?',
    hints: ['Thor never claimed any of the answers was wrong.', 'Dwarfs of Norse tales cannot stand daylight.'],
    explain: 'Thor kept the dwarf talking until the **sun rose**: a dwarf caught above ground in daylight turns to stone. The poem ends with the god’s remark that the sun is shining in the hall. It is one of the oldest stories of winning by stalling.',
    data: {
      ask: 'How does Thor win?',
      answer: { choice: 0, choices: ['He keeps the dwarf talking until sunrise, which turns dwarfs to stone', 'He asks a question the dwarf cannot answer', 'He throws the dwarf out of the hall', 'He strikes him with his hammer'] },
      traps: [{ match: 1, msg: 'Alvis answered every one. Thor’s trick has nothing to do with the answers.' }, { match: 3, msg: 'Thor is known for his hammer, but in this poem he wins with words.' }],
      glyph: '🌅'
    },
    concepts: ['lateral'], links: ['world-nor-thrym']
  },
  {
    id: 'world-nor-thrym', title: 'The Bride with a Big Appetite', diff: 2,
    source: 'The Old Norse poem *Þrymskviða* (“The Lay of Thrym”) in the Poetic Edda, Iceland (written down in the thirteenth century).',
    text: 'The giant Thrym has stolen Thor’s hammer and will give it back only in exchange for the goddess Freyja as his bride. Freyja refuses, so the gods dress Thor in a wedding gown and a veil, and Loki goes with him as the “maid”.\n\nAt the wedding feast the “bride” eats an entire ox, eight salmon, and every delicacy laid out for the women, and drinks three barrels of mead. Thrym stares. Later, when he lifts the veil for a kiss, he starts back: “Why are her eyes so terrible? They seem to burn like fire!”\n\nWhat does Loki, the quick-witted maid, tell him?',
    hints: ['Loki needs one explanation that covers both the hunger and the eyes.', 'The explanation is flattering to Thrym.'],
    explain: 'Loki says that Freyja has not eaten for **eight nights**, so eager was she to come to the giants, and has not slept for eight nights either. Thrym, flattered, brought out the hammer to bless the bride, and Thor took it and struck him down. One of the funniest scenes in the whole of Norse poetry.',
    data: {
      ask: 'What does Loki say?',
      answer: { choice: 0, choices: ['Freyja has neither eaten nor slept for eight nights, she was so eager to come', 'Brides of the gods always eat like this', 'She is fasting for a great feast tomorrow', 'She has caught a cold, and it has gone to her eyes'] },
      traps: [{ match: 1, msg: 'Loki cannot expect Thrym to believe something so silly. He needs a story that flatters the giant.' }],
      glyph: '🔨'
    },
    concepts: ['lateral'], links: ['world-nor-alvis']
  },
  {
    id: 'world-nor-kenning-sky', title: 'Ymir’s Skull', diff: 2,
    source: 'Old Norse verse and Snorri Sturluson’s *Prose Edda* (Iceland, c. 1220), which explains the poets’ word-pictures called kennings.',
    text: 'The Norse poets loved to say things sideways, by *kennings*: two words that stand for one thing, like the riddles of a game.\n\nIn the old story the gods killed the giant Ymir and made the world from his body: the earth from his flesh, the sea from his blood, the mountains from his bones, the trees from his hair. What, then, would a poet mean by **Ymir’s skull**?',
    hints: ['What is a great bowl, turned upside down, over the flesh, the blood and the bones?', 'The gods put a dwarf at each of its four corners to hold it up.'],
    explain: 'The **sky**: the skull of Ymir, held up by four dwarfs (called East, West, North and South). For a Norse poet the whole world is one body, and the sky an upturned bowl above it.',
    data: {
      answer: { text: ['sky', 'the sky', 'the heavens', 'heaven', 'heavens', 'the firmament', 'the vault of heaven', 'the dome of the sky'] },
      traps: [{ match: ['earth', 'the earth', 'the sea', 'sea', 'mountain', 'mountains', 'a mountain', 'the mountains'], msg: 'Those were made from Ymir’s flesh, blood and bones. The skull is the roof over them all.' }],
      glyph: '☁'
    },
    concepts: ['lateral'], links: ['world-nor-kenning-gold', 'world-nor-whale-road']
  },
  {
    id: 'world-nor-kenning-gold', title: 'Sif’s Hair', diff: 2,
    source: 'Old Norse verse and Snorri Sturluson’s *Prose Edda* (Iceland, c. 1220): in the *Skáldskaparmál* gold is called “Sif’s hair” and “Freyja’s tears”.',
    text: 'The goddess Sif, Thor’s wife, woke one morning to find that her golden hair had been cut off by the trickster Loki for a joke. Thor was ready to break every bone in Loki’s body. Loki went to the dwarfs, who forged a new head of hair for Sif that would grow on her head like real hair, though it was made of one thing only.\n\nSo when a poet says **Sif’s hair** — or **Freyja’s tears**, for Freyja is said to have wept for her lost husband — what is he talking about?',
    hints: ['The hair was forged, not grown, and dwarfs are metalworkers.', 'The tears of Freyja were red gold, according to the poets.'],
    explain: '**Gold**. Skalds (Norse poets) kept a whole shining vocabulary of names for gold, and “Sif’s hair” and “Freyja’s tears” are two of the best known. The dwarfs who forged Sif’s new hair, the sons of Ivaldi, made Odin’s spear Gungnir and the ship Skidbladnir at the same time.',
    data: {
      answer: { text: ['gold', 'the gold', 'golden', 'gold metal', 'treasure', 'gold treasure'] },
      traps: [{ match: ['silver', 'wheat', 'corn', 'straw', 'sunlight', 'the sun', 'sun', 'amber'], msg: 'Nearly the colour, but forged by dwarfs, so it is a metal.' }],
      glyph: '✨'
    },
    concepts: ['lateral'], links: ['world-nor-kenning-sky']
  },
  {
    id: 'world-nor-whale-road', title: 'The Whale-Road', diff: 1,
    source: 'Old English poetry: *Beowulf* (the “whale-road”, *hronrad*) and *The Seafarer*. The kenning survives in the Norse poems too.',
    text: 'The poet of *Beowulf* says that Beowulf’s ship went “over the whale-road”, and elsewhere in the poem the same thing is “the swan-road” and “the gannet’s bath”. All three are word-pictures for one thing that spreads out between the lands.\n\nWhat is the **whale-road**?',
    hints: ['Which road has whales, gannets and swans travelling along it?', 'Ships, too.'],
    explain: 'The **sea**. Old English and Norse poets did not name things directly if they could give them a picture: the sea is a road for whales, a ship is a “wave-floater”, the body a “bone-house”, and a king is a “ring-giver”.',
    data: {
      answer: { text: ['the sea', 'sea', 'the ocean', 'ocean', 'the waves', 'sea road', 'the seas', 'the open sea'] },
      traps: [{ match: ['a road', 'road', 'a river', 'river', 'the river', 'a whale', 'whale', 'the shore', 'a harbour'], msg: 'Whales do not live on land roads. Where do they travel?' }],
      glyph: '🐋'
    },
    concepts: ['lateral'], links: ['world-nor-kenning-sky', 'world-nor-bone-house']
  },
  {
    id: 'world-nor-bone-house', title: 'The Bone-House', diff: 2,
    source: 'Old English poetry: *Beowulf* (the “bone-house”, *banhus*), told again.',
    text: 'In *Beowulf* the old hero remembers a fight of his youth, when he met a champion of the Franks and killed him with nothing but the grip of his hands. The poet says that Beowulf crushed the man’s **bone-house**.\n\nWhat is a bone-house?',
    hints: ['It has a ribcage for a roof and a spine for a beam.', 'It is where a person lives.'],
    explain: 'The **body**: a house of bones in which a person lives for as long as he does. The poet is saying that Beowulf broke his enemy’s ribs with his bare hands. It is one of the most famous kennings in Old English, and it shows how much the poets could say in two words.',
    data: {
      answer: { text: ['the body', 'body', 'a body', 'human body', 'the human body', 'skeleton', 'a skeleton', 'the skeleton', 'the flesh', 'the corpse'] },
      traps: [{ match: ['a grave', 'grave', 'a tomb', 'tomb', 'a coffin', 'coffin', 'a church', 'a hall'], msg: 'A grave holds bones too, but it is the poet’s word for what the soul leaves behind, not for where the body is put.' }],
      glyph: '🦴'
    },
    concepts: ['lateral'], links: ['world-nor-whale-road']
  },
  {
    id: 'world-nor-troll-stone', title: 'Water from a Stone', diff: 1,
    source: 'A Norwegian folk tale from the collection of Asbjørnsen and Moe (1840s), “The Boy who had an Eating Match with the Troll”.',
    text: 'A troll picks up a stone and squeezes it so hard that water runs out. “Can you do that?” he sneers to Ashlad, a boy who has come to his forest with nothing but a bag over his shoulder.\n\n“Anyone could,” says the boy, and picks up a stone of his own, and squeezes it. Whey runs out of it, all over the troll’s feet.\n\nWhat is in the boy’s hand?',
    hints: ['It looks like a smooth, pale stone; the boy had it in his bag.', 'Whey is what comes out of it when you press the curds.'],
    explain: 'A **cheese** — a soft, white one, which the boy had swapped for a stone so quickly that the troll never noticed. The tale is an old favourite in Norway. The tricks continue in [[world-nor-troll-eating]].',
    data: {
      answer: { text: ['cheese', 'a cheese', 'a soft cheese', 'curd', 'curds', 'a piece of cheese', 'a lump of cheese', 'white cheese', 'cottage cheese', 'a curd cheese'] },
      traps: [{ match: ['a sponge', 'sponge', 'an egg', 'egg', 'a wet cloth', 'a cloth', 'butter', 'a ball of butter'], msg: 'A good try. But it dripped whey, which is a clue about what dairy product it was.' }],
      glyph: '🧀'
    },
    concepts: ['lateral'], links: ['world-nor-troll-eating']
  },
  {
    id: 'world-nor-troll-eating', title: 'The Eating Match', diff: 2,
    source: 'A Norwegian folk tale from the collection of Asbjørnsen and Moe (1840s), “The Boy who had an Eating Match with the Troll”.',
    text: 'The troll challenges Ashlad to a contest: who can eat the most porridge. The troll will win, of course, he is ten times the size of the boy. But Ashlad has a plan.\n\nHe ties something under his coat, spoons up a spoonful for himself, and a spoonful for it, and the porridge goes down, and down, until the troll’s bowl is nearly empty and the boy’s bowl is nearly empty too. Then the boy cuts a slit in his stomach (so it seems) “to make room”, and invites the troll to do the same.\n\nWhat has the boy tied under his coat?',
    hints: ['It holds a lot, and it is easy to hide.', 'It is the sort of bag that a boy might carry on a journey.'],
    explain: 'A **leather sack**, into which the boy shovelled every second spoonful. When he cut it open and the porridge ran out, the greedy troll copied him, and that was the end of the troll. (The story is gory in the original; Asbjørnsen and Moe collected it from Norwegian farms.)',
    data: {
      answer: { text: ['a sack', 'sack', 'a bag', 'bag', 'a leather sack', 'a leather bag', 'a pouch', 'a leather pouch', 'a leather bottle', 'a big bag'] },
      traps: [{ match: ['a stone', 'a pillow', 'pillow', 'a bowl', 'a spoon', 'a stomach', 'a cloth'], msg: 'It must swallow porridge without anyone noticing. What is made for holding things?' }],
      glyph: '🥣'
    },
    concepts: ['lateral'], links: ['world-nor-troll-stone']
  },

  /* ---------- Britain and the Celtic lands ---------- */
  {
    id: 'world-bri-white-horses', title: 'Thirty White Horses', diff: 1,
    source: 'A traditional English nursery riddle, printed in the collections of nursery rhymes of the nineteenth century, told again.',
    text: '*Thirty white horses upon a red hill; now they tramp, now they champ, now they stand still.*\n\nWhat are they?',
    hints: ['The red hill is pink and wet. The horses live at the top of it.', 'You have thirty-two of them, and they are busiest at meal times.'],
    explain: '**Teeth**, in the gums: thirty white horses on a red hill. They tramp and champ when you chew, and stand still when you stop. (An adult has thirty-two teeth; the riddle is not exact, but a good rhyme is worth two horses.)',
    data: {
      answer: { text: ['teeth', 'your teeth', 'the teeth', 'a set of teeth', 'tooth', 'teeth and gums', 'my teeth', 'gums and teeth', 'dentures', 'human teeth'] },
      traps: [{ match: ['horses', 'horse', 'white horses', 'sheep', 'a hill', 'cattle', 'clouds', 'cloud'], msg: 'They are horses in the picture only. What is white, small, thirty in number, and stands in a red hill?' }],
      glyph: '🦷'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-bri-elizabeth', title: 'Elizabeth, Elspeth, Betsy and Bess', diff: 2,
    source: 'A traditional English nursery rhyme, told again in prose.',
    text: '*Elizabeth, Elspeth, Betsy and Bess went off together to look for a bird’s nest. They found a nest with five eggs in it. They all took one, and left four in.*\n\nHow many girls went to look for the nest?',
    hints: ['Count the eggs, not the names: five before, four after.', 'If each girl took one egg, how many would be left in the nest?'],
    explain: '**One**. Elizabeth, Elspeth, Betsy and Bess are all pet names for the same girl, so “they all took one” means one egg went, and four were left. Four girls, each taking an egg, would have left just one. The rhyme is a tiny riddle of counting: the trap is to count the names.',
    data: {
      ask: 'How many girls?',
      answer: { num: 1 },
      traps: [{ match: 4, msg: 'Four names, yes. But if four girls had taken an egg each, how many eggs would be left?' }, { match: 5, msg: 'That is the number of eggs before they took any. Count the eggs left.' }],
      glyph: '🥚'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-cel-ragnelle', title: 'What Do Women Most Desire?', diff: 3, year: 1450,
    source: 'The Arthurian tale *The Wedding of Sir Gawain and Dame Ragnelle* (English, about 1450); Chaucer’s *Wife of Bath’s Tale* (1390s) tells it too, and Irish stories of the same shape are older.',
    text: 'King Arthur is caught at a disadvantage by a knight who will spare his life only if, within a year and a day, he brings back the answer to one riddle: **What do women most desire?**\n\nArthur rides the country and collects a great many answers: beauty, riches, flattery, a husband’s praise. None of them rings true. At last he meets an ugly woman, the Lady Ragnelle, who says she knows the true answer and will tell it if the knight Sir Gawain marries her. What is her answer?',
    hints: ['It is not something that can be given by a gift or a compliment.', 'It is about who decides what happens in a woman’s own life.'],
    explain: 'Her answer is **sovereignty**: to be the mistress of her own life and choices. Arthur takes it home, saves his life, and Gawain keeps his word and marries the lady. On the wedding night she is transformed into a beautiful woman, but is under a spell: beautiful by day and ugly by night, or the other way round. Gawain does not choose, but leaves the choice to her, and by being given her own way the spell is broken. It is the answer put into action.',
    data: {
      ask: 'What is her answer?',
      answer: { choice: 0, choices: ['To have sovereignty: to decide her own life for herself', 'To be told that she is beautiful', 'To be rich', 'To be young for ever'] },
      traps: [{ match: 1, msg: 'Arthur collected that answer from a dozen people; it saved nobody. The true one goes deeper.' }, { match: 2, msg: 'A good answer for a magpie. The riddle is asking for something a good deal more personal.' }],
      glyph: '👑'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-cel-blodeuwedd', title: 'A Woman Made of Flowers', diff: 3,
    source: 'The Fourth Branch of the *Mabinogi*, the medieval Welsh tales (preserved in the White Book of Rhydderch and the Red Book of Hergest, fourteenth century), told again.',
    text: 'In the old Welsh tale of the hero Lleu, a curse forbids him ever to have a wife from any race on earth. So the wizards Gwydion and Math make him one out of **flowers**: they gather the blossoms of three wild plants and conjure from them a woman, the most beautiful the world had known. They name her Blodeuwedd, “Flower-face”.\n\nWhich three flowers did the wizards use? Tick all that apply.',
    hints: ['One is a tree, one is a shrub with yellow flowers, and one is a meadow plant with frothy cream blossom.', 'A hardwood that lives for centuries; a shrub with golden pea-like flowers; and a cream-coloured meadow flower whose name mentions something sweet.'],
    explain: '**Oak, broom and meadowsweet.** The tale goes on: Blodeuwedd is unfaithful to Lleu, and in the end Gwydion turns her into an owl, a bird that hides by day. In Welsh the word *blodeuwedd* can still mean an owl.',
    data: {
      answer: { multi: [0, 1, 2], choices: ['Oak', 'Broom', 'Meadowsweet', 'Rose', 'Heather', 'Primrose'] },
      glyph: '🌼'
    }
  },
  {
    id: 'world-cel-ceridwen', title: 'The Chase of Gwion', diff: 3,
    source: 'The Welsh legend of Taliesin (*Hanes Taliesin*), preserved in manuscripts of the sixteenth century; the poems attached to it are far older.',
    text: 'The Welsh witch Ceridwen brews a potion of wisdom for her ugly son, and sets a boy called Gwion to stir the pot. Three hot drops fall on his thumb: he licks it, and gains all knowledge, and runs away.\n\nCeridwen chases him. He turns into a **hare**; she becomes a greyhound. He leaps into a river and becomes a **fish**; she becomes an otter. He flies up as a **bird**; she becomes a hawk. At last he drops onto a barn floor and becomes a **grain of wheat**.\n\nWhat does she become?',
    hints: ['She wants to swallow the grain.', 'A farmyard bird, dark in colour, who lives on grain.'],
    explain: 'A **black hen**, who swallowed the grain. Nine months later she gave birth to a child so beautiful that she could not bring herself to kill him, and she set him afloat in a leather bag on the sea. He was found at a fish-weir and became the greatest of Welsh poets, Taliesin, “radiant brow”.',
    data: {
      ask: 'What does Ceridwen become?',
      answer: { choice: 0, choices: ['A black hen', 'A wolf', 'A weasel', 'An owl'] },
      traps: [{ match: 1, msg: 'A wolf would suit a hare, but it does not eat grain, and the last step is all about a grain.' }, { match: 2, msg: 'A weasel would take a mouse, not a grain of wheat.' }, { match: 3, msg: 'An owl hunts mice at night, but this is a barn floor by day, and the prey is a seed.' }],
      glyph: '🐔'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-cel-ogham-bran', title: 'The Tree Alphabet: a Name', diff: 3,
    source: 'Ogham, the alphabet cut on the edges of standing stones in Ireland and western Britain from about the fourth century AD; the key is the standard one.',
    text: 'Ogham was carved along the edge of a stone. The edge is the stem, and each letter is a group of one to five strokes: one set hangs **below** the line, one stands **above** it, one **slants** across it, and the last (the vowels) are short **notches** across it. The key is shown under the inscription.\n\nRead the name from left to right. (It is the Welsh and Irish name for a raven.)',
    hints: ['Start with the first letter: one stroke hanging below the line. What is it in the key?', 'The letters are, in order, B, R, and then a vowel, and a last consonant with five strokes.'],
    explain: '**BRAN**: B (one stroke below the line), R (five slanting strokes), A (one notch), N (five strokes below). Bran is the Welsh word for a raven, and the giant king Bran the Blessed of the Mabinogi has it for a name. Each ogham letter is also the name of a tree: *beith* (birch), *ruis* (elder), *ailm* (fir or pine), *nion* (ash).',
    data: {
      ask: 'What is the name?',
      answer: { text: ['bran'] },
      traps: [{ match: ['raven', 'a raven', 'crow', 'brand'], msg: 'That is what the name means, but which word is spelled on the stone?' }],
      glyph: 'ᚁ',
      figure: { w: 400, h: 356, svg: oghamFigure(['B', 'R', 'A', 'N']) }
    },
    links: ['world-cel-ogham-ogham', 'world-cel-ogham-dair']
  },
  {
    id: 'world-cel-ogham-ogham', title: 'The Tree Alphabet: the Alphabet', diff: 4,
    source: 'Ogham, the alphabet cut on the edges of standing stones in Ireland and western Britain from about the fourth century AD; the key is the standard one.',
    text: 'One more piece of stone. The inscription below has five letters, and it is the word for the very script it is written in. Use the key under the inscription.\n\nWhat does it say?',
    hints: ['The first letter is made of two short notches across the line: that is a vowel.', 'Second and last letters are slanting groups; the third is a single stroke above the line.'],
    explain: '**OGHAM**: O (two notches), G (two slanting strokes), H (one stroke above the line), A (one notch), M (one slanting stroke). The medieval Irish said that the script had been invented by the god Ogma, and named it after him. Hundreds of stones with ogham inscriptions survive, mostly short memorial texts giving a name: “of so-and-so, son of so-and-so”.',
    data: {
      ask: 'What is the word?',
      answer: { text: ['ogham', 'ogam', 'ogum'] },
      glyph: 'ᚑ',
      figure: { w: 400, h: 356, svg: oghamFigure(['O', 'G', 'H', 'A', 'M']) }
    },
    links: ['world-cel-ogham-bran', 'world-cel-ogham-dair']
  },
  {
    id: 'world-cel-ogham-dair', title: 'The Tree Alphabet: the Oak', diff: 2,
    source: 'Ogham, the Irish tree alphabet; the letter names are recorded in medieval Irish manuscripts (the *Auraicept na n-Éces*, the “Scholars’ Primer”).',
    text: 'Each letter of the ogham alphabet has a name, and most of the names are those of trees or plants. B is *beith*, the birch; L is *luis*, the rowan; N is *nion*, the ash. The letter **D** (two strokes above the line) is called *dair*.\n\nWhich tree is it?',
    hints: ['It is the tree of the great Irish woods, and has acorns.', 'It is one of the strongest woods, and gives its name to a great many Irish towns (Derry, Kildare, Durrow).'],
    explain: 'The **oak**: *dair*. The Irish for an oak wood is *doire*, which became the town name Derry, while Kildare is *Cill Dara*, “church of the oak”. The tree names of the ogham letters were written down in the Middle Ages, when the scholars of Ireland found the old script a good subject for a game.',
    data: {
      ask: 'Which tree is *dair*?',
      answer: { choice: 0, choices: ['Oak', 'Ash', 'Birch', 'Holly'] },
      traps: [{ match: 1, msg: 'Ash is *nion*, the fifth letter.' }, { match: 2, msg: 'Birch is *beith*, the very first letter.' }],
      glyph: 'ᚇ'
    },
    links: ['world-cel-ogham-bran']
  },
  {
    id: 'world-bri-john-worth', title: 'How Much Is the King Worth?', diff: 2,
    source: 'The English ballad of *King John and the Bishop* (Child ballad no. 45), printed on broadsides from the seventeenth century (some versions have an abbot); retold in prose.',
    text: 'The ballad says that the king, jealous of the bishop’s fine house and his hundred servants, threatens to have his head unless he can answer three questions within a set time. The bishop, distraught, meets a shepherd who looks very like him, and the shepherd offers to go in his place, wearing the bishop’s robes.\n\nThe king’s first question is: **How much am I worth?** The shepherd answers with a number of silver pennies, and a reason. What is the number?',
    hints: ['The reason is a Bible story: Christ was betrayed for thirty pieces of silver.', 'The king is a man, and worth a little less than Christ.'],
    explain: '**Twenty-nine**. “For thirty pence our Saviour was sold, and I think thou art worth one penny less.” The king had to laugh. The three riddles of the ballad, told for centuries, are all about the difference between a king’s idea of himself and a shepherd’s common sense. See the other two: [[world-bri-john-ride]] and [[world-bri-john-think]].',
    data: {
      ask: 'How many pennies?',
      answer: { num: 29, unit: 'pennies' },
      traps: [{ match: 30, msg: 'That was the price of a much greater man, and the shepherd is a careful flatterer.' }, { match: 28, msg: 'The shepherd follows a reason, and the reason gives a slightly different number.' }],
      glyph: '29'
    },
    links: ['world-bri-john-ride', 'world-bri-john-think']
  },
  {
    id: 'world-bri-john-ride', title: 'Round the World on Horseback', diff: 3,
    source: 'The English ballad of *King John and the Bishop* (Child ballad no. 45), printed on broadsides from the seventeenth century (some versions have an abbot); retold in prose.',
    text: 'The king’s second question to the disguised shepherd is: **How long would it take me to ride once around the world?** He is thinking of a long journey with a good horse.\n\nThe shepherd answers with a number of hours and a condition. How long does it take?',
    hints: ['The world takes one day to turn; the sun goes round it once in that time.', 'The condition is that the king must rise with the sun and keep up with it.'],
    explain: '**Twenty-four hours**, “if you rise with the sun and keep pace with the sun until it rises again”. The king would have to be as fast as the sun — no small condition, but it is a fair answer, since the sun does go once round the earth in a day. The king laughed again. The last question: [[world-bri-john-think]].',
    data: {
      ask: 'How many hours?',
      answer: { num: 24, unit: 'hours' },
      traps: [{ match: 365, msg: 'That is the year, not the day. What would the king have to keep pace with?' }],
      glyph: '24'
    },
    links: ['world-bri-john-worth', 'world-bri-john-think']
  },
  {
    id: 'world-bri-john-think', title: 'What Is the King Thinking?', diff: 2,
    source: 'The English ballad of *King John and the Bishop* (Child ballad no. 45), printed on broadsides from the seventeenth century (some versions have an abbot); retold in prose.',
    text: 'The king’s third question, to the disguised shepherd: **What am I thinking?**\n\n“That is very hard,” says the shepherd, with a straight face. “You think that I am the Bishop of Canterbury...”\n\nHow does he finish the sentence?',
    hints: ['The king does think the man before him is the bishop, and he is wrong.', 'The shepherd wears the bishop’s robes, and has the bishop’s permission.'],
    explain: '“...and I am only his poor shepherd, come to ask your pardon for him.” The king could hardly be angry: he had asked the question and got the true answer to it. He pardoned the bishop, and made the shepherd a present of a farm. The moral of the ballad is that a good answer is often one the king cannot punish.',
    data: {
      ask: 'How does he finish?',
      answer: { choice: 1, choices: ['...and I am not, for I am only a poor pilgrim', '...and I am only his poor shepherd, come to ask pardon for him', '...but really you are thinking of your dinner', '...and you are right, for I am the bishop after all'] },
      traps: [{ match: 0, msg: 'Nice, but that is not in the story. It is the shepherd’s real occupation that saves the day.' }, { match: 2, msg: 'That would be a good joke, but it would not save the bishop’s head.' }, { match: 3, msg: 'That would only confirm what the king thinks. The shepherd’s trick is to be truthful.' }],
      glyph: '?'
    },
    links: ['world-bri-john-worth', 'world-bri-john-ride']
  },

  /* ---------- Spain, Latin America, Brazil and Italy ---------- */
  {
    id: 'world-esp-key', title: 'Small as a Mouse', diff: 1,
    source: 'A traditional Spanish *adivinanza*, told in Spain and Latin America.',
    text: '*Chiquito como un ratón, guarda la casa como un león.*\n\n(Small as a mouse, it guards the house like a lion.)\n\nWhat is it?',
    hints: ['It hangs from a ring in your pocket and is often lost.', 'It works in a lock.'],
    explain: 'A **key** (*la llave*): small as a mouse, and yet in charge of the whole house like a lion at the gate.',
    data: {
      answer: { text: ['key', 'a key', 'llave', 'la llave', 'the key', 'house key', 'door key', 'una llave', 'keys'] },
      traps: [{ match: ['ratón', 'raton', 'a mouse', 'mouse', 'lion', 'a lion', 'león', 'leon', 'dog', 'a dog', 'a guard dog', 'lock', 'a lock'], msg: 'Those are the animals in the riddle. What is small as one and does the work of the other?' }],
      glyph: '🗝'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-esp-pear', title: 'White Inside, Green Outside', diff: 2,
    source: 'A traditional Spanish *adivinanza*, told in Spain and Latin America.',
    text: '*Blanca por dentro, verde por fuera; si quieres que te lo diga, espera.*\n\n(White inside, green outside; if you want me to tell you, wait.)\n\nWhat is it?',
    hints: ['A fruit that can be juicy or gritty, green on the skin and cream inside.', 'The last word of the riddle is the answer. Read it as two words.'],
    explain: 'A **pear** (*la pera*). The riddle gives you the answer in its last line: *espera* means “wait”, but split it in two and it says *es pera*: “it is a pear”. That is why the riddle asks you to wait.',
    data: {
      answer: { text: ['pear', 'a pear', 'pera', 'la pera', 'the pear', 'una pera', 'pears'] },
      traps: [{ match: ['apple', 'an apple', 'manzana', 'la manzana', 'grape', 'grapes', 'lime', 'a lime', 'a melon', 'melon', 'avocado', 'an avocado'], msg: 'Close: but read the last word again, and read it as two words.' }],
      glyph: '🍐'
    },
    concepts: ['homophones'], tags: ['pun'], links: ['world-esp-avocado']
  },
  {
    id: 'world-esp-avocado', title: 'Water Passes My House', diff: 2,
    source: 'A traditional Spanish and Mexican *adivinanza*, told in Spain and Latin America.',
    text: '*Agua pasa por mi casa, cate de mi corazón; el que no me lo adivine, es un burro de carga.*\n\n(Water passes by my house, “cate” of my heart; whoever cannot guess me is a pack-donkey.)\n\nWhat am I?',
    hints: ['Put the first word of the riddle together with the odd word that follows.', 'The fruit is green outside and creamy inside, and its stone is the “heart”.'],
    explain: 'An **avocado**, in Spanish *aguacate*: the riddle hides *agua* (water) in its first line and *cate* in its second, and put together they are the name of the fruit. The word *aguacate* itself comes from *ahuacatl*, its name in Nahuatl, the language of the Aztecs.',
    data: {
      answer: { text: ['avocado', 'an avocado', 'aguacate', 'el aguacate', 'palta', 'la palta', 'un aguacate', 'avocados', 'guacamole'] },
      traps: [{ match: ['water', 'a river', 'river', 'a fountain', 'a well', 'a house', 'a donkey', 'donkey', 'burro'], msg: 'Those are all words in the riddle. What are they hiding when they are put together?' }],
      glyph: '🥑'
    },
    concepts: ['homophones'], tags: ['pun'], links: ['world-esp-pear']
  },
  {
    id: 'world-esp-garlic', title: 'Teeth Without a Mouth', diff: 2,
    source: 'A traditional Spanish *adivinanza*, told in Spain and Latin America.',
    text: '*Tiene dientes y no come, tiene barbas y no es hombre.*\n\n(It has teeth but does not eat, and a beard but is not a man.)\n\nWhat is it?',
    hints: ['Its teeth are white and grouped together in a head; its beard grows underneath.', 'It is used in every kitchen and is said to keep vampires at bay.'],
    explain: '**Garlic** (*ajo*): a head of garlic has “teeth” (the cloves) and, at its foot, a little “beard” of roots. A lovely example of a riddle made of two false descriptions.',
    data: {
      answer: { text: ['garlic', 'a head of garlic', 'ajo', 'el ajo', 'a garlic', 'a clove of garlic', 'garlic bulb', 'a garlic bulb', 'head of garlic'] },
      traps: [{ match: ['comb', 'a comb', 'a saw', 'saw', 'a zip', 'a zipper', 'zipper', 'a goat', 'goat', 'a rake'], msg: 'A comb has teeth that do not eat, but no beard. Which food has both?' }, { match: ['onion', 'an onion', 'cebolla', 'la cebolla'], msg: 'An onion has layers, not teeth. Which relation of the onion has teeth?' }],
      glyph: '🧄'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-esp-bat', title: 'All Five Vowels', diff: 2,
    source: 'A traditional Spanish *adivinanza* and classroom riddle: *¿Qué animal tiene las cinco vocales?*',
    text: 'A Spanish riddle that children learn at school: *¿Qué animal tiene las cinco vocales?* — **Which animal has all five vowels in its name?**\n\nThe answer is a Spanish word, but you may answer in English. A hint: you will find it in the dark, and it is the only mammal that really flies.',
    hints: ['A mammal, not a bird, that hangs upside down by day and flies at night.', 'The Spanish name is *murciélago*: look for the vowels in it.'],
    explain: 'A **bat**, in Spanish *murciélago*: it has a **u**, an **i**, an **é** (an e), an **a** and an **o**, all five vowels. The word comes from the old *murciégalo*, which is thought to be “blind mouse” (Latin *mus* and *caecus*), because the animal was believed to be blind.',
    data: {
      answer: { text: ['bat', 'a bat', 'murciélago', 'murcielago', 'el murciélago', 'el murcielago', 'the bat', 'bats'] },
      traps: [{ match: ['bird', 'a bird', 'owl', 'an owl', 'búho', 'buho', 'lechuza', 'parrot', 'a parrot', 'a mouse'], msg: 'Not a bird! It is a mammal that flies at night. In Spanish its name is a long one with every vowel in it.' }],
      glyph: '🦇'
    },
    concepts: ['lateral'], tags: ['wordplay']
  },
  {
    id: 'world-esp-sancho', title: 'The Bridge and the Gallows', diff: 4, year: 1615,
    source: 'Miguel de Cervantes, *Don Quixote*, part 2 (1615), chapter 51: Sancho Panza’s judgment as governor of the island of Barataria.',
    text: 'Sancho Panza has become governor of an island (as a joke of the duke, though he does not know it) and is trying real cases. A man comes to him with a difficult one:\n\nThe lord of an estate has a law that everyone crossing the bridge must first swear where he is going. If he swears the truth, he may cross. If he lies, he is hanged on the gallows at the end of the bridge. One day a man swears: **“I am going to be hanged on that gallows.”**\n\nThe judges argue. If they hang him, he told the truth, and should have been let through. If they let him through, he lied, and should be hanged. What does Sancho decide?',
    hints: ['Neither of the two obvious rulings can be carried out without breaking the law.', 'Sancho, who has little learning but a good heart, reasons that when doubt is exactly balanced one should do the kinder thing.'],
    explain: 'Sancho lets the man **pass**: since the arguments for hanging him and for freeing him weigh exactly the same, it is better to do good than harm. (First he had proposed hanging the half of the man that lied and freeing the half that told the truth, but that would kill the whole man.) The puzzle is an old cousin of the Liar Paradox, and Cervantes uses it to show that wisdom is not the same thing as learning.',
    data: {
      ask: 'What does Sancho decide?',
      answer: { choice: 0, choices: ['Let him cross: when the case is perfectly balanced, mercy should win', 'Hang him, since the law is the law', 'Hang half of him and let the other half cross', 'Make him swear a second time'] },
      traps: [{ match: 1, msg: 'If they hang him, then he told the truth, and the law says the truthful go free. Try again.' }, { match: 2, msg: 'Sancho does think of this, and drops it at once: you cannot hang half a man.' }, { match: 3, msg: 'It would only give him a second chance to say the same thing.' }],
      glyph: '⚖'
    },
    concepts: ['paradox']
  },
  {
    id: 'world-esp-nahua-sky', title: 'The Blue Bowl', diff: 2,
    source: 'A riddle in the Nahua (Aztec) tradition of central Mexico, of the kind written down in the sixteenth century by the Franciscan Bernardino de Sahagún and his Nahua collaborators (*Florentine Codex*, book 6), told again.',
    text: 'The Nahua people of central Mexico, whom the Spanish called Aztecs, enjoyed riddles, and their sixteenth-century scholars wrote them down. One of the best-known asks: *What is the blue bowl, turned upside down over everyone, all sprinkled with popped white maize?*\n\nPopped maize is what we would call popcorn.',
    hints: ['The bowl covers the whole world, and is blue by day.', 'The popcorn shows up only when the bowl goes dark.'],
    explain: 'The **night sky**: a blue bowl, sprinkled with the white grains of the stars. It is the same picture as the “plate of pearls” of Amir Khusrau in India ([[anc-khusro-sky]]): two peoples who never met describing one sky with a bowl and small round white things.',
    data: {
      answer: { text: ['the sky', 'sky', 'night sky', 'the night sky', 'the stars', 'stars', 'the starry sky', 'starry sky', 'the heavens', 'the sky at night'] },
      glyph: '✦'
    },
    concepts: ['lateral'], links: ['anc-khusro-sky']
  },
  {
    id: 'world-esp-popol-vuh', title: 'The Torch and the Cigar', diff: 3,
    source: 'The *Popol Vuh*, the sacred book of the K’iche’ Maya of Guatemala, written down in the Latin alphabet in the 1550s from older tradition; told again.',
    text: 'The Hero Twins, Hunahpu and Xbalanque, are summoned to Xibalba, the underworld, where the Lords of Death set them a series of tests. The first night is spent in the House of Darkness. Each twin is given a torch of pine and a cigar, and told that both must burn all night but be returned whole in the morning.\n\nThe Lords expect them to fail: a torch that burns cannot be whole. How do the twins pass the test?',
    hints: ['A fire needs to look alight, not to be alight.', 'They use something red for the torch and something small and glowing for the cigars.'],
    explain: 'They put the red tail-feathers of a **macaw** on the tip of the torch, so it seemed to blaze, and caught **fireflies** and set one on the end of each cigar, so it seemed to glow. In the morning both were whole. It is a small triumph of a way of thinking that is very useful in riddles: satisfy the conditions as they are spoken, not as they were meant.',
    data: {
      ask: 'How do they do it?',
      answer: { choice: 0, choices: ['Macaw feathers on the torch and fireflies on the cigars, so they look alight but do not burn', 'They put both out and light them again at dawn', 'They wrap them in wet leaves to make them burn more slowly', 'They give the Lords copies and hide the real ones'] },
      traps: [{ match: 1, msg: 'The Lords check through the night: something must look lit all the time.' }, { match: 2, msg: 'A wet leaf would put a torch out; the trick has to keep the flame looking alive.' }],
      glyph: '🔥'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-bra-rain', title: 'Falls Standing, Runs Lying', diff: 2,
    source: 'A traditional Brazilian riddle (*adivinha*); in Brazil riddles begin “*O que é, o que é?*” (“What is it, what is it?”).',
    text: '*O que é, o que é? Cai em pé e corre deitada.*\n\n(What is it, what is it? It falls standing up and runs lying down.)\n\nWhat is it?',
    hints: ['Think of the two directions: down and along.', 'It falls from the sky and then runs down the street.'],
    explain: '**Rain**, or rainwater: it falls straight down (“standing up”) and then, on the ground, it runs along it (“lying down”). Brazilians ask *O que é, o que é?* so often that the phrase has become a game of its own.',
    data: {
      answer: { text: ['rain', 'the rain', 'chuva', 'a chuva', 'água da chuva', 'agua da chuva', 'rainwater', 'rain water', 'raindrops', 'water', 'a waterfall'] },
      traps: [{ match: ['a river', 'river', 'a snake', 'snake', 'a dog', 'a person'], msg: 'A river runs lying down, but it does not fall standing up. What is both?' }],
      glyph: '🌧'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-bra-tooth', title: 'A Crown but No King', diff: 2,
    source: 'A traditional Brazilian riddle (*adivinha*), told again; in Brazil riddles begin “*O que é, o que é?*” (“What is it, what is it?”).',
    text: '*O que é, o que é? Tem coroa, mas não é rei; tem raiz, mas não é planta.*\n\n(What is it, what is it? It has a crown but is not a king; it has a root but is not a plant.)\n\nWhat is it?',
    hints: ['It is in your mouth, and dentists talk about both its crown and its root.', 'You lose several when you are small.'],
    explain: 'A **tooth**: the part you can see is its *crown* (Portuguese *coroa*), and the part hidden in the gum is its *root* (*raiz*). The riddle turns two technical words into a pair of false trails.',
    data: {
      answer: { text: ['tooth', 'a tooth', 'dente', 'um dente', 'o dente', 'teeth', 'molar', 'a molar'] },
      traps: [{ match: ['a king', 'king', 'a tree', 'tree', 'a plant', 'plant', 'a flower', 'a pineapple', 'pineapple', 'a hat'], msg: 'Each of those has only one of the two features. What has both a crown and a root without being a king or a plant?' }],
      glyph: '🦷'
    },
    concepts: ['lateral'], tags: ['pun']
  },
  {
    id: 'world-ita-veronese', title: 'The Riddle of Verona', diff: 3, year: 800,
    source: 'The *Indovinello veronese*, a riddle scribbled about AD 800 in the margin of a manuscript in Verona, in a language halfway between Latin and Italian; one of the oldest texts in the Italian tongue.',
    text: 'About twelve hundred years ago a monk in Verona wrote a riddle in the margin of a book, in a language halfway between Latin and Italian:\n\n*Se pareba boves, alba pratalia araba, albo versorio teneba, negro semen seminaba.*\n\n(*He drove the oxen in front of him, he ploughed white fields, he held a white plough, he sowed black seed.*)\n\nWhat was he doing?',
    hints: ['The “oxen”, the “fields”, the “plough” and the “seed” are all things on a desk.', 'The plough is a feather, and the oxen are what holds it.'],
    explain: '**Writing**: the oxen are the fingers, the white fields the page, the white plough the quill (a feather), and the black seed the ink. The monk probably wrote it in the margin of a book he had been copying, bored, as a note to himself. It is one of the earliest pieces of Italian that we have, and it is a riddle, which would please every Italian child.',
    data: {
      answer: { text: ['writing', 'a scribe writing', 'he was writing', 'writing with a pen', 'writing on paper', 'writing with a quill', 'copying', 'a scribe', 'copying a manuscript', 'a monk writing', 'writing a book', 'writing on parchment', 'penmanship'] },
      traps: [{ match: ['ploughing', 'plowing', 'farming', 'sowing', 'a farmer', 'ploughing a field', 'ploughing snow'], msg: 'A farmer, yes, in the riddle. But what are the white fields and the black seed in real life?' }],
      glyph: '✒'
    },
    concepts: ['lateral'], links: ['anc-exeter-book']
  },

  /* ---------- Africa ---------- */
  {
    id: 'world-afr-swahili-egg', title: 'A House With No Door', diff: 1,
    source: 'A traditional Swahili riddle (*kitendawili*) of East Africa; riddles of this kind are told in many African languages.',
    text: 'In East Africa a Swahili riddler begins with a cry, *Kitendawili!* (“A riddle!”), and the listeners answer *Tega!* (“Set it!”, as one sets a trap). Then comes the riddle:\n\n*Nyumba yangu haina mlango.*\n\n(My house has no door.)\n\nWhat is it?',
    hints: ['The house is small and something lives in it before it is born.', 'It is oval, and you break it to get inside.'],
    explain: 'An **egg** (*yai* in Swahili): a house with no door and no window, which the one inside must break open itself. The same riddle is told in many languages: the Latin poet Symphosius asked it 1,500 years ago ([[anc-symphosius-egg]]).',
    data: {
      answer: { text: ['an egg', 'egg', 'yai', 'the egg', 'eggs', 'mayai', 'hens egg', 'a hen’s egg', 'a birds egg', 'a bird’s egg'] },
      traps: [{ match: ['a house', 'house', 'a hut', 'hut', 'a cave', 'a box', 'a nut', 'a coconut', 'coconut'], msg: 'A house with no door is a strange house. A coconut is close, but what is it that the one inside must break open by itself?' }],
      glyph: '🥚'
    },
    concepts: ['riddle-craft'], links: ['anc-symphosius-egg']
  },
  {
    id: 'world-afr-ubuntu', title: 'What Makes a Person?', diff: 1,
    source: 'A proverb of the Zulu, Xhosa and other Nguni languages of southern Africa (*umuntu ngumuntu ngabantu*); the idea it carries is called *ubuntu*.',
    text: 'A saying of the Zulu and Xhosa peoples goes: ***Umuntu ngumuntu ngabantu.*** It is a riddle in the form of a definition: what makes a person a person?',
    hints: ['The proverb does not talk about strength, or wealth, or a name.', 'It is something you cannot do alone.'],
    explain: '“A person is a person **through other people**.” We become who we are by being cared for, taught and listened to, and a person entirely on their own is hardly a person at all. The idea, called *ubuntu*, is a cornerstone of southern African thinking about community.',
    data: {
      ask: 'What makes a person a person?',
      answer: { choice: 0, choices: ['Other people', 'Their own strength', 'Their name', 'Their wealth'] },
      traps: [{ match: 1, msg: 'The proverb points in the other direction: away from what one has alone.' }, { match: 2, msg: 'A name is given by other people, but that is not the whole proverb.' }, { match: 3, msg: 'It says the opposite: one is not made a person by having things.' }],
      glyph: '🤝'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-afr-anansi-pot', title: 'The Pot of Wisdom', diff: 1,
    source: 'A tale of Anansi the spider from the Akan people of Ghana, told in West Africa and in the Caribbean.',
    text: 'Anansi the spider, in the Akan stories from Ghana, once decided to keep all the wisdom in the world for himself. He gathered it into a great clay pot and set off to hide it at the top of the tallest tree, where no one else could ever reach it. He tied the pot in front of him, on his belly, and started to climb.\n\nBut it was very hard going: the pot got in his way at every step. Below, his little son Ntikuma watched, and called up some advice. What did the boy say?',
    hints: ['The pot is getting between Anansi and the tree.', 'Where would a heavy load be out of the way?'],
    explain: '“**Tie the pot on your back**, Father, and you will be able to climb!” Anansi was furious that a small boy could see what all the wisdom in his pot had not told him. In a rage he flung the pot down: it smashed, and the wisdom flew out and scattered across the world. That is why everybody has a little, and nobody has it all.',
    data: {
      ask: 'What does Ntikuma say?',
      answer: { choice: 0, choices: ['Tie the pot on your back, Father', 'Leave the pot at home', 'Give some of the wisdom to me', 'Fetch a ladder'] },
      traps: [{ match: 1, msg: 'That is the whole point of the story: Anansi will not leave it.' }, { match: 3, msg: 'A ladder would need to be tall enough for the tallest tree. The boy’s idea is much simpler.' }],
      glyph: '🕷'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-afr-eshu-hat', title: 'The Hat of Eshu', diff: 2,
    source: 'A tale of Eshu (Èṣù), the trickster and messenger spirit of the Yoruba people of Nigeria, told across West Africa and in Brazil, Cuba and Haiti.',
    text: 'Two friends have farms side by side, with a footpath between them, and they have never quarrelled. One day Eshu, the trickster, walks slowly along the path wearing a hat that is **red on one side and white on the other**. He says nothing and disappears.\n\nThat evening the friends meet. “Did you see that man in the white hat?” says one. “Do you mean the man in the red hat?” answers the other. They argue, they shout, and they come to blows, until Eshu comes back and asks what the fight is about.\n\nHow can both friends have told the truth?',
    hints: ['Where is each friend standing when Eshu walks between the two fields?', 'The path runs between them, and the hat has two sides.'],
    explain: 'Each friend was on **his own side of the path** and saw only the side of the hat that faced him. Each told the truth, and neither saw the whole. Eshu laughs, and tells them that this is what he does: he teaches people how much of the truth lies on the other side of the road. The story is told wherever Eshu is honoured, from Nigeria to Brazil.',
    data: {
      ask: 'How can both be telling the truth?',
      answer: { choice: 0, choices: ['Each stood on a different side of the path and saw a different side of the hat', 'Eshu changed the hat’s colour when the second friend looked', 'One of them was colour-blind', 'They were looking at two different men'] },
      traps: [{ match: 1, msg: 'Eshu is a trickster, but the trick here is much simpler than magic.' }, { match: 2, msg: 'That would explain a mistake, but neither of them made one.' }, { match: 3, msg: 'It was one man, one hat.' }],
      glyph: '🎩',
      figure: {
        w: 400, h: 190,
        svg: '<line x1="30" y1="98" x2="370" y2="98" stroke="#3a3020" stroke-width="2" stroke-dasharray="5 5" opacity=".55"/>' +
          '<text x="200" y="176" text-anchor="middle" font-size="13" font-family="Georgia,serif" fill="#3a3020">the path between the two fields (seen from above)</text>' +
          '<path d="M200 60 A38 38 0 0 0 200 136 Z" fill="#b0472f" stroke="#3a3020" stroke-width="3"/><path d="M200 60 A38 38 0 0 1 200 136 Z" fill="#fbf8ef" stroke="#3a3020" stroke-width="3"/>' +
          '<circle cx="200" cy="98" r="5" fill="#3a3020"/>' +
          '<circle cx="62" cy="98" r="17" fill="#e9dfc4" stroke="#3a3020" stroke-width="3"/><path d="M84 98 L134 98" stroke="#3a6ea5" stroke-width="3" marker-end="none"/><path d="M134 98 l-9 -6 M134 98 l-9 6" stroke="#3a6ea5" stroke-width="3" transform="translate(0 0)"/>' +
          '<text x="62" y="140" text-anchor="middle" font-size="12" font-family="Georgia,serif" fill="#3a3020">friend on the left</text>' +
          '<circle cx="338" cy="98" r="17" fill="#e9dfc4" stroke="#3a3020" stroke-width="3"/><path d="M316 98 L266 98" stroke="#3a6ea5" stroke-width="3"/><path d="M266 98 l9 -6 M266 98 l9 6" stroke="#3a6ea5" stroke-width="3"/>' +
          '<text x="338" y="140" text-anchor="middle" font-size="12" font-family="Georgia,serif" fill="#3a3020">friend on the right</text>' +
          '<text x="200" y="40" text-anchor="middle" font-size="13" font-family="Georgia,serif" fill="#3a3020">Eshu’s hat</text>'
      }
    },
    concepts: ['lateral']
  },
  {
    id: 'world-afr-sankofa', title: 'The Bird That Looks Back', diff: 2,
    source: 'The Akan people of Ghana and Côte d’Ivoire: the *Sankofa* bird, one of the *Adinkra* symbols printed on cloth and carved in wood.',
    text: 'Among the Akan people of Ghana, one of the best-loved *Adinkra* symbols is a bird that **flies forward, with its head turned back over its shoulder**, holding an egg in its beak. It is called *Sankofa*, which can be translated “go back and get it”. An old Akan proverb goes with it.\n\nWhich proverb is it?',
    hints: ['The bird moves forward, but looks behind: it is fetching something.', 'The egg in its beak is what it has gone back to get.'],
    explain: '“**It is not wrong to go back and fetch what you have forgotten.**” The picture teaches that the future is built on the past: what is learned from our elders and our mistakes should not be left behind. The bird is found on printed cloth, on carved wood and iron gates, and has become a symbol far beyond Ghana.',
    data: {
      ask: 'Which proverb belongs to Sankofa?',
      answer: { choice: 0, choices: ['It is not wrong to go back and fetch what you have forgotten', 'A bird in the hand is worth two in the bush', 'Never look back', 'The early bird catches the worm'] },
      traps: [{ match: 1, msg: 'An English saying. And the bird in the symbol is *looking back*.' }, { match: 2, msg: 'The bird does the very opposite, with its head turned backwards.' }, { match: 3, msg: 'That one is about hurrying to the future. The Akan bird is looking behind it.' }],
      glyph: '🕊'
    },
    concepts: ['lateral'], links: ['world-afr-crocodiles']
  },
  {
    id: 'world-afr-crocodiles', title: 'Two Crocodiles, One Stomach', diff: 2,
    source: 'The Akan people of Ghana: the *Adinkra* symbol *Funtunfunefu-Denkyemfunefu*, printed on cloth and told about with a proverb.',
    text: 'Another Akan symbol, printed on cloth, shows **two crocodiles joined together with one stomach and two heads**. The proverb that goes with it says that they quarrel over food, although whatever either of them eats goes into the same stomach.\n\nWhat is the symbol reminding people?',
    hints: ['Think about what it means to share one stomach.', 'The two crocodiles are wasting their strength on a quarrel that cannot win them anything.'],
    explain: 'That people who share a **common fate** should not quarrel: what you take from your partner, you take from yourself. The Akan use the symbol to teach unity, sharing, and even democracy, and its long name, *funtunfunefu-denkyemfunefu*, is a delight to say aloud.',
    data: {
      ask: 'What does it remind people?',
      answer: { choice: 0, choices: ['Those who share one fate should not fight one another', 'Beware of danger in the river', 'Greed is always punished', 'Strength lies in a large mouth'] },
      traps: [{ match: 1, msg: 'The crocodiles are in the picture, but the lesson is about what they do to each other.' }, { match: 2, msg: 'Near, but greed is not the point: what matters is that the two share one stomach.' }],
      glyph: '🐊'
    },
    concepts: ['lateral'], links: ['world-afr-sankofa']
  },
  {
    id: 'world-afr-wax-gold', title: 'Wax and Gold', diff: 2,
    source: 'The Amharic poetic tradition of *qene* (*sem-ena-werq*, “wax and gold”) of Ethiopia, taught in the schools of the Ethiopian Orthodox Church.',
    text: 'In Ethiopia the poets of the Church have long practised a kind of poetry called *qene*, in which **every verse has two meanings**: the plain one that anyone would hear, and a hidden one that only a clever listener finds. The two are named after the way a goldsmith makes a gold ornament: he shapes a model in beeswax, covers it in clay, and melts the wax away, leaving a mould into which he pours the gold.\n\nIn the picture, which meaning is the “wax” and which is the “gold”?',
    hints: ['The wax is what you see first, and it is melted away.', 'The gold is what is left at the end: the precious part.'],
    explain: 'The **wax** is the surface meaning, and the **gold** is the hidden meaning inside it. Like the goldsmith’s model, the surface is only there to hold the shape; the treasure is what it makes room for. Poets still compose qene in Amharic and the schools of the Church still teach it.',
    data: {
      ask: 'Which is which?',
      answer: { choice: 0, choices: ['Wax is the plain surface meaning; gold is the hidden meaning', 'Wax is the hidden meaning; gold is the plain surface meaning', 'Wax is the poem and gold is its author', 'Wax is the praise and gold is the criticism'] },
      traps: [{ match: 1, msg: 'That is the wrong way round: think of what the goldsmith does with the wax.' }],
      glyph: '🏺'
    },
    concepts: ['riddle-craft']
  },
  {
    id: 'world-afr-yoruba-hand', title: 'The Shelf and the Gourd', diff: 2,
    source: 'A Yoruba proverb (*òwe*) from Nigeria; the Yoruba say that proverbs are the horses of speech.',
    text: 'A Yoruba proverb of Nigeria runs: *A child’s hand cannot reach the shelf; an elder’s hand cannot get into the gourd.* (The gourd has a narrow neck.)\n\nWhat is the proverb teaching?',
    hints: ['Who can reach high, and who can reach into a narrow place?', 'Each has something the other lacks.'],
    explain: 'That the **young and the old need each other**: the child is small enough to put a hand where the elder’s will not go, and the elder is tall enough to reach what the child cannot. Neither is enough alone.',
    data: {
      ask: 'What does it teach?',
      answer: { choice: 0, choices: ['The young and the old need each other', 'Children should not go near high shelves', 'Gourds are better than shelves', 'Only the old are wise'] },
      traps: [{ match: 1, msg: 'That is a warning, but the proverb is about two people, not about one child.' }, { match: 3, msg: 'It says the reverse: the elder cannot do what a child can.' }],
      glyph: '🏺'
    },
    concepts: ['lateral']
  },

  /* ---------- India ---------- */
  {
    id: 'world-ind-elephant', title: 'The Blind Men and the Elephant', diff: 2,
    source: 'A parable told in the Buddhist scriptures (*Udāna* 6.4) and by Jain and Hindu teachers; the Persian poet Rumi tells it too.',
    text: 'A king in India once gathered some men who had been blind from birth, and had an animal led in before them. He asked each to feel one part and say what it was like.\n\nThe one who felt the head said: “It is like a **pot**.” The one who touched an ear said: “It is like a **winnowing basket**.” A tusk: “a **ploughshare**”. The trunk: “a **plough-pole**”. The body: “a **granary**”. A foot: “a **pillar**”. They began to quarrel, each sure that the others were wrong.\n\nWhat animal was it?',
    hints: ['The pot is the great head, the pillar is a leg, the plough-pole is something long and flexible.', 'It is the largest animal on land.'],
    explain: 'An **elephant**. The Buddha is said to have told the story to show how teachers quarrel about the truth when each has touched only one part of it. It has been retold for two thousand years, in India, Persia and everywhere else: Rumi has men in a dark room touching an elephant with their hands.',
    data: {
      answer: { text: ['elephant', 'an elephant', 'the elephant', 'an indian elephant', 'elephants'] },
      traps: [{ match: ['rhino', 'a rhino', 'a rhinoceros', 'hippo', 'a hippo', 'a hippopotamus', 'whale', 'a whale', 'a camel', 'camel'], msg: 'Big, but think of what would have a trunk, a tusk, a fan-like ear and a pillar for a leg.' }],
      glyph: '🐘'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-ind-ganesha', title: 'The Race Around the World', diff: 1,
    source: 'A popular story of the *Puranas* (the Shiva Purana and other tellings), told in India for many centuries.',
    text: 'The god Shiva and his wife Parvati have two sons, Kartikeya and Ganesha. One day they announce a contest: whichever of the two first travels **three times around the world** will win a prize (a fruit of wisdom, in some tellings).\n\nKartikeya, the war god, jumps on his peacock and flies off at once. Ganesha, whose vehicle is a very small mouse, does not move. He thinks for a moment, walks three times around his parents, and says: “I have won.”\n\nWhat does Ganesha say?',
    hints: ['Ganesha cannot outrun his brother, so he must change what is meant by “the world”.', 'It is about where the world is, for a small child.'],
    explain: '“**You are my whole world**, so I have gone around the world three times.” Shiva and Parvati were delighted, and Ganesha won the prize; his brother returned, out of breath, to find the contest decided. The story is a favourite in India, told to teach that wisdom can beat speed.',
    data: {
      ask: 'What does Ganesha say?',
      answer: { choice: 1, choices: ['My mouse is quicker than your peacock', 'My parents are my whole world, so I have gone around it', 'I am wiser, and do not need to run', 'I am tired, and give up'] },
      traps: [{ match: 0, msg: 'The mouse is not the hero of the tale: Ganesha wins by thinking.' }, { match: 3, msg: 'He does not give up: he gets round the problem instead.' }],
      glyph: '🐘'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-ind-yaksha-fish', title: 'Sleeping With Open Eyes', diff: 1,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira; the epic took its shape between about 400 BC and AD 400).',
    text: 'In the *Mahabharata* the spirit of the haunted lake asks Yudhishthira question after question, each in the form of a riddle. One of them is: *What sleeps with its eyes open?*',
    hints: ['It lives in water and has no eyelids.', 'It swims.'],
    explain: 'A **fish**: it has no eyelids and cannot close its eyes, so it seems to sleep with them open. The spirit is delighted by all the answers. See also [[anc-yaksha-mind]] and [[anc-yaksha-wonder]].',
    data: {
      answer: { text: ['a fish', 'fish', 'fishes', 'the fish'] },
      traps: [{ match: ['an owl', 'owl', 'a bat', 'bat', 'a snake', 'snake', 'a cat', 'a hare', 'hare'], msg: 'Not an owl or a snake: they do have eyelids of a sort. What lives in the water and can never close its eyes?' }],
      glyph: '🐟'
    },
    concepts: ['lateral'], links: ['world-ind-yaksha-stone', 'anc-yaksha-mind']
  },
  {
    id: 'world-ind-yaksha-stone', title: 'The Thing Without a Heart', diff: 1,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira; the epic took its shape between about 400 BC and AD 400).',
    text: 'The Yaksha of the lake in the *Mahabharata* asks Yudhishthira another riddle: *What has no heart?*',
    hints: ['It is hard, and it does not feel.', 'It is at the bottom of the lake.'],
    explain: 'A **stone**: it has no heart, in either sense: nothing beats inside it, and nothing moves it. Yudhishthira’s answers are all that short.',
    data: {
      answer: { text: ['a stone', 'stone', 'a rock', 'rock', 'stones', 'a pebble', 'the stone'] },
      traps: [{ match: ['a fish', 'fish', 'a tree', 'a mirror', 'a robot', 'a statue', 'a doll'], msg: 'Something that is not alive at all, and lies at the bottom of any lake.' }],
      glyph: '🪨'
    },
    concepts: ['lateral'], links: ['world-ind-yaksha-fish', 'world-ind-yaksha-grass']
  },
  {
    id: 'world-ind-yaksha-grass', title: 'More Than the Blades of Grass', diff: 3,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira; the epic took its shape between about 400 BC and AD 400).',
    text: 'The Yaksha asks Yudhishthira: *What is more numerous than the blades of grass?*\n\nIt is not a thing you can count in a field.',
    hints: ['It is not an object at all.', 'It is something that comes into the head by itself and keeps you awake.'],
    explain: '**Worries** (or thoughts): the Sanskrit word, *cintā*, means both. There are more of them in a day than blades of grass in a meadow, and they grow back faster. The Yaksha was pleased.',
    data: {
      answer: { text: ['thoughts', 'worries', 'worry', 'thought', 'cares', 'anxiety', 'anxieties', 'ideas', 'concerns', 'our thoughts', 'our worries', 'troubles'] },
      traps: [{ match: ['stars', 'the stars', 'sand', 'grains of sand', 'ants', 'insects', 'leaves', 'hairs'], msg: 'Those can be counted, in principle. The answer is something that cannot be.' }],
      glyph: '💭'
    },
    concepts: ['lateral'], links: ['world-ind-yaksha-stone', 'world-ind-yaksha-happy']
  },
  {
    id: 'world-ind-yaksha-happy', title: 'Who Is Happy?', diff: 3,
    source: 'The *Mahabharata*, Vana Parva (the Yaksha’s questions to Yudhishthira; the epic took its shape between about 400 BC and AD 400).',
    text: 'The Yaksha asks Yudhishthira a question that a king might find hard: *Who is truly happy?*\n\nYudhishthira answers with a small picture, not a rank or a fortune. What is it?',
    hints: ['The answer is an everyday scene, not a throne.', 'It has to do with food, with debt, and with where you are.'],
    explain: '“He who at the end of the day cooks a simple meal of vegetables **in his own house**, who owes nothing to anyone, and who is not living away from home.” The Yaksha is content: happiness, in the epic, is a matter of independence and of having a home, not of rank.',
    data: {
      ask: 'Who is happy?',
      answer: { choice: 0, choices: ['One who cooks a simple meal at home, owes no debts, and is not wandering far away', 'One who is king of a great land', 'One who has never known sorrow', 'One who owns the most cattle'] },
      traps: [{ match: 1, msg: 'In the *Mahabharata* the kings are hardly the happiest of men.' }, { match: 2, msg: 'That would be nobody. Yudhishthira’s answer is more modest.' }, { match: 3, msg: 'Wealth is not what makes the Yaksha smile.' }],
      glyph: '🍚'
    },
    concepts: ['lateral'], links: ['world-ind-yaksha-grass']
  },
  {
    id: 'world-ind-birbal-crows', title: 'Counting the Crows', diff: 2,
    source: 'A tale of Akbar and his minister Birbal from the folklore of North India; it is a folk story, not history.',
    text: 'The emperor Akbar, to test his minister Birbal, asks: “How many crows are there in my capital?”\n\nBirbal thinks for a moment and says: “**Exactly 21,469**, Your Majesty.”\n\n“And if I have them counted and find more?” “Then some have come to visit their relatives in the city.” “And if fewer?” “Then some of ours have gone to visit relatives elsewhere.”\n\nWhat is the trick in Birbal’s answer?',
    hints: ['Nobody is going to count all the crows in a city.', 'Birbal has an explanation ready for either kind of mistake.'],
    explain: 'Birbal gave a **definite number with an excuse ready for both ways of being wrong**: too many, and there are visitors; too few, and there are travellers. The number is unprovable, so it cannot be disproved. Akbar laughed and was satisfied: the moral of the tale is that a confident answer with room to turn round in is very hard to beat. (In another story, [[lat-birbals-line]] in the Lateral shelf, Birbal makes a line shorter without touching it.)',
    data: {
      ask: 'What is the trick?',
      answer: { choice: 1, choices: ['He counted the crows in secret the night before', 'He gave a firm number, with an excuse ready if anyone found a different one', 'He asked the crows to count themselves', 'He got the answer from a hired crow-catcher'] },
      traps: [{ match: 0, msg: 'Nobody could have counted them: the trick is in how he answered the emperor’s follow-up questions.' }, { match: 2, msg: 'A fine idea, but it is Birbal’s replies that do the work.' }],
      glyph: '🐦‍⬛'
    },
    concepts: ['lateral'], links: ['lat-birbals-line']
  },
  {
    id: 'world-ind-two-birds', title: 'Two Birds on One Tree', diff: 4,
    source: 'The Rigveda, hymn 1.164, verse 20 (India, composed about 1500 to 1000 BC); the Upanishads (Mundaka 3.1.1) return to the image and read it as below.',
    text: 'One of the riddles of the Rigveda, in our words:\n\n*Two birds, close companions, cling to the same tree. One eats the sweet fig; the other does not eat, but only looks on.*\n\nThe later Upanishads take this as a picture of a person. What do the two birds stand for?',
    hints: ['The tree is a person’s life. One bird tastes the fruit of it.', 'The bird that only watches never comes to harm.'],
    explain: 'In the traditional reading, one bird is the **self that acts and enjoys or suffers**, and the other is the **self that only watches**, quietly, from the same branch. The image has been read as a picture of mind and witness, or of the person and the divine, for well over two thousand years, and it is one of the most quoted lines of the whole of Sanskrit.',
    data: {
      ask: 'What are the two birds?',
      answer: { choice: 0, choices: ['The self that acts and tastes, and the self that only watches', 'A husband and a wife', 'Two brothers, one rich and one poor', 'The sun and the moon'] },
      traps: [{ match: 1, msg: 'It has been read that way in a few places, but the traditional reading is a different pair of companions.' }, { match: 2, msg: 'No: both birds sit on the same branch, and one is not hungry at all.' }],
      glyph: '🕊'
    },
    concepts: ['riddle-craft']
  },
  {
    id: 'world-ind-mahosadha', title: 'The Tug of War for a Child', diff: 2,
    source: 'The *Mahaummagga Jātaka* (Jātaka no. 546), an old Buddhist story of the wise Mahosadha, told in India and Sri Lanka.',
    text: 'Two women appear before Mahosadha, a boy who is famous for his wisdom, each holding one side of a child and each claiming to be the mother. (One of them is in fact a spirit who wanted to eat the child.) The court does not know what to do.\n\nMahosadha draws a line on the ground, puts the child on it, and asks each woman to take one hand. He tells them to pull the child across the line. What does the true mother do?',
    hints: ['The spirit only wants the child. The mother wants the child unharmed.', 'A pulled child cries.'],
    explain: 'When the child cried out, the **true mother let go**, because she could not bear to hurt it, while the other pulled with all her might. Mahosadha gave the child to the mother who had let go. The tale is a cousin of King Solomon’s ([[world-heb-solomon]]) and of the Chinese chalk circle ([[world-chn-chalk-circle]]).',
    data: {
      ask: 'What does the mother do?',
      answer: { choice: 1, choices: ['She pulls harder than the other', 'She lets go when the child cries out', 'She runs away with the child', 'She asks the court to cut the child in two'] },
      traps: [{ match: 0, msg: 'That would be what the false claimant does. Think of a mother who hears her child cry.' }, { match: 3, msg: 'That is Solomon’s test. Here the test is a tug of war.' }],
      glyph: '👩‍👦'
    },
    concepts: ['lateral'], links: ['world-heb-solomon', 'world-chn-chalk-circle']
  },
  {
    id: 'world-ind-paheli-corn', title: 'Pearls in a Shawl', diff: 2,
    source: 'A traditional Hindi *paheli* (riddle), often ascribed to the poet Amir Khusrau of Delhi (died 1325), though the attribution is uncertain.',
    text: '*Hari thi, man bhari thi, lakhon moti jadi thi; raja ji ke bagh mein dushala odhe khadi thi.*\n\n(Green she was, and full of heart, set with a hundred thousand pearls; in the king’s garden she stood, wrapped in a shawl.)\n\nWhat is she?',
    hints: ['The “pearls” are yellow and are pressed together on a stem. The shawl is green.', 'It is eaten roasted by the road side in India in the monsoon.'],
    explain: '**Corn on the cob**, *bhutta* in Hindi: the pearls are the kernels, and the shawl is the green husk that wraps them. The riddle is a favourite of Indian children, and the *bhutta* seller, roasting them over coals, is a familiar figure in the rain.',
    data: {
      answer: { text: ['corn', 'maize', 'a corn cob', 'corn on the cob', 'bhutta', 'sweetcorn', 'sweet corn', 'a cob of corn', 'corn cob', 'ear of corn', 'an ear of corn', 'makka', 'a maize cob', 'maize cob', 'cob'] },
      traps: [{ match: ['pearls', 'a pearl', 'pearl', 'a necklace', 'a princess', 'a queen', 'a rani'], msg: 'The pearls are in the riddle only. What grows in a garden, wears a green shawl and has a hundred thousand of them inside?' }],
      glyph: '🌽'
    },
    concepts: ['lateral'], links: ['anc-khusro-sky']
  },
  {
    id: 'world-ind-avvaiyar', title: 'Hot Fruit or Cold?', diff: 3,
    source: 'A popular Tamil legend of the poet Avvaiyar and the god Murugan, told in Tamil schools and on stage.',
    text: 'The old Tamil poet Avvaiyar, tired and hungry, rests under a jamun tree. High in the branches sits a young cowherd, who is really the god Murugan in disguise. “Grandmother,” he calls, “would you like a **hot** fruit or a **cold** fruit?”\n\nShe thinks it a strange question, but chooses: “A hot one.” He shakes a branch, and the ripe fruits fall in the sand. She picks one, blows the sand off, and eats it. “Grandmother,” says the boy, smiling, “why are you blowing on it? Is it too hot?”\n\nWhat was the joke?',
    hints: ['A fruit on a tree is never hot. He was not asking about temperature.', 'What was she really doing when she blew on the fruit?'],
    explain: 'She blew on the fruit to **clean off the sand**, and the boy teased her as if it were too hot: “hot fruit” was a joke, and the poet, who prided herself on knowing so much, had walked into it. Avvaiyar, humbled, realised who the boy was, and sang him a hymn. The story is said to teach that even the wisest may learn.',
    data: {
      ask: 'What was the joke?',
      answer: { choice: 0, choices: ['She was blowing off the sand as if the fruit were hot', 'The fruit was rotten inside', 'She had chosen a fruit that was still green', 'The sun had really roasted the fruit'] },
      traps: [{ match: 1, msg: 'The boy did not say anything about the taste. He asked why she blew.' }, { match: 3, msg: 'No: a fruit on a tree is not hot. The boy’s question was a trick.' }],
      glyph: '🍇'
    },
    concepts: ['lateral']
  },

  /* ---------- China: lantern riddles, character riddles and stories ---------- */
  {
    id: 'world-chn-sen', title: 'Three Trees Together', diff: 1,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'Chinese characters are built out of smaller ones, and one of the oldest riddle games is to describe a character by its parts. At the Lantern Festival, on the fifteenth day of the first month, such riddles are hung on lanterns, and whoever guesses right wins a small prize. Here is an easy one:\n\n**Three trees standing together.**\n\nThe tree is 木. Which character is made of three of them?',
    hints: ['One tree is 木 and two trees make 林, a grove.', 'A great many trees standing together, thick and dark.'],
    explain: 'The character is **森** (*sēn*, “forest”): three 木, one on top and two beneath. Two trees, 林 (*lín*), are a grove or woods; three are a thick forest. The doubling and tripling of a character to make a bigger idea is one of the ways Chinese builds new words from old.',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['森', '林', '木', '众'] },
      traps: [{ match: 1, msg: '林 has only two trees, which makes a grove.' }, { match: 2, msg: '木 is a single tree.' }, { match: 3, msg: '众 is three people, not three trees.' }],
      glyph: '森'
    },
    concepts: ['homophones'], links: ['world-chn-jing', 'world-chn-xiu']
  },
  {
    id: 'world-chn-qiu', title: 'A Person in a Box', diff: 1,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'Another character riddle, described by its pieces:\n\n**A person inside a box.**\n\nThe person is 人 and the box is 囗. Which character do they make?',
    hints: ['Put 人 inside 囗.', 'Someone who is shut in, and cannot leave.'],
    explain: 'The character is **囚** (*qiú*, “prisoner”), and the picture is exactly what the riddle says. Put a tree in the box instead and you get 困 (*kùn*, “trapped”, and also “sleepy”); put a jade in it and you get 国, “country”: see [[world-chn-guo]].',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['囚', '困', '因', '回'] },
      traps: [{ match: 1, msg: '困 has a tree in the box, not a person.' }, { match: 2, msg: '因 has the character for “big” in the box.' }],
      glyph: '囚'
    },
    concepts: ['homophones'], links: ['world-chn-guo']
  },
  {
    id: 'world-chn-xiu', title: 'Leaning on a Tree', diff: 1,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'A character riddle from the lanterns:\n\n**A person leaning against a tree.**\n\nA person is 人 (written 亻 at the left-hand side of a character) and the tree is 木. Which character is it?',
    hints: ['Put the 亻 on the left and the 木 on the right.', 'What does a person do when they lean on a tree?'],
    explain: 'The character is **休** (*xiū*, “to rest”): a person and a tree, as if drawn from life. It is one of the most charming characters in Chinese: to rest is to lean on a tree. (体, with 本 for the right-hand part, is “body”.)',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['休', '体', '林', '来'] },
      traps: [{ match: 1, msg: '体 has a person too, but the right-hand part is 本, the root.' }, { match: 2, msg: '林 has two trees and no person.' }],
      glyph: '休'
    },
    concepts: ['homophones'], links: ['world-chn-sen']
  },
  {
    id: 'world-chn-da', title: 'One Person', diff: 2,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'A short riddle for a lantern:\n\n**One person.**\n\nThat is “one”, 一, and “person”, 人: put the “one” on top and the “person” underneath. What character do you have?',
    hints: ['A horizontal stroke over a person with legs apart.', 'It is the opposite of 小 (“small”).'],
    explain: 'The character is **大** (*dà*, “big”). The riddle plays a trick, because the character 大 was first a picture of a person with arms stretched wide: “big” is a person standing with arms out. Now it is a “one” and a “person” as well.',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['大', '天', '太', '夫'] },
      traps: [{ match: 1, msg: '天 needs a “one” on top of a “big”: see [[world-chn-tian]].' }, { match: 2, msg: '太 has a dot as well.' }, { match: 3, msg: '夫 has two strokes over a person.' }],
      glyph: '大'
    },
    concepts: ['homophones'], links: ['world-chn-tian']
  },
  {
    id: 'world-chn-tian', title: 'One Above the Big', diff: 2,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'A companion to the last riddle: what character is made of **“one” on top of “big”** (一 on top of 大)?',
    hints: ['What is above the biggest thing you can think of?', 'It is above you as you read this, even in daytime.'],
    explain: 'The character is **天** (*tiān*, “sky” or “heaven”): the one on top of the big. In the oldest writing, the character showed a person with an enormous head, meaning “the top of a person”, and later the top of everything.',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['天', '夫', '太', '木'] },
      traps: [{ match: 1, msg: '夫 has two strokes across a person, not one on top of a big.' }, { match: 2, msg: '太 has a dot underneath, not a stroke on top.' }],
      glyph: '天'
    },
    concepts: ['homophones'], links: ['world-chn-da']
  },
  {
    id: 'world-chn-jian', title: 'One Big, One Small', diff: 2,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'A character riddle, fit for a lantern:\n\n**One big and one small.**\n\nThe big is 大 and the small is 小. Put the small **above** the big. What character have you made?',
    hints: ['Think of the shape it makes: narrow at the top, broad at the bottom.', 'It describes a needle, the tip of a pencil, a thorn.'],
    explain: 'The character is **尖** (*jiān*, “sharp” or “pointed”): the small on top of the big makes a point. (Small over “earth”, 小 over 土, is 尘 (*chén*), “dust”: a small piece of earth.)',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['尖', '尘', '少', '夹'] },
      traps: [{ match: 1, msg: '尘 is small over earth (土), which is dust.' }, { match: 2, msg: '少 (“few”) is 小 with a stroke, not 小 over 大.' }],
      glyph: '尖'
    },
    concepts: ['homophones']
  },
  {
    id: 'world-chn-jing', title: 'Three Suns', diff: 2,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'The Chinese language likes to repeat a character to make it stronger. A lantern says:\n\n**Three suns.**\n\nOne sun is 日. Three suns, one over two, make a character. Which is it?',
    hints: ['Two suns, 昌, mean “prosperous”. Three are brighter still.', 'It is a word for a clear, bright, sparkling thing that comes from a mine.'],
    explain: 'The character is **晶** (*jīng*, “crystal”, “bright”): three suns shining in one. The others are three mouths, 品 (*pǐn*, “goods”, “taste”), and three people, 众 (*zhòng*, “crowd”). A whole cluster of characters is built by tripling one idea; see [[world-chn-sen]].',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['晶', '品', '众', '昌'] },
      traps: [{ match: 1, msg: '品 is three mouths (口).' }, { match: 2, msg: '众 is three people.' }, { match: 3, msg: '昌 has only two suns.' }],
      glyph: '晶'
    },
    concepts: ['homophones'], links: ['world-chn-sen']
  },
  {
    id: 'world-chn-guo', title: 'A Jade in a Box', diff: 2,
    source: 'A traditional Chinese character riddle (*zimi*), of the kind written on lanterns for the Lantern Festival from the Song dynasty (960–1279).',
    text: 'A character riddle from the lanterns of the Lantern Festival:\n\n**A jade inside a box.**\n\nThe box is 囗 and the jade is 玉. Which character do they make?',
    hints: ['Put 玉 inside 囗, like a jewel in a case.', 'The box is a border, and the jade is what is inside it. Kings guard it.'],
    explain: 'The character is **国** (*guó*, “country”): the frame is the border, and the jade, a treasure, is what is worth guarding inside it. (The older form 國 shows a spear and a mouth inside a walled frame, a guarded place, but the riddle plays on the modern one.) A person in a box is a prisoner; see [[world-chn-qiu]].',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['国', '困', '因', '圆'] },
      traps: [{ match: 1, msg: '困 has a tree in the box, not a jade.' }, { match: 2, msg: '因 has the character for “big” in the box.' }, { match: 3, msg: '圆 has more than a jade inside it.' }],
      glyph: '国'
    },
    concepts: ['homophones'], links: ['world-chn-qiu']
  },
  {
    id: 'world-chn-rain', title: 'A Thousand Threads', diff: 1,
    source: 'A traditional Chinese children’s riddle (*míyǔ*), told again.',
    text: '*A thousand threads, ten thousand threads; when they fall into the water, they all vanish.*\n\nWhat are they?',
    hints: ['The threads fall from the sky.', 'They disappear when they hit a pond, leaving rings on the surface.'],
    explain: '**Rain**: the thin straight lines of a heavy shower look like silk threads, and every one vanishes the moment it reaches the water. In Chinese the character for rain, 雨, is itself made of drops falling from a cloud.',
    data: {
      answer: { text: ['rain', 'the rain', 'raindrops', 'a shower', 'rainfall', '雨', 'yu', 'drizzle', 'rain drops', 'a rainstorm'] },
      traps: [{ match: ['snow', 'hail', 'silk', 'threads', 'thread', 'a spider web', 'cobwebs', 'string'], msg: 'They look like threads, but the riddle says they vanish in the water. What falls from the sky and vanishes into a pond?' }],
      glyph: '雨'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-watermelon', title: 'A Green Coat, a Full Belly', diff: 1,
    source: 'A traditional Chinese children’s riddle (*míyǔ*), told again.',
    text: '*Wearing a green coat, its belly full of water. It has a great many children, and every one of them has a black face.*\n\nWhat is it?',
    hints: ['It is round or oval, and eaten in the hottest months.', 'The “children” are small, black and flat, and you spit them out.'],
    explain: 'A **watermelon**: a green rind, a belly full of sweet juice, and a great many black seeds for children. It is an especially good riddle for a hot day.',
    data: {
      answer: { text: ['watermelon', 'a watermelon', '西瓜', 'xigua', 'a melon', 'melon', 'water melon'] },
      traps: [{ match: ['a frog', 'frog', 'a pumpkin', 'pumpkin', 'a cucumber', 'cucumber', 'a pomegranate', 'pomegranate'], msg: 'A pomegranate has many seeds too, but it is red. Which fruit has a green coat, a belly full of water and black children?' }],
      glyph: '🍉'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-peanut', title: 'A Pockmarked House', diff: 2,
    source: 'A traditional Chinese children’s riddle (*míyǔ*), told again.',
    text: '*A pockmarked house, a red curtain, and inside it lives a plump white boy.*\n\nWhat is he?',
    hints: ['The “house” is a bumpy shell you crack with your fingers.', 'The “curtain” is a thin red skin that rubs off.'],
    explain: 'A **peanut**: the bumpy, pocked shell is the house, the thin reddish skin is the curtain, and the plump white kernel is the boy. The Chinese for peanut, 花生, means “flower birth”, and the riddle is told to children as they crack open a handful.',
    data: {
      answer: { text: ['peanut', 'a peanut', 'peanuts', '花生', 'huasheng', 'groundnut', 'a groundnut', 'monkey nut', 'a nut'] },
      traps: [{ match: ['an egg', 'egg', 'a walnut', 'walnut', 'a chestnut', 'chestnut', 'a lychee', 'lychee', 'a bean'], msg: 'A walnut has a house but no red curtain. Which nut has a bumpy shell, a red skin and a white kernel?' }],
      glyph: '🥜'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-lotus', title: 'A Little Girl in the Water', diff: 2,
    source: 'A traditional Chinese children’s riddle (*míyǔ*), told again.',
    text: '*A little girl sits in the middle of the water, wearing a pink jacket, and gives off a sweet scent again and again.*\n\nWho is she?',
    hints: ['She sits on a big round green leaf, in a pond.', 'Her jacket is made of petals.'],
    explain: 'A **lotus** flower: it sits above the water of a summer pond in its pink petals, with a fine fragrance. The lotus is one of the most loved flowers of China, a symbol of purity because it rises clean out of the mud.',
    data: {
      answer: { text: ['lotus', 'a lotus', 'lotus flower', 'a lotus flower', 'water lily', 'a water lily', 'waterlily', 'lily', '荷花', '莲花', 'hehua', 'lianhua', 'a lily', 'a waterlily'] },
      traps: [{ match: ['a girl', 'girl', 'a rose', 'rose', 'a fish', 'a frog', 'a duck', 'a princess'], msg: 'She is a girl only in the riddle. What flower sits on the water in a pink jacket?' }],
      glyph: '🪷'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-painting', title: 'The Mountain Without Sound', diff: 3,
    source: 'A famous Chinese riddle-poem, often credited to the Tang poet Wang Wei (about 700–760), though the attribution is uncertain; it is in every Chinese schoolbook.',
    text: '*From far away the mountain has its colours; from close by the water makes no sound. Spring goes, but the flowers stay; people come, but the birds are not startled.*\n\nWhat is this poem describing?',
    hints: ['Every line says that something is too still, or lasts too long, to be real.', 'It hangs on a wall, and you look at it from far and from near.'],
    explain: 'A **painting**, of a landscape. The mountain looks coloured from a distance; a river in a picture cannot roar; flowers in a painted spring never fade, and birds in a painting never fly off when someone approaches. Each line is a small paradox that dissolves once you know what is being described.',
    data: {
      answer: { text: ['a painting', 'painting', 'a picture', 'picture', 'a landscape painting', 'a landscape', '画', 'hua', 'a drawing', 'a scroll painting', 'a scroll', 'artwork', 'a work of art'] },
      traps: [{ match: ['a garden', 'garden', 'a dream', 'a mountain', 'mountain', 'a lake', 'nature', 'a photograph', 'a photo'], msg: 'Real gardens change, and real birds fly away. Which kind of scene stays the same?' }],
      glyph: '画'
    },
    concepts: ['riddle-craft']
  },
  {
    id: 'world-chn-he-cream', title: 'A Cup of Cream and One Word', diff: 3,
    source: 'Liu Yiqing, *Shishuo Xinyu* (“A New Account of the Tales of the World”, about AD 430), the chapter on quick wits; the story is of Cao Cao and his secretary Yang Xiu.',
    text: 'Someone sent the warlord Cao Cao a cup of cream. Cao Cao tasted a little, wrote a single character on the lid, **合**, and showed it to his officers. Nobody could think what it meant. When it came to the clever secretary Yang Xiu, he took a spoon, ate a mouthful, and passed the cup round: “The chancellor has told us each to take a bite. What is there to doubt?”\n\nHow did Yang Xiu read 合?',
    hints: ['合 can be taken apart into three smaller characters.', 'The pieces are 人 (a person), 一 (one) and 口 (a mouth).'],
    explain: 'He split **合** into **人 一 口**: “a person, one, mouth”: **one mouthful each**. That is the order Cao Cao had given, without a word. The story became a famous example of a mind that reads the pieces of a character, and it is why so many Chinese riddles ask for a character taken apart.',
    data: {
      ask: 'How did he read 合?',
      answer: { choice: 0, choices: ['As 人 + 一 + 口: each person, one mouthful', 'As “close the lid” (合 also means “to close”)', 'As “this cream belongs to Cao Cao”', 'As a warning that the cream was poisoned'] },
      traps: [{ match: 1, msg: 'The character does mean “to close”, but Yang Xiu did not read the word, he read the pieces.' }, { match: 3, msg: 'Cao Cao ate the cream himself: it was not poisoned.' }],
      glyph: '合'
    },
    concepts: ['homophones'], links: ['world-chn-jue', 'world-chn-jue-full']
  },
  {
    id: 'world-chn-jue', title: 'Yellow Silk', diff: 3,
    source: 'Liu Yiqing, *Shishuo Xinyu* (about AD 430): the first of four riddles on the Cao E stele, read by Yang Xiu.',
    text: 'On the back of an ancient stone tablet, someone cut eight characters as a riddle. The first two are **黄绢**, “yellow silk”. Yellow silk is coloured silk: a character for “colour”, 色, and a character for “silk”, 糸 (often written 丝). Put the two pieces together into one character.\n\nWhich character do you get?',
    hints: ['Put 糸 on the left and 色 on the right.', 'The word means “wonderful, without equal”, and also “to cut off”.'],
    explain: 'The character is **绝** (*jué*, 絕 in the old form): 糸 (silk) and 色 (colour). It means “matchless”, “utterly”, and also “to cut off”. It is the first of four characters in the riddle; the full answer is in [[world-chn-jue-full]].',
    data: {
      ask: 'Which character?',
      answer: { choice: 0, choices: ['绝', '结', '绢', '红'] },
      traps: [{ match: 1, msg: '结 has 糸 and 吉, which is a knot, not a colour.' }, { match: 2, msg: '绢 is the very word of the riddle. The trick is to take “yellow silk” apart and join its meaning.' }],
      glyph: '绝'
    },
    concepts: ['homophones'], links: ['world-chn-jue-full', 'world-chn-he-cream']
  },
  {
    id: 'world-chn-jue-full', title: 'Yellow Silk, Young Woman, Grandson, Mortar', diff: 5,
    source: 'Liu Yiqing, *Shishuo Xinyu* (about AD 430): Cao Cao and Yang Xiu read the riddle on the back of the stele of Cao E, a filial daughter of the Han dynasty.',
    text: 'Cao Cao and his secretary Yang Xiu ride past the stele of Cao E, a daughter who drowned in a river looking for her father’s body. On the back of the stone are eight characters:\n\n**黄绢幼妇，外孙齑臼**\n\n“Yellow silk; young woman; grandson (a daughter’s child); mortar for pickles.” Cao Cao asks Yang Xiu if he understands. “I do,” says Yang Xiu. “Do not tell me,” says Cao Cao, “let me think.” They ride thirty *li* (about ten kilometres) before Cao Cao laughs. They each write their answer, and the two answers agree.\n\nEach of the four riddles is a **new character, made by putting together the meanings**. What is the four-character message?',
    hints: ['You have solved the first: 黄绢 (coloured silk) is 绝. The others work the same way: “young woman”, 幼妇, is 少 (few, young) and 女 (woman).', '“Grandson through a daughter”, 外孙, is 女 and 子: a daughter and a child. “Mortar for pickles”, 齑臼, is something you *receive* (受) that is pungent (辛).'],
    explain: '黄绢 = 色 + 丝 = **绝**; 幼妇 = 少 + 女 = **妙**; 外孙 = 女 + 子 = **好**; 齑臼 = 受 + 辛 = **辞** (in the old form 辤). Together: **绝妙好辞**, “superb, perfect words”, the highest praise for a piece of writing, and the phrase entered the language: it is still used in Chinese for a masterpiece. Yang Xiu got it at once; Cao Cao, the story says, needed thirty *li*, and admitted that Yang Xiu was thirty *li* ahead of him.',
    data: {
      ask: 'What is the message?',
      answer: { choice: 0, choices: ['绝妙好辞: superb, perfect words', '万古流芳: fragrant for ten thousand ages', '孝女之碑: the stele of the filial daughter', '黄金万两: ten thousand ounces of gold'] },
      traps: [{ match: 2, msg: 'That would be a natural inscription, but the riddle is coded: it is made of pieces, not the plain words.' }, { match: 3, msg: 'The riddle mentions silk, not gold. Take each pair of words apart and put the pieces together.' }],
      glyph: '辞',
      figure: {
        w: 400, h: 130,
        svg: '<text x="200" y="66" text-anchor="middle" font-size="54" font-family="serif" fill="#3a3020" letter-spacing="8">黄绢幼妇</text><text x="200" y="118" text-anchor="middle" font-size="54" font-family="serif" fill="#3a3020" letter-spacing="8">外孙齑臼</text>'
      }
    },
    concepts: ['homophones'], links: ['world-chn-jue', 'world-chn-he-cream']
  },
  {
    id: 'world-chn-sima-guang', title: 'The Boy and the Great Jar', diff: 1,
    source: 'The *History of Song* (*Song Shi*), the biography of the scholar Sima Guang (1019–1086), and children’s books ever since.',
    text: 'The Song-dynasty historian Sima Guang, as a boy, was playing in a courtyard with other children near a huge jar of water. One of the children climbed up the jar, slipped, and fell into it; the water closed over his head. All the others ran away screaming for help.\n\nWhat did the young Sima Guang do?',
    hints: ['The jar was too tall to reach into, and there was no time to run for help.', 'The problem is the water, and the water is held by the jar.'],
    explain: 'He **picked up a stone and smashed the jar**: the water poured out and the child was saved. The point of the tale, told to Chinese children for nearly a thousand years, is that the others tried to get the boy out of the water and Sima Guang got the water away from the boy.',
    data: {
      ask: 'What does he do?',
      answer: { choice: 0, choices: ['He smashes the jar with a stone', 'He climbs in and holds the child up', 'He runs for a ladder', 'He throws a rope'] },
      traps: [{ match: 1, msg: 'He was too small, and might have drowned too. What single thing solves everything?' }, { match: 2, msg: 'There is no time: the child is under water.' }, { match: 3, msg: 'A rope would take a long while, and the child is a small one. Sima Guang finds a quicker way.' }],
      glyph: '🏺'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-chalk-circle', title: 'The Chalk Circle', diff: 2,
    source: 'The Yuan-dynasty play *The Story of the Chalk Circle* (*Huilan ji*, thirteenth to fourteenth century), attributed to Li Xingdao; Bertolt Brecht made a new play of it in the 1940s (*The Caucasian Chalk Circle*).',
    text: 'In a Chinese play, two women both claim to be the mother of one small boy, and appear before the judge Bao Zheng. The judge has a circle drawn in chalk on the floor and sets the boy in the middle of it. He tells each woman to take one of the boy’s hands, and says: “Whoever pulls him out of the circle is his mother.”\n\nWhat does the true mother do?',
    hints: ['Each woman is holding one of the boy’s arms.', 'Which of them cares what happens to the boy’s arm?'],
    explain: 'When the boy cried out, the **true mother let go**. The other woman pulled with all her might and dragged him out. The judge, of course, gave the child to the woman who had let go: she was the one who could not bear to hurt him. This is the same trial as those of [[world-heb-solomon]] and [[world-ind-mahosadha]], told again in a third country.',
    data: {
      ask: 'What does the mother do?',
      answer: { choice: 1, choices: ['She pulls with all her strength', 'She lets go when the boy cries out', 'She stands in the circle herself', 'She refuses to take part'] },
      traps: [{ match: 0, msg: 'That is what the false claimant does. Think of a mother holding a child by the hand who cries out.' }, { match: 3, msg: 'Neither woman refuses: both hold on. The difference is how long.' }],
      glyph: '⭕'
    },
    concepts: ['lateral'], links: ['world-heb-solomon', 'world-ind-mahosadha']
  },
  {
    id: 'world-chn-three-golden', title: 'The Three Golden Statues', diff: 3,
    source: 'A traditional Chinese teaching story (“the three golden men”), told to children for generations.',
    text: 'A neighbouring kingdom sent the emperor of China three golden statues, identical in size, shape and weight, with a message: “Which of these is worth the most? Answer, or you are not as wise as they say.” The court weighed them and found no difference. Craftsmen inspected them and found no difference. Then an old minister took a piece of straw and passed it through the ear of each statue in turn.\n\nIn the first, the straw came out of the other ear. In the second, it came out of the mouth. In the third, it went down into the belly and did not come out.\n\nWhich statue did the minister call the most valuable?',
    hints: ['The three statues are like three kinds of listener.', 'Which listener takes in what they hear and keeps it?'],
    explain: 'The **third**: the one who takes in what he hears and keeps it inside. The first is the listener who forgets everything (in one ear, out the other), the second one who repeats everything he hears; the third one who listens, thinks it over, and does not blab. The neighbouring king had the answer sent back to him, and admitted that China had a wise man.',
    data: {
      ask: 'Which statue is best?',
      answer: { choice: 2, choices: ['The first: the straw came out of the other ear', 'The second: the straw came out of the mouth', 'The third: the straw went into the belly and stayed', 'All three: gold is gold'] },
      traps: [{ match: 0, msg: 'That is a listener who forgets all at once, in one ear and out the other.' }, { match: 1, msg: 'That one repeats everything he is told: a gossip.' }, { match: 3, msg: 'The weighing did show they were the same. The old minister looked for a difference that was not in the metal.' }],
      glyph: '🗿'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-zodiac-race', title: 'The Great Race', diff: 1,
    source: 'A traditional Chinese folk tale of how the twelve animals of the zodiac were chosen.',
    text: 'The Jade Emperor, the story says, held a race across a wide, fast river: the first twelve animals across would each have a year named after them. The Ox, a strong swimmer, set off before dawn. On his back sat the small clever Rat, who could not swim well.\n\nJust as the Ox climbed out on the far bank, the Rat jumped from his back, and touched down before him. How did the Rat win the race?',
    hints: ['The Rat is far too small and weak to swim a river.', 'Someone stronger did the work for him.'],
    explain: 'The Rat **rode on the Ox’s back** and jumped off at the last moment. The Ox came second, then the Tiger, the Rabbit, the Dragon, the Snake, the Horse, the Goat, the Monkey, the Rooster, the Dog and the Pig. The Cat, in most tellings, was left out: the Rat had forgotten to wake him, or told him the wrong day, and the two have been enemies ever since.',
    data: {
      ask: 'How did the Rat win?',
      answer: { choice: 0, choices: ['He rode on the Ox’s back and jumped off at the last moment', 'He swam faster than any other animal', 'He found a bridge', 'A wave carried him ashore'] },
      traps: [{ match: 1, msg: 'The Rat is a poor swimmer, which is the whole point of the story.' }],
      glyph: '🐀'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-chn-xie-mute', title: 'The Mute and the Bitter Herb', diff: 2,
    source: 'A traditional Chinese *xiehouyu* (歇后语), a two-part saying whose second part is left unspoken.',
    text: 'The Chinese language has a kind of saying called *xiehouyu*: the first half is a picture, and the second half, the meaning, is “rested”, left for the listener. A well-known one begins: **“A mute person eating bitter herbs...”** (哑巴吃黄连, *yǎba chī huánglián*).\n\nHuanglian is *coptis*, a root so bitter that it is used as medicine. How does the saying end?',
    hints: ['Think of the person: he is in pain, but he cannot say how bitter it is.', 'The second half says he has a bitter time and cannot tell anybody.'],
    explain: '“...**he has a bitter time, but cannot say so**” (有苦说不出, *yǒu kǔ shuō bù chū*). People use it of someone suffering a hardship in silence, or of someone who has been wronged and cannot explain. The picture does all the work; the punchline is often not spoken, since anyone in China knows how it ends.',
    data: {
      ask: 'How does the saying end?',
      answer: { choice: 0, choices: ['...it is bitter, but he cannot say so', '...it is too much medicine', '...he is too quiet a person', '...the meal is delicious'] },
      traps: [{ match: 1, msg: 'The herb is medicine, but the saying is about the man and his voice.' }, { match: 3, msg: 'The herb is very bitter.' }],
      glyph: '哑'
    },
    concepts: ['homophones'], links: ['world-chn-xie-books', 'world-chn-xie-lantern']
  },
  {
    id: 'world-chn-xie-books', title: 'Confucius Moves House', diff: 3,
    source: 'A traditional Chinese *xiehouyu* (歇后语), a two-part saying whose second part is left unspoken; the pun works in Mandarin.',
    text: 'Another *xiehouyu*: **“Confucius moves house...”** (孔夫子搬家). The great sage Confucius, the picture says, would have had a great many books to carry.\n\nThe second half is a pun: “...all shū!” (尽是书, *jìn shì shū*). In Mandarin *shū* means “book”, and it is also the sound of another word, 输 (*shū*, “to lose”).\n\nWhat is a Chinese speaker saying about a football team that loses every match, when they use this saying?',
    hints: ['The first *shū* is a book. What is the other *shū* in the pun?', 'It is what a team does when it does not win.'],
    explain: 'They mean the team is **losing all the time**: “all *shū*” is “all books” for Confucius’s move, and “all losses” for the team. A pun that turns a scholar’s removal into a defeat. It is one of the most quoted *xiehouyu* in China.',
    data: {
      ask: 'What does the pun say about the team?',
      answer: { choice: 1, choices: ['It reads too many books', 'It loses every time', 'It is moving to a new ground', 'It is very wise'] },
      traps: [{ match: 0, msg: 'That is the picture. The pun changes the *shū*.' }, { match: 3, msg: 'Confucius was wise, but the pun is about defeat.' }],
      glyph: '书'
    },
    concepts: ['homophones'], tags: ['pun'], links: ['world-chn-xie-mute', 'world-chn-xie-lantern']
  },
  {
    id: 'world-chn-xie-lantern', title: 'The Nephew’s Lantern', diff: 3,
    source: 'A traditional Chinese *xiehouyu* (歇后语), a two-part saying whose second part is left unspoken; the pun works in Mandarin.',
    text: 'One more *xiehouyu*: **“A nephew carries a lantern...”** (外甥打灯笼, *wàishēng dǎ dēnglong*). He is lighting the way for his uncle, his mother’s brother, which in Chinese is 舅 (*jiù*).\n\nThe second half is a pun: *“...he lights up his uncle.”* (照舅, *zhào jiù*). Change the tone and the character 舅 gives 旧 (*jiù*, “old”), and 照旧 means “as before”.\n\nWhat does a Chinese speaker mean by it?',
    hints: ['The uncle (*jiù*) is a pun on another word that means “old”.', '“Shining on the old”, taken as an idiom, means that things are kept as they were.'],
    explain: '“Things are **as they were before**; nothing has changed” (照旧, *zhàojiù*). The lantern lights up the uncle (舅), which sounds like “old” (旧), and “to shine on the old” is “to go on as usual”. It is said when a plan is announced and then goes on exactly the way it always did.',
    data: {
      ask: 'What does it mean?',
      answer: { choice: 0, choices: ['Everything goes on as before', 'The uncle will visit tonight', 'It is too dark to see', 'A family party is on its way'] },
      traps: [{ match: 1, msg: 'The uncle is in the picture only: the pun turns him into something else.' }, { match: 2, msg: 'The lantern is lit. Think of the pun on *jiù*.' }],
      glyph: '灯'
    },
    concepts: ['homophones'], tags: ['pun'], links: ['world-chn-xie-mute', 'world-chn-xie-books']
  },
  {
    id: 'world-chn-white-horse', title: 'A White Horse Is Not a Horse', diff: 4,
    source: 'Gongsun Long (about 320 to 250 BC), the “White Horse Discourse” (*Baima lun*); a story in the *Han Feizi* has him pay the horse-toll at a border pass all the same.',
    text: 'The Chinese philosopher Gongsun Long is famous for this claim: **“A white horse is not a horse.”** It sounds absurd, since every white horse is a horse, and he was mocked for it, but he had an argument.\n\nWhat was his reasoning?',
    hints: ['He is not saying that white horses do not exist. He is saying that the two words do not mean the same.', 'One word names a shape; the other names a shape and a colour.'],
    explain: '“Horse” names a **shape**; “white” names a **colour**; “white horse” names a shape *and* a colour. So “white horse” and “horse” are not the same. A yellow or a black horse would satisfy “I want a horse”, but not “I want a white horse”. It is a lesson in the difference between a kind and a member of it, and the argument is still discussed. In the story in the *Han Feizi* he is stopped at a frontier where horses may not be taken through, and argues his way past, though he is made to pay the toll anyway.',
    data: {
      ask: 'What is Gongsun Long’s argument?',
      answer: { choice: 0, choices: ['“Horse” names a shape, “white horse” names a shape and a colour, so they do not mean the same', 'White horses are too rare to count as horses', 'Horses come in many colours, so “horse” is a false word', 'It is a rule to escape the horse tax'] },
      traps: [{ match: 1, msg: 'He is not talking about numbers of horses but about what the words mean.' }, { match: 3, msg: 'It is not a tax dodge, though the story about the border pass has that flavour. His argument is about words.' }],
      glyph: '马'
    },
    concepts: ['paradox']
  },
  {
    id: 'world-chn-hao-fish', title: 'The Joy of the Fish', diff: 4,
    source: 'The *Zhuangzi* (about the third century BC), chapter 17, “Autumn Floods”: Zhuangzi and Hui Shi on the bridge over the Hao river.',
    text: 'The Chinese sage Zhuangzi and his friend and rival Hui Shi are strolling on a bridge over the river Hao. Zhuangzi says: “Look how happily the minnows dart about. That is the joy of fish.”\n\n“You are not a fish,” says Hui Shi. “How do you know the joy of fish?” “You are not me,” says Zhuangzi. “How do you know I do not know it?” “I am not you, and I do not know what you know,” says Hui Shi. “But you are certainly not a fish, so you cannot know what the fish feel!”\n\nHow does Zhuangzi answer?',
    hints: ['He goes back to Hui Shi’s exact words at the start.', 'Look at what was assumed by the question “How do you know?”'],
    explain: '“Let us go back to where we began. You said, *How do you know the joy of fish?* — and so you already **took it that I knew it**, and asked how. I know it **from here, on the bridge over the Hao**.” It is a friendly joust that has been quoted in Chinese philosophy for over two thousand years: how can we know what another creature feels? And is “how” a question that assumes “that”?',
    data: {
      ask: 'How does Zhuangzi answer?',
      answer: { choice: 1, choices: ['I do know, because I have also been a fish', 'You asked *how* I knew, so you took it that I knew; I know it from the bridge', 'You are right; I cannot know it', 'Let us ask the fish'] },
      traps: [{ match: 0, msg: 'Zhuangzi once dreamt he was a butterfly, but in this story he never claims to have been a fish.' }, { match: 2, msg: 'He does not give in: the question itself has a hole in it.' }, { match: 3, msg: 'A lovely idea, but the fish are not consulted.' }],
      glyph: '🐟'
    },
    concepts: ['paradox']
  },

  /* ---------- Japan ---------- */
  {
    id: 'world-jpn-pan', title: 'The Bread You Cannot Eat', diff: 1,
    source: 'A popular Japanese children’s riddle (*nazo*), told again; the pun works in Japanese.',
    text: 'Japanese children love this *nazo* (riddle): ***Pan wa pan demo, taberarenai pan wa?*** (パンはパンでも、食べられないパンは？)\n\n“Bread is bread, but what kind of *pan* cannot be eaten?” The word *pan* (パン) means bread in Japanese.',
    hints: ['The other *pan* is a word from English, and it is a kitchen tool.', 'You use it to fry eggs.'],
    explain: 'A **frying pan** (フライパン, *furaipan*). *Pan* for bread is much older: it came from the Portuguese *pão*, when Portuguese traders and missionaries reached Japan in the sixteenth century. The riddle joins the two unrelated *pan* words by their sound.',
    data: {
      answer: { text: ['a frying pan', 'frying pan', 'furaipan', 'フライパン', 'a pan', 'pan', 'skillet', 'a skillet', 'a fry pan', 'fry pan', 'the frying pan'] },
      traps: [{ match: ['a cake', 'cake', 'a bun', 'bun', 'pan de sal', 'stale bread', 'a toy', 'plastic bread', 'bread'], msg: 'It cannot be eaten, so it is not a kind of bread. The other *pan* is a word from English.' }],
      glyph: 'パン'
    },
    concepts: ['homophones'], tags: ['pun']
  },
  {
    id: 'world-jpn-shinbunshi', title: 'The Same Both Ways', diff: 3,
    source: 'The Japanese tradition of *kaibun* (回文), phrases that read the same forwards and backwards in the syllables (kana).',
    text: 'The Japanese enjoy *kaibun*, phrases that read the same from either end in kana, the syllable letters. A famous one is *take yabu yaketa*, たけやぶやけた, “the bamboo grove burned down”: read it backwards and it is the same.\n\nHere is a riddle in the same style. A common household word is spelled **し・ん・ぶ・ん・し** (*shi-n-bu-n-shi*), which reads the same both ways. You read it every morning. What is it?',
    hints: ['It is made of paper, and printed in black and white every day.', 'Fishmongers used to wrap fish in it.'],
    explain: 'A **newspaper**: *shinbunshi* (新聞紙, “newspaper”, as paper). It is a perfect palindrome in kana: し-ん-ぶ-ん-し. Japanese, with its syllable script, is a good language for this sort of palindrome, and the *kaibun* is an old and respected art with a tradition of its own.',
    data: {
      answer: { text: ['a newspaper', 'newspaper', 'the newspaper', 'shinbunshi', '新聞紙', 'shinbun', '新聞', 'newsprint', 'news paper', 'the news'] },
      traps: [{ match: ['a book', 'book', 'a magazine', 'magazine', 'a letter', 'a diary', 'a calendar'], msg: 'Close, but the answer is read every morning, on cheap paper, and is a palindrome in Japanese.' }],
      glyph: 'し'
    },
    concepts: ['homophones']
  },
  {
    id: 'world-jpn-ikkyu-tiger', title: 'The Tiger on the Screen', diff: 2,
    source: 'A legend of Ikkyū (1394–1481), the witty Zen monk, from the anecdote collections of the Edo period; the story is legend, not history.',
    text: 'The little monk Ikkyū is so quick-witted that the shogun decides to test him. He has a folding screen brought in on which a fierce tiger has been painted, and says: “Every night this tiger frightens me. Ikkyū, tie it up for me with a rope.”\n\nIkkyū rolls up his sleeves and takes the rope.\n\nWhat does he say?',
    hints: ['He cannot tie a painted tiger. But he can ask the shogun to do something impossible in return.', 'The tiger has to be somewhere he can tie it.'],
    explain: '“Very well, sir. Please would you **drive the tiger out of the screen**, and I will tie it up at once.” The shogun could not; and so the boy showed that the test, like the tiger, was only a picture. The stories of Ikkyū are told to Japanese children as models of quick thinking.',
    data: {
      ask: 'What does Ikkyū say?',
      answer: { choice: 1, choices: ['Tigers cannot be tied up; the shogun has lost his wits', 'Please drive the tiger out of the screen first, and then I will tie it', 'I will ask the painter for a rope', 'I will tie up the screen instead'] },
      traps: [{ match: 0, msg: 'Ikkyū would never insult the shogun. He is respectful, and he is clever.' }, { match: 3, msg: 'That would be a way to change the test, but it is not what Ikkyū says.' }],
      glyph: '🐅'
    },
    concepts: ['lateral'], links: ['world-jpn-ikkyu-bridge', 'world-jpn-ikkyu-sweets']
  },
  {
    id: 'world-jpn-ikkyu-bridge', title: 'The Bridge and the Sign', diff: 3,
    source: 'A legend of Ikkyū (1394–1481), the witty Zen monk, from the anecdote collections of the Edo period; the pun works in Japanese.',
    text: 'A rich man has set up a sign at the end of a bridge, to keep Ikkyū from crossing it. It reads *Kono hashi wataru bekarazu*: このはしわたるべからず.\n\nIn Japanese, *hashi* means both **bridge** (橋) and **edge** (端). So the sign can mean either “Do not cross this bridge” or “Do not cross by the edge of this bridge”.\n\nWhat does Ikkyū do?',
    hints: ['Read the sign as though *hashi* meant “edge”.', 'Where is he allowed to walk?'],
    explain: 'He walks across, **down the middle of the bridge**. The sign says nothing against walking in the middle: it only forbids the edge. The man who put up the sign, having lost, had no choice but to welcome the boy. A legend, of course, but it shows how a pun, in Japanese, can open or shut a door.',
    data: {
      ask: 'What does Ikkyū do?',
      answer: { choice: 0, choices: ['He crosses down the middle: the sign forbids only the edge', 'He goes home and crosses another day', 'He swims the river', 'He takes the sign down and crosses'] },
      traps: [{ match: 1, msg: 'Ikkyū does not give up so easily. Read *hashi* again.' }, { match: 2, msg: 'There is a bridge, and he will use it, but read the sign as a pun.' }, { match: 3, msg: 'Ikkyū does not need to break any rule: he uses the sign’s own words.' }],
      glyph: '橋'
    },
    concepts: ['homophones'], tags: ['pun'], links: ['world-jpn-ikkyu-tiger']
  },
  {
    id: 'world-jpn-ikkyu-sweets', title: 'The Poison in the Jar', diff: 2,
    source: 'A legend of Ikkyū (1394–1481), the witty Zen monk, from the anecdote collections of the Edo period; the story is legend, not history.',
    text: 'The priest of Ikkyū’s temple has a jar of sweet syrup which he loves, and to keep the boys away from it he tells them it is **deadly poison**. One day, while the priest is away, Ikkyū breaks the priest’s most precious tea bowl by accident. He is frightened. He eats the whole jar of syrup.\n\nWhen the priest returns, what does Ikkyū say?',
    hints: ['He has to explain two things at once: the empty jar and the broken bowl.', 'It has to do with the “poison”.'],
    explain: '“I am so very sorry, Master. I broke your precious bowl, and I wanted to die to make up for it, so I **ate the poison**. But I am not dead at all.” Ikkyū owns up to the crime and eats the syrup with one stroke. It is one of the oldest jokes about a clever child who beats a grown-up at his own game.',
    data: {
      ask: 'What does Ikkyū say?',
      answer: { choice: 0, choices: ['I broke your bowl and ate the poison to die, but it did not work', 'The bowl and the syrup were both broken by a cat', 'I ate the syrup because I was hungry', 'I broke the bowl on purpose'] },
      traps: [{ match: 1, msg: 'Ikkyū tells the truth, and makes the truth funny.' }, { match: 2, msg: 'That is true, but not what Ikkyū says. He has to use the “poison” the priest himself invented.' }],
      glyph: '🍯'
    },
    concepts: ['lateral'], links: ['world-jpn-ikkyu-tiger']
  },
  {
    id: 'world-jpn-shiritori', title: 'The Last Word', diff: 2,
    source: 'The Japanese word game *shiritori* (しりとり, “taking the end”), played by children and grown-ups for centuries.',
    text: 'Shiritori is a word-chain game played by Japanese children: each player must say a word that begins with the **last kana** (syllable letter) of the previous word, and a word may not be repeated. A word ending in **ん** or **ン** (*n*) loses the game, because no Japanese word begins with *n*.\n\nThe chain so far: りんご (*ringo*, apple) → ごりら (*gorira*, gorilla) → ...\n\nThe next player must start with **ら** (*ra*). Which of these words loses the game on the spot?',
    hints: ['Look at the last kana of each word.', 'Only one of the four ends in ん (ン).'],
    explain: '**ラーメン** (*rāmen*, noodle soup) ends in ン, so the next player has no possible word, and whoever says it loses. (The long-vowel dash ー does not matter: the last kana of ラーメン is ン.) The other three end in ぱ, だ and と, all fine. Shiritori is an excellent game for learning kana, and every child in Japan knows the losing ending.',
    data: {
      ask: 'Which word loses?',
      answer: { choice: 2, choices: ['らっぱ (*rappa*, trumpet)', 'らくだ (*rakuda*, camel)', 'ラーメン (*rāmen*, noodles)', 'らいと (*raito*, light)'] },
      traps: [{ match: 0, msg: 'らっぱ ends in ぱ, so the next player can go on with a word beginning ぱ.' }, { match: 1, msg: 'らくだ ends in だ: no problem for the next player.' }, { match: 3, msg: 'らいと ends in と: fine for the next player.' }],
      glyph: 'ん'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-jpn-ooka-eel', title: 'The Smell of Eel', diff: 2,
    source: 'A tale of Ōoka Tadasuke (1677–1752), the Edo magistrate of Japanese storytelling (the *Ōoka seidan*), where the famous judge settles cases with quick wit; a like tale is told of Nasreddin Hodja.',
    text: 'A poor man, unable to afford anything but plain rice, sits every day outside the shop of an eel-grill and eats his rice in the smoky, delicious smell of the grilling eel. After a week the shop owner is furious: “You have been enjoying the smell of my eels for a week. Pay me!” The poor man has no money to pay for eels. The two go to the magistrate, Ōoka.\n\nŌoka asks the poor man to take out a few coins, and he does.\n\nHow does the magistrate settle the case?',
    hints: ['The smell of eel is not a thing you can weigh. What is the fair payment for a smell?', 'The owner’s ears, not his purse, are paid.'],
    explain: 'Ōoka told the poor man to **shake the coins in his hands** so that the shop owner could hear them, and declared: “The sound of the coins is fair payment for the smell of the eels.” The owner had wanted a real coin for an unreal thing; he had a sound for a smell. The same story is told, with a different judge, in Turkey about the Hodja, and in other places besides.',
    data: {
      ask: 'How does Ōoka settle it?',
      answer: { choice: 0, choices: ['He has the poor man jingle the coins and says the sound pays for the smell', 'He makes the poor man work in the shop for a week', 'He orders the shop closed', 'He pays the owner himself'] },
      traps: [{ match: 1, msg: 'That would be a fair penalty in some courts, but Ōoka is more playful.' }, { match: 2, msg: 'A rather heavy punishment for a smell. Ōoka has a wittier idea.' }, { match: 3, msg: 'Kind, but no: Ōoka’s answer costs nobody a coin.' }],
      glyph: '🐟'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-jpn-jugemu', title: 'A Very Long Name', diff: 2,
    source: 'The Japanese comic story *Jugemu* (寿限無), a classic of *rakugo*, the art of sit-down comic storytelling of the Edo period.',
    text: 'In a rakugo tale a father asks a monk for a lucky name for his son, and the monk offers him a great many, each luckier than the last. The father, unable to choose, gives the boy **all of them**: a name that takes about a minute to say, beginning *Jugemu jugemu gokō no surikire...*\n\nOne day the neighbour’s boy Kin-chan comes running in tears to his mother, with a big bump on his head. “Jugemu hit me!” Kin’s mother marches round to complain, and begins to recite the boy’s whole name.\n\nWhat happens by the time she has said it?',
    hints: ['Reciting the name takes a very long time.', 'A bump does not last for ever.'],
    explain: 'By the time she reaches the end of the name, **the bump has healed** and gone down. The story is a favourite of *rakugo* performers, who race through the name faster and faster to please the audience. It is a joke about names, about time, and about how a long formality is the best way to let anger cool.',
    data: {
      ask: 'What happens?',
      answer: { choice: 1, choices: ['The boys have made friends again', 'The bump on the head has healed by the end of the name', 'Jugemu has run away', 'The mother has forgotten why she came'] },
      traps: [{ match: 0, msg: 'Perhaps, but the joke is about the bump, and about time.' }, { match: 3, msg: 'Nearly: but the joke is more physical than that.' }],
      glyph: '寿'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-jpn-kaguya', title: 'Five Impossible Gifts', diff: 3,
    source: '*The Tale of the Bamboo Cutter* (*Taketori monogatari*), the oldest surviving Japanese tale, written about the tenth century.',
    text: 'In *The Tale of the Bamboo Cutter* the moon-princess Kaguya-hime grows up into so beautiful a woman that five nobles ask for her hand. She does not want any of them, so she sets each a task that cannot be done: to bring her a treasure from a far and legendary place.\n\nThe five treasures are: the stone begging-bowl of the Buddha, a jewelled branch from Mount Hōrai, a robe made of the fur of the fire-rat (which cannot burn), a jewel from the neck of a dragon, and the shell that swallows carry, which gives easy childbirth.\n\nWhich of these four is **not** one of her five treasures?',
    hints: ['Three of the four are exactly as listed. One of them is not in the tale.', 'The one that was made up for this puzzle comes from the sun.'],
    explain: 'A **ring of gold from the sun** was not one of the five (it is an invention of this puzzle). All five of the real requests are impossible, and each of the suitors cheats in a different way: one forges the bowl, one hires craftsmen to make a false branch, one buys a robe that burns... The princess sees through every one, and in the end returns to the moon.',
    data: {
      ask: 'Which one was not asked for?',
      answer: { choice: 2, choices: ['The Buddha’s stone begging-bowl', 'A robe made from the fur of the fire-rat', 'A ring of gold from the sun', 'A jewel from the neck of a dragon'] },
      traps: [{ match: 0, msg: 'That one is in the tale: the first noble is sent to India to find it.' }, { match: 1, msg: 'That one is in the tale: the fire-rat robe tests the third suitor, who buys a fake.' }, { match: 3, msg: 'That one is in the tale: the dragon’s jewel is what the fourth suitor is sent to find.' }],
      glyph: '🎋'
    },
    concepts: ['lateral']
  },

  /* ---------- the Philippines, New Zealand, Malaya ---------- */
  {
    id: 'world-fil-pako', title: 'Pedro Hides', diff: 1,
    source: 'A traditional Tagalog *bugtong* (riddle) of the Philippines. Bugtong are short rhymed lines, and asking them is a game for both children and grown-ups.',
    text: '*Nagtago si Pedro, labas ang ulo.*\n\n(Pedro hid, but his head sticks out.)\n\nWho is Pedro?',
    hints: ['He is hard and made of metal, and he goes into wood.', 'You bang his head with a hammer.'],
    explain: 'A **nail** (*pako*): hammered into a plank, all that shows is its head. Tagalog *bugtong* often give the object a human name, like Pedro, so that it is at once a joke and a picture.',
    data: {
      answer: { text: ['a nail', 'nail', 'pako', 'ang pako', 'the nail', 'nails', 'a screw', 'screw', 'a tack', 'a pin'] },
      traps: [{ match: ['a man', 'man', 'a boy', 'a ghost', 'a mole', 'a turtle', 'turtle', 'a tortoise'], msg: 'Pedro is a person in the riddle only. What goes in and shows only its head?' }],
      glyph: '📌'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-fil-bibig', title: 'A Deep Well of Blades', diff: 2,
    source: 'A traditional Tagalog *bugtong* (riddle) of the Philippines.',
    text: '*Isang balong malalim, puno ng patalim.*\n\n(A deep well, full of blades.)\n\nWhat is it?',
    hints: ['It is warm and wet, and you carry it with you.', 'The blades are white and are used for chewing.'],
    explain: 'The **mouth** (*bibig*), with its teeth as the blades. The Philippine riddle-makers, like the Spanish ones, favour pictures of things that are at once frightening and ordinary.',
    data: {
      answer: { text: ['the mouth', 'mouth', 'a mouth', 'bibig', 'ang bibig', 'mouth and teeth', 'teeth', 'the teeth'] },
      traps: [{ match: ['a well', 'well', 'a cave', 'cave', 'a river', 'a trap', 'a knife drawer'], msg: 'The well and the blades are in the riddle only. What deep place have you always with you?' }],
      glyph: '👄'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-fil-bayabas', title: 'One Guava, Seven Holes', diff: 2,
    source: 'A traditional Tagalog *bugtong* (riddle) of the Philippines.',
    text: '*Isang bayabas, pito ang butas.*\n\n(One guava, and seven holes in it.)\n\nWhat is it?',
    hints: ['It is round and on top of a body, and you see out of some of the holes.', 'Count: two, two, two and one.'],
    explain: 'The **face** or **head** (*mukha*): two eyes, two nostrils, two ears and a mouth make seven openings. The guava is a round fruit, and the head of a Filipino child, in the riddle, is its close cousin.',
    data: {
      answer: { text: ['the face', 'face', 'a face', 'the head', 'head', 'a head', 'mukha', 'ulo', 'my face', 'my head', 'human head', 'human face', 'a person’s face', 'a person’s head'] },
      traps: [{ match: ['a guava', 'guava', 'a fruit', 'fruit', 'a flute', 'a flute with seven holes', 'a sponge', 'a bayabas'], msg: 'The guava is in the picture only; it does not have seven holes. What round thing on a body has seven?' }],
      glyph: '7'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-fil-karayom', title: 'Little Nene Can Sew', diff: 2,
    source: 'A traditional Tagalog *bugtong* (riddle) of the Philippines.',
    text: '*Maliit pa si Nene, marunong nang manahi.*\n\n(Nene is still small, yet she already knows how to sew.)\n\nWho is Nene?',
    hints: ['She is thin, sharp and lives in a sewing basket.', 'She has one eye and a very long tail.'],
    explain: 'A **needle** (*karayom*): tiny, thin and clever, with a thread trailing behind as a tail. The small girl who can do a grown-up’s work is the pattern of many Filipino riddles.',
    data: {
      answer: { text: ['a needle', 'needle', 'karayom', 'ang karayom', 'a sewing needle', 'the needle', 'needle and thread', 'a needle and thread'] },
      traps: [{ match: ['a girl', 'girl', 'a child', 'a seamstress', 'a tailor', 'a thimble', 'thimble', 'scissors', 'thread', 'a thread'], msg: 'Nene is a girl only in the riddle. What is small, and does a seamstress’s work?' }],
      glyph: '🪡'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-fil-saranggola', title: 'Bones and Skin, Flying', diff: 2,
    source: 'A traditional Tagalog *bugtong* (riddle) of the Philippines.',
    text: '*Buto’t balat, lumilipad.*\n\n(Bones and skin only, and it flies.)\n\nWhat is it?',
    hints: ['It is held by a string, and needs a good wind.', 'Its bones are sticks, and its skin is paper.'],
    explain: 'A **kite** (*saranggola*): a frame of thin sticks (the bones) covered in paper or cloth (the skin), lifted by the wind. Kite-flying is a favourite Philippine children’s pastime, and the riddle is at its best in the windy season.',
    data: {
      answer: { text: ['a kite', 'kite', 'saranggola', 'ang saranggola', 'the kite', 'kites', 'a paper kite', 'a bat', 'bat'] },
      traps: [{ match: ['a bird', 'bird', 'a ghost', 'a plane', 'an aeroplane', 'airplane', 'a paper plane', 'a balloon'], msg: 'A bird has flesh as well. What flies with just sticks and paper, and a string?' }],
      glyph: '🪁'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-fil-ilaw', title: 'One Grain of Rice', diff: 2,
    source: 'A traditional Tagalog *bugtong* (riddle) of the Philippines.',
    text: '*Isang butil ng palay, sikip sa buong bahay.*\n\n(One grain of rice, and it crowds the whole house.)\n\nWhat is it?',
    hints: ['It takes up no room, and yet it fills every corner.', 'It is small at the top of a wick, and you switch it on at night.'],
    explain: 'A **light**, a lamp: a small flame, like a grain of rice, fills every corner of the house with brightness. In the days of oil lamps the picture was a very exact one.',
    data: {
      answer: { text: ['light', 'a light', 'a lamp', 'lamp', 'ilaw', 'ang ilaw', 'the light', 'a candle', 'candle', 'a light bulb', 'light bulb', 'a bulb', 'a flame', 'flame', 'an oil lamp', 'lamplight'] },
      traps: [{ match: ['rice', 'a grain of rice', 'a grain', 'a mouse', 'a cat', 'smoke', 'a smell', 'a scent'], msg: 'The grain of rice is the picture. What is small, but fills every corner of the house without taking up any room?' }],
      glyph: '💡'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-mao-tangata', title: 'The Greatest Thing in the World', diff: 1,
    source: 'A well-known Māori *whakataukī* (proverb) of Aotearoa New Zealand: *He aha te mea nui o te ao? He tāngata, he tāngata, he tāngata.*',
    text: 'A Māori proverb takes the form of a riddle and its answer: *He aha te mea nui o te ao?* (“What is the greatest thing in the world?”)\n\nThe answer, in the proverb, is said three times to make it strong.\n\nWhat is it?',
    hints: ['It is not a mountain, a treasure or a place.', 'The word in Māori is *tāngata*, and there are about eight billion of them.'],
    explain: '**People**: *He tāngata, he tāngata, he tāngata*, “it is people, it is people, it is people”. The proverb is often quoted at gatherings and on marae (meeting places), and is a very short lesson in what matters. A South African proverb says nearly the same: see [[world-afr-ubuntu]].',
    data: {
      answer: { text: ['people', 'the people', 'tangata', 'tāngata', 'he tangata', 'humans', 'human beings', 'man', 'mankind', 'persons', 'a person', 'person', 'humanity'] },
      traps: [{ match: ['the earth', 'earth', 'the world', 'the sun', 'love', 'gold', 'the sea', 'nature', 'god'], msg: 'It is something you can say three times over, and it is a matter of who you are with.' }],
      glyph: '👥'
    },
    concepts: ['lateral'], links: ['world-afr-ubuntu', 'world-mao-korero']
  },
  {
    id: 'world-mao-korero', title: 'The Food of Chiefs', diff: 2,
    source: 'A well-known Māori *whakataukī* (proverb) of Aotearoa New Zealand: *He aha te kai a te rangatira? He kōrero, he kōrero, he kōrero.*',
    text: 'Another Māori proverb in the form of a riddle asks: *He aha te kai a te rangatira?* (“What is the food of a chief?”)\n\nThe answer is again given three times. It is not meat, and it is not a feast, but something a chief must always be ready to provide for others.\n\nWhat is the answer?',
    hints: ['A chief who cannot do this is not a chief at all.', 'It is made of words, and is exchanged at a meeting.'],
    explain: '**Talk** (*kōrero*): discussion, speeches, conversation. A Māori leader lives by speaking well and listening: the great meetings on a marae are forums of talk, and a chief who has no kōrero has nothing to give. Compare with [[world-mao-tangata]].',
    data: {
      answer: { text: ['talk', 'conversation', 'kōrero', 'korero', 'speech', 'speeches', 'he korero', 'discussion', 'words', 'talking', 'oratory', 'speaking', 'discourse', 'news'] },
      traps: [{ match: ['fish', 'kumara', 'kūmara', 'meat', 'pork', 'bread', 'a feast', 'a hangi', 'hangi', 'gold', 'power'], msg: 'A chief eats well, but the proverb has something else in mind, something he offers everyone.' }],
      glyph: '🗣'
    },
    concepts: ['lateral'], links: ['world-mao-tangata']
  },
  {
    id: 'world-mao-fish', title: 'The Fish of Māui', diff: 2,
    source: 'A story of Māui, the demigod hero of Māori and Polynesian tradition, told in many versions across Aotearoa New Zealand and the Pacific.',
    text: 'In Māori tradition the demigod Māui, sailing with his brothers, threw a hook, made in most tellings from the jawbone of an ancestor, into the deep sea. When he pulled it up, the sea gave up an enormous fish, and the land it became is what New Zealand is made of. The brothers, greedy, began to cut it up before the fish had settled, and that is why the North Island has its mountains and valleys.\n\nIn the story, what are the **North Island** and the **South Island**?',
    hints: ['One of them is the thing Māui pulled up. The other is what he used to sail.', 'The Māori names are *Te Ika-a-Māui* and *Te Waka-a-Māui*: “the fish of Māui” and “the canoe of Māui”.'],
    explain: 'The North Island is **the fish** (*Te Ika-a-Māui*) and the South Island is **the canoe** (*Te Waka-a-Māui*), with Stewart Island as the anchor (*Te Punga-a-Māui*). On a map of the North Island you can see the fish’s tail (Northland), its head at Wellington, and its fins.',
    data: {
      ask: 'What are the two islands?',
      answer: { choice: 0, choices: ['North Island is the fish; South Island is the canoe', 'North Island is the canoe; South Island is the fish', 'Both are fish', 'North Island is the hook; South Island is the net'] },
      traps: [{ match: 1, msg: 'The wrong way round: the fish is the island with the mountains and the hot springs, the one that was cut up.' }, { match: 2, msg: 'There is only one fish in the story. The other island is what Māui sailed in.' }],
      glyph: '🐟'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-mly-kancil', title: 'The Mouse-Deer and the Crocodiles', diff: 1,
    source: 'A tale of Sang Kancil, the mouse-deer, a trickster hero of the folk tales of Malaysia, Indonesia and Singapore.',
    text: 'Sang Kancil, the little mouse-deer, wants to reach a tree full of ripe fruit on the far side of a river, but the river is full of hungry crocodiles. He calls out to them: “Crocodiles, I bring you a message from the King! He is giving a great feast, and wants to know how many of you there are, so that he may plan the meal!”\n\nThe crocodiles, flattered, are eager to be counted. How does Kancil cross?',
    hints: ['He asks the crocodiles to do something so that he can count them.', 'A line of crocodiles makes a very good path.'],
    explain: 'He tells the crocodiles to **line up side by side across the river**, and hops from back to back, counting “One, two, three...” until he reaches the far bank. Then he calls out his thanks and runs off into the trees. He is a hero of the Malay world, always tricking bigger animals with quick wit.',
    data: {
      ask: 'How does he cross?',
      answer: { choice: 0, choices: ['He asks them to line up to be counted and hops across on their backs', 'He swims fast when they are not looking', 'He builds a raft of leaves', 'He waits until they fall asleep'] },
      traps: [{ match: 1, msg: 'A mouse-deer is a poor swimmer. Kancil succeeds by talking.' }, { match: 3, msg: 'Crocodiles sleep with one eye open. Kancil’s way needs no waiting.' }],
      glyph: '🦌'
    },
    concepts: ['lateral']
  },

  /* ---------- more: harder lantern riddles, stratagems and traps ---------- */
  {
    id: 'world-chn-ri', title: 'Round When Drawn, Square When Written', diff: 3,
    source: 'A traditional Chinese lantern riddle (*dengmi*) in verse, told again; the answer is a character.',
    text: 'A famous Chinese lantern riddle in four lines:\n\n*When drawn, it is round. When written, it is square. In winter it is short. In summer it is long.*\n\nThe answer is a character. Which one?',
    hints: ['A picture of it is round; its character is a small box with a stroke through the middle.', 'Days are short in winter and long in summer.'],
    explain: 'The character is **日** (*rì*), “sun” and “day”. Drawn as a picture it is a round disc, and that is exactly how the oldest form of the character looked; written now with a brush it is a square box with a bar across. Days are short in winter and long in summer. Every line of the riddle is true of the sun as well as of the character.',
    data: {
      ask: 'What is the answer?',
      answer: { text: ['sun', 'the sun', '日', 'ri', 'the character for sun', 'the sun character', 'day', 'the day', 'the character 日', 'the character for day', 'daylight'] },
      traps: [{ match: ['moon', 'the moon', '月', 'a circle', 'circle', 'a clock', 'a wheel', 'a coin'], msg: 'The moon is round too, but is it short in winter and long in summer, and is its character square?' }],
      glyph: '日'
    },
    concepts: ['riddle-craft'], links: ['world-chn-jing']
  },
  {
    id: 'world-chn-yi', title: 'With It, a Person Is Big', diff: 4,
    source: 'A traditional Chinese lantern riddle (*dengmi*), told again; the answer is a character.',
    text: 'A Chinese lantern riddle in two lines:\n\n*With it, a person becomes big. Without it, the sky is still big.*\n\nThe person is 人, “big” is 大, and the sky is 天. What is “it”?',
    hints: ['Add something to 人 and you get 大. Take something away from 天 and you also get 大.', 'It is the simplest character of all, a single stroke.'],
    explain: 'It is **一** (*yī*, “one”), a single horizontal stroke: 人 + 一 = 大, and 天 − 一 = 大. The character 天 is “one on top of big”, so taking away the top stroke leaves 大. The simplest character in the language is the answer to one of its finest riddles. (See [[world-chn-da]] and [[world-chn-tian]].)',
    data: {
      ask: 'What is “it”?',
      answer: { choice: 0, choices: ['一 (one), a single horizontal stroke', '十 (ten), a cross', '丨 (a single vertical stroke)', '二 (two), a pair of strokes'] },
      traps: [{ match: 1, msg: '人 with a cross on it is not 大. What single stroke, added to 人, makes 大?' }, { match: 2, msg: 'A vertical stroke is not what makes 人 into 大: the added stroke lies across it.' }, { match: 3, msg: '二 has two strokes; the riddle needs one.' }],
      glyph: '一'
    },
    concepts: ['homophones'], links: ['world-chn-da', 'world-chn-tian']
  },
  {
    id: 'world-chn-dong-zhuo', title: 'The Children’s Rhyme', diff: 4,
    source: 'The *Book of the Later Han* (*Hou Han shu*, fifth century), the biography of Dong Zhuo: a rhyme sung by children in the capital, read as a prophecy.',
    text: 'In the last years of the Han dynasty a brutal warlord held the emperor in his power. In the capital the children sang a rhyme that nobody had taught them:\n\n***Grass of a thousand miles: how green it is! Ten suns and a divination: no life for it!***\n\nSharp-eyed listeners heard a prophecy. A character hides in each line: *thousand* (千) and *mile* (里), stacked under *grass* (艹); and *ten* (十), *sun* (日) and *divination* (卜), stacked together.\n\nWhose name does the rhyme spell?',
    hints: ['Put 千 and 里 under the grass radical 艹 to make one character; then stack 十, 日 and 卜 to make another.', 'The warlord’s surname is the first character, and his personal name is the second.'],
    explain: '千 + 里 + 艹 = **董** (*Dǒng*), and 十 + 日 + 卜 = **卓** (*Zhuó*): **Dong Zhuo**. The rhyme said that he would not live, and in AD 192 he was killed in a plot led by his own adopted son, Lü Bu. Whether the rhyme was truly sung before or written afterwards, it is the classic example in China of a prophecy in the form of a character riddle.',
    data: {
      ask: 'Whose name?',
      answer: { choice: 0, choices: ['Dong Zhuo (董卓)', 'Cao Cao (曹操)', 'Liu Bei (刘备)', 'Sun Quan (孙权)'] },
      traps: [{ match: 1, msg: 'Cao Cao is in another riddle in this cabinet, but not in this rhyme: put the pieces together.' }, { match: 2, msg: 'The characters are made of grass, a thousand, a mile, ten, the sun and divination. They do not spell Liu Bei.' }, { match: 3, msg: 'Try assembling the two characters from the pieces given.' }],
      glyph: '董'
    },
    concepts: ['homophones'], links: ['world-chn-jue-full']
  },
  {
    id: 'world-chn-horse-race', title: 'Tian Ji’s Horses', diff: 3,
    source: 'Sima Qian, *Records of the Grand Historian* (*Shiji*, about 100 BC), the biography of Sun Bin and Tian Ji, told again.',
    text: 'In ancient China the nobleman Tian Ji used to race horses against the king of Qi: three races, with an upper, a middle and a lower horse on each side. Tian Ji’s horses were each a little slower than the king’s horse of the same class, and Tian Ji always lost all three. His friend, the strategist Sun Bin, noticed that each of Tian Ji’s horses was faster than the king’s horse of the class *below* it.\n\nHow should Tian Ji pair his horses against the king’s to win the contest?',
    hints: ['Tian Ji cannot win all three races; he needs to win two of them.', 'He must give up one race on purpose.'],
    explain: 'Race his **lower horse against the king’s upper horse** (a certain loss), his **upper horse against the king’s middle horse** (a win), and his **middle horse against the king’s lower horse** (a win). He loses one and wins two, and wins the contest. It is one of the oldest examples of game theory: sacrifice a battle to win the war. Sun Bin was later the great general of Qi.',
    data: {
      ask: 'How should he pair them?',
      answer: { choice: 0, choices: ['His lower against the king’s upper, his upper against the king’s middle, his middle against the king’s lower', 'Upper against upper, middle against middle, lower against lower', 'His upper against the king’s lower, his middle against the king’s middle, his lower against the king’s upper', 'Run all six horses in a single race'] },
      traps: [{ match: 1, msg: 'That is what he always did, and he lost every time.' }, { match: 2, msg: 'That wins one race (upper against lower), and loses two. Try again.' }, { match: 3, msg: 'The contest is three races, decided by who wins most. It would be a different game.' }],
      glyph: '🐎'
    },
    concepts: ['deduction']
  },
  {
    id: 'world-chn-arrows', title: 'A Hundred Thousand Arrows', diff: 3,
    source: 'Luo Guanzhong, *Romance of the Three Kingdoms* (Chinese novel of the fourteenth century), chapter 46: a tale of fiction, not history.',
    text: 'In the Chinese novel *Romance of the Three Kingdoms* the strategist Zhuge Liang is challenged by a jealous rival to make a hundred thousand arrows in ten days. Zhuge Liang, calmly, promises to have them in **three**, on pain of death. He does not summon a single smith.\n\nHow does he get the arrows?',
    hints: ['He does not make them. He borrows them.', 'A thick fog helps. So do boats and a great deal of straw.'],
    explain: 'On the third night, in dense river fog, he sails twenty boats, each manned by a few soldiers beating drums and shouting, and each with **straw dummies along its sides**, toward the enemy camp. The enemy, unable to see, shoots thousands of arrows at the noise, and they stick in the straw. At dawn the boats sail home with more than a hundred thousand arrows. Zhou Yu, the jealous rival, has to admit that he is beaten.',
    data: {
      ask: 'How does he do it?',
      answer: { choice: 1, choices: ['He asks the villagers to make them in three days', 'He sails boats covered with straw dummies into the enemy fog, and the enemy shoots them full of arrows', 'He buys them from the enemy', 'He has each soldier make ten arrows a day'] },
      traps: [{ match: 0, msg: 'Even a whole province of villagers could not do it in three days. Zhuge Liang has a stranger idea.' }, { match: 2, msg: 'The enemy would not sell. Zhuge Liang gets them for nothing, and from the enemy all the same.' }, { match: 3, msg: 'A hundred thousand arrows in three days would need a great deal of soldiers. Zhuge Liang does not make any.' }],
      glyph: '🏹'
    },
    concepts: ['lateral']
  },
  {
    id: 'world-heb-bel', title: 'The Idol and the Ashes', diff: 2,
    source: 'The story of Bel and the Dragon, in the Greek additions to the Book of Daniel (retold; it is not part of the Hebrew text).',
    text: 'In Babylon there is a great idol, Bel, to whom the people bring huge offerings of flour, sheep and wine every day. The king believes that the god really eats it all. Daniel says the idol is only clay inside and bronze outside, and has never eaten a thing. The seventy priests of Bel are angry, and a test is agreed: the food will be set out, the temple sealed with the king’s own ring, and in the morning the king will see whether it has been eaten.\n\nDaniel has a secret plan. After the priests have left the temple, he has his servants do one thing on the floor. What?',
    hints: ['Daniel wants to know who comes into the temple at night, without being able to watch.', 'He scatters something fine and soft that shows footprints.'],
    explain: 'He had his servants **scatter fine ashes** across the floor of the temple. In the morning the king saw the food was gone; but Daniel pointed to the floor, where the ashes showed the footprints of the priests, their wives and their children, who had come in at night through a secret door under the table and eaten the offerings. The king had the priests put to death. An evidence trick that is more than two thousand years old.',
    data: {
      ask: 'What does Daniel do?',
      answer: { choice: 0, choices: ['Scatters fine ashes over the temple floor', 'Hides in the temple all night', 'Puts a guard on every door', 'Paints the food with dye'] },
      traps: [{ match: 1, msg: 'The priests would see him, and the temple is sealed. He needs to *watch* without being there.' }, { match: 2, msg: 'The doors are sealed with the king’s ring: the priests come in by another way.' }, { match: 3, msg: 'The dye would show who had eaten, but not who had come in.' }],
      glyph: '👣'
    },
    concepts: ['deduction'], links: ['world-heb-susanna']
  },
  {
    id: 'world-afr-anansi-python', title: 'The Python and the Palm Branch', diff: 2,
    source: 'A tale of Anansi from the Ashanti (Akan) people of Ghana: how Anansi bought the sky-god’s stories, first by capturing Onini the python. Told in West Africa and across the Caribbean.',
    text: 'Anansi wants to buy all the stories in the world from the sky-god, Nyame. Nyame sets a price: Anansi must bring him Onini the python, the hornets, the leopard and the fairy Mmoatia. Anansi goes first to the python. He lays a long palm branch on the ground and says to Onini:\n\n“My wife says you are longer than this palm branch. I say you are shorter. Who is right?”\n\nWhat happens?',
    hints: ['Anansi has laid a long palm branch on the ground.', 'How would the python settle an argument about his length?'],
    explain: 'Onini **stretches himself along the palm branch** to prove Anansi wrong, and while he lies straight and still, Anansi ties him firmly to it, from head to tail, and carries him off to Nyame. The other three tasks are just as neat: he catches the hornets by pouring water in a gourd and calling “It is raining, come into my gourd!”, the leopard by a pit, and the fairy with a gum-covered doll. In the end Nyame gives him the stories, which are now called *Anansesem*, spider stories.',
    data: {
      ask: 'What does the python do?',
      answer: { choice: 0, choices: ['He lies along the branch to prove his length, and Anansi ties him to it', 'He coils up and goes to sleep', 'He swallows Anansi', 'He slithers away, laughing'] },
      traps: [{ match: 1, msg: 'Python is proud, and Anansi has offered him a challenge. What would a proud python do?' }, { match: 2, msg: 'Anansi is too clever for that, and it is the python who is fooled.' }, { match: 3, msg: 'No: he takes the bait. Think of what a proud snake does when told he is short.' }],
      glyph: '🐍'
    },
    concepts: ['lateral'], links: ['world-afr-anansi-pot']
  },

].map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));

})();
