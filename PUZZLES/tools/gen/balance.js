/* The Puzzle Cabinet · tools/gen/balance.js
 *
 *   node tools/gen/balance.js     writes data/counterfeit-coin.js and data/weights.js
 *
 * The false-coin puzzles are checked by a game-tree search against a scale
 * that answers as unhelpfully as it can; every one needs exactly the number
 * of weighings it allows. The weights puzzles are checked by search too.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/balance.js'));
const S = C.balanceSolver;
const eng = C.engines.balance;

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty'];
const W = (n) => WORDS[n] || String(n);
const Cap = (s) => s.replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function emitFamily(file, meta, puzzles) {
  const lines = ['/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/balance.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 1).replace(/\n\s*/g, ' ') + ', ['];
  puzzles.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < puzzles.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, 'data', file), lines.join('\n') + '\n');
}
function check(p) {
  const r = eng.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (r.warn) throw new Error(p.id + ': ' + r.warn);
}

/* ======================= the false coin ======================= */

// the statements are written by the engine, so Endless puzzles read the same
const coinText = S.coinText, coinGoal = S.coinGoal;
function coinDiff(d) {
  if (d.k >= 4) return 5;
  if (d.fake !== 'either') {
    let v = d.k === 1 ? 1 : d.k === 2 ? (d.n <= 5 ? 1 : 2) : (d.n > 18 ? 3 : 2);
    if (d.none) v++;
    return Math.min(5, v);
  }
  if (d.k === 1) return 2;
  if (d.k === 2) return d.extra || d.dir === false ? 3 : 2;
  const tight = d.dir === false ? (d.extra ? 14 : 13) : (d.extra ? 13 : 12);
  if (d.n >= tight) return 5;
  if (d.n >= tight - 3) return 4;
  return d.n <= 6 ? 3 : 4;
}

