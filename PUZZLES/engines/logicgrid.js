/* The Puzzle Cabinet · engines/logicgrid.js
 *
 * Logic grids (Einstein or "zebra" puzzles): a few categories — people, pets,
 * drinks, houses in a row — every item of one matched with exactly one item
 * of each other, and a list of clues. The classic triangular grid holds a
 * block for every pair of categories; the player crosses out (✗) and ticks (✓)
 * cells, ticks off clues as they are used, and may fill the answer table.
 *
 * data: {
 *   cats: [{ n: 'House', items: ['1', …], ord: 1, s: 'the person in house {x}', p: 'lives in house {x}', np: 'does not live in house {x}' }, …]
 *          category 0 is the key (the rows of the answer table); ord = its items are in order (positions)
 *   pos:  { lt, imm, next, between, ends, gap }   how order clues read (only with an ordered key)
 *   sol:  [[…], …]      sol[c][k] = the item of category c that goes with key item k (sol[0] = 0, 1, 2 …)
 *   clues: [['same', [c, i], [d, j]], ['not', A, B], ['lt', A, B], ['imm', A, B], ['next', A, B],
 *           ['gap', A, B], ['between', A, B, C], ['ends', A], ['either', A, B, C], ['of2', X, Y, A, B]]
 *   words: ['clue text', …]   (optional: written clue texts, in the same order)
 *   ask:   'Who owns the zebra?'   (optional: shown in the goal)
 * }
 * Clue meanings: same = one person; not = different people; lt = A somewhere before B in the order;
 * imm = A directly before B; next = neighbours; gap = exactly one between them; between = A strictly
 * between B and C; ends = A first or last; either = A goes with exactly one of B and C;
 * of2 = of X and Y, one goes with A and the other with B.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- themes: categories and how clues about them read ---------- */

  const PEOPLE = ['Ada', 'Bram', 'Clara', 'Dev', 'Elsa', 'Felix', 'Greta', 'Hal', 'Ines', 'Jack', 'Kira', 'Luca', 'Mira', 'Ned', 'Otto',
    'Paco', 'Rhea', 'Sam', 'Tess', 'Umar', 'Vivi', 'Wes', 'Yusuf', 'Zoe', 'Anya', 'Boris', 'Cyril', 'Dina', 'Emil', 'Fern', 'Gil', 'Hana', 'Ivan', 'Jade', 'Kurt', 'Lena', 'Milo', 'Nina', 'Omar', 'Pearl'];
  const person = (n) => ({ n: n || 'Name', people: true, s: '{x}', p: 'is {x}', np: 'is not {x}' });

  const THEMES = {
    street: {
      intro: (n) => NUMW[n] + ' houses stand in a row along the street, numbered 1 to ' + n + ' from left to right. In each lives one person, and no two share anything below.',
      key: { n: 'House', ord: 1, items: (n) => range(n), s: 'the person in house {x}', p: 'lives in house {x}', np: 'does not live in house {x}' },
      pos: { lt: '{A} lives somewhere to the left of {B}', imm: '{A} lives directly to the left of {B}', next: '{A} lives next door to {B}', between: '{A} lives somewhere between {B} and {C}', ends: '{A} lives at one end of the street', gap: 'Exactly one house stands between {A} and {B}' },
      cats: [
        person('Owner'),
        { n: 'Colour', items: ['red', 'green', 'blue', 'yellow', 'white', 'pink'], s: 'the owner of the {x} house', p: 'lives in the {x} house', np: 'does not live in the {x} house' },
        { n: 'Pet', items: ['cat', 'dog', 'parrot', 'tortoise', 'goldfish', 'ferret'], s: 'the {x} owner', p: 'keeps the {x}', np: 'does not keep the {x}' },
        { n: 'Drink', items: ['tea', 'coffee', 'milk', 'cocoa', 'juice', 'water'], s: 'the {x} drinker', p: 'drinks {x}', np: 'does not drink {x}' },
        { n: 'Job', items: ['baker', 'painter', 'sailor', 'teacher', 'doctor', 'poet'], s: 'the {x}', p: 'is the {x}', np: 'is not the {x}' }
      ],
      titles: ['Mill Lane', 'Cherry Row', 'Quayside Terrace', 'Orchard Street', 'Lantern Walk', 'Poppy Crescent', 'Bell Street', 'Tanner’s Row', 'Rope Lane', 'Chapel Row']
    },
    harbour: {
      intro: (n) => NUMW[n] + ' fishing boats lie at the berths along the quay, numbered 1 to ' + n + ' from left to right. Each has its own skipper, and no two share anything below.',
      key: { n: 'Berth', ord: 1, items: (n) => range(n), s: 'the skipper at berth {x}', p: 'is moored at berth {x}', np: 'is not moored at berth {x}' },
      pos: { lt: '{A} is moored somewhere to the left of {B}', imm: '{A} is moored directly to the left of {B}', next: '{A} is moored right beside {B}', between: '{A} is moored somewhere between {B} and {C}', ends: '{A} is moored at one end of the quay', gap: 'Exactly one boat lies between {A} and {B}' },
      cats: [
        person('Skipper'),
        { n: 'Boat', items: ['Albatross', 'Pelican', 'Puffin', 'Gannet', 'Kittiwake', 'Cormorant'], s: 'the skipper of the {x}', p: 'sails the {x}', np: 'does not sail the {x}' },
        { n: 'Cargo', items: ['bananas', 'coffee', 'timber', 'salt', 'spices', 'wool'], s: 'the skipper carrying {x}', p: 'carries {x}', np: 'does not carry {x}' },
        { n: 'Flag', items: ['red', 'blue', 'green', 'yellow', 'white', 'black'], s: 'the skipper with the {x} flag', p: 'flies a {x} flag', np: 'does not fly a {x} flag' }
      ],
      titles: ['Morning Tide', 'The North Quay', 'Fair Winds', 'Low Water', 'The Fishing Fleet', 'Harbour Lights', 'Storm Warning', 'The Quay at Dawn', 'Sail and Anchor', 'Moorings']
    },
    race: {
      intro: (n) => NUMW[n] + ' runners took part in the race, and no two finished level. Each wore a different colour and no two share anything below.',
      key: { n: 'Place', ord: 1, items: (n) => ['1st', '2nd', '3rd', '4th', '5th', '6th'].slice(0, n), s: 'the runner who came {x}', p: 'came {x}', np: 'did not come {x}' },
      pos: { lt: '{A} finished somewhere ahead of {B}', imm: '{A} finished just ahead of {B}', next: '{A} and {B} finished one place apart', between: '{A} finished somewhere between {B} and {C}', ends: '{A} came either first or last', gap: 'Exactly one runner finished between {A} and {B}' },
      cats: [
        person('Runner'),
        { n: 'Shirt', items: ['red', 'orange', 'green', 'blue', 'purple', 'white'], s: 'the runner in {x}', p: 'wore {x}', np: 'did not wear {x}' },
        { n: 'Town', items: ['Avonby', 'Brackwell', 'Cobham', 'Dunmore', 'Elmstead', 'Fernhill'], s: 'the runner from {x}', p: 'comes from {x}', np: 'does not come from {x}' },
        { n: 'Snack', items: ['banana', 'flapjack', 'pretzel', 'apple', 'muffin', 'date'], s: 'the runner who ate {a x}', p: 'ate {a x} before the start', np: 'did not eat {a x}' }
      ],
      titles: ['The Village Fun Run', 'Up Beacon Hill', 'The Beach Dash', 'The Charity Mile', 'Cross-Country', 'The Park Run', 'Hill and Dale', 'The Frost Fair Race', 'Sports Day', 'The Towpath Ten']
    },
    concert: {
      intro: (n) => NUMW[n] + ' friends sit side by side in the front row, in seats 1 to ' + n + ' from left to right. No two share anything below.',
      key: { n: 'Seat', ord: 1, items: (n) => range(n), s: 'the guest in seat {x}', p: 'sits in seat {x}', np: 'does not sit in seat {x}' },
      pos: { lt: '{A} sits somewhere to the left of {B}', imm: '{A} sits directly to the left of {B}', next: '{A} sits next to {B}', between: '{A} sits somewhere between {B} and {C}', ends: '{A} sits at one end of the row', gap: 'Exactly one seat separates {A} and {B}' },
      cats: [
        person('Guest'),
        { n: 'Instrument', items: ['flute', 'cello', 'harp', 'oboe', 'trumpet', 'violin'], s: 'the {x} player', p: 'plays the {x}', np: 'does not play the {x}' },
        { n: 'Drink', items: ['lemonade', 'cocoa', 'ginger beer', 'tea', 'cider', 'coffee'], s: 'the guest who ordered {x}', p: 'ordered {x} in the interval', np: 'did not order {x}' },
        { n: 'Hat', items: ['beret', 'bowler', 'sun hat', 'top hat', 'cap', 'bonnet'], s: 'the guest in the {x}', p: 'wears {a x}', np: 'does not wear {a x}' }
      ],
      titles: ['Front Row', 'The Summer Recital', 'Interval Drinks', 'The Bandstand Concert', 'Chamber Music', 'Encore!', 'The Last Night', 'The Matinee', 'The Opera Box', 'Row F']
    },
    hotel: {
      intro: (n) => 'The little hotel has ' + NUMW[n].toLowerCase() + ' floors, numbered 1 (the lowest) to ' + n + ' (the top), with one guest on each. No two guests share anything below.',
      key: { n: 'Floor', ord: 1, items: (n) => range(n), s: 'the guest on floor {x}', p: 'stays on floor {x}', np: 'does not stay on floor {x}' },
      pos: { lt: '{A} stays on a lower floor than {B}', imm: '{A} stays on the floor directly below {B}', next: '{A} and {B} stay on neighbouring floors', between: '{A} stays on a floor somewhere between {B} and {C}', ends: '{A} stays on the top floor or the bottom one', gap: 'There is exactly one floor between {A} and {B}' },
      cats: [
        person('Guest'),
        { n: 'Country', items: ['Peru', 'Norway', 'Japan', 'Kenya', 'Chile', 'Spain'], s: 'the guest from {x}', p: 'comes from {x}', np: 'does not come from {x}' },
        { n: 'Luggage', items: ['trunk', 'rucksack', 'suitcase', 'hatbox', 'carpet bag', 'violin case'], s: 'the guest with the {x}', p: 'brought {a x}', np: 'did not bring {a x}' },
        { n: 'Breakfast', items: ['porridge', 'kippers', 'pancakes', 'eggs', 'fruit', 'toast'], s: 'the guest who ordered {x}', p: 'ordered {x} for breakfast', np: 'did not order {x}' }
      ],
      titles: ['The Grand Hotel', 'Room Service', 'The Lift Is Broken', 'Seaview Hotel', 'Guests at the Belvedere', 'The Night Porter', 'Breakfast Is Served', 'The Top Floor', 'Check-In', 'Do Not Disturb']
    },
    bakery: {
      intro: (n) => NUMW[n] + ' customers came to the bakery one morning to collect birthday cakes, one on each hour from 7 o’clock. No two share anything below.',
      key: { n: 'Time', ord: 1, items: (n) => ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00'].slice(0, n), s: 'the customer who came at {x}', p: 'came in at {x}', np: 'did not come in at {x}' },
      pos: { lt: '{A} came in some time before {B}', imm: '{A} came in exactly an hour before {B}', next: '{A} and {B} came in an hour apart', between: '{A} came in some time between {B} and {C}', ends: '{A} was either the first customer or the last', gap: '{A} and {B} came in two hours apart' },
      cats: [
        person('Customer'),
        { n: 'Cake', items: ['lemon', 'chocolate', 'carrot', 'walnut', 'cherry', 'ginger'], s: 'the customer who ordered the {x} cake', p: 'ordered the {x} cake', np: 'did not order the {x} cake' },
        { n: 'Candles', items: ['3', '5', '7', '8', '10', '12'], s: 'the customer who wanted {x} candles', p: 'wanted {x} candles', np: 'did not want {x} candles' },
        { n: 'Topping', items: ['cherries', 'sprinkles', 'almonds', 'violets', 'marzipan', 'coconut'], s: 'the customer who asked for {x}', p: 'asked for {x} on top', np: 'did not ask for {x}' }
      ],
      titles: ['Birthday Cakes', 'The Baker’s Dozen', 'Candles and Crumbs', 'The Morning Rush', 'Icing on Top', 'Orders at the Counter', 'Fresh from the Oven', 'The Cake Book', 'A Slice of Morning', 'Sugar and Spice']
    },
    garden: {
      intro: (n) => NUMW[n] + ' gardeners entered the village show. Each grows one vegetable, and no two share anything below.',
      key: person('Gardener'),
      cats: [
        { n: 'Vegetable', items: ['leeks', 'beans', 'pumpkins', 'radishes', 'carrots', 'onions'], s: 'the grower of {x}', p: 'grows {x}', np: 'does not grow {x}' },
        { n: 'Tool', items: ['hoe', 'rake', 'spade', 'trowel', 'fork', 'shears'], s: 'the gardener with the {x}', p: 'swears by the {x}', np: 'does not use the {x}' },
        { n: 'Prize', items: ['gold rosette', 'silver cup', 'blue ribbon', 'bronze medal', 'red ribbon', 'certificate'], s: 'the winner of the {x}', p: 'won the {x}', np: 'did not win the {x}' },
        { n: 'Plot', items: ['north', 'south', 'east', 'west', 'hill', 'river'], s: 'the gardener on the {x} plot', p: 'works the {x} plot', np: 'does not work the {x} plot' }
      ],
      titles: ['The Allotments', 'The Village Show', 'Prize Vegetables', 'Muddy Boots', 'The Garden Shed', 'Green Fingers', 'Harvest Home', 'The Vegetable Plot', 'Blue Ribbons', 'The Compost Heap']
    },
    pets: {
      intro: (n) => NUMW[n] + ' children brought their pets to the school pet show. No two share anything below.',
      key: person('Child'),
      cats: [
        { n: 'Pet', items: ['hamster', 'rabbit', 'tortoise', 'parrot', 'kitten', 'goldfish'], s: 'the {x} owner', p: 'owns the {x}', np: 'does not own the {x}' },
        { n: 'Pet’s name', items: ['Biscuit', 'Pickle', 'Noodle', 'Pepper', 'Muffin', 'Ziggy'], s: 'the owner of {x}', p: 'named their pet {x}', np: 'did not name their pet {x}' },
        { n: 'Age', items: ['6', '7', '8', '9', '10', '11'], s: 'the {x}-year-old', p: 'is {x}', np: 'is not {x}' },
        { n: 'Rosette', items: ['red', 'blue', 'green', 'gold', 'purple', 'silver'], s: 'the child with the {x} rosette', p: 'won the {x} rosette', np: 'did not win the {x} rosette' }
      ],
      titles: ['Pet Show', 'Whiskers and Paws', 'The Vet’s Waiting Room', 'Show and Tell', 'Pocket Pets', 'Class Pets', 'The Pet Parade', 'Names for Pets', 'Feeding Time', 'The Pet Sitter']
    },
    library: {
      intro: (n) => NUMW[n] + ' friends spent a rainy afternoon in the town library. No two share anything below.',
      key: person('Reader'),
      cats: [
        { n: 'Book', items: ['mystery', 'western', 'atlas', 'cookbook', 'songbook', 'spy novel'], s: 'the reader of the {x}', p: 'borrowed {a x}', np: 'did not borrow {a x}' },
        { n: 'Snack', items: ['grapes', 'olives', 'biscuits', 'toffees', 'crackers', 'figs'], s: 'the reader who brought {x}', p: 'brought {x}', np: 'did not bring {x}' },
        { n: 'Armchair', items: ['green', 'red', 'blue', 'brown', 'yellow', 'grey'], s: 'the reader in the {x} armchair', p: 'sat in the {x} armchair', np: 'did not sit in the {x} armchair' },
        { n: 'Hat', items: ['beret', 'cap', 'beanie', 'fedora', 'sou’wester', 'bobble hat'], s: 'the reader in the {x}', p: 'wore {a x}', np: 'did not wear {a x}' }
      ],
      titles: ['Quiet, Please', 'The Reading Room', 'Overdue', 'Bookworms', 'The Mobile Library', 'Snacks in the Stacks', 'The Book Club', 'Late Returns', 'Chapter One', 'Shelf Life']
    }
  };
  const NUMW = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
  function range(n) { return Array.from({ length: n }, (_, i) => String(i + 1)); }

  /* ---------- words ---------- */

  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const art = (x) => (/^[aeiou]/i.test(x) && !/^(uni|eu|one)/i.test(x) ? 'an ' : 'a ') + x;
  function fill(tpl, x) { return tpl.replace('{a x}', art(x)).replace('{x}', x); }
  function listOr(a) { return a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]; }

  const W = {
    label: (d, A) => d.cats[A[0]].items[A[1]],
    s: (d, A) => fill(d.cats[A[0]].s, d.cats[A[0]].items[A[1]]),
    p: (d, A) => fill(d.cats[A[0]].p, d.cats[A[0]].items[A[1]]),
    np: (d, A) => fill(d.cats[A[0]].np, d.cats[A[0]].items[A[1]])
  };

  // a clue in words
  function clueText(d, cl) {
    const S = (A) => W.s(d, A);
    const pos = d.pos || {};
    const P = (tpl, a, b, c) => cap(tpl.replace('{A}', a ? S(a) : '').replace('{B}', b ? S(b) : '').replace('{C}', c ? S(c) : '')) + '.';
    switch (cl[0]) {
      case 'same': return cap(S(cl[1])) + ' ' + W.p(d, cl[2]) + '.';
      case 'not': return cap(S(cl[1])) + ' ' + W.np(d, cl[2]) + '.';
      case 'lt': return P(pos.lt, cl[1], cl[2]);
      case 'imm': return P(pos.imm, cl[1], cl[2]);
      case 'next': return P(pos.next, cl[1], cl[2]);
      case 'gap': return P(pos.gap, cl[1], cl[2]);
      case 'between': return P(pos.between, cl[1], cl[2], cl[3]);
      case 'ends': return P(pos.ends, cl[1]);
      case 'either': return cap(S(cl[1])) + ' either ' + W.p(d, cl[2]) + ' or ' + W.p(d, cl[3]) + (cl[2][0] !== cl[3][0] ? ', but not both' : '') + '.';
      case 'of2': return 'Of ' + S(cl[1]) + ' and ' + S(cl[2]) + ', one ' + W.p(d, cl[3]) + ' and the other ' + W.p(d, cl[4]) + '.';
      default: return '?';
    }
  }
  const clueWords = (d, k) => (d.words && d.words[k]) || clueText(d, d.clues[k]);

  /* ---------- the rules of a clue ---------- */

  function holds(t, e, n) {
    switch (t) {
      case 'same': return e[0] === e[1];
      case 'not': return e[0] !== e[1];
      case 'lt': return e[0] < e[1];
      case 'imm': return e[0] + 1 === e[1];
      case 'next': return Math.abs(e[0] - e[1]) === 1;
      case 'gap': return Math.abs(e[0] - e[1]) === 2;
      case 'between': return (e[1] < e[0] && e[0] < e[2]) || (e[2] < e[0] && e[0] < e[1]);
      case 'ends': return e[0] === 0 || e[0] === n - 1;
      case 'either': return (e[0] === e[1]) !== (e[0] === e[2]);
      case 'of2': return e[0] !== e[1] && ((e[0] === e[2] && e[1] === e[3]) || (e[0] === e[3] && e[1] === e[2]));
      default: return false;
    }
  }
  const ORDER_CLUES = ['lt', 'imm', 'next', 'gap', 'between', 'ends'];
  const refsOf = (cl) => cl.slice(1);
  const bitsOf = (v) => { const out = []; for (let k = 0; v; k++, v >>= 1) if (v & 1) out.push(k); return out; };
  const popcount = (v) => { let c = 0; while (v) { v &= v - 1; c++; } return c; };
  function atOf(sol) { return sol.map((row) => { const at = []; row.forEach((item, k) => { at[item] = k; }); return at; }); }

  // does the whole assignment (sol[c][k] = item) satisfy clue cl?
  function clueHolds(cl, at, n) { return holds(cl[0], refsOf(cl).map((A) => at[A[0]][A[1]]), n); }

  /* ---------- counting solutions: domains of entities as bit masks ---------- */

  function gacMask(cl, dom, n) {
    const refs = refsOf(cl), R = refs.length;
    const vals = refs.map((A) => bitsOf(dom[A[0]][A[1]]));
    const sup = new Array(R).fill(0), e = new Array(R);
    const rec = (j) => {
      if (j === R) { if (holds(cl[0], e, n)) for (let t = 0; t < R; t++) sup[t] |= 1 << e[t]; return; }
      for (const v of vals[j]) {
        let ok = true;
        for (let t = 0; t < j; t++) if (refs[t][0] === refs[j][0] && e[t] === v) { ok = false; break; }
        if (!ok) continue;
        e[j] = v;
        rec(j + 1);
      }
    };
    rec(0);
    let changed = 0;
    for (let t = 0; t < R; t++) {
      const A = refs[t], old = dom[A[0]][A[1]], nw = old & sup[t];
      if (!nw) return false;
      if (nw !== old) { dom[A[0]][A[1]] = nw; changed = 1; }
    }
    return changed;
  }

  function countSolutions(d, max, clues) {
    clues = clues || d.clues;
    const m = d.cats.length, n = d.cats[0].items.length, full = (1 << n) - 1;
    const start = [];
    for (let c = 0; c < m; c++) { start.push([]); for (let i = 0; i < n; i++) start[c].push(c === 0 ? 1 << i : full); }
    let count = 0, first = null, nodes = 0;
    function prop(dom) {
      let changed = true;
      while (changed) {
        changed = false;
        for (const cl of clues) {
          const r = gacMask(cl, dom, n);
          if (r === false) return false;
          if (r) changed = true;
        }
        for (let c = 1; c < m; c++) {
          const D = dom[c];
          for (let i = 0; i < n; i++) {
            const v = D[i];
            if (!v) return false;
            if ((v & (v - 1)) === 0) for (let j = 0; j < n; j++) if (j !== i && (D[j] & v)) { D[j] &= ~v; changed = true; if (!D[j]) return false; }
          }
          for (let k = 0; k < n; k++) {
            const bit = 1 << k;
            let who = -1, cnt = 0;
            for (let i = 0; i < n; i++) if (D[i] & bit) { cnt++; who = i; }
            if (!cnt) return false;
            if (cnt === 1 && D[who] !== bit) { D[who] = bit; changed = true; }
          }
        }
      }
      return true;
    }
    function rec(dom) {
      if (count >= max || ++nodes > 200000) return;
      if (!prop(dom)) return;
      let bc = -1, bi = -1, bs = 99;
      for (let c = 1; c < m; c++) for (let i = 0; i < n; i++) { const pc = popcount(dom[c][i]); if (pc > 1 && pc < bs) { bs = pc; bc = c; bi = i; } }
      if (bc < 0) {
        count++;
        if (!first) first = dom.map((row) => { const s = []; row.forEach((v, i) => { s[bitsOf(v)[0]] = i; }); return s; });
        return;
      }
      let v = dom[bc][bi];
      while (v && count < max) {
        const bit = v & -v;
        v &= v - 1;
        const d2 = dom.map((r) => r.slice());
        d2[bc][bi] = bit;
        rec(d2);
      }
    }
    rec(start);
    return { count, sol: first, nodes };
  }

  /* ---------- the grid of ticks and crosses, and how a person fills it ---------- */

  function Grid(m, n) {
    this.m = m; this.n = n; this.v = {};
    for (let c = 0; c < m; c++) for (let d = c + 1; d < m; d++) this.v[c * 8 + d] = new Int8Array(n * n);
  }
  Grid.prototype.get = function (c, a, d, b) { return c < d ? this.v[c * 8 + d][a * this.n + b] : this.v[d * 8 + c][b * this.n + a]; };
  Grid.prototype.set = function (c, a, d, b, x) { if (c < d) this.v[c * 8 + d][a * this.n + b] = x; else this.v[d * 8 + c][b * this.n + a] = x; };
  Grid.prototype.clone = function () { const g = new Grid(this.m, this.n); for (const k in this.v) g.v[k] = this.v[k].slice(); return g; };
  Grid.prototype.fromSol = function (sol) {
    const at = atOf(sol);
    for (let c = 0; c < this.m; c++) for (let d = c + 1; d < this.m; d++) for (let a = 0; a < this.n; a++) for (let b = 0; b < this.n; b++) this.set(c, a, d, b, at[c][a] === at[d][b] ? 1 : -1);
    return this;
  };
  // every item placed against the key
  Grid.prototype.complete = function () {
    for (let c = 1; c < this.m; c++) for (let a = 0; a < this.n; a++) { let ok = false; for (let k = 0; k < this.n; k++) if (this.get(c, a, 0, k) === 1) ok = true; if (!ok) return false; }
    return true;
  };

  // the key items item A can still go with
  function cands(G, A) {
    if (A[0] === 0) return [A[1]];
    const out = [];
    for (let k = 0; k < G.n; k++) { const v = G.get(A[0], A[1], 0, k); if (v === 1) return [k]; if (v !== -1) out.push(k); }
    return out;
  }
  // pairs a clue says are different people
  function distinctPairs(cl) {
    switch (cl[0]) {
      case 'lt': case 'imm': case 'next': case 'gap': case 'not': return [[cl[1], cl[2]]];
      case 'between': return [[cl[1], cl[2]], [cl[1], cl[3]], [cl[2], cl[3]]];
      case 'either': return [[cl[2], cl[3]]];
      case 'of2': return [[cl[1], cl[2]], [cl[3], cl[4]]];
      default: return [];
    }
  }

  // all deductions of one kind of rule, or [] ; each { A, B, v, rule, k?, via? }
  function rulesOf(d, G, kind) {
    const m = G.m, n = G.n, out = [];
    const seen = new Set();
    const keyOf = (A, B) => A[0] < B[0] ? A.concat(B).join(',') : B.concat(A).join(',');
    const put = (A, B, v, extra) => {
      if (A[0] === B[0]) return;
      const cur = G.get(A[0], A[1], B[0], B[1]);
      if (cur === v) return;
      const key = keyOf(A, B);
      if (seen.has(key)) return;
      seen.add(key);
      out.push(Object.assign({ A, B, v, clash: cur !== 0 }, extra));
    };
    if (kind === 'clue') {
      d.clues.forEach((cl, k) => {
        if (cl[0] === 'same') put(cl[1], cl[2], 1, { rule: 'clue', k });
        distinctPairs(cl).forEach((pr) => put(pr[0], pr[1], -1, { rule: cl[0] === 'not' ? 'clue' : 'differ', k }));
      });
    } else if (kind === 'tick' || kind === 'last') {
      for (let c = 0; c < m; c++) for (let e = c + 1; e < m; e++) {
        for (let a = 0; a < n; a++) {
          for (const side of [0, 1]) {
            let ticks = 0, unk = 0, tb = -1, ub = -1;
            for (let b = 0; b < n; b++) {
              const v = side ? G.get(c, b, e, a) : G.get(c, a, e, b);
              if (v === 1) { ticks++; tb = b; } else if (v === 0) { unk++; ub = b; }
            }
            const line = side ? [e, a] : [c, a], other = side ? c : e;
            if (kind === 'tick' && ticks === 1) for (let b = 0; b < n; b++) if (b !== tb && (side ? G.get(c, b, e, a) : G.get(c, a, e, b)) !== -1) put(line, [other, b], -1, { rule: 'tick', via: [other, tb] });
            if (kind === 'last' && ticks === 0 && unk === 1) put(line, [other, ub], 1, { rule: 'last' });
          }
        }
      }
    } else if (kind === 'trans') {
      for (let c = 0; c < m; c++) for (let e = c + 1; e < m; e++) for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
        if (G.get(c, a, e, b) !== 0) continue;
        const A = [c, a], B = [e, b];
        for (let f = 0; f < m && !seen.has(keyOf(A, B)); f++) {
          if (f === c || f === e) continue;
          let any = false;
          for (let x = 0; x < n; x++) {
            const va = G.get(c, a, f, x), vb = G.get(e, b, f, x);
            if (va === 1 && vb === 1) { put(A, B, 1, { rule: 'trans', via: [f, x], how: 'both' }); break; }
            if (va === 1 && vb === -1) { put(A, B, -1, { rule: 'trans', via: [f, x], how: 'a' }); break; }
            if (va === -1 && vb === 1) { put(A, B, -1, { rule: 'trans', via: [f, x], how: 'b' }); break; }
            if (va !== -1 && vb !== -1) any = true;
          }
          if (!any && !seen.has(keyOf(A, B))) put(A, B, -1, { rule: 'apart', via: [f, -1] });
        }
      }
    } else if (kind === 'order') {
      d.clues.forEach((cl, k) => {
        if (cl[0] === 'same' || cl[0] === 'not') return;
        const refs = refsOf(cl), R = refs.length;
        const cs = refs.map((A) => cands(G, A));
        if (cs.every((x) => x.length === 1)) return;
        const sup = refs.map(() => new Set()), e = new Array(R);
        const rec = (j) => {
          if (j === R) { if (holds(cl[0], e, n)) for (let t = 0; t < R; t++) sup[t].add(e[t]); return; }
          for (const v of cs[j]) {
            let ok = true;
            for (let t = 0; t < j; t++) if (refs[t][0] === refs[j][0] && e[t] === v) { ok = false; break; }
            if (!ok) continue;
            e[j] = v;
            rec(j + 1);
          }
        };
        rec(0);
        refs.forEach((A, t) => {
          if (A[0] === 0) return;
          cs[t].forEach((v) => { if (!sup[t].has(v)) put(A, [0, v], -1, { rule: 'order', k, cs, t }); });
        });
      });
    }
    return out;
  }
  const KINDS = ['clue', 'tick', 'last', 'trans', 'order'];

  // apply deductions; false if one contradicts the grid
  function apply(G, list) {
    for (const x of list) {
      const cur = G.get(x.A[0], x.A[1], x.B[0], x.B[1]);
      if (cur !== 0 && cur !== x.v) return false;
      G.set(x.A[0], x.A[1], x.B[0], x.B[1], x.v);
    }
    return true;
  }
  function broken(G) {
    const m = G.m, n = G.n;
    for (let c = 0; c < m; c++) for (let e = c + 1; e < m; e++) for (let a = 0; a < n; a++) for (const side of [0, 1]) {
      let ticks = 0, crosses = 0;
      for (let b = 0; b < n; b++) { const v = side ? G.get(c, b, e, a) : G.get(c, a, e, b); if (v === 1) ticks++; else if (v === -1) crosses++; }
      if (ticks > 1 || crosses === n) return true;
    }
    return false;
  }
  // everything the rules give, to the end; false on a contradiction
  function settle(d, G, log, limit) {
    for (let guard = 0; guard < 400; guard++) {
      let did = false;
      for (const kind of KINDS) {
        const list = rulesOf(d, G, kind);
        if (!list.length) continue;
        if (list.some((x) => x.clash)) { if (log) log.push(list.find((x) => x.clash)); return false; }
        if (log) log.push.apply(log, list);
        if (!apply(G, list) || broken(G)) return false;
        did = true;
        if (limit && log && log.length > limit) return true;
        break;
      }
      if (!did) return true;
    }
    return true;
  }

  // suppose a tick; if the rules then break, the cell is a cross. Returns { A, B, log } or null
  function trial(d, G, budget) {
    const pairs = [];
    for (let c = 1; c < G.m; c++) for (let a = 0; a < G.n; a++) {
      const cs = cands(G, [c, a]);
      if (cs.length > 1) cs.forEach((k) => pairs.push({ A: [c, a], B: [0, k], w: cs.length }));
    }
    pairs.sort((x, y) => x.w - y.w);
    let best = null;
    for (const pr of pairs.slice(0, budget || 40)) {
      const g = G.clone();
      g.set(pr.A[0], pr.A[1], 0, pr.B[1], 1);
      const log = [];
      if (!settle(d, g, log, best ? best.log.length : 60)) {
        if (!best || log.length < best.log.length) best = { A: pr.A, B: pr.B, log };
        if (log.length <= 3) break;
      }
    }
    return best;
  }

  // how a person would solve it from scratch: the effort, or null when the rules (and trials) do not finish it
  function grade(d, opts) {
    opts = opts || {};
    const G = new Grid(d.cats.length, d.cats[0].items.length);
    const st = { clue: 0, trans: 0, order: 0, apart: 0, trials: 0, rounds: 0 };
    for (let guard = 0; guard < 300 && !G.complete(); guard++) {
      let did = false;
      for (const kind of KINDS) {
        const list = rulesOf(d, G, kind);
        if (!list.length) continue;
        if (!apply(G, list)) return null;
        list.forEach((x) => { if (x.rule === 'trans') st.trans++; else if (x.rule === 'apart') st.apart++; else if (x.rule === 'order') st.order++; });
        if (kind === 'clue') st.clue += list.length;
        if (kind === 'order') { st.rounds++; st.ro = (st.ro || 0) + 1; }
        if (kind === 'trans') { st.rounds++; st.rt = (st.rt || 0) + 1; }
        did = true;
        break;
      }
      if (did) continue;
      if (opts.noTrial || st.trials >= (opts.maxTrials || 4)) return null;
      const t = trial(d, G, opts.budget || 40);
      if (!t) return null;
      G.set(t.A[0], t.A[1], 0, t.B[1], -1);
      st.trials++;
    }
    if (!G.complete()) return null;
    const n = G.n, m = G.m;
    st.size = (m - 2) * (n - 2) * 1.6;
    st.think = 1.6 * (st.ro || 0) + 0.6 * (st.rt || 0) + 0.15 * st.apart + 6 * st.trials + 0.3 * d.clues.length;
    st.cost = st.size + st.think;
    return st;
  }

  /* ---------- making puzzles ---------- */

  const SIZES = { 1: [[3, 3], [3, 4]], 2: [[3, 4], [4, 4]], 3: [[4, 4], [4, 5]], 4: [[4, 5], [5, 5], [4, 6]], 5: [[5, 5], [5, 6], [4, 6]] };
  const WEIGHTS = {
    1: { same: 5, not: 3, lt: 1, next: 1 },
    2: { same: 3, not: 3, lt: 2, next: 2, imm: 1, either: 1 },
    3: { same: 2, not: 3, lt: 2, imm: 2, next: 2, between: 1, either: 2, of2: 1, ends: 1 },
    4: { same: 1, not: 2, lt: 2, imm: 2, next: 2, gap: 1, between: 2, ends: 1, either: 3, of2: 2 },
    5: { same: 1, not: 2, lt: 2, imm: 2, next: 2, gap: 1, between: 2, ends: 1, either: 3, of2: 3 }
  };
  const BANDS = [null, [0, 7.5], [7.5, 14], [14, 23], [23, 34], [34, 999]];
  function levelOf(cost) { for (let l = 5; l >= 1; l--) if (cost >= BANDS[l][0]) return l; return 1; }

  // the categories of a new puzzle
  function pickCats(rng, T, m, n) {
    const people = () => rng.shuffle(PEOPLE.slice()).slice(0, n).sort();
    const key = Object.assign({}, T.key);
    key.items = T.key.people ? people() : T.key.items(n);
    delete key.people;
    const cats = [key];
    const pool = T.cats.slice();
    const first = pool.findIndex((c) => c.people);
    const chosen = [];
    if (first >= 0) chosen.push(pool.splice(first, 1)[0]);
    rng.shuffle(pool);
    while (chosen.length < m - 1) chosen.push(pool.shift());
    chosen.forEach((c) => {
      const cc = { n: c.n, s: c.s, p: c.p, np: c.np };
      if (c.people) cc.items = people();
      else { const pick = rng.shuffle(c.items.map((x, i) => i)).slice(0, n).sort((a, b) => a - b); cc.items = pick.map((i) => c.items[i]); }
      cats.push(cc);
    });
    return cats;
  }

  // a random true clue of kind t, or null
  function randomClue(rng, t, d, at, ord) {
    const m = d.cats.length, n = d.cats[0].items.length;
    const item = (from) => { const c = rng.range(from, m - 1); return [c, rng.int(n)]; };
    const E = (A) => at[A[0]][A[1]];
    const other = (A, from) => { for (let g = 0; g < 20; g++) { const B = item(from); if (B[0] !== A[0]) return B; } return null; };
    for (let tries = 0; tries < 30; tries++) {
      const A = item(0), B = other(A, 0);
      if (!B) continue;
      switch (t) {
        case 'same': { const c = B[0]; const b = d.sol[c][E(A)]; return ['same', A, [c, b]]; }
        case 'not': if (E(A) !== E(B)) return ['not', A, B]; break;
        case 'lt': case 'imm': case 'next': case 'gap': case 'ends': case 'between': {
          if (!ord) return null;
          const P = item(1), Q = other(P, 1);
          if (!Q) break;
          const p = E(P), q = E(Q);
          if (t === 'lt' && p < q && q - p >= 1) return ['lt', P, Q];
          if (t === 'imm' && p + 1 === q) return ['imm', P, Q];
          if (t === 'next' && Math.abs(p - q) === 1) return ['next', P, Q];
          if (t === 'gap' && Math.abs(p - q) === 2) return ['gap', P, Q];
          if (t === 'ends' && (p === 0 || p === n - 1)) return ['ends', P];
          if (t === 'between') {
            const R = other(P, 1);
            if (R && !(R[0] === Q[0] && R[1] === Q[1])) {
              const r = E(R);
              if (r !== q && ((q < p && p < r) || (r < p && p < q))) return ['between', P, Q, R];
            }
          }
          break;
        }
        case 'either': {
          const X = A, c1 = B[0];
          const yes = [c1, d.sol[c1][E(X)]];
          const C2 = other(X, 0);
          if (!C2) break;
          let no = null;
          for (let g = 0; g < 10; g++) { const cand = [C2[0], rng.int(n)]; if (E(cand) !== E(X) && !(cand[0] === yes[0] && cand[1] === yes[1])) { no = cand; break; } }
          if (!no) break;
          return rng() < 0.5 ? ['either', X, yes, no] : ['either', X, no, yes];
        }
        case 'of2': {
          const c1 = A[0], c2 = B[0];
          const k1 = rng.int(n); let k2 = rng.int(n);
          if (k1 === k2) break;
          const X = [c1, d.sol[c1][k1]], Y = [c1, d.sol[c1][k2]];
          const P = [c2, d.sol[c2][k1]], Q = [c2, d.sol[c2][k2]];
          if (c1 === 0 && c2 === 0) break;
          return rng() < 0.5 ? ['of2', X, Y, P, Q] : ['of2', X, Y, Q, P];
        }
        default: return null;
      }
    }
    return null;
  }

  function pickKind(rng, weights) {
    let tot = 0;
    for (const k in weights) tot += weights[k];
    let r = rng() * tot;
    for (const k in weights) { r -= weights[k]; if (r < 0) return k; }
    return 'same';
  }

  // one attempt: { data, grade } or null
  function makeData(rng, level, themeId, size) {
    const tid = themeId || rng.pick(Object.keys(THEMES));
    const T = THEMES[tid];
    const [m, n] = size || rng.pick(SIZES[level]);
    const ord = !!T.key.ord;
    const d = { theme: tid, cats: pickCats(rng, T, m, n), sol: [], clues: [] };
    if (ord) d.pos = Object.assign({}, T.pos);
    for (let c = 0; c < m; c++) d.sol.push(c === 0 ? range(n).map((x, i) => i) : rng.shuffle(range(n).map((x, i) => i)));
    const at = atOf(d.sol);
    const weights = Object.assign({}, WEIGHTS[level]);
    if (!ord) ['lt', 'imm', 'next', 'gap', 'ends', 'between'].forEach((k) => { delete weights[k]; });
    const keys = new Set();
    let unique = false;
    for (let guard = 0; guard < 80 && !unique; guard++) {
      const cl = randomClue(rng, pickKind(rng, weights), d, at, ord);
      if (!cl) continue;
      const kk = JSON.stringify(cl);
      if (keys.has(kk)) continue;
      if (!clueHolds(cl, at, n)) continue;
      keys.add(kk);
      d.clues.push(cl);
      if (d.clues.length >= m + 1) unique = countSolutions(d, 2).count === 1;
    }
    if (!unique) return null;
    // leave out clues that add nothing
    for (const cl of rng.shuffle(d.clues.slice())) {
      const rest = d.clues.filter((x) => x !== cl);
      if (countSolutions(d, 2, rest).count === 1) d.clues = rest;
    }
    rng.shuffle(d.clues);
    const g = grade(d, { noTrial: level <= 2, maxTrials: [0, 0, 0, 1, 3, 5][level], budget: 16 });
    if (!g) return null;
    return { data: d, grade: g, theme: tid };
  }

  function dress(d, tid) {
    const T = THEMES[tid];
    const n = d.cats[0].items.length;
    const names = d.cats.slice(1).map((c) => c.n.toLowerCase());
    return T.intro(n) + '\n\nFor each ' + d.cats[0].n.toLowerCase() + ', find the ' + names.slice(0, -1).join(', ') + (names.length > 1 ? ' and ' : '') + names[names.length - 1] + '. The clues are on the card beside the grid.';
  }

  /* ---------- hints: the next thing a careful solver can write in ---------- */

  const G_N = (d) => d.cats[0].items.length;

  function explain(d, x) {
    const s = (A) => W.s(d, A), p = (A) => W.p(d, A), np = (A) => W.np(d, A);
    const mark = x.v === 1 ? ' (✓)' : ' (✗)';
    const res = cap(s(x.A)) + ' ' + (x.v === 1 ? p(x.B) : np(x.B)) + mark + '.';
    const q = (k) => '**Clue ' + (k + 1) + '**: “' + clueWords(d, k) + '”';
    const key = d.cats[0];
    const keyP = (list) => fill(key.p, listOr(list.map((k) => key.items[k])));
    switch (x.rule) {
      case 'clue': return q(x.k) + ' — it says so outright. ' + res;
      case 'differ': {
        const t = d.clues[x.k][0];
        const why = t === 'either' ? 'if those two were one person, the clue would give both or neither — so they are different people' :
          t === 'of2' ? 'the two it pairs off are different people' : t === 'between' ? 'the three it names are three different people' :
            'it puts the two in different places, so they are different people';
        return q(x.k) + ' — ' + why + '. So ' + s(x.A) + ' ' + np(x.B) + ' (✗).';
      }
      case 'tick': return cap(s(x.A)) + ' ' + p(x.via) + ', so ' + s(x.A) + ' ' + np(x.B) + mark + '. (A ✓ rules out the rest of its row and column in that block.)';
      case 'last': return 'Every other ' + d.cats[x.B[0]].n.toLowerCase() + ' is already ruled out for ' + s(x.A) + ', so ' + s(x.A) + ' ' + p(x.B) + mark + '.';
      case 'trans':
        if (x.how === 'both') return cap(s(x.A)) + ' ' + p(x.via) + ', and so does ' + s(x.B) + ' — the same person. So ' + s(x.A) + ' ' + p(x.B) + mark + '.';
        if (x.how === 'a') return cap(s(x.A)) + ' ' + p(x.via) + ', but ' + s(x.B) + ' ' + np(x.via) + '. So ' + s(x.A) + ' ' + np(x.B) + mark + '.';
        return cap(s(x.B)) + ' ' + p(x.via) + ', but ' + s(x.A) + ' ' + np(x.via) + '. So ' + s(x.A) + ' ' + np(x.B) + mark + '.';
      case 'apart': return 'Compare what is left for ' + s(x.A) + ' and for ' + s(x.B) + ' in the ' + d.cats[x.via[0]].n.toLowerCase() + ' rows: nothing in common. So ' + s(x.A) + ' ' + np(x.B) + mark + '.';
      case 'order': {
        const cl = d.clues[x.k];
        const refs = refsOf(cl);
        const others = refs.map((R, t) => t === x.t || R[0] === 0 || x.cs[t].length === G_N(d) ? null : cap(s(R)) + ' ' + keyP(x.cs[t]) + '.').filter(Boolean);
        return q(x.k) + (others.length ? ' ' + others.join(' ') : '') + ' If ' + s(x.A) + ' ' + p(x.B).replace(/^is /, 'were ') + ', the clue could not hold. So ' + s(x.A) + ' ' + np(x.B) + ' (✗).';
      }
      default: return res;
    }
  }

  // the next deduction from the grid G: { x, text, clues: [k], cells: [[A, B]] } or null
  function nextHint(d, G, auto) {
    const order = auto ? ['clue', 'last', 'order', 'trans', 'differ', 'tick'] : ['clue', 'tick', 'last', 'order', 'trans', 'differ'];
    const clueList = rulesOf(d, G, 'clue').filter((x) => !x.clash);
    for (const kind of order) {
      const list = kind === 'clue' ? clueList.filter((x) => x.rule === 'clue') : kind === 'differ' ? clueList.filter((x) => x.rule === 'differ') : rulesOf(d, G, kind).filter((x) => !x.clash);
      if (!list.length) continue;
      // plain statements first, then deductions in the key blocks
      const rank = (x) => (x.rule === 'differ' ? 2 : 0) + (x.B[0] === 0 || x.A[0] === 0 ? 0 : 1);
      list.sort((a, b) => rank(a) - rank(b));
      const x = list[0];
      return { x, text: explain(d, x), clues: x.k != null ? [x.k] : [], cells: [[x.A, x.B]] };
    }
    const t = trial(d, G, 60);
    if (t) {
      const ks = Array.from(new Set(t.log.filter((e) => e.k != null).map((e) => e.k))).slice(0, 3);
      const x = { A: t.A, B: t.B, v: -1 };
      const text = 'A harder step. Suppose ' + W.s(d, t.A) + ' ' + W.p(d, t.B) + '. Follow the clues from there' + (ks.length ? ' (' + ks.map((k) => 'clue ' + (k + 1)).join(', ') + ')' : '') + ' and the grid runs into a contradiction' + ' — some row is left with nothing possible. So ' + W.s(d, t.A) + ' ' + W.np(d, t.B) + ' (✗).';
      return { x, text, clues: ks, cells: [[t.A, t.B]] };
    }
    return null;
  }

  function makePuzzle(rng, level, themeId, title) {
    for (let t = 0; t < 40; t++) {
      const r = makeData(rng, level, themeId);
      if (!r) continue;
      if (levelOf(r.grade.cost) !== level) continue;
      return { title: title || rng.pick(THEMES[r.theme].titles), text: dress(r.data, r.theme), diff: level, data: r.data, theme: r.theme, cost: r.grade.cost };
    }
    return null;
  }

  /* ---------- the board ---------- */

  function layout(d) {
    const m = d.cats.length, n = d.cats[0].items.length;
    const S = n >= 6 ? 27 : 30;
    const colCats = [], rowCats = [0];
    for (let c = 1; c < m; c++) colCats.push(c);
    for (let c = m - 1; c >= 2; c--) rowCats.push(c);
    const labW = (c) => Math.max.apply(null, d.cats[c].items.map((x) => x.length)) * 7.4 + 14;
    const LW = Math.max.apply(null, rowCats.map(labW)) + 28;
    const TH = Math.max.apply(null, colCats.map(labW)) + 28;
    const B = n * S;
    return { m, n, S, colCats, rowCats, LW, TH, B, gridW: colCats.length * B, gridH: rowCats.length * B };
  }
  const blockOn = (L, ri, ci) => ri + ci <= L.m - 2;
  // the value shown in the cell (row block ri, item a; column block ci, item b)
  const cellCats = (L, ri, ci) => [L.rowCats[ri], L.colCats[ci]];

  function wrapText(t, n) {
    const out = [];
    let line = '';
    String(t).split(/\s+/).forEach((w) => {
      if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w;
    });
    if (line) out.push(line);
    return out;
  }

  C.engine({
    id: 'logicgrid',
    name: 'Logic grids',
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Every item in one category goes with exactly one item in each of the others. Use the clues to fill the grid: **click a cell** once for ✗ (these two do not go together), again for ✓ (they do), a third time to clear it; **Shift+click** puts a ✓ straight in, and you can **drag** across cells to cross out several at once. With **Auto ✗** on, a ✓ crosses out the rest of its row and column in that block. **Click a clue** to strike it through once you have used it. The answer table fills itself from your ticks — or click one of its cells to choose the answer there.\n\nKeys: arrows move a cursor over the grid, **X** crosses, **O** ticks, **Delete** clears. The paint tool colours cells and clues; the highlighter and notes work on the board too.',

    generate(rng, level) {
      const r = makePuzzle(rng, level);
      if (!r) return null;
      return { title: r.title, text: r.text, diff: level, data: r.data };
    },

    verify(p) {
      const d = p.data;
      if (!d || !Array.isArray(d.cats) || d.cats.length < 2 || d.cats.length > 6) return { ok: false, err: 'cats: 2 to 6 categories' };
      const n = d.cats[0].items.length;
      if (n < 2 || n > 6) return { ok: false, err: 'items: 2 to 6 per category' };
      if (d.cats.some((c) => !c.items || c.items.length !== n || !c.s || !c.p || !c.np)) return { ok: false, err: 'every category needs n items and s/p/np words' };
      if (!Array.isArray(d.clues) || !d.clues.length) return { ok: false, err: 'no clues' };
      for (const cl of d.clues) {
        if (!['same', 'not', 'lt', 'imm', 'next', 'gap', 'between', 'ends', 'either', 'of2'].includes(cl[0])) return { ok: false, err: 'unknown clue ' + cl[0] };
        if (refsOf(cl).some((A) => !(A[0] >= 0 && A[0] < d.cats.length && A[1] >= 0 && A[1] < n))) return { ok: false, err: 'bad item in clue' };
        if (ORDER_CLUES.includes(cl[0]) && !(d.cats[0].ord && d.pos)) return { ok: false, err: 'order clue without an ordered key' };
      }
      if (d.words && d.words.length !== d.clues.length) return { ok: false, err: 'words and clues differ in number' };
      const r = countSolutions(d, 2);
      if (r.count === 0) return { ok: false, err: 'no solution' };
      if (r.count > 1) return { ok: false, err: 'more than one solution' };
      if (d.sol && JSON.stringify(d.sol) !== JSON.stringify(r.sol)) return { ok: false, err: 'stored sol differs from the solution' };
      return { ok: true };
    },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data;
      const L = layout(d);
      const { m, n, S, B } = L;
      const sol = d.sol || countSolutions(d, 1).sol;
      const truth = new Grid(m, n).fromSol(sol);
      let G = new Grid(m, n);          // 0 empty, 1 ✓, -1 ✗, -2 ✗ put by Auto ✗
      let used = new Set();
      let auto = true;
      let cursor = null;
      let chooser = null;
      const narrow = wb.size().w < 620;

      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      const root = ctx.s('g', { class: 'lg' }, board);
      const hov = ctx.s('g', { class: 'lg-hov' }, bg);
      const hintG = ctx.s('g', { class: 'lg-hint' }, top);
      const chooseG = ctx.s('g', { class: 'lg-choose' }, top);

      // where the clues and the table go
      const wrapN = 50;
      const clueLines = d.clues.map((cl, k) => wrapText(clueWords(d, k), wrapN));
      const longest = Math.max.apply(null, clueLines.map((ls) => Math.max.apply(null, ls.map((l) => l.length))));
      const CW = Math.max(280, Math.min(420, longest * 7.1 + 60));
      const cx0 = narrow ? -L.LW : L.gridW + 40;
      const cy0 = narrow ? L.gridH + 34 : -L.TH;

      /* the grid */
      const cellEl = {}, markEl = {};
      const ck = (ri, ci, a, b) => ri + ':' + ci + ':' + a + ':' + b;
      ctx.s('rect', { x: -L.LW - 6, y: -L.TH - 6, width: L.LW + L.gridW + 12, height: L.TH + L.gridH + 12, rx: 14, class: 'lg-panel' }, root);
      L.colCats.forEach((c, ci) => {
        if (!blockOn(L, 0, ci)) return;
        const x0 = ci * B;
        ctx.s('rect', { x: x0, y: -L.TH, width: B, height: 22, rx: 6, class: 'lg-catbg' }, root);
        ctx.s('text', { x: x0 + B / 2, y: -L.TH + 15.5, 'text-anchor': 'middle', class: 'lg-cat', text: d.cats[c].n }, root);
        d.cats[c].items.forEach((it, b) => {
          const x = x0 + b * S + S / 2 + 4.5, y = -7;
          ctx.s('text', { x, y, transform: 'rotate(-90 ' + x + ' ' + y + ')', class: 'lg-item', 'data-col': ci + ':' + b, text: it }, root);
        });
      });
      L.rowCats.forEach((c, ri) => {
        const y0 = ri * B;
        ctx.s('rect', { x: -L.LW, y: y0, width: 22, height: B, rx: 6, class: 'lg-catbg' }, root);
        const tx = -L.LW + 15.5, ty = y0 + B / 2;
        ctx.s('text', { x: tx, y: ty, transform: 'rotate(-90 ' + tx + ' ' + ty + ')', 'text-anchor': 'middle', class: 'lg-cat', text: d.cats[c].n }, root);
        d.cats[c].items.forEach((it, a) => ctx.s('text', { x: -8, y: y0 + a * S + S / 2 + 5, 'text-anchor': 'end', class: 'lg-item', 'data-row': ri + ':' + a, text: it }, root));
      });
      const cellsG = ctx.s('g', { class: 'lg-cells' }, root);
      const marksG = ctx.s('g', { class: 'lg-marks' }, root);
      for (let ri = 0; ri < L.rowCats.length; ri++) for (let ci = 0; ci < L.colCats.length; ci++) {
        if (!blockOn(L, ri, ci)) continue;
        for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
          const k = ck(ri, ci, a, b);
          cellEl[k] = ctx.s('rect', { x: ci * B + b * S, y: ri * B + a * S, width: S, height: S, class: 'lg-cell', 'data-lg': 'cell:' + k, 'data-key': 'lg-' + k }, cellsG);
          markEl[k] = ctx.s('g', { transform: 'translate(' + (ci * B + b * S + S / 2) + ' ' + (ri * B + a * S + S / 2) + ')' }, marksG);
        }
        ctx.s('rect', { x: ci * B, y: ri * B, width: B, height: B, class: 'lg-block' }, root);
      }
      const cursorEl = ctx.s('rect', { width: S, height: S, class: 'lg-cursor', style: 'display:none' }, root);

      /* the clue card */
      const clueG = ctx.s('g', { class: 'lg-clues' }, board);
      let cy = cy0;
      const clueRows = [];
      ctx.s('text', { x: cx0 + 16, y: cy + 26, class: 'lg-h', text: 'Clues' }, clueG);
      cy += 42;
      clueLines.forEach((lines, k) => {
        const h = lines.length * 19 + 8;
        const g = ctx.s('g', { class: 'lg-clue', 'data-lg': 'clue:' + k }, clueG);
        ctx.s('rect', { x: cx0 + 6, y: cy - 4, width: CW - 12, height: h, rx: 8, class: 'lg-cluebg', 'data-key': 'lg-clue' + k }, g);
        ctx.s('text', { x: cx0 + 30, y: cy + 12, 'text-anchor': 'end', class: 'lg-cnum', text: String(k + 1) }, g);
        lines.forEach((ln, j) => ctx.s('text', { x: cx0 + 38, y: cy + 12 + j * 19, class: 'lg-ctext', text: ln }, g));
        const strike = ctx.s('g', { class: 'lg-strike' }, g);
        lines.forEach((ln, j) => ctx.s('path', { d: 'M' + (cx0 + 36) + ' ' + (cy + 7 + j * 19) + 'h' + (ln.length * 6.9 + 4) }, strike));
        clueRows.push({ g, y: cy - 4, h });
        cy += h + 4;
      });
      const clueH = cy - cy0 + 8;
      ctx.s('rect', { x: cx0, y: cy0, width: CW, height: clueH, rx: 14, class: 'lg-card' }, clueG).parentNode.insertBefore(clueG.lastChild, clueG.firstChild);

      /* the answer table */
      const tabG = ctx.s('g', { class: 'lg-table' }, board);
      const colW = d.cats.map((c) => Math.max(c.n.length * 7.6 + 16, Math.max.apply(null, c.items.map((x) => x.length)) * 7.2 + 18, 44));
      const tw = colW.reduce((s, w) => s + w, 0);
      const tScale = Math.min(1, (CW - 20) / tw);
      const tx0 = cx0 + (CW - tw * tScale) / 2, ty0 = cy0 + clueH + 22, RH = 26;
      const tabInner = ctx.s('g', { transform: 'translate(' + tx0 + ' ' + ty0 + ') scale(' + tScale + ')' }, tabG);
      ctx.s('rect', { x: -8, y: -8, width: tw + 16, height: RH * (n + 1) + 16, rx: 12, class: 'lg-card' }, tabInner);
      let xx = 0;
      const colX = colW.map((w) => { const x = xx; xx += w; return x; });
      d.cats.forEach((c, j) => ctx.s('text', { x: colX[j] + colW[j] / 2, y: 18, 'text-anchor': 'middle', class: 'lg-th', text: c.n }, tabInner));
      const tabCells = [];
      for (let k = 0; k < n; k++) {
        tabCells.push([]);
        const y = RH * (k + 1);
        ctx.s('path', { d: 'M0 ' + y + 'H' + tw, class: 'lg-tline' }, tabInner);
        d.cats.forEach((c, j) => {
          if (j === 0) { ctx.s('text', { x: colX[j] + colW[j] / 2, y: y + 18, 'text-anchor': 'middle', class: 'lg-tkey', text: c.items[k] }, tabInner); tabCells[k].push(null); return; }
          const g = ctx.s('g', { class: 'lg-tcell', 'data-lg': 'tab:' + k + ':' + j }, tabInner);
          ctx.s('rect', { x: colX[j] + 3, y: y + 3, width: colW[j] - 6, height: RH - 6, rx: 6 }, g);
          const t = ctx.s('text', { x: colX[j] + colW[j] / 2, y: y + 18, 'text-anchor': 'middle' }, g);
          tabCells[k].push(t);
        });
      }
      const tabBottom = ty0 + (RH * (n + 1) + 8) * tScale;

      const x0 = Math.min(-L.LW - 10, cx0 - 10), y0 = Math.min(-L.TH - 10, cy0 - 10);
      const x1 = Math.max(L.gridW + 10, cx0 + CW + 10), y1 = Math.max(L.gridH + 10, tabBottom + 10);
      wb.setBounds({ x0, y0, x1, y1 }, 0.03);

      if (!p.goal) ctx.setGoal('Fill the grid until the answer table is complete.' + (d.ask ? ' ' + cap(d.ask) : ''));

      /* the panel */
      const autoBtn = ctx.button('Auto ✗: on', () => { auto = !auto; autoBtn.textContent = 'Auto ✗: ' + (auto ? 'on' : 'off'); autoBtn.classList.toggle('gold', auto); }, 'small.gold');
      autoBtn.title = 'A ✓ crosses out the rest of its row and column';
      ctx.button('Clear grid', () => { G = new Grid(m, n); drawAll(); ctx.changed('clear'); }, 'small.ghost');

      /* state and drawing */
      const vAt = (ri, ci, a, b) => { const [r, c] = cellCats(L, ri, ci); return G.get(r, a, c, b); };
      const setAt = (ri, ci, a, b, v) => { const [r, c] = cellCats(L, ri, ci); G.set(r, a, c, b, v); };
      function drawMark(ri, ci, a, b) {
        const k = ck(ri, ci, a, b), v = vAt(ri, ci, a, b), el = markEl[k];
        const r = S * 0.26;
        el.innerHTML = v === 1 ? '<circle r="' + (S * 0.33) + '" class="lg-tick"/><path d="M' + (-r * 0.8) + ' 0l' + (r * 0.55) + ' ' + (r * 0.6) + 'l' + (r * 1.05) + ' ' + (-r * 1.2) + '" class="lg-tickm"/>' :
          v === -1 ? '<path d="M' + (-r) + ' ' + (-r) + 'L' + r + ' ' + r + 'M' + r + ' ' + (-r) + 'L' + (-r) + ' ' + r + '" class="lg-x"/>' :
            v === -2 ? '<path d="M' + (-r) + ' ' + (-r) + 'L' + r + ' ' + r + 'M' + r + ' ' + (-r) + 'L' + (-r) + ' ' + r + '" class="lg-x auto"/>' : '';
        cellEl[k].classList.toggle('filled', v !== 0);
      }
      function each(fn) {
        for (let ri = 0; ri < L.rowCats.length; ri++) for (let ci = 0; ci < L.colCats.length; ci++) {
          if (!blockOn(L, ri, ci)) continue;
          for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) fn(ri, ci, a, b);
        }
      }
      // who goes with whom, from the ticks (following chains of ticks through any block)
      function groups() {
        const par = {};
        const id = (c, i) => c * 8 + i;
        const find = (x) => { while (par[x] != null && par[x] !== x) x = par[x]; return x; };
        for (let c = 0; c < m; c++) for (let i = 0; i < n; i++) par[id(c, i)] = id(c, i);
        for (let c = 0; c < m; c++) for (let e = c + 1; e < m; e++) for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
          if (G.get(c, a, e, b) === 1) { const ra = find(id(c, a)), rb = find(id(e, b)); if (ra !== rb) par[ra] = rb; }
        }
        const table = [];
        for (let k = 0; k < n; k++) {
          const r = find(id(0, k));
          table.push(d.cats.map((c, j) => {
            if (j === 0) return k;
            const hits = [];
            for (let i = 0; i < n; i++) if (find(id(j, i)) === r) hits.push(i);
            return hits.length === 1 ? hits[0] : hits.length ? -2 : -1;
          }));
        }
        return table;
      }
      function drawTable() {
        const t = groups();
        for (let k = 0; k < n; k++) for (let j = 1; j < m; j++) {
          const el = tabCells[k][j], v = t[k][j];
          el.textContent = v >= 0 ? d.cats[j].items[v] : v === -2 ? '!' : '';
          el.setAttribute('class', v === -2 ? 'lg-tval bad' : 'lg-tval');
        }
      }
      // on a narrow screen the clues are also listed, readably, in the panel below the stage
      let panelList = null;
      if (narrow) {
        panelList = ctx.h('ol.lg-plist');
        d.clues.forEach((cl, k) => panelList.appendChild(ctx.h('li', { onclick: () => { if (used.has(k)) used.delete(k); else used.add(k); drawClues(); ctx.changed('note'); } }, clueWords(d, k))));
        ctx.panel.appendChild(panelList);
      }
      function drawClues() {
        clueRows.forEach((r, k) => r.g.classList.toggle('used', used.has(k)));
        if (panelList) Array.from(panelList.children).forEach((li, k) => li.classList.toggle('used', used.has(k)));
      }
      function drawAll() { each(drawMark); drawTable(); drawClues(); wb.applyPaints(); }

      // put a value in a cell, with Auto ✗ tidying its row and column
      function put(ri, ci, a, b, v) {
        const old = vAt(ri, ci, a, b);
        if (old === v) return false;
        setAt(ri, ci, a, b, v);
        drawMark(ri, ci, a, b);
        if (v === 1 && auto) {
          for (let j = 0; j < n; j++) {
            if (j !== b && vAt(ri, ci, a, j) === 0) { setAt(ri, ci, a, j, -2); drawMark(ri, ci, a, j); }
            if (j !== a && vAt(ri, ci, j, b) === 0) { setAt(ri, ci, j, b, -2); drawMark(ri, ci, j, b); }
          }
        }
        if (old === 1) {
          // take back the automatic crosses this tick no longer explains
          const tickIn = (fnv) => { for (let j = 0; j < n; j++) if (fnv(j) === 1) return true; return false; };
          for (let j = 0; j < n; j++) {
            if (j !== b && vAt(ri, ci, a, j) === -2 && !tickIn((q) => vAt(ri, ci, q, j))) { setAt(ri, ci, a, j, 0); drawMark(ri, ci, a, j); }
            if (j !== a && vAt(ri, ci, j, b) === -2 && !tickIn((q) => vAt(ri, ci, j, q))) { setAt(ri, ci, j, b, 0); drawMark(ri, ci, j, b); }
          }
        }
        return true;
      }
      function cellAt(pt) {
        const ci = Math.floor(pt[0] / B), ri = Math.floor(pt[1] / B);
        if (ci < 0 || ri < 0 || ci >= L.colCats.length || ri >= L.rowCats.length || !blockOn(L, ri, ci)) return null;
        const b = Math.floor((pt[0] - ci * B) / S), a = Math.floor((pt[1] - ri * B) / S);
        if (a < 0 || b < 0 || a >= n || b >= n) return null;
        return [ri, ci, a, b];
      }

      /* hover: light up the row and column */
      function hover(cell) {
        hov.innerHTML = '';
        root.querySelectorAll('.lg-item.hl').forEach((e) => e.classList.remove('hl'));
        if (!cell) return;
        const [ri, ci, a, b] = cell;
        ctx.s('rect', { x: 0, y: ri * B + a * S, width: (ci + 1) * B, height: S, class: 'lg-hovrow' }, hov);
        ctx.s('rect', { x: ci * B + b * S, y: 0, width: S, height: (ri + 1) * B, class: 'lg-hovrow' }, hov);
        const r = root.querySelector('[data-row="' + ri + ':' + a + '"]'), c = root.querySelector('[data-col="' + ci + ':' + b + '"]');
        if (r) r.classList.add('hl');
        if (c) c.classList.add('hl');
      }
      const onMove = (e) => {
        const t = e.target && e.target.closest ? e.target.closest('[data-lg^="cell:"]') : null;
        hover(t ? t.getAttribute('data-lg').slice(5).split(':').map(Number) : null);
      };
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', () => hover(null));

      /* the chooser for the answer table */
      function openChooser(k, j) {
        chooseG.innerHTML = '';
        const items = d.cats[j].items;
        const w = Math.max(90, Math.max.apply(null, items.map((x) => x.length)) * 7.4 + 30);
        const h = (items.length + 1) * 26 + 12;
        const bx = Math.min(tx0 + (colX[j] + colW[j] / 2) * tScale - w / 2, cx0 + CW - w);
        const by = ty0 + RH * (k + 2) * tScale;
        const g = ctx.s('g', { transform: 'translate(' + bx + ' ' + by + ')' }, chooseG);
        ctx.s('rect', { width: w, height: h, rx: 10, class: 'lg-chbg' }, g);
        items.concat(['— clear —']).forEach((it, i) => {
          const og = ctx.s('g', { class: 'lg-chopt', 'data-lg': 'pick:' + k + ':' + j + ':' + (i < items.length ? i : -1) }, g);
          ctx.s('rect', { x: 6, y: 6 + i * 26, width: w - 12, height: 24, rx: 6 }, og);
          ctx.s('text', { x: w / 2, y: 23 + i * 26, 'text-anchor': 'middle', text: it }, og);
        });
        chooser = { k, j };
      }
      function closeChooser() { chooseG.innerHTML = ''; chooser = null; }
      // tick key item k against item i of category j (in the key block)
      function tableSet(k, j, i) {
        const ci = L.colCats.indexOf(j);
        let changed = false;
        if (i < 0) {
          for (let b = 0; b < n; b++) if (vAt(0, ci, k, b) === 1) changed = put(0, ci, k, b, 0) || changed;
        } else {
          for (let b = 0; b < n; b++) if (b !== i && vAt(0, ci, k, b) === 1) changed = put(0, ci, k, b, 0) || changed;
          for (let a = 0; a < n; a++) if (a !== k && vAt(0, ci, a, i) === 1) changed = put(0, ci, a, i, 0) || changed;
          const was = auto;
          auto = true;
          changed = put(0, ci, k, i, 1) || changed;
          auto = was;
        }
        if (changed) { drawTable(); ctx.sfx('tap'); ctx.changed('mark'); }
      }

      /* clicks */
      let drag = null;
      wb.handlers.board = {
        down(pt, ev, el) {
          const t = el && el.closest ? el.closest('[data-lg]') : null;
          const a = t ? t.getAttribute('data-lg') : '';
          if (a.startsWith('pick:')) { const q = a.split(':').map(Number); closeChooser(); tableSet(q[1], q[2], q[3]); return true; }
          if (chooser) { closeChooser(); if (!a.startsWith('tab:')) return true; }
          if (a.startsWith('tab:')) { const q = a.split(':').map(Number); openChooser(q[1], q[2]); return true; }
          if (a.startsWith('clue:')) {
            const k = +a.slice(5);
            if (used.has(k)) used.delete(k); else used.add(k);
            drawClues();
            ctx.sfx('tap');
            ctx.changed('note');
            return true;
          }
          const cell = a.startsWith('cell:') ? a.slice(5).split(':').map(Number) : cellAt(pt);
          if (!cell) return false;
          const cur = vAt.apply(null, cell);
          const nv = ev.shiftKey ? (cur === 1 ? 0 : 1) : cur === 0 ? -1 : cur < 0 ? 1 : 0;
          put(cell[0], cell[1], cell[2], cell[3], nv);
          cursor = cell;
          drawCursor(false);
          drag = { v: nv === 1 ? null : nv, last: cell.join(':'), changed: true };
          ctx.sfx('tap');
          return true;
        },
        move(pt) {
          if (!drag || drag.v == null) return;
          const cell = cellAt(pt);
          if (!cell || cell.join(':') === drag.last) return;
          drag.last = cell.join(':');
          const cur = vAt.apply(null, cell);
          if (drag.v === -1 && cur === 0) put(cell[0], cell[1], cell[2], cell[3], -1);
          if (drag.v === 0 && cur < 0) put(cell[0], cell[1], cell[2], cell[3], 0);
        },
        up() {
          if (!drag) return;
          drag = null;
          drawTable();
          ctx.changed('mark');
        }
      };

      function drawCursor(show) {
        if (!cursor || !show) { cursorEl.style.display = 'none'; return; }
        const [ri, ci, a, b] = cursor;
        cursorEl.style.display = '';
        cursorEl.setAttribute('x', ci * B + b * S);
        cursorEl.setAttribute('y', ri * B + a * S);
        hover(cursor);
      }
      function flash(h) {
        hintG.innerHTML = '';
        h.cells.forEach(([A, Bi]) => {
          // find the block that shows this pair
          for (let ri = 0; ri < L.rowCats.length; ri++) for (let ci = 0; ci < L.colCats.length; ci++) {
            if (!blockOn(L, ri, ci)) continue;
            const r = L.rowCats[ri], c = L.colCats[ci];
            let a = -1, b = -1;
            if (r === A[0] && c === Bi[0]) { a = A[1]; b = Bi[1]; } else if (r === Bi[0] && c === A[0]) { a = Bi[1]; b = A[1]; }
            if (a >= 0) ctx.s('rect', { x: ci * B + b * S - 2, y: ri * B + a * S - 2, width: S + 4, height: S + 4, rx: 5, class: 'lg-pulse' }, hintG);
          }
        });
        h.clues.forEach((k) => { const r = clueRows[k]; ctx.s('rect', { x: cx0 + 4, y: r.y - 2, width: CW - 8, height: r.h + 4, rx: 9, class: 'lg-pulse' }, hintG); });
        clearTimeout(flash.t);
        flash.t = setTimeout(() => { hintG.innerHTML = ''; }, 5000);
      }

      // the user's marks that agree with the solution, as a Grid for the reasoning
      function known() {
        const K = new Grid(m, n);
        for (let c = 0; c < m; c++) for (let e = c + 1; e < m; e++) for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
          const v = G.get(c, a, e, b), t = truth.get(c, a, e, b);
          if (v === 1 && t === 1) K.set(c, a, e, b, 1);
          if (v < 0 && t === -1) K.set(c, a, e, b, -1);
        }
        return K;
      }
      function wrongs() {
        const out = [];
        for (let c = 0; c < m; c++) for (let e = c + 1; e < m; e++) for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
          const v = G.get(c, a, e, b), t = truth.get(c, a, e, b);
          if ((v === 1 && t === -1) || (v < 0 && t === 1)) out.push([[c, a], [e, b], v]);
        }
        return out;
      }

      drawAll();

      return {
        noMoves: true,
        check() {
          const w = wrongs();
          const t = groups();
          let open = 0;
          for (let k = 0; k < n; k++) for (let j = 1; j < m; j++) if (t[k][j] !== sol[j][k]) open++;
          if (!w.length && !open) return { solved: true, msg: 'Every answer in place.' };
          if (w.length) return { solved: false, msg: w.length === 1 ? 'One mark in the grid is wrong.' : w.length + ' marks in the grid are wrong.' };
          return { solved: false, msg: 'Not finished: ' + C.plural(open, 'answer') + ' still to find.' };
        },
        hint() {
          const w = wrongs();
          if (w.length) {
            const [A, Bi, v] = w[0];
            return { text: 'Look again where **' + W.label(d, A) + '** meets **' + W.label(d, Bi) + '**: that ' + (v === 1 ? '✓' : '✗') + ' is not right.', show() { flash({ cells: [[A, Bi]], clues: [] }); } };
          }
          const K = known();
          if (K.complete()) return 'Everything is in place — the table should be full.';
          const h = nextHint(d, K, auto);
          if (!h) return null;
          return { text: h.text, show() { flash(h); } };
        },
        solve() {
          each((ri, ci, a, b) => { const [r, c] = cellCats(L, ri, ci); G.set(r, a, c, b, truth.get(r, a, c, b)); });
          drawAll();
          ctx.changed('solve');
        },
        explain() {
          if (p.explain) return p.explain;
          const rows = sol[0].map((x, k) => '**' + cap(fill(d.cats[0].s, d.cats[0].items[k])) + '**: ' + d.cats.slice(1).map((c, j) => c.items[sol[j + 1][k]]).join(', ') + '.');
          return 'The answer, row by row:\n\n' + rows.join('<br>');
        },
        getState() {
          const g = {};
          for (const key in G.v) g[key] = Array.from(G.v[key]).map((v) => v === 1 ? 'o' : v === -1 ? 'x' : v === -2 ? 'y' : '.').join('');
          return { g, u: Array.from(used), a: auto ? 1 : 0 };
        },
        setState(s) {
          if (!s) return;
          G = new Grid(m, n);
          for (const key in s.g || {}) if (G.v[key]) String(s.g[key]).split('').forEach((ch, i) => { G.v[key][i] = ch === 'o' ? 1 : ch === 'x' ? -1 : ch === 'y' ? -2 : 0; });
          used = new Set(s.u || []);
          auto = s.a !== 0;
          autoBtn.textContent = 'Auto ✗: ' + (auto ? 'on' : 'off');
          autoBtn.classList.toggle('gold', auto);
          closeChooser();
          drawAll();
        },
        key(ev) {
          if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
          const k = ev.key;
          if (k.startsWith('Arrow')) {
            if (!cursor) cursor = [0, 0, 0, 0];
            else {
              let [ri, ci, a, b] = cursor;
              if (k === 'ArrowRight') { b++; if (b >= n) { b = 0; ci++; } }
              if (k === 'ArrowLeft') { b--; if (b < 0) { b = n - 1; ci--; } }
              if (k === 'ArrowDown') { a++; if (a >= n) { a = 0; ri++; } }
              if (k === 'ArrowUp') { a--; if (a < 0) { a = n - 1; ri--; } }
              if (ri >= 0 && ci >= 0 && ri < L.rowCats.length && ci < L.colCats.length && blockOn(L, ri, ci)) cursor = [ri, ci, a, b];
            }
            drawCursor(true);
            return true;
          }
          if (!cursor) return false;
          const low = k.toLowerCase();
          const v = low === 'x' && !ev.shiftKey ? -1 : low === 'o' ? 1 : (k === 'Delete' || k === 'Backspace') ? 0 : null;
          if (v == null) return false;
          if (put(cursor[0], cursor[1], cursor[2], cursor[3], v)) { drawTable(); ctx.changed('mark'); }
          drawCursor(true);
          return true;
        },
        destroy() {
          clearTimeout(flash.t);
          root.removeEventListener('pointermove', onMove);
          wb.handlers.board = null;
        }
      };
    },

    thumb(p) {
      const d = p.data, L = layout(d);
      const { n, S, B } = L;
      const sol = d.sol;
      let s = '<svg viewBox="' + (-12) + ' ' + (-12) + ' ' + (L.gridW + 24) + ' ' + (L.gridH + 24) + '" preserveAspectRatio="xMidYMid meet">';
      for (let ri = 0; ri < L.rowCats.length; ri++) for (let ci = 0; ci < L.colCats.length; ci++) {
        if (!blockOn(L, ri, ci)) continue;
        s += '<rect x="' + (ci * B) + '" y="' + (ri * B) + '" width="' + B + '" height="' + B + '" fill="var(--cell)" stroke="var(--ink-2)" stroke-width="3"/>';
        for (let j = 1; j < n; j++) s += '<path d="M' + (ci * B + j * S) + ' ' + (ri * B) + 'v' + B + 'M' + (ci * B) + ' ' + (ri * B + j * S) + 'h' + B + '" stroke="var(--grid-2)" stroke-width="1.5"/>';
        // a few ticks from the answer, as a teaser
        if (ri === 0 && ci === 0 && sol) {
          const k = (p.id || '').length % n;
          s += '<circle cx="' + (ci * B + sol[1][k] * S + S / 2) + '" cy="' + (ri * B + k * S + S / 2) + '" r="' + (S * 0.3) + '" fill="var(--green)"/>';
        }
      }
      // the theme's emblem in the empty corner of the staircase
      const em = EMBLEM[d.theme] || '❓';
      const size = B * (0.8 + 0.35 * (L.m - 3));
      const c = B * (0.5 + 0.4 * (L.m - 3));
      s += '<text x="' + (L.gridW - c) + '" y="' + (L.gridH - c + size * 0.36) + '" text-anchor="middle" font-size="' + size + '">' + em + '</text>';
      return s + '</svg>';
    }
  });
  const EMBLEM = { street: '🏠', harbour: '⛵', race: '🏃', concert: '🎻', hotel: '🏨', bakery: '🎂', garden: '🥕', pets: '🐾', library: '📚', zebra: '🦓' };

  C.logicgrid = { THEMES, clueText, countSolutions, grade, makePuzzle, makeData, levelOf, nextHint, Grid, layout, explain, dress };

  C.css('logicgrid', `
    .lg-panel { fill: var(--board); stroke: var(--line); stroke-width: 1.5; }
    .lg-catbg { fill: var(--panel-2); }
    .lg-cat { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: var(--accent); letter-spacing: .03em; }
    .lg-item { font: 600 13px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .lg-item.hl { fill: var(--gold); }
    .lg-cell { fill: var(--cell); stroke: var(--grid-2); stroke-width: 1; cursor: pointer; }
    .lg-cell:hover { fill: var(--panel-3); }
    .lg-block { fill: none; stroke: var(--ink-2); stroke-width: 2.4; pointer-events: none; }
    .lg-hovrow { fill: var(--gold); opacity: .09; }
    .lg-marks { pointer-events: none; }
    .lg-x { stroke: var(--red); stroke-width: 2.6; stroke-linecap: round; fill: none; opacity: .85; }
    .lg-x.auto { opacity: .38; stroke-width: 2; }
    .lg-tick { fill: var(--green); }
    .lg-tickm { fill: none; stroke: #fff; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
    .lg-cursor { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-dasharray: 4 3; pointer-events: none; }
    .lg-card { fill: var(--board); stroke: var(--line); stroke-width: 1.5; }
    .lg-h { font: 800 15px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .08em; text-transform: uppercase; }
    .lg-clue { cursor: pointer; }
    .lg-cluebg { fill: transparent; }
    .lg-clue:hover .lg-cluebg { fill: var(--panel-2); }
    .lg-cnum { font: 800 13px "Segoe UI", system-ui, sans-serif; fill: var(--gold); }
    .lg-ctext { font: 500 13.5px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .lg-strike path { stroke: var(--muted); stroke-width: 1.6; opacity: 0; }
    .lg-clue.used .lg-ctext, .lg-clue.used .lg-cnum { opacity: .42; }
    .lg-clue.used .lg-strike path { opacity: .8; }
    .lg-th { font: 700 12.5px "Segoe UI", system-ui, sans-serif; fill: var(--accent); }
    .lg-tline { stroke: var(--line); stroke-width: 1; }
    .lg-tkey { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .lg-tcell { cursor: pointer; }
    .lg-tcell rect { fill: var(--cell); stroke: var(--grid-2); }
    .lg-tcell:hover rect { stroke: var(--accent); }
    .lg-tval { font: 600 12.5px "Segoe UI", system-ui, sans-serif; fill: var(--text); pointer-events: none; }
    .lg-tval.bad { fill: var(--red); font-weight: 800; }
    .lg-chbg { fill: var(--panel); stroke: var(--accent); stroke-width: 1.5; filter: drop-shadow(0 4px 10px rgba(0,0,0,.4)); }
    .lg-chopt { cursor: pointer; }
    .lg-chopt rect { fill: var(--panel-2); }
    .lg-chopt:hover rect { fill: var(--accent); }
    .lg-chopt text { font: 600 12.5px "Segoe UI", system-ui, sans-serif; fill: var(--text); pointer-events: none; }
    .lg-plist { width: 100%; margin: 4px 0 0; padding-left: 1.6em; font-size: .88rem; line-height: 1.45; }
    .lg-plist li { margin: 0 0 5px; cursor: pointer; }
    .lg-plist li.used { text-decoration: line-through; opacity: .5; }
    .lg-pulse { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: 2.5; pointer-events: none; animation: lgpulse 1s ease-in-out infinite; }
    @keyframes lgpulse { 50% { opacity: .35; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
