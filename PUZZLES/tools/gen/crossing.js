/* The Puzzle Cabinet · tools/gen/crossing.js
 *
 *   node tools/gen/crossing.js     writes data/river-crossing.js and data/bridge-torch.js
 *
 * The classics first (Alcuin, the jealous husbands, the explorers and the
 * ogres, the soldiers and the boys), then variants made by the engine's own
 * generator with fixed seeds. Every river puzzle's par is the fewest
 * crossings found by breadth-first search; every bridge puzzle's time limit
 * is the least possible total time, found by Dijkstra's search.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/crossing.js'));
const X = C.crossingSolver;
const eng = C.engines.crossing;

function emitFamily(file, meta, puzzles) {
  const lines = ['/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/crossing.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 1).replace(/\n\s*/g, ' ') + ', ['];
  puzzles.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < puzzles.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, 'data', file), lines.join('\n') + '\n');
}
function finish(p) {
  const r = eng.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (r.warn) throw new Error(p.id + ': ' + r.warn);
  if (p.data.mode !== 'bridge') p.par = r.par;
  return p;
}

/* ======================= rivers ======================= */

const alcuin = 'Alcuin of York, *Propositiones ad acuendos juvenes* (c. 800)';
const wgc = X.eaters(X.THEMES[0], 2);
const siblings = X.couples(3, 2);
siblings.rel = 'siblings';
const cart = { mode: 'river', people: [{ k: 'man', n: 'Father', w: 80, row: true }, { k: 'woman', n: 'Mother', w: 80, row: true }, { k: 'child', n: 'Son', w: 40, row: true }, { k: 'child', n: 'Daughter', w: 40, row: true }], cap: 2, maxW: 80 };
const hedgehogs = { mode: 'river', people: [{ k: 'hedgehog', n: 'Father hedgehog', w: 2, row: true }, { k: 'hedgehog', n: 'Mother hedgehog', w: 2, row: true }, { k: 'hedgehog', n: 'Young one', w: 1, row: true }, { k: 'hedgehog', n: 'Younger one', w: 1, row: true }], cap: 2, maxW: 2, unitW: 'units' };
const riverClassics = [
  {
    id: 'rc-bigger-boat', title: 'A Bigger Boat', diff: 1,
    text: 'The farmer from the famous old puzzle has bought a bigger boat: it carries the farmer and **two** more. He still has a wolf, a goat and a cabbage to bring across — and left alone, the wolf still eats the goat and the goat still eats the cabbage.',
    data: X.eaters(X.THEMES[0], 3),
    hints: ['Who is the only one who can be left with anybody?'],
    explain: 'Take the wolf and the cabbage over first — they are no danger to each other — come back alone, and fetch the goat. Three crossings. With a two-seat boat it is a real puzzle: [[rc-wolf-goat-cabbage]].',
    links: ['rc-wolf-goat-cabbage']
  },
  {
    id: 'rc-wolf-goat-cabbage', title: 'The Wolf, the Goat and the Cabbage', diff: 2, year: 800,
    source: alcuin + ', problem 18.',
    text: 'A farmer must take a wolf, a goat and a cabbage across a river. His boat holds only the farmer and one of the three. If he leaves the wolf alone with the goat, the wolf eats the goat; if he leaves the goat with the cabbage, the goat eats the cabbage. How does he get all three across unharmed?',
    data: wgc,
    hints: ['The goat is the troublemaker: it is in danger from the wolf and dangerous to the cabbage.', 'Nothing forbids taking something *back* across the river.'],
    explain: 'Take the goat over and come back. Take the wolf (or the cabbage) over — and bring the goat back with you. Take the cabbage (or the wolf) over and come back alone; finally fetch the goat. Seven crossings. The key move is carrying the goat back: a step that seems to undo progress is the whole trick.',
    concepts: ['state-space'], tags: ['classic'], links: ['rc-fox-goose-beans', 'rc-bigger-boat']
  },
  {
    id: 'rc-fox-goose-beans', title: 'The Fox, the Goose and the Beans', diff: 2,
    source: 'The same puzzle as Alcuin\'s, as it is told in England and America.',
    text: 'A farmer returning from market has a fox, a goose and a bag of beans, and a boat that holds himself and one of them. Left alone, the fox would eat the goose, and the goose would eat the beans. Get everything across.',
    data: X.eaters(X.THEMES[1], 2),
    hints: ['The goose is in the middle of the food chain. Move it first.'],
    links: ['rc-wolf-goat-cabbage'], concepts: ['state-space']
  },
  {
    id: 'rc-cart-loads', title: 'A Cart-Load Each', diff: 2, year: 800,
    source: alcuin + ', problem 19.',
    text: 'A man and his wife each weigh as much as a loaded cart; their two children together weigh the same as one. They must cross a river in a boat that carries only one cart-load. How do they manage without sinking it?',
    data: cart,
    hints: ['Only the children can go together.', 'Someone has to bring the boat back every time — who is lightest?'],
    explain: 'The two children cross; one brings the boat back. The father crosses alone; the other child brings the boat back. Both children cross again; one returns; the mother crosses; the child on the far side returns; and the two children cross together. Nine crossings — the children do all the rowing back.',
    concepts: ['state-space']
  },
  {
    id: 'rc-hedgehogs', title: 'The Hedgehog Family', diff: 2, year: 800,
    source: alcuin + ', problem 20 — the same puzzle as problem 19, told with hedgehogs.',
    text: 'A father and mother hedgehog, each weighing two units, and their two little ones, each weighing one, must cross a stream in a boat (well, a leaf) that holds two units. How?',
    data: hedgehogs,
    hints: ['It is [[rc-cart-loads]] with prickles.'],
    links: ['rc-cart-loads']
  },
  {
    id: 'rc-brothers-sisters', title: 'Three Brothers and Their Sisters', diff: 4, year: 800,
    source: alcuin + ', problem 17. Later writers, from Tartaglia to Bachet, told it as three jealous husbands and their wives.',
    text: 'Three brothers, each with an unmarried sister, come to a river. The boat holds only two. Each brother is fiercely protective: no sister may be with another man, on either bank or in the boat, unless her own brother is there as well. How do all six cross?',
    data: siblings,
    hints: ['At the start only women can safely cross together (or a brother with his own sister).', 'Halfway through, two brothers cross together — and one brother and his sister come back.'],
    explain: 'Eleven crossings: two sisters cross, one returns; two sisters cross, one returns (now two sisters are over); two brothers cross, and a brother with his sister returns; the two brothers cross; a sister returns and fetches another; and finally the last brother fetches his sister. With **four** pairs and a two-seat boat it cannot be done at all; with a three-seat boat it can: [[rc-four-couples]].',
    concepts: ['state-space'], tags: ['classic'], links: ['rc-jealous-two', 'rc-four-couples']
  },
  {
    id: 'rc-jealous-two', title: 'Two Jealous Husbands', diff: 2,
    text: 'Two married couples must cross in a boat for two. No wife may be with the other man, on a bank or in the boat, unless her own husband is there too.',
    data: X.couples(2, 2),
    hints: ['Let the wives cross first.'],
    links: ['rc-brothers-sisters']
  },
  {
    id: 'rc-four-couples', title: 'Four Couples, Boat of Three', diff: 4,
    text: 'Four jealous couples must cross, and the boat now holds **three**. (With a boat for two it is impossible.) No wife may be with another man unless her husband is present — on the banks or in the boat.',
    data: X.couples(4, 3),
    hints: ['Start by sending three wives over.', 'A boat for three lets two husbands travel with one of their wives.'],
    links: ['rc-brothers-sisters', 'rc-five-couples']
  },
  {
    id: 'rc-five-couples', title: 'Five Couples, Boat of Three', diff: 5,
    text: 'Five jealous couples, a boat for three, and the usual rule: no wife in the company of another man unless her husband is there too — on land or on the water.',
    data: X.couples(5, 3),
    hints: ['Wives first, three at a time, with one bringing the boat back.', 'The middle of the solution moves husbands over while their wives wait on the far bank.'],
    links: ['rc-four-couples']
  },
  {
    id: 'rc-explorers', title: 'Explorers and Ogres', diff: 3,
    source: 'The jealous-husbands puzzle recast; for a long time it was told as "missionaries and cannibals".',
    text: 'Three explorers and three ogres must cross a river in a boat that holds two. The ogres are perfectly friendly — as long as they never **outnumber** the explorers. On either bank, if there are any explorers at all, there must never be more ogres than explorers (a landed boat counts as part of its bank). Anyone can row.',
    data: X.explorers(3, 3, 2),
    hints: ['Two ogres can cross first safely — there are no explorers on the far bank to outnumber.', 'In the middle, an explorer and an ogre must come back together.'],
    explain: 'Eleven crossings. Two ogres cross and one comes back; two ogres cross again and one comes back — now the three explorers are at home with one ogre, and two ogres wait on the far bank. Two explorers cross; an explorer and an ogre come back (the only safe return); two explorers cross; and the ogres, who can no longer outnumber anybody, ferry each other over. The one clever move is sending a *mixed* pair back.',
    concepts: ['state-space'], tags: ['classic'], links: ['rc-explorers-five', 'rc-explorers-rowers']
  },
  {
    id: 'rc-explorers-five', title: 'Five Explorers, Five Ogres', diff: 4,
    text: 'Five explorers and five ogres, and a boat that holds **three**. Ogres must never outnumber explorers — on a bank or in the boat — wherever there are explorers. With four of each and a boat of two it is impossible; can you do five with a boat of three?',
    data: X.explorers(5, 5, 3),
    hints: ['Start as in [[rc-explorers]]: ogres first.', 'In the boat as on land: one explorer with two ogres is not allowed.'],
    links: ['rc-explorers']
  },
  {
    id: 'rc-explorers-rowers', title: 'Only Two Can Row', diff: 4,
    text: 'Three explorers and three ogres, a boat for two — but only **one explorer and one ogre** know how to row. The ogres still must never outnumber the explorers on either bank.',
    data: X.explorers(3, 3, 2, { e: 1, o: 1 }),
    hints: ['Every crossing needs one of the two rowers.', 'The rowing ogre does most of the ferrying at the start.'],
    links: ['rc-explorers']
  },
  {
    id: 'rc-soldiers', title: 'The Soldiers and the Boys', diff: 2,
    source: 'A traditional puzzle.',
    text: 'A troop of **two** soldiers must cross a deep river with no bridge. Two boys are playing in a small boat, which can carry the two boys together, or one soldier — but not a soldier and a boy. How do the soldiers get across?',
    data: X.soldiers(2, 2),
    hints: ['The boys must end each round with the boat back where the soldiers are waiting.'],
    explain: 'Both boys row over; one brings the boat back; a soldier rows over; the other boy brings the boat back. Four crossings move one soldier and leave everything as it was — so any number of soldiers can cross, four trips each.',
    concepts: ['invariant'], links: ['rc-soldiers-four']
  },
  {
    id: 'rc-soldiers-four', title: 'A Whole Troop', diff: 3,
    text: 'The same boys and their little boat — two boys, or one soldier — but now **four** soldiers must cross.',
    data: X.soldiers(4, 2),
    hints: ['Find four crossings that move one soldier and put everything else back as it was.'],
    links: ['rc-soldiers'], concepts: ['invariant']
  }
];

