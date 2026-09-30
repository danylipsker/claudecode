/* The Puzzle Cabinet · tools/gen/words.js
 *
 *   node tools/gen/words.js       writes data/word-ladders.js, data/cryptograms.js, data/anagrams.js
 *
 * Word ladders: Lewis Carroll's own Doublets, two of Nabokov's "word golf"
 * holes, themed pairs, then a few made by search. Every par is the length of
 * the shortest ladder in js/lib/wordlist.js, found by breadth-first search.
 * Cryptograms: public-domain quotations (authors who died long ago, the King
 * James Bible, proverbs), each enciphered with a seeded random derangement.
 * Anagrams: themed words with a clue; every answer is the only one of its
 * theme (or of the dictionary) that the letters spell.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/wordlist.js'));
require(path.join(ROOT, 'engines/words.js'));
const E = C.wordPuzzles, W = C.words, eng = C.engines.words;
const up = (s) => String(s).toUpperCase();
const q = (v) => JSON.stringify(v);

function write(file, header, meta, list, pre) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/words.js' + (header ? '\n * ' + header : '') + ' */');
  if (pre) lines.push(pre);
  lines.push('Cabinet.family(' + meta + ', [');
  list.forEach((p, i) => {
    const keys = Object.keys(p);
    const body = keys.map((k) => '    ' + k + ': ' + q(p[k])).join(',\n');
    lines.push('  {\n' + body + '\n  }' + (i < list.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), out);
  console.log('wrote data/' + file + ': ' + list.length + ' puzzles, ' + Math.round(out.length / 1024) + ' KB');
}
function check(p) {
  const r = eng.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
}
function spread(list) {
  const n = [0, 0, 0, 0, 0, 0];
  list.forEach((p) => n[p.diff]++);
  return n.slice(1).map((v, i) => 'D' + (i + 1) + ' ' + v).join(', ');
}

/* =====================================================================
 * Word ladders
 * ===================================================================== */

const CARROLL_SRC = 'Lewis Carroll, *Doublets: A Word-Puzzle* (1879), first set in *Vanity Fair*.';
// Carroll's own pairs, with the words he used to set them
const CARROLL = [
  ['head', 'tail', 'Head to Tail', 'Carroll explained his new game with this pair: turn **HEAD** into **TAIL**.'],
  ['pig', 'sty', 'Drive Pig into Sty', 'Carroll\'s challenge: *drive PIG into STY*.'],
  ['four', 'five', 'Raise Four to Five', 'Carroll\'s challenge: *raise FOUR to FIVE*.'],
  ['wheat', 'bread', 'Make Wheat into Bread', 'Carroll\'s challenge: *make WHEAT into BREAD*.'],
  ['pen', 'ink', 'Dip Pen into Ink', 'Carroll\'s challenge: *dip PEN into INK*.'],
  ['chin', 'nose', 'Touch Chin with Nose', 'Carroll\'s challenge: *touch CHIN with NOSE*.'],
  ['tears', 'smile', 'Change Tears into Smile', 'Carroll\'s challenge: *change TEARS into SMILE*.'],
  ['wet', 'dry', 'Change Wet to Dry', 'Carroll\'s challenge: *change WET to DRY*.'],
  ['eye', 'lid', 'Cover Eye with Lid', 'Carroll\'s challenge: *cover EYE with LID*.'],
  ['grass', 'green', 'Prove Grass Green', 'Carroll\'s challenge: *prove GRASS to be GREEN*.'],
  ['ape', 'man', 'Evolve Man from Ape', 'Carroll\'s challenge, written twenty years after *The Origin of Species*: *evolve MAN from APE*.'],
  ['oat', 'rye', 'Change Oat to Rye', 'Carroll\'s challenge: *change OAT to RYE*.'],
  ['tree', 'wood', 'Get Wood from Tree', 'Carroll\'s challenge: *get WOOD from TREE*.'],
  ['pity', 'good', 'Prove Pity Good', 'Carroll\'s challenge: *prove PITY to be GOOD*.'],
  ['poor', 'rich', 'Turn Poor into Rich', 'Carroll\'s challenge: *turn POOR into RICH*.'],
  ['black', 'white', 'Change Black to White', 'Carroll\'s challenge: *change BLACK to WHITE*.'],
  ['elm', 'oak', 'Change Elm into Oak', 'Carroll\'s challenge: *change ELM into OAK*.'],
  ['army', 'navy', 'Combine Army and Navy', 'Carroll\'s challenge: *combine ARMY and NAVY*.'],
  ['flour', 'bread', 'Make Flour into Bread', 'Carroll\'s challenge: *make FLOUR into BREAD*.'],
  ['river', 'shore', 'Change River to Shore', 'Carroll\'s challenge: *change RIVER to SHORE*. A long way round in this dictionary — Carroll allowed rarer words than we do.']
];

const NABOKOV = 'Vladimir Nabokov\'s novel *Pale Fire* (1962) calls this game *word golf*, and mentions turning HATE into LOVE in three and LASS into MALE in four.';

// themed pairs: [from, to, title, statement]
const THEMED = [
  ['cub', 'pup', 'Cub to Pup', 'A warm-up: turn the **CUB** into a **PUP**.'],
  ['cat', 'dog', 'Cat and Dog', 'Turn the **CAT** into a **DOG**. Neither of them will thank you.'],
  ['sun', 'sky', 'Sun in the Sky', 'Put the **SUN** up in the **SKY**.'],
  ['cup', 'mug', 'Cup to Mug', 'Swap the dainty **CUP** for a sturdy **MUG**.'],
  ['tea', 'pot', 'Tea for Two', 'Get the **TEA** into the **POT**.'],
  ['bow', 'tie', 'Bow Tie', 'Tie a **BOW** into a **TIE**.'],
  ['boy', 'man', 'Growing Up', 'Turn the **BOY** into a **MAN** — it takes only a few years here.'],
  ['dad', 'mum', 'Dad to Mum', 'Turn **DAD** into **MUM**.'],
  ['sky', 'sea', 'Sky and Sea', 'Bring the **SKY** down to the **SEA**.'],
  ['lead', 'gold', 'The Alchemist', 'The alchemists spent centuries trying to turn **LEAD** into **GOLD**. You may manage it in a few minutes.'],
  ['cats', 'dogs', 'Raining Cats and Dogs', 'It is raining **CATS**. Make it rain **DOGS**.'],
  ['bed', 'cot', 'Bed to Cot', 'Shrink the **BED** into a **COT**.'],
  ['cow', 'pig', 'Farmyard Swap', 'Turn the **COW** into a **PIG**.'],
  ['fox', 'hen', 'Fox in the Henhouse', 'Turn the **FOX** into a **HEN**. The hens would rather you did it the other way round.'],
  ['sea', 'bay', 'Sea to Bay', 'Sail out of the **SEA** and into the **BAY**.'],
  ['run', 'hop', 'Run and Hop', 'Slow the **RUN** to a **HOP**.'],
  ['mud', 'pie', 'Mud Pie', 'Bake the **MUD** into a **PIE**.'],
  ['fall', 'rise', 'Rise and Fall', 'Turn the **FALL** into a **RISE**.'],
  ['give', 'take', 'Give and Take', 'Turn **GIVE** into **TAKE**.'],
  ['mice', 'rats', 'Mice to Rats', 'Grow the **MICE** into **RATS**.'],
  ['fire', 'wood', 'Firewood', 'Turn **FIRE** back into **WOOD** — the opposite of what usually happens.'],
  ['tame', 'wild', 'Call of the Wild', 'Turn **TAME** into **WILD**.'],
  ['dark', 'lamp', 'Light a Lamp', 'It is **DARK**: find a **LAMP**.'],
  ['cold', 'warm', 'Warming Up', 'Turn **COLD** into **WARM**.'],
  ['less', 'more', 'Less Is More', 'Turn **LESS** into **MORE**.'],
  ['sick', 'well', 'Get Well Soon', 'Make the **SICK** **WELL** again.'],
  ['ant', 'bee', 'Busy Insects', 'Turn the **ANT** into a **BEE**.'],
  ['love', 'kiss', 'Love and Kisses', 'Turn **LOVE** into a **KISS**.'],
  ['hard', 'easy', 'Hard to Easy', 'Make **HARD** into **EASY** — which is what practice does.'],
  ['lost', 'find', 'Lost and Found', 'Turn **LOST** into **FIND**.'],
  ['hand', 'foot', 'Hand and Foot', 'Turn the **HAND** into a **FOOT**.'],
  ['head', 'foot', 'Head to Foot', 'Go from **HEAD** to **FOOT**.'],
  ['rose', 'lily', 'Rose to Lily', 'Turn the **ROSE** into a **LILY**.'],
  ['star', 'moon', 'Star to Moon', 'Turn a **STAR** into the **MOON**.'],
  ['boat', 'ship', 'Boat to Ship', 'Grow the little **BOAT** into a **SHIP**.'],
  ['word', 'game', 'Word Game', 'Turn **WORD** into **GAME**.'],
  ['coin', 'cash', 'Coin to Cash', 'Turn the **COIN** into **CASH**.'],
  ['ride', 'walk', 'Ride or Walk', 'Get off the **RIDE** and **WALK**.'],
  ['seed', 'tree', 'Seed to Tree', 'Grow the **SEED** into a **TREE** — faster than nature does it.'],
  ['root', 'leaf', 'Root to Leaf', 'Climb from the **ROOT** to the **LEAF**.'],
  ['bird', 'nest', 'Bird in the Nest', 'Put the **BIRD** back in its **NEST**.'],
  ['goat', 'milk', 'Goat\'s Milk', 'Turn the **GOAT** into **MILK**.'],
  ['moon', 'glow', 'Moonglow', 'Turn the **MOON** into a **GLOW**.'],
  ['cake', 'pies', 'Cakes and Pies', 'Turn the **CAKE** into **PIES**.'],
  ['dawn', 'dusk', 'Dawn till Dusk', 'Work from **DAWN** till **DUSK**.'],
  ['wind', 'rain', 'Wind and Rain', 'Turn the **WIND** into **RAIN**.'],
  ['owl', 'bat', 'Night Flyers', 'Turn the **OWL** into a **BAT**.'],
  ['fly', 'web', 'Into the Web', '"Will you walk into my parlour?" Walk the **FLY** into the **WEB**.'],
  ['snow', 'melt', 'The Thaw', 'Make the **SNOW** **MELT**.'],
  ['fast', 'slow', 'Fast to Slow', 'Turn **FAST** into **SLOW**.'],
  ['fool', 'sage', 'Fool to Sage', 'Turn the **FOOL** into a **SAGE**. It takes some doing.'],
  ['ring', 'bell', 'Ring the Bell', 'Turn **RING** into **BELL**.'],
  ['book', 'page', 'Book to Page', 'Turn the **BOOK** into a **PAGE**.'],
  ['card', 'deck', 'Card to Deck', 'Turn one **CARD** into a whole **DECK**.'],
  ['hope', 'fear', 'Hope and Fear', 'Turn **HOPE** into **FEAR**.'],
  ['sink', 'swim', 'Sink or Swim', 'Turn **SINK** into **SWIM**.'],
  ['nest', 'tree', 'Nest in a Tree', 'Lift the **NEST** into the **TREE**.'],
  ['mine', 'coal', 'Down the Mine', 'Bring the **COAL** up from the **MINE** — or rather, turn **MINE** into **COAL**.'],
  ['fish', 'bird', 'Fins to Feathers', 'Turn the **FISH** into a **BIRD**.'],
  ['ship', 'dock', 'Into Harbour', 'Bring the **SHIP** into **DOCK**.'],
  ['rain', 'snow', 'Rain to Snow', 'The weather turns: make the **RAIN** into **SNOW**.'],
  ['soup', 'nuts', 'Soup to Nuts', 'A whole dinner, from **SOUP** to **NUTS** — every course in between must be a word.'],
  ['sleep', 'dream', 'Sleep and Dream', 'Drift from **SLEEP** into a **DREAM**.'],
  ['comb', 'hair', 'Comb Your Hair', 'Turn the **COMB** into **HAIR**.'],
  ['wolf', 'lamb', 'Wolf and Lamb', 'Turn the **WOLF** into a **LAMB** — a long way round, as you would expect.'],
  ['old', 'new', 'Old to New', 'Make the **OLD** **NEW**.'],
  ['work', 'play', 'All Work and No Play', 'Turn **WORK** into **PLAY**.'],
  ['one', 'two', 'One, Two', 'Count from **ONE** to **TWO**, a letter at a time.'],
  ['egg', 'hen', 'Which Came First?', 'Turn the **EGG** into a **HEN**. Which came first? Here, the egg does.'],
  ['smile', 'frown', 'Upside Down', 'Turn that **SMILE** into a **FROWN**. (Only for the puzzle.)'],
  ['stone', 'bread', 'Stone into Bread', 'Turn **STONE** into **BREAD** — a small miracle in a good many steps.']
];

function ladderDiff(par) { return par <= 3 ? 1 : par === 4 ? 2 : par === 5 ? 3 : par === 6 ? 4 : 5; }

function makeLadders() {
  const out = [];
  const seen = new Set();
  const add = (from, to, title, text, extra) => {
    const L = E.ladder(from, to);
    if (!L || L.steps < 2) { console.warn('  skip ladder ' + from + '-' + to + ': ' + (L ? L.steps : 'no words')); return; }
    const id = 'ladder-' + from + '-' + to;
    if (seen.has(id)) return;
    seen.add(id);
    const p = Object.assign({ id, title, diff: ladderDiff(L.steps) }, extra && extra.year ? { year: extra.year } : {}, extra && extra.source ? { source: extra.source } : {}, {
      text,
      data: { kind: 'ladder', from, to },
      par: L.steps,
      concepts: ['state-space'],
      tags: ['ladder'].concat(extra && extra.tags || [])
    });
    if (extra && extra.explain) p.explain = extra.explain(L);
    check(p);
    out.push(p);
  };
  const pathText = (L) => L.path.map(up).join(' → ');
  CARROLL.forEach(([a, b, title, text]) => add(a, b, title, text, {
    year: 1879, source: CARROLL_SRC, tags: ['carroll', 'classic'],
    explain: (L) => 'A shortest ladder (' + C.plural(L.steps, 'step') + '): ' + pathText(L) + '.' +
      (a === 'head' ? ' It is the very ladder Carroll printed when he introduced the game: heal, teal, tell, tall.' : '') +
      (L.count > 1 ? ' There are ' + L.count + ' shortest ladders in this dictionary.' : '') +
      '\n\nCarroll called the two words a *doublet*, the words between them *links*, and the whole series a *chain* — and the fewer links, the better. He published the game in *Vanity Fair* in 1879.'
  }));
  [['hate', 'love', 'Word Golf: Hate to Love'], ['lass', 'male', 'Word Golf: Lass to Male']].forEach(([a, b, title]) => add(a, b, title, 'A hole of *word golf*: turn **' + up(a) + '** into **' + up(b) + '**.', {
    tags: ['nabokov', 'classic'],
    explain: (L) => 'A shortest ladder (' + C.plural(L.steps, 'step') + '): ' + pathText(L) + '.\n\n' + NABOKOV
  }));
  THEMED.forEach(([a, b, title, text]) => add(a, b, title, text, { tags: ['themed'] }));
  // a few more made by search, for an even spread (the same code as the Endless drawer)
  const rng = C.rng(18790329);
  const want = { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 };
  for (let lv = 1; lv <= 5; lv++) {
    for (let k = 0, tries = 0; k < want[lv] && tries < 200; tries++) {
      const L = E.makeLadder(rng, lv);
      if (!L || seen.has('ladder-' + L.from + '-' + L.to)) continue;
      add(L.from, L.to, L.from.charAt(0).toUpperCase() + L.from.slice(1) + ' to ' + L.to.charAt(0).toUpperCase() + L.to.slice(1), 'Turn **' + up(L.from) + '** into **' + up(L.to) + '**.', { tags: ['search'] });
      k++;
    }
  }
  out.sort((x, y) => x.diff - y.diff || x.par - y.par || x.data.from.length - y.data.from.length || (x.year ? -1 : 0) - (y.year ? -1 : 0));
  // the first of Carroll's goes first on its shelf
  const head = out.findIndex((p) => p.id === 'ladder-head-tail');
  if (head > 0) { const [h] = out.splice(head, 1); const at = out.findIndex((p) => p.diff === h.diff); out.splice(at, 0, h); }
  return out;
}

/* =====================================================================
 * Cryptograms: public-domain quotations, quoted exactly (modern spelling)
 * Append only: a quotation's place in this list is its id.
 * ===================================================================== */

const WS = 'William Shakespeare', KJV = 'The King James Bible', BF = 'Benjamin Franklin', PR = '*Poor Richard\'s Almanack*';
const RWE = 'Ralph Waldo Emerson', HDT = 'Henry David Thoreau', WAL = '*Walden* (1854)', AL = 'Abraham Lincoln';
const JA = 'Jane Austen', PP = '*Pride and Prejudice* (1813)', CD = 'Charles Dickens', LC = 'Lewis Carroll';
const AW = '*Alice\'s Adventures in Wonderland* (1865)', LG = '*Through the Looking-Glass* (1871)';
const OW = 'Oscar Wilde', LWF = '*Lady Windermere\'s Fan* (1892)', DG = '*The Picture of Dorian Gray* (1890)', IBE = '*The Importance of Being Earnest* (1895)';
const MT = 'Mark Twain', PW = '*Pudd\'nhead Wilson* (1894)', FE = '*Following the Equator* (1897)', PV = 'Proverb';

const QUOTES = [
  // Shakespeare
  ['To be, or not to be: that is the question.', WS, '*Hamlet*'],
  ['All the world\'s a stage, and all the men and women merely players.', WS, '*As You Like It*'],
  ['The course of true love never did run smooth.', WS, '*A Midsummer Night\'s Dream*'],
  ['Brevity is the soul of wit.', WS, '*Hamlet*', 'Polonius says it — in one of the longest-winded speeches in the play.'],
  ['Neither a borrower nor a lender be.', WS, '*Hamlet*', 'Polonius\'s advice to his son Laertes.'],
  ['This above all: to thine own self be true.', WS, '*Hamlet*'],
  ['The lady doth protest too much, methinks.', WS, '*Hamlet*'],
  ['Something is rotten in the state of Denmark.', WS, '*Hamlet*'],
  ['Now is the winter of our discontent made glorious summer by this sun of York.', WS, '*Richard III*'],
  ['A horse! a horse! my kingdom for a horse!', WS, '*Richard III*'],
  ['If music be the food of love, play on.', WS, '*Twelfth Night*'],
  ['Friends, Romans, countrymen, lend me your ears.', WS, '*Julius Caesar*'],
  ['Cowards die many times before their deaths; the valiant never taste of death but once.', WS, '*Julius Caesar*'],
  ['The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings.', WS, '*Julius Caesar*'],
  ['Beware the ides of March.', WS, '*Julius Caesar*'],
  ['We are such stuff as dreams are made on, and our little life is rounded with a sleep.', WS, '*The Tempest*'],
  ['Lord, what fools these mortals be!', WS, '*A Midsummer Night\'s Dream*', 'Puck says it, watching the lovers in the wood.'],
  ['All that glisters is not gold.', WS, '*The Merchant of Venice*', 'Shakespeare wrote *glisters*; the proverb usually says *glitters*.'],
  ['Uneasy lies the head that wears a crown.', WS, '*Henry IV, Part 2*'],
  ['Once more unto the breach, dear friends, once more.', WS, '*Henry V*'],
  ['We few, we happy few, we band of brothers.', WS, '*Henry V*'],
  ['Double, double toil and trouble; fire burn and cauldron bubble.', WS, '*Macbeth*'],
  ['Is this a dagger which I see before me?', WS, '*Macbeth*'],
  ['Life\'s but a walking shadow, a poor player that struts and frets his hour upon the stage.', WS, '*Macbeth*'],
  ['O Romeo, Romeo! wherefore art thou Romeo?', WS, '*Romeo and Juliet*', '*Wherefore* means *why*, not *where*: Juliet is asking why he has to be a Montague.'],
  ['The better part of valour is discretion.', WS, '*Henry IV, Part 1*', 'Falstaff\'s excuse for playing dead on the battlefield.'],
  ['Though this be madness, yet there is method in\'t.', WS, '*Hamlet*'],
  ['There is nothing either good or bad, but thinking makes it so.', WS, '*Hamlet*'],
  ['Love all, trust a few, do wrong to none.', WS, '*All\'s Well That Ends Well*'],
  ['How sharper than a serpent\'s tooth it is to have a thankless child!', WS, '*King Lear*'],
  ['Shall I compare thee to a summer\'s day? Thou art more lovely and more temperate.', WS, 'Sonnet 18'],
  ['Who steals my purse steals trash.', WS, '*Othello*'],
  ['Misery acquaints a man with strange bedfellows.', WS, '*The Tempest*'],
  ['O brave new world, that has such people in\'t!', WS, '*The Tempest*'],
  ['Exit, pursued by a bear.', WS, '*The Winter\'s Tale*', 'Not a line anyone speaks: it is the most famous stage direction in English.'],
  ['Better three hours too soon than a minute too late.', WS, '*The Merry Wives of Windsor*'],
  // The King James Bible (1611)
  ['In the beginning God created the heaven and the earth.', KJV, 'Genesis 1:1'],
  ['Am I my brother\'s keeper?', KJV, 'Genesis 4:9'],
  ['To every thing there is a season, and a time to every purpose under the heaven.', KJV, 'Ecclesiastes 3:1'],
  ['There is no new thing under the sun.', KJV, 'Ecclesiastes 1:9'],
  ['The race is not to the swift, nor the battle to the strong.', KJV, 'Ecclesiastes 9:11'],
  ['Pride goeth before destruction, and an haughty spirit before a fall.', KJV, 'Proverbs 16:18'],
  ['A soft answer turneth away wrath: but grievous words stir up anger.', KJV, 'Proverbs 15:1'],
  ['Go to the ant, thou sluggard; consider her ways, and be wise.', KJV, 'Proverbs 6:6'],
  ['Cast thy bread upon the waters: for thou shalt find it after many days.', KJV, 'Ecclesiastes 11:1'],
  ['Consider the lilies of the field, how they grow; they toil not, neither do they spin.', KJV, 'Matthew 6:28'],
  ['Physician, heal thyself.', KJV, 'Luke 4:23'],
  ['For now we see through a glass, darkly; but then face to face.', KJV, '1 Corinthians 13:12'],
  ['Whatsoever a man soweth, that shall he also reap.', KJV, 'Galatians 6:7'],
  ['Can the Ethiopian change his skin, or the leopard his spots?', KJV, 'Jeremiah 13:23'],
  ['Ye are the salt of the earth.', KJV, 'Matthew 5:13'],
  ['A merry heart doeth good like a medicine.', KJV, 'Proverbs 17:22'],
  ['How are the mighty fallen!', KJV, '2 Samuel 1:19'],
  ['Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.', KJV, 'Proverbs 27:17'],
  // Benjamin Franklin
  ['Early to bed and early to rise, makes a man healthy, wealthy and wise.', BF, PR],
  ['Three may keep a secret, if two of them are dead.', BF, PR],
  ['God helps them that help themselves.', BF, PR],
  ['Well done is better than well said.', BF, PR],
  ['He that lies down with dogs, shall rise up with fleas.', BF, PR],
  ['Eat to live, and not live to eat.', BF, PR],
  ['Little strokes fell great oaks.', BF, PR],
  ['The used key is always bright.', BF, PR],
  ['He that falls in love with himself, will have no rivals.', BF, PR],
  ['Genius without education is like silver in the mine.', BF, PR],
  ['Having been poor is no shame, but being ashamed of it, is.', BF, PR],
  // Emerson and Thoreau
  ['To be great is to be misunderstood.', RWE, '*Self-Reliance* (1841)'],
  ['A foolish consistency is the hobgoblin of little minds.', RWE, '*Self-Reliance* (1841)'],
  ['Nothing great was ever achieved without enthusiasm.', RWE, '*Circles* (1841)'],
  ['The only way to have a friend is to be one.', RWE, '*Friendship* (1841)'],
  ['Hitch your wagon to a star.', RWE, '*Civilization* (1870)'],
  ['Here once the embattled farmers stood, and fired the shot heard round the world.', RWE, '*Concord Hymn* (1837)'],
  ['The mass of men lead lives of quiet desperation.', HDT, WAL],
  ['I went to the woods because I wished to live deliberately.', HDT, WAL],
  ['Our life is frittered away by detail.', HDT, WAL],
  ['If a man does not keep pace with his companions, perhaps it is because he hears a different drummer.', HDT, WAL],
  ['Heaven is under our feet as well as over our heads.', HDT, WAL],
  ['It is never too late to give up our prejudices.', HDT, WAL],
  // Lincoln
  ['A house divided against itself cannot stand.', AL, 'the "House Divided" speech (1858)', 'Lincoln was quoting the Gospel of Mark.'],
  ['With malice toward none, with charity for all.', AL, 'the Second Inaugural Address (1865)'],
  ['We are not enemies, but friends. We must not be enemies.', AL, 'the First Inaugural Address (1861)'],
  ['Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.', AL, 'the Gettysburg Address (1863)', 'A *score* is twenty: four score and seven years before 1863 is 1776.'],
  // Austen and Dickens
  ['It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.', JA, PP],
  ['I declare after all there is no enjoyment like reading!', JA, PP, 'Caroline Bingley says it — while pretending to read, to impress Mr Darcy.'],
  ['For what do we live, but to make sport for our neighbours, and laugh at them in our turn?', JA, PP, 'Mr Bennet, of course.'],
  ['One half of the world cannot understand the pleasures of the other.', JA, '*Emma* (1815)'],
  ['It was the best of times, it was the worst of times.', CD, '*A Tale of Two Cities* (1859)'],
  ['It is a far, far better thing that I do, than I have ever done.', CD, '*A Tale of Two Cities* (1859)'],
  ['Please, sir, I want some more.', CD, '*Oliver Twist* (1838)'],
  ['God bless Us, Every One!', CD, '*A Christmas Carol* (1843)', 'Tiny Tim has the last word of the book.'],
  ['Marley was dead: to begin with.', CD, '*A Christmas Carol* (1843)'],
  ['There is nothing in the world so irresistibly contagious as laughter and good-humour.', CD, '*A Christmas Carol* (1843)'],
  ['Annual income twenty pounds, annual expenditure nineteen nineteen and six, result happiness.', CD, '*David Copperfield* (1850)', 'Mr Micawber\'s rule of money. Nineteen pounds, nineteen shillings and sixpence is sixpence less than twenty pounds; sixpence more, he goes on, and the result is misery.'],
  // Carroll
  ['Curiouser and curiouser!', LC, AW],
  ['Why, sometimes I\'ve believed as many as six impossible things before breakfast.', LC, LG, 'The White Queen, to Alice.'],
  ['It\'s no use going back to yesterday, because I was a different person then.', LC, AW],
  ['Begin at the beginning, and go on till you come to the end: then stop.', LC, AW, 'The King of Hearts, instructing the White Rabbit.'],
  ['\'Twas brillig, and the slithy toves did gyre and gimble in the wabe.', LC, LG, 'From *Jabberwocky*. Humpty Dumpty later explains that *slithy* means lithe and slimy, and that a *tove* is something like a badger.'],
  ['The time has come, the Walrus said, to talk of many things: of shoes and ships and sealing-wax, of cabbages and kings.', LC, LG],
  ['If everybody minded their own business, the world would go round a deal faster than it does.', LC, AW, 'The Duchess, who is not minding her own business at all.'],
  ['Take care of the sense, and the sounds will take care of themselves.', LC, AW],
  ['When I use a word, it means just what I choose it to mean, neither more nor less.', LC, LG, 'Humpty Dumpty.'],
  ['It takes all the running you can do, to keep in the same place.', LC, LG, 'The Red Queen explains her country to Alice.'],
  // Wilde
  ['I can resist everything except temptation.', OW, LWF],
  ['We are all in the gutter, but some of us are looking at the stars.', OW, LWF],
  ['There is only one thing in the world worse than being talked about, and that is not being talked about.', OW, DG],
  ['The truth is rarely pure and never simple.', OW, IBE],
  ['A man who knows the price of everything and the value of nothing.', OW, LWF, 'Lord Darlington\'s answer to the question *What is a cynic?*'],
  ['Experience is the name every one gives to their mistakes.', OW, LWF],
  ['I never travel without my diary. One should always have something sensational to read in the train.', OW, IBE],
  // Twain
  ['Man is the only animal that blushes. Or needs to.', MT, FE],
  ['Let us endeavor so to live that when we come to die even the undertaker will be sorry.', MT, PW],
  ['Few things are harder to put up with than the annoyance of a good example.', MT, PW],
  ['Cauliflower is nothing but cabbage with a college education.', MT, PW],
  ['When angry, count four; when very angry, swear.', MT, PW],
  ['Nothing so needs reforming as other people\'s habits.', MT, PW],
  ['One of the most striking differences between a cat and a lie is that a cat has only nine lives.', MT, PW],
  ['Work consists of whatever a body is obliged to do.', MT, '*The Adventures of Tom Sawyer* (1876)', 'Tom has just talked his friends into paying him for the privilege of whitewashing his fence. Play, Twain goes on, is whatever a body is not obliged to do.'],
  // poets and others
  ['To err is human, to forgive divine.', 'Alexander Pope', '*An Essay on Criticism* (1711)'],
  ['A little learning is a dangerous thing.', 'Alexander Pope', '*An Essay on Criticism* (1711)'],
  ['Fools rush in where angels fear to tread.', 'Alexander Pope', '*An Essay on Criticism* (1711)'],
  ['Hope springs eternal in the human breast.', 'Alexander Pope', '*An Essay on Man*'],
  ['No man is an island, entire of itself.', 'John Donne', '*Devotions upon Emergent Occasions* (1624)'],
  ['A thing of beauty is a joy for ever.', 'John Keats', '*Endymion* (1818)'],
  ['To see a world in a grain of sand, and a heaven in a wild flower.', 'William Blake', '*Auguries of Innocence*'],
  ['Tyger Tyger, burning bright, in the forests of the night.', 'William Blake', '*The Tyger* (1794)'],
  ['I wandered lonely as a cloud.', 'William Wordsworth', '*I Wandered Lonely as a Cloud* (1807)'],
  ['The Child is father of the Man.', 'William Wordsworth', '*My Heart Leaps Up* (1807)'],
  ['\'Tis better to have loved and lost than never to have loved at all.', 'Alfred, Lord Tennyson', '*In Memoriam A.H.H.* (1850)'],
  ['Theirs not to reason why, theirs but to do and die.', 'Alfred, Lord Tennyson', '*The Charge of the Light Brigade* (1854)'],
  ['To strive, to seek, to find, and not to yield.', 'Alfred, Lord Tennyson', '*Ulysses* (1842)'],
  ['Water, water, every where, nor any drop to drink.', 'Samuel Taylor Coleridge', '*The Rime of the Ancient Mariner* (1798)'],
  ['Look on my works, ye Mighty, and despair!', 'Percy Bysshe Shelley', '*Ozymandias* (1818)'],
  ['If Winter comes, can Spring be far behind?', 'Percy Bysshe Shelley', '*Ode to the West Wind* (1820)'],
  ['They also serve who only stand and wait.', 'John Milton', 'the sonnet *On His Blindness*'],
  ['Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.', 'Francis Bacon', 'the essay *Of Studies*'],
  ['When a man is tired of London, he is tired of life.', 'Samuel Johnson', 'in James Boswell\'s *Life of Samuel Johnson* (1791)'],
  ['To travel hopefully is a better thing than to arrive.', 'Robert Louis Stevenson', '*Virginibus Puerisque* (1881)'],
  ['Quoth the Raven, Nevermore.', 'Edgar Allan Poe', '*The Raven* (1845)', 'Poe loved ciphers too: writing in *Graham\'s Magazine* in 1841, he challenged readers to send him substitution ciphers and claimed he could break them all.'],
  ['All that we see or seem is but a dream within a dream.', 'Edgar Allan Poe', '*A Dream Within a Dream* (1849)'],
  ['Into each life some rain must fall.', 'Henry Wadsworth Longfellow', '*The Rainy Day*'],
  ['Reader, I married him.', 'Charlotte Brontë', '*Jane Eyre* (1847)'],
  ['Beware; for I am fearless, and therefore powerful.', 'Mary Shelley', '*Frankenstein* (1818)', 'The creature, to Victor Frankenstein.'],
  ['How do I love thee? Let me count the ways.', 'Elizabeth Barrett Browning', '*Sonnets from the Portuguese* (1850)'],
  ['Ah, but a man\'s reach should exceed his grasp, or what\'s a heaven for?', 'Robert Browning', '*Andrea del Sarto* (1855)'],
  ['Variety\'s the very spice of life, that gives it all its flavour.', 'William Cowper', '*The Task* (1785)'],
  ['The pen is mightier than the sword.', 'Edward Bulwer-Lytton', '*Richelieu* (1839)'],
  ['It was a dark and stormy night.', 'Edward Bulwer-Lytton', '*Paul Clifford* (1830)', 'The most mocked first line in English — the rest of the sentence goes on for another fifty words.'],
  ['We hold these truths to be self-evident, that all men are created equal.', 'Thomas Jefferson', 'the Declaration of Independence (1776)'],
  ['Be it ever so humble, there\'s no place like home.', 'John Howard Payne', '*Home! Sweet Home!* (1823)'],
  ['How doth the little busy bee improve each shining hour.', 'Isaac Watts', '*Against Idleness and Mischief* (1715)', 'Lewis Carroll turned it into *How doth the little crocodile improve his shining tail* in *Alice*.'],
  ['Twinkle, twinkle, little star, how I wonder what you are!', 'Jane Taylor', '*The Star* (1806)'],
  ['Mary had a little lamb, its fleece was white as snow.', 'Sarah Josepha Hale', '*Mary\'s Lamb* (1830)'],
  ['Hey diddle diddle, the cat and the fiddle, the cow jumped over the moon.', 'Nursery rhyme', 'traditional'],
  // proverbs
  ['A stitch in time saves nine.', PV, 'traditional'],
  ['Actions speak louder than words.', PV, 'traditional'],
  ['The early bird catches the worm.', PV, 'traditional'],
  ['Every cloud has a silver lining.', PV, 'traditional'],
  ['Where there\'s a will, there\'s a way.', PV, 'traditional'],
  ['Don\'t count your chickens before they are hatched.', PV, 'traditional', 'The moral usually drawn from Aesop\'s fable of the milkmaid who daydreams about what her milk will buy — and spills it.'],
  ['Too many cooks spoil the broth.', PV, 'traditional'],
  ['Many hands make light work.', PV, 'traditional'],
  ['A watched pot never boils.', PV, 'traditional'],
  ['Birds of a feather flock together.', PV, 'traditional'],
  ['Rome was not built in a day.', PV, 'traditional'],
  ['Look before you leap.', PV, 'traditional', 'The moral usually drawn from Aesop\'s fable of the fox who talks a goat into jumping down a well.'],
  ['Absence makes the heart grow fonder.', PV, 'traditional'],
  ['Necessity is the mother of invention.', PV, 'traditional'],
  ['Great oaks from little acorns grow.', PV, 'traditional'],
  ['Make hay while the sun shines.', PV, 'traditional'],
  ['Still waters run deep.', PV, 'traditional'],
  ['You can lead a horse to water, but you can\'t make it drink.', PV, 'traditional'],
  ['People who live in glass houses should not throw stones.', PV, 'traditional'],
  ['A bird in the hand is worth two in the bush.', PV, 'traditional'],
  ['Slow and steady wins the race.', PV, 'traditional', 'The moral usually drawn from Aesop\'s fable of the hare and the tortoise.'],
  ['When the cat\'s away, the mice will play.', PV, 'traditional'],
  ['A fool and his money are soon parted.', PV, 'traditional'],
  ['Time and tide wait for no man.', PV, 'traditional'],
  ['The proof of the pudding is in the eating.', PV, 'traditional', 'Not *in the pudding*: to *prove* here means to test.'],
  ['Half a loaf is better than no bread.', PV, 'traditional'],
  ['Familiarity breeds contempt.', PV, 'traditional', 'The moral usually drawn from Aesop\'s fable of the fox who, meeting a lion for the third time, strolls up and chats with him.'],
  ['Every dog has his day.', PV, 'traditional'],
  ['Two heads are better than one.', PV, 'traditional'],
  ['Hunger is the best sauce.', PV, 'traditional']
];

const STEMS = {
  [WS]: 'The Bard', [KJV]: 'Scripture', [BF]: 'Poor Richard', [RWE]: 'Emerson', [HDT]: 'Walden', [AL]: 'Lincoln', [JA]: 'Miss Austen', [CD]: 'Boz',
  [LC]: 'Wonderland', [OW]: 'Wilde Card', [MT]: 'Twain', [PV]: 'Old Saw', 'Nursery rhyme': 'Nursery'
};
const ROMAN = (n) => { const r = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, t] of r) while (n >= v) { s += t; n -= v; } return s; };
const WORDN = ['no', 'one', 'two', 'three'];

