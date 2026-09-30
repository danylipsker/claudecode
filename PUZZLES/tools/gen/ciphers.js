/* The Puzzle Cabinet · tools/gen/ciphers.js
 *
 *   node tools/gen/ciphers.js        writes data/ciphers.js
 *
 * Codes and ciphers: a hand-made list of messages (our own sentences,
 * traditional proverbs, riddles and a few famous historical words), each
 * checked by the engine's verify(). Book-code references are chosen with a
 * seeded random number generator, so the file is the same every time.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/wordlist.js'));
require(path.join(ROOT, 'js/lib/ciphers.js'));
require(path.join(ROOT, 'engines/codes.js'));
const S = C.Ciphers, E = C.engines.codes;

const R = (q) => '**Riddle:** ' + q + ' The answer is written in code below.';

// [id, title, diff, data, text, extra]
const LIST = [
  /* ---------------- 1: Easy ---------------- */
  ['veni-vidi-vici', 'Caesar\'s Three Words', 1, { code: 'caesar', msg: 'VENI, VIDI, VICI', key: 3 },
    'Julius Caesar, says the Roman biographer Suetonius, wrote his private letters with every letter moved three places along the alphabet: D for A, E for B, and so on. Here are three famous words of his, written his way.',
    { source: 'Suetonius, *Life of Julius Caesar*, chapter 56, describes the cipher.', explain: 'VENI, VIDI, VICI — “I came, I saw, I conquered”, Caesar\'s report of a campaign he won in five days in 47 BC. To read it, move every letter three places back: Y → V, H → E, Q → N, L → I.', concepts: ['modular'], tags: ['caesar', 'latin', 'history'] }],
  ['meet-mill', 'Five Places On', 1, { code: 'caesar', msg: 'MEET AT THE MILL', key: 5 },
    'A note slipped under a door. Every letter has been moved **five** places along the alphabet: F for A, G for B… Turn the wheel so that the code letter F sits under plain A, and read.',
    { concepts: ['modular'], tags: ['caesar'] }],
  ['alea-iacta-est', 'The Die Is Cast', 1, { code: 'caesar', msg: 'ALEA IACTA EST', key: 3 },
    'Another saying of Caesar\'s, in his own cipher: every letter three places on.',
    { source: 'Suetonius, *Life of Julius Caesar*, chapter 32, reports the words.', explain: 'ALEA IACTA EST — “the die is cast”. Suetonius says Caesar spoke the words as he led his army across the river Rubicon in 49 BC, starting a civil war.', concepts: ['modular'], tags: ['caesar', 'latin', 'history'] }],
  ['festina-lente', 'Augustus Moves One', 1, { code: 'caesar', msg: 'FESTINA LENTE', key: 1 },
    'Caesar\'s heir Augustus, Suetonius tells us, used a simpler shift still: every letter moved just one place, B for A. Here is a motto he was fond of.',
    { source: 'Suetonius, *Life of Augustus*, chapters 25 and 88.', explain: 'FESTINA LENTE — “make haste slowly”, the Latin form of a Greek saying that Suetonius says Augustus liked to repeat. A shift of one is about as thin a disguise as a cipher can wear.', concepts: ['modular'], tags: ['caesar', 'latin', 'history'] }],
  ['wizard', 'A Word That Looks Back', 1, { code: 'atbash', msg: 'WIZARD' },
    'In Atbash the alphabet is turned back to front: A is written as Z, B as Y, C as X, and so on. One English word does something curious when it is written this way. Decode it and look again at the code.',
    { explain: 'WIZARD becomes DRAZIW — the same word backwards (W ↔ D, I ↔ R, Z ↔ A). And because Atbash swaps letters in pairs, coding the code gives the message back.', tags: ['atbash', 'wordplay'] }],
  ['babylon', 'Sheshach', 1, { code: 'atbash', msg: 'BABYLON' },
    'Atbash began in Hebrew, and the Book of Jeremiah once writes the name of a great city in it, as *Sheshach*. Here is that city\'s English name, in English Atbash.',
    { source: 'Jeremiah 25:26 and 51:41.', explain: 'BABYLON. The name Atbash says how it works: the first Hebrew letter (aleph) swaps with the last (tav), the second (bet) with the second-to-last (shin). Babel\'s letters B-B-L become Sh-Sh-K: Sheshach.', tags: ['atbash', 'history'] }],
  ['sos', 'Three Short, Three Long', 1, { code: 'morse', msg: 'SOS' },
    'The best-known signal ever sent in Morse code. Press **Play** to hear it — or just read the dots and dashes.',
    { explain: 'SOS: · · ·  – – –  · · ·. It was chosen as the distress call because it is easy to send and impossible to mistake, not because the letters stand for anything; “Save Our Souls” was fitted to it afterwards.', tags: ['morse', 'history'] }],
  ['hello-operator', 'Hello, Operator', 1, { code: 'morse', msg: 'HELLO' },
    'A friendly word on the wire. Follow each letter down the Morse tree: left for a dot, right for a dash.',
    { tags: ['morse'] }],
  ['piano', 'Keys but No Locks', 1, { code: 'morse', msg: 'A PIANO' },
    R('What has keys but cannot open a single lock?'), { tags: ['morse', 'riddle'] }],
  ['open-sesame', 'The Magic Words', 1, { code: 'pigpen', msg: 'OPEN SESAME', card: true },
    'Pigpen marks scratched on a cave wall. Each letter is drawn as the lines around its pen on the key card; a dot means the second grid.',
    { explain: 'OPEN SESAME — the words that open the robbers\' cave in the tale of Ali Baba, from the *Thousand and One Nights*.', tags: ['pigpen'] }],
  ['send-help', 'Torches at the Gate', 1, { code: 'polybius', msg: 'SEND HELP' },
    'The Greek historian Polybius described a way to signal letters from afar: set the alphabet out in a square, then send each letter as its row and its column. A watchman\'s message:',
    { source: 'Polybius, *Histories*, book 10.', tags: ['polybius', 'history'] }],
  ['hello-friend', 'Raised Dots', 1, { code: 'braille', msg: 'HELLO FRIEND' },
    'A greeting in Braille. Each cell has six places, and the dots raised in them make a letter.',
    { tags: ['braille'] }],
  ['comb', 'Teeth That Never Bite', 1, { code: 'braille', msg: 'A COMB' },
    R('What has plenty of teeth but never bites?'), { tags: ['braille', 'riddle'] }],
  ['ahoy', 'Flags Up', 1, { code: 'semaphore', msg: 'AHOY' },
    'A sailor on the quay holds a flag in each hand. The angle of the two flags spells one letter.',
    { tags: ['semaphore'] }],
  ['ham-and-eggs', 'Breakfast with Bacon', 1, { code: 'bacon', msg: 'HAM AND EGGS', ab: 'ab' },
    'Francis Bacon invented a cipher with only two letters, *a* and *b*. Every letter of the message is a group of five of them. What is on the menu?',
    { explain: 'HAM AND EGGS — with Bacon, naturally. His alphabet is the numbers 0 to 23 written in binary, with *a* for 0 and *b* for 1: A = aaaaa, B = aaaab, C = aaaba…', concepts: ['binary'], tags: ['bacon'] }],
  ['flee', 'Two Rails', 1, { code: 'railfence', msg: 'FLEE AT ONCE', key: 2 },
    'The message was written in a zigzag on **two** rails — first letter on the top rail, second on the bottom, third on top… — and then the top rail was read off, followed by the bottom one. Lay the letters back on the rails.',
    { tags: ['rail fence'] }],
  ['kings-men', 'All the King\'s Men', 1, { code: 'book', msg: 'THE MEN HAD A GREAT FALL', book: 'humpty', how: 'n', mode: 'word' },
    'Each number is a word of the rhyme on the card, counting from its first word. Write the words in order.',
    { tags: ['book code', 'nursery rhyme'] }],

  /* ---------------- 2: Fair ---------------- */
  ['rot13', 'Halfway Round', 2, { code: 'caesar', msg: 'TO GET TO THE OTHER SIDE', key: 13 },
    '**Riddle:** Why did the chicken cross the road? The answer is in ROT13, a Caesar shift of **13** — exactly half the alphabet, so the same turn of the wheel both hides it and shows it.',
    { explain: 'TO GET TO THE OTHER SIDE. ROT13 was long used on the internet to hide the punchlines of jokes and the endings of stories: nobody is fooled, but nobody reads it by accident either.', concepts: ['modular'], tags: ['caesar', 'riddle'] }],
  ['egg', 'Broken Before Use', 2, { code: 'caesar', msg: 'AN EGG', key: 9, show: false },
    R('What has to be broken before you can use it?') + ' It is a Caesar shift, but by how much you must find out.',
    { concepts: ['modular', 'deduction'], tags: ['caesar', 'riddle'] }],
  ['bottle', 'A Neck but No Head', 2, { code: 'atbash', msg: 'A BOTTLE' },
    R('What has a neck but no head?'), { tags: ['atbash', 'riddle'] }],
  ['leap', 'Before You Jump', 2, { code: 'atbash', msg: 'LOOK BEFORE YOU LEAP' },
    'A proverb, turned back to front letter by letter.', { tags: ['atbash', 'proverb'] }],
  ['cold', 'Catch but Never Throw', 2, { code: 'polybius', msg: 'A COLD' },
    R('What can you catch but never throw?'), { tags: ['polybius', 'riddle'] }],
  ['time-tide', 'Time and Tide', 2, { code: 'polybius', msg: 'TIME AND TIDE WAIT FOR NO MAN' },
    'A proverb in Polybius numbers. The first digit of each pair is the row, the second the column.', { tags: ['polybius', 'proverb'] }],
  ['needle', 'An Eye That Cannot See', 2, { code: 'pigpen', msg: 'A NEEDLE', card: true },
    R('What has an eye but cannot see?'), { tags: ['pigpen', 'riddle'] }],
  ['stitch', 'A Stitch in Time', 2, { code: 'pigpen', msg: 'A STITCH IN TIME SAVES NINE', card: true },
    'A proverb in pigpen, as a Victorian child might have written it in a secret notebook.', { tags: ['pigpen', 'proverb'] }],
  ['wrought', 'Washington to Baltimore', 2, { code: 'morse', msg: 'WHAT HATH GOD WROUGHT' },
    'On 24 May 1844 Samuel Morse sent a message by electric telegraph from the Capitol in Washington to Baltimore, about forty miles away. Here are his words, in the international Morse code used today.',
    { year: 1844, explain: 'WHAT HATH GOD WROUGHT — a line from the Bible (Numbers 23:23). Morse\'s own line used an earlier, American version of the code; the international code shown here was settled later.', tags: ['morse', 'history'] }],
  ['towel', 'Wetter as It Dries', 2, { code: 'morse', msg: 'A TOWEL' },
    R('What gets wetter the more it dries?'), { tags: ['morse', 'riddle'] }],
  ['lighthouse', 'A Light in the Window', 2, { code: 'morse', msg: 'MEET ME AT THE LIGHTHOUSE' },
    'Someone is flashing a lamp from the window across the bay. You wrote down the flashes as dots and dashes.', { tags: ['morse'] }],
  ['overboard', 'A Cry from the Deck', 2, { code: 'semaphore', msg: 'MAN OVERBOARD' },
    'The signaller on the next ship is waving urgently.', { tags: ['semaphore'] }],
  ['coin', 'Heads and Tails', 2, { code: 'semaphore', msg: 'A COIN' },
    R('What has a head and a tail but no body?'), { tags: ['semaphore', 'riddle'] }],
  ['all-hands', 'Everyone Up', 2, { code: 'semaphore', msg: 'ALL HANDS ON DECK' },
    'An order from the flagship.', { tags: ['semaphore'] }],
  ['louis-braille', 'The Inventor\'s Name', 2, { code: 'braille', msg: 'LOUIS BRAILLE' },
    'Whose name is written here, in the alphabet he made?',
    { explain: 'LOUIS BRAILLE lost his sight in an accident as a small child. As a pupil at the school for blind children in Paris he turned a system of raised dots meant for reading in the dark into the alphabet that carries his name, and published it in 1829.', tags: ['braille', 'history'] }],
  ['knowledge', 'Bacon\'s Maxim', 2, { code: 'bacon', msg: 'KNOWLEDGE IS POWER', ab: 'ab' },
    'Three words usually credited to Francis Bacon himself, in his own two-letter cipher.',
    { explain: 'KNOWLEDGE IS POWER. Bacon wrote the thought in Latin in 1597; the English form became a proverb. Note that his alphabet has 24 letters: I and J share a group, and so do U and V.', concepts: ['binary'], tags: ['bacon'] }],
  ['stamp', 'Round the World in a Corner', 2, { code: 'bacon', msg: 'A STAMP', ab: 'ab' },
    R('What can go round the world while staying in a corner?'), { concepts: ['binary'], tags: ['bacon', 'riddle'] }],
  ['discovered', 'The Textbook Fence', 2, { code: 'railfence', msg: 'WE ARE DISCOVERED FLEE AT ONCE', key: 3 },
    'The message every book on codes uses to show the rail fence, on **three** rails.',
    { source: 'The usual textbook example of the rail fence cipher.', tags: ['rail fence'] }],
  ['your-age', 'Up but Never Down', 2, { code: 'railfence', msg: 'YOUR AGE', key: 2 },
    R('What goes up and never comes down?') + ' It is on two rails.', { tags: ['rail fence', 'riddle'] }],
  ['spears', 'More Spears', 2, { code: 'scytale', msg: 'SEND MORE SPEARS', key: 3 },
    'A strip of leather covered in letters arrives from the front. Wind it round a rod **three** letters thick and read along the rod.', { tags: ['scytale'] }],
  ['lemon', 'The Lemon Key', 2, { code: 'vigenere', msg: 'ATTACK AT DAWN', key: 'LEMON' },
    'The standard textbook example of the Vigenère cipher, with the keyword **LEMON**. The keyword is written over the code letters for you.',
    { source: 'The usual textbook example of the Vigenère cipher.', concepts: ['modular'], tags: ['vigenere'] }],
  ['good-morning', 'Sunny Side Up', 2, { code: 'vigenere', msg: 'GOOD MORNING', key: 'SUN' },
    'A cheerful greeting under the keyword **SUN**. Each keyword letter is a Caesar shift of its own: S shifts by 18, U by 20, N by 13.',
    { concepts: ['modular'], tags: ['vigenere'] }],
  ['mary-sure', 'Mary Was Sure', 2, { code: 'book', msg: 'MARY WAS SURE', book: 'lamb', how: 'n', mode: 'word' },
    'Each number is a word of the rhyme on the card, counted from the first word.', { tags: ['book code', 'nursery rhyme'] }],
  ['down-hill', 'Down the Hill', 2, { code: 'book', msg: 'JACK WENT DOWN THE HILL', book: 'jack', how: 'lw', mode: 'word' },
    'Each reference is line.word: 2.3 means the third word of the second line.', { tags: ['book code', 'nursery rhyme'] }],
  ['waters', 'The Face of the Waters', 2, { code: 'book', msg: 'GOD MOVED THE WATERS', book: 'genesis', how: 'lw', mode: 'word' },
    'A message from the opening of Genesis, by line and word.', { tags: ['book code'] }],

  /* ---------------- 3: Tricky ---------------- */
  ['fortune', 'Turn the Wheel', 3, { code: 'caesar', msg: 'FORTUNE FAVOURS THE BOLD', key: 11, show: false },
    'A Caesar shift, but nobody has told you how far. Turn the wheel until the short words make sense.',
    { concepts: ['modular', 'deduction'], tags: ['caesar', 'proverb'] }],
  ['early-bird', 'Before Breakfast', 3, { code: 'caesar', msg: 'THE EARLY BIRD CATCHES THE WORM', key: 19, show: false },
    'A proverb in an unknown Caesar shift. Three-letter words are a good place to start: THE is the commonest word in English.',
    { concepts: ['modular', 'deduction'], tags: ['caesar', 'proverb'] }],
  ['many-hands', 'Many Hands', 3, { code: 'atbash', msg: 'MANY HANDS MAKE LIGHT WORK' },
    'A longer proverb in Atbash.', { tags: ['atbash', 'proverb'] }],
  ['will-way', 'A Will and a Way', 3, { code: 'atbash', msg: 'WHERE THERE IS A WILL THERE IS A WAY' },
    'A proverb in Atbash. Some words appear twice — so do their codes.', { tags: ['atbash', 'proverb'] }],
  ['fire-signals', 'Fire Signals', 3, { code: 'polybius', msg: 'THE ENEMY IS NEAR', torch: true },
    'On the wall of a watchtower, torches are raised two groups at a time: the left group gives the row of the square, the right group the column.',
    { explain: 'THE ENEMY IS NEAR. Polybius, writing in the second century BC, suggested signalling letters by raising torches behind two screens — so many on the left, so many on the right.', tags: ['polybius', 'history'] }],
  ['zebra', 'The Zebra Square', 3, { code: 'polybius', msg: 'MEET AT THE OLD MILL', key: 'ZEBRA' },
    'This Polybius square was filled starting with the keyword **ZEBRA**, then the rest of the alphabet in order, so the numbers mean something different from the usual square.',
    { tags: ['polybius'] }],
  ['x-marks', 'Where X Marks', 3, { code: 'pigpen', msg: 'X MARKS THE SPOT' },
    'Pigpen on the back of an old map. The key card is face down; can you work out the grids yourself? (A hint turns the card over.)',
    { tags: ['pigpen'] }],
  ['dead-men', 'A Pirate\'s Warning', 3, { code: 'pigpen', msg: 'DEAD MEN TELL NO TALES' },
    'Carved into the lid of a sea chest, in pigpen. The key card is face down.',
    { tags: ['pigpen', 'proverb'] }],
  ['glitters', 'Not All Gold', 3, { code: 'pigpen', msg: 'ALL THAT GLITTERS IS NOT GOLD' },
    'A warning found in a jeweller\'s box. The key card is face down.', { tags: ['pigpen', 'proverb'] }],
  ['owl', 'Night Signal', 3, { code: 'morse', msg: 'THE OWL FLIES AT MIDNIGHT' },
    'A lamp blinks from the church tower. Play it — can you read it by ear before you look?', { tags: ['morse'] }],
  ['steady', 'The Tortoise Wins', 3, { code: 'morse', msg: 'SLOW AND STEADY WINS THE RACE' },
    'The moral of a race between two animals, tapped out on the telegraph.', { tags: ['morse', 'proverb'] }],
  ['red-sky', 'Weather Lore', 3, { code: 'semaphore', msg: 'RED SKY AT NIGHT SAILORS DELIGHT' },
    'An old rhyme about the weather, signalled from ship to ship at sunset.',
    { explain: 'RED SKY AT NIGHT, SAILOR\'S DELIGHT — the traditional rhyme goes on: red sky in the morning, sailor\'s warning.', tags: ['semaphore', 'proverb'] }],
  ['england-expects', 'Before Trafalgar', 3, { code: 'semaphore', msg: 'ENGLAND EXPECTS' },
    'The first two words of the most famous signal in British naval history.',
    { explain: 'ENGLAND EXPECTS — the start of the signal Nelson\'s flagship hoisted before the Battle of Trafalgar in 1805. It was not sent with hand flags like these but with numbered flags from Home Popham\'s signal code, one hoist for each word.', links: ['cipher-duty'], tags: ['semaphore', 'history'] }],
  ['cooks', 'Too Many Cooks', 3, { code: 'railfence', msg: 'TOO MANY COOKS SPOIL THE BROTH', key: 3 },
    'A proverb on **three** rails.', { tags: ['rail fence', 'proverb'] }],
  ['bridge-dawn', 'How Many Rails?', 3, { code: 'railfence', msg: 'THE BRIDGE IS SAFE AT DAWN', key: 4, show: false },
    'A rail fence — but how many rails? Try each number until the zigzag reads as words.',
    { concepts: ['deduction'], tags: ['rail fence'] }],
  ['rome-built', 'Rome Was Not Built', 3, { code: 'scytale', msg: 'ROME WAS NOT BUILT IN A DAY', key: 4 },
    'Wind the strip round a rod **four** letters thick. The row facing you is the start of the message; turn the rod for the next row.', { tags: ['scytale', 'proverb'] }],
  ['footsteps', 'The More You Take', 3, { code: 'scytale', msg: 'FOOTSTEPS', key: 5 },
    R('The more of them you take, the more you leave behind. What are they?') + ' The rod is **five** letters thick; the strip ends with a filler letter X.',
    { tags: ['scytale', 'riddle'] }],
  ['lysander', 'Lysander Is Recalled', 3, { code: 'scytale', msg: 'RETURN HOME AT ONCE', key: 4 },
    'Plutarch tells how the Spartan leaders once called their general Lysander home with a scytale: a strip wound round a staff and written on, which only a staff of the same thickness could read. Here is an order of that kind, on a staff **four** letters round.',
    { source: 'Plutarch, *Life of Lysander*, chapter 19, describes the scytale.', tags: ['scytale', 'history'] }],
  ['good-news', 'No News', 3, { code: 'scytale', msg: 'NO NEWS IS GOOD NEWS', key: 3 },
    'A cheerful proverb on a rod **three** letters thick. The last row ends with filler X\'s.', { tags: ['scytale', 'proverb'] }],
  ['rose', 'A Rose by Any Other Name', 3, { code: 'vigenere', msg: 'A ROSE BY ANY OTHER NAME', key: 'ROSE' },
    'Shakespeare\'s thought, under the keyword **ROSE**.',
    { explain: 'A ROSE BY ANY OTHER NAME — Juliet\'s point in *Romeo and Juliet* (about 1595): a name does not change what a thing is. The four letters of ROSE give four different shifts, used in turn.', concepts: ['modular'], tags: ['vigenere'] }],
  ['curiosity', 'Curiosity', 3, { code: 'vigenere', msg: 'CURIOSITY KILLED THE CAT', key: 'CAT' },
    'A proverb with the keyword **CAT**. The letter A in the keyword is a shift of nothing at all — a gift.',
    { concepts: ['modular'], tags: ['vigenere', 'proverb'] }],
  ['over-moon', 'Over the Moon', 3, { code: 'book', msg: 'THE DOG RAN AWAY WITH THE MOON', book: 'diddle', how: 'lw', mode: 'word' },
    'A new version of an old rhyme, by line.word.', { tags: ['book code', 'nursery rhyme'] }],
  ['wait-night', 'By Starlight', 3, { code: 'book', msg: 'WAIT UNTIL NIGHT', book: 'star', how: 'n', mode: 'letter' },
    'Each number is a word of the poem on the card, counted from the start. Take its **first letter**.', { tags: ['book code'] }],
  ['send-boats', 'Four Score', 3, { code: 'book', msg: 'SEND TEN BOATS', book: 'gettysburg', how: 'n', mode: 'letter' },
    'Each number is a word of the opening of the Gettysburg Address; take its first letter.', { tags: ['book code', 'history'] }],
  ['no-one-safe', 'To Be or Not', 3, { code: 'book', msg: 'NO ONE IS SAFE', book: 'hamlet', how: 'lw', mode: 'letter' },
    'References are line.word in Hamlet\'s speech; take the first letter of each word.', { tags: ['book code'] }],
  ['honesty', 'The Best Policy', 3, { code: 'braille', msg: 'HONESTY IS THE BEST POLICY' },
    'A proverb in Braille.', { tags: ['braille', 'proverb'] }],
  ['easy-does-it', 'Only Ten on the Chart', 3, { code: 'braille', msg: 'EASY DOES IT', chart: 'decade' },
    'This time the chart shows only the first ten letters, a to j. The rest follow a rule: k to t add a dot at the bottom left, and u, v, x, y, z add both bottom dots.', { tags: ['braille'] }],
  ['beads', 'Black and White Beads', 3, { code: 'bacon', msg: 'TRUTH WILL OUT', ab: 'dots' },
    'Bacon\'s *a* and *b* can be anything that comes in two kinds. On this string of beads, hollow beads are *a* and solid ones *b*.',
    { concepts: ['binary'], tags: ['bacon', 'proverb'] }],
  ['aunt-mabel', 'Dear Aunt Mabel', 3, { code: 'bacon', msg: 'MEET AT NOON', cover: S.COVERS[0] },
    'A harmless letter about the weather — but it was printed in two typefaces. Plain letters are *a*, the **bold slanted** ones *b*. Read the letters in fives.',
    { explain: 'MEET AT NOON. Bacon pointed out that his cipher can hide in any text at all, printed in two slightly different founts — the message is in the typefaces, not the words.', concepts: ['binary'], tags: ['bacon', 'steganography'] }],
  ['orders-afloat', 'Hear It First', 3, { code: 'morse', msg: 'THE SHIP SAILS AT TEN' },
    'A short telegram. Try to read it by ear: play it slowly, then faster.', { tags: ['morse'] }],

  /* ---------------- 4: Hard ---------------- */
  ['journey', 'A Thousand Miles', 4, { code: 'caesar', msg: 'A JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP', key: 7, show: false },
    'An old saying in an unknown Caesar shift. There is a one-letter word to get you started.',
    { concepts: ['modular', 'deduction'], tags: ['caesar', 'proverb'] }],
  ['romans', 'When in Rome', 4, { code: 'caesar', msg: 'WHEN IN ROME DO AS THE ROMANS DO', key: 22, show: false },
    'A proverb about Rome, in the cipher of Rome — with the shift hidden.',
    { concepts: ['modular', 'deduction'], tags: ['caesar', 'proverb'] }],
  ['actions', 'A Long Night of Torches', 4, { code: 'polybius', msg: 'ACTIONS SPEAK LOUDER THAN WORDS', torch: true },
    'The watchtower signals all night: torches on the left for the row, on the right for the column.', { tags: ['polybius', 'proverb'] }],
  ['treasure', 'Ten Paces North', 4, { code: 'pigpen', msg: 'TREASURE LIES TEN PACES NORTH OF THE WELL' },
    'Directions inked on the back of a playing card, in pigpen. The key card is face down.', { tags: ['pigpen'] }],
  ['bird-hand', 'Worth Two in the Bush', 4, { code: 'morse', msg: 'A BIRD IN THE HAND IS WORTH TWO IN THE BUSH' },
    'A long proverb in Morse. Try it at medium speed by ear.', { tags: ['morse', 'proverb'] }],
  ['duty', 'The Whole Signal', 4, { code: 'semaphore', msg: 'ENGLAND EXPECTS THAT EVERY MAN WILL DO HIS DUTY' },
    'Nelson\'s whole signal of 1805, as a semaphore signaller would send it today.',
    { explain: 'ENGLAND EXPECTS THAT EVERY MAN WILL DO HIS DUTY. At Trafalgar it went up as numbered flags from Popham\'s code; the word “duty” was not in the code book and had to be spelled out letter by letter.', links: ['cipher-england-expects'], tags: ['semaphore', 'history'] }],
  ['feather', 'Birds of a Feather', 4, { code: 'railfence', msg: 'BIRDS OF A FEATHER FLOCK TOGETHER', key: 4, show: false },
    'A rail fence with the number of rails hidden.', { concepts: ['deduction'], tags: ['rail fence', 'proverb'] }],
  ['pudding', 'The Proof of the Pudding', 4, { code: 'railfence', msg: 'THE PROOF OF THE PUDDING IS IN THE EATING', key: 3, show: false },
    'A long proverb on an unknown number of rails.', { concepts: ['deduction'], tags: ['rail fence', 'proverb'] }],
  ['hold-pass', 'Hold the Pass', 4, { code: 'scytale', msg: 'HOLD THE PASS AT ALL COSTS', key: 4, show: false },
    'A Spartan strip — but how thick was the rod? Try each thickness until a row reads as words.', { concepts: ['deduction'], tags: ['scytale'] }],
  ['ship-midnight', 'Sailing at Midnight', 4, { code: 'scytale', msg: 'THE SHIP SAILS AT MIDNIGHT', key: 5, show: false },
    'A strip wound round a rod of unknown thickness.', { concepts: ['deduction'], tags: ['scytale'] }],
  ['clock-key', 'Hands but No Clapping', 4, { code: 'vigenere', msg: 'TIME FLIES WHEN YOU ARE HAVING FUN', key: 'CLOCK', riddle: 'What has hands but can never clap?' },
    'A Vigenère cipher whose keyword is the answer to a riddle: *What has hands but can never clap?* Type the keyword in the panel to write it over the letters.',
    { concepts: ['modular'], tags: ['vigenere', 'riddle'] }],
  ['unbreakable', 'Le Chiffre Indéchiffrable', 4, { code: 'vigenere', msg: 'THE UNBREAKABLE CIPHER', key: 'VIGENERE' },
    'The keyword is **VIGENERE**, eight letters long.',
    { explain: 'For three centuries the Vigenère cipher was called *le chiffre indéchiffrable*, the unbreakable cipher. Charles Babbage broke it in the 1850s but kept quiet; Friedrich Kasiski published a general method in 1863. The trick: repeated words, coded at the same point of the keyword, give repeated code, and the gaps between repeats betray the keyword\'s length.', concepts: ['modular'], tags: ['vigenere', 'history'] }],
  ['sponge-key', 'Full of Holes', 4, { code: 'vigenere', msg: 'WASTE NOT WANT NOT', key: 'SPONGE', riddle: 'I am full of holes, yet I hold water. What am I?' },
    'The keyword is the answer to a riddle: *I am full of holes, yet I hold water. What am I?*', { concepts: ['modular'], tags: ['vigenere', 'riddle'] }],
  ['may', 'The Darling Buds', 4, { code: 'book', msg: 'MEET ME IN MAY', book: 'sonnet', how: 'lwl', mode: 'letter' },
    'Each reference is line.word.letter in Shakespeare\'s sonnet: 3.8.2 is the second letter of the eighth word of line 3.', { tags: ['book code'] }],
  ['golden-flowers', 'Lonely as a Cloud', 4, { code: 'book', msg: 'GOLDEN FLOWERS', book: 'daffodils', how: 'lwl', mode: 'letter' },
    'Line.word.letter references in Wordsworth\'s poem.', { tags: ['book code'] }],
  ['green-pastures', 'Green Pastures', 4, { code: 'book', msg: 'BRING HIM', book: 'psalm', how: 'lw', mode: 'letter' },
    'Line.word references in the psalm; take the first letter of each word.', { tags: ['book code'] }],
  ['quick-fox', 'Every Letter', 4, { code: 'braille', msg: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG', chart: 'decade' },
    'A famous sentence in Braille — with only the first ten letters on the chart. You will need the rule for all the rest.',
    { explain: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG uses every letter of the alphabet, which is why typists and type-founders have long used it to try out their machines and letters.', tags: ['braille'] }],
  ['butler', 'A Letter from the Manor', 4, { code: 'bacon', msg: 'THE BUTLER DID IT', cover: S.COVERS[1] + ' ' + S.COVERS[2] },
    'A dull letter from a country house — printed in two typefaces. Hover a box to see which five letters of the text it stands for.',
    { concepts: ['binary'], tags: ['bacon', 'steganography'] }],
  ['all-well', 'Italic or Not', 4, { code: 'bacon', msg: 'ALL IS WELL', cover: S.COVERS[3], subtle: true },
    'Only the slant of the letters differs this time: upright letters are *a*, italic ones *b*.', { concepts: ['binary'], tags: ['bacon', 'steganography'] }],

  /* ---------------- 5: Fiendish ---------------- */
  ['pen-sword', 'Mightier Than the Sword', 5, { code: 'railfence', msg: 'THE PEN IS MIGHTIER THAN THE SWORD', key: 5, show: false },
    'A line from a play of 1839 on an unknown number of rails.',
    { explain: 'THE PEN IS MIGHTIER THAN THE SWORD, from Edward Bulwer-Lytton\'s play *Richelieu* (1839). Five rails.', concepts: ['deduction'], tags: ['rail fence'] }],
  ['invention', 'The Mother of Invention', 5, { code: 'railfence', msg: 'NECESSITY IS THE MOTHER OF INVENTION', key: 4, show: false },
    'A proverb on a hidden number of rails.', { concepts: ['deduction'], tags: ['rail fence', 'proverb'] }],
  ['silver-lining', 'Every Cloud', 5, { code: 'scytale', msg: 'EVERY CLOUD HAS A SILVER LINING', key: 6, show: false },
    'A long strip for a thick rod — how thick, you must discover.', { concepts: ['deduction'], tags: ['scytale', 'proverb'] }],
  ['beholder', 'In the Eye', 5, { code: 'scytale', msg: 'BEAUTY IS IN THE EYE OF THE BEHOLDER', key: 5, show: false },
    'A proverb wound round a rod of unknown thickness.', { concepts: ['deduction'], tags: ['scytale', 'proverb'] }],
  ['kasiski', 'Kasiski\'s Revenge', 5, { code: 'vigenere', msg: 'EVERY CIPHER HAS A WEAKNESS', key: 'KASISKI' },
    'A moral for all code-makers, under the keyword **KASISKI** — the name of the man who showed how to break this cipher.', { concepts: ['modular'], tags: ['vigenere'] }],
  ['bottle-key', 'A Neck and a Keyword', 5, { code: 'vigenere', msg: 'ABSENCE MAKES THE HEART GROW FONDER', key: 'BOTTLE', riddle: 'What has a neck but no head?' },
    'The keyword is the one-word answer to a riddle: *What has a neck but no head?*', { concepts: ['modular'], tags: ['vigenere', 'riddle'] }],
  ['borogoves', 'Beware the Borogoves', 5, { code: 'book', msg: 'BEWARE THE BOROGOVES', book: 'jabber', how: 'lwl', mode: 'letter' },
    'Line.word.letter references in the nonsense of *Jabberwocky*.', { tags: ['book code'] }],
  ['ides', 'A Warning in Italics', 5, { code: 'bacon', msg: 'BEWARE THE IDES OF MARCH', cover: S.COVERS[4] + ' ' + S.COVERS[5] + ' ' + S.COVERS[6], subtle: true },
    'A long, innocent letter. Only the slant of the letters carries the message.',
    { explain: 'BEWARE THE IDES OF MARCH — the soothsayer\'s warning to Caesar in Shakespeare\'s *Julius Caesar* (1599). The Ides of March is 15 March, the day Caesar was killed in 44 BC.', concepts: ['binary'], tags: ['bacon', 'steganography'] }],
  ['necessity-caesar', 'Plain Sailing?', 5, { code: 'caesar', msg: 'STILL WATERS RUN DEEP', key: 16, show: false },
    'A short proverb in a hidden Caesar shift, with no one-letter words to help.', { concepts: ['modular', 'deduction'], tags: ['caesar', 'proverb'] }]
];

/* ---------- build ---------- */

const puzzles = [];
const seen = new Set();
const rng = C.rng(20260930);
LIST.forEach(([slug, title, diff, data, text, extra]) => {
  const id = 'cipher-' + slug;
  if (seen.has(id)) throw new Error('duplicate id ' + id);
  seen.add(id);
  const d = Object.assign({}, data);
  if (d.code === 'book') {
    d.refs = S.bookEncode(d.book, d.msg, d.how, d.mode, rng);
    if (!d.refs) throw new Error(id + ': the book cannot spell the message');
  }
  const p = Object.assign({ id, title, diff, text }, extra || {}, { data: d });
  const r = E.verify(p);
  if (!r.ok) throw new Error(id + ': ' + r.err);
  puzzles.push(p);
});
// easiest first; within a level keep the order written
puzzles.sort((a, b) => a.diff - b.diff);

const q = (v) => JSON.stringify(v);
let out = '/* The Puzzle Cabinet · data/ciphers.js — made by tools/gen/ciphers.js */\n';
out += `Cabinet.concepts([
  { id: 'cryptography', name: 'Codes and ciphers', see: ['modular', 'binary'],
    text: 'A **code** replaces words or letters by symbols anyone may know (Morse, Braille, semaphore); a **cipher** hides a message with a secret **key**. *Substitution* ciphers swap each letter for another (Caesar, Atbash, pigpen); *transposition* ciphers keep the letters but scramble their order (the rail fence, the scytale). Most old ciphers fall to patient counting: the commonest letter in English is E, the commonest word THE — which is why Vigenère\\'s cipher, which gives the same letter many different disguises, held out for three hundred years.' }
]);
Cabinet.history([
  { year: 1553, title: 'Bellaso\\'s keyword cipher', text: 'Giovan Battista Bellaso describes a cipher whose shift changes letter by letter according to a keyword. Later credited to Blaise de Vigenère, it was thought unbreakable for three centuries.', links: ['ciphers', 'cipher-lemon'] },
  { year: 1623, title: 'Bacon\\'s two-letter alphabet', text: 'Francis Bacon publishes a cipher in which every letter is a group of five a\\'s and b\\'s — and shows how it can hide in any text printed in two typefaces.', links: ['ciphers', 'cipher-ham-and-eggs'] },
  { year: 1829, title: 'Braille\\'s six dots', text: 'Louis Braille, a pupil at the school for blind children in Paris, publishes the system of raised dots that bears his name.', links: ['ciphers', 'cipher-louis-braille'] },
  { year: 1844, title: 'What hath God wrought', text: 'Samuel Morse sends a message by electric telegraph from Washington to Baltimore, in the dot-and-dash code he developed with Alfred Vail.', links: ['ciphers', 'cipher-wrought'] }
]);
`;
out += 'Cabinet.family({\n';
out += "  id: 'ciphers', engine: 'codes', cat: 'riddles', name: 'Codes and ciphers', order: 5,\n";
out += "  blurb: 'Caesar\\'s wheel, Polybius\\'s torches, the pigpen of the lodges, Morse, semaphore, the Spartan scytale, Vigenère\\'s table, Braille and Bacon: decode the messages with the tools of each code.',\n";
out += "  origin: { year: -50, who: 'Julius Caesar', note: 'Suetonius describes Caesar writing letters with every letter moved three places along the alphabet — the oldest cipher we can name. The codes here run from Spartan rods and Greek torches to the telegraph and Braille.' },\n";
out += "  concepts: ['cryptography', 'modular']\n";
out += '}, [\n';
out += puzzles.map((p) => {
  const lines = ['  { id: ' + q(p.id), '    title: ' + q(p.title), '    diff: ' + p.diff];
  if (p.year != null) lines.push('    year: ' + p.year);
  if (p.source) lines.push('    source: ' + q(p.source));
  lines.push('    text: ' + q(p.text));
  if (p.goal) lines.push('    goal: ' + q(p.goal));
  if (p.hints) lines.push('    hints: ' + q(p.hints));
  if (p.explain) lines.push('    explain: ' + q(p.explain));
  if (p.links) lines.push('    links: ' + q(p.links));
  lines.push('    concepts: ' + q(p.concepts || ['cryptography']));
  if (p.tags) lines.push('    tags: ' + q(p.tags));
  lines.push('    data: ' + q(p.data) + ' }');
  return lines.join(',\n');
}).join(',\n') + '\n]);\n';

fs.writeFileSync(path.join(ROOT, 'data/ciphers.js'), out);
const byDiff = {};
puzzles.forEach((p) => { byDiff[p.diff] = (byDiff[p.diff] || 0) + 1; });
const byCode = {};
puzzles.forEach((p) => { byCode[p.data.code] = (byCode[p.data.code] || 0) + 1; });
console.log('data/ciphers.js: ' + puzzles.length + ' puzzles, by difficulty ' + JSON.stringify(byDiff) + ', by code ' + JSON.stringify(byCode) + ', ' + Math.round(out.length / 1024) + ' KB');