function buildRiver() {
  const out = riverClassics.map((c) => finish(Object.assign({}, c, { goal: X.goalText(c.data) })));
  const seen = new Set(out.map((p) => JSON.stringify(p.data)));
  const titles = new Set(out.map((p) => p.title));
  const want = [0, 8, 12, 13, 9, 6];
  const gen = [];
  for (let level = 1; level <= 5; level++) {
    let got = 0;
    for (let seed = 1; got < want[level] && seed < 4000; seed++) {
      const rng = C.rng(90000 + level * 1000 + seed);
      const v = eng.generate(rng, level, { id: 'river-crossing' });
      if (!v) continue;
      const key = JSON.stringify(v.data);
      if (seen.has(key)) continue;
      seen.add(key);
      let title = v.title;
      for (let k = 2; titles.has(title); k++) title = v.title + ' ' + ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][k];
      titles.add(title);
      gen.push({ title, diff: level, text: v.text, goal: v.goal, data: v.data, concepts: ['state-space'] });
      got++;
    }
  }
  gen.forEach((p, i) => { p.id = 'rc-v' + String(i + 1).padStart(3, '0'); finish(p); });
  const all = out.concat(gen).map((p) => Object.assign({ id: p.id }, p));
  all.sort((a, b) => a.diff - b.diff || (a.par || 0) - (b.par || 0));
  return all;
}