const coinClassics = [
  {
    id: 'fcoin-three', title: 'Three Coins, One Weighing', diff: 1,
    text: 'Three coins, one of them a forgery that is slightly **heavier** than the others. You may use the balance only **once**. Which coin is false?',
    data: { kind: 'coins', n: 3, k: 1, fake: 'heavy' },
    hints: ['You do not have to put every coin on the scale.', 'Weigh one coin against another. If they balance, where is the heavy one?'],
    explain: 'Put coin 1 against coin 2. If one pan sinks, that coin is the heavy one; if they balance, the false coin is the one you left on the table. Leaving coins **off** the scale is what makes a weighing worth three answers instead of two.',
    concepts: ['ternary']
  },
  {
    id: 'fcoin-nine', title: 'The Heavy One in Nine', diff: 2,
    text: 'Nine coins, one of them **heavier** than the rest. Find it with **two** weighings.',
    data: { kind: 'coins', n: 9, k: 2, fake: 'heavy' },
    hints: ['Each weighing has three results. Make each result leave the same number of suspects.', 'Weigh three against three, and keep three on the table.'],
    explain: 'Weigh 1 2 3 against 4 5 6. Whichever pan sinks holds the coin — and if they balance, it is among 7 8 9. Either way three suspects remain, and one more weighing of one against one finishes it, as in [[fcoin-three]]. Two weighings of three results each separate 3 × 3 = 9 cases, so nine is the most two weighings can handle.',
    concepts: ['ternary'], links: ['fcoin-three', 'fcoin-twenty-seven']
  },
  {
    id: 'fcoin-three-either', title: 'Heavier or Lighter?', diff: 2,
    text: 'Three coins; one is false, but you do not know whether it is **heavier or lighter**. In **two** weighings, find it and say which.',
    data: { kind: 'coins', n: 3, k: 2, fake: 'either' },
    hints: ['Weigh coin 1 against coin 2 first.', 'If they balance, both are good — and a good coin is a useful yardstick for coin 3.'],
    explain: 'Weigh 1 against 2. If they balance, both are good, and weighing 3 against 1 tells whether 3 is heavier or lighter. If 1 sinks, then either 1 is heavy or 2 is light: weigh 1 against 3. If 1 sinks again, it is the heavy coin; if they balance, 2 is the light one.',
    concepts: ['state-space']
  },
  {
    id: 'fcoin-eight-light', title: 'The Light One in Eight', diff: 2,
    text: 'A jeweller has eight rings of which one is hollow and so a touch **lighter** than the rest. Two weighings to find it.',
    data: { kind: 'coins', n: 8, k: 2, fake: 'light' },
    hints: ['Eight is less than nine, so the trick of [[fcoin-nine]] still works.', 'Three against three, two on the table.'],
    explain: 'Weigh three against three. If a pan rises, the light coin is among its three; if they balance, it is one of the two left out. Either way one more weighing finishes it.',
    links: ['fcoin-nine'], concepts: ['ternary']
  },
  {
    id: 'fcoin-twenty-seven', title: 'Twenty-Seven Coins', diff: 3,
    text: 'Twenty-seven coins, one of them **heavier**. Three weighings.',
    data: { kind: 'coins', n: 27, k: 3, fake: 'heavy' },
    hints: ['Split the coins into three equal heaps.', 'Nine against nine, nine on the table — then carry on as in [[fcoin-nine]].'],
    explain: 'Nine against nine leaves nine suspects whatever happens; then three against three, then one against one. Every weighing cuts the suspects to a third — the most any weighing can do — so 3<sup>k</sup> coins is the limit for k weighings.',
    links: ['fcoin-nine'], concepts: ['ternary']
  },
  {
    id: 'fcoin-four-name', title: 'Four Coins, Just Name It', diff: 3,
    text: 'Four coins, one false — heavier or lighter, unknown. You need only point to the false coin, not say which way it errs. Two weighings.',
    data: { kind: 'coins', n: 4, k: 2, fake: 'either', dir: false },
    hints: ['Start with one coin against one.', 'If they balance, you have two good coins to compare the others with.'],
    explain: 'Weigh 1 against 2. If they balance, weigh 3 against 1: if the pans differ, 3 is false; if they balance, it must be 4 — you never weigh coin 4, and you never learn whether it is heavy or light. If 1 and 2 differ, weigh 1 against 3: a difference convicts 1, a balance convicts 2.',
    concepts: ['state-space']
  },
  {
    id: 'fcoin-twelve', title: 'The Twelve Coins', diff: 4, year: 1945,
    source: 'A problem that spread through puzzle columns and common rooms in the mid-1940s; Freeman Dyson worked out the general case in 1946.',
    text: 'The most famous weighing puzzle of all. Twelve coins, one of them false — **heavier or lighter**, nobody knows which. With **three** weighings on a balance, find the false coin and say whether it is heavier or lighter.',
    data: { kind: 'coins', n: 12, k: 3, fake: 'either' },
    hints: ['There are 24 possibilities (12 coins × heavy or light) and three weighings give 27 possible outcomes. Every weighing must be used well.', 'Begin with four against four.', 'If the first weighing tips, move coins between the pans in the second: some stay, some swap sides, some come off, and some good coins come on.'],
    explain: 'Weigh 1 2 3 4 against 5 6 7 8. **If they balance**, the culprit is among 9–12 and 1–8 are good: weigh 9 10 11 against three good coins. A balance points to 12 (weigh it against a good coin to learn heavy or light); a tilt says 9–11 contains it and in which direction, and 9 against 10 settles it. **If 1–4 sink**, then one of 1–4 is heavy or one of 5–8 is light. Weigh 1 2 5 against 3 6 and a good coin: if the left sinks again it is 1 or 2 heavy or 6 light; if it rises, 3 heavy or 5 light; if they balance, 4 heavy or 7 or 8 light. One more weighing separates each trio. Three weighings give 27 outcomes and there are 24 possibilities — the room to spare is small, which is why the first split must be 4 : 4 : 4.',
    concepts: ['ternary', 'state-space'], links: ['fcoin-thirteen-spare', 'fcoin-thirteen-name', 'fcoin-twelve-none'], tags: ['classic']
  },
  {
    id: 'fcoin-twelve-none', title: 'Twelve Coins — or None?', diff: 5, year: 1946,
    source: 'After Freeman Dyson, "The problem of the pennies", *The Mathematical Gazette* (1946).',
    text: 'Twelve coins. Perhaps one is false (heavier or lighter), perhaps they are all good. In three weighings, find the false coin and its weight — or show that there is none.',
    data: { kind: 'coins', n: 12, k: 3, fake: 'either', none: true },
    hints: ['There are now 25 possibilities for 27 outcomes.', 'The usual solution of [[fcoin-twelve]] never uses the outcome "balance, balance, balance". Can you make it mean "no false coin"?'],
    explain: 'The classic solution for twelve coins leaves three of the 27 outcomes unused. Arrange it so that "balance three times" can only happen when every coin is good: the coin that would otherwise be convicted by a final balance must instead be weighed in the last weighing. Dyson showed that (3<sup>k</sup> − 3)/2 coins can always be handled in k weighings, even when there may be no false coin.',
    concepts: ['ternary'], links: ['fcoin-twelve']
  },
  {
    id: 'fcoin-thirteen-spare', title: 'Thirteen and a Good One', diff: 5,
    text: 'Thirteen coins, one false — heavier or lighter. This time you have a fourteenth coin that you **know** is good. Three weighings: find the false coin and say which way it errs.',
    data: { kind: 'coins', n: 13, k: 3, fake: 'either', extra: 1 },
    hints: ['26 possibilities, 27 outcomes: almost no slack. The good coin lets you balance an odd number of suspects.', 'First weighing: five suspects against four suspects and the good coin.'],
    explain: 'Weigh 1–5 against 6–9 with the good coin. A tilt leaves 5 + 4 = 9 possibilities with their directions known — the right amount for two weighings. A balance leaves coins 10–13 (8 possibilities) and plenty of good coins to fill the pans. With a known good coin the limit rises from (3<sup>k</sup> − 3)/2 to (3<sup>k</sup> − 1)/2.',
    concepts: ['ternary'], links: ['fcoin-twelve']
  },
  {
    id: 'fcoin-thirteen-name', title: 'Thirteen, Just Name It', diff: 5,
    text: 'Thirteen coins, one false — heavier or lighter. No spare good coin. In three weighings, **point to** the false coin; you need not say whether it is heavier or lighter.',
    data: { kind: 'coins', n: 13, k: 3, fake: 'either', dir: false },
    hints: ['Start as for twelve: four against four.', 'If the first two weighings balance, one coin may never be weighed at all — and that is allowed here.'],
    explain: 'Four against four. If they tip, carry on as in [[fcoin-twelve]]. If they balance, the culprit is among 9–13 with eight good coins to help: weigh 9 10 11 against three good coins, and so on — the thirteenth coin is convicted without ever being weighed, which is why its direction stays unknown.',
    concepts: ['ternary'], links: ['fcoin-twelve']
  },
  {
    id: 'fcoin-thirty-nine', title: 'Thirty-Nine Coins', diff: 5,
    text: 'Thirty-nine coins, one false — heavier or lighter. Four weighings: find it and say which.',
    data: { kind: 'coins', n: 39, k: 4, fake: 'either' },
    hints: ['78 possibilities, 81 outcomes. The first weighing must be thirteen against thirteen.', 'After a balance you have 13 suspects and 26 good coins: that is [[fcoin-thirteen-spare]] one weighing up.'],
    explain: 'Dyson\'s formula: k weighings handle (3<sup>k</sup> − 3)/2 coins — 12 for three weighings, 39 for four. Split 13 : 13 : 13; after a balance, the thirteen left with good coins to spare are exactly the puzzle [[fcoin-thirteen-spare]]; after a tilt, 26 suspects each with a known direction must be split 9 : 9 : 8.',
    concepts: ['ternary'], links: ['fcoin-twelve', 'fcoin-thirteen-spare']
  },
  {
    id: 'fcoin-forty', title: 'Forty and a Good One', diff: 5,
    text: 'Forty coins, one false — heavier or lighter — and one more coin known to be good. Four weighings.',
    data: { kind: 'coins', n: 40, k: 4, fake: 'either', extra: 1 },
    hints: ['80 possibilities, 81 outcomes.', 'Fourteen suspects against thirteen and the good coin.'],
    concepts: ['ternary'], links: ['fcoin-thirteen-spare', 'fcoin-thirty-nine']
  }
];