// the hardest: short with no letters given, or odd old words
const FIENDISH = new Set([
  'Exit, pursued by a bear.', 'Quoth the Raven, Nevermore.', '\'Twas brillig, and the slithy toves did gyre and gimble in the wabe.', 'Physician, heal thyself.',
  'Tyger Tyger, burning bright, in the forests of the night.', 'Curiouser and curiouser!', 'Reader, I married him.', 'Hunger is the best sauce.',
  'Who steals my purse steals trash.', 'Am I my brother\'s keeper?', 'Look before you leap.', 'Still waters run deep.', 'Beware the ides of March.',
  'Little strokes fell great oaks.', 'Hitch your wagon to a star.', 'Familiarity breeds contempt.'
]);

function makeCryptograms() {
  const rows = QUOTES.map((r, i) => ({ i, q: r[0], by: r[1], src: r[2], note: r[3] || null, n: E.lettersIn(r[0]) }));
  rows.forEach((r) => { if (!E.QUOTE_OK.test(r.q)) throw new Error('quotation has odd characters: ' + r.q); });
  const seenQ = new Set();
  rows.forEach((r) => { if (seenQ.has(r.q)) throw new Error('duplicate quotation: ' + r.q); seenQ.add(r.q); });
  // difficulty: the fiendish set, then by length (short quotations get letters given)
  const rest = rows.filter((r) => !FIENDISH.has(r.q)).sort((a, b) => a.n - b.n || a.i - b.i);
  const cut = [0, 0.22, 0.47, 0.73, 1].map((f) => Math.round(f * rest.length));
  rest.forEach((r, k) => { r.diff = k < cut[1] ? 1 : k < cut[2] ? 2 : k < cut[3] ? 3 : 4; });
  rows.filter((r) => FIENDISH.has(r.q)).forEach((r) => { r.diff = 5; });
  const GIVENS = [0, 3, 2, 1, 0, 0];
  const count = {};
  const list = rows.slice().sort((a, b) => a.diff - b.diff || a.n - b.n || a.i - b.i).map((r) => {
    const rng = C.rng(1841 * 1000 + r.i);
    const ci = E.makeCipher(rng, r.q, GIVENS[r.diff]);
    const stem = STEMS[r.by] || r.by.split(' ').pop();
    count[stem] = (count[stem] || 0) + 1;
    const g = ci.given.length;
    const p = {
      id: 'cipher-' + String(r.i + 1).padStart(3, '0'),
      title: stem + ' ' + ROMAN(count[stem]),
      diff: r.diff,
      text: (r.by === PV ? 'An old proverb' : r.by === KJV ? 'A verse of the King James Bible' : r.by === 'Nursery rhyme' ? 'A nursery rhyme' : 'A line of **' + r.by + '**') +
        ', enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.' +
        (g ? ' ' + WORDN[g].charAt(0).toUpperCase() + WORDN[g].slice(1) + (g === 1 ? ' letter is' : ' letters are') + ' given to start you off.' : ''),
      data: { kind: 'crypto', q: r.q, c: ci.c, key: ci.key, given: ci.given, by: r.by, src: r.src },
      explain: '“' + r.q + '”\n\n— ' + (r.by === PV ? 'A proverb' : r.by) + (r.src && r.src !== 'traditional' ? ', ' + r.src : '') + '.' + (r.note ? '\n\n' + r.note : ''),
      concepts: ['deduction'],
      tags: ['cipher', r.by === PV ? 'proverb' : r.by.split(' ').pop().toLowerCase()]
    };
    check(p);
    return p;
  });
  return list;
}