/* ======================= the bridge ======================= */

const who = (ts, names) => ts.map((t, i) => ({ k: 'person', t, n: names ? names[i] : ['Ada', 'Bo', 'Cy', 'Di', 'Eli', 'Fay', 'Gus'][i] }));
function bridge(ts, cap, names) {
  const d = { mode: 'bridge', people: who(ts, names), cap: cap || 2 };
  d.limit = X.fastest(d).cost;
  return d;
}
const bridgeClassics = [
  {
    id: 'torch-three', title: 'Three at the Bridge', diff: 1,
    text: 'Three hikers reach a narrow rope bridge after dark. At most two can be on it at once, and they have one torch, which must be carried on every crossing. Ada crosses in 1 minute, Bo in 2, Cy in 5; a pair walks at the slower one\'s pace. The torch has **8 minutes** of fuel left.',
    data: bridge([1, 2, 5]),
    hints: ['Somebody must bring the torch back. Who should it be?'],
    explain: 'Ada and Bo cross (2), Ada brings the torch back (1), Ada and Cy cross (5): 8 minutes. With three people the fastest one simply escorts the others.'
  },
  {
    id: 'torch-night', title: 'The Bridge at Night', diff: 3,
    source: 'A modern puzzle: it appeared in puzzle books around 1980 and became a famous interview question in the 1990s.',
    text: 'Four friends must cross a rickety bridge at night. It holds at most two, and they have a single torch that must go with every crossing. Ada needs 1 minute, Bo 2, Cy 5 and Di 10; a pair walks at the slower one\'s pace. The torch will last exactly **17 minutes**. How do they all get over?',
    data: bridge([1, 2, 5, 10]),
    hints: ['If Ada escorts everyone, it takes 19 minutes. Too slow.', 'Cy and Di are slow. What if they crossed *together*?', 'For them to cross together, someone fast must already be waiting on the far side to bring the torch back.'],
    explain: 'Ada and Bo cross (2). Ada returns (1). Cy and Di cross together (10). Bo returns (2). Ada and Bo cross (2). Total 17. Sending the two slowest together means paying for Cy\'s 5 minutes only as part of Di\'s 10.',
    tags: ['classic'], links: ['torch-no-trick', 'torch-five']
  },
  {
    id: 'torch-no-trick', title: 'When the Trick Doesn\'t Help', diff: 2,
    text: 'Four walkers — 1, 2, 3 and 4 minutes — one torch, a bridge for two, and **11 minutes** of torchlight.',
    data: bridge([1, 2, 3, 4]),
    hints: ['Try the famous trick of [[torch-night]] — and then try the plain way.'],
    explain: 'Here the plain method — Ada escorts each of the others — takes 2 + 1 + 3 + 1 + 4 = 11, and the "slow pair together" trick takes 2 + 1 + 4 + 2 + 2 = 11 too. The trick pays off only when the two slowest are much slower than the two fastest.',
    links: ['torch-night']
  },
  {
    id: 'torch-slow-pair', title: 'Tortoises on the Bridge', diff: 3,
    text: 'Four slow walkers: 5, 10, 20 and 25 minutes. A bridge for two, one torch, and **60 minutes** of fuel.',
    data: bridge([5, 10, 20, 25]),
    hints: ['The same trick as [[torch-night]].'],
    links: ['torch-night']
  },
  {
    id: 'torch-wide', title: 'A Wider Bridge', diff: 2,
    text: 'The four friends of [[torch-night]] (1, 2, 5 and 10 minutes) find a sturdier bridge that holds **three** at a time. There is still only one torch — and only **13 minutes** of it.',
    data: bridge([1, 2, 5, 10], 3),
    hints: ['The 5 and the 10 should cross together — and who should go with them?', 'Someone fast must bring the torch back afterwards.'],
    links: ['torch-night']
  },
  {
    id: 'torch-five', title: 'Five in the Dark', diff: 4,
    text: 'Five people — 1, 3, 6, 8 and 12 minutes — a bridge for two, one torch, **29 minutes**.',
    data: bridge([1, 3, 6, 8, 12]),
    hints: ['Use the trick of [[torch-night]] once: which pair should cross together?', 'The two slowest go together; the 6 is escorted by the 1.'],
    links: ['torch-night']
  },
  {
    id: 'torch-six', title: 'Six on a Rope Bridge', diff: 5,
    text: 'Six walkers: 1, 4, 5, 8, 10 and 12 minutes. The bridge holds two; the torch lasts **40 minutes**.',
    data: bridge([1, 4, 5, 8, 10, 12]),
    hints: ['The two slowest, 12 and 10, should cross together — with 1 and 4 shuttling the torch around them.', 'The 8 and the 5 are cheaper escorted one at a time by the 1.'],
    explain: 'For each pair of slow walkers there are two ways: the fastest escorts each of them (cost 2 × 1 + both times) or the slow pair crosses together while the two fastest shuttle the torch (1 + 2 × 4 + the slower time). For 12 and 10 the pair costs 21 against 24 escorted; for 8 and 5 escorting costs 15 against 17. Then 1 and 4 cross: 21 + 15 + 4 = 40.',
    links: ['torch-five']
  }
];