// generated variants: every one needs exactly its k
const coinVariants = [
  [3, 1, 'light'], [4, 2, 'heavy'], [5, 2, 'light'], [6, 2, 'heavy'], [7, 2, 'light'],
  [4, 3, 'either'], [5, 3, 'either'], [6, 3, 'either'],
  [2, 2, 'either', { extra: 1 }], [4, 2, 'either', { extra: 1 }],
  [3, 2, 'either', { dir: false }], [5, 2, 'either', { dir: false, extra: 1 }],
  [8, 2, 'heavy', { none: true }], [3, 2, 'either', { none: true }],
  [7, 3, 'either'], [8, 3, 'either'], [9, 3, 'either'], [10, 3, 'either'], [11, 3, 'either'],
  [12, 3, 'heavy'], [16, 3, 'light'], [20, 3, 'heavy'], [24, 3, 'light'],
  [7, 3, 'either', { extra: 1 }], [10, 3, 'either', { extra: 1 }], [11, 3, 'either', { extra: 1 }],
  [8, 3, 'either', { dir: false }], [11, 3, 'either', { dir: false }], [14, 3, 'either', { dir: false, extra: 1 }],
  [26, 3, 'heavy', { none: true }], [4, 2, 'either', { none: true, extra: 1 }], [13, 3, 'either', { none: true, extra: 1 }]
];
function coinTitle(n, k, fake, o) {
  const N = Cap(W(n));
  if (o.none) return N + ' Coins, or None' + (o.extra ? ' (with a Good One)' : '');
  if (fake === 'heavy') return N + ' Coins, One Heavy';
  if (fake === 'light') return N + ' Coins, One Light';
  if (o.dir === false) return N + ' Coins, Just Point' + (o.extra ? ' (with a Good One)' : '');
  if (o.extra) return N + ' Coins and a Good One';
  return N + ' Coins, Heavy or Light';
}