/* ---------- the families ---------- */

const LADDER_META = `{
  id: 'word-ladders', engine: 'words', cat: 'riddles', name: 'Word ladders', order: 7,
  blurb: 'Lewis Carroll\\'s Doublets: turn one word into another by changing a single letter at a time, every step a real word.',
  origin: { year: 1879, who: 'Lewis Carroll', note: 'Carroll published the game as *Doublets* in the magazine *Vanity Fair* in 1879, and a little book of rules and puzzles followed the same year. Nabokov later called it *word golf*; Donald Knuth used a graph of 5,757 five-letter words to study it in *The Stanford GraphBase* (1993).' },
  concepts: ['state-space', 'combinatorics']
}`;

const CRYPTO_META = `{
  id: 'cryptograms', engine: 'words', cat: 'riddles', name: 'Cryptograms', order: 8,
  blurb: 'A famous line written in a secret alphabet: every letter stands for another. Crack it by counting letters and guessing the little words.',
  origin: { year: 1841, who: 'Edgar Allan Poe', note: 'Simple substitution ciphers are ancient, and the Arab scholar al-Kindi explained how to break them by counting letters in the ninth century. Edgar Allan Poe made a sport of it: writing in *Graham\\'s Magazine* in 1841 he challenged readers to send him ciphers, and his story *The Gold-Bug* (1843) cracks one by letter counts. Cryptogram puzzles have run in newspapers since the late nineteenth century.' },
  concepts: ['deduction', 'frequency-analysis']
}`;
const CRYPTO_CONCEPT = `Cabinet.concepts([
  { id: 'frequency-analysis', name: 'Counting letters (frequency analysis)', see: ['deduction'],
    text: 'In a long enough English text the letters turn up in a fairly steady proportion: E most often, then T, A, O, I and N, while J, Q, X and Z are rare. A substitution cipher changes what each letter looks like but not how often it appears — so the commonest cipher letter is probably E.\\n\\nCounting is only the start. Short words give more away: a one-letter word is A or I, the commonest three-letter words are THE and AND, and a word like *XYZX* with its first and last letter the same narrows things down fast. Each good guess makes the next one easier, until the whole message falls open. The Arab scholar al-Kindi described the method in the ninth century.' }
]);`;