function buildBridge() {
  const out = bridgeClassics.map((c) => finish(Object.assign({}, c, { goal: X.goalText(c.data) })));
  const seen = new Set(out.map((p) => JSON.stringify(p.data.people.map((q) => q.t)) + p.data.cap));
  const titles = new Set(out.map((p) => p.title));
  const want = [0, 8, 12, 14, 12, 8];
  const gen = [];
  for (let level = 1; level <= 5; level++) {
    let got = 0;
    for (let seed = 1; got < want[level] && seed < 4000; seed++) {
      const rng = C.rng(70000 + level * 1000 + seed);
      const v = eng.generate(rng, level, { id: 'bridge-torch' });
      if (!v) continue;
      const key = JSON.stringify(v.data.people.map((q) => q.t)) + v.data.cap;
      if (seen.has(key)) continue;
      seen.add(key);
      let title = v.title + (v.data.cap > 2 ? ' (three at a time)' : '');
      if (titles.has(title)) continue;
      titles.add(title);
      gen.push({ title, diff: level, text: v.text, goal: v.goal, data: v.data });
      got++;
    }
  }
  gen.forEach((p, i) => { p.id = 'torch-v' + String(i + 1).padStart(3, '0'); finish(p); });
  const all = out.concat(gen).map((p) => Object.assign({ id: p.id }, p));
  all.sort((a, b) => a.diff - b.diff || a.data.people.length - b.data.people.length);
  return all;
}