function buildCoins() {
  const out = [];
  coinClassics.forEach((c) => { const p = Object.assign({}, c, { goal: coinGoal(c.data) }); check(p); out.push(p); });
  const used = new Set(out.map((p) => p.title));
  const gen = [];
  coinVariants.forEach(([n, k, fake, o], i) => {
    o = o || {};
    const d = Object.assign({ kind: 'coins', n, k, fake }, o);
    const f = S.fewestWeighings(d);
    if (f !== k) throw new Error('variant ' + JSON.stringify(d) + ' needs ' + f);
    let title = coinTitle(n, k, fake, o);
    if (used.has(title)) title += ' (' + W(k) + ' weighings)';
    if (used.has(title)) throw new Error('title clash ' + title);
    used.add(title);
    gen.push({ id: 'fcoin-v' + String(i + 1).padStart(3, '0'), title, diff: coinDiff(d), text: coinText(d), goal: coinGoal(d), data: d, concepts: ['ternary'] });
  });
  // the spring scale and the bags
  const bags = [
    {
      id: 'fcoin-bags-ten', title: 'Ten Sacks, One Weighing', diff: 2,
      text: 'Ten sacks of gold coins. In one sack every coin is counterfeit and weighs **9 g**; true coins weigh **10 g**. You may take as many coins as you like from any sacks, but a spring scale that shows grams may be used only **once**. Which sack holds the fakes?',
      data: { kind: 'bags', bags: 10, coin: 10, fake: 9, per: 20 },
      hints: ['Taking the same number from two sacks makes those two sacks impossible to tell apart.', 'Take 0 coins from sack 1, 1 from sack 2, 2 from sack 3 …'],
      explain: 'Take 0, 1, 2, … 9 coins from sacks 1 to 10: 45 coins, 450 g if all were true. Each fake is 1 g light, so the shortfall in grams is the number of coins taken from the false sack — and so it names the sack. (No shortfall at all: sack 1, from which you took nothing.)',
      concepts: ['invariant']
    },
    {
      id: 'fcoin-bags-heavy', title: 'Six Sacks, Heavy Fakes', diff: 2,
      text: 'Six sacks of coins; true coins weigh 10 g, but one sack is full of fakes that weigh **11 g**. One weighing on a spring scale. Which sack?',
      data: { kind: 'bags', bags: 6, coin: 10, fake: 11, per: 10 },
      hints: ['Give every sack a different number of coins on the scale.'],
      links: ['fcoin-bags-ten']
    },
    {
      id: 'fcoin-bags-nine', title: 'Nine Sacks of Eight', diff: 3,
      text: 'Nine sacks, each with only **eight** coins. One sack holds fakes of 9 g instead of 10 g. One weighing on a spring scale — which sack?',
      data: { kind: 'bags', bags: 9, coin: 10, fake: 9, per: 8 },
      hints: ['You need nine different numbers of coins, none more than eight.', 'Zero is a number too.'],
      explain: 'Take 0, 1, 2, … 8 coins: nine different counts, the largest eight. The sack you took nothing from is convicted by a reading with no shortfall at all.',
      links: ['fcoin-bags-ten']
    },
    {
      id: 'fcoin-bags-three', title: 'Three Sacks, Any of Them', diff: 3,
      text: 'Three sacks, four coins in each. **Any number** of the sacks — none, one, two or all three — may hold 9 g fakes instead of 10 g coins. One weighing on a spring scale: which sacks are false?',
      data: { kind: 'bags', bags: 3, coin: 10, fake: 9, per: 4, many: true },
      hints: ['There are 8 possible groups of false sacks. Each must give a different shortfall.', 'Take 1, 2 and 4 coins.'],
      explain: 'With 1, 2 and 4 coins from the three sacks, the shortfall in grams, written in binary, lists the false sacks: 5 g short = 4 + 1 = sacks 3 and 1. Every group of sacks has its own total because every number has only one binary spelling.',
      concepts: ['binary'], links: ['fcoin-bags-five']
    },
    {
      id: 'fcoin-bags-five', title: 'Five Sacks, Any of Them', diff: 3,
      text: 'Five sacks with plenty of coins in each. Any number of the sacks may be full of fakes (9 g instead of 10 g). One weighing: which sacks are false?',
      data: { kind: 'bags', bags: 5, coin: 10, fake: 9, per: 20, many: true },
      hints: ['32 possible groups of false sacks; each must give a different reading.', 'Powers of two.'],
      explain: 'Take 1, 2, 4, 8 and 16 coins. The shortfall in grams is a number from 0 to 31, and its binary digits say which sacks are false.',
      concepts: ['binary'], links: ['fcoin-bags-three', 'fcoin-bags-small']
    },
    {
      id: 'fcoin-bags-small', title: 'Four Sacks of Seven', diff: 5,
      text: 'Four sacks with only **seven** coins in each. Any number of them may hold 9 g fakes instead of 10 g coins. One weighing on a spring scale. Powers of two would need eight coins from the last sack — so how can it be done?',
      data: { kind: 'bags', bags: 4, coin: 10, fake: 9, per: 7, many: true },
      hints: ['You need four numbers, none above 7, such that no two different groups of them have the same sum.', 'Try 3, 5, 6 and 7.'],
      explain: 'Take 3, 5, 6 and 7 coins. Their sixteen subset sums — 0, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 21 — are all different. Sets like this, with all subset sums distinct and the largest element as small as possible, were studied by Paul Erdős and are still not fully understood.',
      concepts: ['binary'], links: ['fcoin-bags-five']
    },
    {
      id: 'fcoin-bags-five-small', title: 'Five Sacks of Thirteen', diff: 5,
      text: 'Five sacks of **thirteen** coins each; any number of them may be false (9 g instead of 10 g). One weighing. Find the false sacks.',
      data: { kind: 'bags', bags: 5, coin: 10, fake: 9, per: 13, many: true },
      hints: ['Five numbers, none above 13, with all their subset sums different.', 'One such set: 3, 6, 11, 12, 13.'],
      explain: 'Take 3, 6, 11, 12 and 13 coins: all 32 subset sums are different. Thirteen is the least largest number for five sacks.',
      concepts: ['binary'], links: ['fcoin-bags-small']
    }
  ];
  bags.forEach((p) => { p.goal = 'Take coins, weigh once, and name the false sack' + (p.data.many ? 's' : '') + ' for certain.'; check(p); });
  const asks = [
    {
      id: 'fcoin-ask-thousand', title: 'A Thousand Coins', diff: 2,
      text: 'A thousand coins, one of them heavier than the rest. How few weighings on a balance are always enough to find it?',
      data: { kind: 'ask', answer: { num: 7, unit: 'weighings' }, traps: [{ match: 10, msg: 'Halving each time needs 10 — but a weighing has three outcomes, not two.' }], fig: { balance: { L: ['?', '?'], R: ['?', '?'], tilt: 1 } } },
      hints: ['Each weighing splits the suspects into three heaps.', '3<sup>6</sup> = 729 and 3<sup>7</sup> = 2187.'],
      explain: 'Six weighings handle 3<sup>6</sup> = 729 coins at most, which is too few; seven handle 2187. So **7**.',
      concepts: ['ternary']
    },
    {
      id: 'fcoin-ask-four', title: 'The Most in Four', diff: 2,
      text: 'One coin among many is heavier. What is the largest number of coins among which four weighings can always find it?',
      data: { kind: 'ask', answer: { num: 81, unit: 'coins' }, traps: [{ match: 16, msg: 'That is 2<sup>4</sup> — but each weighing has three outcomes.' }], fig: { coins: 12, labels: false } },
      explain: '3 × 3 × 3 × 3 = **81**: each weighing divides the suspects into three equal heaps.',
      concepts: ['ternary']
    },
    {
      id: 'fcoin-ask-thirteen', title: 'Why Not Thirteen?', diff: 3,
      text: 'With three weighings and no extra good coin, the false coin can be found — with its weight — among twelve coins. What is the largest number of coins for which this can be done in **four** weighings?',
      data: { kind: 'ask', answer: { num: 39, unit: 'coins' }, traps: [{ match: 40, msg: 'That is the answer when you also have a coin known to be good.' }, { match: 81, msg: 'That is for a coin known to be heavy.' }], fig: { coins: 12 } },
      hints: ['Twelve is (27 − 3) / 2.'],
      explain: 'Dyson\'s formula (3<sup>k</sup> − 3)/2 gives 3, 12, **39**, 120 … for k = 2, 3, 4, 5. With a spare good coin it becomes (3<sup>k</sup> − 1)/2: 4, 13, 40.',
      concepts: ['ternary'], links: ['fcoin-thirty-nine']
    },
    {
      id: 'fcoin-ask-two-heavy', title: 'Two Pans, Two Heavy?', diff: 3,
      text: 'Five coins; exactly **two** of them are heavy (both equally heavy). How few weighings on a balance are always enough to find both?',
      data: { kind: 'ask', answer: { num: 3, unit: 'weighings' }, traps: [{ match: 2, msg: 'There are 10 possible pairs, and two weighings give only 9 outcomes.' }], fig: { coins: 5 } },
      hints: ['How many possible pairs are there?', 'Ten pairs, and a weighing has three outcomes.'],
      explain: 'There are 10 possible pairs among five coins and two weighings have only 3 × 3 = 9 outcomes, so two weighings cannot always do it. Three can: weigh 1 against 2, then act on the result.',
      concepts: ['ternary']
    }
  ];
  asks.forEach(check);
  gen.sort((a, b) => a.diff - b.diff || a.data.k - b.data.k || a.data.n - b.data.n);
  const all = out.concat(bags, asks, gen);
  all.sort((a, b) => a.diff - b.diff);
  return all;
}

