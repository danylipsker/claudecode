/* The Puzzle Cabinet · data/mini-mysteries.js
 * Short whodunits and “how did they know?” stories, every one of them original. Each has a single answer
 * that can be worked out from the story alone (plus what everybody knows about suns, moons and clocks).
 * A few are inspired by the deductions in the public-domain Sherlock Holmes stories; none copies a text. */
(function () {
  'use strict';
  const C = Cabinet;

  C.concepts([
    { id: 'evidence', name: 'Reading the evidence', see: ['deduction', 'truth-logic'],
      text: 'A detective’s trade is noticing what does not fit. A story can be false without any one word being impossible: the sun sets over the sea on a coast where the sea lies to the east, a cocoa is stone cold five minutes after it was carried in, a will is dated on a day that never existed. Check every claim against something that cannot lie (the sky, the calendar, the clock, the cooling of a cup) and the claim that fails is the one to look at.' }
  ]);

  // a choice answer: the right one goes to a place that cycles from puzzle to puzzle; each wrong one may carry the message shown when it is picked
  let mcCount = 0;
  function mc(right, wrongs, extra) {
    const at = (mcCount++ * 7 + 2) % (wrongs.length + 1);
    const choices = wrongs.map((w) => (Array.isArray(w) ? w[0] : w));
    choices.splice(at, 0, right);
    const msgs = wrongs.map((w) => (Array.isArray(w) ? w[1] : null));
    msgs.splice(at, 0, null);
    const idx = choices.map((_, i) => i);
    const ex = Object.assign({}, extra || {});
    if (ex.order) {
      const key = (c) => { const i = ex.order.findIndex((k) => c.indexOf(k) >= 0); return i < 0 ? 99 : i; };
      idx.sort((a, b) => key(choices[a]) - key(choices[b]));
    }
    delete ex.order;
    const traps = [];
    idx.forEach((oldI, newI) => { if (msgs[oldI]) traps.push({ match: newI, msg: msgs[oldI] }); });
    return Object.assign({ answer: { choice: idx.indexOf(at), choices: idx.map((i) => choices[i]) }, traps }, ex);
  }

  Cabinet.family({
    id: 'mini-mysteries', engine: 'question', cat: 'logic', name: 'Mini-mysteries', order: 4,
    blurb: 'Short whodunits and “how did they know?” stories. Every clue is in the story: find the one that does not fit.',
    origin: { year: 1892, who: 'Arthur Conan Doyle and the detectives who followed', note: 'Sherlock Holmes made deduction from small facts a popular sport in the 1890s: the hat, the tan line, the dog that did not bark. The stories here are all new; they use the same game of checking a claim against a fact that cannot be argued with.' },
    concepts: ['evidence', 'deduction']
  }, [

    /* ============================ EASY ============================ */
    {
      id: 'mys-sunset', title: 'The Sunset Alibi', diff: 1,
      text: 'At the Seacrest Hotel, Lady Marchbank’s emerald ring vanished from her room between seven and eight one evening, just as the sun was going down. The Seacrest stands on the **east coast**, and every window and balcony at its front looks straight out over the sea.\n\nFour guests were asked where they had been.\n\n**Mr Voss:** “On my balcony, watching the sun set over the water.”<br>**Miss Pell:** “In the bar, chatting with the barman.”<br>**Colonel Rudd:** “Walking my dog along the beach, a long way from the hotel.”<br>**Mrs Tang:** “In the writing room, answering my letters.”\n\nWhich guest cannot possibly be telling the truth?',
      hints: ['Which of the four stories can be checked against the sky?', 'In which direction does the sun set? And in which direction does the sea lie from the Seacrest?'],
      explain: 'The sun sets in the **west**, and the Seacrest looks out over the sea to the *east*. From Mr Voss’s balcony the sun goes down behind the hotel, not over the water. His alibi is false. The other three stories may be untrue as well, but nothing in the puzzle can prove it.',
      data: mc('Mr Voss', [['Miss Pell', 'Nothing in the story contradicts her: bars are indoors and a barman can be asked.'], ['Colonel Rudd', 'A dog-walk on a beach cannot be checked against the sky, and he does not mention the sunset.'], ['Mrs Tang', 'A writing room has no view of the sun at all.']], { order: ['Voss','Pell','Rudd','Tang'], glyph: '🌅' }),
      concepts: ['evidence'], links: ['mys-new-moon', 'mys-noon-photo']
    },
    {
      id: 'mys-cocoa', title: 'The Cocoa with a Skin', diff: 1,
      text: 'Old Mr Ashby was found slumped over his desk at ten past nine. Beside him stood a cup of cocoa, full to the brim, **stone cold, with a thick skin** on top.\n\nThe household gave their accounts.\n\n**Mrs Bray, the cook:** “I carried his cocoa in at five to nine, steaming hot. He was alive, and grumbling about the noise.”<br>**Perkins, the butler:** “I last saw him at eight, when I locked the front door.”<br>**Owen, his nephew:** “I was upstairs all evening, and came down when I heard Perkins shout.”<br>**Miss Lyle, the secretary:** “I left at half past seven, and did not come back until this morning.”\n\nWhose story cannot be true?',
      hints: ['How long does a cup of cocoa take to go cold and grow a skin?', 'Could it have gone stone cold in the quarter of an hour between five to nine and ten past?'],
      explain: 'A cup of hot cocoa needs the better part of an hour to go cold and skin over, not a quarter of an hour. Mrs Bray’s claim that she carried it in steaming at five to nine cannot be true: the cup must have stood there far longer. Either she brought it much earlier, or she did not bring it as she says. The other three accounts have no connection to the cocoa.',
      data: mc('Mrs Bray, the cook', [['Perkins, the butler', 'Nothing about the cocoa says anything about when he locked the door.'], ['Owen, the nephew', 'The cup tells us nothing about where he was.'], ['Miss Lyle, the secretary', 'She says she was not there, and the cocoa gives no reason to doubt it.']], { order: ['Bray','Perkins','Owen','Lyle'], glyph: '☕' }),
      concepts: ['evidence'], links: ['mys-warm-bonnet']
    },
    {
      id: 'mys-warm-bonnet', title: 'The Warm Bonnet', diff: 1,
      text: 'A jewel thief drove away from Larkfield Manor at a quarter to midnight. At a quarter past twelve Inspector Bloom walked down the village street, where the four cars of the village were parked, and laid his hand on the bonnet of each one.\n\nThe vicar’s car: **cold as a stone**. The doctor’s: **cold**. The baker’s van: **cold**. The bank manager’s car: **warm**.\n\nThe four owners gave their evening.\n\n**The Reverend Marsh:** “At home since supper, writing my sermon.”<br>**Dr Sim:** “Called out to a patient at seven, home by ten, asleep by half past.”<br>**Mr Loaf, the baker:** “In bed since eight. I get up at three to bake.”<br>**Mr Quill, the bank manager:** “Home all evening, playing cards with my wife.”\n\nWho most likely drove the getaway car?',
      hints: ['How long does the bonnet of a car stay warm after it has been driven?', 'One of the cars has been driven within the last half hour. Whose is it?'],
      explain: 'An engine cools quickly: after an hour or so, a bonnet is cold. A warm bonnet at a quarter past twelve means the car was driven very recently, about the time the thief left the manor. The only warm bonnet is **Mr Quill’s**, and his story of a quiet evening at home does not fit.',
      data: mc('Mr Quill, the bank manager', [['The Reverend Marsh', 'His car is cold, so it has not been driven for a long time.'], ['Dr Sim', 'His car was cold at a quarter past twelve: he was home by ten.'], ['Mr Loaf, the baker', 'His van is stone cold, which agrees with his story of being in bed since eight.']], { order: ['Marsh','Sim','Loaf','Quill'], glyph: '🚗' }),
      concepts: ['evidence'], links: ['mys-cocoa']
    },
    {
      id: 'mys-sunday-receipt', title: 'The Sunday Receipt', diff: 1,
      text: 'On Sunday afternoon somebody took the fine old violin from Mr Ferraro’s music room. Four people had been in the house that week, and each has an alibi.\n\n**Gus Marsh:** “I was in the town centre all afternoon.” As proof he shows a till receipt from Bellamy’s Bookshop for a novel and a notebook, dated **that Sunday**, timed 3:12 pm.<br>**Hester Dunn:** “I was visiting my aunt in the hospital.” She signed the visitors’ book at two o’clock.<br>**Ian Pratt:** “I was fishing with my brother on the canal.”<br>**Joan Kirk:** “I was at choir practice in the church hall.” The whole choir saw her.\n\nEveryone in town knows that Bellamy’s Bookshop **has never opened on a Sunday**, not once in its hundred years.\n\nWhose alibi is false?',
      hints: ['Look at what each person offers as proof. Which proof can be tested?', 'A shop that is never open on a Sunday cannot have printed a Sunday receipt at 3:12 pm.'],
      explain: 'A receipt is good proof only if the shop could have printed it. Bellamy’s is closed every Sunday, so a Sunday receipt from Bellamy’s at 3:12 pm is a fake, or it belongs to another day and has been altered. **Gus Marsh’s** alibi collapses. The hospital book and the choir may be true; the fishing story could not be checked, but nothing in the puzzle proves it false.',
      data: mc('Gus Marsh', [['Hester Dunn', 'A signature in a visitors’ book is a good piece of evidence, and nothing here contradicts it.'], ['Ian Pratt', 'His story cannot be checked, but nothing proves it false.'], ['Joan Kirk', 'The whole choir saw her; that is a very strong alibi.']], { order: ['Gus','Hester','Ian','Joan'], glyph: '🧾' }),
      concepts: ['evidence'], links: ['mys-leap-wills']
    },
    {
      id: 'mys-a1z26-note', title: 'The Note on the Boat-Shed Door', diff: 1,
      text: 'When Inspector Bloom arrived at the lake, he found a note pinned to the door of the boat-shed. It contained only numbers:\n\n**8 5 12 16 · 1 20 · 20 8 5 · 12 1 11 5**\n\n“The numbers stand for letters,” said the Inspector, “and the number for a letter is its place in the alphabet: 1 is A, 2 is B, and so on. Whoever wrote this was in trouble.”\n\nWhat does the note say?',
      hints: ['Write the alphabet with numbers underneath: A is 1, B is 2, C is 3 …', '8 is H. What are 5, 12 and 16?'],
      explain: '8 = H, 5 = E, 12 = L, 16 = P: **HELP**. 1 = A, 20 = T: **AT**. 20 = T, 8 = H, 5 = E: **THE**. 12 = L, 1 = A, 11 = K, 5 = E: **LAKE**. The note reads “**Help at the lake**”, and the Inspector took the nearest boat.',
      data: { answer: { text: ['help at the lake', 'help at lake'], exact: true }, ask: 'What does the note say?', glyph: '8 5 12 16' },
      concepts: ['evidence'], links: ['mys-caesar-note']
    },

    /* ============================ FAIR ============================ */
    {
      id: 'mys-new-moon', title: 'The Moonlit Lane', diff: 2,
      text: 'On the night of the 14th of October, the strongbox of Ashcroft Farm was carried off from the barn between eleven and midnight. The village almanac says, for that month: **“New moon: 14 October.”** At new moon the moon is on the same side of the Earth as the sun and does not shine at all: the night is as dark as nights are. The sky was cloudless.\n\nFour people were out that night.\n\n**Dora Finch:** “I walked home along Miller’s Lane at half past eleven. The full moon was so bright I could have read a newspaper.”<br>**Eli Rook:** “It was pitch black. I felt my way along the wall.”<br>**Fay Marsh:** “I went out with a torch to look for my cat.”<br>**Gil Nunn:** “I was in bed by ten, and my wife can say so.”\n\nWhose story cannot be true?',
      hints: ['Which of the stories mentions the moon?', 'What does the almanac say about the moon that night?'],
      explain: 'There was no moon at all on the night of the 14th: it was new. So **Dora’s** bright full moon did not exist. Eli’s pitch black, Fay’s torch and Gil’s bed all fit a moonless night. (Dora may have been out on another night, or she may want to be believed on this one.)',
      data: mc('Dora Finch', [['Eli Rook', 'A moonless night is exactly as dark as he says.'], ['Fay Marsh', 'On a moonless night one needs a torch.'], ['Gil Nunn', 'The moon does not come into his story at all.']], { order: ['Dora','Eli','Fay','Gil'], glyph: '🌑' }),
      concepts: ['evidence'], links: ['mys-sunset', 'mys-noon-photo']
    },
    {
      id: 'mys-noon-photo', title: 'The Noon Photograph', diff: 2,
      text: 'On the twenty-first of June, at noon, someone emptied the safe of Merrow Mill in the south of England. Ted Dunn, one of the four men with a key to the mill, says he was sixty kilometres away, fishing from the pier at Haventon. As proof he shows a photograph that his cousin, he says, took at exactly twelve o’clock that day. It shows Ted grinning with a big fish, in bright, cloudless sunshine. The **shadows on the planks are very long**: Ted’s own shadow is about three times as long as he is tall.\n\nInspector Bloom glances at the photograph and says at once: “This was not taken at noon.”\n\nHow did he know?',
      hints: ['Where is the sun in the sky at noon in the middle of summer? High or low?', 'How long are shadows when the sun is high, and how long when it is low?'],
      explain: 'On the longest day of the year, in the south of England, the sun at noon stands very high, about 60 degrees above the horizon, and shadows are **shorter than the person** casting them. Shadows three times longer than the person mean a low sun, in the early morning or the evening. So the photograph was taken at a very different hour from the one Ted claims, and it is no alibi for noon.',
      data: mc('At midsummer noon shadows are short; shadows this long mean early morning or evening', [['Nobody goes fishing at noon in June, when the fish have all gone down to the cool, deep water', 'People fish at any time of day, and this has nothing to do with the photograph.'], ['A photograph can never show what time it was taken, so the Inspector is simply guessing', 'It often can, roughly, by the length and direction of the shadows.'], ['Ted looks far too pleased with his fish, like a man who has arranged the whole scene', 'A grin proves nothing about the hour.']], { glyph: '📷' }),
      concepts: ['evidence'], links: ['mys-sunset', 'mys-new-moon']
    },
    {
      id: 'mys-wet-paint', title: 'The Print in the Paint', diff: 2,
      text: 'The white gate of Mr Gaunt’s walled garden was painted at **one o’clock**. The paint takes exactly **two hours to dry**; from three o’clock the gate can be touched without leaving a mark. At half past five Mr Gaunt found that his prize marrow was gone. On the gate, in the paint, was the print of a hand, smeared with garden soil: it was made by the thief as he carried the marrow **out** of the garden. There is no other way in or out.\n\nFour neighbours were suspected, and each has an alibi that has been **checked and found true**.\n\n**Mrs Fry:** at the market from noon until four.<br>**Mr Oakes:** at the dentist’s from half past twelve, then on the bus home, back at ten past three.<br>**Ned Pratt:** playing bowls at the club from a quarter past three until six.<br>**Miss Ling:** on a school trip to the museum, from twelve until half past three.\n\nWho took the marrow?',
      hints: ['When must the print have been made? Think about the paint.', 'The print was made while the paint was wet: between one and three o’clock. Whose alibi does *not* cover that time?'],
      explain: 'The print was made in wet paint, so the thief left the garden between **one and three o’clock**. Mrs Fry (at the market), Mr Oakes (at the dentist and on the bus) and Miss Ling (at the museum) were all elsewhere for that whole time. **Ned Pratt’s** alibi, a good one for the evening, begins at a quarter past three, after the paint had dried: it says nothing about the afternoon that matters.',
      data: mc('Ned Pratt', [['Mrs Fry', 'She was at the market for the whole of the time when the paint was wet.'], ['Mr Oakes', 'His alibi covers the whole time between half past twelve and ten past three, and the paint dried at three.'], ['Miss Ling', 'She was with a class of children at the museum all the time the paint was wet.']], { order: ['Fry','Oakes','Ned','Ling'], glyph: '🖐' }),
      concepts: ['evidence', 'deduction'], links: ['mys-thirty-minutes']
    },
    {
      id: 'mys-outside-glass', title: 'The Glass on the Path', diff: 2,
      text: 'Mr Bellwether reported that a burglar had broken into his greenhouse in the night and stolen his prize orchid. The greenhouse door had been locked, he said, when he went to bed, and this morning one pane of the door was smashed and the door stood ajar.\n\nInspector Ash examined the scene at dawn. The greenhouse key hangs on Mr Bellwether’s own key-ring, and there is no other. The broken glass was lying on the **path outside**, and there was **not one splinter on the greenhouse floor**.\n\nWhat probably happened?',
      hints: ['When you throw a stone through a window, on which side does the glass end up?', 'Glass flies away from the blow. If the glass is outside, on which side of the pane was the blow struck?'],
      explain: 'Glass from a broken pane falls, for the most part, *away* from where it was struck: a pane smashed from outside spills glass **inside**. Here all the glass is outside, so the pane was smashed from **inside**. A burglar breaking in does not do that, and the only key belongs to Mr Bellwether. The likeliest story is that he broke the pane himself, from inside, to make it look as if a burglar had taken an orchid that he had sold, hidden or spoiled himself.',
      data: mc('Mr Bellwether broke the pane from inside himself, to fake a burglary', [['A burglar smashed the pane from the garden side and reached in to open the door', 'Then the glass would lie inside the greenhouse, not on the path.'], ['A stray football from the school field broke the pane', 'A ball from outside would send the glass inside, and there is no ball.'], ['The wind blew the door open and cracked the glass', 'A blow from outside would put the glass inside; and the wind does not smash a pane so completely.']], { glyph: '🪟' }),
      concepts: ['evidence', 'deduction'], links: ['mys-red-clay']
    },
    {
      id: 'mys-red-clay', title: 'The Red Clay', diff: 2,
      text: 'The silver candlesticks vanished from the vicarage on Friday evening. In the hall Inspector Bloom found a smear of **red clay** on the doormat, and he was quite sure it came from the thief’s boots.\n\nNow, the only red clay for miles around is at the old **brickworks pit**, on the far side of the hill. All the fields round the village are black soil, the roads are white chalk and the churchyard is grass.\n\nFour villagers were out that evening, and each said where he had been.\n\n**Barnaby the baker:** “Delivering loaves along the village street, all evening.”<br>**Sid the shepherd:** “On the chalk down with my flock, until dark.”<br>**Nell the postwoman:** “Cycling round the lanes with the last post. The lanes are chalk and gravel.”<br>**Wilf the night-watchman:** “At the brickworks, keeping an eye on the pit, from six o’clock.”\n\nWhose boots most likely left the red clay?',
      hints: ['Where can red clay be picked up?', 'Which of the four says he was in that very place?'],
      explain: 'Red clay comes only from the brickworks pit. The baker was on the street, the shepherd on chalk and the postwoman on the lanes, none of which has red clay. Only **Wilf** was at the pit, and by his own account. The one who told the truth about where he had been is the one whose boots could have left the clay.',
      data: mc('Wilf the night-watchman', [['Barnaby the baker', 'The village street has no red clay.'], ['Sid the shepherd', 'A chalk down has no red clay.'], ['Nell the postwoman', 'She herself says the lanes are chalk and gravel.']], { order: ['Barnaby','Sid','Nell','Wilf'], glyph: '🥾' }),
      concepts: ['evidence', 'deduction'], links: ['mys-outside-glass']
    },
    {
      id: 'mys-last-to-leave', title: 'The Last Light', diff: 2,
      text: 'On Monday morning the cash box of the Quill & Press print shop was found empty, and the lights had been left on all night. Five workers had been in the shop on Sunday evening, and they left one at a time. The last to leave, they all agree, was the only one who could have taken the box without being seen.\n\nHere is what they remember, and all of it is true:\n\n• Ben left **immediately after** Ade.<br>• Cara left **before** Ade, but **after** Eli.<br>• Dev left **after** Ben.\n\nWho left last?',
      hints: ['Put the five names in a line and use the clues one at a time.', 'Eli left before Cara, and Cara before Ade. Ben came right after Ade. Where does Dev go?'],
      explain: 'Eli left before Cara, and Cara before Ade: Eli, Cara, Ade. Ben left *immediately* after Ade: Eli, Cara, Ade, Ben. Dev left after Ben: Eli, Cara, Ade, Ben, **Dev**. Dev was the last one out.',
      data: mc('Dev', [['Ben', 'Dev left after Ben.'], ['Ade', 'Ben left immediately after Ade, so Ade was not last.'], ['Eli', 'Eli left before Cara, who left before Ade. Eli was the first out.']], { order: ['Ade','Ben','Dev','Eli'], glyph: '💡' }),
      concepts: ['deduction'], links: ['mys-thirty-minutes']
    },
    {
      id: 'mys-goat-garden', title: 'The Goat in the Cabbages', diff: 2,
      text: 'Somebody left the gate of the vegetable garden open, and the goat ate all the cabbages. Four children were playing near the garden: Nell, Otto, Pia and Quin. **Exactly one** of them left the gate open, and **exactly one** of them is telling a lie now.\n\n**Nell:** “It was Otto who left the gate open.”<br>**Otto:** “It was Quin.”<br>**Pia:** “It wasn’t me.”<br>**Quin:** “Otto is not telling the truth.”\n\nWho left the gate open?',
      hints: ['Look at what Otto and Quin say about each other. Can both be truthful? Can both be lying?', 'Exactly one child is lying, and it must be one of Otto and Quin. So Nell and Pia are truthful.'],
      explain: 'Quin says that Otto is lying, so Otto and Quin cannot both be truthful, and they cannot both be lying (if Otto lies, Quin speaks the truth, and if Otto is truthful, Quin lies). So **exactly one of Otto and Quin lies**, which uses up the single liar. That leaves **Nell and Pia truthful**. Nell says it was **Otto**, and that is the answer. (And so Otto’s accusation of Quin was the lie.)',
      data: mc('Otto', [['Nell', 'Nell is one of the truthful children, and she says it was Otto.'], ['Pia', 'Pia says it wasn’t her, and she is telling the truth.'], ['Quin', 'Otto says it was Quin, but Otto is the one who is lying.']], { order: ['Nell','Otto','Pia','Quin'], glyph: '🐐' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-missing-medal', 'mys-tea-party-cake']
    },
    {
      id: 'mys-missing-medal', title: 'The Missing Medal', diff: 2,
      text: 'The school’s gold medal has disappeared from its case. Three pupils were in the hall at lunchtime: Ada, Bo and Cy. **One** of them took it. Between them they say:\n\n**Ada:** “Bo took it.”<br>**Bo:** “Ada is lying.”<br>**Cy:** “Bo didn’t take it.”\n\nThe head teacher knows that **exactly one of the three is telling the truth**. Who took the medal?',
      hints: ['Two of the three statements flatly contradict each other. Which two?', 'Ada says Bo took it, and Cy says he did not. If exactly one of the three tells the truth, which of them cannot be the one?'],
      explain: 'Ada and Cy contradict each other: one of them is truthful and the other is lying. That is already the one truth, so **Bo is lying** when he says Ada is lying. So Ada is truthful, and Ada says Bo took it: **Bo**. Check: Ada is the only one telling the truth.',
      data: mc('Bo', [['Ada', 'Then Ada would be lying, Bo would be truthful (“Ada is lying”) and Cy truthful too: that makes two truthful.'], ['Cy', 'Then Ada would be lying, but Bo (“Ada is lying”) and Cy (“Bo didn’t take it”) would both be telling the truth: two truths.']], { order: ['Ada','Bo','Cy'], glyph: '🏅' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-goat-garden']
    },
    {
      id: 'mys-tips-box', title: 'The Tips Box', diff: 2,
      text: 'The staff of the Grand Hotel keep their tips in a box. One evening three of them, each thinking nobody would notice, helped themselves in turn.\n\nFirst the footman took **a third** of all the coins in the box. Then the cook took **a quarter of the coins that were left**. Then the maid took **half of what was left after that**. When the manager opened the box in the morning, there were **12 coins** in it.\n\nHow many coins were in the box before the footman touched it?',
      hints: ['Work backwards from the 12 coins in the box in the morning.', 'The maid took half of what she found, so before her there were 24. The cook took a quarter, leaving three quarters. How many were there before the cook?'],
      explain: 'Go backwards. After the maid took half there were 12, so she found **24**. The cook took a quarter and left three quarters, so 24 is three quarters of what she found: she found **32**. The footman took a third and left two thirds, so 32 is two thirds of what he found: **48** coins. Check: the footman takes 16 (32 left), the cook 8 (24 left), the maid 12 (12 left).',
      data: { answer: { num: 48 }, ask: 'How many coins, at the start?', traps: [{ match: 96, msg: 'Try checking it forwards: a third of 96 is 32, and so on. The box would not end up with 12.' }, { match: 12, msg: 'That is what was left at the end.' }], glyph: '🪙' },
      concepts: ['working-backwards'], links: ['mys-thirty-minutes']
    },

    {
      id: 'mys-acrostic', title: 'A Cheerful Letter', diff: 2,
      text: 'Lady Cray was being kept at her own house by two men who read all her post. They allowed her to write one letter, to her sister, on condition that it said nothing that mattered. This is what she wrote:\n\n*All is well here, and the weather has been lovely.*<br>*Tea is served at four, as always.*<br>*The cat sends her love: she has grown fat.*<br>*I hope you are keeping warm.*<br>*Come and see us soon.*\n\nHer sister, reading it, went white and called the police at once. Where in the house was Lady Cray being kept?',
      hints: ['Nothing in the words gives it away. Look at the way the letter is *built*.', 'Read down the page: what is the first letter of each sentence?'],
      explain: 'The first letters of the five sentences are **A, T, T, I, C**: she was hidden in the **attic**. A message hidden in the first letters of the lines of a text, called an *acrostic*, is one of the oldest ways of sending a secret past a reader who is looking only at the meaning.',
      data: { answer: { text: ['attic', 'the attic', 'in the attic'], exact: true }, ask: 'Where was she being kept?', glyph: 'A·T·T·I·C' },
      concepts: ['evidence'], links: ['mys-caesar-note', 'mys-a1z26-note']
    },

    {
      id: 'mys-dying-word', title: 'The Dying Word', diff: 2,
      text: 'Professor Quill, who loved word games more than anything, was found dying in his study. With a trembling finger he had written a single word in the dust on his desk:\n\n**DENIAL**\n\n“A denial?” said the constable. “But of what?”\n\n“He never wasted a word,” said Inspector Bloom. “I think it is not a word at all, but a puzzle. Shuffle the letters.”\n\nFour people were in the house: Hester Vane, the housekeeper; Marcus Fell, the Professor’s nephew; Daniel Roke, his assistant; and Isabel Crane, his secretary. Who did the Professor accuse?',
      hints: ['DENIAL has six letters. Which of the four names has the same letters?', 'Write down the letters D, E, N, I, A, L and try the first names one by one.'],
      explain: 'Shuffle D-E-N-I-A-L and you can make **DANIEL**: the Professor named his assistant, **Daniel Roke**, in the one way a dying man who loved anagrams could think of. None of the other names (Hester, Marcus, Isabel) uses those six letters.',
      data: mc('Daniel Roke, the assistant', [['Hester Vane, the housekeeper', 'HESTER does not use the letters D, E, N, I, A, L.'], ['Marcus Fell, the nephew', 'MARCUS does not use the letters D, E, N, I, A, L.'], ['Isabel Crane, the secretary', 'ISABEL has letters I, S, A, B, E, L: no D and no N.']], { order: ['Hester','Marcus','Daniel','Isabel'], glyph: 'DENIAL' }),
      concepts: ['evidence'], links: ['mys-acrostic', 'mys-caesar-note']
    },
    {
      id: 'mys-shadow-height', title: 'The Height of the Thief', diff: 2,
      text: 'A security camera caught a thief crossing the courtyard of the Assay Office on a bright afternoon. The picture is very clear. Beside the thief stands a **fence post 1.5 metres tall**, and its shadow on the flat ground is **1.0 metre long**. The **thief’s own shadow**, at the same moment on the same ground, is **1.2 metres long**.\n\nFour men are suspected: **Mr Fane** is 1.65 m tall, **Mr Gill** is 1.80 m, **Mr Holt** is 1.92 m and **Mr Ives** is 1.75 m.\n\nWhich of them fits the picture?',
      hints: ['At the same moment the sun makes the same angle for everybody, so shadows are in the same proportion to heights.', 'The post’s shadow is two thirds of its height. What is the thief’s height if his shadow is 1.2 m?'],
      explain: 'The sun makes the same angle with the ground for the post and for the thief, so height ÷ shadow is the same for both: 1.5 ÷ 1.0 = 1.5. The thief’s height is 1.5 × 1.2 = **1.80 m**. That is **Mr Gill**.',
      data: mc('Mr Gill, 1.80 m', [['Mr Fane, 1.65 m', 'His shadow would be 1.1 m, not 1.2 m.'], ['Mr Holt, 1.92 m', 'His shadow would be 1.28 m, longer than the one in the picture.'], ['Mr Ives, 1.75 m', 'His shadow would be about 1.17 m, a little short.']], { order: ['Fane','Gill','Holt','Ives'], glyph: '🌞' }),
      concepts: ['evidence', 'rates'], links: ['mys-noon-photo']
    },
    {
      id: 'mys-petrol-gauge', title: 'The Petrol Gauge', diff: 2,
      text: 'Mr Dunn borrowed a neighbour’s car for the evening. He swears he only drove to the village shop and back, a round trip of about 12 km. The neighbour had filled the tank to the brim in the morning, and knew that the car does **10 km on every litre** of petrol. When Mr Dunn brought the car back, the gauge showed that **6 litres** had gone.\n\nThat evening a till was emptied at one of the four places near the village. Their distances from the village, along the only road:\n\n**The village shop:** 6 km<br>**Lower Hale:** 15 km<br>**Marham:** 30 km<br>**Stow:** 45 km\n\nWhere did Mr Dunn really drive, there and back?',
      hints: ['How many kilometres does the car do on six litres of petrol?', 'That is the distance of the round trip. Half of it is the distance to the place he drove to.'],
      explain: 'Six litres at 10 km per litre is **60 km**. A round trip of 60 km is 30 km each way, and the only place 30 km from the village is **Marham**. (A trip to the village shop and back would have used only 1.2 litres.)',
      data: mc('Marham', [['The village shop', 'A 12 km round trip uses about 1.2 litres, not 6.'], ['Lower Hale', 'Lower Hale and back is 30 km, or 3 litres of petrol.'], ['Stow', 'Stow and back is 90 km, or 9 litres.']], { order: ['village shop','Lower Hale','Marham','Stow'], glyph: '⛽' }),
      concepts: ['rates', 'evidence'], links: ['mys-shadow-height']
    },
    {
      id: 'mys-three-trunks', title: 'The Three Trunks', diff: 2,
      text: 'The thief who stole the Duchess’s jewels hid them in one of three trunks in the attic. Being a joker, he chalked a message on each trunk:\n\n**Trunk 1:** “The jewels are in this trunk.”<br>**Trunk 2:** “The jewels are not in this trunk.”<br>**Trunk 3:** “The jewels are not in Trunk 1.”\n\nHe also left a note for the police: **“Exactly one of the three messages is true.”**\n\nWhere are the jewels?',
      hints: ['Try each trunk in turn: suppose the jewels are there, and count how many of the three messages come out true.', 'If the jewels are in Trunk 1, Trunk 2’s message is true as well as Trunk 1’s.'],
      explain: 'Suppose the jewels are in **Trunk 1**: messages 1 and 2 are both true. In **Trunk 3**: messages 2 and 3 are both true. Only if they are in **Trunk 2** is exactly one message true (the third), so that is where the joker hid them.',
      data: mc('Trunk 2', [['Trunk 1', 'Then messages 1 and 2 would both be true.'], ['Trunk 3', 'Then messages 2 and 3 would both be true.']], { order: ['Trunk 1','Trunk 2','Trunk 3'], glyph: '🧳' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-goat-garden']
    },
    {
      id: 'mys-three-painters', title: 'The Three Workmen', diff: 2,
      text: 'The Marsh family’s shed, garage and attic were each being worked on by a different workman: **Ada**, **Ben** and **Cara**, each alone, each with a different tool: a **hammer**, a **saw** and a **drill**. A window was broken somewhere and nobody will say who did it. The housekeeper saw enough to say this:\n\n• Either Ada or Ben was in the attic.<br>• The saw was in the garage.<br>• The hammer was in the attic.<br>• Ada was not in the attic.<br>• Ada did not have the drill.\n\nWho was in the shed, and with what?',
      hints: ['Start with the two clues about the attic.', 'Ada is not in the attic, but either Ada or Ben is: so who is in the attic, and what has he?'],
      explain: '“Either Ada or Ben was in the attic”, and Ada was not, so **Ben** was in the attic, and he had the hammer (the hammer was in the attic). The saw was in the garage. Ada did not have the drill, and the hammer is Ben’s, so Ada had the saw, in the garage. That leaves **Cara**, in the shed, with the **drill**.',
      data: mc('Cara, with the drill', [['Ada, with the saw', 'Ada was in the garage, with the saw.'], ['Ben, with the hammer', 'Ben was in the attic, with the hammer.'], ['Cara, with the saw', 'The saw was in the garage, and Cara was in the shed.']], { order: ['Ada','Ben','Cara, with the drill','Cara, with the saw'], glyph: '🔨' }),
      concepts: ['deduction'], links: ['mys-crash-in-the-library']
    },

    /* ============================ TRICKY ============================ */
    {
      id: 'mys-caesar-note', title: 'The Note Under the Door', diff: 3,
      text: 'A note was slipped under the door of Mrs Halloran’s cottage. It read:\n\n**WKH JROG LV LQ WKH ROG PLOO**\n\nInspector Bloom looked at it for a moment. “See how *WKH* comes twice,” he said. “This is one of the oldest ciphers there is: every letter has been replaced by the letter a few places further on in the alphabet. Julius Caesar, they say, used it in his private letters.”\n\nWhat does the note say?',
      hints: ['The three-letter word that comes twice is probably a very common word of three letters. Which one?', 'If WKH is THE, then W stands for T, K for H, H for E. How far along the alphabet is W from T?'],
      explain: 'WKH could be THE: T → W, H → K, E → H, each three places on. Shift all the other letters back by three: JROG becomes **GOLD**, LV becomes **IS**, LQ becomes **IN**, ROG becomes **OLD** and PLOO becomes **MILL**. The note says “**The gold is in the old mill.**” The Roman writer Suetonius reports that Julius Caesar wrote his private letters in just this way, with a shift of three.',
      data: { answer: { text: ['the gold is in the old mill', 'gold in the old mill', 'gold in old mill'], exact: true }, ask: 'What does the note say?', glyph: 'WKH' },
      concepts: ['evidence', 'modular'], links: ['mys-a1z26-note', 'mys-atbash-note']
    },
    {
      id: 'mys-leap-wills', title: 'Three Wills for Uncle Silas', diff: 3,
      text: 'When old Silas Crane died in 1912, three wills turned up among his papers, all in his own handwriting, and each signed and witnessed on **29 February**: one in the year **1896**, one in **1900** and one in **1904**. His three heirs each hold a different will, and each swears that his own is the true one.\n\nUncle Silas was a careful man who never in his life wrote a date that did not exist. One of the three wills must be a forgery.\n\nWhich?',
      hints: ['29 February exists only in leap years. Which of the three years are leap years?', 'A year is a leap year if it can be divided by 4. But there is an exception for the years at the turn of a century.'],
      explain: 'A year is a leap year if it is divisible by 4, **except** that a century year (1800, 1900, 2100 …) is a leap year only if it is divisible by 400. So 1896 and 1904 are leap years, but **1900 was not**: there was no 29 February 1900. The will dated that day is a forgery. (The year 2000 *was* a leap year, because 2000 is divisible by 400.)',
      data: mc('The will of 29 February 1900', [['The will of 29 February 1896', '1896 is divisible by 4, and it is not a century year: it was a leap year.'], ['The will of 29 February 1904', '1904 is divisible by 4 and is not a century year: it was a leap year.']], { order: ['1896','1900','1904'], glyph: '📜' }),
      concepts: ['evidence', 'modular'], links: ['mys-weekday-letter', 'mys-sunday-receipt']
    },
    {
      id: 'mys-weekday-letter', title: 'The Careful Correspondent', diff: 3,
      text: 'Mrs Vane wrote to her nephew every week, and she was proud of never making a mistake: each letter had the weekday and the date, and both were always right. After her death four letters from that May were found, one of which was written by someone else.\n\nThat year **1 May fell on a Monday**.\n\n**A:** “Tuesday 9 May”<br>**B:** “Friday 19 May”<br>**C:** “Wednesday 20 May”<br>**D:** “Sunday 28 May”\n\nWhich letter is not by Mrs Vane?',
      hints: ['If 1 May is a Monday, then so are 8 May, 15 May, 22 May and 29 May. Every seven days the weekday comes round again.', 'Use those Mondays to check each letter.'],
      explain: 'The Mondays of that May are the 1st, 8th, 15th, 22nd and 29th. So Tuesday is the 9th (letter A is right), Friday is the 19th (B, right: 15 + 4), and Sunday is the 28th (D, right: the day before the 29th). But the 20th is five days after Monday the 15th: a **Saturday**, not a Wednesday. Letter **C** is the forgery.',
      data: mc('Letter C, “Wednesday 20 May”', [['Letter A, “Tuesday 9 May”', 'If 1 May is a Monday, so is 8 May, and 9 May is a Tuesday.'], ['Letter B, “Friday 19 May”', '15 May is a Monday, so 19 May is a Friday.'], ['Letter D, “Sunday 28 May”', '29 May is a Monday, so 28 May is a Sunday.']], { order: ['Letter A','Letter B','Letter C','Letter D'], glyph: '📅' }),
      concepts: ['modular', 'evidence'], links: ['mys-leap-wills']
    },
    {
      id: 'mys-tide-bar', title: 'Over the Bar', diff: 3,
      text: 'Brandy was landed in secret at Salt Cove one Thursday, and the customs men want to know which of four local skippers brought his boat in over the **sandbar** at the mouth of the little harbour that day. The bar is a bank of sand: a boat can cross it only within **two hours before or after high water**, and at any other time it is aground or dry.\n\nThe tide table in the harbourmaster’s office gives, for that Thursday, **high water at 4:20 am and at 4:45 pm**. The four skippers each say when they came in over the bar:\n\n**Jem:** “Half past one in the afternoon.”<br>**Kit:** “Ten to six in the evening.”<br>**Lyle:** “A quarter past three in the afternoon.”<br>**Moss:** “Half past two in the morning.”\n\nWhich skipper cannot have crossed the bar when he says he did?',
      hints: ['For each skipper, find the nearest high water and work out how long before or after it he says he crossed.', 'The window is two hours either side of 4:20 am and 4:45 pm. Which of the four times lies outside both windows?'],
      explain: 'The bar can be crossed from 2:20 to 6:20 in the morning and from 2:45 to 6:45 in the afternoon. **Kit** (5:50 pm) is about an hour after the afternoon high water: fine. **Lyle** (3:15 pm) is an hour and a half before it: fine. **Moss** (2:30 am) is 1 hour 50 minutes before the morning high water, just inside the window: fine. **Jem** (1:30 pm) is three hours and a quarter before high water, well outside: the bar was dry sand.',
      data: mc('Jem, at half past one in the afternoon', [['Kit, at ten to six in the evening', 'That is about an hour after the afternoon high water, well inside the window.'], ['Lyle, at a quarter past three in the afternoon', 'That is an hour and a half before high water at 4:45: inside the window.'], ['Moss, at half past two in the morning', 'High water was at 4:20, so this is 1 hour 50 minutes before it: a close thing, but inside the two-hour window.']], { order: ['Jem','Kit','Lyle','Moss'], glyph: '⚓' }),
      concepts: ['evidence', 'modular'], links: ['mys-sunset']
    },
    {
      id: 'mys-mirror-clock', title: 'The Clock in the Mirror', diff: 3,
      text: 'When the robbers burst into the Old Bank, the cashier, Tessa, threw herself under her desk. From there she could see only a large mirror on the wall opposite, and in it the reflection of the round clock that hung behind her. When the robbers left, she looked at the mirror: the reflected clock showed the **hour hand just past the 8 and the minute hand exactly on the 4**. “It was twenty past eight,” she told the police.\n\nBut a mirror swaps left and right. The Inspector frowned. “I’m afraid, Miss Tessa, that you have read the wrong time.”\n\nWhat time was it really?',
      hints: ['Picture the real clock, and turn it into its mirror image: what happens to the minute hand that points at the 4 in the mirror?', 'The hand that seems to point at the 4 is really pointing at the 8: the mirror swaps the two sides of the clock. Where, then, is the real hour hand?'],
      explain: 'A reflection puts every hand at the mirror-position across the vertical line through 12 and 6. The minute hand seen at the 4 is really at the **8**, that is, at 40 minutes past. The hour hand seen just past the 8 is really just before the 4, so the real time is **3:40**. In general, a mirror clock showing *T* is really showing 12:00 − *T*: 8:20 in the mirror is 3:40 in the room.',
      data: mc('3:40', [['8:20', 'That is the time on the reflected clock. A mirror swaps left and right, so the real hands stand on the other side of the vertical line.'], ['4:40', 'Not quite: try turning the whole clock over, hour hand as well.'], ['9:40', 'Not quite: try turning the whole clock over, hour hand as well.']], { order: ['3:40','4:40','8:20','9:40'], glyph: '🪞' }),
      concepts: ['symmetry', 'evidence'], links: ['mys-clock-chimes']
    },
    {
      id: 'mys-thirty-minutes', title: 'The Thirty Minutes', diff: 3,
      text: 'The alarm system at the Larkspur Gallery was switched off for maintenance from **2:10 to 2:40** in the morning, and at no other time. To steal the painting, the thief needed **twenty-five minutes inside the gallery, all in one go**: cutting the canvas from its frame and carrying it out. The alarm had to stay off for the whole of that time.\n\nFour people were in the building that night. All the times are true.\n\n**Rex, the cleaner:** in the building from 1:00 until 2:20.<br>**Tess, the guard:** in the building from 2:25 until dawn.<br>**Ulf, the electrician** (he switched the alarm off and on): in the building from 12:30 until 3:00.<br>**Vera, the curator:** in the building from 2:00 until 2:30.\n\nWho could have stolen the painting?',
      hints: ['Whoever it was needed 25 minutes in a row inside the building, all within the half hour when the alarm was off.', 'Work out, for each of the four, how long they were in the building *while the alarm was off*.'],
      explain: 'Between 2:10 and 2:40 the alarm was off for exactly 30 minutes. **Rex** was inside for only 10 of them (until 2:20), **Tess** for 15 (from 2:25), **Vera** for 20 (until 2:30): all too short. Only **Ulf** was there for the whole half hour. Any 25-minute stretch inside the half hour would have covered 2:15 to 2:35, and only he was in the building then.',
      data: mc('Ulf, the electrician', [['Rex, the cleaner', 'He left at 2:20 and could have used only ten of the thirty minutes.'], ['Tess, the guard', 'She arrived at 2:25, so could have used only fifteen of the thirty minutes.'], ['Vera, the curator', 'She left at 2:30 and had only twenty minutes with the alarm off: not enough.']], { order: ['Rex','Tess','Ulf','Vera'], glyph: '🖼' }),
      concepts: ['deduction'], links: ['mys-wet-paint', 'mys-last-to-leave']
    },
    {
      id: 'mys-quiet-hound', title: 'The Hound That Kept Quiet', diff: 3,
      source: 'Inspired by the dog that did not bark in Arthur Conan Doyle’s “Silver Blaze” (1892); the story here is new.',
      text: 'One night the safe in the study at Pryce Hall was opened and emptied. Bruno, the great guard dog who sleeps in the hall, barks furiously at anyone he does not know well. He barked once that night, at ten o’clock, at a man who brought a telegram. When the safe was opened, at two in the morning, **Bruno did not bark**.\n\nBruno knows the family and the staff who have lived at the Hall for years: Sir Alan, the butler Pym and the cook Mrs Gale. He has never met the new footman, Kit, who was hired yesterday, or Mr Rowe, the accountant, who arrived that evening.\n\nThe combination of the safe is known only to Sir Alan, Pym and Mr Rowe.\n\nSir Alan was away that night, and everybody in the house says they slept through it. Who opened the safe?',
      hints: ['Whoever opened the safe knew the combination, and Bruno did not bark at him.', 'Take the four people in the house one by one. Who knew the combination, and would Bruno have kept quiet at him?'],
      explain: 'The thief knew the combination, so it is Pym or Mr Rowe (Sir Alan was away). Bruno would have barked at Mr Rowe, whom he had never met, and at Kit. Bruno did not bark, so the visitor was somebody he knew: **Pym**, the butler. Mrs Gale, whom Bruno knows, did not know the combination. The clue was the *silence*, the dog that did not bark.',
      data: mc('Pym, the butler', [['Mrs Gale, the cook', 'Bruno knows her, but she did not know the combination of the safe.'], ['Kit, the new footman', 'Bruno has never met him and would have barked; and he did not know the combination.'], ['Mr Rowe, the accountant', 'He knew the combination, but Bruno has never met him and would have barked.']], { order: ['Pym','Gale','Kit','Rowe'], glyph: '🐕' }),
      concepts: ['deduction', 'evidence'], links: ['mys-red-clay']
    },
    {
      id: 'mys-ledger-27', title: 'The Ledger That Was Twenty-Seven Out', diff: 3,
      text: 'The clerk of the Larkin Brewery copied five payments, in pounds, into the ledger: **84, 52, 71, 95 and 68**. The true total is £370, but the total the clerk wrote at the bottom was **£343**, twenty-seven pounds too low. The auditor was sure that the clerk had not stolen anything: he had simply copied one of the numbers with its **two digits swapped** (writing 37 for 73, for example).\n\nWhich payment did he miscopy?',
      hints: ['When you swap the two digits of a number, the change is always a multiple of 9. Is 27 a multiple of 9?', 'A number with digits *a* and *b* changes by 9 × (*a* − *b*) when the digits are swapped. What difference between the digits would give a change of 27?'],
      explain: 'Swapping the digits of a two-digit number changes it by nine times the difference of the digits (73 and 37 differ by 36 = 9 × 4). A change of 27 = 9 × 3 needs digits that differ by **3**. The differences are 4 (84), **3 (52)**, 6 (71), 4 (95) and 2 (68). Only 52 fits, and since the total came out too low, the clerk wrote **25** for **52**.',
      data: mc('£52, written as 25', [['£84', 'Swapping 84 to 48 changes the total by 36, not 27.'], ['£71', 'Swapping 71 to 17 changes the total by 54, not 27.'], ['£95', 'Swapping 95 to 59 changes the total by 36, not 27.'], ['£68', 'Swapping 68 to 86 changes the total by 18, and the wrong way.']], { order: ['£84','£52','£71','£95','£68'], glyph: '📒' }),
      concepts: ['modular', 'deduction'], links: ['mys-tips-box']
    },
    {
      id: 'mys-clock-chimes', title: 'The Church Clock', diff: 3,
      text: 'Mrs Oyler woke in the night to the sound of a crash and a cry from the house across the street. She did not look at her own clock. She lay awake, and then heard the church clock strike **once**, and after a time strike **once again**, and after another time strike **once again**, and then she fell asleep. Those were the only strokes she heard after the crash.\n\nThe church clock strikes the number of the hour **on the hour** (twelve strokes at midnight, one at one o’clock, two at two, and so on), and **one stroke at every half hour**.\n\nWhen was the crash?',
      hints: ['Write down the sequence of strokes through the night: 12 strokes at 12:00, then 1 stroke at 12:30, then 1 stroke at 1:00 …', 'Which three strikes in a row are all single strokes?'],
      explain: 'The clock strikes: 11 o’clock (eleven), 11:30 (one), 12:00 (**twelve**), 12:30 (**one**), 1:00 (**one**), 1:30 (**one**), 2:00 (**two**), 2:30 (one), 3:00 (three) … Three single strokes in a row occur only at **12:30, 1:00 and 1:30**. Mrs Oyler heard nothing else after the crash, so she woke after the twelve strokes of midnight but before 12:30: the crash was **between twelve and half past twelve**. She heard the 2:00 (two strokes) only in her dreams.',
      data: mc('Between 12:00 and 12:30', [['Between 1:00 and 1:30', 'Then she would have heard the 1:00, 1:30 and then two strokes at 2:00, never three singles in a row.'], ['Between 2:30 and 3:00', 'Then she would have heard three strokes at 3:00 next, not three singles.'], ['Between 11:00 and 11:30', 'Then she would have heard twelve strokes at midnight before the singles.']], { order: ['Between 11:00','Between 12:00','Between 1:00','Between 2:30'], glyph: '🔔' }),
      concepts: ['sequence', 'evidence'], links: ['mys-mirror-clock']
    },
    {
      id: 'mys-tea-party-cake', title: 'The Last Slice of Cherry Cake', diff: 3,
      text: 'At the vicar’s tea party the last slice of cherry cake vanished from the plate. Only three people were anywhere near the table: Amy, Ben and Cara, and one of them took it. Each of the three made two statements, and **exactly one of each person’s two statements is true**.\n\n**Amy:** “I didn’t take it. Ben did.”<br>**Ben:** “I didn’t take it. Amy did.”<br>**Cara:** “I didn’t take it. Amy didn’t either.”\n\nWho took the cake?',
      hints: ['Test each of the three in turn as the culprit. Count how many of Amy’s two statements are true in each case.', 'If Amy took it, both of her statements are false. If Ben took it, both of hers are true. What does that leave?'],
      explain: 'Suppose **Amy** took it: then both her statements (“I didn’t”, “Ben did”) are false, but each person has exactly one true. Suppose **Ben** took it: both of Amy’s statements are true, again wrong. That leaves **Cara**. Check: Amy’s “I didn’t” is true and “Ben did” false; Ben’s “I didn’t” true and “Amy did” false; Cara’s “I didn’t” false and “Amy didn’t either” true. Everybody has exactly one truth.',
      data: mc('Cara', [['Amy', 'Then both of Amy’s statements (“I didn’t take it”, “Ben did”) would be false, and she is supposed to have one true.'], ['Ben', 'Then both of Amy’s statements would be true: “I didn’t take it” and “Ben did”.']], { order: ['Amy','Ben','Cara'], glyph: '🍒' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-goat-garden', 'mys-missing-medal']
    },
    {
      id: 'mys-crash-in-the-library', title: 'The Crash in the Library', diff: 3,
      text: 'A crash was heard in the **library** of Wrenfield House, and a priceless globe lay in pieces. Three guests had each been wandering alone in a different room: the **library**, the **kitchen** and the **greenhouse**, and each had picked up a different thing: a **candlestick**, a **rope** and a **spanner**. The three, Ada, Ben and Cara, are not talking, but the housekeeper saw enough to say this:\n\n• Either Cara or Ben was in the greenhouse.<br>• Either Cara or Ben was in the library.<br>• Ada did not have the rope.<br>• Either Cara or Ada was in the greenhouse.<br>• The candlestick was in the greenhouse.\n\nWho broke the globe, and with what?',
      hints: ['The first two clues put Cara and Ben in the greenhouse and library between them. Who, then, is in the kitchen?', 'Once you know where Ada is, the third and fourth clues tell you who is in the greenhouse. The last clue tells you what that person is holding.'],
      explain: 'Cara or Ben is in the greenhouse *and* Cara or Ben is in the library, so those two rooms are taken by Cara and Ben, and **Ada is in the kitchen**. “Either Cara or Ada was in the greenhouse”: it is not Ada, so **Cara** is in the greenhouse, and **Ben** is in the library. The candlestick was in the greenhouse: Cara holds it. Ada did not have the rope, so Ada holds the spanner and **Ben has the rope**. The globe was broken by **Ben, with the rope**.',
      data: mc('Ben, with the rope', [['Ada, with the spanner', 'Ada is in the kitchen: the first two clues put Cara and Ben in the greenhouse and library.'], ['Cara, with the candlestick', 'Cara is in the greenhouse (with the candlestick), not in the library.'], ['Ben, with the spanner', 'Ben is in the library, but the spanner is in the kitchen, with Ada.']], { order: ['Ada','Ben, with the rope','Ben, with the spanner','Cara'], glyph: '🏺' }),
      concepts: ['deduction'], links: ['mys-cellar-clues']
    },

    {
      id: 'mys-atbash-note', title: 'The Mirror Alphabet', diff: 3,
      text: 'The smugglers of Gullhaven had a code, and Inspector Bloom had at last found the key: **the alphabet is written backwards** under itself, so that A becomes Z, B becomes Y, C becomes X, and so on to Z, which becomes A. A note was found in a bottle on the beach:\n\n**GSV KZIGMVI RH RM GSV XVOOZI**\n\nWhat does the note say?',
      hints: ['Write the alphabet in a row, and the same alphabet backwards underneath it. G is over T: what are the letters of the first word?', 'Decode GSV, the first word: G is T, S is H, V is E. The same word comes again in the middle.'],
      explain: 'A↔Z, B↔Y, C↔X …, so G = T, S = H, V = E: **THE**. KZIGMVI = P-A-R-T-N-E-R: **PARTNER**. RH = **IS**, RM = **IN**, and XVOOZI = C-E-L-L-A-R: **CELLAR**. The note says: “**The partner is in the cellar.**” Because this cipher swaps letters in pairs, the same steps turn plain text into code and code back into plain text. It is called *Atbash*, and it is known from the Hebrew scriptures.',
      data: { answer: { text: ['the partner is in the cellar', 'partner in the cellar', 'partner in cellar'], exact: true }, ask: 'What does the note say?', glyph: 'A↔Z' },
      concepts: ['evidence', 'symmetry'], links: ['mys-caesar-note', 'mys-a1z26-note']
    },
    {
      id: 'mys-two-wrong-clocks', title: 'Two Wrong Clocks', diff: 3,
      text: 'Two clocks in the banker’s house were set exactly right at **noon**. The **hall clock gains 3 minutes every hour** and the **kitchen clock loses 2 minutes every hour**. When the banker’s body was found, the hall clock said **6:18** and the kitchen clock said **5:48**.\n\nWhat time was it really?',
      hints: ['Neither clock is right. But you know how fast each goes wrong: how far apart do the two clocks drift each hour?', 'They drift apart by 5 minutes every hour. They are now 30 minutes apart.'],
      explain: 'Every real hour the hall clock gets 3 minutes ahead and the kitchen clock 2 minutes behind, so they drift apart by 5 minutes an hour. They are 30 minutes apart, so **six hours** have passed since noon: the real time is **6:00 pm**. (Check: in six hours the hall clock has gained 18 minutes, giving 6:18, and the kitchen clock has lost 12, giving 5:48.)',
      data: mc('6:00 pm', [['6:03 pm', 'That is the average of the two clocks. But the clocks are wrong by different amounts, so the average is not the truth.'], ['6:18 pm', 'That is the reading of the hall clock, which is fast.'], ['5:48 pm', 'That is the reading of the kitchen clock, which is slow.']], { order: ['5:48','6:00','6:03','6:18'], glyph: '🕰' }),
      concepts: ['rates'], links: ['mys-three-clocks', 'mys-clock-chimes']
    },
    {
      id: 'mys-ladder-marks', title: 'The Marks Under the Window', diff: 3,
      text: 'A burglar climbed a ladder to the upstairs window of Mr Pell’s jewellery shop. The **sill of the window is 4.8 m above the ground**. In the soft earth under it, the police found the two deep marks where the **feet of the ladder** had stood: they were exactly **1.4 m out from the wall**. The top of the ladder had left two scratches on the sill, right at the window. The wall is upright and the ground is level.\n\nFour neighbours own ladders of different lengths:\n\n**Mr Ashe:** 4.5 m<br>**Mrs Birch:** 5.0 m<br>**Mr Crow:** 5.5 m<br>**Ms Dell:** 6.0 m\n\nWhose ladder was used?',
      hints: ['The wall, the ground and the ladder make a right-angled triangle. Which side is the ladder?', 'The ladder is the long side: its length squared is 4.8² + 1.4². What is 23.04 + 1.96?'],
      explain: 'The wall is upright and the ground level, so the ladder, the wall and the ground make a right-angled triangle, with the ladder as its longest side. By Pythagoras its length is √(4.8² + 1.4²) = √(23.04 + 1.96) = √25 = **5.0 m**. That is **Mrs Birch’s** ladder. A longer ladder could not stand with its feet at 1.4 m and its top exactly on the sill.',
      data: mc('Mrs Birch (5.0 m)', [['Mr Ashe (4.5 m)', 'The ladder must be at least as long as the diagonal from the feet to the sill, which is longer than 4.8 m.'], ['Mr Crow (5.5 m)', 'A 5.5 m ladder with its feet at 1.4 m would reach a little over 5.3 m up: higher than the sill.'], ['Ms Dell (6.0 m)', 'A 6 m ladder with its feet at 1.4 m would reach nearly 5.8 m up: much higher than the sill.']], { order: ['Ashe','Birch','Crow','Dell'], glyph: '🪜' }),
      concepts: ['right-triangles', 'evidence'], links: ['mys-shadow-height']
    },
    {
      id: 'mys-dst-forward', title: 'The Night the Clocks Went Forward', diff: 3,
      text: 'The Black Swan inn was burgled in the small hours of a night in March, the night when all the clocks in the country are put **forward an hour**: at one o’clock in the morning they jump straight to **two** o’clock.\n\nMr Vane, the suspect, said: “I left the Black Swan at **half past one** in the morning by the pub clock, walked home and was in bed by two.” The landlord of the Black Swan, a careful man, put his clocks forward at one o’clock sharp.\n\nInspector Bloom did not believe Mr Vane, and said so at once. Why?',
      hints: ['What does the pub clock show at one minute to one, and what at one minute past?', 'Did the pub clock ever read half past one that night?'],
      explain: 'That night the pub clock went from 12:59 straight to 2:00. **The time half past one never came round at all**: it does not exist on the night the clocks go forward. So nobody can have left the pub “at half past one” by a correctly set clock. Mr Vane’s alibi is muddled, made up or copied from some other night.',
      data: mc('Half past one did not exist that night: the clock jumped from one o’clock straight to two', [['A landlord would never let anyone stay until half past one in the morning, whatever the night', 'Nothing in the story says so, and it would prove nothing anyway.'], ['Mr Vane could not have walked home and been in bed within half an hour, whichever way he went', 'We are told nothing about the distance.'], ['Pub clocks are always wrong, and a landlord’s clock is the least reliable evidence of all', 'The landlord was careful, and had changed his clocks at exactly the right moment.']], { glyph: '🕐' }),
      concepts: ['evidence', 'modular'], links: ['mys-weekday-letter', 'mys-leap-wills']
    },
    {
      id: 'mys-three-bells', title: 'The Three Bells of Saint Odo', diff: 3,
      text: 'The three bells of St Odo’s ring on their own, by clockwork, at different intervals: the **first every 8 minutes**, the **second every 12 minutes** and the **third every 15 minutes**. At exactly **3:00 pm** on Friday all three rang together, just as a thief was seen at the vestry window.\n\nOn Saturday a witness swore that he saw the same man at the window “when all three bells rang together, at four o’clock”. The bells were not touched in between, and they still ring at the same intervals, always starting from 3:00 pm on Friday.\n\nWhen do the three bells next ring together after 3:00 pm on Friday?',
      hints: ['You need a number of minutes that 8, 12 and 15 all divide into. Start with a number both 8 and 12 go into.', 'The smallest number divisible by 8, 12 and 15 is the *least common multiple*. Try 120.'],
      explain: 'The bells ring together at every common multiple of 8, 12 and 15 minutes. The smallest is 120: 8 × 15 = 120, 12 × 10 = 120, 15 × 8 = 120, and no smaller number works (60 is not divisible by 8). So the bells next ring together **two hours later, at 5:00 pm**. At four o’clock, 60 minutes later, the second and third bells do ring, but the first does not (60 is not a multiple of 8), so the witness’s story cannot be right.',
      data: mc('At 5:00 pm', [['At 4:00 pm', '60 minutes is a multiple of 12 and of 15, but not of 8: the first bell is out of step.'], ['At 3:24 pm', 'That is when the first two bells next meet (every 24 minutes), but the third is not with them.'], ['At 6:00 pm', 'They ring together at 5:00 pm already, and then again at 7:00 pm.']], { order: ['3:24','4:00','5:00','6:00'], glyph: '🔔' }),
      concepts: ['modular', 'sequence'], links: ['mys-clock-chimes']
    },
    {
      id: 'mys-order-of-arrival', title: 'The Order of Arrival', diff: 3,
      text: 'Six guests arrived one after another at the Countess’s party: Ada, Ben, Cara, Dev, Eve and Finn. The poisoned glass was handed to **the third guest to arrive**, and the Inspector must know who that was. All that the doorman remembers is true:\n\n• Ada arrived **exactly two places after** Dev.<br>• Cara arrived **exactly two places after** Ada.<br>• Ben arrived **immediately after** Ada.<br>• Eve arrived **before** Cara.<br>• Finn arrived **before** Eve.\n\nWho arrived third?',
      hints: ['Dev, someone, Ada, and then Ben right after Ada, and Cara two places after Ada. In which places can Ada arrive?', 'Ada cannot be earlier than third or later than fourth. Try each, and see where Eve and Finn can fit.'],
      explain: 'Dev, then someone, then Ada; Ben right after Ada; Cara two places after Ada: that needs Ada to be third or fourth. **Third** leaves Eve and Finn for places 2 and 6, but then Finn would have to come before Eve (place 6 is after 2). So Ada is **fourth**: Dev is second, Ben fifth, Cara sixth, and Finn and Eve fill places 1 and 3, with Finn first. The order is Finn, Dev, **Eve**, Ada, Ben, Cara.',
      data: mc('Eve', [['Finn', 'Finn arrived first.'], ['Ada', 'Ada arrived fourth.'], ['Dev', 'Dev arrived second.']], { order: ['Ada','Dev','Eve','Finn'], glyph: '🥂' }),
      concepts: ['deduction'], links: ['mys-order-seven', 'mys-last-to-leave']
    },

    /* ============================ HARD ============================ */
    {
      id: 'mys-cellar-clues', title: 'The Smashed Bottle in the Cellar', diff: 4,
      text: 'The oldest bottle of port at Harrowgate Hall was smashed in the **cellar**. Four guests, **Ada, Ben, Cara and Dev**, had each been alone in a different room, the **library**, the **kitchen**, the **greenhouse** and the **cellar**, and each had picked up a different tool: a **candlestick**, a **rope**, a **spanner** and a **poker**. The butler will not say who did it, but he saw enough to say this:\n\n• The candlestick was in the greenhouse.<br>• Either Cara or Ben was in the greenhouse.<br>• Either Cara or Ben was in the library.<br>• Dev did not have the poker.<br>• Either Ben or Dev was in the cellar.<br>• Ben was not in the greenhouse.<br>• The rope was in the kitchen.\n\nWho was in the cellar, and what was in that person’s hand?',
      hints: ['Two of the clues put Cara or Ben in the greenhouse, and one clue rules Ben out. Start there.', 'Once Cara is in the greenhouse, the library clue gives you Ben. Then find the cellar, and the tools.'],
      explain: '“Either Cara or Ben was in the greenhouse”, and Ben was not: **Cara** is in the greenhouse. Then “either Cara or Ben was in the library” gives **Ben** in the library. “Either Ben or Dev was in the cellar”: Ben is in the library, so **Dev** is in the cellar, and Ada in the kitchen. The candlestick was in the greenhouse: Cara has it. The rope was in the kitchen: Ada has it. Dev did not have the poker, so Dev has the **spanner** and Ben the poker.',
      data: mc('Dev, with the spanner', [['Ben, with the poker', 'Ben was in the library. Only Cara can be in the greenhouse, since Ben was not, and that puts Ben in the library.'], ['Ada, with the rope', 'Ada was in the kitchen, with the rope.'], ['Dev, with the poker', 'One clue says Dev did not have the poker.']], { order: ['Ada','Ben','Dev, with the poker','Dev, with the spanner'], glyph: '🍷' }),
      concepts: ['deduction'], links: ['mys-crash-in-the-library', 'mys-rooms-of-five']
    },
    {
      id: 'mys-five-witnesses', title: 'The Five Witnesses', diff: 4,
      text: 'A few pounds went missing from the till at the parish fete. Five of the helpers were at the stall, and **one of them took the money**. The vicar is certain that **exactly two of the five are lying**. They say:\n\n**Ada:** “Ben took it.”<br>**Ben:** “Cara took it.”<br>**Cara:** “Dev is lying.”<br>**Dev:** “Eve did not take it.”<br>**Eve:** “Ben is lying.”\n\nWho took the money?',
      hints: ['Try each of the five as the thief, one at a time, and count how many of the five statements are false.', 'If Ada took it, then Ada, Ben and Cara would all be lying: three. That is one too many.'],
      explain: 'Try each thief and count the liars. **Ada:** Ada, Ben and Cara lie (three). **Cara:** Ada, Cara and Eve lie (three). **Dev:** Ada, Ben and Cara lie (three). **Eve:** Ada, Ben and Dev lie (three). **Ben:** Ada is right; Ben is wrong; Dev is right (Eve did not take it); Cara, who says Dev lies, is wrong; and Eve is right, since Ben is lying. Exactly two liars, Ben and Cara. So it was **Ben**.',
      data: mc('Ben', [['Ada', 'Then Ada, Ben and Cara would all be lying: three liars, not two.'], ['Cara', 'Then Ada, Cara and Eve would be lying: three liars.'], ['Dev', 'Then Ada, Ben and Cara would be lying: three liars.'], ['Eve', 'Then Ada, Ben and Dev would be lying: three liars.']], { order: ['Ada','Ben','Cara','Dev','Eve'], glyph: '👥' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-false-confessions', 'mys-goat-garden']
    },
    {
      id: 'mys-two-statements-each', title: 'The Vicar’s Robe', diff: 4,
      text: 'On the morning of the harvest service the vicar’s best robe was hidden. Four choir members were in the vestry, Amy, Ben, Cara and Dev, and **one of them hid it**. Each made two statements, and **exactly one of each person’s two statements is true**.\n\n**Amy:** “I didn’t hide it. Ben did.”<br>**Ben:** “I didn’t hide it. Amy did.”<br>**Cara:** “I didn’t hide it. Amy did.”<br>**Dev:** “I didn’t hide it. Amy didn’t either.”\n\nWho hid the robe?',
      hints: ['If a person says two things and exactly one is true, then a person who says “I didn’t” and “X did” cannot be both truthful and guilty.', 'Try each of the four as the culprit and count how many of Amy’s two statements are true. Then check Cara’s.'],
      explain: 'If **Amy** hid it, both of her statements are false, and she must have one true. If **Ben** hid it, both of Amy’s are true. If **Cara** hid it, then Amy and Ben are fine (one true and one false each), but Cara’s two statements (“I didn’t”, “Amy did”) would both be false. That leaves **Dev**: then Amy’s “I didn’t” is true and “Ben did” false; Ben’s “I didn’t” true and “Amy did” false; Cara’s “I didn’t” true and “Amy did” false; Dev’s “I didn’t” false and “Amy didn’t” true. Everybody has exactly one truth.',
      data: mc('Dev', [['Amy', 'Then both of Amy’s statements would be false; she must have one true.'], ['Ben', 'Then both of Amy’s statements (“I didn’t”, “Ben did”) would be true.'], ['Cara', 'Then both of Cara’s statements (“I didn’t”, “Amy did”) would be false.']], { order: ['Amy','Ben','Cara','Dev'], glyph: '👘' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-tea-party-cake']
    },
    {
      id: 'mys-round-table', title: 'The Round Table', diff: 4,
      text: 'Six friends dined at a round table: **Ann, Bert, Cleo, Dan, Elsa and Finn**. Later Ann found that her glass had been tampered with, and the Inspector says the culprit is the guest who sat **directly opposite her**. (“To the left of” means the seat immediately on a person’s left as he or she sits facing the middle of the table.) Here is what the friends agree on:\n\n• Elsa sat immediately to the left of Cleo.<br>• Dan sat immediately to the left of Bert.<br>• Ann sat immediately to the left of Elsa.<br>• Dan sat directly opposite Elsa.\n\nWho sat directly opposite Ann?',
      hints: ['The first three clues glue people into chains. Write them as short rows: Cleo, Elsa, Ann and Bert, Dan, going round the table.', 'Now you have a chain of three, a chain of two and Finn, to be placed round the circle. Use the last clue to choose between the two ways.'],
      explain: 'Going round the table, each “immediately to the left of” puts the next person in the next seat: so **Cleo, Elsa, Ann** sit in a row (Elsa is left of Cleo, and Ann is left of Elsa) and **Bert, Dan** in a row. The chain of three, the chain of two and Finn go round the circle in one of two orders. In one, Dan sits opposite Elsa; in the other he does not. The seats, going round, are Ann, Bert, Dan, **Finn**, Cleo, Elsa, and **Finn** sits directly opposite Ann.',
      data: mc('Finn', [['Bert', 'Bert sat next to Ann.'], ['Cleo', 'Cleo sat two seats from Ann.'], ['Dan', 'Dan sat two seats from Ann; he sat opposite Elsa.']], { order: ['Bert','Cleo','Dan','Finn'], glyph: '🍽' }),
      concepts: ['deduction', 'symmetry'], links: ['mys-seven-seats']
    },
    {
      id: 'mys-order-seven', title: 'The Seven Bidders', diff: 4,
      text: 'Seven bidders arrived one after another at the auction house: **Ada, Ben, Cara, Dev, Eve, Finn and Gus**. The **fourth** to arrive found the vase already gone, and the Inspector wants to know who that was. The porter remembers, and all of it is true:\n\n• Gus arrived **exactly two places after** Dev.<br>• Ben arrived **immediately after** Finn.<br>• Cara arrived **exactly two places after** Ben.<br>• Gus arrived **before** Ada.<br>• Eve arrived **before** Gus.<br>• Dev arrived **immediately after** Ben.\n\nWho arrived fourth?',
      hints: ['Start with Finn, Ben, Dev and Cara, Gus: which of the clues chain them together?', 'Finn, Ben, Dev, Cara, Gus arrive in a run of five, one after another. Where can that run start, given that Eve is before Gus and Ada is after Gus?'],
      explain: 'Ben arrived immediately after Finn, Dev immediately after Ben, Cara two places after Ben (one place after Dev) and Gus two places after Dev (one place after Cara): **Finn, Ben, Dev, Cara, Gus** arrived in a row, five places, one after another. Eve had to be before Gus and Ada after him. The row cannot begin in first place (then Eve and Ada would have places 6 and 7, and Eve would be after Gus), nor in third place (then Gus would be last, with nobody after him for Ada). So the row fills places 2 to 6, Eve was first and Ada last: Eve, Finn, Ben, **Dev**, Cara, Gus, Ada.',
      data: mc('Dev', [['Ben', 'Ben arrived third.'], ['Cara', 'Cara arrived fifth.'], ['Finn', 'Finn arrived second.']], { order: ['Ben','Cara','Dev','Finn'], glyph: '🏛' }),
      concepts: ['deduction'], links: ['mys-order-of-arrival']
    },
    {
      id: 'mys-blood-match', title: 'The Blood Match', diff: 4,
      text: 'A burglar cut his hand on a broken window and left a smear of blood. It is of a rare type: in the village of **1,000 people**, exactly **10** have it, and the burglar was certainly a villager, so he is **one of those ten**. The police test the villagers one by one and arrest **Mr Pike**, who has this blood type. There is **no other evidence** against him.\n\nAt the trial the prosecutor says to the jury: “Only one innocent villager in a hundred has this blood type. So there is a **99% chance** that Mr Pike is guilty!”\n\nWhat is the real chance that Mr Pike is guilty?',
      hints: ['Forget percentages for a moment. How many villagers have the blood type, and how many of them are guilty?', 'Ten villagers have the type; exactly one of them is the burglar. Is there any reason to think Mr Pike is more likely to be the one than any of the others?'],
      explain: 'Ten villagers have that blood type, and exactly one of them left the blood. With no other evidence, Mr Pike is just one of the ten, and his chance of being the burglar is **1 in 10**, or 10%. The prosecutor has answered a different question, “how likely is a *match*, if he is innocent?” (1 in 100), and treated it as “how likely is he innocent, given a match?”. This mix-up is known as the prosecutor’s fallacy; it has put innocent people in prison.',
      data: { answer: { num: 0.1, tol: 0.005, show: '1/10' }, ask: 'As a fraction, decimal or percentage.', traps: [{ match: 0.99, msg: 'That is the prosecutor’s mistake. Ten villagers share the blood type, and only one is guilty.' }, { match: 0.5, msg: 'There is no reason to make it fifty–fifty: count the villagers who have the blood type.' }], glyph: '🩸' },
      concepts: ['conditional-probability', 'probability'], links: ['mys-two-headed-coin']
    },
    {
      id: 'mys-two-headed-coin', title: 'The Forger’s Coins', diff: 4,
      text: 'Old Mr Grubb, a forger, carried two coins in his pocket: an **ordinary fair coin** and a **two-headed coin**. Without looking, he drew one of them out at random and tossed it **three times**. It came down **heads every time**.\n\nWhat is the chance that he was holding the two-headed coin?',
      hints: ['Before he tossed it, the two coins were equally likely. How likely is HHH with each of them?', 'The fair coin makes three heads in a row one time in eight. The two-headed coin always does. Compare the two.'],
      explain: 'Before the tosses, each coin is equally likely to have been drawn. **Three heads** happens with the fair coin once in 8 draws, and with the two-headed coin every time. So out of every 16 draws in which the coin is drawn and tossed three times, 8 use the two-headed coin and give HHH; 8 use the fair coin and give HHH only once. Of the 9 cases of HHH, 8 are the two-headed coin: **8/9**, about 89%.',
      data: { answer: { num: 8 / 9, tol: 0.005, show: '8/9' }, ask: 'A fraction or a decimal.', traps: [{ match: 0.5, msg: 'The coins were equally likely at the start, but three heads in a row makes the two-headed coin a lot more likely.' }, { match: 0.875, msg: 'Close, but that is 7/8, which forgets that the fair coin also has a chance of showing HHH.' }], glyph: '🪙' },
      concepts: ['conditional-probability', 'probability'], links: ['mys-blood-match']
    },
    {
      id: 'mys-two-man-job', title: 'The Two-Man Job', diff: 4,
      text: 'The vault of the Merchants’ Bank opens only when **two** people turn two keys at the same moment, and it takes them **at least twenty-five minutes together** to empty it. The vault alarm was off from **2:00 to 2:45** in the morning and at no other time, so the job must have been done inside that window, with both thieves in the building the whole time.\n\nFour members of staff were in the building that night, and all these times are true.\n\n**Adam:** in the building from 1:30 to 2:15.<br>**Beryl:** from 2:10 to 3:00.<br>**Colm:** from 2:20 to 2:50.<br>**Dora:** from 1:00 to 2:30.\n\nWhich two were the thieves?',
      hints: ['For each pair, find how long both were in the building *while the alarm was off* (between 2:00 and 2:45).', 'Adam and Beryl overlap for only five minutes, and Adam and Colm not at all. Work through the other pairs, and look for 25 minutes.'],
      explain: 'Within the alarm window (2:00–2:45), the pairs are together for: Adam & Beryl 5 minutes (2:10–2:15); Adam & Colm none; Adam & Dora 15 (2:00–2:15); **Beryl & Colm 25 (2:20–2:45)**; Beryl & Dora 20 (2:10–2:30); Colm & Dora 10 (2:20–2:30). Only **Beryl and Colm** had the twenty-five minutes.',
      data: mc('Beryl and Colm', [['Adam and Beryl', 'They were together, with the alarm off, for only 5 minutes.'], ['Adam and Dora', 'They were together, with the alarm off, for only 15 minutes.'], ['Beryl and Dora', 'They had 20 minutes together while the alarm was off: five short.'], ['Colm and Dora', 'They had only 10 minutes together.']], { order: ['Adam and Beryl','Adam and Dora','Beryl and Colm','Beryl and Dora','Colm and Dora'], glyph: '🏦' }),
      concepts: ['deduction'], links: ['mys-thirty-minutes']
    },
    {
      id: 'mys-grid-four-harbour', title: 'Night at the Harbour', diff: 4,
      text: 'Something was stolen from the harbour last night, and the police have four suspects, **Ada, Ben, Cara and Dev**, who were each alone in a different place, the **boathouse**, the **office**, the **dock** and the **warehouse**, and each carried a different tool: a **lantern**, a **rope**, a **wrench** and a **crowbar**. The night watchman noted:\n\n• The wrench was in the boathouse.<br>• Either Ben or Dev was in the boathouse.<br>• The crowbar was on the dock.<br>• Either Ada or Dev was in the office.<br>• Either Ben or Dev was in the warehouse.<br>• Either Ada or Dev was in the warehouse.<br>• The lantern was not in the office.\n\nWho was on the dock, and with what?',
      hints: ['Compare the two clues about the warehouse with the two clues about the boathouse and the office. Who must be in the warehouse?', 'Dev appears in all the “either … or Dev” clues. If Dev were in the warehouse, where would Ben and Ada have to be?'],
      explain: '“Either Ben or Dev was in the warehouse” and “either Ada or Dev was in the warehouse”: one person is in the warehouse, so it has to be someone in both clues: **Dev**. Then “either Ben or Dev was in the boathouse” puts **Ben** in the boathouse, and “either Ada or Dev was in the office” puts **Ada** in the office. That leaves **Cara** on the dock, with the crowbar (the crowbar was on the dock). The wrench was in the boathouse, so Ben has it, and since the lantern was not in the office, Ada has the rope and Dev the lantern.',
      data: mc('Cara, with the crowbar', [['Ada, with the rope', 'Ada was in the office, with the rope.'], ['Ben, with the wrench', 'Ben was in the boathouse, with the wrench.'], ['Dev, with the lantern', 'Dev was in the warehouse, with the lantern.']], { order: ['Ada','Ben','Cara','Dev'], glyph: '⚓' }),
      concepts: ['deduction'], links: ['mys-cellar-clues']
    },

    /* ============================ FIENDISH ============================ */
    {
      id: 'mys-false-confessions', title: 'Two False Confessions', diff: 5,
      text: 'The prompt book of the Riverside Players was stolen the night before the première. Six members of the company were around the theatre, and **one of them took it**. The director is quite sure that **exactly three of the six are lying**.\n\n**Ada:** “I did it.”<br>**Ben:** “Cara is lying.”<br>**Cara:** “Dev is lying.”<br>**Dev:** “Ben did it.”<br>**Eve:** “I did it.”<br>**Finn:** “Cara is lying.”\n\nWho took the prompt book?',
      hints: ['Ada and Eve cannot both be telling the truth. And Ben and Finn make the very same claim: what does that tell you about them?', 'Suppose Ben and Finn are lying. Then Cara is truthful, so Dev lies: that is three liars already. Where does that lead?'],
      explain: 'Ada and Eve both say “I did it”, and only one person did, so at least one of them is lying. Ben and Finn make the same claim about Cara, so they are both truthful or both lying. **Suppose Ben and Finn lie**: then Cara tells the truth, so Dev lies, which makes three liars (Ben, Finn, Dev); Ada and Eve must both tell the truth, which cannot be. **So Ben and Finn are truthful**: Cara is lying, so Dev is telling the truth: **Ben did it**. Then Ada and Eve are false confessors, and the liars are exactly Ada, Cara and Eve: three.',
      data: mc('Ben', [['Ada', 'Then four would be lying, not three. Try counting them.'], ['Cara', 'Then five of the six would be lying, not three.'], ['Dev', 'Then five of the six would be lying, not three.'], ['Eve', 'Then four would be lying, not three.'], ['Finn', 'Then five of the six would be lying, not three.']], { order: ['Ada','Ben','Cara','Dev','Eve','Finn'], glyph: '🎭' }),
      concepts: ['truth-logic', 'deduction'], links: ['mys-five-witnesses']
    },
    {
      id: 'mys-rooms-of-five', title: 'The Five Rooms', diff: 5,
      text: 'A rare bottle was smashed at Corvin Court. Five guests, **Ada, Ben, Cara, Dev and Eve**, had each been alone in a different room: the **library**, the **kitchen**, the **greenhouse**, the **cellar** and the **attic**, each carrying a different thing: a **candlestick**, a **rope**, a **spanner**, a **poker** and a **bottle-opener**. The housekeeper will say only this:\n\n• The rope was in the kitchen.<br>• Either Cara or Dev was in the kitchen.<br>• The spanner was in the cellar.<br>• Either Ada or Cara was in the cellar.<br>• Either Cara or Dev was in the attic.<br>• Either Dev or Eve was in the kitchen.<br>• The candlestick was in the library.<br>• Either Cara or Eve was in the library.<br>• The bottle-opener was not in the attic.\n\nWho was in the attic, and what was in that person’s hand?',
      hints: ['Look at the two clues about the kitchen: the same person is in both. Who?', 'Once you know who is in the kitchen, the attic clue tells you who is in the attic; then go on to the cellar and the library, and finally to the things they carried.'],
      explain: 'Someone was in the kitchen, and the clues say “Cara or Dev” and “Dev or Eve”: only **Dev** fits both. Then “either Cara or Dev was in the attic” puts **Cara** in the attic. “Either Ada or Cara was in the cellar”: Cara is in the attic, so **Ada** is in the cellar; “either Cara or Eve was in the library”: **Eve** is in the library, and Ben is in the greenhouse. Now the things: Dev has the rope (kitchen), Ada the spanner (cellar), Eve the candlestick (library). The bottle-opener was not in the attic, so Cara has the **poker** and Ben the bottle-opener.',
      data: mc('Cara, with the poker', [['Cara, with the bottle-opener', 'The bottle-opener was not in the attic.'], ['Dev, with the rope', 'Dev was in the kitchen, with the rope.'], ['Ada, with the spanner', 'Ada was in the cellar, with the spanner.'], ['Ben, with the bottle-opener', 'Ben was in the greenhouse.']], { order: ['Ada','Ben','Cara, with the bottle','Cara, with the poker','Dev'], glyph: '🗝' }),
      concepts: ['deduction'], links: ['mys-cellar-clues', 'mys-grid-four-harbour']
    },
    {
      id: 'mys-seven-seats', title: 'Seven at the Round Table', diff: 5,
      text: 'Seven guests sat at a round table: **Ann, Bert, Cleo, Dan, Elsa, Finn and Gus**. “To the left of” means the seat immediately on someone’s left as he or she sits facing the middle of the table; “to the right of” means the seat on the other side. In the confusion of the evening a knife was stolen, and the Inspector wants to question **whoever sat immediately to Ann’s right**. Here is what the guests agree on:\n\n• Exactly one seat separated Dan and Gus (one person sat between them, the short way round).<br>• Dan sat immediately to the left of Ann.<br>• Elsa and Gus sat side by side.<br>• Cleo and Gus sat side by side.<br>• Exactly one seat separated Ann and Bert (the short way round).<br>• Exactly one seat separated Ann and Elsa (the short way round).\n\nWho sat immediately to Ann’s right?',
      hints: ['Start with the seat to Ann’s left, which the second clue fixes. Then think about Ann’s neighbours two seats away.', 'Elsa is two seats from Ann; Gus is next to Elsa and next to Cleo. Work out the two possible places for Elsa, and see which one fits the other clues.'],
      explain: 'Put Ann in seat 0 and number the seats going round to her left: **Dan** is in seat 1. Elsa and Bert are each two seats from Ann, so they fill seats 2 and 5 between them. Gus is two seats from Dan, so he is in seat 3 or seat 6. Seat 6 will not do: both Elsa and Cleo must sit beside Gus, but the seats beside seat 6 are seat 5 and Ann’s seat 0, and Ann is neither. So **Gus is in seat 3**, with neighbours in seats 2 and 4. Elsa is next to Gus, so she is in seat 2 (seat 4 is not one of her two places), Bert is in seat 5, and Cleo, also next to Gus, is in seat 4. The last seat, seat 6, immediately to Ann’s right, belongs to **Finn**.',
      data: mc('Finn', [['Bert', 'Bert sat two seats to Ann’s right, with Finn between them.'], ['Gus', 'Gus sat three seats to Ann’s left.'], ['Cleo', 'Cleo sat three seats to Ann’s right.'], ['Elsa', 'Elsa sat two seats to Ann’s left.']], { order: ['Bert','Cleo','Elsa','Finn','Gus'], glyph: '🍴' }),
      concepts: ['deduction', 'symmetry'], links: ['mys-round-table']
    },
    {
      id: 'mys-three-clocks', title: 'Three Clocks, One Murder', diff: 5,
      text: 'Three clocks stood in the house of the murdered banker, and all three had been set exactly right at **eight o’clock that morning**. One clock **gains six minutes every hour**; one **loses four minutes every hour**; the third had been perfectly right until it **stopped**. When the body was found, the three clocks read **2:36**, **1:36** and **11:12**.\n\nWhat was the real time when the body was found?',
      hints: ['The two clocks that are still running must both tell you the same real time. Which two of the three readings agree?', 'The fast clock runs at 11/10 of the true speed and the slow clock at 14/15. Try the pair 2:36 and 1:36: how many real minutes does each of them say have passed since eight o’clock?'],
      explain: 'Let *t* be the real minutes since 8:00. The fast clock has run 1.1 *t* minutes and the slow clock (56/60) *t*, about 0.933 *t*. The two running clocks must give the same *t*. Take the readings as elapsed minutes: 2:36 is 396, 1:36 is 336, 11:12 is 192. If the fast clock reads 396 then *t* = 360, and the slow clock, 336 minutes, gives 336 ÷ (56/60) = 360. **They agree.** No other pair does. So *t* = 360 minutes = six hours, and the real time was **2:00 pm**; the third clock stopped, after keeping perfect time, at 11:12.',
      data: mc('2:00 pm', [['2:36 pm', 'That is the reading of the clock that gains six minutes an hour.'], ['1:36 pm', 'That is the reading of the clock that loses four minutes an hour.'], ['11:12 am', 'That is when the third clock stopped, not when the body was found.']], { order: ['11:12','1:36','2:00','2:36'], glyph: '🕑' }),
      concepts: ['rates', 'deduction'], links: ['mys-two-wrong-clocks']
    },

  ].sort((a, b) => a.diff - b.diff));
})();