const river = buildRiver();
emitFamily('river-crossing.js', {
  id: 'river-crossing', engine: 'crossing', cat: 'routes', name: 'River crossings', order: 1,
  blurb: 'One small boat, a wide river, and passengers who must never be left in the wrong company.',
  origin: { year: 800, who: 'Alcuin of York', note: 'The wolf, the goat and the cabbage, the brothers and sisters, and the family as heavy as cart-loads are all in the *Propositiones ad acuendos juvenes* ("problems to sharpen the young") attributed to Alcuin, around 800 — among the oldest puzzles in Europe.' },
  concepts: ['state-space']
}, river);
const br = buildBridge();
emitFamily('bridge-torch.js', {
  id: 'bridge-torch', engine: 'crossing', cat: 'routes', name: 'Bridge and torch', order: 2,
  blurb: 'A bridge for two, one torch, and walkers of very different speeds racing the dark.',
  origin: { year: 1981, who: 'Modern puzzle books', note: 'A young puzzle as these things go: it spread through puzzle books from around 1980 and became a famous job-interview question in the 1990s.' },
  concepts: ['state-space']
}, br);
const spread = (list) => [1, 2, 3, 4, 5].map((d) => list.filter((p) => p.diff === d).length).join('/');
console.log('river-crossing: ' + river.length + ' (' + spread(river) + ')   bridge-torch: ' + br.length + ' (' + spread(br) + ')');
