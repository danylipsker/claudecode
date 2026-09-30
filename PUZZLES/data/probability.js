/* The Puzzle Cabinet · data/probability.js
 * Chance and paradox: probability puzzles with exact answers, each with an
 * experiment on the card (js/lib/figures.js, prob-*) that can be run as often
 * as you like, watching the frequencies settle towards the truth.
 * Every scenario's simulation is checked against its exact value. */
Cabinet.concepts([
  { id: 'law-of-large-numbers', name: 'The law of large numbers', see: ['probability', 'monte-carlo'],
    text: 'Toss a fair coin ten times and you may well get 7 heads; toss it ten thousand times and the share of heads will almost surely be very close to one half. The **frequency** of an event settles down towards its **probability** as the trials pile up — but slowly: the typical error shrinks like 1/√n, so a hundred times more trials buy only ten times more accuracy.\n\nThe law says nothing about the next toss. A coin has no memory: after five heads the sixth is still a fair toss. Believing otherwise is the *gambler\'s fallacy*.' },
  { id: 'monte-carlo', name: 'Estimating by experiment', see: ['law-of-large-numbers'],
    text: 'When a probability is hard to calculate, you can estimate it by running the experiment many times and counting — drop needles on a floor, throw darts at a square, deal a million hands. The method was named **Monte Carlo**, after the casino, in the 1940s by physicists at Los Alamos who ran it on the first computers; Buffon had done the same with needles in the 18th century, and it gave a way to estimate π by chance.' },
  { id: 'nontransitive', name: 'Non-transitive dice', see: ['probability'],
    text: 'We expect "beats" to behave like "is bigger than": if A beats B and B beats C, then A should beat C. With dice it need not. Efron\'s four dice each beat the next one two times in three — and the last beats the first. There is no best die; whoever chooses second can always pick one that is likely to win, which makes a fine bar bet and a lesson about rankings and elections.' }
]);