/* ======================= weights ======================= */

function buildWeights() {
  const out = [];
  const design = [
    {
      id: 'wt-two-four', title: 'Two Weights, Four Loads', diff: 1,
      text: 'Choose **two** weights with which a balance can weigh every whole load from 1 to 4 kg. Weights may go on either pan.',
      data: { kind: 'design', count: 2, max: 4, pans: 2, sol: [1, 3] },
      hints: ['A weight beside the load counts against it.', 'With 1 and 3: 2 = 3 − 1.'],
      concepts: ['ternary']
    },
    {
      id: 'wt-binary-fifteen', title: 'Four Weights on One Pan', diff: 1,
      text: 'Choose **four** weights that weigh every whole load from 1 to 15 kg — with the weights always on the pan **opposite** the load.',
      data: { kind: 'design', count: 4, max: 15, pans: 1, sol: [1, 2, 4, 8] },
      hints: ['Each weight is either used or not.', 'Double each time.'],
      concepts: ['binary']
    },
    {
      id: 'wt-three-thirteen', title: 'Three Weights to Thirteen', diff: 2,
      text: 'Three weights, both pans allowed. Weigh every whole load from 1 to 13 kg.',
      data: { kind: 'design', count: 3, max: 13, pans: 2, sol: [1, 3, 9] },
      hints: ['1 and 3 reach 4. The next weight can be as big as 4 + 4 + 1.'],
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-binary-63', title: 'Six Weights on One Pan', diff: 2,
      text: 'Six weights, always on the pan opposite the load. Weigh every whole load from 1 to 63 kg.',
      data: { kind: 'design', count: 6, max: 63, pans: 1, sol: [1, 2, 4, 8, 16, 32] },
      hints: ['What do 1, 2 and 4 reach? What is the biggest next weight that leaves no gap?'],
      explain: 'Powers of two: 1, 2, 4, 8, 16, 32. Every load from 1 to 63 is written in exactly one way as a sum of them — its binary form.',
      concepts: ['binary']
    },
    {
      id: 'wt-bachet', title: 'Bachet\'s Four Weights', diff: 3, year: 1612,
      source: 'Claude-Gaspard Bachet de Méziriac, *Problèmes plaisans et délectables* (1612).',
      text: 'A merchant wants **four** weights with which he can weigh every whole number of kilograms from **1 to 40** on a two-pan balance. The weights may go on either pan: opposite the goods, or beside them. What should the four weights be?',
      data: { kind: 'design', count: 4, max: 40, pans: 2, sol: [1, 3, 9, 27] },
      hints: ['A weight beside the load takes away. With 1 and 3 you already have 1, 2 = 3 − 1, 3 and 4.', 'Choose each new weight as large as possible without leaving a gap: twice what you can already reach, plus one.'],
      explain: 'Take 1, 3, 9 and 27. Each weight can be beside the load (−1), off the scale (0) or opposite (+1), so every load is written in *balanced ternary*: 14 = 27 − 9 − 3 − 1, so put 27 opposite the load and 9, 3 and 1 beside it. Four weights of three states each give 81 arrangements; half of the 80 that are not "nothing" are the loads 1 to 40.',
      concepts: ['ternary'], links: ['wt-five-121', 'wt-broken'], tags: ['classic']
    },
    {
      id: 'wt-even', title: 'Only Even Loads', diff: 3,
      text: 'A grain dealer only ever sells **even** numbers of kilograms: 2, 4, 6 … up to 80. Which four weights let him weigh every one of these on a two-pan balance?',
      data: { kind: 'design', count: 4, max: 80, pans: 2, step: 2, sol: [2, 6, 18, 54] },
      hints: ['Everything is twice [[wt-bachet]].'],
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-five-121', title: 'Five Weights to 121', diff: 3,
      text: 'Five weights, both pans. Weigh every whole load from 1 to 121 kg.',
      data: { kind: 'design', count: 5, max: 121, pans: 2, sol: [1, 3, 9, 27, 81] },
      hints: ['(3<sup>5</sup> − 1)/2 = 121.'],
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-capped', title: 'Nothing Over Eight', diff: 3,
      text: 'The weights\' box has room only for weights of **8 kg or less**. Choose three weights (both pans allowed) that weigh every whole load from 1 to 12 kg.',
      data: { kind: 'design', count: 3, max: 12, pans: 2, cap: 8, sol: [1, 3, 8] },
      hints: ['Three weights of at most 8 must add up to at least 12.', 'Keep 1 and 3 from Bachet\'s set; the third cannot be 9 — so how close can you get?'],
      explain: '**1, 3 and 8**: they add up to exactly 12, and 1 and 3 fill the gaps (5 = 8 − 3, 6 = 8 − 3 + 1, 7 = 8 − 1, 9 = 8 + 1, 10 = 8 + 3 − 1 …). It is the only answer.',
      concepts: ['ternary']
    },
    {
      id: 'wt-given-two', title: 'A Two Is Given', diff: 3,
      text: 'You already own a **2 kg** weight. Add two more so that, with both pans allowed, every whole load from 1 to 11 kg can be weighed.',
      data: { kind: 'design', count: 3, max: 11, pans: 2, fixed: [2], sol: [2, 3, 9] },
      hints: ['1 kg must be weighed somehow: a 3 beside the 2 gives it.', 'With 2 and 3 you reach 1 to 5. The last weight must fill 6 to 11.'],
      explain: '**3 and 9**: 2 and 3 weigh 1 to 5, and 9 with them reaches 4 to 14 — so everything from 1 to 11 is covered. No other pair works.',
      concepts: ['ternary']
    },
    {
      id: 'wt-given-five', title: 'A Five Is Given', diff: 4,
      text: 'Your set of four weights must include a **5 kg** weight. Choose the other three so that, with both pans allowed, every whole load from 1 to 36 kg can be weighed.',
      data: { kind: 'design', count: 4, max: 36, pans: 2, fixed: [5], sol: [3, 5, 9, 27] },
      hints: ['There is exactly one answer. The biggest weight is a familiar one.', 'Bachet\'s 27 and 9 are still there. What replaces 1 and 3?'],
      explain: '**3, 9 and 27**. The 5 and the 3 together weigh 2, 3, 5 and 8 — and 1 is missing, it seems… but 1 = 9 − 5 − 3. Only this set works; a neat surprise when you expect Bachet\'s 1, 3, 9, 27 to be forced.',
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-given-ten', title: 'A Ten Is Given', diff: 4,
      text: 'Four weights, one of them **10 kg**. Choose the other three so that every whole load from 1 to 31 kg can be weighed, both pans allowed.',
      data: { kind: 'design', count: 4, max: 31, pans: 2, fixed: [10], sol: [3, 9, 10, 27] },
      hints: ['There is exactly one answer.', '1 = 10 − 9. Which small weight is then still needed?'],
      explain: '**3, 9 and 27**. The 10 takes the place of Bachet\'s 1, since 10 − 9 = 1. It is the only answer.',
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-given-eight', title: 'An Eight Among Them', diff: 5,
      text: 'Four weights, one of them **8 kg**, both pans allowed. Choose the other three so that every whole load from 1 to **37** kg can be weighed.',
      data: { kind: 'design', count: 4, max: 37, pans: 2, fixed: [8], sol: [1, 3, 8, 25] },
      hints: ['There is exactly one answer, and its heaviest weight is not 27.', '1, 3 and 8 weigh everything from 1 to 12. How heavy can the fourth be and still leave no gap up to 37?'],
      explain: '**1, 3 and 25**. 1, 3 and 8 weigh 1 to 12 (see [[wt-capped]]); a fourth weight w then covers w − 12 to w + 12, so w = 25 exactly fills 13 to 37. Nothing else works.',
      concepts: ['ternary'], links: ['wt-capped', 'wt-bachet']
    },
    {
      id: 'wt-given-thirteen', title: 'An Unlucky Thirteen', diff: 5,
      text: 'Four weights, one of them **13 kg**, both pans allowed. Choose the other three so that every whole load from 1 to **29** kg can be weighed. (Bachet\'s 1, 3 and 9 will not do.)',
      data: { kind: 'design', count: 4, max: 29, pans: 2, fixed: [13], sol: [4, 12, 13, 23] },
      hints: ['There is exactly one answer, and it has no 1 in it.', '1 kg can be weighed as a difference: 13 − 12.', 'The answer uses 4, 12 and one more weight.'],
      explain: '**4, 12 and 23**. Small loads come from differences: 1 = 13 − 12, 3 = 4 + 12 − 13, 5 = 4 + 13 − 12, 6 = 23 − 13 − 4 … It is the only set that works, and nothing like the powers of three.',
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-one-pan-100', title: 'Seven for a Hundred', diff: 2,
      text: 'Weights on one pan only (opposite the load): choose **seven** weights that weigh every whole load from 1 to 100 kg.',
      data: { kind: 'design', count: 7, max: 100, pans: 1, sol: [1, 2, 4, 8, 16, 32, 37] },
      hints: ['Six powers of two reach 63. The seventh can be anything that closes the gap to 100.'],
      explain: 'Powers of two up to 32 reach 63; a seventh weight between 37 and 64 then reaches 100 (37 is the smallest that works, 64 the largest that leaves no gap). Many answers are right.',
      concepts: ['binary']
    }
  ];
  design.forEach((p) => {
    p.goal = 'Every load from ' + (p.data.step || 1) + ' to ' + p.data.max + ' kg lit up.';
    check(p);
    out.push(p);
  });
  // balancing a load
  const place = [
    { load: 7, weights: [1, 3, 9, 27], title: 'Seven with Bachet\'s Weights' },
    { load: 2, weights: [1, 3, 9, 27], title: 'Two with Bachet\'s Weights' },
    { load: 14, weights: [1, 3, 9, 27], title: 'Fourteen with Bachet\'s Weights' },
    { load: 20, weights: [1, 3, 9, 27], title: 'Twenty with Bachet\'s Weights' },
    { load: 32, weights: [1, 3, 9, 27], title: 'Thirty-Two with Bachet\'s Weights' },
    { load: 13, weights: [1, 2, 4, 8, 16], pans: 1, title: 'Thirteen in Binary' },
    { load: 22, weights: [1, 2, 4, 8, 16], pans: 1, title: 'Twenty-Two in Binary' },
    { load: 1, weights: [4, 7, 10], title: 'One from Four, Seven and Ten' },
    { load: 8, weights: [2, 5, 11], title: 'Eight from Two, Five and Eleven' },
    { load: 14, weights: [3, 5, 8, 20], title: 'Fourteen from Odd Weights' },
    { load: 10, weights: [5, 7, 12], title: 'Ten from Five, Seven, Twelve' },
    { load: 9, weights: [5, 6, 13, 20], title: 'Nine the Hard Way' },
    { load: 25, weights: [2, 5, 10, 20, 50], title: 'Twenty-Five with Coins of Weight' },
    { load: 12, weights: [3, 3, 7, 13], title: 'Twelve with Two Threes' }
  ];
  place.forEach((pl, i) => {
    const d = { kind: 'place', load: pl.load, weights: pl.weights, pans: pl.pans || 2 };
    const a = S.arrangement(d.weights, d.pans, d.load);
    if (!a) throw new Error('place ' + pl.title + ' unsolvable');
    // does it need a weight beside the load?
    const one = S.arrangement(d.weights, 1, d.load);
    const used = a.filter(Boolean).length;
    const diff = one ? (used <= 2 ? 1 : 2) : (used <= 3 ? 2 : 3);
    const text = 'Balance the **' + d.load + ' kg** sack with the brass weights: ' + d.weights.join(', ') + ' kg' + (d.pans === 1 ? '. The weights may go **only on the other pan**.' : '. A weight may go on the pan opposite the sack or beside it.');
    const p = { id: 'wt-place-' + String(i + 1).padStart(2, '0'), title: pl.title, diff, text, goal: 'The beam level.', data: d, concepts: [d.pans === 1 ? 'binary' : 'ternary'] };
    check(p);
    out.push(p);
  });
  // the parcel
  const finds = [
    { weights: [1, 2, 4], pans: 1, lo: 1, hi: 7, k: 2, title: 'The Parcel: Seven Possibilities', diff: 2 },
    { weights: [1, 2, 4, 8], pans: 1, lo: 1, hi: 15, k: 3, title: 'The Parcel: One to Fifteen', diff: 3 },
    { weights: [1, 3, 9], pans: 2, lo: 1, hi: 13, k: 3, title: 'The Parcel and Three Weights', diff: 3 },
    { weights: [1, 3, 9, 27], pans: 2, lo: 1, hi: 31, k: 4, title: 'The Parcel and Bachet\'s Weights', diff: 4 },
    { weights: [1, 2, 4, 8, 16, 32], pans: 1, lo: 1, hi: 63, k: 5, title: 'Sixty-Three Possibilities', diff: 4 }
  ];
  finds.forEach((f, i) => {
    const d = { kind: 'find', weights: f.weights, pans: f.pans, lo: f.lo, hi: f.hi, k: f.k };
    const p = {
      id: 'wt-find-' + String(i + 1).padStart(2, '0'), title: f.title, diff: f.diff,
      text: 'A parcel weighs a whole number of kilograms between ' + f.lo + ' and ' + f.hi + '. With the weights ' + f.weights.join(', ') + ' kg' + (f.pans === 1 ? ' (only on the pan opposite the parcel)' : ' (on either pan)') + ' and at most **' + W(f.k) + '** weighings, find out exactly what it weighs. The parcel is sly: its weight is whatever keeps you guessing longest.',
      goal: 'Name the parcel\'s weight for certain.',
      hints: i === 0 ? ['Each weighing tells you lighter, equal or heavier. Aim for the middle.', 'First compare the parcel with 4 kg.'] : undefined,
      explain: i === 0 ? 'Compare with 4: equal ends it; lighter leaves 1–3 (compare with 2), heavier leaves 5–7 (compare with 6). A weighing is lighter / equal / heavier, and "equal" pins a single weight, so k weighings handle 2<sup>k+1</sup> − 1 possibilities: 3, 7, 15, 31, 63.' : undefined,
      data: d, concepts: ['binary']
    };
    check(p);
    out.push(p);
  });
  const asks = [
    {
      id: 'wt-broken', title: 'The Broken Weight', diff: 3,
      source: 'A traditional retelling of Bachet\'s weight problem (1612).',
      text: 'A merchant dropped his 40-pound weight and it broke into **four** pieces, each a whole number of pounds. To his delight he found that with the four pieces he could weigh every whole number of pounds from 1 to 40 on his balance. What did the pieces weigh?',
      data: { kind: 'ask', answer: { nums: [1, 3, 9, 27] }, fig: { weights: [0, 0, 0, 0] } },
      hints: ['The pieces add up to 40.', 'Pieces may go on either pan.'],
      explain: '**1, 3, 9 and 27** pounds — they add up to 40, and as [[wt-bachet]] shows they weigh everything from 1 to 40.',
      concepts: ['ternary'], links: ['wt-bachet']
    },
    {
      id: 'wt-how-few-100', title: 'How Few for a Hundred?', diff: 2,
      text: 'Weights may go on **either** pan. What is the fewest number of weights that can weigh every whole load from 1 to 100 kg?',
      data: { kind: 'ask', answer: { num: 5, unit: 'weights' }, traps: [{ match: 7, msg: 'Seven is right when weights go on one pan only. Here they may go on both.' }], fig: { weights: [1, 3, 9, 27, 0] } },
      explain: 'Four weights reach at most (3<sup>4</sup> − 1)/2 = 40; five reach 121. So **5**.',
      concepts: ['ternary']
    },
    {
      id: 'wt-reach-125', title: 'What Can 1, 2 and 5 Weigh?', diff: 2,
      text: 'With weights of 1, 2 and 5 kg, both pans allowed, how many different whole loads (1 kg or more) can be weighed?',
      data: { kind: 'ask', answer: { num: 8, unit: 'loads' }, fig: { weights: [1, 2, 5] } },
      hints: ['List them: 1, 2, 3 = 1 + 2, 4 = 5 − 1 …'],
      explain: 'Loads 1, 2, 3, 4 (= 5 − 1), 5, 6, 7 and 8: **8** of them. Nothing heavier than 1 + 2 + 5 = 8 is possible, and every load up to 8 turns out to be reachable.',
      concepts: ['ternary']
    },
    {
      id: 'wt-false-balance', title: 'The Grocer\'s False Balance', diff: 3,
      text: 'A grocer\'s balance has arms of **unequal** length, though it hangs level when empty. A cheese weighs 4 kg when put on one pan and 9 kg when put on the other. What does it really weigh?',
      data: { kind: 'ask', answer: { num: 6, unit: 'kg' }, traps: [{ match: 6.5, msg: 'The average is the natural guess — but the arms multiply, they do not add.' }], fig: { balance: { L: [], R: [], tilt: 0 } } },
      hints: ['Weight × arm length is the same on both sides.', 'If the arms are a and b: C × a = 4 × b and 9 × a = C × b.'],
      explain: 'Multiply the two balances: C × a × 9 × a = 4 × b × C × b, so C<sup>2</sup> = 36 and C = **6 kg** — the geometric mean, not the average 6.5. Weighing on both pans and taking the geometric mean is Gauss\'s method for a false balance.',
      concepts: ['torque']
    },
    {
      id: 'wt-how-few-one-pan', title: 'How Few on One Pan?', diff: 1,
      text: 'The weights may only go on the pan opposite the load. What is the fewest number of weights that can weigh every whole load from 1 to 30 kg?',
      data: { kind: 'ask', answer: { num: 5, unit: 'weights' }, traps: [{ match: 4, msg: 'Four weights on one pan reach at most 15.' }], fig: { weights: [1, 2, 4, 8, 16] } },
      explain: 'Four weights give at most 2<sup>4</sup> − 1 = 15 loads; five give 31. So **5**: 1, 2, 4, 8 and 16 kg.',
      concepts: ['binary']
    }
  ];
  asks.forEach(check);
  const all = out.concat(asks);
  all.sort((a, b) => a.diff - b.diff);
  return all;
}

