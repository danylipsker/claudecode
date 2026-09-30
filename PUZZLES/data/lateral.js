/* The Puzzle Cabinet · data/lateral.js
 * Situation puzzles and trick questions: a short odd scene whose explanation overturns an assumption.
 * Most of these are folklore: nobody owns them and they have been told a thousand ways. Every scene here
 * is retold in our own words, with our own people and places. Where a puzzle has a known named source
 * (a psychologist's test, an old chronicle) the source is credited; otherwise it is "a traditional puzzle". */
(function () {
  const INK = '#3a3020', RED = '#b0472f', BLUE = '#3a6ea5';
  const FONT = 'font-family="Georgia,serif"';
  const ASK = 'What is the most likely explanation?';
  const list = [

    /* ---------- easy: trick questions and first assumptions ---------- */
    {
      id: 'lat-surgeon', title: 'The Surgeon\'s Sigh', diff: 1,
      source: 'A traditional puzzle, told in many versions since the 1970s.',
      text: `On a frosty morning a father and his young son are driving to a football match when their car slides off the road. Two ambulances arrive. The father, who is badly hurt, is taken to the city hospital; the boy is rushed to the children's hospital across town.\n\nThe surgeon on duty at the children's hospital takes one look at the boy and says quietly: **“I can't operate on this child. He is my son.”**`,
      hints: [`Look at what the story really says about the surgeon. What do you know, other than the job?`, `Which of the boy's parents has not been mentioned yet?`, `The story never says the surgeon is a man.`],
      explain: `The surgeon is the boy's **mother**. Most of us picture a man when we hear “surgeon”, and so we go hunting for a strange family knot (a father who slipped out of bed, a muddle at the hospital) when the plain answer was there all along: the story says only that the surgeon is a surgeon.\n\nFamilies come in many shapes, so a second father or a step-parent would fit the words too; but the puzzle asks for the most likely explanation, and with the boy's father in the other hospital, a mother is the answer it wants.`,
      data: {
        ask: ASK,
        answer: { choice: 2, choices: [`The surgeon is the boy's father, who has slipped out of his own hospital bed`, `The surgeon is being kind: to a caring doctor every young patient is “my son”`, `The surgeon is the boy's mother`, `The hospital has muddled up two patients, and the surgeon is thinking of somebody else`] },
        traps: [
          { match: 0, msg: `The father is badly hurt and lying in another hospital. Look for someone else.` },
          { match: 1, msg: `The surgeon means it literally: this really is their child.` },
          { match: 3, msg: `Nobody has muddled anything. The surgeon knows exactly who the boy is.` }
        ],
        glyph: '🩺'
      },
      concepts: ['lateral'], tags: ['assumption', 'classic']
    },
    {
      id: 'lat-months', title: 'Twenty-Eight Days', diff: 1,
      source: 'A traditional trick question.',
      text: `The teacher asks the class: “How many months of the year have 28 days in them?”\n\nMost of the class answer at once: “One, February!” But Ada, at the back, gives a different number.\n\nWhat number does Ada say?`,
      hints: [`Do not stop at February.`, `Does September have 28 days in it? Does it have more than that?`],
      explain: `**Twelve.** Every month has 28 days in it. February has just those, and the other eleven keep going to 30 or 31. The riddle works because we hear “have 28 days” as “have exactly 28 days”, which is not what the teacher said.`,
      data: {
        answer: { num: 12 },
        traps: [{ match: 1, msg: `February is the only month with exactly 28 days. But does “have 28 days in them” mean “exactly”?` }],
        glyph: '28'
      },
      concepts: ['lateral'], tags: ['trick question', 'wording']
    },
    {
      id: 'lat-all-but-nine', title: 'All but Nine', diff: 1,
      source: 'A traditional trick question.',
      text: `A shepherd has 17 sheep on a hillside. A clap of thunder scares them, and all but nine of them bolt through a gap in the wall and vanish over the hill.\n\nHow many sheep are left on the hillside?`,
      hints: [`“All but nine” means every sheep except nine.`, `Is the exception the group that ran, or the group that stayed?`],
      explain: `**Nine.** “All but nine ran away” means nine did *not* run away. Subtracting 9 from 17 gives 8, but that is how many bolted, not how many stayed.`,
      data: {
        answer: { num: 9 },
        traps: [{ match: 8, msg: `That is how many ran away. Read “all but nine” slowly, and ask who is the exception.` }],
        glyph: '🐑'
      },
      concepts: ['lateral'], tags: ['trick question', 'wording']
    },
    {
      id: 'lat-five-sisters', title: 'Five Sisters, One Brother', diff: 1,
      source: 'A traditional puzzle.',
      text: `The Okafors have five daughters. Each of the five girls has exactly one brother.\n\nHow many children do the Okafors have?`,
      hints: [`Do the five sisters need five different brothers?`, `Sisters can share.`],
      explain: `**Six**: five girls and one boy, who is the brother of every one of them. The tempting answer, ten, gives each girl a private brother, which nothing in the story asks for.`,
      data: {
        answer: { num: 6 },
        traps: [{ match: 10, msg: `That gives every girl her own brother. Must they each have a different one?` }, { match: 5, msg: `That counts only the girls. Is there anyone else in the family?` }],
        glyph: '👧'
      },
      concepts: ['lateral', 'deduction'], tags: ['family', 'counting']
    },
    {
      id: 'lat-overtake', title: 'Passing the Runner in Second', diff: 1,
      source: 'A traditional trick question.',
      text: `You are running in a village fun run, somewhere behind the leaders. Near the end you put on a burst of speed and overtake the runner who is in second place.\n\nWhich position are you in now?`,
      hints: [`Who is still in front of you after the move?`, `Only one runner is ahead. So how many places have you taken?`],
      explain: `**Second.** You have taken the place of the runner you passed, who drops back to third; the leader is still ahead of you. “First” is tempting because overtaking feels like winning, but you have passed only one runner and the leader is not that runner.`,
      data: {
        ask: `Which position are you in now?`,
        answer: { choice: 1, choices: [`First`, `Second`, `Third`, `It depends how many runners were behind you`] },
        traps: [
          { match: 0, msg: `You passed the runner in second place, not the leader. Who is still in front of you?` },
          { match: 2, msg: `Overtaking moves you up, not down.` },
          { match: 3, msg: `Only the runners in front matter here. Count them.` }
        ],
        glyph: '🏃'
      },
      concepts: ['lateral'], tags: ['trick question']
    },
    {
      id: 'lat-one-match', title: 'The Cold Dark Room', diff: 1,
      source: 'A traditional puzzle.',
      text: `It is a freezing night. A woodcutter steps into his dark cabin with a single match in his pocket. In the room stand a candle, an oil lamp, and a stove with kindling laid ready.\n\nWhat should he light first?`,
      hints: [`Reread the first sentence, not the list.`, `Something has to be lit before any of the three can be. What is in his pocket?`],
      explain: `The **match**. Whatever else he lights, the match has to be lit first. The story offers three things to choose from and tucks the fourth into its opening sentence.`,
      data: {
        answer: { text: ['the match', 'a match', 'match', 'match first', 'the match first', 'the single match', 'matchstick'] },
        traps: [{ match: ['candle', 'the candle', 'lamp', 'the lamp', 'oil lamp', 'the oil lamp', 'stove', 'the stove', 'kindling', 'fire', 'the fire'], msg: `A sensible thought, but something has to be lit before any of those can be.` }],
        glyph: '🔥'
      },
      concepts: ['lateral'], tags: ['trick question']
    },
    {
      id: 'lat-third-daughter', title: 'The Third Daughter', diff: 1,
      source: 'A traditional puzzle.',
      text: `Rosa's mother has three daughters. The first is called Ann and the second is called Beth.\n\nWhat is the name of the third daughter?`,
      hints: [`The name has already been given to you.`, `Read whose mother we are talking about.`],
      explain: `**Rosa.** The riddle starts with “Rosa's mother”, so Rosa is one of the mother's children, and with two daughters named the third must be Rosa herself. Almost everyone reaches for a name that continues the alphabet, which is a sign of how neatly the puzzle steers your attention away from its first two words.`,
      data: {
        answer: { text: ['rosa'] },
        traps: [{ match: ['cara', 'clara', 'carol', 'cathy', 'caroline', 'cindy', 'claire', 'clare', 'christine', 'chloe', 'cecilia', 'cleo'], msg: `A fair guess by the alphabet, but look at who is speaking about whom in the very first words.` }],
        glyph: '👩'
      },
      concepts: ['lateral'], tags: ['trick question', 'names'], links: ['lat-five-sisters']
    },
    {
      id: 'lat-noah-animals', title: 'The Sailor\'s Animals', diff: 1,
      source: 'A traditional trick question; psychologists call the effect the Moses illusion.',
      text: `How many animals of each kind did Moses take with him on the ark?`,
      hints: [`Say the question slowly, name by name.`, `Who built the ark in the story?`],
      explain: `**None.** It was Noah who built the ark, not Moses. Most people answer “two” without noticing that the name is wrong: the sentence sounds right, so the mind waves it through. Psychologists call this the Moses illusion.`,
      data: {
        answer: { text: ['none', 'zero', 'no animals', 'noah', 'it was noah', 'noah not moses', 'not moses', 'nobody', 'nought'] },
        traps: [{ match: ['two', '2', 'two of each', '2 of each', 'a pair', 'pairs', 'two each', 'a pair of each'], msg: `That is what most people say. It is what the story says about somebody, though. Check the name.` }],
        glyph: '🐘'
      },
      concepts: ['lateral'], tags: ['trick question', 'names']
    },
    {
      id: 'lat-roof-egg', title: 'The Egg on the Ridge', diff: 1,
      source: 'A traditional trick question.',
      text: `A rooster lays an egg right on the ridge of a steep barn roof. A brisk wind is blowing from the west.\n\nWhich way does the egg roll?`,
      hints: [`Forget the roof and the wind for a moment. Think about the bird.`, `Which kind of chicken lays eggs?`],
      explain: `**Nowhere: roosters do not lay eggs.** Hens do. The roof, the ridge and the wind are all decoration, put there to send you off working out slopes and gusts. Notice how quickly we accept a false premise once it comes with a problem attached.`,
      data: {
        ask: `Which way does the egg roll?`,
        answer: { choice: 3, choices: [`Down the eastern slope, pushed by the west wind`, `Down the western slope, against the wind`, `It stays put on the ridge`, `Nowhere: roosters do not lay eggs`] },
        traps: [
          { match: 0, msg: `A tidy piece of wind-and-slope reasoning. Now check who laid the egg.` },
          { match: 1, msg: `A steep roof and an egg on top make a fine problem. But is there an egg at all?` },
          { match: 2, msg: `Whether it stays or rolls, it needs an egg first. Who laid it?` }
        ],
        glyph: '🐓'
      },
      concepts: ['lateral'], tags: ['trick question', 'false premise']
    },
    {
      id: 'lat-bottom-rung', title: 'A Fall Without a Scratch', diff: 1,
      source: 'A traditional puzzle.',
      text: `A window cleaner loses his footing and tumbles off his ladder onto the hard pavement. He is not hurt in the slightest, not even bruised.\n\nThere was no net, mattress or bush to catch him. The ladder was in perfect order, and he was wearing no harness. He simply slipped.\n\nWhere on the ladder was he standing?`,
      hints: [`A fall hurts in proportion to how far you fall.`, `Where can you stand on a ladder and have almost nothing to fall?`],
      explain: `He was on the **bottom rung**. A slip from a few centimetres above the ground is just a stumble. We picture a cleaner high up the ladder because that is where cleaners usually are in stories about falling.`,
      data: {
        answer: { text: ['bottom rung', 'the bottom rung', 'lowest rung', 'the lowest rung', 'first rung', 'the first rung', 'bottom step', 'lowest step', 'first step', 'bottom', 'the bottom of the ladder', 'at the bottom'] },
        glyph: '🪜'
      },
      concepts: ['lateral'], tags: ['assumption']
    },
    {
      id: 'lat-dry-head', title: 'One Wet, One Dry', diff: 1,
      source: 'A traditional puzzle.',
      text: `Halima and her dog Biscuit walk the whole length of the seafront in a heavy downpour. Neither has a hat, a hood or an umbrella; they are out in it all the way.\n\nBy the end every hair on Biscuit is soaked. Halima's hair is not the least bit wet.\n\nWhy not?`,
      hints: [`Think about what there is on top of Halima's head, and what there might not be.`, `Every single hair on the dog is wet. What if there were no hair to get wet?`],
      explain: `Halima has **no hair**: she is bald (or has shaved her head), so there was nothing to get wet. We rush to invent shelter, cars and cleverness, but the plain fact is much simpler. (A wig would have got wet too, so it does not help.)`,
      data: {
        answer: { text: ['bald', 'she is bald', 'she was bald', 'hairless', 'no hair', 'she has no hair', 'she had no hair', 'shaved head', 'shaved', 'she shaved her head'] },
        glyph: '☔'
      },
      concepts: ['lateral'], tags: ['assumption']
    },
    {
      id: 'lat-two-apples', title: 'The Apple Thief', diff: 1,
      source: 'A traditional trick question.',
      text: `There are three apples in a bowl. You take away two of them.\n\nHow many apples do you have?`,
      hints: [`Read the question again: how many do *you* have?`, `Where did the two you took away go?`],
      explain: `**Two.** The question asks how many *you* have, not how many are left in the bowl. The subtraction 3 − 2 = 1 answers a different question, the one your mind expected.`,
      data: {
        answer: { num: 2 },
        traps: [{ match: 1, msg: `One is left in the bowl. Who is holding the others?` }],
        glyph: '🍎'
      },
      concepts: ['lateral'], tags: ['trick question', 'wording']
    },
    {
      id: 'lat-survivors', title: 'Where to Bury the Survivors', diff: 1,
      source: 'A traditional trick question.',
      text: `A small aeroplane, flying from Paris to Madrid, comes down exactly on the frontier line between France and Spain. Some of the passengers are able to walk away from the wreck.\n\nIn which country should the survivors be buried?`,
      hints: [`The border is a decoy. Forget it for a moment.`, `Look closely at the word “survivors”.`],
      explain: `**Nowhere: survivors are not buried.** The border, the flight plan and the two countries are all set dressing. The trap works because we answer the question we expect (“which country?”) before checking whether it makes sense.`,
      data: {
        ask: `In which country should the survivors be buried?`,
        answer: { choice: 0, choices: [`Neither: nobody buries survivors`, `France, where the flight began`, `Spain, where the flight was heading`, `Half in each country, along the border line`] },
        traps: [
          { match: 1, msg: `A good try at the legal side of it. But reread who the question asks you to bury.` },
          { match: 2, msg: `A good try at the legal side of it. But reread who the question asks you to bury.` },
          { match: 3, msg: `The border is a red herring. Who exactly are we burying?` }
        ],
        glyph: '✈'
      },
      concepts: ['lateral'], tags: ['trick question', 'false premise']
    },
    {
      id: 'lat-daylight', title: 'The Dark Suit on the Lane', diff: 1,
      source: 'A traditional puzzle.',
      text: `A dark-grey car with its headlamps switched off is driving down a country lane that has no street lights. A woman in dark clothes steps out into the road. The driver sees her in good time and stops without any fuss.\n\nThe car carries no spotlight, and the woman carries no torch and nothing that shines.\n\nHow did the driver see her?`,
      hints: [`The story never says what time of day it is.`, `What is the most ordinary light there is?`],
      explain: `It was **daytime**. Nothing in the story says night: it says only that the lamps are off, that there are no street lights and that the clothes are dark. We fill in the darkness ourselves.`,
      data: {
        ask: `How did the driver see her?`,
        answer: { choice: 3, choices: [`Her dark clothes reflected the starlight`, `The driver has unusually good night vision`, `The road has cat's-eyes, which lit her up`, `It was the middle of the day`] },
        traps: [
          { match: 0, msg: `The story never mentions any stars. What ordinary light could have lit her?` },
          { match: 1, msg: `Even the best night vision needs something to see by. What else could be lighting the lane?` },
          { match: 2, msg: `Cat's-eyes shine back at car headlamps, and these are switched off. What other light is there?` }
        ],
        glyph: '🚗'
      },
      concepts: ['lateral'], tags: ['assumption']
    },
    {
      id: 'lat-kilo', title: 'A Kilo of Each', diff: 1,
      source: 'A traditional trick question.',
      text: `A market trader asks: “Which weighs more, a kilo of feathers or a kilo of steel?”`,
      hints: [`Steel is dense and feathers are fluffy. Does that change what a kilo is?`, `Read what each pile weighs.`],
      explain: `**They weigh the same**: a kilo is a kilo. The steel takes up very little room and the feathers a great deal, and our minds slide from “heavy material” to “heavy pile”. (A very sensitive balance in the open air would tip a hair towards the steel, because the bulky feathers are buoyed up more by the air they push aside, but the two piles have the same mass.)`,
      data: {
        ask: `Which weighs more?`,
        answer: { choice: 2, choices: [`The steel, because it is so much denser`, `The feathers, because there are so many more of them`, `Neither: they weigh the same`] },
        traps: [
          { match: 0, msg: `Steel is far denser, true. But the question has already fixed how much of each we have.` },
          { match: 1, msg: `The feathers take up more room, true. But what does each pile weigh?` }
        ],
        glyph: '⚖'
      },
      concepts: ['lateral'], tags: ['trick question', 'classic']
    },
    {
      id: 'lat-guard', title: 'The Age of the Guard', diff: 2,
      source: 'A traditional puzzle.',
      text: `You work as the guard on a small mountain train. At the first station 12 passengers climb aboard. At the second, 3 get off and 7 get on. At the third, 5 get off and 4 get on. Then the train sets off for the summit.\n\nHow old is the guard?`,
      hints: [`You do not have to add or take away anything.`, `Who is the guard? Look at the very first words of the story.`],
      explain: `The guard is **you**, so the guard is exactly as old as you are. The sums about passengers (15 are on board, if you like) are a smokescreen. The story starts with “You work as the guard”, and by the time we get to the numbers, we have stopped listening.`,
      data: {
        ask: `How old is the guard?`,
        answer: { choice: 2, choices: [`Fifteen, like the passengers now on board`, `It cannot be worked out: the story gives no age`, `The same age as you`, `Twelve, the number who boarded first`] },
        traps: [
          { match: 0, msg: `That is the number of passengers, not the guard. Who is the guard?` },
          { match: 1, msg: `The story does say who the guard is, in its very first words.` },
          { match: 3, msg: `That is the number of passengers who boarded first. Who is the guard?` }
        ],
        glyph: '🚂'
      },
      concepts: ['lateral'], tags: ['trick question', 'wording']
    },
    {
      id: 'lat-two-barbers', title: 'Two Barbers, One Street', diff: 2,
      source: 'A traditional puzzle.',
      text: `Kofi arrives in a small mountain town with an important meeting tomorrow morning, and he needs a haircut. The town has just two barbers, with shops next door to each other, and there is no other barber within a day's ride. Neither barber can cut the back of his own head.\n\nThe barber on the left has a beautiful haircut: sharp, neat and even. The barber on the right has a scruffy, uneven one.\n\nWhich barber should Kofi choose?`,
      hints: [`Who has cut each barber's hair?`, `In this town there are only two barbers, and neither can do the back of his own head.`],
      explain: `Kofi should pick the **scruffy** barber. Since neither can trim his own head and there is nobody else in town, each barber's hair is cut by the other. The neat haircut on the left is the *right-hand barber's* work, and the scruffy one is the work of the barber on the left. Judge a barber by his handiwork, not by his own head.`,
      data: {
        ask: `Which barber should Kofi choose?`,
        answer: { choice: 0, choices: [`The scruffy barber on the right`, `The neat barber on the left`, `Either: a haircut is a haircut`, `Neither: go looking for a barber in another town`] },
        traps: [
          { match: 1, msg: `A natural thought. But whose hands gave the barber on the left his lovely cut?` },
          { match: 2, msg: `They are not the same. Whose scissors made each barber's own haircut?` },
          { match: 3, msg: `He does not have to go anywhere. The evidence is right there in front of him.` }
        ],
        glyph: '✂'
      },
      concepts: ['lateral', 'deduction'], tags: ['classic', 'deduction']
    },
    {
      id: 'lat-friday-rider', title: 'Three Days in Town', diff: 2,
      source: 'A traditional puzzle.',
      text: `A drover rides into a market town on Friday. He stays exactly three days, no more and no less, has his boots mended, and rides out of town on Friday.\n\nNobody is lying, and no calendar has been changed.\n\nHow can this be?`,
      hints: [`Count the days: three days after a Friday is never another Friday. So “Friday” cannot mean the day of the week both times.`, `The story says he rides in on Friday. Does it say what he rides on?`],
      explain: `His **horse was called Friday**. He rode in on Friday, stayed three days, and rode out on Friday. The word “Friday” stands in the story for a day, and so we look for calendar tricks instead of names.\n\n(The other reading, that he left on the Friday of the *next* week, would make it seven days, not three.)`,
      data: {
        ask: ASK,
        answer: { choice: 2, choices: [`He left on the Friday of the following week; “three days” was only loose talk`, `The town's calendar is shorter than a week`, `His horse was named Friday`, `He arrived late on Friday night and left early on the next Friday morning`] },
        traps: [
          { match: 0, msg: `The story says exactly three days, no more and no less. Count from Friday to next Friday.` },
          { match: 1, msg: `The story says no calendar has been changed. Look for a name rather than a date.` },
          { match: 3, msg: `That would make it about seven days, not three.` }
        ],
        glyph: '🐴'
      },
      concepts: ['lateral'], tags: ['classic', 'names']
    },
    {
      id: 'lat-thirty-cents', title: 'Thirty Cents', diff: 2,
      source: 'A traditional puzzle.',
      text: `I have two American coins in my hand. Together they are worth exactly 30 cents. One of them is not a nickel.\n\nWhich two coins are they?`,
      hints: [`A nickel is worth 5 cents. What other coin could go with it to make 30?`, `The sentence says *one* of them is not a nickel. It does not say *neither* is a nickel.`],
      explain: `A **quarter (25¢) and a nickel (5¢)**. One of them, the quarter, is not a nickel; the other one is. The riddle sounds as though it forbids nickels altogether, and then it looks impossible, but it says only that one of the two is not.`,
      data: {
        answer: { text: ['quarter and nickel', 'nickel and quarter', 'a quarter and a nickel', 'quarter and a nickel', 'a nickel and a quarter', 'quarter nickel', 'nickel quarter', '25 cents and 5 cents', '5 cents and 25 cents', '25c and 5c', '25 and 5'] },
        traps: [{ match: ['impossible', 'it is impossible', 'cannot be done', 'can t be done', 'not possible', 'it cannot be done', 'no such coins'], msg: `It can be done. Careful: which coin does the sentence say is not a nickel?` }],
        glyph: '¢'
      },
      concepts: ['lateral'], tags: ['classic', 'wording']
    },
    {
      id: 'lat-wrong-way-driver', title: 'Wrong Way, Right of Way', diff: 2,
      source: 'A traditional puzzle.',
      text: `A bus driver goes the wrong way down a one-way street, right under the nose of a police officer who is standing on the corner.\n\nThe officer sees it, does nothing, and has every reason to do nothing: no rule has been broken. There is no emergency and no special permit, and the officer is wide awake.\n\nWhy is no rule broken?`,
      hints: [`The story tells you the man's job. It does not tell you what he is doing at that moment.`, `One-way signs are addressed to vehicles.`],
      explain: `He is **on foot**. A bus driver on the way to work, or on a day off, is a pedestrian like anyone else, and one-way rules do not apply to walkers. The story gives him a job and lets us supply the bus.`,
      data: {
        answer: { text: ['on foot', 'he was on foot', 'he is on foot', 'walking', 'he was walking', 'he is walking', 'he walked', 'pedestrian', 'a pedestrian', 'he was a pedestrian', 'not driving', 'he was not driving', 'he wasn t driving', 'was not driving the bus', 'not driving the bus'] },
        glyph: '🚌'
      },
      concepts: ['lateral'], tags: ['classic', 'assumption']
    },

    /* ---------- fair: the classic situations ---------- */
    {
      id: 'lat-glass-of-water', title: 'A Glass of Water, Please', diff: 2,
      source: 'A traditional puzzle, told in many versions.',
      text: `A cyclist bursts into a café and asks the owner for a glass of water. The owner looks at him for a moment, then suddenly seizes a tray of cutlery and drops it with an enormous crash right behind him.\n\nThe cyclist jumps and gasps, and then his face lights up. “Thank you, that did it!” he says, and leaves without his water.`,
      hints: [`He wanted the water for a reason. Think of a small, annoying trouble that a glass of water is said to help with.`, `There is another old remedy for that trouble, and it is a fright.`],
      explain: `The cyclist had the **hiccups**. He came in for a glass of water, an old remedy; the owner, who had noticed the hiccups, chose an even older one, a sudden fright. It worked, so the cyclist was grateful and no longer needed the water. The story is one of the most retold of all situation puzzles, usually with a much more alarming remedy than a dropped tray.`,
      data: {
        ask: ASK,
        answer: { choice: 0, choices: [`He had hiccups, and the sudden fright cured them`, `The crash was a signal to a friend outside, and “a glass of water” was the password`, `He collects unusual noises, and had just heard a rare one`, `The owner wanted him out of the café, and he took the hint politely`] },
        traps: [
          { match: 1, msg: `Why would a man say “that did it” about a mere noise, and why choose such an ordinary password?` },
          { match: 2, msg: `He asked for water, and he thanked the owner for something that did him good. What could the noise have done for him?` },
          { match: 3, msg: `He was grateful, and he left saying “that did it”. What did “it” do?` }
        ],
        glyph: '🥛'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-closed-rucksack', title: 'The Closed Rucksack', diff: 2,
      source: 'A traditional puzzle.',
      text: `A farmer walks out early to look at a huge, freshly ploughed field. In the middle of it lies a man on his back, beyond all help. The soft earth around him is smooth: there are no footprints leading to him, no tracks of wheels or hooves, and nothing but his own body in the whole field.\n\nOn his back is a rucksack, still buckled shut. Nothing else is with him.\n\nWhat is in the rucksack?`,
      hints: [`How could he reach the middle of a ploughed field without leaving a mark on the ground?`, `He must have come down from somewhere above. What would he have needed for the descent?`],
      explain: `A **parachute**, which never opened. Because there are no footprints and no tracks, the man cannot have come by land; the smooth soil says he came down from the sky. The sad part is that the pack should have been open. It is a grim little classic, kept here in its mildest telling.`,
      data: {
        answer: { text: ['parachute', 'a parachute', 'chute', 'parachute pack', 'his parachute', 'paraglider', 'skydiving gear'] },
        traps: [{ match: ['food', 'clothes', 'tools', 'a picnic', 'lunch', 'sandwiches', 'money', 'a map', 'books', 'a tent', 'camping gear'], msg: `Ordinary things in an ordinary rucksack. But how did he arrive without leaving a single track?` }],
        glyph: '🎒'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-two-fathers-two-sons', title: 'Two Fathers, Two Sons', diff: 2,
      source: 'A traditional puzzle.',
      text: `Two fathers and two sons go fishing. Each of them catches exactly one fish, and they come home with exactly three fish: none were lost, eaten, shared or thrown back.\n\nHow many people went fishing?`,
      hints: [`Each person catches one fish, and there are three fish in the bucket.`, `Can one man be both a father and a son?`],
      explain: `**Three**: a grandfather, his son, and his grandson. The man in the middle is a father (to the boy) and a son (to the old man), so the words “two fathers and two sons” name only three people. Count the fish, not the words.`,
      data: {
        answer: { num: 3 },
        traps: [{ match: 4, msg: `That is what the words “two fathers and two sons” suggest. Now count the fish instead of the words.` }],
        glyph: '🎣'
      },
      concepts: ['lateral', 'deduction'], tags: ['classic', 'family']
    },
    {
      id: 'lat-portrait', title: 'The Man in the Portrait', diff: 3,
      source: 'A traditional puzzle, told in many versions.',
      text: `An old art collector stands in front of a portrait in his gallery and says to a visitor:\n\n*“I have no brothers or sisters, but that man's father is my father's son.”*\n\nWhose portrait is it?`,
      hints: [`Start from the phrase “my father's son”. If the collector has no brothers, who can that be?`, `Once you know who “my father's son” is, the rest of the sentence says who the man in the portrait's father is.`],
      explain: `It is the collector's **own son**. He has no brothers, so “my father's son” can only be *himself*. The sentence then reads: “that man's father is me”, which makes the man in the portrait his son.\n\nThe other answers all fail the test. If it were himself, he would be his own father; if it were his father, he would be his own grandfather; and a nephew needs a brother or sister to have him.`,
      data: {
        ask: `Whose portrait is it?`,
        answer: { choice: 0, choices: [`His son`, `The collector himself`, `His father`, `His nephew`] },
        traps: [
          { match: 1, msg: `Try it: if the portrait were of himself, the collector would be his own father.` },
          { match: 2, msg: `Try it: that would make the collector his own grandfather. Who must “my father's son” be?` },
          { match: 3, msg: `A nephew needs a brother or a sister to be born to, and the collector has none.` }
        ],
        glyph: '🖼'
      },
      concepts: ['deduction', 'lateral'], tags: ['classic', 'family'], links: ['lat-two-fathers-two-sons', 'lat-five-sisters']
    },
    {
      id: 'lat-shot-dunked-hung', title: 'Shot, Dunked and Hung Up', diff: 2,
      source: 'A traditional puzzle, told in many versions.',
      text: `In the days when people used film, Vera shot her husband Hugo. Then she held him under water for a minute or two, and afterwards she hung him up. That evening the two of them sat down to a delightful supper and were the best of friends.\n\nNobody was harmed at any point.\n\nWhat is Vera's job?`,
      hints: [`Try each verb in a different sense. What else can you “shoot”?`, `In an old darkroom, what happened to a picture after it was taken, and how was it hung up to dry?`],
      explain: `Vera is a **photographer**. She *shot* Hugo with a camera, *dunked* the exposed picture in the developing tray, and *hung it up* to dry on a line. Hugo's only trouble was sitting still for a portrait. It is a play on how many things a single verb can mean.`,
      data: {
        ask: `What is Vera's job?`,
        answer: { text: ['a photographer', 'photographer', 'photograph', 'photography', 'photo', 'a photo', 'photos', 'camera', 'a camera', 'took a photo', 'took his photo', 'took a photograph', 'took his photograph', 'she took his photograph'] },
        traps: [{ match: ['a painter', 'painter', 'an artist', 'artist', 'a butcher', 'a fisherman', 'a hunter', 'a killer'], msg: `Not quite. Try each verb in a different sense, thinking of pictures.` }],
        glyph: '📷'
      },
      concepts: ['lateral'], tags: ['classic', 'wordplay']
    },
    {
      id: 'lat-pushed-car', title: 'A Ruinous Hotel', diff: 2,
      source: 'A traditional puzzle.',
      text: `A man pushes his car along the road until he reaches a hotel. He stops in front of it, looks up, and realises at once that he is ruined.\n\nWhat is going on?`,
      hints: [`Real cars are rarely pushed by hand to hotels. What if this car were very small?`, `Think of a game where you move a little car around a board and pay rent when you land on a hotel.`],
      explain: `He is playing **Monopoly**. The car is his playing piece, the road is the board, and he has landed on an opponent's hotel and cannot pay the rent. Nobody has lost a real fortune. The puzzle works because we picture a real car, and “pushes” sounds like a breakdown rather than a dice roll.`,
      data: {
        answer: { text: ['monopoly', 'playing monopoly', 'a game of monopoly', 'he was playing monopoly', 'he is playing monopoly', 'board game', 'a board game', 'playing a board game', 'he was playing a board game', 'playing a game'] },
        traps: [{ match: ['a breakdown', 'broke down', 'he ran out of petrol', 'ran out of petrol', 'no petrol', 'out of petrol', 'ran out of gas', 'a flat tyre', 'he is broke'], msg: `A real breakdown would not leave him ruined by a hotel. What else is a car you can push around?` }],
        glyph: '🏨'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-forty-ten-dates', title: 'Forty Years, Ten Dates', diff: 2,
      source: 'A traditional puzzle.',
      text: `Gustav is 40 years old, and no calendar has been changed. Yet since the day he was born, the date of his birthday has appeared on the calendar only ten times.\n\nWhen is Gustav's birthday?`,
      hints: [`In 40 years there are 40 of almost every date. Which date is missing from most years?`, `Some dates are missing from three years out of every four.`],
      explain: `Gustav was born on **29 February**. That date exists only in leap years, once every four years, so in forty years it comes round just ten times. (The count of ten holds as long as the forty years do not cross 1900 or 2100, which are not leap years.)`,
      data: {
        ask: `When is Gustav's birthday?`,
        answer: { choice: 1, choices: [`31 December: the last day of the year is easy to lose`, `29 February`, `1 January: it falls in the middle of the holidays`, `He has moved house so often that the date has been missed`] },
        traps: [
          { match: 0, msg: `31 December appears in every single year. Which date does not?` },
          { match: 2, msg: `1 January appears in every single year. Which date does not?` },
          { match: 3, msg: `The question is about the calendar, not about where he lives. Which date appears only now and then?` }
        ],
        glyph: '📅'
      },
      concepts: ['lateral'], tags: ['calendar']
    },
    {
      id: 'lat-three-tablets', title: 'Three Tablets', diff: 2,
      source: 'A traditional trick question.',
      text: `A nurse hands you three tablets and says: “Take the first one right now, and then one more every 20 minutes until they are all gone.”\n\nHow many minutes pass between swallowing the first tablet and swallowing the last?`,
      hints: [`Draw a time line: the first tablet is at minute 0.`, `How many gaps are there between three tablets?`],
      explain: `**40 minutes.** Tablet one is at minute 0, tablet two at minute 20, tablet three at minute 40. Three tablets have only *two* gaps between them, so 2 × 20 = 40. The tempting 60 counts three gaps of 20 minutes, one for each tablet, but the first tablet is taken at once and nobody waits after the last one.`,
      data: {
        answer: { num: 40, unit: 'minutes' },
        traps: [{ match: 60, msg: `That counts three gaps. How many gaps are there between three tablets?` }],
        glyph: '💊'
      },
      concepts: ['lateral'], tags: ['trick question', 'counting']
    },
    {
      id: 'lat-coin-cork', title: 'Coin, Cork and Bottle', diff: 2,
      source: 'A traditional puzzle.',
      text: `A coin lies inside an empty wine bottle, and the bottle is stoppered with a cork. The coin is small enough to slip out through the neck if the cork were out of the way.\n\nHow can you get the coin out without pulling the cork out, without breaking the bottle and without making any hole in it?`,
      hints: [`You may not pull the cork out. Is there any other way to move a cork?`, `The neck is open and the cork is small enough to move. Push.`],
      explain: `Push the **cork in**, into the bottle. Once the cork is inside, the neck is clear and the coin can be tipped out. Nothing in the puzzle forbids pushing the cork the other way; we simply assume that a cork can only come out, because that is how we always open bottles.`,
      data: {
        ask: `How can you get the coin out?`,
        answer: { choice: 2, choices: [`Warm the bottle until the neck stretches enough for the coin to slip past the cork`, `Shake the bottle until the coin squeezes out beside the cork`, `Push the cork into the bottle, then tip the coin out through the open neck`, `Use a magnet on the glass to slide the coin up the neck`] },
        traps: [
          { match: 0, msg: `Glass hardly stretches at all. There is a simpler move that uses the cork itself.` },
          { match: 1, msg: `The cork fits the neck too closely for that. Think of another way to move the cork.` },
          { match: 3, msg: `Most coins are not magnetic, and even so the cork would still be in the way. Think about the cork.` }
        ],
        glyph: '🍾'
      },
      concepts: ['lateral'], tags: ['classic', 'physical']
    },
    {
      id: 'lat-bargain-45bc', title: 'A Bargain from 45 BC', diff: 2,
      source: 'A traditional puzzle.',
      text: `At a flea market a dealer offers you a small bronze coin at a very low price. On one side, in clear letters, it is stamped with the date **45 BC**. The dealer swears on his mother's life that it is perfectly genuine.\n\nWhy should you not buy it?`,
      hints: [`Think about what “BC” stands for, and when people started using it.`, `Would anyone living in the year 45 BC have known the meaning of the letters “BC”?`],
      explain: `The coin is a **fake**. “BC” means “before Christ”, and nobody who lived before Christ's birth could have known that the years would one day be counted backwards from it. The scheme of numbering years from the birth of Christ was worked out by the monk Dionysius Exiguus in Rome in about AD 525, and counting backwards from it came into use later still. A genuine coin of Caesar's time would carry the name of a ruler or a consul, not a date in “BC”.`,
      data: {
        ask: `What is wrong with the coin?`,
        answer: { text: ['a fake', 'fake', 'forgery', 'a forgery', 'forged', 'counterfeit', 'fake coin', 'it is a fake', 'not genuine', 'not real', 'it isn t real', 'it is not genuine', 'a fraud', 'fraud'] },
        traps: [{ match: ['too cheap', 'it is stolen', 'stolen', 'too worn', 'worn', 'too small', 'too new'], msg: `That may be true of many coins. Is there anything in the date itself that a coin of 45 BC could not have?` }],
        glyph: '🪙'
      },
      concepts: ['lateral'], tags: ['classic', 'history']
    },
    {
      id: 'lat-ladder-and-tide', title: 'The Ladder and the Tide', diff: 2,
      source: 'A traditional trick question.',
      text: `A cruise ship lies at anchor in a harbour, floating freely. A rope ladder hangs down her side, and its lowest rung just touches the water. The rungs are 30 cm apart, and the tide is coming in at 60 cm every hour.\n\nAfter three hours of rising tide, how many rungs of the ladder are under the water?`,
      hints: [`The tide rises 180 cm in three hours. But is the ladder fixed to something that stays put?`, `What does a floating ship do when the water beneath her rises?`],
      explain: `**None.** The ship floats, so she rises with the tide, and the ladder, which hangs from her side, rises with her. Its lowest rung is still just touching the water. The sum 180 ÷ 30 = 6 works only for a ladder fixed to a harbour wall or a quay that does not move.`,
      data: {
        ask: `How many rungs are under the water?`,
        answer: { choice: 1, choices: [`Six rungs`, `None`, `Three rungs`, `Nine rungs`] },
        traps: [
          { match: 0, msg: `That is the right sum for a ladder fixed to the harbour wall. But this one hangs from a ship.` },
          { match: 2, msg: `Work out the rise of the tide first, but then ask what the ship does when the tide rises.` },
          { match: 3, msg: `Work out the rise of the tide first, but then ask what the ship does when the tide rises.` }
        ],
        glyph: '⚓'
      },
      concepts: ['lateral'], tags: ['trick question', 'physical']
    },
    {
      id: 'lat-ten-floors-on-foot', title: 'Ten Floors on Foot', diff: 2,
      source: 'A traditional puzzle, told in many versions.',
      text: `Zoe is seven and lives on the 24th floor of a tower block. Every morning she rides the lift from her floor to the ground. In the afternoon, when she comes home, she rides up only as far as the 14th floor and climbs the stairs for the last ten floors. On rainy days, though, she rides all the way up to the 24th.\n\nThe lift works perfectly, nobody else presses buttons for her, and she is not doing it for exercise.\n\nWhat is the most likely explanation?`,
      hints: [`Going down is easy for her. Going up, something stops her at the 14th floor. What could it be, in a lift?`, `On rainy days she has something with her that she does not have on dry ones.`],
      explain: `Zoe is too small to reach the buttons above the 14th floor. On rainy days she has an **umbrella** with her, and she uses the tip of it to press the top button. Going down is no trouble, because the ground-floor button is the lowest. Any long object would do, but only in the rain does she happen to be carrying one.`,
      data: {
        ask: ASK,
        answer: { choice: 3, choices: [`On rainy days she carries heavy shopping from the car and cannot face climbing the last ten floors`, `She stops off on the 14th floor to see a friend, but she skips the visit on rainy days`, `The lift is set to go up to the 24th floor only when the weather outside is wet, to save power`, `She can only reach the buttons up to the 14th floor, but on rainy days her umbrella gives her the extra reach`] },
        traps: [
          { match: 0, msg: `Why would the weather change how much shopping she carries? Look for something that depends on the rain.` },
          { match: 1, msg: `She still goes home every day. What stops her reaching the 24th on dry days?` },
          { match: 2, msg: `The story says the lift works perfectly. Something about Zoe, not the lift, changes.` }
        ],
        glyph: '🛗'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-where-trains-pass', title: 'Where the Trains Pass', diff: 2,
      source: 'A traditional puzzle.',
      text: `Two express trains leave at the same moment, one from Northville and one from Southton, and race towards each other on a straight double track. The train from Northville is much faster than the train from Southton.\n\nAt the moment they pass each other, which of the two trains is nearer to Northville?`,
      hints: [`Picture the exact instant they pass. Where is each train?`, `How far apart are two trains that are passing each other?`],
      explain: `**Neither: they are exactly the same distance from Northville.** At the instant they pass, both trains are at the same spot, side by side. The speeds decide where along the line that spot is (much nearer Southton if the northern train is much faster), but not the fact that the two trains are in the same place.`,
      data: {
        ask: `Which of the two trains is nearer to Northville?`,
        answer: { choice: 0, choices: [`Neither: they are the same distance from it`, `The train from Northville`, `The train from Southton`, `It depends on how much faster the northern train is`] },
        traps: [
          { match: 1, msg: `Picture the exact instant they pass each other. Where is each train then?` },
          { match: 2, msg: `Picture the exact instant they pass each other. Where is each train then?` },
          { match: 3, msg: `The speeds decide where they meet. But at the moment they meet, where is each train?` }
        ],
        glyph: '🚆'
      },
      concepts: ['lateral'], tags: ['trick question', 'physical']
    },
    {
      id: 'lat-ball-comes-back', title: 'The Ball That Comes Back', diff: 2,
      source: 'A traditional puzzle.',
      text: `Sara says she can throw a tennis ball so that it flies a short way, stops in mid-air, and then comes back to her hand. It touches nothing on the way, there is no string or elastic, nobody else handles it, and she uses no spin or trick of the wrist: an ordinary throw, in still air.\n\nHow does she do it?`,
      hints: [`The ball does not have to travel *sideways*. In which other direction can you throw?`, `Something pulls every thrown ball back down.`],
      explain: `She throws it **straight up**. It rises, slows, stops for an instant at the top, and gravity brings it back down to her hand. The puzzle steers us into picturing a throw that goes *away* from the thrower, and then a boomerang or a rebound, when a ball thrown upward simply obeys gravity.`,
      data: {
        ask: `How does she do it?`,
        answer: { choice: 3, choices: [`She throws it very hard, so that it bounces back off the air`, `She spins it like a top as she lets go of it`, `She throws it in a high arc and then runs to meet it`, `She throws it straight up into the air`] },
        traps: [
          { match: 0, msg: `Air is not a wall. What pulls a ball down when it stops going up?` },
          { match: 2, msg: `A ball thrown in a high arc flies on and comes down far from where it started: it does not come *back*. Which direction sends it to the same place?` },
          { match: 1, msg: `A spinning ball still flies where it is thrown. Which direction would make it return on its own?` }
        ],
        glyph: '🎾'
      },
      concepts: ['lateral'], tags: ['classic', 'physical']
    },
    {
      id: 'lat-temple-doors', title: 'Three Doors of the Temple', diff: 2,
      source: 'A traditional puzzle, told in many versions.',
      text: `A treasure hunter is trapped in a ruined temple and must escape through one of three doors.\n\nBehind the first door is a corridor full of roaring flames. Behind the second is a hall where a dozen archers stand with their bows drawn, watching the door. Behind the third is a courtyard with two lions, which have not been fed for three years.\n\nWhich door should he take?`,
      hints: [`Take each door in turn and ask whether the danger behind it is still there.`, `How long can a lion live without food?`],
      explain: `The **third door**. No lion can live three years without eating, so the lions in the courtyard died long ago. Flames and archers are dangers that are alive and ready for him. The trick is to test each threat, not just be afraid of the fiercest-sounding one.`,
      data: {
        ask: `Which door should he take?`,
        answer: { choice: 2, choices: [`The first door, with the flames`, `The second door, with the archers`, `The third door, with the lions`] },
        traps: [
          { match: 0, msg: `Flames are as deadly as they sound. Which of the three dangers could no longer be there?` },
          { match: 1, msg: `Archers who are ready and waiting are as deadly as they sound. Which of the three dangers could no longer be there?` }
        ],
        glyph: '🚪'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-stuck-under-bridge', title: 'Stuck Under the Bridge', diff: 2,
      source: 'A traditional tale, told of many towns.',
      text: `A delivery lorry tries to squeeze under a low railway bridge and jams itself tightly, wedged from the roof down. It cannot move forward or back. The driver, the police and the council's engineers argue for an hour about whether to saw off the lorry's roof or to knock down part of the bridge, while the traffic backs up for a mile.\n\nAt last a small boy on his way home from school looks at the scene and makes a suggestion that frees the lorry without harming it or the bridge.\n\nWhat does he suggest?`,
      hints: [`The lorry needs to be a little lower. What is the lorry standing on?`, `Rubber tyres are held up by something you can let out.`],
      explain: `He says: **let some air out of the tyres**. The lorry sinks a few centimetres on its flattened tyres, the roof comes free of the bridge, and the lorry drives out. The engineers were trying to change the lorry or the bridge, but the little boy changed the *gap* between them, with the most ordinary tool of all.`,
      data: {
        ask: `What does he suggest?`,
        answer: { choice: 3, choices: [`Pump the tyres up harder so that the lorry rides on its wheels`, `Take out the cargo, so that the lorry sits lighter`, `Ask a second lorry to push it through`, `Let some air out of the tyres`] },
        traps: [
          { match: 0, msg: `Harder tyres would make the lorry taller, not shorter. Which way do you want the roof to move?` },
          { match: 1, msg: `A lighter lorry sits higher on its springs, not lower. Which way do you want the roof to move?` },
          { match: 2, msg: `It is jammed too tightly for that, and pushing risks the roof. Look for a way to make the lorry lower.` }
        ],
        glyph: '🚚'
      },
      concepts: ['lateral'], tags: ['classic', 'physical']
    },
    {
      id: 'lat-last-apple', title: 'The Last Apple', diff: 2,
      source: 'A traditional puzzle.',
      text: `Eight guests arrive at a party, and a basket on the table holds exactly eight apples. Each guest takes one apple, and every one of the eight gets one. Yet when all the guests have been served, one apple is still in the basket.\n\nNobody put an apple back, nobody shared or cut one, and no ninth apple turned up.\n\nHow could this happen?`,
      hints: [`Each guest took exactly one apple. Did the guest take *only* an apple?`, `Where is the basket at the end?`],
      explain: `The last guest took the **basket** as well, with its last apple still inside it. Every guest took one apple, and one apple stayed “in the basket”, but nobody said the basket stayed on the table. It is a nice example of an answer that does not break any rule of the story at all.`,
      data: {
        ask: ASK,
        answer: { choice: 0, choices: [`The last guest took the basket, with its apple still in it`, `One guest took two apples and another took none`, `One of the eight apples was made of wax`, `A ninth apple was hidden under the others`] },
        traps: [
          { match: 1, msg: `The story says each guest took exactly one, and every one of the eight got one.` },
          { match: 2, msg: `Nothing in the story suggests one was fake. Try to picture the scene at the moment the last guest leaves.` },
          { match: 3, msg: `The story says no ninth apple turned up. So think about the basket instead.` }
        ],
        glyph: '🧺'
      },
      concepts: ['lateral'], tags: ['classic', 'counting']
    },
    {
      id: 'lat-socks-in-the-dark', title: 'Socks in the Dark', diff: 2,
      source: 'A traditional puzzle.',
      text: `A wardrobe drawer holds a jumble of loose socks, black ones and white ones, plenty of each. It is pitch dark, and you cannot tell the socks apart by feel.\n\nWhat is the smallest number of socks you must take out to be *certain* of holding a matching pair (two of the same colour)?`,
      hints: [`With two socks you might be unlucky. Could they be different colours?`, `There are only two colours. Sooner or later a colour has to repeat.`],
      explain: `**Three.** Two socks can be one black and one white, but a third sock must match one of them, because there are only two colours to choose from. This is the pigeonhole principle: put three socks into two colour-boxes and some box holds two.`,
      data: {
        answer: { num: 3 },
        traps: [{ match: 2, msg: `Two could be one of each colour. What would it take to be *certain*?` }],
        glyph: '🧦'
      },
      concepts: ['pigeonhole', 'lateral'], tags: ['classic', 'counting']
    },
    {
      id: 'lat-ten-heads', title: 'Ten Heads in a Row', diff: 2,
      source: 'A traditional puzzle on the gambler\'s fallacy.',
      text: `Ben tosses a perfectly fair coin and gets heads ten times in a row. He is about to toss it an eleventh time.\n\nWhat is the chance that the eleventh toss lands heads?`,
      hints: [`Does a coin remember what it did last time?`, `The coin is fair, and each toss is separate from the one before it.`],
      explain: `**Exactly a half.** A fair coin has no memory, so the earlier tosses have no influence on the next one; tails is never “due”. The chance of ten heads in a row was tiny in the first place (1 in 1024), but that is a different question from what happens *next*. (In real life a run of ten heads would make you suspect the coin was not fair, but the puzzle says it is.)`,
      data: {
        ask: `What is the chance that the eleventh toss lands heads?`,
        answer: { choice: 2, choices: [`Much smaller than a half: tails is overdue`, `Much bigger than a half: the coin clearly favours heads`, `Exactly a half`, `It is impossible to say`] },
        traps: [
          { match: 0, msg: `The coin has no memory: it cannot know what came before, so nothing is “owed”.` },
          { match: 1, msg: `The puzzle says the coin is perfectly fair, so you cannot blame the coin.` },
          { match: 3, msg: `It can be said exactly, because the coin is stated to be fair.` }
        ],
        glyph: '🪙'
      },
      concepts: ['probability', 'lateral'], tags: ['probability', 'trick question']
    },
    {
      id: 'lat-fifty-pence-a-digit', title: 'Fifty Pence a Digit', diff: 3,
      source: 'A traditional puzzle.',
      text: `In a hardware shop Kai asks the owner how much a certain item costs. The owner, who likes to tease, answers:\n\n“Seven is fifty pence. Twelve is a pound. A hundred and twenty-three is a pound fifty. A thousand is two pounds.”\n\nWhat is the owner selling?`,
      hints: [`The price does not depend on how *big* the number is. What does it depend on?`, `Count the digits in each number and compare with the prices.`],
      explain: `The owner sells **numerals for house doors**, at fifty pence for every digit. Seven has one digit, so 50p; twelve has two digits, so £1; 123 has three digits, so £1.50; and 1000 has four digits, so £2. Once you compare digits with prices, the pattern is exact, and no sale of nails or flowers by the box would fit all four prices.`,
      data: {
        ask: ASK,
        answer: { choice: 1, choices: [`Flowers, cheaper by the bunch`, `Door numbers, sold at fifty pence a digit`, `Nails, with a discount for bigger boxes`, `Screws, priced by weight`] },
        traps: [
          { match: 0, msg: `The prices do not behave like a bunch price. Look at the numbers themselves, not at what they might be counting.` },
          { match: 2, msg: `A discount would not give an exact step of 50p each time. Look at the numbers themselves for something that grows by one each time.` },
          { match: 3, msg: `Weight would not explain why seven costs 50p while a thousand costs only £2. Look at the numbers themselves.` }
        ],
        glyph: '£'
      },
      concepts: ['lateral', 'deduction'], tags: ['classic', 'situation']
    },

    /* ---------- tricky: a leap is needed ---------- */
    {
      id: 'lat-two-strings', title: 'Two Cords and a Pair of Pliers', diff: 3,
      source: 'After a problem set by the psychologist Norman Maier in his experiments on reasoning in the early 1930s.',
      text: `Two cords hang from the ceiling of a bare workshop, each fixed firmly at the top. They are so far apart that if you hold the end of one, you cannot reach the other, however much you stretch. You must not cut them or take them down.\n\nOn the bench in the middle of the room lies a pair of pliers, and nothing else you can use.\n\nHow do you tie the two ends together?`,
      hints: [`You cannot go to the second cord. Could the second cord be made to come to you?`, `A cord with a weight at its end is a pendulum.`],
      explain: `Tie the **pliers to the end of one cord** and set it swinging like a pendulum. Then take the other cord in your hand, walk to the middle, catch the swinging cord as it comes towards you, and tie the two together.\n\nThe pliers are only a tool for cutting or gripping in our heads, and until we see them as a *weight* the puzzle looks impossible. Maier found that many people needed a hint before they saw it.`,
      data: {
        ask: `How do you tie the two ends together?`,
        answer: { choice: 1, choices: [`Stretch one cord as far as it will go, while you reach for the other with your free hand`, `Tie the pliers to one cord, set it swinging, and catch it as it swings while holding the other cord`, `Stand on the bench and jump for the second cord`, `Use the pliers to cut one cord short, then knot it onto the other`] },
        traps: [
          { match: 0, msg: `The cords do not stretch enough. You cannot bring yourself to the second cord, so think about bringing the second cord to you.` },
          { match: 2, msg: `The bench does not bring the cords any closer together. Think about making the second cord come to you.` },
          { match: 3, msg: `The puzzle forbids cutting. Think about what else the pliers could do for you.` }
        ],
        figure: {
          w: 400, h: 220,
          svg: '<line x1="30" y1="26" x2="370" y2="26" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/><line x1="110" y1="30" x2="110" y2="150" stroke="' + RED + '" stroke-width="3.5"/><line x1="290" y1="30" x2="290" y2="150" stroke="' + BLUE + '" stroke-width="3.5"/><line x1="122" y1="110" x2="278" y2="110" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="5 4"/><text x="200" y="102" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">too far to hold both</text><rect x="150" y="180" width="100" height="14" rx="3" fill="#c9b48a" stroke="' + INK + '" stroke-width="2"/><path d="M185 176 L215 168 M185 168 L215 176" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><text x="200" y="212" text-anchor="middle" font-size="14" ' + FONT + ' fill="' + INK + '">a pair of pliers on the bench</text>'
        },
        glyph: '🪢'
      },
      concepts: ['lateral'], tags: ['psychology', 'insight']
    },
    {
      id: 'lat-candle-on-the-wall', title: 'The Candle and the Drawing Pins', diff: 3,
      source: 'After the candle problem of the psychologist Karl Duncker, from his studies of problem-solving (published in German in 1935 and in English in 1945).',
      text: `You have to fix a candle to a cork-board wall so that it can burn at head height without dripping any wax on the table beneath it. On the table are just three things: the candle, a book of matches, and a small cardboard box full of drawing pins.\n\nHow do you do it?`,
      hints: [`Look at each object and ask what else it could be besides what it looks like. A box is more than a container of pins.`, `Something has to catch the wax and hold the candle, and it must be fixed to the wall.`],
      explain: `Tip out the pins, **pin the empty box to the wall** and stand the candle in it. The box becomes a little shelf that holds the candle and catches the wax.\n\nExperiments in the tradition of Duncker's have shown that people find this much harder when the pins are *inside* the box, because a box that holds pins is “a container”, and we do not see it as a shelf. Psychologists call this functional fixedness. (Melting the candle to stick it to the wall does not work: the wax will not hold it.)`,
      data: {
        ask: `How do you do it?`,
        answer: { choice: 2, choices: [`Melt some wax and stick the candle to the wall with it`, `Push several pins through the candle's side into the board`, `Empty the box, pin it to the wall, and stand the candle in it`, `Lay the candle in the box on the table and hope for the best`] },
        traps: [
          { match: 0, msg: `Melted wax will not hold a candle to a wall for long, and it will drip. Look at the box.` },
          { match: 1, msg: `Pins would split the candle, and the wax would still drip onto the table. What could catch it?` },
          { match: 3, msg: `The candle must be fixed to the wall, not lying on the table. Which of the objects could be fixed to it?` }
        ],
        glyph: '🕯'
      },
      concepts: ['lateral'], tags: ['psychology', 'insight']
    },
    {
      id: 'lat-cabin-south', title: 'The Cabin with Four South Walls', diff: 3,
      source: 'A traditional puzzle.',
      text: `An architect designs a peculiar cabin: every one of its four walls faces south. One afternoon a bear ambles past the cabin.\n\nWhat colour is the bear?`,
      hints: [`Where on Earth could every wall of a house face south?`, `At one place on the planet, every direction is south.`],
      explain: `**White.** The only place where all four walls of a house can face south is the North Pole, where every direction points south. And the only bears found there are polar bears. (The South Pole would make every wall face north, and no bears live in the Antarctic.)`,
      data: {
        answer: { text: ['white', 'a white bear', 'white bear', 'polar bear', 'a polar bear', 'it is a polar bear', 'it is white', 'the bear is white'] },
        traps: [{ match: ['brown', 'black', 'grizzly', 'brown bear', 'black bear', 'a brown bear', 'a black bear', 'grey', 'panda'], msg: `Those bears live a long way from any place where such a cabin could stand. Where on Earth would every wall face south?` }],
        glyph: '🐻‍❄️'
      },
      concepts: ['lateral'], tags: ['classic', 'geography']
    },
    {
      id: 'lat-broken-match', title: 'Half a Match', diff: 3,
      source: 'A traditional puzzle, told in many versions.',
      text: `Rescuers searching a desert find a man lying beside a dune, bruised and exhausted but alive. In one hand he clutches half of a snapped match, never lit. He is alone: there are no vehicle tracks, no footprints leading to or from him, no tent and no fire.\n\nA friend was with him earlier that day, and the friend is nowhere to be found.\n\nWhat is the most likely explanation?`,
      hints: [`No footprints and no tracks: how could he have reached this spot without leaving any?`, `Think of how a short match can decide something between two people, and of what may have needed to be lightened.`],
      explain: `The two friends were flying over the desert in a **hot-air balloon** that began to sink. To make it lighter, one of them had to jump out, and they drew matches to decide who: the man drew the short one, jumped out a little above the sand, and was bruised but not badly hurt, while his friend flew on. The short match in his fist, the lack of any tracks and the missing friend all point the same way.`,
      data: {
        ask: ASK,
        answer: { choice: 0, choices: [`They were in a sinking hot-air balloon; they drew matches, and he drew the short one and had to jump`, `He struck a match to light a signal fire for rescuers, and it snapped in his hand before it lit`, `He was using the match to test which way the wind was blowing, and it broke as he held it up`, `The match was a lucky charm from his friend, who has gone ahead across the desert by camel`] },
        traps: [
          { match: 1, msg: `A signal fire would leave ashes and smoke. And how did he arrive without leaving any footprints or tracks?` },
          { match: 2, msg: `That would not explain why he has no footprints, or where his friend is.` },
          { match: 3, msg: `If the friend went ahead by camel, there would be camel tracks. How did the man arrive with none at all?` }
        ],
        glyph: '🎈'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-five-games-each', title: 'Five Games Each', diff: 3,
      source: 'A traditional puzzle.',
      text: `Ada and Bo each play exactly five games of draughts one afternoon. No game is drawn, none is abandoned, and nobody cheats. At the end of the afternoon Ada has won three of her games and Bo has won three of his.\n\nHow is that possible?`,
      hints: [`If Ada and Bo played only each other, how many wins would five games contain in all?`, `Do the two players have to be each other's opponent?`],
      explain: `They were **not playing each other**, or not only each other. If they had played only each other, there would have been just five games and five winners in all, but three wins each would make six. So at least some of their games were against other people.`,
      data: {
        ask: ASK,
        answer: { choice: 1, choices: [`They played each other, and one game was counted for both of them`, `They were not playing each other: each played five games against other opponents`, `They played six games, and the sixth was a draw`, `One win each was awarded for good behaviour`] },
        traps: [
          { match: 0, msg: `If they played each other, every game has just one winner. How many wins are there in five games?` },
          { match: 2, msg: `The story says each played exactly five games, and none was drawn.` },
          { match: 3, msg: `The story says the wins were won at the board. Look at who the opponents could be.` }
        ],
        glyph: '♟'
      },
      concepts: ['lateral', 'deduction'], tags: ['classic', 'counting']
    },
    {
      id: 'lat-nuts-in-the-drain', title: 'Four Nuts Down the Drain', diff: 3,
      source: 'A traditional puzzle.',
      text: `On a lonely road Idris gets a flat tyre. He jacks the car up, undoes the four nuts that hold the wheel on, and puts them on the kerb. A careless kick sends all four into a storm drain, out of reach for ever. The nearest garage is a long way off. He has a good spare wheel in the boot, but no spare nuts.\n\nHow can he get to the garage safely?`,
      hints: [`He needs nuts from somewhere. Where on the car are there plenty of nuts of the right size?`, `Three other wheels are still in place, each held on by four nuts.`],
      explain: `He takes **one nut from each of the other three wheels** and uses those three to fit the spare. Every wheel on the car is now held by three nuts instead of four, which is plenty to limp to a garage at low speed. (Three nuts on each wheel is not what a mechanic would like, so he should buy new ones at once.)`,
      data: {
        ask: `How can he get to the garage safely?`,
        answer: { choice: 3, choices: [`Balance the spare wheel on the bare studs and drive very slowly to the garage`, `Wedge the spare wheel in place with flat stones picked up from the roadside`, `Tie the spare wheel on firmly with the tow rope from the boot`, `Take one nut from each of the other three wheels and fit those three to the spare`] },
        traps: [
          { match: 0, msg: `A wheel with no nuts can come off at any speed. Where could he find some nuts?` },
          { match: 1, msg: `Stones will not hold a wheel on. Where on the car could he find some nuts?` },
          { match: 2, msg: `A rope will not hold a spinning wheel. Where on the car could he find some nuts?` }
        ],
        glyph: '🔩'
      },
      concepts: ['lateral'], tags: ['classic', 'physical']
    },
    {
      id: 'lat-melting-ice', title: 'The Glass at the Brim', diff: 3,
      source: 'A traditional puzzle.',
      text: `A glass is filled to the very brim with cold water, and a large ice cube floats in it, with a good part of the cube sticking up above the rim. The room is warm, and the ice slowly melts.\n\nWhat happens to the water in the glass as the ice melts?`,
      hints: [`A floating object pushes aside its own *weight* of water.`, `The ice turns into water of the same weight. How much room does that water need?`],
      explain: `**The level stays exactly the same: the glass does not overflow.** A floating cube pushes aside as much water as it weighs, and when it melts it becomes that same weight of water, which needs exactly the room the cube was displacing. So the meltwater fills the hollow the cube was pressing into the water, and nothing more. (The part sticking up above the rim is no problem, for the same reason.)`,
      data: {
        ask: `What happens to the water level as the ice melts?`,
        answer: { choice: 1, choices: [`The glass overflows`, `The level stays exactly where it is`, `The level sinks below the brim`, `It depends how big the cube is`] },
        traps: [
          { match: 0, msg: `Ice does expand when water freezes, but this ice is already floating. How much water does a floating object push aside?` },
          { match: 2, msg: `The ice shrinks as it melts, but what happens to the water it becomes?` },
          { match: 3, msg: `The same rule holds for any size of floating cube. Think about weight, not size.` }
        ],
        glyph: '🧊'
      },
      concepts: ['lateral'], tags: ['physical', 'water']
    },
    {
      id: 'lat-three-switches', title: 'Three Switches, One Visit', diff: 3,
      source: 'A traditional puzzle.',
      text: `An electrician stands in the corridor of a village hall, in front of three switches on the wall. One of them works the old filament bulb in a windowless storeroom at the end of the corridor; the other two are connected to nothing at all. The storeroom door is shut, and the bulb cannot be seen from outside. The electrician may go into the storeroom just **once**.\n\nHow can he find out which switch controls the bulb?`,
      hints: [`A switch that has been on for a while leaves a trace even after it is off. What kind of trace does an old-fashioned bulb leave?`, `Use the first switch to warm the bulb, then turn it off and use the second. The visit will tell you three things.`],
      explain: `He turns the **first switch on for a few minutes**, turns it off, turns the **second** on, and walks in. If the bulb is lit, the second switch is the one; if it is dark but warm to the touch, the first switch is the one; if it is dark and cold, it is the third.\n\nOne look gives two facts (lit or dark, warm or cold), which is enough to tell three switches apart. The story says “old filament bulb” because a modern LED barely warms up and would not give the trick away.`,
      data: {
        ask: `How can he find out which switch controls the bulb?`,
        answer: { choice: 3, choices: [`Switch all three on, then go into the storeroom and see which of them has lit the bulb`, `Try the first switch and go in; if the bulb is dark, try the next switch on a second visit`, `Flick each switch on and off in turn, and listen for a click from the storeroom`, `Leave the first switch on for a few minutes, turn it off, turn the second on, and go in to look and to feel`] },
        traps: [
          { match: 0, msg: `That shows the bulb is on, but not which of the three switches did it.` },
          { match: 2, msg: `The click of the switch is at the wall, not in the storeroom. Look for something the bulb does that you can feel.` },
          { match: 1, msg: `He may go in only once. Find a way to learn more from one visit.` }
        ],
        glyph: '💡'
      },
      concepts: ['lateral', 'deduction'], tags: ['classic', 'physical']
    },
    {
      id: 'lat-damp-strongroom', title: 'The Damp Strongroom', diff: 3,
      source: 'A traditional puzzle, told in many versions.',
      text: `A thief breaks into a locked strongroom with a bare stone floor and smooth walls. High on a shelf, far out of reach of anyone standing on the floor, sat a casket of pearls. The room holds no ladder, chair, crate or furniture of any kind.\n\nNext morning the curator finds the casket gone and the door locked again. The room is as bare as ever, apart from a small puddle of water on the floor below the shelf. The rest of the room is dry, and there is no leak.\n\nWhat did the thief stand on to reach the shelf?`,
      hints: [`Where can a puddle come from in a dry room? Something that was solid at night and is not any more.`, `It was brought in, used as a step, and then simply went away by itself in the warmth.`],
      explain: `He stood on a **block of ice**. Something solid and sturdy enough to climb on was brought in, and by morning it had melted into a puddle, leaving no ladder or crate as evidence. The puddle is the only trace. (The same idea is behind many old detective stories, and it works best in warm weather.)`,
      data: {
        answer: { text: ['ice', 'a block of ice', 'block of ice', 'ice block', 'a large block of ice', 'a big block of ice', 'blocks of ice', 'ice blocks', 'an ice block', 'ice cube', 'ice cubes', 'a large ice block', 'stood on ice', 'stood on a block of ice', 'he stood on a block of ice', 'frozen water'] },
        traps: [{ match: ['a ladder', 'ladder', 'a chair', 'chair', 'a box', 'a crate', 'a rope', 'his friend', 'an accomplice', 'a helper', 'a stool'], msg: `Nothing like that is left in the room, and there was none to begin with. Where might the puddle come from?` }],
        glyph: '💧'
      },
      concepts: ['lateral'], tags: ['classic', 'situation']
    },
    {
      id: 'lat-two-guards-one-question', title: 'Two Guards, One Question', diff: 4,
      source: 'A traditional puzzle, also retold in the film Labyrinth (1986).',
      text: `A traveller reaches a fork in the road and finds a guard standing at each branch. One road leads to the city, and the other to a dead end. One guard always tells the truth and the other always lies, but nobody knows which is which. Both guards know everything, including which road leads where and what the other guard is.\n\nThe traveller may ask **one** question, to **one** of the guards. Which question guarantees that he can find the road to the city?`,
      hints: [`If you knew which guard was the liar, you could ask an ordinary question and do the opposite. Since you do not, try to build a question to which both guards give the same wrong answer.`, `Ask a guard about what the *other* guard would say. Work out which road each guard would then point to.`],
      explain: `Ask either guard: **“Which road would the other guard say leads to the city?”**, and then take the opposite road.\n\nIf you asked the truth-teller, he truthfully reports what the liar would say, which is the wrong road. If you asked the liar, he lies about what the truth-teller would say, and so also names the wrong road. Either way the road you are pointed to is the dead end, so you take the other.\n\nThe tempting question, “Are you the liar?”, tells you nothing: both guards say no.`,
      data: {
        ask: `Which question guarantees that he finds the road to the city?`,
        answer: { choice: 2, choices: [`Ask either guard: “Which road leads to the city?”, and take the road he points to`, `Ask either guard: “Are you the liar?”, and go by what he answers`, `Ask either guard: “Which road would the other guard say leads to the city?”, and take the opposite road`, `Ask either guard: “Is the other guard a truth-teller?”, and act on the answer`] },
        traps: [
          { match: 0, msg: `One guard would give you the right road and the other the wrong one, and you would not know which of them you asked.` },
          { match: 1, msg: `Both guards would answer “No”, so you learn nothing at all. Try a question that involves both guards.` },
          { match: 3, msg: `Both guards would answer “No” here, so the answer tells you nothing about the roads.` }
        ],
        glyph: '⑂'
      },
      concepts: ['truth-logic', 'deduction', 'lateral'], tags: ['classic', 'logic']
    },
    {
      id: 'lat-paper-kettle', title: 'The Paper Kettle', diff: 3,
      source: 'A traditional puzzle and a favourite classroom experiment.',
      text: `Tomas holds a small paper cup, half full of water, over a gas burner. The paper is thin and dry on the outside, and the flame licks the bottom of the cup.\n\nWhat happens?`,
      hints: [`Paper burns when it gets hot enough. Is anything taking heat away from the paper?`, `Water on the other side of the paper soaks up the heat of the flame.`],
      explain: `The water gets hotter and can even be brought **to the boil**, while the paper does not catch fire. Water carries heat away from the paper so well that the part of the cup touching it cannot get much above 100 °C, far below the roughly 230 °C at which paper burns. (Keep the flame under the water, not above the waterline, and never let the cup run dry.)`,
      data: {
        ask: `What happens?`,
        answer: { choice: 3, choices: [`The paper burns through within seconds, and the water puts out the flame`, `The flame is far too weak to warm even a little water`, `The paper melts like plastic and drips into the water below`, `The water heats up, and can even boil, while the paper does not catch fire`] },
        traps: [
          { match: 0, msg: `Dry paper does burn when it gets hot enough. But is anything taking heat away from this paper?` },
          { match: 1, msg: `A gas flame is far hotter than boiling water. Think about where its heat goes.` },
          { match: 2, msg: `Paper does not melt: it burns or it does not. What keeps it cool here?` }
        ],
        glyph: '🥤'
      },
      concepts: ['lateral'], tags: ['physical', 'water']
    },
    {
      id: 'lat-mislabelled-sacks', title: 'The Prankster and the Sacks', diff: 3,
      source: 'A traditional puzzle.',
      text: `A grocer has three sacks. One holds only coffee beans, one holds only tea leaves and one holds a mixture of both. They are labelled “Coffee”, “Tea” and “Mixed”, but a prankster has moved the labels so that **every label is wrong**.\n\nYou may take one scoop from one sack, and look at it. You may not look into the other sacks. Which sack should you open in order to be able to fix all three labels?`,
      hints: [`Each label is wrong. What does that tell you about the sack marked “Mixed”?`, `If the “Mixed” sack cannot be the mixture, it must be one of the pure ones, and one scoop tells you which.`],
      explain: `Open the sack labelled **“Mixed”**. Its label is wrong, so it is pure: whatever the scoop shows, coffee or tea, is what the whole sack holds. Say it is coffee. Then the sack marked “Tea” cannot be tea (its label is wrong) or coffee (that is the sack you opened), so it is the mixture, and the sack marked “Coffee” is the tea.\n\nOpening either of the other sacks would leave two possibilities: a scoop of tea from the sack marked “Coffee” could come from pure tea or from the mixture.`,
      data: {
        ask: `Which sack should you open?`,
        answer: { choice: 2, choices: [`The sack labelled “Coffee”`, `The sack labelled “Tea”`, `The sack labelled “Mixed”`, `Any of them: one scoop always does it`] },
        traps: [
          { match: 0, msg: `A scoop from that sack could be pure tea or the mixture, and you could not tell which. Which sack is certain to be pure?` },
          { match: 1, msg: `A scoop from that sack could be pure coffee or the mixture, and you could not tell which. Which sack is certain to be pure?` },
          { match: 3, msg: `Try it: which sack would leave you with two possibilities after one scoop?` }
        ],
        glyph: '☕'
      },
      concepts: ['deduction', 'lateral'], tags: ['classic', 'logic']
    },
    {
      id: 'lat-slowest-horse', title: 'The Slowest Horse Wins', diff: 3,
      source: 'A traditional tale, told in many lands.',
      text: `A rich merchant, growing old, cannot decide which of his two sons should inherit the shop. He sets them a race to the next town, a day's ride away, with a twist: the son whose horse arrives **last** wins the shop. Each son must ride his own horse.\n\nBoth sons are so keen to win that they crawl along at a snail's pace. After two days they are still at the first milestone. A wise old woman happens by, hears the story, and tells them just two words. At once the sons leap into the saddle and gallop off as fast as they can.\n\nWhat did she say?`,
      hints: [`The rule says the son *whose horse* comes last wins. It does not say which son must ride it.`, `What if each brother sat on the other brother's horse?`],
      explain: `She said: **“Swap horses.”** Once each son sits on his brother's horse, he wins if the horse he *owns*, the one his brother is riding, comes in last. The surest way to make that happen is to gallop for town on the horse he is riding, and leave the other one behind. So both sons gallop, each trying to leave the other's horse behind, and the stalemate is over.`,
      data: {
        ask: `What did she tell them?`,
        answer: { choice: 3, choices: [`“Ride together at the same pace.”`, `“Go back and ask your father to change the rule.”`, `“Tie the two horses together.”`, `“Swap horses.”`] },
        traps: [
          { match: 0, msg: `That would leave the stalemate exactly as it is. They needed a reason to hurry.` },
          { match: 1, msg: `The rule stands. She found a way to make them race *within* the rule.` },
          { match: 2, msg: `Tied horses go nowhere fast. She gave them a reason to hurry, not a way to stay together.` }
        ],
        glyph: '🐎'
      },
      concepts: ['lateral'], tags: ['folk tale', 'incentive']
    },
    {
      id: 'lat-twins-two-birthdays', title: 'Twins with Two Birthdays', diff: 3,
      source: 'A traditional puzzle.',
      text: `Ines and Ilse are twin sisters, born to the same mother in the same hospital, only a few minutes apart. Yet their birth certificates show different birthdays, in two different years. Both certificates are perfectly correct, and nobody has made a mistake.\n\nHow is that possible?`,
      hints: [`They were born within minutes of each other. What is special about a few minutes on one particular night of the year?`, `Think of the last minutes of one year and the first minutes of the next.`],
      explain: `Ines was born a few minutes before midnight on **31 December**, and Ilse a few minutes after midnight, on **1 January** of the next year. The sisters have different birthdays and different years of birth, and each is entitled to her own party. (On paper Ilse is a whole year younger than Ines, though in fact she is only a few minutes younger.)`,
      data: {
        ask: ASK,
        answer: { choice: 1, choices: [`One was born abroad, where the calendar is different`, `One was born just before midnight on 31 December, and the other just after`, `One of them was adopted, so they are not really twins`, `Their parents chose the date that seemed luckier`] },
        traps: [
          { match: 0, msg: `They were born in the same hospital, minutes apart, so no calendar or time zone can separate them. What is special about a few minutes on one particular night?` },
          { match: 2, msg: `The story says they are twins, born to the same mother. Look for something about *when* they were born.` },
          { match: 3, msg: `A certificate records the real date of birth. So look for a real moment when a date and a year both change.` }
        ],
        glyph: '👯'
      },
      concepts: ['lateral'], tags: ['calendar', 'family']
    },
    {
      id: 'lat-monk-and-mountain', title: 'The Monk on the Mountain Path', diff: 4,
      source: 'A well-known puzzle of insight, often credited to the psychologist Karl Duncker.',
      text: `A monk sets out at sunrise on Monday to climb a steep mountain path to the temple at its top, and arrives at sunset. He spends the night in the temple. At sunrise on Tuesday he starts down the same path, and reaches the bottom at sunset. On each day he walks at whatever speeds he likes, rests wherever he likes, and even turns back now and then.\n\nIs there a spot on the path where he stands at exactly the same time of day on Monday and on Tuesday?`,
      hints: [`It does not depend on his speeds. Try to picture both journeys on a single day instead of two.`, `Two monks, one starting at the bottom and one at the top, both leaving at sunrise on the same path. What must happen?`],
      explain: `**Yes, there must be such a spot.** Imagine both journeys made on the *same* day by two monks: one starts at the bottom at sunrise and climbs, and the other starts at the top at sunrise and comes down, following the two days' timetables exactly. Travelling along the same path in opposite directions, they cannot avoid meeting. At the place and time they meet, the two are at the same spot at the same moment, which means that on the two real days the one monk stood at that spot at that time of day.\n\nThis is the “intermediate value” idea from mathematics in disguise, and it needs no arithmetic at all.`,
      data: {
        ask: `Is there such a spot?`,
        answer: { choice: 0, choices: [`Yes: such a spot must exist, whatever his speeds`, `Only if he walks at exactly the same speed on both days`, `Only if he rests in the same places on both days`, `No: he could easily avoid every such spot`] },
        traps: [
          { match: 1, msg: `It does not depend on his speeds. Try imagining both journeys on one day.` },
          { match: 2, msg: `It does not depend on where he rests. Try imagining both journeys on one day.` },
          { match: 3, msg: `Try imagining both journeys on one day, with a monk on each end of the path. Could they avoid each other?` }
        ],
        glyph: '⛰'
      },
      concepts: ['lateral'], tags: ['insight', 'classic']
    },
    {
      id: 'lat-nine-dots', title: 'Nine Dots, Fewest Lines', diff: 3,
      source: 'A traditional puzzle: the picture behind the phrase “thinking outside the box”.',
      text: `Nine dots are laid out in a square, three rows of three, as in the picture. You have to draw straight lines through all nine dots without lifting your pencil from the paper and without going back over a line you have drawn: each new line starts where the last one stopped.\n\nWhat is the smallest number of straight lines that can do the job?`,
      hints: [`Nothing says the lines have to stop at the edge of the square.`, `Three lines could cover nine dots only if each passed through three dots. Which lines through three dots exist, and can one stroke join them?`],
      explain: `**Four.** Start at the top-left dot and draw right along the top row, *past* the last dot into empty space. From there draw a slanting line down and to the left through the middle-right dot and the bottom-middle dot, ending below the bottom-left corner. Then go straight up the left-hand column through all three left dots. Finally draw a slanting line from the top-left dot through the centre to the bottom-right dot. All nine dots are on the path.\n\nThree cannot work: each line could touch at most three dots, so each would have to touch exactly three, and three lines with three dots each that do not share a dot are three parallel rows or columns, which no single stroke can join. (With a fat brush, a very large piece of paper or a fold, you can cheat down to one line, but that is a different game.)`,
      data: {
        ask: `What is the smallest number of straight lines?`,
        answer: { choice: 1, choices: [`Three`, `Four`, `Five`, `Six`] },
        traps: [
          { match: 0, msg: `Three lines would have to be three parallel rows or columns, and a single stroke cannot pass from one parallel line to the next along a straight line. Try again.` },
          { match: 2, msg: `There is a way with fewer. Nothing says the lines must stop at the edge of the square.` },
          { match: 3, msg: `There is a way with fewer. Nothing says the lines must stop at the edge of the square.` }
        ],
        figure: {
          w: 400, h: 220,
          svg: [50, 110, 170].map((y) => [140, 200, 260].map((x) => '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + INK + '"/>').join('')).join('')
        },
        glyph: '⁙'
      },
      concepts: ['lateral'], tags: ['classic', 'geometry', 'insight']
    },

    /* ---------- famous cleverness: stories of the wise ---------- */
    {
      id: 'lat-weighing-the-elephant', title: 'Weighing an Elephant', diff: 3,
      source: 'A story told of Cao Chong, a young son of the warlord Cao Cao, in the Records of the Three Kingdoms (Sanguozhi, 3rd century AD).',
      text: `In ancient China a great elephant was given as a gift to a powerful lord. Everyone in the court wanted to know how much it weighed, but no scale in the land could hold it, and nobody was willing to cut it up. The lord's youngest son, a boy of about six, found a way to weigh it without harming it.\n\nWhat did the boy do?`,
      hints: [`The elephant is far too heavy to lift. Could something else *hold* it up and show how heavy it is?`, `Think of what a boat does to the water when it is loaded.`],
      explain: `The boy had the elephant led onto a **boat** and marked on the hull how deep the boat sank. Then the elephant was taken off and the boat was loaded with stones until it sank to the same mark. The stones weighed exactly as much as the elephant, and they could be weighed in small lots on an ordinary scale.\n\nIt rests on the law of floating that we owe to Archimedes: a floating boat sinks until it has pushed aside its own weight in water, so equal sinking means equal weight.`,
      data: {
        ask: `What did the boy do?`,
        answer: { choice: 2, choices: [`He measured how deep its footprints sank in the mud and compared them with those of a man`, `He fed it a measured heap of grass and worked out its weight from how much it ate`, `He led it onto a boat, marked the waterline, then loaded the boat with stones to the same mark and weighed the stones`, `He asked the keeper how many bags of rice it weighed`] },
        traps: [
          { match: 0, msg: `That would give a very rough guess at best. Look for a way of *matching* the elephant's weight with something you can weigh.` },
          { match: 1, msg: `That would tell you about its appetite, not its weight. Look for something that matches its weight exactly.` },
          { match: 3, msg: `The keeper has no more idea than anyone else, or the court would not be asking. Think of something that can match the elephant's weight.` }
        ],
        glyph: '🐘'
      },
      concepts: ['lateral'], tags: ['folk tale', 'history', 'physical']
    },
    {
      id: 'lat-crown-and-bath', title: 'The Crown and the Bath', diff: 3,
      source: 'A story told by the Roman architect Vitruvius (1st century BC) about Archimedes and King Hiero of Syracuse; historians doubt some of the details.',
      text: `The king of Syracuse gave a goldsmith a lump of pure gold to make a crown. When the crown came back it weighed exactly the same as the gold that had been handed over, but a rumour went round that the goldsmith had kept some of the gold and made up the weight with silver. The crown was a beautiful piece and must not be melted, scratched or damaged in any way.\n\nHow could the king's scholar, Archimedes, find out whether it was pure gold?`,
      hints: [`Weighing has already been done and proves nothing. What else differs between gold and silver, other than colour and weight?`, `Silver is much lighter for its size than gold. So a silver-and-gold crown of the same weight is a little *bigger*. How could you compare sizes without measuring the crown's twists and curls?`],
      explain: `He could compare how much **water** the crown pushes aside with how much an equal weight of pure gold pushes aside. Silver is far less dense than gold (about 10.5 g per cubic centimetre, against 19.3), so any silver in the crown makes it bulkier for its weight, and it displaces more water.\n\nAccording to Vitruvius the idea came to Archimedes when he stepped into a full bath and saw the water spill over, and he ran home shouting “Eureka!” (“I have found it!”). Whether it happened just so is doubtful, but the method is sound.`,
      data: {
        ask: `How could Archimedes find out?`,
        answer: { choice: 0, choices: [`Compare how much water the crown pushes aside with how much an equal weight of pure gold pushes aside`, `Weigh the crown against an equal weight of pure gold on a very sensitive balance, and see whether the pans hang level`, `Rub the crown on a touchstone and look at the colour of the streak it leaves behind`, `Strike the crown and compare the note it rings with the note of a bell made of pure gold`] },
        traps: [
          { match: 1, msg: `They already weigh the same: that is why the king is suspicious. What else differs between gold and silver?` },
          { match: 2, msg: `The touchstone would scratch the crown, and the king said it must not be damaged. Look for a method that leaves it untouched.` },
          { match: 3, msg: `That would not reliably tell gold from a gold-silver mixture, and a strike might damage the crown. Think of another way to compare *bulk*.` }
        ],
        glyph: '👑'
      },
      concepts: ['lateral'], tags: ['history', 'physical']
    },
    {
      id: 'lat-birbals-line', title: 'A Shorter Line', diff: 2,
      source: 'A tale from the folklore of India about the emperor Akbar and his minister Birbal; the tale is folk story, not history.',
      text: `The emperor draws a line on the palace floor with a piece of chalk and calls his courtiers over. “Make this line shorter,” he says. “But you may not rub out any part of it, cut it, cover it or touch it in any way.” The courtiers frown and mutter. Then Birbal, the clever minister, steps forward with a piece of chalk and settles it in a moment.\n\nWhat does Birbal do?`,
      hints: [`He cannot change that line at all. Could something else change how we see it?`, `“Shorter” is a way of comparing. What could he draw beside it?`],
      explain: `Birbal **draws a longer line next to it**. The emperor's line has not been touched, but next to the new one it is now the shorter line. “Shorter” only ever means “shorter than something”, so changing the comparison does the job. Akbar, so the story goes, was delighted.`,
      data: {
        ask: `What does Birbal do?`,
        answer: { choice: 0, choices: [`He draws a much longer line beside it`, `He covers half of the line with a cloth`, `He steps far back, so the line looks shorter to him`, `He scratches a shorter line inside it`] },
        traps: [
          { match: 1, msg: `The emperor forbade covering it. He can do nothing to that line: find a way of changing what it is compared with.` },
          { match: 2, msg: `Going further away only makes it look smaller for a moment. Find a way of making it *shorter than something*.` },
          { match: 3, msg: `A short line inside a long one does not make the long one any shorter. Try drawing a line elsewhere.` }
        ],
        glyph: '📏'
      },
      concepts: ['lateral'], tags: ['folk tale', 'comparison']
    },
    {
      id: 'lat-egg-on-its-end', title: 'The Egg on Its End', diff: 2,
      source: 'A story told of Columbus, and told earlier by Giorgio Vasari (1550) of the architect Brunelleschi.',
      text: `At a dinner a guest scoffs that anyone could have done what he had done. “Very well,” says the host, “can you make an egg stand on its end on this table?” Every guest tries, and every egg topples over.\n\nThen the host picks up an egg and stands it upright on the table at once, without glue, without a stand, and without any trick of balance.\n\nHow does he do it?`,
      hints: [`The egg is not made with a flat end. Could the host change that?`, `A gentle tap on the table changes the shape of the end.`],
      explain: `He taps the egg's end down on the table so that the shell **cracks and flattens** at that end, and it stands. The point of the story is that once you have seen it, anyone can do it, but nobody thinks of it first, because everyone is trying to balance the egg as it is. Vasari tells the tale of Brunelleschi, when he was pressed to explain how he would build the dome of the cathedral in Florence; the same tale was afterwards told of Columbus.`,
      data: {
        ask: `How does the host do it?`,
        answer: { choice: 0, choices: [`He taps the egg's end on the table until the shell cracks and flattens`, `He spins the egg so fast that it stands up on its end while it turns`, `He waits until the egg settles by itself on its narrow end on a perfectly smooth table`, `He balances it on a little heap of sugar that he has poured onto the table`] },
        traps: [
          { match: 1, msg: `Spinning would work for a moment, but the egg would fall as soon as it slowed down. He needs it to stand still.` },
          { match: 2, msg: `An egg never settles on its narrow end by itself. Could the host change the egg?` },
          { match: 3, msg: `That would count as a stand. The host said he needs no stand. Could he change the egg itself?` }
        ],
        glyph: '🥚'
      },
      concepts: ['lateral'], tags: ['folk tale', 'history']
    },
    {
      id: 'lat-which-egg-is-raw', title: 'Which Egg Is Raw?', diff: 3,
      source: 'A traditional puzzle.',
      text: `Two eggs sit in a bowl in the kitchen. One was boiled hard this morning and the other is raw, but they look exactly alike, and the shells are clean and unmarked. You must tell which is which without cracking either shell and without making any mark.\n\nWhat is the best way?`,
      hints: [`One egg is solid all through, and the other is a shell full of liquid. Is there a way to make the difference show when they move?`, `Set each egg turning on the table like a top, and watch how it behaves.`],
      explain: `**Spin each egg on the table.** The hard-boiled egg is one solid body, so it spins smoothly, quickly and for a long time. The raw egg has liquid inside that does not turn along with the shell, so the egg wobbles, drags and soon stops. For a second test, touch a spinning egg briefly with your finger to stop it and let go at once: the hard-boiled one stays still, but the raw one starts to turn again, because the liquid inside is still moving.`,
      data: {
        ask: `What is the best way?`,
        answer: { choice: 0, choices: [`Spin each egg on the table, and watch which spins smoothly and which wobbles and stops`, `Weigh both eggs: the raw egg is always heavier`, `Tap each with a spoon and compare the notes`, `Put both in a bowl of water: the hard-boiled egg will sink and the raw egg will float`] },
        traps: [
          { match: 1, msg: `Cooking an egg does not change its weight noticeably. Look for a difference in how they *move*.` },
          { match: 2, msg: `The two notes are too close to tell reliably. Look for a difference in how they *move*.` },
          { match: 3, msg: `Whether an egg floats depends on how old it is, not on whether it is cooked. Look for a difference in how they *move*.` }
        ],
        glyph: '🍳'
      },
      concepts: ['lateral'], tags: ['physical', 'everyday']
    },
    {
      id: 'lat-the-busy-pigeon', title: 'The Busy Pigeon', diff: 3,
      source: 'A traditional puzzle.',
      text: `Two cyclists start 30 kilometres apart on a straight road and ride towards each other, each at 15 km/h. A pigeon starts from the first cyclist's handlebars at the same moment and flies at 40 km/h to the second cyclist, then turns round at once and flies back to the first, and so on to and fro until the two cyclists meet.\n\nHow far does the pigeon fly altogether?`,
      hints: [`You could add up the pigeon's shorter and shorter trips, but that is a long sum. What single thing is easy to find?`, `How long do the cyclists ride before they meet? The pigeon flies for exactly that long.`],
      explain: `**40 km.** The cyclists close the gap at 15 + 15 = 30 km/h, and it is 30 km, so they meet after exactly **one hour**. The pigeon flies the whole time, and at 40 km/h it flies 40 km. There is no need to add up the endless series of shorter and shorter trips: ask how long the pigeon is flying, not where it goes.`,
      data: {
        answer: { num: 40, unit: 'km' },
        traps: [{ match: 30, msg: `That is the distance between the cyclists at the start. How long do they ride before they meet, and how far does a pigeon fly in that time?` }],
        glyph: '🕊'
      },
      concepts: ['lateral', 'rates'], tags: ['classic', 'arithmetic']
    },
    {
      id: 'lat-a-metre-more-rope', title: 'A Metre More Rope', diff: 3,
      source: 'A traditional puzzle.',
      text: `Imagine a steel cable pulled tight around the whole Earth at the equator, about 40 000 kilometres long, lying on the ground. (Pretend there are no mountains or oceans in the way.) The cable is cut, one extra **metre** of cable is spliced in, and then the ring is lifted so that it floats at the same height above the ground all the way round.\n\nHow high above the ground is it? Give your answer in centimetres.`,
      hints: [`The Earth's size does not matter here. Try the same job with a football and see whether the answer changes.`, `A circle's circumference is 2π times its radius. How much does the radius grow when the circumference grows by 1 m?`],
      explain: `About **16 cm**. A circle's circumference is 2π × radius, so adding 1 m to it adds 1 ÷ 2π ≈ 0.159 m to the radius, whatever the size of the circle. The same metre of extra rope lifts a ring round a football by 16 cm, and a ring round the Earth by 16 cm: about the length of your hand, not a hair's breadth.`,
      data: {
        answer: { num: 15.9, tol: 0.5, unit: 'cm' },
        traps: [{ match: 0, msg: `It is not zero: an extra metre of cable has to go somewhere, and it goes into lifting the whole ring.` }],
        glyph: '🌍'
      },
      concepts: ['lateral'], tags: ['classic', 'arithmetic', 'surprise']
    },
    {
      id: 'lat-the-heated-washer', title: 'The Hole in the Heated Washer', diff: 3,
      source: 'A traditional puzzle.',
      text: `A flat metal washer has a round hole in its middle. It is gently and evenly heated in an oven until it is much hotter, though well below its melting point. Like most metals, it expands as it warms.\n\nWhat happens to the hole in the middle?`,
      hints: [`Every length in the washer grows, including the distance across the hole. But which part of the washer grows: only the metal, or also the space?`, `Imagine drawing the washer on a photocopier and enlarging it.`],
      explain: `**The hole gets bigger**, just as if it were made of the same metal as the washer. When the washer expands, every distance in it grows in the same proportion, including the distance across the hole, exactly as in a photocopier enlargement of the whole washer. That is why a metal lid stuck on a jar can be loosened under the hot tap, and why a metal tyre was once fitted to a wooden wheel by heating the tyre first.`,
      data: {
        ask: `What happens to the hole?`,
        answer: { choice: 1, choices: [`It gets smaller: the metal grows inwards`, `It gets bigger, as if it were made of the same metal`, `It stays the same size: only the metal expands`, `It depends which metal the washer is made of`] },
        traps: [
          { match: 0, msg: `A tempting picture, but the hole has no “inside” that could be filled. Think of enlarging a photocopy of the whole washer.` },
          { match: 2, msg: `The hole is only the absence of metal, so it has no way to stay behind. Think of enlarging a photocopy of the whole washer.` },
          { match: 3, msg: `Ordinary metals all expand when they are heated, and the rule about holes is the same for all of them.` }
        ],
        glyph: '⭕'
      },
      concepts: ['lateral'], tags: ['physical', 'everyday']
    },

    /* ---------- hard: the explanation needs a real leap ---------- */
    {
      id: 'lat-rock-in-the-boat', title: 'The Rock in the Rowing Boat', diff: 4,
      source: 'A traditional puzzle.',
      text: `A rowing boat floats on a large pond with a big rock lying in the bottom of the boat. The rower lifts the rock and drops it over the side. It sinks to the bottom of the pond, and the boat, now lighter, rides higher in the water. No water splashes out of the pond.\n\nWhat happens to the level of the pond's surface, measured against the bank?`,
      hints: [`Compare how much water is pushed aside for the rock while it sits in the boat and while it lies on the bottom.`, `A floating boat must push aside its own weight of water. A sunken rock pushes aside only its own volume of water.`],
      explain: `**The level falls.** While the rock is in the boat, the boat has to push aside enough water to hold up the boat *and* the rock: the rock's whole weight in water. A rock is much denser than water, so that is a lot more water than the rock's own volume. Once the rock is on the bottom it pushes aside only its own volume, which is far smaller, and the lighter boat pushes aside only its own weight. Less water is being pushed aside, and so the surface drops.`,
      data: {
        ask: `What happens to the level of the pond?`,
        answer: { choice: 2, choices: [`It rises, because the rock now pushes water aside`, `It stays the same, because nothing has left the pond`, `It falls a little`, `It depends on how deep the pond is`] },
        traps: [
          { match: 0, msg: `The rock does push water aside on the bottom. But how much water was being pushed aside for it while it sat in the boat?` },
          { match: 1, msg: `Nothing has left the pond, true. But has the total amount of water pushed aside stayed the same?` },
          { match: 3, msg: `The depth does not matter to this one. Compare the water pushed aside before and after.` }
        ],
        glyph: '🪨'
      },
      concepts: ['lateral'], tags: ['physical', 'water'], links: ['lat-melting-ice']
    },
    {
      id: 'lat-balloon-in-the-car', title: 'The Balloon in the Car', diff: 4,
      source: 'A traditional puzzle.',
      text: `A helium balloon is tied on a string to the floor of a car, and floats above it in the still air of the car. All the windows are shut. The driver pulls away, and the car accelerates smoothly forwards.\n\nWhich way does the balloon lean, as the passengers see it?`,
      hints: [`The passengers are pushed back into their seats, and so is all the air in the car. Where does that air pile up?`, `A balloon is *lighter* than the air around it. Objects lighter than the surrounding fluid go the opposite way to heavy ones.`],
      explain: `**Forward**, towards the windscreen. As the car speeds up, the air in it is left behind a little and piles up at the back, so the pressure is higher at the rear than at the front. Heavy things are pushed towards the back, as the passengers are, but a helium balloon is lighter than air and is pushed the opposite way, from the high pressure to the low: towards the front. It is the same as a bubble in a bottle of water: shove the bottle forwards, and the bubble moves forwards, while the water sloshes back.`,
      data: {
        ask: `Which way does the balloon lean?`,
        answer: { choice: 1, choices: [`Backward, like the passengers`, `Forward, towards the windscreen`, `It stays upright`, `Sideways, towards a window`] },
        traps: [
          { match: 0, msg: `The passengers are heavier than air. Is a helium balloon heavier or lighter than the air around it?` },
          { match: 2, msg: `The air in the car does not stay put: it is pressed towards the rear. What does that do to a balloon?` },
          { match: 3, msg: `The car is speeding up straight ahead, so nothing pushes sideways. Which way do heavy and light things go?` }
        ],
        glyph: '🎈'
      },
      concepts: ['lateral'], tags: ['physical', 'surprise']
    },
    {
      id: 'lat-open-fridge', title: 'The Open Fridge in the Sealed Room', diff: 4,
      source: 'A traditional puzzle.',
      text: `On a hot afternoon Nora shuts herself into a small, well-insulated room with the doors and windows sealed. In the room is a working refrigerator, plugged into a power supply that is outside. She props the fridge door wide open, hoping to cool the room down.\n\nWhat happens to the temperature of the room over the next hour or two?`,
      hints: [`A fridge does not destroy heat. It takes heat from one place and puts it somewhere else. Where does it put it?`, `The fridge also uses electricity, and that energy has to go somewhere too.`],
      explain: `The room gets **slightly warmer**. The fridge moves heat from its inside to the coils at its back, but with the door open both are in the same room, so nothing has left the room. On top of that, the electricity the fridge consumes ends up as heat in the room too. A fridge with its door open in a sealed room is really a small heater with a cold cupboard attached.`,
      data: {
        ask: `What happens to the temperature of the room?`,
        answer: { choice: 3, choices: [`It gets colder`, `It stays exactly the same`, `It gets colder at first and then stays the same`, `It gets slightly warmer`] },
        traps: [
          { match: 0, msg: `That would be true if the fridge's warm back were outside the room. Where does the heat it takes from the inside end up here?` },
          { match: 1, msg: `Not quite: there is a supply of energy coming into the room from outside. Where does the fridge's electricity end up?` },
          { match: 2, msg: `Near the open door it may feel cooler for a while, but think about the room as a whole: what energy has entered it, and what has left it?` }
        ],
        glyph: '🧊'
      },
      concepts: ['lateral'], tags: ['physical', 'surprise']
    },
    {
      id: 'lat-backwards-on-the-rails', title: 'Backwards on the Rails', diff: 5,
      source: 'A traditional puzzle from the physics of rolling wheels.',
      text: `A train thunders along the track at 100 km/h. The carriages move forward, of course, and so do the couplings and the wheels' axles. But what about the wheels themselves? Each railway wheel has a projecting rim on its inside, the **flange**, which sticks out below the surface on which the wheel rolls and keeps the train on the rails.\n\nIs any part of the moving train travelling *backward*, relative to the ground, even for an instant?`,
      hints: [`Picture a rolling wheel: the point touching the rail is, for an instant, at rest. What about the points above it, and the points below it?`, `The flange reaches below the point where the wheel touches the rail. Is that part moving forwards or backwards?`],
      explain: `**Yes: the lower part of each wheel's flange moves backward.** A rolling wheel turns about the point where it touches the rail, which is at rest for that instant; points above it move forward faster than the train (the top of the wheel moves at *twice* the train's speed), and points below it move *backward* relative to the ground. The flange sticks out about 2.5 cm below the running surface of a wheel some 45 cm in radius, so the bottom of the flange moves backward by about 2.5/45 of the train's speed, or roughly 5 km/h for a 100 km/h train. The contact point itself is not moving backward (it is at rest), and the top of the wheel moves forward at double speed.`,
      data: {
        ask: `Is any part of the train moving backward, even for an instant?`,
        answer: { choice: 3, choices: [`No: a train is a rigid thing, and everything on it moves forward all the time`, `Yes: the point of each wheel that touches the rail is moving backward as the wheel turns`, `Yes: the top of each wheel moves backward for an instant, because the wheel is turning`, `Yes: the lower part of each flange, below where the wheel touches the rail`] },
        traps: [
          { match: 0, msg: `A train is not one rigid block: its wheels turn. Think about the speed of different points of a rolling wheel.` },
          { match: 1, msg: `The touching point is, for an instant, exactly at rest. Look at points just below it.` },
          { match: 2, msg: `The top of a rolling wheel moves forward, at *twice* the speed of the train. Look at the other end.` }
        ],
        glyph: '🚄'
      },
      concepts: ['lateral'], tags: ['physical', 'surprise']
    },
    {
      id: 'lat-two-padlocks-in-the-post', title: 'Two Padlocks in the Post', diff: 4,
      source: 'A modern puzzle in the spirit of the “three-pass” protocols of secret-keeping.',
      text: `Maya wants to send a valuable ring by post to her friend Jonas. A parcel that goes through the post *unlocked* will be stolen on the way, but a parcel locked with a padlock arrives safely: the thieves cannot open it, and they do not bother to smash it.\n\nMaya has a strong box with a hasp large enough for several padlocks, and a padlock and key of her own. Jonas has a padlock and key of his own too. They have never swapped keys, and any key sent by post would be copied.\n\nHow can Maya get the ring to Jonas?`,
      hints: [`Every time the box travels it must wear a padlock. But whose padlock could it be, when only one of them has the key?`, `The box may make more than one journey, and a padlock can be taken off again.`],
      explain: `It takes three journeys. First Maya locks the ring in the box with **her own** padlock and posts it to Jonas. He cannot open it, but he adds **his own padlock** beside hers and posts the box back. Maya, who has the key to her padlock only, takes her lock off and posts the box a third time, now locked with Jonas's padlock alone. Jonas has the key to that one, and he opens the box.\n\nAt no time does the box travel unlocked, and no key ever leaves its owner. Modern secret-sending schemes (“three-pass protocols”) work on the same principle.`,
      data: {
        ask: `How can Maya get the ring to Jonas?`,
        answer: { choice: 3, choices: [`Lock the box with her padlock and send the key in a separate parcel, well hidden inside a book`, `Send the box unlocked, wrapped in plain brown paper so that nobody suspects what is inside it`, `Send two boxes, one locked and one unlocked, and hope that only one of them is stolen`, `Send the box locked with her padlock; Jonas adds his own and sends it back; Maya removes hers and sends it again; Jonas opens his`] },
        traps: [
          { match: 0, msg: `The key would travel unprotected and be copied. Find a way in which no key ever travels.` },
          { match: 1, msg: `An unlocked parcel is stolen, however it is wrapped. It must always be locked: but by whose lock?` },
          { match: 2, msg: `That is a gamble, not a solution. The box can make several journeys, and a padlock can be taken off again.` }
        ],
        glyph: '🔐'
      },
      concepts: ['lateral'], tags: ['modern', 'logic']
    },
    {
      id: 'lat-day-before-yesterday', title: 'Twenty-Five, Then Twenty-Eight', diff: 4,
      source: 'A traditional puzzle.',
      text: `“The day before yesterday I was 25,” says Leo, “and next year I shall be 28.”\n\nOn what date is he saying it, and when is his birthday?`,
      hints: [`From 25 two days ago to 28 next year is three birthdays in a little over a year. That only fits if his birthday is squeezed very close to the change of year.`, `Test each choice: taking him as 25 two days ago, how old will he be next year?`],
      explain: `Leo is speaking on **1 January**, and his birthday is on **31 December**. The day before yesterday (30 December) he was still 25. On 31 December he turned 26, so today he is 26. On 31 December this year he will turn 27, and on 31 December next year, 28.\n\nThe other three choices all fail the same test: whichever you try, he would be at most 27 by next year, not 28.`,
      data: {
        ask: `On what date is Leo speaking, and when is his birthday?`,
        answer: { choice: 1, choices: [`Today is 31 December, and his birthday is 1 January`, `Today is 1 January, and his birthday is 31 December`, `Today is 1 January, and his birthday is 1 January`, `Today is 30 December, and his birthday is 31 December`] },
        traps: [
          { match: 0, msg: `Test it: if he was 25 two days ago and his birthday is on 1 January, how old will he be by next year?` },
          { match: 2, msg: `Test it: he turns a year older today. If he was 25 two days ago, how old will he be next year?` },
          { match: 3, msg: `Test it: if he was 25 two days ago, he turns 26 tomorrow. How old will he be on his birthday next year?` }
        ],
        glyph: '🎂'
      },
      concepts: ['deduction', 'lateral'], tags: ['calendar', 'logic']
    },
    {
      id: 'lat-ounce-of-gold', title: 'An Ounce of Gold, an Ounce of Feathers', diff: 4,
      source: 'A traditional puzzle; the facts are those of the troy and avoirdupois systems of weights.',
      text: `A jeweller and a pillow-maker are having a friendly argument. She says: “An ounce of gold weighs more than an ounce of feathers.” He says: “Nonsense: an ounce is an ounce.” Suppose they are both talking about the ounces in which each thing is *normally sold*: gold on the bullion market, feathers in the shop.\n\nWho is right?`,
      hints: [`Are all ounces the same weight? Think of the different systems of weights in use.`, `Gold has long been weighed in a special ounce of its own, used by jewellers and bullion dealers.`],
      explain: `**The jeweller is right.** Gold is weighed in *troy* ounces, about 31.1 grams, while feathers are sold by the ordinary (avoirdupois) ounce, about 28.35 grams, so an ounce of gold really is heavier.\n\nThe pounds go the other way, for the troy pound (12 troy ounces, about 373 grams) is lighter than the ordinary pound (16 ordinary ounces, about 454 grams): a pound of feathers weighs more than a troy pound of gold. If both were measured in the same ounce, of course, the two would weigh the same.`,
      data: {
        ask: `Who is right?`,
        answer: { choice: 1, choices: [`The pillow-maker: an ounce is an ounce`, `The jeweller: the gold ounce is the heavier`, `Neither: it depends how fluffy the feathers are`, `Neither: gold is denser, but the feathers take more room, so they cancel out`] },
        traps: [
          { match: 0, msg: `That is true for the same kind of ounce. But are gold and feathers weighed in the same kind of ounce?` },
          { match: 2, msg: `How fluffy the feathers are affects their volume, not their weight. The question is about the weight of one ounce of each.` },
          { match: 3, msg: `Density and volume do not come into it: it is about the weight of one ounce of each. Are they the same kind of ounce?` }
        ],
        glyph: '⚜'
      },
      concepts: ['lateral'], tags: ['trivia', 'trick question'], links: ['lat-kilo']
    },
    {
      id: 'lat-what-a-mirror-reverses', title: 'What Does a Mirror Reverse?', diff: 4,
      source: 'A traditional puzzle; discussed by many physicists and philosophers.',
      text: `Look in a mirror and you seem to see your left and right swapped: a parting on the left of your hair is on the right in the mirror, and writing held up to it appears back to front. But up and down are not swapped: your head is at the top of the reflection and your feet at the bottom.\n\nWhat does a flat mirror actually reverse?`,
      hints: [`If it really swapped left and right, your right hand's image would appear on the *left* side of the mirror. Where does it appear?`, `Point at the mirror with your nose. In which direction does the nose of your reflection point?`],
      explain: `A flat mirror reverses **front and back**. Your nose points towards the mirror and your reflection's nose points towards you; up stays up, and left stays left (your right hand's image is on the same side as your right hand). It only *looks* like a left-right swap because we imagine the reflection as another person who has turned round to face us, and turning round about an up-and-down axis exchanges left and right. It has nothing to do with our eyes being side by side: a one-eyed person sees the same mirror. And something really is reversed: a clock seen in a mirror turns the wrong way round.`,
      data: {
        ask: `What does a flat mirror actually reverse?`,
        answer: { choice: 2, choices: [`Left and right`, `Up and down`, `Front and back`, `Nothing at all: it only copies`] },
        traps: [
          { match: 0, msg: `Test it: your right hand's image appears on the *right* side of the mirror as you look at it. Which direction is really reversed?` },
          { match: 1, msg: `If it reversed up and down, you would see your reflection standing on its head.` },
          { match: 3, msg: `Something does change: a clock seen in a mirror turns the wrong way round. Which direction is turned?` }
        ],
        glyph: '🪞'
      },
      concepts: ['lateral'], tags: ['physical', 'perception']
    },

  ];

  // "see also": cross-links between neighbours (added to any links written on the puzzles themselves)
  const LINKS = {
    'lat-surgeon': ['lat-portrait', 'lat-two-fathers-two-sons'],
    'lat-months': ['lat-all-but-nine', 'lat-two-apples'],
    'lat-all-but-nine': ['lat-months', 'lat-two-apples'],
    'lat-five-sisters': ['lat-third-daughter', 'lat-two-fathers-two-sons'],
    'lat-overtake': ['lat-two-apples', 'lat-guard'],
    'lat-one-match': ['lat-candle-on-the-wall', 'lat-three-switches'],
    'lat-third-daughter': ['lat-noah-animals'],
    'lat-noah-animals': ['lat-roof-egg', 'lat-survivors'],
    'lat-roof-egg': ['lat-noah-animals', 'lat-survivors'],
    'lat-bottom-rung': ['lat-dry-head', 'lat-daylight'],
    'lat-dry-head': ['lat-bottom-rung', 'lat-daylight'],
    'lat-two-apples': ['lat-all-but-nine', 'lat-months'],
    'lat-survivors': ['lat-roof-egg', 'lat-noah-animals'],
    'lat-daylight': ['lat-dry-head', 'lat-bottom-rung'],
    'lat-kilo': ['lat-ounce-of-gold', 'lat-melting-ice'],
    'lat-guard': ['lat-overtake', 'lat-survivors'],
    'lat-two-barbers': ['lat-mislabelled-sacks', 'lat-two-guards-one-question'],
    'lat-friday-rider': ['lat-thirty-cents', 'lat-third-daughter'],
    'lat-thirty-cents': ['lat-friday-rider', 'lat-three-tablets'],
    'lat-wrong-way-driver': ['lat-shot-dunked-hung', 'lat-pushed-car'],
    'lat-glass-of-water': ['lat-broken-match', 'lat-closed-rucksack'],
    'lat-closed-rucksack': ['lat-broken-match', 'lat-damp-strongroom'],
    'lat-two-fathers-two-sons': ['lat-portrait', 'lat-five-sisters'],
    'lat-shot-dunked-hung': ['lat-pushed-car', 'lat-wrong-way-driver'],
    'lat-pushed-car': ['lat-shot-dunked-hung', 'lat-wrong-way-driver'],
    'lat-forty-ten-dates': ['lat-twins-two-birthdays', 'lat-day-before-yesterday'],
    'lat-three-tablets': ['lat-thirty-cents', 'lat-the-busy-pigeon'],
    'lat-coin-cork': ['lat-two-strings', 'lat-candle-on-the-wall'],
    'lat-bargain-45bc': ['lat-thirty-cents', 'lat-forty-ten-dates', 'dud-two-coins'],
    'lat-ladder-and-tide': ['lat-melting-ice', 'lat-rock-in-the-boat'],
    'lat-ten-floors-on-foot': ['lat-two-strings', 'lat-candle-on-the-wall'],
    'lat-where-trains-pass': ['lat-the-busy-pigeon', 'lat-overtake'],
    'lat-ball-comes-back': ['lat-balloon-in-the-car', 'lat-backwards-on-the-rails'],
    'lat-temple-doors': ['lat-two-guards-one-question', 'lat-mislabelled-sacks'],
    'lat-stuck-under-bridge': ['lat-birbals-line', 'lat-weighing-the-elephant'],
    'lat-last-apple': ['lat-two-apples', 'lat-five-games-each'],
    'lat-socks-in-the-dark': ['lat-mislabelled-sacks', 'lat-ten-heads'],
    'lat-ten-heads': ['lat-socks-in-the-dark'],
    'lat-fifty-pence-a-digit': ['lat-thirty-cents', 'lat-three-tablets'],
    'lat-birbals-line': ['lat-egg-on-its-end', 'lat-weighing-the-elephant'],
    'lat-egg-on-its-end': ['lat-birbals-line', 'lat-which-egg-is-raw'],
    'lat-two-strings': ['lat-candle-on-the-wall', 'lat-coin-cork'],
    'lat-candle-on-the-wall': ['lat-two-strings', 'lat-coin-cork'],
    'lat-cabin-south': ['lat-survivors', 'lat-roof-egg'],
    'lat-broken-match': ['lat-closed-rucksack', 'lat-damp-strongroom'],
    'lat-five-games-each': ['lat-last-apple', 'lat-two-fathers-two-sons'],
    'lat-nuts-in-the-drain': ['lat-stuck-under-bridge', 'lat-coin-cork'],
    'lat-melting-ice': ['lat-rock-in-the-boat', 'lat-ladder-and-tide'],
    'lat-three-switches': ['lat-paper-kettle', 'lat-which-egg-is-raw'],
    'lat-damp-strongroom': ['lat-closed-rucksack', 'lat-broken-match'],
    'lat-two-guards-one-question': ['lat-mislabelled-sacks', 'lat-temple-doors'],
    'lat-paper-kettle': ['lat-three-switches', 'lat-the-heated-washer'],
    'lat-mislabelled-sacks': ['lat-two-guards-one-question', 'lat-socks-in-the-dark'],
    'lat-slowest-horse': ['lat-birbals-line', 'lat-egg-on-its-end'],
    'lat-twins-two-birthdays': ['lat-forty-ten-dates', 'lat-day-before-yesterday'],
    'lat-monk-and-mountain': ['lat-where-trains-pass', 'lat-the-busy-pigeon'],
    'lat-nine-dots': ['lat-two-strings', 'lat-candle-on-the-wall'],
    'lat-weighing-the-elephant': ['lat-crown-and-bath', 'lat-rock-in-the-boat'],
    'lat-crown-and-bath': ['lat-weighing-the-elephant', 'lat-melting-ice'],
    'lat-which-egg-is-raw': ['lat-egg-on-its-end', 'lat-paper-kettle'],
    'lat-the-busy-pigeon': ['lat-where-trains-pass', 'lat-monk-and-mountain'],
    'lat-a-metre-more-rope': ['lat-the-heated-washer', 'lat-the-busy-pigeon'],
    'lat-the-heated-washer': ['lat-paper-kettle', 'lat-a-metre-more-rope'],
    'lat-rock-in-the-boat': ['lat-weighing-the-elephant'],
    'lat-balloon-in-the-car': ['lat-ball-comes-back', 'lat-backwards-on-the-rails'],
    'lat-open-fridge': ['lat-paper-kettle', 'lat-the-heated-washer'],
    'lat-backwards-on-the-rails': ['lat-what-a-mirror-reverses', 'lat-balloon-in-the-car'],
    'lat-two-padlocks-in-the-post': ['lat-two-guards-one-question', 'lat-mislabelled-sacks'],
    'lat-day-before-yesterday': ['lat-forty-ten-dates', 'lat-twins-two-birthdays'],
    'lat-ounce-of-gold': ['lat-crown-and-bath'],
    'lat-what-a-mirror-reverses': ['lat-backwards-on-the-rails', 'lat-balloon-in-the-car']
  };
  list.forEach((p) => {
    const have = p.links || [];
    const extra = (LINKS[p.id] || []).filter((l) => l !== p.id && !have.includes(l));
    if (have.length || extra.length) p.links = have.concat(extra);
  });

  Cabinet.family({
    id: 'lateral', engine: 'question', cat: 'riddles', name: 'Lateral thinking', order: 6,
    blurb: 'A short odd scene, and one question: what is the explanation? The answer is never in the sums but in an assumption you did not know you were making.',
    origin: { year: 1967, who: 'Edward de Bono and many folk tellers', note: 'The name “lateral thinking” was coined by Edward de Bono in 1967, and situation puzzles were popularised as parlour games from the 1970s. The puzzles themselves are much older and belong to folklore: trick questions and “how can this be?” stories are told in every language, and nobody can say who told them first.' },
    concepts: ['lateral']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