(function () {
  const SIM = (scenario, set, h) => ({ fig: 'prob-sim', params: Object.assign({ scenario }, set ? { set } : {}), w: 620, h: h || (set ? 470 : 430) });
  const list = [
    /* ---------- Monty Hall and relatives ---------- */
    {
      id: 'prob-monty', title: 'The Monty Hall Problem', diff: 2,
      source: 'Posed by the statistician Steve Selvin in 1975, after the American game show *Let\'s Make a Deal* (host Monty Hall); made famous by Marilyn vos Savant\'s magazine column in 1990.',
      text: 'On a game show there are three doors: behind one is a car, behind the other two, goats. You pick a door. The host, who **knows** where the car is, opens one of the other two doors and shows you a goat — he always does this. Then he offers you the chance to switch to the other closed door.\n\nShould you switch?',
      hints: ['Play a few games on the card, then let the computer play a thousand.', 'Your first pick is right one time in three. The host never changes that.', 'If your first pick was wrong (two times in three), where must the car be after the host shows his goat?'],
      explain: '**Switch**: switching wins the car two times in three. Your first pick is right with probability 1/3, and nothing the host does changes that — he can always show a goat, whatever you picked. In the other 2/3 of games your pick was a goat, the host is forced to reveal the other goat, and the remaining door has the car. So sticking wins 1/3, switching 2/3. When Marilyn vos Savant gave this answer in 1990, thousands of readers — some of them mathematicians — wrote in to tell her she was wrong. She was right.',
      data: {
        answer: { choice: 0, choices: ['Yes: switching doubles your chance', 'No: sticking is better', 'It makes no difference: it is 50–50 now'] },
        traps: [{ match: 2, msg: 'That is the famous trap. The two doors are not equally likely: the host\'s choice was not random.' }, { match: 1, msg: 'Sticking wins only when your first guess was right: one time in three.' }],
        glyph: '🚪', figure: { fig: 'prob-monty', params: { doors: 3, host: 'knows' }, w: 620, h: 470 }
      },
      concepts: ['conditional-probability', 'probability'], links: ['prob-monty-100', 'prob-monty-fall', 'prob-prisoners']
    },
    {
      id: 'prob-monty-100', title: 'A Hundred Doors', diff: 2,
      text: 'The same game with **100 doors**: one car, 99 goats. You pick a door. The host, who knows where the car is, opens **98** of the other doors, all goats, leaving just your door and one other closed.\n\nIf you switch, what is your chance of winning the car?',
      hints: ['What is the chance your first pick was right?', 'If it was wrong, the host had to leave the car behind the other closed door.'],
      explain: '**99/100.** Your first pick is right only 1 time in 100. In the other 99 games the car is among the other doors, and the host — who must avoid it — opens every one of them except the door with the car. With a hundred doors it is easy to feel why the host\'s closed door is special: out of 98 doors he chose, carefully, not to open that one.',
      data: {
        answer: { num: 0.99, show: '99/100', tol: 0.001 },
        traps: [{ match: 0.5, msg: 'Two doors are left, but they are not equally likely. The host picked his door knowing where the car was.' }, { match: 0.01, msg: 'That is the chance for your own door. Switching wins whenever you were wrong.' }],
        glyph: '100', figure: { fig: 'prob-monty', params: { doors: 100, host: 'knows' }, w: 620, h: 470 }
      },
      concepts: ['conditional-probability'], links: ['prob-monty']
    },
    {
      id: 'prob-monty-fall', title: 'The Host Who Did Not Know', diff: 4,
      text: 'Three doors, one car, two goats. You pick a door. This time the host has **forgotten** where the car is: he opens one of the other two doors at random — and it happens to show a goat.\n\nNow what is your chance of winning if you switch?',
      hints: ['Run the computer\'s games: some of them are spoiled, because the host reveals the car.', 'Count only the games in which the host happened to show a goat.'],
      explain: 'Now it really is **1/2**. When the host opens a door at random, he sometimes reveals the car, and those games are thrown away. Among the games where he luckily shows a goat, your door and the other closed door are equally likely. The difference from the ordinary game is all in what the host knew: a host who must avoid the car gives you information; a host who just got lucky does not.',
      data: {
        answer: { num: 0.5, show: '1/2', tol: 0.002 },
        traps: [{ match: 2 / 3, msg: 'That is the answer when the host knows. This host opened a door at random.' }],
        glyph: '?', figure: { fig: 'prob-monty', params: { doors: 3, host: 'random' }, w: 620, h: 470 }
      },
      concepts: ['conditional-probability'], links: ['prob-monty']
    },
    {
      id: 'prob-monty-four', title: 'Four Doors, One Goat Shown', diff: 4,
      text: 'Four doors: one car, three goats. You pick a door. The host, who knows, opens **one** of the other doors to show a goat. You now switch to one of the **two** other closed doors, chosen at random.\n\nWhat is your chance of winning the car?',
      hints: ['Your first pick is right 1 time in 4 — and then switching loses.', 'The other 3 times in 4 the car is behind one of the two doors you might switch to.'],
      explain: '**3/8.** With probability 3/4 your first pick was a goat, and then the car is behind one of the two other closed doors; you pick one of them at random, so you win half of those times: 3/4 × 1/2 = 3/8. Sticking wins only 1/4 = 2/8, so switching is still better — but not the sure bet it was with three doors.',
      data: {
        answer: { num: 0.375, show: '3/8', tol: 0.002 },
        traps: [{ match: 0.25, msg: 'That is the chance if you stick.' }, { match: 0.75, msg: 'The car is somewhere among the other doors 3 times in 4, but there are two doors to choose from.' }],
        glyph: '4', figure: { fig: 'prob-monty', params: { doors: 4, host: 'knows' }, w: 620, h: 470 }
      },
      concepts: ['conditional-probability'], links: ['prob-monty']
    },
    {
      id: 'prob-prisoners', title: 'The Three Prisoners', diff: 3, year: 1959,
      source: 'Martin Gardner\'s "Mathematical Games" column in *Scientific American*, October 1959.',
      text: 'Three prisoners, A, B and C, are told that one of them, chosen at random, will be pardoned. A asks the warden: "Tell me the name of one of the other two who will *not* be pardoned — that gives nothing away about me." (If both will stay locked up, the warden picks one of their names at random.) The warden says: **"B."**\n\nNow what is the chance that A is pardoned?',
      hints: ['The warden could always name somebody. Did his answer tell A anything about A?', 'Run the experiment, counting only the times the warden says "B".'],
      explain: 'Still **1/3**. Whatever happens, the warden can name one of B and C, so his answer tells A nothing about A. It does tell something about C: C\'s chance has risen to **2/3**. It is the Monty Hall problem in prison clothes, printed by Martin Gardner in 1959, long before the game show made it famous.',
      data: {
        answer: { num: 1 / 3, show: '1/3', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'Two prisoners are left, but they are not in the same position: the warden could always name somebody other than A.' }, { match: 2 / 3, msg: 'That is C\'s chance now.' }],
        glyph: '🔑', figure: SIM('prisoners')
      },
      concepts: ['conditional-probability'], links: ['prob-monty']
    },

    /* ---------- boxes and cards ---------- */
    {
      id: 'prob-bertrand-box', title: 'Bertrand\'s Box', diff: 3, year: 1889,
      source: 'Joseph Bertrand, *Calcul des probabilités* (1889).',
      text: 'Three boxes: one holds two gold coins, one two silver coins, one a gold and a silver. You pick a box at random and take out one coin without looking at the other. It is **gold**.\n\nWhat is the chance that the other coin in that box is gold too?',
      hints: ['It is tempting to say: the box is gold–gold or gold–silver, so 1/2. But are those equally likely, given that you drew gold?', 'Count gold coins, not boxes. There are three gold coins you could have drawn.'],
      explain: '**2/3.** Count the gold coins you might have drawn: two in the gold–gold box and one in the mixed box. Each is equally likely to be the one in your hand, and two of the three have a gold partner. Bertrand used the puzzle to warn that "equally likely" must be applied to the right things: here, to coins, not boxes.',
      data: {
        answer: { num: 2 / 3, show: '2/3', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'Two boxes are still possible, but the gold–gold box was twice as likely to give you a gold coin.' }],
        glyph: '🪙', figure: SIM('bertrand-box')
      },
      concepts: ['conditional-probability'], links: ['prob-three-cards']
    },
    {
      id: 'prob-three-cards', title: 'The Three Cards', diff: 3,
      source: 'A card version of Bertrand\'s box.',
      text: 'A hat holds three cards: one red on both sides, one white on both sides, and one red on one side and white on the other. You draw a card at random and lay it on the table. The side you see is **red**.\n\nWhat is the chance that the other side is red too?',
      hints: ['Count red faces, not cards.', 'There are three red faces. How many of them have red on the back?'],
      explain: '**2/3.** There are three red faces you could be looking at, all equally likely: two belong to the red–red card, one to the mixed card. Two of the three have red underneath. Betting even money on the "obvious" 1/2 is a quick way to lose.',
      data: {
        answer: { num: 2 / 3, show: '2/3', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'The red–red card had twice the chance of showing red. Count faces, not cards.' }],
        glyph: '🃏', figure: SIM('three-cards')
      },
      concepts: ['conditional-probability'], links: ['prob-bertrand-box']
    },
    {
      id: 'prob-three-coins', title: 'Galton\'s Three Coins', diff: 3, year: 1894,
      source: 'Francis Galton wrote about this false argument in 1894.',
      text: 'Toss three fair coins. Here is an argument: "Of any three coins, at least two must be alike. The third is equally likely to be heads or tails, so it matches the other two half the time. So the chance that all three are alike is 1/2."\n\nWhat is the real chance that all three are alike?',
      hints: ['List all eight outcomes: HHH, HHT, HTH, …', 'The flaw: "the third coin" is not a fixed coin — which one it is depends on the result.'],
      explain: '**1/4**: only HHH and TTT out of 8 equally likely outcomes. The argument goes wrong at "the third coin": which two coins are "the alike ones" depends on how they fell, so the odd one out is not a fresh, independent toss. Galton used it to show how easily careful-sounding reasoning about chance goes astray.',
      data: {
        answer: { num: 0.25, show: '1/4', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'That is the faulty argument. Count the eight outcomes.' }],
        glyph: '3', figure: SIM('three-coins')
      },
      concepts: ['probability'], links: ['prob-bertrand-box']
    },

    /* ---------- two children ---------- */
    {
      id: 'prob-kids-older', title: 'The Older Child', diff: 2,
      text: 'Mrs Jones has two children. You learn that the **older** one is a girl. (Assume each child is a boy or a girl with equal chance, independently.)\n\nWhat is the chance that both children are girls?',
      hints: ['The older child is settled. What about the younger?'],
      explain: '**1/2.** Knowing the older child is a girl tells you nothing about the younger one, who is a girl half the time. Compare this with the next puzzles, where the information is only a little different — and the answer changes.',
      data: {
        answer: { num: 0.5, show: '1/2', tol: 0.002 },
        traps: [{ match: 1 / 3, msg: 'That is the answer to a different question: "at least one is a girl". Here you know which one.' }],
        glyph: '👧', figure: SIM('kids-older')
      },
      concepts: ['conditional-probability'], links: ['prob-kids-atleast']
    },
    {
      id: 'prob-kids-atleast', title: 'At Least One Boy', diff: 3, year: 1959,
      source: 'The two-child problem, posed by Martin Gardner in *Scientific American* (1959); he later pointed out that the wording matters.',
      text: 'Mr Smith has two children. You ask him, "Is at least one of them a boy?" and he truthfully says **yes**.\n\nWhat is the chance that both are boys? (Each child is a boy or a girl with equal chance, independently.)',
      hints: ['List the families: boy–boy, boy–girl, girl–boy, girl–girl, each equally likely.', 'Which families could answer "yes"?'],
      explain: '**1/3.** Of the four equally likely families (older first) BB, BG, GB and GG, three can answer "yes", and only one of those three is BB. The answer depends on *how* you learned about the boy: here, by a yes/no question that any family with a boy would answer yes. Meet one of the children by chance instead, and the answer is different.',
      data: {
        answer: { num: 1 / 3, show: '1/3', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'That would be right if you knew which child was the boy. You only know that there is at least one.' }],
        glyph: '👦', figure: SIM('kids-atleast')
      },
      concepts: ['conditional-probability'], links: ['prob-kids-meet', 'prob-kids-tuesday']
    },
    {
      id: 'prob-kids-meet', title: 'The Boy in the Park', diff: 3,
      text: 'A man mentions that he has two children. Later you meet him in the park with one of them — whichever happened to come along, at random — and it is a **boy**.\n\nWhat is the chance that his other child is a boy?',
      hints: ['This time you have seen a particular child.', 'Families with two boys are twice as likely to send a boy to the park as families with one.'],
      explain: '**1/2.** Seeing one particular child, chosen at random, is different from being told "at least one is a boy". A two-boy family always brings a boy; a one-boy family does so only half the time. That doubles the weight of the boy–boy family, and the chance comes back to 1/2 — the same as for any unseen child. The two-child puzzle is famous precisely because such small changes in wording change the answer.',
      data: {
        answer: { num: 0.5, show: '1/2', tol: 0.002 },
        traps: [{ match: 1 / 3, msg: 'That is the answer when you only know "at least one is a boy". Here you met a particular child.' }],
        glyph: '🌳', figure: SIM('kids-meet')
      },
      concepts: ['conditional-probability'], links: ['prob-kids-atleast']
    },
    {
      id: 'prob-kids-tuesday', title: 'Born on a Tuesday', diff: 5, year: 2010,
      source: 'Posed by Gary Foshee at a Gathering for Gardner in 2010.',
      text: 'A woman has two children, and tells you (in answer to your question "Is one of them a boy born on a Tuesday?") that **yes, at least one is a boy born on a Tuesday**.\n\nWhat is the chance that both are boys? (Sexes and weekdays are equally likely and independent.)',
      hints: ['Each child is one of 14 kinds: boy or girl, times seven weekdays. There are 14 × 14 = 196 equally likely families.', 'Count the families with at least one Tuesday boy, and among them those with two boys.'],
      explain: '**13/27** — surprisingly close to 1/2, and not 1/3. Of the 196 equally likely families, those with a Tuesday boy number 14 + 14 − 1 = 27. Of those, the two-boy families are those where one or both boys was born on a Tuesday: 7 + 7 − 1 = 13. The detail about Tuesday makes the boy more nearly "a particular child", which pulls the answer from 1/3 towards 1/2.',
      data: {
        answer: { num: 13 / 27, show: '13/27', tol: 0.002 },
        traps: [{ match: 1 / 3, msg: 'The Tuesday really does change things. Count the 196 families.' }, { match: 0.5, msg: 'Very close — but count carefully: there are 27 families with a Tuesday boy.' }],
        glyph: 'Tue', figure: SIM('kids-tuesday')
      },
      concepts: ['conditional-probability'], links: ['prob-kids-atleast']
    },

    /* ---------- the gambler ---------- */
    {
      id: 'prob-gambler', title: 'Five Heads in a Row', diff: 1,
      text: 'A fair coin has just come down **heads five times in a row**.\n\nWhat is the chance that the next toss is heads?',
      hints: ['Does the coin remember?'],
      explain: '**1/2.** The coin has no memory: each toss is a fresh 50–50. Believing that tails is now "due" is the *gambler\'s fallacy*; in 1913 at Monte Carlo, black came up 26 times in a row at roulette, and gamblers lost a fortune betting on red. (Believing that heads is now "hot" is the opposite mistake.) The long-run balance comes from sheer numbers of later tosses swamping the streak, not from the coin correcting itself.',
      data: {
        answer: { num: 0.5, show: '1/2', tol: 0.002 },
        traps: [{ match: 1 / 64, msg: 'That is the chance of six heads in a row before you start. Five have already happened.' }],
        glyph: 'H', figure: SIM('streak')
      },
      concepts: ['law-of-large-numbers', 'probability'], links: ['prob-sequences']
    },
    {
      id: 'prob-sequences', title: 'The Lucky Sequence', diff: 1,
      text: 'You toss a fair coin five times. Which is more likely: **H H H H H**, or **H T H H T**?',
      hints: ['How many sequences of five tosses are there? Are they all equally likely?'],
      explain: 'They are **equally likely**: each particular sequence of five tosses has chance 1/32. H T H H T *looks* more random, and sequences like it are more common as a group — but that one sequence is no more likely than five heads.',
      data: {
        answer: { choice: 2, choices: ['H H H H H', 'H T H H T', 'They are equally likely'] },
        traps: [{ match: 1, msg: 'It looks more typical, but it is just as particular a sequence. Count them: 1 in 32 each.' }],
        glyph: 'HTH', figure: SIM('sequences')
      },
      concepts: ['probability'], links: ['prob-gambler']
    },
    {
      id: 'prob-hospital', title: 'The Two Hospitals', diff: 2,
      source: 'After a question used by the psychologists Daniel Kahneman and Amos Tversky in the early 1970s.',
      text: 'In a town there are two hospitals. In the large one about 45 babies are born each day; in the small one, about 15. About half of all babies are boys, but on any day the share varies. For a year, each hospital records the days on which **more than 60 %** of the babies born were boys.\n\nWhich hospital records more such days?',
      hints: ['Where do you get more extreme results: tossing a coin 15 times, or 45 times?'],
      explain: 'The **small** hospital — about 30 % of its days against about 12 % for the large one. Small samples swing about far more than large ones: 9 boys out of 15 happens easily, 27 out of 45 much less so. Most people asked this say "about the same", because both are "60 % boys" — the law of large numbers says otherwise.',
      data: {
        answer: { choice: 1, choices: ['The large hospital', 'The small hospital', 'About the same'] },
        traps: [{ match: 2, msg: 'That is the most common answer. But small samples wander further from one half.' }],
        glyph: '👶', figure: SIM('hospital')
      },
      concepts: ['law-of-large-numbers'], links: ['prob-gambler']
    },

    /* ---------- dice ---------- */
    {
      id: 'prob-dice-seven', title: 'The Favourite Total', diff: 1,
      text: 'You roll two ordinary dice and add them up.\n\nWhich total comes up most often?',
      hints: ['Count the ways to make each total: 2 can only be 1 + 1.', 'Roll a thousand pairs on the card.'],
      explain: '**7**: it can be made in six ways (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) out of 36, so it comes up one time in six. The totals fall away evenly on each side, down to 2 and 12, which have one way each. This is why 7 is the key number in the dice game of craps.',
      data: {
        answer: { choice: 5, choices: ['2', '4', '5', '6', '12', '7'] },
        traps: [{ match: 3, msg: 'Six has five ways to be made; one total has six.' }, { match: 4, msg: '12 needs a double six: 1 way in 36.' }],
        glyph: '⚅', figure: { fig: 'prob-dice', params: { dice: 2, highlight: [7] }, w: 620, h: 420 }
      },
      concepts: ['combinatorics', 'probability'], links: ['prob-seven-chance', 'prob-galileo-dice']
    },
    {
      id: 'prob-seven-chance', title: 'Seven\'s Chance', diff: 2,
      text: 'With two fair dice, what is the chance of rolling a total of **7**?',
      hints: ['There are 36 equally likely ways the two dice can fall.', 'Count the ways that add to 7.'],
      explain: '**6/36 = 1/6.** The pairs (1,6), (2,5), (3,4), (4,3), (5,2) and (6,1) all give 7. Notice that (1,6) and (6,1) count separately — imagine one die red and one blue.',
      data: {
        answer: { num: 1 / 6, show: '1/6', tol: 0.002 },
        traps: [{ match: 1 / 11, msg: 'There are 11 possible totals, but they are not equally likely.' }, { match: 1 / 12, msg: 'Count (1,6) and (6,1) separately: they are different rolls.' }],
        glyph: '7', figure: { fig: 'prob-dice', params: { dice: 2, highlight: [7] }, w: 620, h: 420 }
      },
      concepts: ['combinatorics'], links: ['prob-dice-seven']
    },
    {
      id: 'prob-galileo-dice', title: 'Galileo\'s Dice', diff: 3,
      source: 'Galileo Galilei, *Sopra le scoperte dei dadi* (On a discovery concerning dice), written about 1620.',
      text: 'Gamblers in Galileo\'s time noticed something odd with **three** dice. A total of 9 can be made in six ways (1+2+6, 1+3+5, 1+4+4, 2+2+5, 2+3+4, 3+3+3), and so can a total of 10 (1+3+6, 1+4+5, 2+2+6, 2+3+5, 2+4+4, 3+3+4). Yet one of the two comes up more often.\n\nWhich?',
      hints: ['Does 1+2+6 happen as often as 3+3+3?', '1+2+6 can fall in six different orders; 3+3+3 in only one.'],
      explain: '**10.** Counting ordered rolls, 10 can happen in 27 of the 216 ways three dice can fall, and 9 in only 25. Partitions like 1+2+6 can occur in 6 orders, 1+4+4 in 3, and 3+3+3 in just 1 — and the list for 9 has one more "slow" partition (3+3+3) where 10 has a quicker one. Galileo explained this in a short note written for his patrons, one of the first pieces of probability theory ever written.',
      data: {
        answer: { choice: 1, choices: ['9', '10', 'They are equally common'] },
        traps: [{ match: 2, msg: 'That is what the gamblers expected. Count the orders in which each total can fall.' }],
        glyph: '⚂', figure: { fig: 'prob-dice', params: { dice: 3, highlight: [9, 10] }, w: 620, h: 420 }
      },
      concepts: ['combinatorics'], links: ['prob-dice-seven']
    },
    {
      id: 'prob-doubles', title: 'Doubles', diff: 1,
      text: 'You roll two fair dice. What is the chance of a **double** (both dice the same)?',
      hints: ['Whatever the first die shows, what must the second do?'],
      explain: '**1/6.** Whatever the first die shows, the second matches it one time in six. Counting the 36 ways: there are 6 doubles.',
      data: {
        answer: { num: 1 / 6, show: '1/6', tol: 0.002 },
        traps: [{ match: 1 / 36, msg: 'That is the chance of one particular double, such as double six.' }],
        glyph: '⚄', figure: SIM('doubles')
      },
      concepts: ['probability'], links: ['prob-demere']
    },
    {
      id: 'prob-demere', title: 'The Chevalier\'s Two Bets', diff: 3, year: 1654,
      source: 'The Chevalier de Méré\'s question, discussed in the letters of Blaise Pascal and Pierre de Fermat (1654).',
      text: 'The Chevalier de Méré, a French gambler, liked to bet that he would throw **at least one six in four throws** of a die, and did well. He reasoned that betting on **at least one double six in 24 throws** of two dice should be just as good: 6 faces, 4 throws; 36 pairs, 24 throws — the same ratio. But he lost money.\n\nWhich bet is better?',
      hints: ['Work out the chance of *no* six in four throws: (5/6)⁴.', 'And the chance of no double six in 24 throws: (35/36)²⁴.'],
      explain: 'The **first** bet. The chance of at least one six in four throws is 1 − (5/6)⁴ ≈ 0.518 — a small edge in the gambler\'s favour. The chance of at least one double six in 24 throws is 1 − (35/36)²⁴ ≈ 0.491 — a small edge against. The proportional rule of thumb is not quite right, and a real gambler could feel the difference. His complaint to Pascal helped start the mathematical theory of probability.',
      data: {
        answer: { choice: 0, choices: ['A six in four throws of one die', 'A double six in 24 throws of two dice', 'They are exactly as good'] },
        traps: [{ match: 2, msg: 'That was the Chevalier\'s reasoning, and his purse disagreed. Run both bets on the card.' }],
        glyph: '⚀', figure: SIM('demere')
      },
      concepts: ['probability', 'law-of-large-numbers'], links: ['prob-one-six']
    },
    {
      id: 'prob-one-six', title: 'At Least One Six', diff: 3,
      text: 'What is the chance of throwing **at least one six** in four throws of a fair die? (A fraction or a decimal to three places.)',
      hints: ['It is easier to find the chance of **no** six at all.', 'No six in one throw: 5/6. In four throws: (5/6)⁴.'],
      explain: 'The chance of no six is (5/6)⁴ = 625/1296, so the chance of at least one is **671/1296 ≈ 0.518**. "At least one" problems are almost always easiest through the complement: work out the chance of none, and take it from 1.',
      data: {
        answer: { num: 671 / 1296, show: '671/1296', tol: 0.002 },
        traps: [{ match: 4 / 6, msg: 'Adding 1/6 four times counts the throws with two sixes twice. Try the chance of no six.' }, { match: 625 / 1296, msg: 'That is the chance of no six at all.' }],
        glyph: '6', figure: SIM('demere')
      },
      concepts: ['probability'], links: ['prob-demere']
    },

    /* ---------- races and waiting ---------- */
    {
      id: 'prob-coin-race', title: 'First Head Wins', diff: 2,
      text: 'Ann and Bob take turns tossing a coin, Ann first. The first to throw **heads** wins.\n\nWhat is Ann\'s chance of winning?',
      hints: ['Ann wins at once with chance 1/2. If she misses and Bob misses too, they are back where they started.', 'Ann\'s chance p satisfies p = 1/2 + 1/4 · p.'],
      explain: '**2/3.** Ann wins on her first toss half the time. Otherwise, Bob wins on his toss half the time, and a quarter of the time both have missed and the game starts again: p = ½ + ¼p, so p = 2/3. Going first is worth a lot.',
      data: {
        answer: { num: 2 / 3, show: '2/3', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'Going first is an advantage: Ann gets the first chance to win.' }],
        glyph: '🪙', figure: SIM('coin-race')
      },
      concepts: ['probability', 'geometric-series'], links: ['prob-dice-race']
    },
    {
      id: 'prob-dice-race', title: 'First Six Wins', diff: 3,
      text: 'Ann and Bob take turns rolling a die, Ann first. The first to roll a **six** wins.\n\nWhat is Ann\'s chance of winning?',
      hints: ['Ann wins at once with chance 1/6. If both miss (chance 25/36), they start again.', 'p = 1/6 + (25/36)·p.'],
      explain: '**6/11.** Ann wins on her first roll with chance 1/6; both miss with chance 25/36 and the game restarts. So p = 1/6 + (25/36)p, giving p = 6/11 ≈ 0.545. The first player\'s advantage is smaller than with a coin, because a single roll decides less.',
      data: {
        answer: { num: 6 / 11, show: '6/11', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'Going first is still an advantage.' }, { match: 1 / 6, msg: 'That is Ann\'s chance of winning on her very first roll.' }],
        glyph: '⚅', figure: SIM('dice-race')
      },
      concepts: ['probability', 'geometric-series'], links: ['prob-coin-race']
    },
    {
      id: 'prob-wait-six', title: 'Waiting for a Six', diff: 2,
      text: 'You roll a fair die until a six turns up. On average, how many rolls does it take (counting the roll with the six)?',
      hints: ['Something that happens with chance p per try takes 1/p tries on average.'],
      explain: '**6.** An event with chance p per try takes 1/p tries on average. It feels obvious, but it hides a surprise: half the time you need 4 rolls or fewer, and now and then you wait 20 or more; the long waits pull the average up to 6.',
      data: {
        answer: { num: 6, unit: 'rolls' },
        traps: [{ match: 3.5, msg: 'That is the average score on one roll, not the wait for a six.' }],
        glyph: '⏳', figure: SIM('wait-six')
      },
      concepts: ['expected-value'], links: ['prob-coupon', 'prob-wait-66']
    },
    {
      id: 'prob-coupon', title: 'Collect All Six Faces', diff: 4,
      text: 'You roll a fair die until every face, 1 to 6, has appeared at least once. On average, how many rolls does that take? (One decimal place.)',
      hints: ['The first roll always gives a new face. After that, a new face comes with chance 5/6, so it takes 6/5 rolls on average.', 'Add 6/6 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1.'],
      explain: '**14.7** rolls. The waits for each new face add up: 6/6 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1 = 6 × (1 + ½ + ⅓ + ¼ + ⅕ + ⅙) = 14.7. The last face is the slow one: once five faces are in, you wait six rolls on average for the last. It is the "coupon collector\'s problem" — why it takes so many packets of cereal to collect every toy.',
      data: {
        answer: { num: 14.7, tol: 0.05, unit: 'rolls' },
        traps: [{ match: 6, msg: 'Six rolls would do only if every roll were new. Repeats slow you down, especially at the end.' }, { match: 36, msg: 'Too many: add the average wait for each new face, 6/6 + 6/5 + … + 6/1.' }],
        glyph: '⚀⚅', figure: SIM('wait-coupon')
      },
      concepts: ['expected-value', 'harmonic-series'], links: ['prob-wait-six']
    },
    {
      id: 'prob-wait-hh', title: 'Waiting for Two Heads', diff: 4,
      text: 'You toss a fair coin until you get **two heads in a row**. On average, how many tosses does it take?',
      hints: ['Try the card: it also waits for HT, head then tail.', 'Let E be the average. A tail at any point sends you back to the start; a head then a tail too.'],
      explain: '**6** tosses — while waiting for **HT** takes only **4**, though both patterns have chance 1/4 at any given pair of tosses. The difference is what happens after a near miss. Waiting for HT, once you have a head you are never set back: you just wait for a tail. Waiting for HH, a head followed by a tail throws you right back to the start. (Solve E = ½(1 + E) + ¼(2 + E) + ¼ · 2 to get E = 6.)',
      data: {
        answer: { num: 6, unit: 'tosses' },
        traps: [{ match: 4, msg: 'That is the average wait for HT. HH is slower: a tail after a head sends you back to the start.' }],
        glyph: 'HH', figure: SIM('wait-hh-ht')
      },
      concepts: ['expected-value'], links: ['prob-wait-66', 'prob-penney']
    },
    {
      id: 'prob-wait-66', title: 'Two Sixes in a Row', diff: 5,
      text: 'You roll a fair die until you get **two sixes in a row**. On average, how many rolls does it take?',
      hints: ['First you must get a six: 6 rolls on average. Then the next roll must be a six too, or you start over.', 'If E is the answer: E = 6 + 1 + (5/6)·E.'],
      explain: '**42** rolls. You need 6 rolls on average to reach a six; then one more roll, which is a six with chance 1/6 — otherwise you are back to square one. So E = 6 + 1 + (5/6)E, giving E = 42. In general, waiting for n successes in a row of an event with chance p takes (1/p) + (1/p)² + … + (1/p)ⁿ tries: 6 + 36 = 42.',
      data: {
        answer: { num: 42, unit: 'rolls' },
        traps: [{ match: 36, msg: 'Close — each pair of rolls is a double six 1 time in 36, but the pairs overlap and a failure costs you more.' }, { match: 12, msg: 'Two sixes is not twice as hard as one: after the first you must succeed at once.' }],
        glyph: '⚅⚅', figure: SIM('wait-66')
      },
      concepts: ['expected-value'], links: ['prob-wait-six', 'prob-wait-hh']
    },

    /* ---------- cards, socks and hats ---------- */
    {
      id: 'prob-socks-sure', title: 'Socks in the Dark', diff: 1,
      text: 'A drawer holds 10 red socks and 10 black socks, all mixed up. The light is broken.\n\nHow many socks must you take out to be **sure** of a matching pair?',
      hints: ['How many colours are there?', 'With two socks you might have one of each colour. And with one more?'],
      explain: '**3.** Two socks might be one black and one white, but a third must match one of them: there are only two colours. This is the *pigeonhole principle*: three socks into two colours means two share a colour. (To be sure of a *red* pair you would need 12.)',
      data: {
        answer: { num: 3, unit: 'socks' },
        traps: [{ match: 11, msg: 'Far too many: any two of the same colour will do.' }, { match: 12, msg: 'That makes sure of a red pair. Any pair will do.' }, { match: 2, msg: 'Two socks might be one of each.' }],
        glyph: '🧦', figure: SIM('socks', { red: 10, black: 10 }, 470)
      },
      concepts: ['pigeonhole'], links: ['prob-socks-drawer']
    },
    {
      id: 'prob-socks-drawer', title: 'The Sock Drawer', diff: 3, year: 1965,
      source: 'Frederick Mosteller, *Fifty Challenging Problems in Probability* (1965), problem 1.',
      text: 'A drawer holds red socks and black socks. When you take out two at random, the chance that **both are red** is exactly **1/2**.\n\nWhat is the smallest number of socks the drawer can hold?',
      hints: ['With r red socks out of n, the chance is (r/n) × ((r − 1)/(n − 1)).', 'Try small drawers with the sliders on the card, starting with 3 red and 1 black.'],
      explain: '**4**: three red and one black. Then the chance is 3/4 × 2/3 = 1/2. (Two socks cannot work: both would have to be red, and the chance would be 1.) If the number of black socks must be even, the smallest drawer needs 21 socks: 15 red and 6 black.',
      data: {
        answer: { num: 4, unit: 'socks' },
        traps: [{ match: 2, msg: 'Two red socks give a red pair every time: chance 1, not 1/2.' }, { match: 3, msg: 'With three socks, two red and one black, the chance is 2/3 × 1/2 = 1/3.' }],
        glyph: '🧦', figure: SIM('socks', { red: 2, black: 2 }, 470)
      },
      concepts: ['probability'], links: ['prob-socks-even', 'prob-socks-sure']
    },
    {
      id: 'prob-socks-even', title: 'The Sock Drawer, Even Black', diff: 5,
      source: 'After Frederick Mosteller, *Fifty Challenging Problems in Probability* (1965), problem 1.',
      text: 'The same drawer of red and black socks: two taken at random are both red with chance exactly 1/2. But this time the number of **black** socks is **even**.\n\nWhat is the smallest number of socks in the drawer?',
      hints: ['You need 2r(r − 1) = n(n − 1) with n − r even.', 'The solutions (r, n) go (3, 4), (15, 21), (85, 120), … Check which have an even number of black socks.'],
      explain: '**21**: 15 red and 6 black, and indeed 15/21 × 14/20 = 210/420 = 1/2. The equation 2r(r − 1) = n(n − 1) is a disguised Pell equation, and its solutions grow roughly six-fold each time: (3, 4), (15, 21), (85, 120), (493, 697)… The first has one black sock, the second six.',
      data: {
        answer: { num: 21, unit: 'socks' },
        traps: [{ match: 4, msg: 'That drawer has one black sock — an odd number.' }, { match: 120, msg: 'That works too (85 red, 35 black)… but 35 is odd. Look for a smaller one.' }],
        glyph: '21', figure: SIM('socks', { red: 15, black: 6 }, 470)
      },
      concepts: ['diophantine', 'probability'], links: ['prob-socks-drawer']
    },
    {
      id: 'prob-two-aces', title: 'Two Aces on Top', diff: 2,
      text: 'A deck of 52 cards is well shuffled. What is the chance that the top two cards are **both aces**?',
      hints: ['The first card is an ace with chance 4/52.', 'If it is, the second is an ace with chance 3/51.'],
      explain: '**1/221.** The first card is an ace with chance 4/52 = 1/13; given that, the second is one of the three remaining aces among 51 cards: 3/51 = 1/17. So 1/13 × 1/17 = 1/221 — about once in every 221 shuffles.',
      data: {
        answer: { num: 1 / 221, show: '1/221', tol: 0.0002 },
        traps: [{ match: 1 / 169, msg: 'That would be right if the first ace went back into the deck. It does not.' }],
        glyph: 'A♠', figure: SIM('two-aces')
      },
      concepts: ['probability'], links: ['prob-same-colour', 'prob-first-ace']
    },
    {
      id: 'prob-same-colour', title: 'Same Colour', diff: 2,
      text: 'You draw two cards from a well-shuffled deck. What is the chance that they are the **same colour** (both red or both black)?',
      hints: ['Whatever colour the first card is, how many cards of that colour are left among the 51?'],
      explain: '**25/51**, a little under a half. Whatever the first card, 25 of the remaining 51 cards share its colour. It is below 1/2 because the first card has used up one of its own colour — the same reason a drawer of pairs rarely gives a pair.',
      data: {
        answer: { num: 25 / 51, show: '25/51', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'Close, but the first card takes one of its own colour out of the deck.' }],
        glyph: '♥♦', figure: SIM('same-colour')
      },
      concepts: ['probability'], links: ['prob-two-aces']
    },
    {
      id: 'prob-first-ace', title: 'Where Is the First Ace?', diff: 4,
      text: 'A deck is shuffled well, and you turn the cards over one by one until the **first ace** appears.\n\nOn average, at what position does it turn up? (1 = the top card.)',
      hints: ['The 4 aces cut the 48 other cards into 5 groups (before the first ace, between aces, after the last).', 'By symmetry each group holds 48/5 cards on average.'],
      explain: 'At position **10.6** (53/5). The four aces split the other 48 cards into five stretches, and by symmetry each stretch holds 48/5 = 9.6 cards on average. So the first ace comes, on average, after 9.6 other cards: at position 10.6.',
      data: {
        answer: { num: 10.6, show: '53/5', tol: 0.01 },
        traps: [{ match: 13, msg: 'Aces come 4 in 52, one in 13 — but the first of four comes earlier than that.' }, { match: 26.5, msg: 'That is the middle of the deck. There are four aces to find.' }],
        glyph: 'A', figure: SIM('first-ace')
      },
      concepts: ['expected-value', 'symmetry'], links: ['prob-two-aces']
    },
    {
      id: 'prob-hats', title: 'The Hat-Check Muddle', diff: 3, year: 1708,
      source: 'The problem of "rencontres" (matches), studied by Pierre Rémond de Montmort in 1708.',
      text: 'Four guests leave their hats with a forgetful attendant, who hands them back completely at random.\n\nWhat is the chance that **nobody** gets their own hat?',
      hints: ['There are 4! = 24 ways to hand back the hats. Count those with no match.', 'Count with inclusion and exclusion, or just list them: there are 9.'],
      explain: '**9/24 = 3/8.** Of the 24 ways to hand back the hats, 9 give nobody their own: these are the *derangements*. With more guests the chance barely changes: it quickly settles at 1/e ≈ 0.368, whether there are 10 guests or a million.',
      data: {
        answer: { num: 0.375, show: '3/8', tol: 0.002 },
        traps: [{ match: Math.pow(0.75, 4), msg: 'That treats the four hats as independent. They are not: each hat can go to only one head.' }],
        glyph: '🎩', figure: SIM('hats', { n: 4 }, 470)
      },
      concepts: ['combinatorics'], links: ['prob-hats-many']
    },
    {
      id: 'prob-hats-many', title: 'A Thousand Hats', diff: 4,
      text: 'At a huge party, a thousand guests get their hats back completely at random.\n\nTo three decimal places, what is the chance that nobody gets their own hat?',
      hints: ['Try the slider on the card: how does the chance change as the guests increase?', 'The chance is 1 − 1/1! + 1/2! − 1/3! + … ± 1/n!.'],
      explain: 'About **0.368** — it is 1/e to far more than three decimals. By inclusion and exclusion, the chance of no match among n guests is 1 − 1/1! + 1/2! − 1/3! + … ± 1/n!, the start of the series for e⁻¹. Adding guests hardly changes it: the more guests, the more chances of a match, but each one is less likely, and the two effects balance.',
      data: {
        answer: { num: 1 / Math.E, show: '1/e', tol: 0.0015 },
        traps: [{ match: 0, msg: 'With so many guests, surely someone gets their own hat? Only about 63 % of the time.' }, { match: 0.001, msg: 'Each guest has only a 1 in 1000 chance of their own hat — but there are 1000 guests.' }],
        glyph: 'e', figure: SIM('hats', { n: 12 }, 470)
      },
      concepts: ['combinatorics'], links: ['prob-hats']
    },

    /* ---------- chance and geometry ---------- */
    {
      id: 'prob-darts', title: 'Darts for π', diff: 2,
      source: 'A classic of the Monte Carlo method.',
      text: 'You throw darts at random at a square board with a circle drawn inside, touching all four sides. Every dart lands somewhere on the square, anywhere equally likely.\n\nWhat fraction of the darts land inside the circle?',
      hints: ['The fraction is the circle\'s area over the square\'s.', 'A circle of radius 1 has area π; its square has side 2.'],
      explain: '**π/4 ≈ 0.785**: the circle has area πr² and the square (2r)² = 4r². So four times the fraction of hits estimates π — slowly: a thousand darts give it to about 0.1, a million to about 0.003. It is the simplest example of estimating a number by random experiment.',
      data: {
        answer: { num: Math.PI / 4, show: 'pi/4', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'The circle fills much more than half the square.' }],
        glyph: 'π', figure: SIM('darts')
      },
      concepts: ['monte-carlo', 'probability'], links: ['prob-buffon']
    },
    {
      id: 'prob-buffon', title: 'Buffon\'s Needle', diff: 4, year: 1777,
      source: 'Georges-Louis Leclerc, Comte de Buffon: posed in 1733, solved in his *Essai d\'arithmétique morale* (1777).',
      text: 'A floor is made of boards whose width is exactly the length of a needle. You drop the needle at random.\n\nWhat is the chance that it lands across a line between two boards? (A decimal to three places, or an expression.)',
      hints: ['The needle crosses a line when its centre is close enough to one, and how close depends on its angle.', 'For an angle θ the needle spans (L/2) sin θ each side of its centre. Average sin θ over all angles: 2/π.'],
      explain: '**2/π ≈ 0.637.** At angle θ to the lines, the needle reaches a line if its centre is within (L/2) sin θ of it — which happens with chance sin θ when the boards are as wide as the needle. Averaged over all angles, sin θ comes to 2/π. So dropping needles and counting crossings estimates π — the first famous use of chance to compute a number. (Type 2/pi for the exact answer.)',
      data: {
        answer: { num: 2 / Math.PI, show: '2/pi', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'Close, but tilted needles cross more often than you might think.' }],
        glyph: '📍', figure: SIM('buffon')
      },
      concepts: ['monte-carlo', 'probability'], links: ['prob-darts']
    },
    {
      id: 'prob-stick', title: 'The Broken Stick', diff: 3,
      text: 'A stick is broken at two points chosen at random along its length, making three pieces.\n\nWhat is the chance that the three pieces can form a **triangle**?',
      hints: ['Three lengths make a triangle when none is longer than the other two together — here, when none is longer than half the stick.', 'Picture the two break points as a point in a square; the good region is made of small triangles.'],
      explain: '**1/4.** The pieces make a triangle exactly when every piece is shorter than half the stick. If the two break points are drawn as a point (x, y) in a unit square, the good points form two triangles each of area 1/8 — a quarter of the square.',
      data: {
        answer: { num: 0.25, show: '1/4', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'Try it on the card: most of the time one piece is too long.' }],
        glyph: '/\\', figure: SIM('stick')
      },
      concepts: ['probability'], links: ['prob-chord']
    },
    {
      id: 'prob-chord', title: 'Bertrand\'s Paradox', diff: 4, year: 1889,
      source: 'Joseph Bertrand, *Calcul des probabilités* (1889).',
      text: 'An equilateral triangle is drawn inside a circle. A **chord** of the circle is chosen "at random".\n\nWhat is the chance that the chord is longer than a side of the triangle?',
      hints: ['Try three ways of choosing a random chord on the card: joining two random points of the circle; a random point on a random radius; a random midpoint in the disc.', 'Do they agree?'],
      explain: 'It **depends on what "at random" means**. Joining two random points on the circle gives 1/3; a random point on a random radius, with the chord at right angles to it, gives 1/2; a random midpoint anywhere in the disc gives 1/4. Each method is a fair way to pick "a random chord", and each gives a different answer. Bertrand used this in 1889 to show that probability needs the method of choosing to be spelt out — "at random" is not enough.',
      data: {
        answer: { choice: 3, choices: ['1/3', '1/2', '1/4', 'It depends on how the chord is chosen'] },
        traps: [{ match: 0, msg: 'That is right for one way of choosing. Try the others on the card.' }, { match: 1, msg: 'That is right for one way of choosing. Try the others on the card.' }, { match: 2, msg: 'That is right for one way of choosing. Try the others on the card.' }],
        glyph: '⌀', figure: SIM('chord')
      },
      concepts: ['probability'], links: ['prob-stick']
    },
    {
      id: 'prob-galton', title: 'The Middle Bin', diff: 3,
      source: 'The "quincunx", built by Francis Galton in the 1870s to show how chance piles up.',
      text: 'On a Galton board each ball falls through **10 rows** of pegs, bouncing left or right with equal chance at every row, and lands in one of 11 bins.\n\nWhat is the chance that a ball lands in the middle bin?',
      hints: ['The ball lands in the middle when it bounces right exactly 5 times out of 10.', 'The number of paths with 5 rights is C(10, 5) = 252, out of 2¹⁰ = 1024.'],
      explain: '**252/1024 = 63/256 ≈ 0.246.** Each path is a sequence of 10 left–right choices, all 1024 equally likely, and the middle bin needs exactly 5 rights: C(10, 5) = 252 ways. The piles form the familiar bell curve, the binomial distribution, which Galton used to explain why so many measurements cluster around an average.',
      data: {
        answer: { num: 63 / 256, show: '63/256', tol: 0.002 },
        traps: [{ match: 1 / 11, msg: 'The bins are not equally likely: there are many more paths to the middle.' }, { match: 0.5, msg: 'Half the paths end on the left and half on the right — the middle bin gets only a share of them.' }],
        glyph: '▽', figure: { fig: 'prob-galton', params: { rows: 10 }, w: 620, h: 480 }
      },
      concepts: ['combinatorics', 'law-of-large-numbers'], links: ['prob-ten-coins']
    },
    {
      id: 'prob-ten-coins', title: 'Exactly Half', diff: 2,
      text: 'You toss a fair coin **ten times**. What is the chance of getting **exactly five heads**?',
      hints: ['There are 2¹⁰ = 1024 equally likely sequences.', 'How many have exactly five heads? Choose which 5 of the 10 tosses they are.'],
      explain: '**252/1024 = 63/256 ≈ 0.246** — less than one time in four, even though five heads is the single most likely result. The most likely outcome can still be quite unlikely. (It is the same count as the middle bin of a ten-row Galton board.)',
      data: {
        answer: { num: 63 / 256, show: '63/256', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'Five heads is the most likely number, but not that likely: 4 or 6 heads happen often too.' }],
        glyph: '5/10', figure: SIM('ten')
      },
      concepts: ['combinatorics'], links: ['prob-galton']
    },

    /* ---------- games and expectations ---------- */
    {
      id: 'prob-points', title: 'The Interrupted Game', diff: 3, year: 1654,
      source: 'The "problem of points", solved in the letters of Blaise Pascal and Pierre de Fermat (1654).',
      text: 'Anne and Bert play a fair game of chance, round by round; the first to win **3 rounds** takes the whole stake. The game has to stop when Anne leads **2 rounds to 1**.\n\nWhat share of the stake should Anne fairly take?',
      hints: ['Imagine the game carried on. Anne needs 1 more round; Bert needs 2.', 'Bert can only win by winning the next two rounds.'],
      explain: '**3/4.** Bert wins only if he takes both of the next two rounds: chance 1/4. So Anne\'s chance of winning is 3/4, and a fair split gives her three-quarters of the stake. Earlier writers had proposed splitting by the score (2 : 1); Pascal and Fermat saw that what matters is what could still happen, and in doing so laid the foundations of probability.',
      data: {
        answer: { num: 0.75, show: '3/4', tol: 0.002 },
        traps: [{ match: 2 / 3, msg: 'That splits by the score so far, 2 to 1. The fair split looks at the future.' }],
        glyph: '⚖', figure: SIM('points')
      },
      concepts: ['probability', 'expected-value'], links: ['prob-ruin']
    },
    {
      id: 'prob-ruin', title: 'The Gambler\'s Ruin', diff: 3,
      text: 'You have £3 and bet £1 at a time on the toss of a fair coin. You will stop when you reach **£10** — or when you have nothing left.\n\nWhat is the chance that you reach £10?',
      hints: ['In a fair game, your average fortune never changes.', 'At the end you have either £10 or £0. If p is the chance of £10, your average fortune at the end is 10p.'],
      explain: '**3/10.** In a fair game your expected money stays at £3 whatever you do. At the end you hold £10 with chance p or £0 otherwise, so 10p = 3. The same argument shows that a gambler with limited money, playing against a casino that has far more, is almost sure to be ruined eventually — even at fair odds.',
      data: {
        answer: { num: 0.3, show: '3/10', tol: 0.002 },
        traps: [{ match: 0.5, msg: 'The coin is fair, but you start much nearer to £0 than to £10.' }],
        glyph: '£', figure: SIM('ruin', { start: 3, goal: 10 }, 470)
      },
      concepts: ['expected-value'], links: ['prob-points']
    },
    {
      id: 'prob-chuck', title: 'Chuck-a-Luck', diff: 4,
      text: 'At a fair you bet $1 on a number, then three dice are rolled. If your number shows on one die you win $1, on two dice $2, on three dice $3 (and keep your stake); if it shows on none, you lose your $1. It sounds generous: three dice, three chances.\n\nOn average, how many **cents** do you lose per game?',
      hints: ['No match: (5/6)³ = 125/216. One match: 3 · (1/6)(5/6)² = 75/216. Two: 15/216. Three: 1/216.', 'Average win: (75·1 + 15·2 + 1·3 − 125·1)/216 dollars.'],
      explain: 'About **7.9 cents** (17/216 of a dollar). The chances are 125/216 of no match, 75/216 of one, 15/216 of two and 1/216 of three, so the average result is (75 + 30 + 3 − 125)/216 = −17/216 dollars. The trick is that "three chances of 1/6" adds to 1/2, but the chances overlap: when your number turns up twice, you are paid for two matches with only one roll of luck.',
      data: {
        answer: { num: 1700 / 216, show: '7.87', tol: 0.12, unit: 'cents' },
        traps: [{ match: 0, msg: 'Three dice, three chances of 1/6 — it sounds fair, but it is not. Run a thousand games.' }],
        glyph: '🎲', figure: SIM('chuck')
      },
      concepts: ['expected-value'], links: ['prob-st-petersburg']
    },
    {
      id: 'prob-st-petersburg', title: 'The St Petersburg Game', diff: 3, year: 1738,
      source: 'Posed by Nicolaus Bernoulli in 1713; Daniel Bernoulli\'s paper of 1738 in the journal of the St Petersburg Academy gave it its name.',
      text: 'A coin is tossed until it first shows tails. If that happens on the first toss you win $2; on the second, $4; on the third, $8 — the prize doubles with every head.\n\nIf the casino has unlimited money, what is the fair price to play — the average prize?',
      hints: ['The prize $2ᵏ comes with chance 1/2ᵏ. What does each possible outcome add to the average?', 'Each adds $1 — and there are infinitely many of them.'],
      explain: 'The average prize is **infinite**: the chance 1/2ᵏ of winning $2ᵏ adds $1 to the average for every k, without end. Yet nobody would pay more than a few dollars to play. Daniel Bernoulli\'s explanation was that money\'s *usefulness* grows more slowly than the amount — a million dollars is not a million times as welcome as one — the start of utility theory. On the card, watch the average creep up, jump, and never settle.',
      data: {
        answer: { choice: 2, choices: ['$2', '$4', 'It is infinite', '$1,024'] },
        traps: [{ match: 0, msg: 'That is the most likely prize, not the average.' }, { match: 1, msg: 'The average is dragged up by the rare huge prizes. Add up what each outcome contributes.' }],
        glyph: '∞$', figure: SIM('stpete', { cap: 0 }, 470)
      },
      concepts: ['expected-value'], links: ['prob-st-petersburg-bank']
    },
    {
      id: 'prob-st-petersburg-bank', title: 'St Petersburg With a Real Bank', diff: 4,
      text: 'The same game, but the casino has only **$1,048,576** (that is 2²⁰): if you are owed more, that is all you get.\n\nNow what is the average prize, in dollars?',
      hints: ['For the first 20 possible outcomes (tails on toss 1 to 20) each adds $1 to the average, as before.', 'All the longer games pay $2²⁰, and together they have chance 1/2²⁰.'],
      explain: '**$21.** Tails on toss k, for k = 1 to 20, pays 2ᵏ with chance 1/2ᵏ: $1 each, $20 in all. All the longer games together have chance 1/2²⁰ and pay 2²⁰: one more dollar. So the whole "infinite" value of the game shrinks to $21 once the bank is merely very rich — and even the world\'s wealth would only raise it to about $50.',
      data: {
        answer: { num: 21, unit: 'dollars' },
        traps: [{ match: 20, msg: 'Nearly: the games longer than 20 tosses are rare, but together they add one more dollar.' }],
        glyph: '$21', figure: SIM('stpete', { cap: 1048576 }, 470)
      },
      concepts: ['expected-value'], links: ['prob-st-petersburg']
    },
    {
      id: 'prob-envelopes', title: 'The Two Envelopes', diff: 4,
      text: 'Two envelopes each hold money, one twice as much as the other. You pick one and open it: $100. You may keep it or swap. A friend reasons: "The other holds $200 or $50, equally likely, so on average $125. Always swap!" But the same argument would make you swap back again…\n\nWhat is the truth?',
      hints: ['Before you open anything, the two envelopes are exactly alike. Can a plan to always swap beat a plan to always keep?', 'The flaw: "equally likely" is being applied to amounts, whatever they are. That cannot hold for every amount.'],
      explain: 'Swapping **gains nothing on average**: always swapping and always keeping earn the same, as the card shows. The friend\'s argument treats "the other has double" and "the other has half" as equally likely *whatever* amount you see — which no real way of filling envelopes can do for all amounts. Seen properly, the pair is (x, 2x); keeping or swapping each wins 1.5x on average. The puzzle still starts arguments among statisticians and philosophers.',
      data: {
        answer: { choice: 2, choices: ['Always swap: it gains 25 % on average', 'Always keep: swapping is a trap', 'It makes no difference on average; the friend\'s reasoning is flawed'] },
        traps: [{ match: 0, msg: 'Then you should also swap back… and forth for ever. Where is the flaw?' }, { match: 1, msg: 'Keeping is no better than swapping, either. Run both on the card.' }],
        glyph: '✉', figure: SIM('envelopes')
      },
      concepts: ['expected-value', 'symmetry'], links: ['prob-st-petersburg']
    },
    {
      id: 'prob-bus', title: 'Waiting for the Bus', diff: 4,
      text: 'Buses on your route come alternately **5 minutes** and **15 minutes** apart — so six buses an hour, one every 10 minutes on average. You arrive at the stop at a random moment.\n\nOn average, how many minutes do you wait?',
      hints: ['You are three times as likely to arrive during a long gap as a short one.', 'In a gap of g minutes, you wait g/2 on average. Weight each gap by how long it is.'],
      explain: '**6.25** minutes — more than the 5 you might expect from buses "every 10 minutes". You are much more likely to arrive during a long gap than a short one (three times as likely here), and long gaps mean long waits: (5 × 2.5 + 15 × 7.5)/20 = 6.25. It is the *inspection paradox*: why your bus always seems late, your class seems bigger than the average class, and your friends seem to have more friends than you.',
      data: {
        answer: { num: 6.25, unit: 'minutes', tol: 0.01 },
        traps: [{ match: 5, msg: 'That would be so if the buses came exactly every 10 minutes. Uneven gaps make you wait longer.' }, { match: 10, msg: 'That is the average gap. You arrive part-way through it.' }],
        glyph: '🚌', figure: SIM('bus')
      },
      concepts: ['expected-value'], links: ['prob-wait-six']
    },
    {
      id: 'prob-secretary', title: 'Choosing the Best Candidate', diff: 5, year: 1960,
      source: 'The "secretary problem"; Martin Gardner popularised it in *Scientific American* in 1960 as the game of Googol.',
      text: 'A hundred candidates are interviewed one at a time, in random order. After each interview you must hire the candidate on the spot or turn them away for ever; you can only compare them with those already seen. Your plan: interview the first **k** and turn them all away, then hire the first candidate who is better than all of those.\n\nWhich k gives the best chance of hiring the very best of the hundred?',
      hints: ['Try the slider on the card: small k and large k both do badly.', 'For large n the best k is about n/e, and the chance of success is then about 1/e ≈ 37 %.'],
      explain: '**k = 37**, which hires the very best candidate about **37 %** of the time — astonishingly often, for one in a hundred. Skip too few and you hire someone good-looking too early; skip too many and the best has probably already gone. For large numbers the best rule is to skip n/e of them (about 37 %), and the chance of success is 1/e.',
      data: {
        answer: { num: 37 },
        traps: [{ match: 50, msg: 'Skipping half is decent, but you waste too many chances. Try smaller.' }, { match: 10, msg: 'Too few: your yardstick is too weak, and you often settle too early.' }, { match: 36, msg: 'Very close — 36 and 38 are nearly as good, but 37 is best.' }, { match: 38, msg: 'Very close — but 37 is best.' }],
        glyph: '👔', figure: SIM('secretary', { n: 100, k: 20 }, 470)
      },
      concepts: ['probability', 'expected-value'], links: ['prob-hats-many']
    },

    /* ---------- statistics and belief ---------- */
    {
      id: 'prob-simpson', title: 'Simpson\'s Paradox', diff: 3,
      source: 'The paradox is named after Edward Simpson, who described it in 1951; the numbers here are invented.',
      text: 'Two hospitals each treated 500 patients last year. For patients who arrived in **good** condition, Hospital A saved a larger share than Hospital B. For patients who arrived in **poor** condition, A also saved a larger share than B. Yet overall, **B** saved a larger share of its patients.\n\nYou are about to be taken to hospital. Which should you choose?',
      hints: ['Switch the card between "By condition" and "All together". Who does each hospital mostly treat?', 'Hospital A treats mostly patients in poor condition, who survive less often wherever they go.'],
      explain: 'Choose **Hospital A**: whatever your condition, it does better. B looks better overall only because it mostly treats patients in good condition, who survive more often wherever they go, while A takes the hard cases. The overall figures mix two different groups in different proportions, and the mix hides the comparison. This reversal — *Simpson\'s paradox* — turns up in real medical trials, university admissions and batting averages; the cure is to ask what else differs between the groups.',
      data: {
        answer: { choice: 0, choices: ['Hospital A', 'Hospital B', 'It makes no difference'] },
        traps: [{ match: 1, msg: 'B wins overall, but loses in every group. Why does it win overall?' }],
        glyph: '⚕', figure: { fig: 'prob-simpson', params: {}, w: 620, h: 440 }
      },
      concepts: ['conditional-probability'], links: ['prob-false-positive']
    },
    {
      id: 'prob-false-positive', title: 'The Worrying Test', diff: 3,
      text: 'A rare illness affects **1 person in 100**. A test for it is **99 % accurate**: it finds 99 % of those who have the illness, and wrongly alarms only 1 % of those who do not. You take the test and it says you have the illness.\n\nWhat is the chance that you really do?',
      hints: ['Imagine 10,000 people. How many are ill, and how many of them test positive?', 'Of the 9,900 who are well, how many get a false alarm?'],
      explain: 'Only **1/2**. Out of 10,000 people, 100 are ill and 99 of them test positive; of the 9,900 who are well, 1 % — 99 people — also test positive. So of the 198 positives, just half are ill. When an illness is rare, even a very accurate test gives many false alarms, because there are so many more healthy people to be wrong about. Doctors are taught to think in these "natural frequencies" for exactly this reason.',
      data: {
        answer: { num: 0.5, show: '1/2', tol: 0.003 },
        traps: [{ match: 0.99, msg: 'That is the test\'s accuracy — the most common wrong answer. Count the false alarms among the many healthy people.' }, { match: 0.01, msg: 'That is the chance before you took the test. A positive result does raise it — by a lot.' }],
        glyph: '🧪', figure: SIM('test')
      },
      concepts: ['conditional-probability'], links: ['prob-taxi', 'prob-simpson']
    },
    {
      id: 'prob-taxi', title: 'The Taxi and the Witness', diff: 4,
      source: 'After a question used by Amos Tversky and Daniel Kahneman in the 1970s.',
      text: 'A taxi was in a hit-and-run accident at night. In the city, **85 %** of the cabs are green and **15 %** are blue. A witness says the cab was **blue**. Tested in the same conditions, the witness names a cab\'s colour correctly **80 %** of the time.\n\nWhat is the chance that the cab really was blue?',
      hints: ['Imagine 100 accidents. How many cabs are blue, and how many of those does the witness call blue?', 'How many of the 85 green cabs does the witness wrongly call blue?'],
      explain: '**12/29 ≈ 0.41** — the cab was more likely green. Of 100 cabs, 15 are blue and the witness calls 12 of them blue; 85 are green and the witness wrongly calls 17 of them blue. So of the 29 "blue" reports, only 12 are true. Most people answer 80 %, ignoring how rare blue cabs are to begin with — the *base rate*.',
      data: {
        answer: { num: 12 / 29, show: '12/29', tol: 0.004 },
        traps: [{ match: 0.8, msg: 'That is how reliable the witness is. But blue cabs are rare: many "blue" reports are mistaken greens.' }, { match: 0.15, msg: 'That is the chance before the witness spoke. Her report does count for something.' }],
        glyph: '🚕', figure: SIM('taxi')
      },
      concepts: ['conditional-probability'], links: ['prob-false-positive']
    },

    /* ---------- birthdays ---------- */
    {
      id: 'prob-birthday', title: 'The Birthday Party', diff: 2,
      text: 'How many people must be in a room for the chance that **two of them share a birthday** to be more than one half? (Ignore 29 February and assume all 365 birthdays equally likely.)',
      hints: ['Count pairs, not people: 23 people make 253 pairs.', 'Try the slider and run a thousand rooms at each size.'],
      explain: '**23.** With 23 people the chance that all birthdays differ is 365/365 × 364/365 × … × 343/365 ≈ 0.493, so a shared birthday has chance 0.507. It feels too few because we think about *our own* birthday; but 23 people make 253 pairs, and any pair will do. With 70 people a shared birthday is 99.9 % certain.',
      data: {
        answer: { num: 23, unit: 'people' },
        traps: [{ match: 183, msg: 'That is half of 365. But any two people can share, not just someone with you.' }, { match: 253, msg: 'That is how many you need for someone to share *your* birthday. Any pair will do here.' }],
        glyph: '🎂', figure: SIM('birthday', { n: 10, mine: false }, 470)
      },
      concepts: ['probability', 'combinatorics'], links: ['prob-birthday-mine', 'prob-birthday-70']
    },
    {
      id: 'prob-birthday-mine', title: 'Someone With My Birthday', diff: 3,
      text: 'How many other people must you gather for the chance that **at least one of them shares your birthday** to be more than one half?',
      hints: ['Each other person misses your birthday with chance 364/365.', 'Find the smallest n with (364/365)ⁿ < 1/2.'],
      explain: '**253.** Each person misses your birthday with chance 364/365, so n people all miss it with chance (364/365)ⁿ, which first falls below 1/2 at n = 253. Compare 23 for *any* shared birthday: there, every pair counts; here, only pairs that include you.',
      data: {
        answer: { num: 253, unit: 'people' },
        traps: [{ match: 183, msg: 'Half of 365 — but people can share birthdays with each other, so you need more than that.' }, { match: 23, msg: 'That is for any two people to share. Here it has to be your birthday.' }],
        glyph: '🎁', figure: SIM('birthday', { n: 150, mine: true }, 470)
      },
      concepts: ['probability'], links: ['prob-birthday']
    },
    {
      id: 'prob-birthday-70', title: 'Seventy Guests', diff: 2,
      text: 'At a party of **70** people, about how likely is it that at least two share a birthday?',
      hints: ['At 23 people it is already 50 %. How fast does it grow?'],
      explain: 'About **99.9 %**. The chance that all 70 birthdays differ is the product 365/365 × 364/365 × … × 296/365, which is about 0.0008. By 57 people the chance of a shared birthday is already 99 %.',
      data: {
        answer: { choice: 3, choices: ['About 20 %', 'About 50 %', 'About 75 %', 'About 99.9 %'] },
        traps: [{ match: 0, msg: '70 is only a fifth of 365 — but it makes 2,415 pairs.' }, { match: 1, msg: 'That is the chance at 23 people.' }],
        glyph: '70', figure: SIM('birthday', { n: 70, mine: false }, 470)
      },
      concepts: ['probability'], links: ['prob-birthday']
    },

    /* ---------- Efron and Penney ---------- */
    {
      id: 'prob-efron-pick', title: 'Efron\'s Dice', diff: 3, year: 1970,
      source: 'Invented by the statistician Bradley Efron; described by Martin Gardner in *Scientific American* (December 1970).',
      text: 'Four special dice: **A** has faces 4 4 4 4 0 0; **B** 3 3 3 3 3 3; **C** 6 6 2 2 2 2; **D** 5 5 5 1 1 1. Your friend picks a die, you pick another, you both roll, and the higher number wins. Your friend picks **A**.\n\nWhich die should you pick?',
      hints: ['Work out, for each of your choices, the chance of beating A.', 'D rolls 5 half the time (beating anything on A); and when D rolls 1, A might roll 0.'],
      explain: 'Pick **D**: it beats A two times in three (½ + ½ × ⅓). Stranger still, B beats C, C beats D and — as you saw — D beats A, while A beats B, each two times in three. There is no best die: whatever your friend picks, one of the others beats it. The same trick makes a fine bar bet, as long as you always let the other person choose first.',
      data: {
        answer: { choice: 3, choices: ['A as well', 'B', 'C', 'D'] },
        traps: [{ match: 1, msg: 'A beats B two times in three — B always rolls 3, and A rolls 4 most of the time.' }, { match: 2, msg: 'C beats A only 5 times in 9. One die does better.' }],
        glyph: '⚃', figure: { fig: 'prob-efron', params: { friend: 'A', mine: 'B' }, w: 620, h: 470 }
      },
      concepts: ['nontransitive', 'probability'], links: ['prob-efron-cd', 'prob-efron-best']
    },
    {
      id: 'prob-efron-cd', title: 'C Against D', diff: 3,
      text: 'With Efron\'s dice — **C**: 6 6 2 2 2 2 and **D**: 5 5 5 1 1 1 — what is the chance that C rolls higher than D?',
      hints: ['C rolls 6 one time in three, and then it always wins.', 'When C rolls 2, it wins only if D rolls 1.'],
      explain: '**2/3**: C wins outright with a 6 (chance 1/3), and with a 2 it wins when D rolls 1 (chance 2/3 × 1/2 = 1/3). So 1/3 + 1/3 = 2/3.',
      data: {
        answer: { num: 2 / 3, show: '2/3', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'Both dice have the same average (3), but C still wins more often.' }, { match: 1 / 3, msg: 'That is only the 6s. The 2s win sometimes too.' }],
        glyph: 'C>D', figure: { fig: 'prob-efron', params: { friend: 'D', mine: 'C' }, w: 620, h: 470 }
      },
      concepts: ['nontransitive'], links: ['prob-efron-pick']
    },
    {
      id: 'prob-efron-best', title: 'Is There a Best Die?', diff: 2,
      text: 'With Efron\'s four dice (A 4 4 4 4 0 0, B 3 3 3 3 3 3, C 6 6 2 2 2 2, D 5 5 5 1 1 1), is there one die that beats each of the others more often than not?',
      hints: ['Check the chain: A against B, B against C, C against D, D against A.'],
      explain: '**No.** A beats B, B beats C, C beats D and D beats A, each two times in three. Every die has one that beats it, so whoever chooses second can always choose well. "Beats" here is *non-transitive*, like rock, paper, scissors — but with dice, which makes it far more surprising.',
      data: {
        answer: { choice: 1, choices: ['Yes: A', 'No: each is beaten by another', 'Yes: D', 'Yes: they are all equal'] },
        traps: [{ match: 0, msg: 'A beats B, but D beats A two times in three.' }, { match: 2, msg: 'D beats A, but C beats D two times in three.' }],
        glyph: '↻', figure: { fig: 'prob-efron', params: { friend: 'D', mine: 'A' }, w: 620, h: 470 }
      },
      concepts: ['nontransitive'], links: ['prob-efron-pick']
    },
    {
      id: 'prob-penney', title: 'Penney\'s Game', diff: 4, year: 1969,
      source: 'Walter Penney, in the *Journal of Recreational Mathematics* (1969); popularised by Martin Gardner.',
      text: 'A fair coin is tossed again and again. Your friend bets on the pattern **H H H** and you on **T H H**: whoever\'s three-toss pattern turns up first wins.\n\nWhat is your chance of winning?',
      hints: ['Your friend wins only if the first three tosses are all heads.', 'If any tail has come before the first HHH, then THH must have happened just before HHH could.'],
      explain: '**7/8.** Your friend can only win if the very first three tosses are H H H (chance 1/8). Otherwise there has been a tail somewhere before the first run of three heads — and the moment three heads first line up, a T H H has just appeared before them. So you win 7 times in 8. In Penney\'s game every pattern has a counter-pattern that beats it; the second player always has the edge.',
      data: {
        answer: { num: 7 / 8, show: '7/8', tol: 0.003 },
        traps: [{ match: 0.5, msg: 'Each pattern has chance 1/8 at any given spot, but they race each other — and overlap.' }],
        glyph: 'THH', figure: SIM('penney', { a: 'HHH', b: 'THH' }, 470)
      },
      concepts: ['probability', 'nontransitive'], links: ['prob-penney-reply', 'prob-wait-hh']
    },
    {
      id: 'prob-penney-reply', title: 'The Best Reply', diff: 4,
      text: 'In Penney\'s game your friend now picks **H T H**. Which of these patterns gives you the best chance of seeing yours first?',
      hints: ['The winning reply to a pattern ab c is usually (not b) a b: flip the middle, put it in front, drop the last.', 'Try your choices with the buttons on the card.'],
      explain: '**H H T** wins two times in three. The rule for the best reply to any pattern is: take its first two tosses, put the opposite of the middle toss in front, and drop the last. For H T H that gives H H T. Once H H appears, H H T is certain to come before H T H — any T that follows completes it.',
      data: {
        answer: { choice: 1, choices: ['T H T', 'H H T', 'T T H', 'H T T'] },
        traps: [{ match: 0, msg: 'T H T is an even match against H T H. There is a better reply.' }, { match: 3, msg: 'H T T only just has the edge. There is a much better reply.' }],
        glyph: 'HHT', figure: SIM('penney', { a: 'HTH', b: 'THT' }, 470)
      },
      concepts: ['nontransitive'], links: ['prob-penney']
    }
  ];

  Cabinet.family({
    id: 'probability', engine: 'question', cat: 'chance', name: 'Chance and paradox', order: 1,
    blurb: 'Monty Hall, Bertrand\'s box, the boy or girl, the birthday party, Efron\'s dice and Buffon\'s needle — work out the exact answer, then run the experiment and watch it come true.',
    about: 'Work out the chance, then **run the experiment** on the card: *Once* shows a single trial, *×10*, *×100* and *×1000* run many and plot how the frequency settles. The exact value appears on the chart once you have answered. Answers may be fractions (2/3), decimals (0.667) or percentages; a little rounding is allowed.',
    origin: { year: 1654, who: 'Pascal, Fermat and the gamblers', note: 'Probability theory began with gamblers\' questions put to Pascal and Fermat in 1654. Its paradoxes have been catching out clever people ever since — none more than the Monty Hall problem in 1990.' },
    concepts: ['probability', 'conditional-probability', 'expected-value', 'law-of-large-numbers'],
    deps: ['js/lib/figures.js']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