const ANAGRAM_META = `{
  id: 'anagrams', engine: 'words', cat: 'riddles', name: 'Anagrams', order: 9,
  blurb: 'Letter tiles in a jumble: slide them into the one word, or the famous pair, that they spell.',
  origin: { year: 1610, who: 'Galileo Galilei', note: 'Anagrams are ancient. In the seventeenth century scientists used them to claim a discovery without giving it away: Galileo announced what he had seen at Saturn in 1610 as a string of scrambled Latin letters, and Robert Hooke hid his law of springs in the letters CEIIINOSSSTTUV, which unscramble to *ut tensio, sic vis* — as the stretch, so the force.' },
  concepts: ['combinatorics']
}`;

/* =====================================================================
 * Anagrams: [answer (two words for a pair), theme, clue]
 * ===================================================================== */

const ANAGRAMS = [
  ['lion', 'animal', 'A big cat with a mane: the king of beasts.'],
  ['goat', 'animal', 'Climbs cliffs, and will eat almost anything.'],
  ['camel', 'animal', 'The ship of the desert.'],
  ['zebra', 'animal', 'A horse in striped pyjamas.'],
  ['otter', 'animal', 'Floats on its back and cracks shellfish on its tummy.'],
  ['koala', 'animal', 'Sleeps most of the day up a eucalyptus tree.'],
  ['donkey', 'animal', 'Long ears, a loud bray and a stubborn streak.'],
  ['walrus', 'animal', 'Tusks and whiskers — and a Carroll poem about some unlucky oysters.'],
  ['giraffe', 'animal', 'The tallest animal alive.'],
  ['octopus', 'animal', 'Eight arms, three hearts and blue blood.'],
  ['kangaroo', 'animal', 'Hops everywhere and carries its baby in a pouch.'],
  ['crocodile', 'animal', 'Smiles at you from the river. Do not smile back.'],
  ['robin', 'bird', 'Red breast, winter garden, Christmas card.'],
  ['heron', 'bird', 'Stands on one leg in the shallows, waiting for a fish.'],
  ['parrot', 'bird', 'Talks a lot, but never says anything new.'],
  ['penguin', 'bird', 'A bird in evening dress that swims instead of flying.'],
  ['flamingo', 'bird', 'Pink because of what it eats, and often standing on one leg.'],
  ['grape', 'food', 'Grows in bunches; dried, it becomes a raisin.'],
  ['mango', 'food', 'A tropical fruit with a big flat stone.'],
  ['banana', 'food', 'Comes in its own wrapper, and bends.'],
  ['carrot', 'food', 'Orange and crunchy, and good for your eyes — or so grandmothers say.'],
  ['tomato', 'food', 'A fruit that everyone treats as a vegetable.'],
  ['pumpkin', 'food', 'A fairy godmother turned one into a coach.'],
  ['broccoli', 'food', 'Looks like a tiny green tree.'],
  ['peru', 'country', 'Llamas, and the ruins of Machu Picchu.'],
  ['egypt', 'country', 'The Nile and the pyramids.'],
  ['japan', 'country', 'The land of the rising sun.'],
  ['italy', 'country', 'Shaped like a boot.'],
  ['canada', 'country', 'Maple leaves and an enormous number of lakes.'],
  ['norway', 'country', 'Fjords, and the midnight sun.'],
  ['brazil', 'country', 'The biggest country in South America.'],
  ['iceland', 'country', 'Glaciers and volcanoes side by side.'],
  ['portugal', 'country', 'At the south-western corner of Europe.'],
  ['amber', 'colour', 'The traffic light between red and green — and fossil tree resin.'],
  ['indigo', 'colour', 'Between blue and violet in the rainbow.'],
  ['scarlet', 'colour', 'A brilliant red.'],
  ['piano', 'music', 'Eighty-eight keys, black and white.'],
  ['cello', 'music', 'Played sitting down and held between the knees.'],
  ['guitar', 'music', 'Six strings and a round sound hole.'],
  ['trumpet', 'music', 'Brass, with three valves.'],
  ['xylophone', 'music', 'Wooden bars struck with little hammers.'],
  ['maze', 'puzzle', 'A puzzle you walk through.'],
  ['rebus', 'puzzle', 'A puzzle that spells words with pictures.'],
  ['riddle', 'puzzle', 'It has a question in it and hides its answer.'],
  ['cipher', 'puzzle', 'Secret writing — like the puzzles in the drawer next door.'],
  ['jigsaw', 'puzzle', 'Hundreds of pieces and one picture on the box.'],
  ['paradox', 'puzzle', 'A statement that seems to contradict itself.'],
  ['labyrinth', 'puzzle', 'Where the Minotaur lived.'],
  ['frost', 'weather', 'Paints ferns on the window on cold mornings.'],
  ['thunder', 'weather', 'Count the seconds after the lightning.'],
  ['blizzard', 'weather', 'Snow driven by a howling wind.'],
  ['spoon', 'kitchen', 'Soup\'s best friend.'],
  ['kettle', 'kitchen', 'Whistles when it boils.'],
  ['toaster', 'kitchen', 'Pops up at breakfast.'],
  ['comet', 'space', 'A dirty snowball with a glowing tail.'],
  ['galaxy', 'space', 'Billions of stars in one great spiral.'],
  ['astronaut', 'space', 'Someone who travels into space.'],
  ['tennis', 'sport', 'A game in which love means nothing.'],
  ['archery', 'sport', 'Bows, arrows and a target.'],
  ['football', 'sport', 'Kicked around the whole world.'],
  ['baker', 'job', 'Up before dawn to make the bread.'],
  ['pilot', 'job', 'Flies the plane.'],
  ['plumber', 'job', 'Mends the pipes.'],
  ['detective', 'job', 'Finds out who did it.'],
  ['scarf', 'clothes', 'Wound round your neck in winter.'],
  ['jacket', 'clothes', 'A short coat.'],
  ['sweater', 'clothes', 'A warm knitted top.'],
  ['tulip', 'plant', 'Holland is full of them in spring.'],
  ['daisy', 'plant', 'Pluck its petals: she loves me, she loves me not.'],
  ['willow', 'plant', 'A weeping tree by the river.'],
  ['sunflower', 'plant', 'A tall yellow flower that turns to face the sun.'],
  ['salt pepper', 'pairs', 'On every dinner table.'],
  ['fish chips', 'pairs', 'Wrapped in paper, with vinegar.'],
  ['knife fork', 'pairs', 'Laid on either side of the plate.'],
  ['bucket spade', 'pairs', 'Taken to the beach to build sandcastles.'],
  ['bow arrow', 'pairs', 'Robin Hood never went anywhere without them.'],
  ['needle thread', 'pairs', 'For sewing a button back on.'],
  ['stars stripes', 'pairs', 'The flag of the United States.'],
  ['pride prejudice', 'pairs', 'Jane Austen\'s most famous novel.'],
  ['cat dog', 'animal', 'Two pets that do not always get on.'],
  ['owl hen', 'bird', 'One hoots at night; the other lays eggs by day.'],
  ['pea bean', 'food', 'Two vegetables that grow in pods.'],
  ['harp drum', 'music', 'You pluck one and beat the other.'],
  ['elephant', 'animal', 'The biggest animal on land, with a trunk for a nose.'],
  ['chameleon', 'animal', 'Changes colour, and looks two ways at once.'],
  ['hurricane', 'weather', 'A tropical storm with a calm eye.'],
  ['saxophone', 'music', 'Made of brass, but played with a reed like a clarinet.'],
  ['pineapple', 'food', 'Neither a pine nor an apple.'],
  ['australia', 'country', 'A country that is also a whole continent.'],
  ['carpenter', 'job', 'Works in wood — and shared a Carroll poem with a walrus.'],
  ['dandelion', 'plant', 'Blow its clock of seeds to tell the time.'],
  ['telescope', 'space', 'Galileo pointed one at the sky in 1609.'],
  ['crossword', 'puzzle', 'Black and white squares, clues across and down.'],
  ['tiger zebra', 'animal', 'Both wear stripes.'],
  ['robin eagle', 'bird', 'A small one with a red breast and a great one with a hooked beak.'],
  ['piano violin', 'music', 'One has keys and the other a bow.'],
  ['spain italy', 'country', 'Two sunny neighbours of the Mediterranean.'],
  ['stale', 'any', 'There is more than one answer: any word that uses all five letters counts.'],
  ['spot', 'any', 'There is more than one answer: any word that uses all four letters counts.'],
  ['crate', 'any', 'There is more than one answer: any word that uses all five letters counts.'],
  ['rhythm', null, 'Music has it, and so does poetry — and it has no ordinary vowels.'],
  ['oxygen', null, 'You are breathing it now.'],
  ['wizard', null, 'Merlin was one.'],
  ['sphinx', null, 'It asked the most famous riddle of all.'],
  ['bamboo', null, 'The giant grass that pandas eat.']
];
const LABEL = { animal: 'Animal', bird: 'Bird', food: 'Fruit or veg', country: 'Country', colour: 'Colour', music: 'Instrument', puzzle: 'Puzzle word', weather: 'Weather', kitchen: 'Kitchen', space: 'Sky and space', sport: 'Sport', job: 'Job', clothes: 'Clothes', plant: 'Tree or flower', pairs: 'Famous pair', any: 'Any word' };