const coins = buildCoins();
emitFamily('counterfeit-coin.js', {
  id: 'counterfeit-coin', engine: 'balance', cat: 'measure', name: 'The false coin', order: 2,
  blurb: 'One coin is false. A balance, a few weighings, and a scale that answers as unhelpfully as it can.',
  origin: { year: 1945, who: 'Puzzle columns of the 1940s', note: 'Finding one heavy coin among many is old; the version where nobody knows whether it is heavier or lighter spread in the mid-1940s, and in 1946 Freeman Dyson worked out how many coins any number of weighings can handle.' },
  concepts: ['ternary', 'state-space']
}, coins);
const weights = buildWeights();
emitFamily('weights.js', {
  id: 'weights', engine: 'balance', cat: 'measure', name: 'Weights and scales', order: 3,
  blurb: 'Choose weights that weigh everything, balance awkward loads, and pin down a parcel in few weighings.',
  origin: { year: 1612, who: 'Bachet de Méziriac', note: 'Bachet\'s book of pleasant problems (1612) asked for the fewest weights that weigh every load up to 40 pounds: 1, 3, 9 and 27, with weights on both pans.' },
  concepts: ['ternary', 'binary', 'torque']
}, weights);
const spread = (list) => [1, 2, 3, 4, 5].map((d) => list.filter((p) => p.diff === d).length).join('/');
console.log('counterfeit-coin: ' + coins.length + ' (' + spread(coins) + ')   weights: ' + weights.length + ' (' + spread(weights) + ')');