function makeAnagrams() {
  const out = [];
  ANAGRAMS.forEach(([ans, theme, clue], i) => {
    const words = ans.split(' ');
    const d = { kind: 'anagram', words, theme: theme === 'any' ? null : theme };
    if (theme === 'any') d.any = true;
    const rng = C.rng(1610 + i * 7919);
    const avoid = (s) => W.has(s) || words.includes(s) || (d.theme && d.theme !== 'pairs' && W.theme(d.theme).set.has(s));
    d.letters = E.scramble(rng, words.join(''), avoid);
    const label = words.length > 1 && theme !== 'pairs' ? 'Two ' + W.theme(theme).many : theme ? LABEL[theme] : 'One word';
    const p = {
      id: 'anagram-' + words.join('-'),
      title: label + ': ' + up(d.letters),
      diff: E.anagramLevel(d),
      text: E.anagramStatement(d),
      hints: [clue],
      data: d,
      concepts: ['combinatorics'],
      tags: ['anagram', theme || 'word']
    };
    check(p);
    out.push(p);
  });
  out.sort((a, b) => a.diff - b.diff || a.data.letters.length - b.data.letters.length || (a.id < b.id ? -1 : 1));
  return out;
}

module.exports = { makeLadders, makeCryptograms, makeAnagrams, QUOTES };

if (require.main === module) {
  const ladders = makeLadders();
  console.log('ladders: ' + ladders.length + ' (' + spread(ladders) + ')');
  write('word-ladders.js', 'Carroll\'s Doublets, word golf and themed ladders; every par is the shortest ladder in js/lib/wordlist.js.', LADDER_META, ladders);
  const ciphers = makeCryptograms();
  console.log('cryptograms: ' + ciphers.length + ' (' + spread(ciphers) + ')');
  write('cryptograms.js', 'Public-domain quotations, quoted exactly, each enciphered with a seeded random derangement (no letter stands for itself).', CRYPTO_META, ciphers, CRYPTO_CONCEPT);
  const anagrams = makeAnagrams();
  console.log('anagrams: ' + anagrams.length + ' (' + spread(anagrams) + ')');
  write('anagrams.js', 'Themed anagrams with clues; each answer is the only one of its theme (or of the dictionary) that the letters spell.', ANAGRAM_META, anagrams);
}
