/* The Puzzle Cabinet · engines/crossing.js
 *
 * River crossings and the bridge at night.
 *
 * data.mode 'river': {
 *   people: [{ k: 'farmer'|'wolf'|'goat'|'cabbage'|'man'|'woman'|'explorer'|'ogre'|'soldier'|'boy'|'person'|…,
 *              n: 'name' (optional), row: true (can row), w: 80 (weight), c: 0 (couple) }],
 *   cap: 2                      seats in the boat
 *   maxW: 100                   the boat's weight limit (optional; people then carry w)
 *   eat: [[a, b], …]            a eats b when they are together without a guard
 *   guard: [i, …]               who keeps order (default: every farmer)
 *   jealous: true               no woman with another man unless her own man is there (couples by c)
 *   outnumber: ['explorer', 'ogre']   the second kind may not outnumber the first where any of the first are
 *   boat: true                  the rules also hold in the boat while it crosses
 *   goal: [1, 1, null, …]       where each must end (1 = far bank, 0 = near, null = anywhere); default all far
 * }
 * data.mode 'bridge': { people: [{ k, n, t: minutes }], cap: 2, limit: 17 }
 *
 * p.par = the fewest crossings (river); for the bridge, limit = the least total time.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ================= the rules ================= */

  const LOOK = {
    farmer: { name: 'the farmer', person: true },
    wolf: { name: 'the wolf' }, goat: { name: 'the goat' }, cabbage: { name: 'the cabbage' },
    fox: { name: 'the fox' }, goose: { name: 'the goose' }, beans: { name: 'the bag of beans' },
    cat: { name: 'the cat' }, mouse: { name: 'the mouse' }, cheese: { name: 'the cheese' },
    dog: { name: 'the dog' }, lion: { name: 'the lion' }, sheep: { name: 'the sheep' }, hay: { name: 'the hay' },
    man: { name: 'a man', person: true }, woman: { name: 'a woman', person: true },
    explorer: { name: 'an explorer', person: true }, ogre: { name: 'an ogre', person: true },
    soldier: { name: 'a soldier', person: true }, boy: { name: 'a boy', person: true },
    person: { name: 'someone', person: true }, child: { name: 'a child', person: true },
    hedgehog: { name: 'a hedgehog' }
  };
  const nameOf = (d, i) => { const q = d.people[i]; return q.n ? q.n : (LOOK[q.k] || {}).name || q.k; };
  const Cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const canRow = (q) => (q.row != null ? !!q.row : !!(LOOK[q.k] || {}).person);

  function guards(d) {
    if (d.guard) return d.guard;
    const g = [];
    d.people.forEach((q, i) => { if (q.k === 'farmer') g.push(i); });
    return g;
  }
  // what goes wrong when these people are together unsupervised (null: nothing)
  function trouble(d, members) {
    if (!members.length) return null;
    const has = new Set(members);
    if (d.eat) {
      const gs = guards(d);
      if (!gs.some((g) => has.has(g))) {
        for (const [a, b] of d.eat) if (has.has(a) && has.has(b)) return { type: 'eat', a, b };
      }
    }
    if (d.jealous) {
      for (const w of members) {
        const q = d.people[w];
        if (q.k !== 'woman') continue;
        const husband = d.people.findIndex((x) => x.k === 'man' && x.c === q.c);
        if (husband >= 0 && has.has(husband)) continue;
        const other = members.find((m) => d.people[m].k === 'man' && d.people[m].c !== q.c);
        if (other != null) return { type: 'jealous', w, m: other, h: husband };
      }
    }
    if (d.outnumber) {
      const [ka, kb] = d.outnumber;
      const A = members.filter((m) => d.people[m].k === ka).length, B = members.filter((m) => d.people[m].k === kb).length;
      if (A > 0 && B > A) return { type: 'outnumber', A, B };
    }
    return null;
  }
  function troubleText(d, t, where) {
    if (!t) return '';
    const nm = (i) => nameOf(d, i);
    if (t.type === 'eat') {
      const a = d.people[t.a].k, b = d.people[t.b].k;
      const verb = b === 'cabbage' || b === 'beans' || b === 'hay' || b === 'cheese' ? 'has eaten' : 'has made a meal of';
      const tails = { cabbage: 'Only the stalk is left.', goat: 'Nobody was watching.', goose: 'A few feathers drift on the breeze.', beans: 'Not a bean remains.', mouse: 'It was over very quickly.', cheese: 'Not a crumb is left.', hay: 'Burp.', sheep: 'Oh dear.' };
      return Cap1(nm(t.a)) + ' ' + verb + ' ' + nm(t.b) + ' ' + where + '. ' + (tails[b] || '') + ' ' + (a ? '' : '');
    }
    if (t.type === 'jealous') return Cap1(nm(t.w)) + ' was left ' + where + ' with ' + nm(t.m) + ' while ' + (t.h >= 0 ? nm(t.h) : 'her partner') + ' was elsewhere — a scandal! Everyone hurries back.';
    if (t.type === 'outnumber') {
      const [ka, kb] = d.outnumber;
      return Cap1(where.replace(/^on |^in /, '')) + ': ' + t.B + ' ' + plural(kb, t.B) + ' against ' + t.A + ' ' + plural(ka, t.A) + '. The ' + plural(kb, 2) + ' licked their lips; the ' + plural(ka, 2) + ' ran for the boat just in time.';
    }
    return 'That is against the rules.';
  }
  function plural(k, n) {
    const P = { explorer: ['explorer', 'explorers'], ogre: ['ogre', 'ogres'], man: ['man', 'men'], woman: ['woman', 'women'] };
    const e = P[k] || [k, k + 's'];
    return n === 1 ? e[0] : e[1];
  }

  const N = (d) => d.people.length;
  const bitsOf = (mask, n) => { const out = []; for (let i = 0; i < n; i++) if (mask & (1 << i)) out.push(i); return out; };
  function groupOK(d, group) {
    if (!group.length || group.length > (d.cap || 2)) return false;
    if (d.mode !== 'bridge' && !group.some((i) => canRow(d.people[i]))) return false;
    if (d.maxW != null && group.reduce((s, i) => s + (d.people[i].w || 0), 0) > d.maxW) return false;
    if (d.boat && trouble(d, group)) return false;
    return true;
  }
  // the crossings possible from (right = mask of people on the far side, boat = 0 near / 1 far)
  function movesFrom(d, right, boat) {
    const n = N(d), cap = d.cap || 2;
    const here = [];
    for (let i = 0; i < n; i++) if (((right >> i) & 1) === boat) here.push(i);
    const out = [];
    const rec = (start, group) => {
      if (group.length) {
        if (groupOK(d, group)) {
          let m = right;
          group.forEach((i) => { m ^= 1 << i; });
          const nb = 1 - boat;
          const bad = d.mode === 'bridge' ? null : bankTrouble(d, m);
          if (!bad) out.push({ group: group.slice(), right: m, boat: nb });
        }
      }
      if (group.length >= cap) return;
      for (let k = start; k < here.length; k++) { group.push(here[k]); rec(k + 1, group); group.pop(); }
    };
    rec(0, []);
    return out;
  }
  function bankTrouble(d, right) {
    const n = N(d);
    const near = [], far = [];
    for (let i = 0; i < n; i++) ((right >> i) & 1 ? far : near).push(i);
    const a = trouble(d, near);
    if (a) return { side: 0, t: a };
    const b = trouble(d, far);
    if (b) return { side: 1, t: b };
    return null;
  }
  function goalMask(d) {
    const n = N(d);
    let care = 0, want = 0;
    for (let i = 0; i < n; i++) {
      const g = d.goal ? d.goal[i] : 1;
      if (g == null) continue;
      care |= 1 << i;
      if (g) want |= 1 << i;
    }
    return { care, want };
  }
  const atGoal = (d, right) => { const g = goalMask(d); return (right & g.care) === g.want; };
  function startOf(d) {
    let m = 0;
    (d.start || []).forEach((s, i) => { if (s) m |= 1 << i; });
    return { right: m, boat: d.boatStart || 0 };
  }

  // the fewest crossings (river): breadth first
  function bfs(d, from) {
    const s0 = from || startOf(d);
    const key = (r, b) => r * 2 + b;
    if (atGoal(d, s0.right)) return [];
    const prev = new Map([[key(s0.right, s0.boat), null]]);
    let frontier = [s0];
    while (frontier.length) {
      const next = [];
      for (const s of frontier) {
        for (const m of movesFrom(d, s.right, s.boat)) {
          const k = key(m.right, m.boat);
          if (prev.has(k)) continue;
          prev.set(k, { from: key(s.right, s.boat), m });
          if (atGoal(d, m.right)) {
            const path = [];
            let cur = k;
            while (prev.get(cur)) { const e = prev.get(cur); path.unshift(e.m); cur = e.from; }
            return path;
          }
          next.push(m);
        }
      }
      frontier = next;
      if (prev.size > 300000) break;
    }
    return null;
  }
  // the least total time (bridge): Dijkstra; cost of a crossing = its slowest walker
  function fastest(d, from) {
    const s0 = from || startOf(d);
    const n = N(d), key = (r, b) => r * 2 + b;
    const dist = new Map([[key(s0.right, s0.boat), 0]]), prev = new Map();
    const done = new Set();
    const open = [{ right: s0.right, boat: s0.boat, c: 0 }];
    while (open.length) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (open[i].c < open[bi].c) bi = i;
      const s = open.splice(bi, 1)[0];
      const k = key(s.right, s.boat);
      if (done.has(k)) continue;
      done.add(k);
      if (atGoal(d, s.right)) {
        const path = [];
        let cur = k;
        while (prev.has(cur)) { const e = prev.get(cur); path.unshift(e.m); cur = e.from; }
        return { cost: s.c, path };
      }
      for (const m of movesFrom(d, s.right, s.boat)) {
        const cost = s.c + Math.max.apply(null, m.group.map((i) => d.people[i].t));
        const mk = key(m.right, m.boat);
        if (!dist.has(mk) || cost < dist.get(mk)) { dist.set(mk, cost); prev.set(mk, { from: k, m }); open.push({ right: m.right, boat: m.boat, c: cost }); }
      }
      if (done.size > 1 << Math.min(20, n + 2)) break;
    }
    return null;
  }

  function verify(p) {
    const d = p.data;
    if (!d || !d.people || !d.people.length) return { ok: false, err: 'people are needed' };
    if (d.people.length > 12) return { ok: false, err: 'at most 12 people' };
    if (d.mode === 'bridge') {
      if (d.people.some((q) => !(q.t > 0))) return { ok: false, err: 'every walker needs a time t' };
      const r = fastest(d);
      if (!r) return { ok: false, err: 'nobody can get across' };
      if (d.limit != null && r.cost > d.limit) return { ok: false, err: 'the best time is ' + r.cost + ' but the limit is ' + d.limit };
      if (d.limit != null && r.cost < d.limit) return { ok: true, warn: 'the limit ' + d.limit + ' is slack (best ' + r.cost + ')' };
      return { ok: true, par: r.path.length };
    }
    const s0 = startOf(d);
    if (bankTrouble(d, s0.right)) return { ok: false, err: 'the start already breaks a rule' };
    const path = bfs(d);
    if (!path) return { ok: false, err: 'no way across' };
    if (!path.length) return { ok: false, err: 'already solved at the start' };
    if (p.par != null && p.par !== path.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest crossings is ' + path.length };
    return { ok: true, par: path.length };
  }

  /* ================= making puzzles ================= */

  const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const num = (n) => NUM[n] || String(n);
  const THEMES = [
    { items: ['wolf', 'goat', 'cabbage'], eat: [[0, 1], [1, 2]] },
    { items: ['fox', 'goose', 'beans'], eat: [[0, 1], [1, 2]] },
    { items: ['cat', 'mouse', 'cheese'], eat: [[0, 1], [1, 2]] },
    { items: ['dog', 'cat', 'mouse', 'cheese'], eat: [[0, 1], [1, 2], [2, 3]] },
    { items: ['lion', 'sheep', 'hay'], eat: [[0, 1], [1, 2]] },
    { items: ['wolf', 'goat', 'cabbage', 'hay'], eat: [[0, 1], [1, 2], [1, 3]] },
    { items: ['fox', 'goose', 'beans', 'dog'], eat: [[0, 1], [1, 2], [3, 0]] },
    { items: ['wolf', 'sheep', 'goat', 'cabbage'], eat: [[0, 1], [0, 2], [1, 3], [2, 3]] },
    { items: ['cat', 'mouse', 'cheese', 'dog'], eat: [[0, 1], [1, 2], [3, 0]] }
  ];
  function eaters(theme, cap) {
    const people = [{ k: 'farmer', row: true }].concat(theme.items.map((k) => ({ k })));
    return { mode: 'river', people, cap, eat: theme.eat.map(([a, b]) => [a + 1, b + 1]) };
  }
  function explorers(nE, nO, cap, rowers) {
    const people = [];
    for (let i = 0; i < nE; i++) people.push({ k: 'explorer', row: rowers ? rowers.e > i : true });
    for (let i = 0; i < nO; i++) people.push({ k: 'ogre', row: rowers ? rowers.o > i : true });
    const d = { mode: 'river', people, cap, outnumber: ['explorer', 'ogre'] };
    if (cap >= 3) d.boat = true;
    return d;
  }
  const COUPLE_NAMES = [['Arthur', 'Anna'], ['Ben', 'Bella'], ['Carl', 'Clara'], ['Dan', 'Dora'], ['Ed', 'Emma']];
  function couples(n, cap, womenRow) {
    const people = [];
    for (let i = 0; i < n; i++) people.push({ k: 'man', c: i, n: COUPLE_NAMES[i][0], row: true });
    for (let i = 0; i < n; i++) people.push({ k: 'woman', c: i, n: COUPLE_NAMES[i][1], row: womenRow !== false });
    return { mode: 'river', people, cap, jealous: true, boat: true };
  }
  function soldiers(nS, nB) {
    const people = [];
    for (let i = 0; i < nS; i++) people.push({ k: 'soldier', w: 2, row: true });
    for (let i = 0; i < nB; i++) people.push({ k: 'boy', w: 1, row: true });
    return { mode: 'river', people, cap: 2, maxW: 2, goal: people.map((q) => (q.k === 'soldier' ? 1 : null)), unitW: '' };
  }
  function family(list, maxW) {
    return { mode: 'river', people: list.map(([k, n, w, row]) => ({ k, n, w, row: row !== false })), cap: list.length, maxW };
  }

  function listText(names) { return names.length <= 1 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }
  // the statement, written from the data
  function describe(d) {
    const n = N(d);
    if (d.mode === 'bridge') {
      const ts = d.people.map((q) => q.t);
      return C_num(n) + ' people must cross a rickety bridge at night. At most **' + num(d.cap || 2) + '** can be on it at once, and there is **one torch**: nobody crosses without it, so after each crossing someone must bring it back. They walk at different speeds — ' +
        listText(d.people.map((q) => (q.n ? q.n + ' ' : '') + q.t + ' min')) + ' — and a group goes at the pace of its slowest member. The torch lasts **' + d.limit + ' minutes**.' + (ts.length ? '' : '');
    }
    if (d.eat) {
      const items = d.people.filter((q) => q.k !== 'farmer').map((q) => LOOK[q.k].name.replace(/^the /, 'a '));
      const rules = d.eat.map(([a, b]) => nameOf(d, a) + ' eats ' + nameOf(d, b)).join('; ');
      return 'A farmer must bring ' + listText(items) + ' across a river. The boat holds the farmer and ' + (d.cap - 1 > 1 ? 'up to ' + num(d.cap - 1) + ' more' : 'one more') + ', and only the farmer can row. Left without the farmer: ' + rules + '.';
    }
    if (d.outnumber) {
      const nE = d.people.filter((q) => q.k === 'explorer').length, nO = n - nE;
      const rowE = d.people.filter((q) => q.k === 'explorer' && canRow(q)).length, rowO = d.people.filter((q) => q.k === 'ogre' && canRow(q)).length;
      let t = Cap1(num(nE)) + ' explorer' + (nE > 1 ? 's' : '') + ' and ' + num(nO) + ' ogre' + (nO > 1 ? 's' : '') + ' must cross a river in a boat that holds **' + num(d.cap) + '**. The ogres are friendly — unless they **outnumber** the explorers: wherever there are explorers, on either bank' + (d.boat ? ' or in the boat' : '') + ', there must never be more ogres than explorers. (A boat that has landed counts as part of its bank.)';
      if (rowE < nE || rowO < nO) t += ' Only ' + (rowE ? num(rowE) + ' of the explorers' : '') + (rowE && rowO ? ' and ' : '') + (rowO ? num(rowO) + ' of the ogres' : '') + ' can row.';
      else t += ' Anyone can row.';
      return t;
    }
    if (d.jealous) {
      const pairs = d.people.filter((q) => q.k === 'man').map((m) => m.n + ' & ' + d.people.find((w) => w.k === 'woman' && w.c === m.c).n);
      if (d.rel === 'siblings') return Cap1(num(pairs.length)) + ' brothers, each with a sister (' + listText(pairs) + '), must cross a river in a boat that holds **' + num(d.cap) + '**. Each brother guards his own sister jealously: no sister may be on a bank or in the boat with another man unless her brother is there too.';
      return Cap1(num(pairs.length)) + ' married couples (' + listText(pairs) + ') must cross a river in a boat that holds **' + num(d.cap) + '**. The husbands are jealous: no woman may be on a bank or in the boat with another man unless her own husband is there too.' + (d.people.some((q) => !canRow(q)) ? ' Only the men can row.' : '');
    }
    if (d.maxW != null && d.people.some((q) => q.k === 'soldier')) {
      const nS = d.people.filter((q) => q.k === 'soldier').length, nB = n - nS;
      return 'A troop of ' + num(nS) + ' soldier' + (nS > 1 ? 's' : '') + ' must cross a deep river. The only boat belongs to ' + num(nB) + ' boy' + (nB > 1 ? 's' : '') + '; it can carry the boys together, or one soldier — never a soldier and a boy. Everyone can row. Get every soldier across.';
    }
    if (d.maxW != null) {
      return 'The boat carries at most **' + d.maxW + ' kg**. ' + listText(d.people.map((q) => (q.n || nameOf(d, d.people.indexOf(q))) + ' (' + q.w + ' kg)')) + ' must all cross.' + (d.people.some((q) => !canRow(q)) ? ' The ' + listText(d.people.filter((q) => !canRow(q)).map((q) => (q.n || q.k).toLowerCase())) + ' cannot row.' : ' Anyone can row.');
    }
    return 'Get everyone across the river.';
  }
  function C_num(n) { return Cap1(num(n)); }
  function goalText(d) {
    if (d.mode === 'bridge') return 'Everyone across within ' + d.limit + ' minutes.';
    if (d.goal && d.goal.some((g) => g == null)) return 'Every soldier on the far bank.';
    return 'Everyone on the far bank' + (d.eat ? ', nothing eaten' : '') + '.';
  }

  // the naive bridge plan: the fastest walker escorts everyone
  function naiveTime(d) {
    const ts = d.people.map((q) => q.t).sort((a, b) => a - b);
    if (ts.length <= 2) return ts[ts.length - 1];
    if ((d.cap || 2) !== 2) return null;
    return ts.slice(1).reduce((a, b) => a + b, 0) + (ts.length - 2) * ts[0];
  }
  function bridgeLevel(d, best) {
    const n = N(d), naive = naiveTime(d), trick = naive != null && best < naive;
    if ((d.cap || 2) > 2) return n <= 5 ? 4 : 5;
    if (n <= 3) return 1;
    if (n === 4) return trick ? 3 : 2;
    if (n === 5) return trick ? 4 : 3;
    return 5;
  }
  // difficulty: crossings, plus weight for the harder rules and bigger casts
  function riverScore(d, par) {
    return par + (d.jealous ? 4 : 0) + (d.outnumber ? 2 : 0) + (d.people.some((q) => (LOOK[q.k] || {}).person && !canRow(q)) ? 2 : 0) + Math.max(0, N(d) - 6) + (d.eat && N(d) >= 5 ? 2 : 0);
  }
  function riverLevel(d, par) {
    const s = riverScore(d, par);
    return s <= 5 ? 1 : s <= 9 ? 2 : s <= 13 ? 3 : s <= 17 ? 4 : 5;
  }

  const BRIDGE_NAMES = ['Ada', 'Bo', 'Cy', 'Di', 'Eli', 'Fay', 'Gus'];
  function bridgeVariant(rng, level) {
    const nOf = [null, 3, 4, 4, 5, 6][level];
    for (let tries = 0; tries < 300; tries++) {
      const n = level === 5 && rng() < 0.3 ? 5 : nOf;
      const cap = level >= 4 && rng() < 0.3 ? 3 : 2;
      const set = new Set();
      while (set.size < n) set.add(rng.range(1, level <= 2 ? 10 : 15 + level * 2));
      const ts = Array.from(set).sort((a, b) => a - b);
      const d = { mode: 'bridge', people: ts.map((t, i) => ({ k: 'person', t, n: BRIDGE_NAMES[i] })), cap };
      const r = fastest(d);
      if (!r) continue;
      d.limit = r.cost;
      if (bridgeLevel(d, r.cost) !== level) continue;
      return { d, par: r.path.length, best: r.cost };
    }
    return null;
  }
  function riverVariant(rng, level) {
    for (let tries = 0; tries < 200; tries++) {
      const kind = rng.int(5);
      let d;
      if (kind === 0) d = eaters(rng.pick(THEMES), rng.range(2, 3));
      else if (kind === 1) { const nE = rng.range(1, 6), nO = rng.range(1, nE); d = explorers(nE, nO, rng.range(2, 4), rng() < 0.35 ? { e: rng.range(1, nE), o: rng.range(0, nO) } : null); }
      else if (kind === 2) d = couples(rng.range(2, 5), rng.range(2, 3), rng() < 0.85);
      else if (kind === 3) d = soldiers(rng.range(1, 4), 2);
      else {
        const names = [['person', 'Dad', 90], ['person', 'Mum', 70], ['child', 'Sam', 40], ['child', 'Kim', 30], ['dog', 'Rex', 20, false], ['child', 'Tom', 50], ['person', 'Gran', 60]];
        const k = rng.range(3, 5);
        const pick = rng.shuffle(names.slice()).slice(0, k);
        const heaviest = Math.max.apply(null, pick.map((x) => x[2]));
        const maxW = heaviest + rng.pick([0, 10, 20, 30]);
        d = family(pick, maxW);
        if (!d.people.some((q) => q.row)) continue;
      }
      const path = bfs(d);
      if (!path || path.length < 2) continue;
      if (riverLevel(d, path.length) !== level) continue;
      return { d, par: path.length };
    }
    return null;
  }
  function titleOf(d) {
    const n = N(d);
    if (d.mode === 'bridge') return Cap1(num(n)) + ' at the Bridge: ' + d.people.map((q) => q.t).join(', ');
    const Cw = (s) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
    if (d.eat) return Cw(listText(d.people.filter((q) => q.k !== 'farmer').map((q) => q.k))) + (d.cap > 2 ? ' (Boat of ' + d.cap + ')' : '');
    if (d.outnumber) {
      const e = d.people.filter((q) => q.k === 'explorer').length, re = d.people.filter((q) => q.k === 'explorer' && canRow(q)).length, ro = d.people.filter((q) => q.k === 'ogre' && canRow(q)).length;
      return e + ' Explorers, ' + (n - e) + ' Ogre' + (n - e > 1 ? 's' : '') + ', Boat of ' + d.cap + (re + ro < n ? ' (' + re + '+' + ro + ' Rowers)' : '');
    }
    if (d.jealous) return Cap1(num(n / 2)) + ' Jealous Couples, Boat of ' + d.cap + (d.people.some((q) => !canRow(q)) ? ' (Men Row)' : '');
    if (d.people.some((q) => q.k === 'soldier')) return Cap1(num(d.people.filter((q) => q.k === 'soldier').length)) + ' Soldier' + (d.people.filter((q) => q.k === 'soldier').length > 1 ? 's' : '') + ' and the Boys\' Boat';
    return 'The ' + d.maxW + ' kg Boat: ' + listText(d.people.map((q) => q.n || q.k));
  }

  /* ================= the figures ================= */

  const f2 = (v) => Math.round(v * 1000) / 1000;
  const SKIN = ['#f1c7a0', '#d9a57c', '#b07850', '#8d5a3b', '#f5d3b8'];
  const LINE = 'stroke="#2a2233" stroke-width=".09" stroke-linejoin="round" stroke-linecap="round"';
  function personSVG(o) {
    const shirt = o.shirt, skin = o.skin || SKIN[0], s = o.scale || 1;
    let b = '';
    // legs and body
    b += '<path d="M-.32 -.95L-.38 -.05M.32 -.95L.38 -.05" stroke="' + (o.legs || '#3b3f5c') + '" stroke-width=".3" stroke-linecap="round" fill="none"/>';
    if (o.dress) b += '<path d="M-.5 -2.12Q-.2 -2.2 0 -2.2Q.2 -2.2 .5 -2.12L.95 -.55Q0 -.35 -.95 -.55Z" fill="' + shirt + '" ' + LINE + '/>';
    else b += '<path d="M-.72 -.82Q-.8 -1.98 -.36 -2.16L.36 -2.16Q.8 -1.98 .72 -.82Z" fill="' + shirt + '" ' + LINE + '/>';
    b += '<path d="M-.6 -1.95Q-1 -1.45 -.86 -1.02M.6 -1.95Q1 -1.45 .86 -1.02" stroke="' + shirt + '" stroke-width=".26" stroke-linecap="round" fill="none"/>';
    if (o.straps) b += '<path d="M-.35 -2.12L-.25 -1.25M.35 -2.12L.25 -1.25M-.62 -1.3H.62" stroke="' + o.straps + '" stroke-width=".13" fill="none"/>';
    if (o.pack) b += '<rect x="-1.02" y="-2.05" width=".4" height=".9" rx=".12" fill="' + o.pack + '" ' + LINE + '/>';
    // the head
    const hr = o.head || 0.5;
    b += '<circle cy="-2.62" r="' + hr + '" fill="' + skin + '" ' + LINE + '/>';
    if (o.hair) b += o.hair;
    b += '<circle cx=".2" cy="-2.68" r=".055" fill="#2a2233"/><circle cx="-.08" cy="-2.68" r=".055" fill="#2a2233"/>';
    b += '<path d="M-.02 -2.43Q.14 -2.33 .28 -2.46" stroke="#2a2233" stroke-width=".06" fill="none" stroke-linecap="round"/>';
    if (o.hat) b += o.hat;
    if (o.letter) b += '<text y="-1.3" text-anchor="middle" font-size=".62" font-weight="800" fill="#fff" style="paint-order:stroke" stroke="rgba(0,0,0,.35)" stroke-width=".12">' + o.letter + '</text>';
    return s === 1 ? b : '<g transform="scale(' + s + ')">' + b + '</g>';
  }
  function animalSVG(k) {
    switch (k) {
      case 'wolf': return '<path d="M-1.05 -1.05Q-1.6 -1.4 -1.75 -.9Q-1.5 -1 -1.1 -.85Z" fill="#7b8190" ' + LINE + '/><ellipse cx="-.1" cy="-1.05" rx="1" ry=".5" fill="#8f96a6" ' + LINE + '/>' +
        '<path d="M-.7 -.7V0M-.3 -.7V0M.35 -.7V0M.7 -.7V0" stroke="#5e6472" stroke-width=".2" stroke-linecap="round"/>' +
        '<path d="M.55 -1.35L.75 -2.05L1 -1.6L1.25 -2.05L1.3 -1.45L1.9 -1.2L1.35 -.95L.75 -1Z" fill="#8f96a6" ' + LINE + '/><circle cx="1.15" cy="-1.42" r=".06" fill="#2a2233"/><circle cx="1.88" cy="-1.2" r=".08" fill="#2a2233"/>';
      case 'goat': return '<ellipse cx="-.1" cy="-1" rx=".95" ry=".48" fill="#f3efe6" ' + LINE + '/><path d="M-.65 -.65V0M-.3 -.65V0M.35 -.65V0M.65 -.65V0" stroke="#6b5a48" stroke-width=".18" stroke-linecap="round"/>' +
        '<path d="M.55 -1.25L.8 -1.9L1.35 -1.7L1.45 -1.25Q1.2 -1 .9 -1.05Z" fill="#f3efe6" ' + LINE + '/><path d="M.9 -1.85Q.8 -2.35 .5 -2.3M1.1 -1.85Q1.1 -2.35 .85 -2.4" stroke="#8a7456" stroke-width=".12" fill="none"/>' +
        '<path d="M1.25 -1.1L1.3 -.75L1.15 -1.02" fill="#cfc6b4" ' + LINE + '/><circle cx="1.12" cy="-1.58" r=".06" fill="#2a2233"/><path d="M-1 -1.15L-1.25 -1.35" stroke="#2a2233" stroke-width=".1"/>';
      case 'cabbage': return '<circle cy="-.72" r=".72" fill="#7ccf6b" ' + LINE + '/><path d="M0 -1.4Q-.35 -.7 0 -.05M0 -1.4Q.4 -.75 .05 -.05M-.6 -.95Q-.2 -.8 -.1 -.3M.6 -.95Q.2 -.8 .12 -.3" stroke="#3f8f3a" stroke-width=".08" fill="none"/>';
      case 'hay': return '<path d="M-.9 0L-.7 -1.2Q0 -1.5 .7 -1.2L.9 0Z" fill="#e6c35c" ' + LINE + '/><path d="M-.5 -1.1L-.6 0M-.1 -1.25V0M.3 -1.2L.4 0M-.75 -.55H.8" stroke="#a88a2c" stroke-width=".08" fill="none"/>';
      case 'fox': return '<path d="M-1 -.95Q-1.9 -1.2 -1.8 -.6Q-1.4 -.55 -1 -.75Z" fill="#e8843a" ' + LINE + '/><circle cx="-1.72" cy="-.72" r=".16" fill="#fff"/><ellipse cx="-.1" cy="-.95" rx=".9" ry=".42" fill="#e8843a" ' + LINE + '/>' +
        '<path d="M-.6 -.65V0M-.25 -.65V0M.3 -.65V0M.6 -.65V0" stroke="#5a3a24" stroke-width=".17" stroke-linecap="round"/>' +
        '<path d="M.5 -1.2L.65 -1.85L.9 -1.5L1.15 -1.85L1.2 -1.3L1.75 -1.05L1.15 -.85L.7 -.9Z" fill="#e8843a" ' + LINE + '/><circle cx="1.05" cy="-1.3" r=".06" fill="#2a2233"/><circle cx="1.73" cy="-1.05" r=".07" fill="#2a2233"/>';
      case 'goose': return '<path d="M-1 -.9Q-.9 -.25 0 -.25Q.9 -.3 .8 -.95Q.6 -1.25 0 -1.2Q-.6 -1.25 -1 -.9Z" fill="#fbfbf7" ' + LINE + '/><path d="M.55 -1.05Q.75 -1.9 .7 -2.2" stroke="#fbfbf7" stroke-width=".32" fill="none" stroke-linecap="round"/><path d="M.55 -1.05Q.75 -1.9 .7 -2.2" stroke="#2a2233" stroke-width=".05" fill="none" opacity=".4"/>' +
        '<circle cx=".75" cy="-2.3" r=".26" fill="#fbfbf7" ' + LINE + '/><path d="M.95 -2.32L1.35 -2.22L.95 -2.14Z" fill="#f29b38"/><circle cx=".8" cy="-2.36" r=".05" fill="#2a2233"/><path d="M-.2 -.25V0M.2 -.25V0" stroke="#f29b38" stroke-width=".12"/>';
      case 'beans': return '<path d="M-.75 0Q-.95 -.8 -.45 -1.15L-.3 -1.45H.3L.45 -1.15Q.95 -.8 .75 0Z" fill="#c9a36a" ' + LINE + '/><path d="M-.35 -1.3H.35" stroke="#7a5a2a" stroke-width=".12"/><ellipse cx="-.2" cy="-.55" rx=".13" ry=".09" fill="#7a3b1c"/><ellipse cx=".15" cy="-.4" rx=".13" ry=".09" fill="#7a3b1c"/><ellipse cx=".05" cy="-.72" rx=".13" ry=".09" fill="#7a3b1c"/>';
      case 'cat': return '<path d="M-.75 -.7Q-1.4 -1 -1.2 -1.6" stroke="#e39b4a" stroke-width=".18" fill="none" stroke-linecap="round"/><ellipse cx="-.1" cy="-.7" rx=".7" ry=".38" fill="#e39b4a" ' + LINE + '/><path d="M-.45 -.45V0M.3 -.45V0" stroke="#a4652a" stroke-width=".16" stroke-linecap="round"/>' +
        '<circle cx=".6" cy="-1.1" r=".38" fill="#e39b4a" ' + LINE + '/><path d="M.35 -1.35L.4 -1.7L.6 -1.45ZM.7 -1.45L.9 -1.7L.92 -1.3Z" fill="#e39b4a" ' + LINE + '/><circle cx=".72" cy="-1.12" r=".05" fill="#2a2233"/><circle cx=".52" cy="-1.12" r=".05" fill="#2a2233"/>';
      case 'mouse': return '<path d="M-.4 -.25Q-1 -.1 -1.1 -.5" stroke="#b0a8b8" stroke-width=".06" fill="none"/><ellipse cx="0" cy="-.28" rx=".42" ry=".26" fill="#b0a8b8" ' + LINE + '/><circle cx=".3" cy="-.52" r=".14" fill="#d8c8d8" ' + LINE + '/><circle cx=".52" cy="-.3" r=".04" fill="#2a2233"/><path d="M.42 -.22L.62 -.3" stroke="#2a2233" stroke-width=".05"/>';
      case 'cheese': return '<path d="M-.8 0V-.7L.8 -1.05V0Z" fill="#f7cf4a" ' + LINE + '/><circle cx="-.3" cy="-.35" r=".12" fill="#d9a92a"/><circle cx=".3" cy="-.55" r=".09" fill="#d9a92a"/><circle cx=".35" cy="-.2" r=".1" fill="#d9a92a"/>';
      case 'dog': return '<path d="M-.9 -1Q-1.3 -1.5 -1.1 -1.7" stroke="#9b6a3e" stroke-width=".16" fill="none" stroke-linecap="round"/><ellipse cx="-.1" cy="-.9" rx=".85" ry=".42" fill="#b07c4a" ' + LINE + '/><path d="M-.55 -.6V0M-.2 -.6V0M.3 -.6V0M.6 -.6V0" stroke="#6e4a2a" stroke-width=".18" stroke-linecap="round"/>' +
        '<path d="M.5 -1.1Q.55 -1.75 1.05 -1.7Q1.4 -1.6 1.55 -1.3L1.6 -1.05Q1.2 -.95 .8 -1Z" fill="#b07c4a" ' + LINE + '/><path d="M.75 -1.62Q.55 -1.3 .7 -1.1" stroke="#6e4a2a" stroke-width=".2" fill="none" stroke-linecap="round"/><circle cx="1.1" cy="-1.45" r=".06" fill="#2a2233"/><circle cx="1.58" cy="-1.2" r=".07" fill="#2a2233"/>';
      case 'lion': return '<path d="M-1 -.95Q-1.6 -1.1 -1.55 -.6" stroke="#d8a24a" stroke-width=".14" fill="none"/><ellipse cx="-.1" cy="-.95" rx=".95" ry=".45" fill="#e8b45a" ' + LINE + '/><path d="M-.65 -.65V0M-.3 -.65V0M.35 -.65V0M.7 -.65V0" stroke="#9a6a2a" stroke-width=".2" stroke-linecap="round"/>' +
        '<circle cx=".95" cy="-1.35" r=".6" fill="#a8652a" ' + LINE + '/><circle cx="1" cy="-1.33" r=".38" fill="#e8b45a"/><circle cx="1.1" cy="-1.42" r=".05" fill="#2a2233"/><circle cx=".9" cy="-1.42" r=".05" fill="#2a2233"/><path d="M.93 -1.2Q1.02 -1.12 1.12 -1.2" stroke="#2a2233" stroke-width=".05" fill="none"/>';
      case 'sheep': return '<path d="M-.9 -.9Q-1.05 -1.35 -.6 -1.4Q-.4 -1.7 0 -1.55Q.4 -1.75 .65 -1.4Q1.05 -1.3 .85 -.85Q.95 -.45 .5 -.45Q0 -.25 -.5 -.45Q-1 -.45 -.9 -.9Z" fill="#fbfbf7" ' + LINE + '/>' +
        '<path d="M-.5 -.5V0M.45 -.5V0" stroke="#2a2233" stroke-width=".17" stroke-linecap="round"/><ellipse cx="1.05" cy="-1.2" rx=".3" ry=".38" fill="#3a3340"/><circle cx="1.12" cy="-1.3" r=".05" fill="#fff"/>';
      case 'hedgehog': return '<path d="M-.9 -.1Q-.9 -.9 0 -1Q.7 -1 .9 -.3L.6 -.1Z" fill="#7a5a3a" ' + LINE + '/><path d="M-.8 -.4L-1 -.7M-.6 -.7L-.75 -1.05M-.3 -.9L-.35 -1.25M0 -.98L.05 -1.3M.3 -.92L.45 -1.2" stroke="#4a3422" stroke-width=".08"/><circle cx=".65" cy="-.45" r=".05" fill="#2a2233"/>';
      default: return '<circle cy="-.7" r=".7" fill="#aaa"/>';
    }
  }
  const HUES = [0, 210, 130, 45, 280, 180, 330, 90, 25];
  function figSVG(d, i) {
    const q = d.people[i], k = q.k;
    const hue = HUES[(q.c != null ? q.c : i) % HUES.length];
    const skin = SKIN[(i * 3 + (q.c || 0)) % SKIN.length];
    switch (k) {
      case 'farmer': return personSVG({ shirt: '#d8554a', skin: SKIN[0], straps: '#3767b3', legs: '#3767b3',
        hat: '<ellipse cy="-3.02" rx=".92" ry=".17" fill="#e8c86a" ' + LINE + '/><path d="M-.45 -3.05Q-.42 -3.5 0 -3.5Q.42 -3.5 .45 -3.05Z" fill="#e8c86a" ' + LINE + '/><path d="M-.45 -3.12H.45" stroke="#b5523d" stroke-width=".1"/>' });
      case 'man': return personSVG({ shirt: 'hsl(' + hue + ' 55% 48%)', skin, letter: q.n ? q.n[0] : null, hair: '<path d="M-.5 -2.7Q-.45 -3.2 0 -3.18Q.45 -3.2 .5 -2.7Q.25 -2.95 -.5 -2.7Z" fill="#4a3526"/>' });
      case 'woman': return personSVG({ shirt: 'hsl(' + hue + ' 60% 62%)', skin, dress: true, letter: q.n ? q.n[0] : null, hair: '<path d="M-.55 -2.3Q-.7 -3.2 0 -3.2Q.7 -3.2 .55 -2.3Q.4 -2.9 0 -2.95Q-.4 -2.9 -.55 -2.3Z" fill="#7a4a2a"/>' });
      case 'explorer': return personSVG({ shirt: '#c8b27a', skin, legs: '#7a6a44', pack: '#8a6a3a',
        hat: '<path d="M-.62 -2.88Q-.55 -3.45 0 -3.45Q.55 -3.45 .62 -2.88Z" fill="#efe3bf" ' + LINE + '/><ellipse cy="-2.88" rx=".82" ry=".13" fill="#efe3bf" ' + LINE + '/>' });
      case 'ogre': return personSVG({ shirt: '#8a6a4a', skin: '#8fc07a', legs: '#5a4a3a', head: 0.6,
        hat: '<path d="M-.35 -3.12L-.5 -3.5L-.18 -3.2ZM.35 -3.12L.5 -3.5L.18 -3.2Z" fill="#efe3bf" ' + LINE + '/><path d="M-.12 -2.42Q.12 -2.22 .36 -2.42" stroke="#2a2233" stroke-width=".06" fill="#fff"/>' });
      case 'soldier': return personSVG({ shirt: '#5f7a4a', skin, legs: '#3f5232',
        hat: '<path d="M-.58 -2.72Q-.58 -3.3 0 -3.3Q.58 -3.3 .58 -2.72Z" fill="#4a5e38" ' + LINE + '/><path d="M-.7 -2.72H.7" stroke="#2f3d24" stroke-width=".12"/>' });
      case 'boy': case 'child': return personSVG({ shirt: 'hsl(' + hue + ' 65% 55%)', skin, scale: 0.78,
        hat: k === 'boy' ? '<path d="M-.48 -2.8Q-.45 -3.18 0 -3.18Q.45 -3.18 .48 -2.8Z" fill="hsl(' + ((hue + 180) % 360) + ' 60% 45%)"/><path d="M.3 -2.82H.85" stroke="hsl(' + ((hue + 180) % 360) + ' 60% 45%)" stroke-width=".14" stroke-linecap="round"/>' : '',
        hair: k === 'child' ? '<path d="M-.5 -2.6Q-.5 -3.15 0 -3.15Q.5 -3.15 .5 -2.6Q.2 -2.95 -.5 -2.6Z" fill="#6a4a2a"/>' : '' });
      case 'person': return personSVG({ shirt: 'hsl(' + hue + ' 58% 52%)', skin, letter: q.n && q.t != null ? q.n[0] : null, hair: '<path d="M-.5 -2.62Q-.5 -3.16 0 -3.16Q.5 -3.16 .5 -2.62Q.2 -2.92 -.5 -2.62Z" fill="' + ['#3a2a1e', '#7a4a2a', '#c9a060', '#2a2233', '#9a9aa8'][i % 5] + '"/>' });
      default: return animalSVG(k);
    }
  }
  const figHeight = (k) => ((LOOK[k] || {}).person ? (k === 'boy' || k === 'child' ? 2.6 : 3.4) : 2.2);

  /* ================= shared scene helpers ================= */

  const WIDTH = { wolf: 3.8, goat: 3, fox: 3.7, goose: 2.8, cat: 2.6, mouse: 2, cheese: 2, cabbage: 1.9, beans: 2, dog: 3.3, lion: 3.2, sheep: 2.6, hay: 2.2, hedgehog: 2.2 };
  const widthOf = (k) => WIDTH[k] || ((LOOK[k] || {}).person ? 2.3 : 2.4);
  function makeClock() {
    const timers = new Set(), frames = new Set();
    return {
      later(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, C.anim(ms)); timers.add(id); return id; },
      frame(fn) { const id = requestAnimationFrame((t) => { frames.delete(id); fn(t); }); frames.add(id); return id; },
      stop() { timers.forEach(clearTimeout); frames.forEach(cancelAnimationFrame); timers.clear(); frames.clear(); }
    };
  }
  // run fn(t) for t from 0 to 1 over ms, then done()
  function tween(clock, ms, fn, done) {
    const t0 = performance.now(), dur = Math.max(1, C.anim(ms));
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      fn(t);
      if (t < 1) clock.frame(step); else if (done) done();
    };
    clock.frame(step);
  }
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  // slots on a bank, from the water outwards, in rows
  function bankSlots(d, perRow) {
    const n = N(d), out = [];
    const rows = Math.ceil(n / perRow);
    let maxW = 0;
    for (let r = 0; r < rows; r++) {
      let x = 0;
      for (let c = 0; c < perRow && r * perRow + c < n; c++) {
        const i = r * perRow + c, w = widthOf(d.people[i].k);
        out[i] = { off: x + w / 2, row: r };
        x += w + 0.25;
      }
      maxW = Math.max(maxW, x);
    }
    return { slots: out, width: maxW, rows };
  }

  /* ================= the river ================= */

  function mountRiver(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s, n = N(d), cap = d.cap || 2, UW = d.unitW != null ? d.unitW : 'kg';
    const clock = makeClock();
    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    const perRow = n <= 5 ? n : Math.ceil(n / 2);
    const bs = bankSlots(d, perRow);
    const STAG = 1.15;   // back rows stand a little further from the water, so both rows show
    const BW = bs.width + 1.8 + (bs.rows - 1) * STAG, SEATW = 2.5, BL = 2.4 + cap * SEATW, RW = BL + 8, TW = 2 * BW + RW;
    const G = 14, ROWDY = 3.0, WL = 14.9;
    const slotPos = (i, side) => {
      const s = bs.slots[i], back = bs.rows - 1 - s.row, y = G - back * ROWDY, off = s.off + back * STAG;
      return [side ? BW + RW + 0.9 + off : BW - 0.9 - off, y];
    };
    const dockX = (side) => (side ? BW + RW - BL - 0.5 : BW + 0.5);
    const seatX = (bx, j) => bx + 1.2 + (j + 0.5) * SEATW;

    // the land, the water, the boat
    const yTop = G - (bs.rows - 1) * ROWDY - 3.9;
    const hill = (x0, x1) => 'M' + x0 + ' ' + (G - (bs.rows - 1) * ROWDY - 1.2) + 'Q' + ((x0 + x1) / 2) + ' ' + (G - (bs.rows - 1) * ROWDY - 2.4) + ' ' + x1 + ' ' + (G - (bs.rows - 1) * ROWDY - 1.1) + 'V17.8H' + x0 + 'Z';
    S('path', { d: hill(-1.5, BW + 0.2), class: 'cx-hill' }, bg);
    S('path', { d: hill(BW + RW - 0.2, TW + 1.5), class: 'cx-hill' }, bg);
    S('rect', { x: BW - 0.6, y: WL - 0.3, width: RW + 1.2, height: 17.8 - WL + 0.3, class: 'cx-water' }, bg);
    const ripples = S('path', { class: 'cx-ripple', d: Array.from({ length: 5 }, (_, k) => 'M' + f2(BW + 0.5 + k * RW / 5) + ' ' + f2(WL + 1 + (k % 2) * 1.3) + 'h' + f2(RW / 7)).join('') }, bg);
    void ripples;
    S('path', { d: 'M-1.5 ' + (G + 0.2) + 'H' + (BW - 0.5) + 'Q' + BW + ' ' + (G + 0.3) + ' ' + (BW + 0.3) + ' ' + (WL + 0.8) + 'L' + (BW + 0.5) + ' 17.8H-1.5Z', class: 'cx-bank' }, bg);
    S('path', { d: 'M' + (TW + 1.5) + ' ' + (G + 0.2) + 'H' + (BW + RW + 0.5) + 'Q' + (BW + RW) + ' ' + (G + 0.3) + ' ' + (BW + RW - 0.3) + ' ' + (WL + 0.8) + 'L' + (BW + RW - 0.5) + ' 17.8H' + (TW + 1.5) + 'Z', class: 'cx-bank' }, bg);
    S('text', { x: BW / 2, y: 17.15, 'text-anchor': 'middle', class: 'cx-banklabel', text: 'near bank' }, bg);
    S('text', { x: BW + RW + BW / 2, y: 17.15, 'text-anchor': 'middle', class: 'cx-banklabel', text: 'far bank' }, bg);
    const boatBack = S('g', { class: 'cx-boat' }, board);
    S('path', { d: 'M.2 ' + (WL - 0.75) + 'H' + (BL - 0.2) + 'V' + (WL - 0.35) + 'H.2Z', class: 'cx-hull-in' }, boatBack);
    const oars = [0, 1].map(() => S('line', { class: 'cx-oar' }, boatBack));
    const people = S('g', { class: 'cx-people' }, board);
    const boatFront = S('g', { class: 'cx-boat' }, board);
    S('path', { d: 'M0 ' + (WL - 0.75) + 'H' + BL + 'Q' + (BL - 0.3) + ' ' + (WL + 0.9) + ' ' + (BL - 1.7) + ' ' + (WL + 1.05) + 'H1.7Q.3 ' + (WL + 0.9) + ' 0 ' + (WL - 0.75) + 'Z', class: 'cx-hull' }, boatFront);
    S('path', { d: 'M.35 ' + (WL - 0.3) + 'H' + (BL - 0.35), class: 'cx-hull-line' }, boatFront);
    const rowBtn = S('g', { class: 'cx-btn' }, top);
    S('rect', { x: BW + RW / 2 - 3.2, y: yTop - 3, width: 6.4, height: 2.3, rx: 1.15 }, rowBtn);
    const rowTxt = S('text', { x: BW + RW / 2, y: yTop - 1.42, 'text-anchor': 'middle' }, rowBtn);
    rowBtn.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); row(); });
    const fx = S('g', { class: 'cx-fx' }, top);
    wb.setBounds({ x0: -1.5, y0: yTop - 3.6, x1: TW + 1.5, y1: 17.9 }, 0.04);

    const figs = d.people.map((q, i) => {
      const g = S('g', { class: 'cx-fig', 'data-i': i }, people);
      const inner = S('g', null, g);
      inner.innerHTML = figSVG(d, i);
      const h = figHeight(q.k), w = widthOf(q.k);
      S('rect', { x: -w / 2, y: -h - 0.2, width: w, height: h + 0.4, class: 'cx-hit' }, g);
      const tag = q.w != null && !d.people.some((x) => x.k === 'soldier') ? q.w + ' ' + UW : (q.n && q.k !== 'man' && q.k !== 'woman' ? q.n : '');
      if (tag) S('text', { y: 0.95, 'text-anchor': 'middle', class: 'cx-tag', text: tag }, g);
      S('title', { text: Cap1(nameOf(d, i).replace(/^(a|an) /, '')) + (canRow(q) ? '' : ' (cannot row)') }, g);
      if (!canRow(q) && (LOOK[q.k] || {}).person) S('text', { y: -h - 0.35, 'text-anchor': 'middle', class: 'cx-norow', text: 'can\'t row' }, g);
      g.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); tap(i); });
      return { g, inner, x: 0, y: 0, face: 1 };
    });

    let right = startOf(d).right, boat = startOf(d).boat, inBoat = [], busy = false, bx = dockX(boat);
    const sideOf = (i) => (right >> i) & 1;
    function place(i, x, y, face) {
      const F = figs[i];
      F.x = x; F.y = y; if (face) F.face = face;
      F.g.setAttribute('transform', 'translate(' + f2(x) + ' ' + f2(y) + ')');
      F.inner.setAttribute('transform', F.face < 0 ? 'scale(-1 1)' : '');
    }
    function home(i) {
      const k = inBoat.indexOf(i);
      if (k >= 0) return [seatX(bx, k), WL - 0.55, boat ? -1 : 1];
      const s = sideOf(i), pos = slotPos(i, s);
      return [pos[0], pos[1], s ? -1 : 1];
    }
    function setBoat(x, bob, oarA) {
      bx = x;
      const tf = 'translate(' + f2(x) + ' ' + f2(bob || 0) + ')';
      boatBack.setAttribute('transform', tf);
      boatFront.setAttribute('transform', tf);
      const a = oarA || 0, mid = BL / 2;
      oars.forEach((o, k) => {
        const sx = mid + (k ? 0.5 : -0.5), dir = k ? 1 : -1;
        o.setAttribute('x1', sx); o.setAttribute('y1', WL - 0.9);
        o.setAttribute('x2', f2(sx + dir * 2.4 * Math.cos(a))); o.setAttribute('y2', f2(WL + 0.6 + Math.sin(a) * 0.4));
      });
    }
    function layout() {
      setBoat(dockX(boat));
      for (let i = 0; i < n; i++) { const h = home(i); place(i, h[0], h[1], h[2]); }
      // people further back are drawn first
      const order = figs.map((F, i) => i).sort((a, b) => figs[a].y - figs[b].y);
      order.forEach((i) => people.appendChild(figs[i].g));
      draw();
    }
    function draw() {
      figs.forEach((F, i) => { F.g.classList.toggle('aboard', inBoat.includes(i)); F.g.classList.toggle('far', sideOf(i) !== boat && !inBoat.includes(i)); });
      rowTxt.textContent = boat ? '⟵ Row back' : 'Row across ⟶';
      rowBtn.classList.toggle('off', !inBoat.length || busy);
      const load = d.maxW != null ? inBoat.reduce((s, i) => s + (d.people[i].w || 0), 0) : null;
      ctx.stat('In the boat', inBoat.length + ' / ' + cap + (load != null && !d.people.some((q) => q.k === 'soldier') ? ' · ' + load + ' / ' + d.maxW + ' ' + UW : ''));
      rowBtnP.disabled = !inBoat.length || busy;
    }
    function walk(list, done) {
      const from = list.map((i) => [figs[i].x, figs[i].y]);
      const to = list.map((i) => home(i));
      busy = true;
      tween(clock, 420, (t) => {
        const e = ease(t);
        list.forEach((i, k) => place(i, from[k][0] + (to[k][0] - from[k][0]) * e, from[k][1] + (to[k][1] - from[k][1]) * e - Math.abs(Math.sin(t * Math.PI * 3)) * 0.35, to[k][2]));
      }, () => { busy = false; layout(); if (done) done(); });
    }
    const wLabel = (i) => nameOf(d, i).replace(/^(a|an) /, 'the ');
    function tap(i) {
      if (busy) return;
      const k = inBoat.indexOf(i);
      if (k >= 0) { inBoat.splice(k, 1); ctx.sfx('tap'); walk([i].concat(inBoat), () => ctx.changed('boat')); return; }
      if (sideOf(i) !== boat) { ctx.toast('The boat is on the other bank.'); return; }
      if (inBoat.length >= cap) { ctx.toast('The boat holds only ' + num(cap) + '.'); ctx.sfx('wrong'); return; }
      if (d.maxW != null) {
        const load = inBoat.reduce((s, j) => s + (d.people[j].w || 0), 0) + (d.people[i].w || 0);
        if (load > d.maxW) {
          const soldiersHere = d.people.some((q) => q.k === 'soldier');
          ctx.say(soldiersHere ? 'The boat would sink: it takes the two boys, or one soldier — nothing more.' : 'Too heavy: that makes ' + load + ' ' + UW + ', and the boat takes ' + d.maxW + ' ' + UW + '.', 'warn');
          ctx.sfx('wrong');
          return;
        }
      }
      inBoat.push(i);
      ctx.sfx('tap');
      walk([i], () => ctx.changed('boat'));
    }
    // the boat glides from x0 to x1 with its passengers, oars going
    function sail(x0, x1, ms, done) {
      busy = true;
      draw();
      const offs = inBoat.map((i) => figs[i].x - bx), face = x1 > x0 ? 1 : -1;
      tween(clock, ms, (t) => {
        const e = ease(t), x = x0 + (x1 - x0) * e, bob = Math.sin(t * Math.PI * 4) * 0.12;
        setBoat(x, bob, Math.sin(t * Math.PI * 7) * 0.5);
        inBoat.forEach((i, k) => place(i, x + offs[k], WL - 0.55 + bob, face));
      }, done);
    }
    function row(done) {
      if (busy) return;
      if (!inBoat.length) { ctx.say('The boat will not row itself — tap someone to put them in it.', 'warn'); ctx.sfx('wrong'); return; }
      if (!inBoat.some((i) => canRow(d.people[i]))) { ctx.say(Cap1(listText(inBoat.map(wLabel))) + ' cannot row. Somebody who can must go too.', 'warn'); ctx.sfx('wrong'); return; }
      const from = boat, to = 1 - boat, oldRight = right, x0 = dockX(from), x1 = dockX(to);
      let nr = right;
      inBoat.forEach((i) => { nr ^= 1 << i; });
      ctx.sfx('pour');
      const inBoatTrouble = d.boat ? trouble(d, inBoat) : null;
      if (inBoatTrouble) {
        const mid = (x0 + x1) / 2;
        sail(x0, mid, 800, () => showTrouble(inBoatTrouble, 'in the boat', inBoat, () => sail(mid, x0, 700, () => { busy = false; layout(); })));
        return;
      }
      const bt = bankTrouble(d, nr);
      sail(x0, x1, 1400, () => {
        if (bt) {
          const onBank = [];
          for (let i = 0; i < n; i++) if (((nr >> i) & 1) === bt.side) onBank.push(i);
          showTrouble(bt.t, bt.side ? 'on the far bank' : 'on the near bank', onBank, () => {
            right = oldRight; boat = from;
            sail(x1, x0, 1000, () => { busy = false; layout(); });
          });
          return;
        }
        right = nr; boat = to; busy = false;
        layout();
        ctx.move();
        if (done) done(); else ctx.changed('row');
      });
    }
    function showTrouble(t, where, group, then) {
      ctx.sfx('wrong');
      ctx.say(troubleText(d, t, where), 'warn');
      fx.innerHTML = '';
      const who = t.type === 'eat' ? [t.a] : t.type === 'jealous' ? [t.w, t.m] : group.filter((i) => d.people[i].k === d.outnumber[1]);
      const victim = t.type === 'eat' ? t.b : -1;
      who.forEach((i) => figs[i].g.classList.add('cx-bad'));
      if (victim >= 0) figs[victim].g.classList.add('cx-gone');
      const c = who.map((i) => figs[i].x).reduce((a, b) => a + b, 0) / who.length, y = Math.min.apply(null, who.map((i) => figs[i].y)) - 4.2;
      S('text', { x: c, y, 'text-anchor': 'middle', class: 'cx-boom', text: t.type === 'eat' ? 'CHOMP!' : t.type === 'jealous' ? 'How dare you!' : 'Grrr…' }, fx);
      clock.later(() => {
        fx.innerHTML = '';
        figs.forEach((F) => F.g.classList.remove('cx-bad', 'cx-gone'));
        then();
      }, 1700);
    }
    const rowBtnP = ctx.h('button.btn.primary', { type: 'button', onclick: () => row() }, 'Row ⛵');
    const rulesEl = ctx.h('div.cx-rules', { html: ctx.md(rulesSummary(d)) });
    ctx.panel.append(rowBtnP, rulesEl);
    layout();
    ctx.setGoal(p.goal || goalText(d));

    function moveText(m, fromSide) {
      const names = m.group.map(wLabel);
      if (m.group.length === 1) return Cap1(names[0]) + (fromSide ? ' rows back alone.' : ' crosses alone.');
      return Cap1(listText(names)) + (fromSide ? ' row back.' : ' cross together.');
    }
    return {
      check() {
        if (atGoal(d, right)) return { solved: true, msg: 'Everyone is where they should be.' };
        return { solved: false, msg: 'Not everyone is across yet.' };
      },
      hint() {
        if (atGoal(d, right)) return 'Done!';
        const path = bfs(d, { right, boat });
        if (!path) return 'From here there is no way to finish — undo a few crossings.';
        const m = path[0];
        return {
          text: moveText(m, boat) + ' (From here it takes ' + C.plural(path.length, 'more crossing') + '.)',
          show() { m.group.forEach((i) => { const el = figs[i].g; el.classList.add('cx-hint'); setTimeout(() => el.classList.remove('cx-hint'), 2600); }); }
        };
      },
      solve() {
        clock.stop(); busy = false;
        let path = bfs(d, { right, boat });
        if (!path) { const s0 = startOf(d); right = s0.right; boat = s0.boat; inBoat = []; layout(); path = bfs(d); }
        let k = 0;
        const next = () => {
          if (k >= path.length) { ctx.changed('solve'); return; }
          const m = path[k++];
          const out = inBoat.filter((i) => !m.group.includes(i));
          inBoat = m.group.slice();
          walk(out.concat(m.group), () => row(() => clock.later(next, 250)));
        };
        next();
      },
      explain() {
        const path = bfs(d, startOf(d));
        if (!path) return '';
        let b = startOf(d).boat;
        return 'A shortest way (' + C.plural(path.length, 'crossing') + '): ' + path.map((m, i) => { const t = (i + 1) + '. ' + moveText(m, b); b = 1 - b; return t; }).join(' ');
      },
      getState() { return { right, boat, inBoat: inBoat.slice() }; },
      setState(s) { clock.stop(); busy = false; fx.innerHTML = ''; figs.forEach((F) => F.g.classList.remove('cx-bad', 'cx-gone')); right = s.right; boat = s.boat; inBoat = (s.inBoat || []).slice(); layout(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.key === 'Enter' || ev.key === 'g' || ev.key === 'G') { row(); return true; }
        const k = parseInt(ev.key, 10);
        if (k >= 1 && k <= Math.min(9, n)) { tap(k - 1); return true; }
        return false;
      },
      destroy() { clock.stop(); }
    };
  }
  function rulesSummary(d) {
    const lines = [];
    lines.push('**Boat:** ' + num(d.cap || 2) + ' seats' + (d.maxW != null && !d.people.some((q) => q.k === 'soldier') ? ', ' + d.maxW + ' kg at most' : ''));
    if (d.people.some((q) => q.k === 'soldier')) lines.push('**Load:** the two boys, or one soldier');
    const rowers = d.people.filter((q) => canRow(q)).length;
    if (rowers < d.people.length) lines.push('**Rowers:** ' + listText(d.people.map((q, i) => (canRow(q) ? nameOf(d, i).replace(/^(a|an) /, '') : null)).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)));
    if (d.eat) lines.push('**Hungry:** ' + d.eat.map(([a, b]) => nameOf(d, a).replace(/^the /, '') + ' → ' + nameOf(d, b).replace(/^the /, '')).join(', ') + ' (unless the farmer is there)');
    if (d.jealous) lines.push('**Jealous:** ' + (d.rel === 'siblings' ? 'no sister with another man unless her brother is there' : 'no wife with another man unless her husband is there') + (d.boat ? ' (bank or boat)' : ''));
    if (d.outnumber) lines.push('**Never:** more ogres than explorers where explorers are' + (d.boat ? ' (banks and boat)' : ''));
    return lines.join('<br>');
  }

  /* ================= the bridge and the torch ================= */

  function mountBridge(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s, n = N(d), cap = d.cap || 2, full = (1 << n) - 1;
    const clock = makeClock();
    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    const perRow = n <= 6 ? n : Math.ceil(n / 2);
    const bs = bankSlots(d, perRow);
    const BW = bs.width + 2.6, GW = 13, TW = 2 * BW + GW, G = 12, ROWDY = 2.4, SAG = 1.1;
    const slotPos = (i, side) => { const s = bs.slots[i], y = G - (bs.rows - 1 - s.row) * ROWDY; return [side ? BW + GW + 1.6 + s.off : BW - 1.6 - s.off, y]; };
    const bridgePt = (u) => [BW - 0.2 + u * (GW + 0.4), G + 4 * SAG * u * (1 - u)];
    const readyU = (side, j) => (side ? 0.93 - j * 0.09 : 0.07 + j * 0.09);
    const postX = (side) => (side ? BW + GW + 0.9 : BW - 0.9);
    const gid = 'cxglow-' + String(p.id).replace(/[^\w-]/g, '');

    // the night, the cliffs, the bridge
    const defs = S('defs', null, bg);
    defs.innerHTML = '<radialGradient id="' + gid + '"><stop offset="0" stop-color="#ffcf6a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient>';
    S('rect', { x: -1.5, y: -1.5, width: TW + 3, height: G + 8.5, class: 'cx-night' }, bg);
    let stars = '';
    const srng = C.rng(p.id + ':stars');
    for (let k = 0; k < 40; k++) stars += 'M' + f2(-1 + srng() * (TW + 2)) + ' ' + f2(-1 + srng() * (G - 5)) + 'h.01';
    S('path', { d: stars, class: 'cx-stars' }, bg);
    S('circle', { cx: TW - 3, cy: 1.5, r: 1.1, class: 'cx-moon' }, bg);
    S('path', { d: 'M-1.5 ' + G + 'H' + BW + 'L' + (BW + 0.8) + ' ' + (G + 7) + 'H-1.5Z', class: 'cx-cliff' }, bg);
    S('path', { d: 'M' + (TW + 1.5) + ' ' + G + 'H' + (BW + GW) + 'L' + (BW + GW - 0.8) + ' ' + (G + 7) + 'H' + (TW + 1.5) + 'Z', class: 'cx-cliff' }, bg);
    let planks = '', rope = '', rope2 = '';
    for (let k = 0; k <= 26; k++) { const u = k / 26, q = bridgePt(u); planks += 'M' + f2(q[0] - 0.12) + ' ' + f2(q[1]) + 'h.34'; }
    for (let k = 0; k <= 40; k++) { const u = k / 40, q = bridgePt(u); rope += (k ? 'L' : 'M') + f2(q[0]) + ' ' + f2(q[1]); rope2 += (k ? 'L' : 'M') + f2(q[0]) + ' ' + f2(q[1] - 1.5 - (u * (1 - u)) * -0.6); }
    S('path', { d: rope, class: 'cx-deck' }, board);
    S('path', { d: planks, class: 'cx-planks' }, board);
    S('path', { d: rope2, class: 'cx-rope' }, board);
    S('path', { d: 'M' + (BW - 0.2) + ' ' + G + 'v-2M' + (BW + GW + 0.2) + ' ' + G + 'v-2', class: 'cx-postline' }, board);
    const people = S('g', { class: 'cx-people' }, board);
    const torchEl = S('g', { class: 'cx-torch' }, board);
    torchEl.innerHTML = '<circle cy="-2.1" r="3" fill="url(#' + gid + ')"/><line x1="0" y1="0" x2="0" y2="-1.7" stroke="#7a4a22" stroke-width=".22" stroke-linecap="round"/><path class="cx-flame" d="M0 -1.6Q-.5 -2.1 0 -3Q.5 -2.1 0 -1.6Z"/>';
    const timeTxt = S('text', { x: TW / 2, y: 0.9, 'text-anchor': 'middle', class: 'cx-time' }, top);
    S('rect', { x: TW / 2 - 6, y: 1.6, width: 12, height: 0.45, rx: 0.22, class: 'cx-lifebg' }, top);
    const life = S('rect', { x: TW / 2 - 6, y: 1.6, width: 12, height: 0.45, rx: 0.22, class: 'cx-life' }, top);
    const goBtn = S('g', { class: 'cx-btn' }, top);
    S('rect', { x: TW / 2 - 3.2, y: 3, width: 6.4, height: 2.3, rx: 1.15 }, goBtn);
    const goTxt = S('text', { x: TW / 2, y: 4.58, 'text-anchor': 'middle' }, goBtn);
    goBtn.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); crossNow(); });
    wb.setBounds({ x0: -1.5, y0: -1.5, x1: TW + 1.5, y1: G + 6 }, 0.04);

    const figs = d.people.map((q, i) => {
      const g = S('g', { class: 'cx-fig', 'data-i': i }, people);
      const inner = S('g', null, g);
      inner.innerHTML = figSVG(d, i);
      S('rect', { x: -1.1, y: -3.6, width: 2.2, height: 4, class: 'cx-hit' }, g);
      S('text', { y: 0.95, 'text-anchor': 'middle', class: 'cx-tag', text: q.t + ' min' }, g);
      S('title', { text: (q.n ? q.n + ': ' : '') + q.t + ' min' }, g);
      g.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); tap(i); });
      return { g, inner, x: 0, y: 0, face: 1 };
    });

    let right = 0, torch = 0, ready = [], time = 0, busy = false, carrier = -1;
    const sideOf = (i) => (right >> i) & 1;
    function place(i, x, y, face) {
      const F = figs[i];
      F.x = x; F.y = y; if (face) F.face = face;
      F.g.setAttribute('transform', 'translate(' + f2(x) + ' ' + f2(y) + ')');
      F.inner.setAttribute('transform', F.face < 0 ? 'scale(-1 1)' : '');
    }
    function home(i) {
      const k = ready.indexOf(i);
      if (k >= 0) { const q = bridgePt(readyU(torch, k)); return [q[0], q[1], torch ? -1 : 1]; }
      const s = sideOf(i), pos = slotPos(i, s);
      return [pos[0], pos[1], s ? -1 : 1];
    }
    function placeTorch() {
      if (carrier >= 0) { const F = figs[carrier]; torchEl.setAttribute('transform', 'translate(' + f2(F.x + 0.8 * F.face) + ' ' + f2(F.y - 1.2) + ')'); }
      else torchEl.setAttribute('transform', 'translate(' + f2(postX(torch)) + ' ' + G + ')');
    }
    function layout() {
      carrier = ready.length ? ready[0] : -1;
      for (let i = 0; i < n; i++) { const h = home(i); place(i, h[0], h[1], h[2]); }
      figs.map((F, i) => i).sort((a, b) => figs[a].y - figs[b].y).forEach((i) => people.appendChild(figs[i].g));
      placeTorch();
      draw();
    }
    function draw() {
      const left = d.limit - time;
      timeTxt.textContent = 'Time ' + time + ' of ' + d.limit + ' min' + (right === full ? ' — all across!' : '');
      life.setAttribute('width', f2(Math.max(0, 12 * left / d.limit)));
      life.classList.toggle('low', left < d.limit * 0.25);
      goTxt.textContent = torch ? '⟵ Cross back' : 'Cross ⟶';
      goBtn.classList.toggle('off', !ready.length || busy);
      goP.disabled = !ready.length || busy;
      figs.forEach((F, i) => { F.g.classList.toggle('aboard', ready.includes(i)); F.g.classList.toggle('far', sideOf(i) !== torch && !ready.includes(i)); });
      ctx.stat('Time', time + ' / ' + d.limit + ' min');
    }
    function walkTo(list, ms, done) {
      const from = list.map((i) => [figs[i].x, figs[i].y]), to = list.map((i) => home(i));
      busy = true;
      tween(clock, ms, (t) => {
        const e = ease(t);
        list.forEach((i, k) => place(i, from[k][0] + (to[k][0] - from[k][0]) * e, from[k][1] + (to[k][1] - from[k][1]) * e - Math.abs(Math.sin(t * Math.PI * 3)) * 0.3, to[k][2]));
        placeTorch();
      }, () => { busy = false; layout(); if (done) done(); });
    }
    function tap(i) {
      if (busy) return;
      const k = ready.indexOf(i);
      if (k >= 0) { ready.splice(k, 1); ctx.sfx('tap'); walkTo([i].concat(ready), 380, () => ctx.changed('ready')); return; }
      if (sideOf(i) !== torch) { ctx.toast('The torch is on the other side.'); return; }
      if (ready.length >= cap) { ctx.toast('The bridge holds only ' + num(cap) + ' at a time.'); ctx.sfx('wrong'); return; }
      ready.push(i);
      ctx.sfx('tap');
      walkTo(ready.slice(), 380, () => ctx.changed('ready'));
    }
    function crossNow(done) {
      if (busy) return;
      if (!ready.length) { ctx.say('Tap one or ' + (cap > 2 ? 'more' : 'two') + ' people on the torch\'s side to send them over.', 'warn'); ctx.sfx('wrong'); return; }
      const tt = Math.max.apply(null, ready.map((i) => d.people[i].t));
      if (time + tt > d.limit) {
        ctx.say('The torch has ' + C.plural(d.limit - time, 'minute') + ' left, and that crossing takes ' + tt + '. Nobody wants to be on that bridge in the dark.', 'warn');
        ctx.sfx('wrong');
        return;
      }
      const group = ready.slice(), from = torch;
      busy = true;
      ctx.sfx('tap');
      const ms = Math.min(3800, 600 + 230 * tt);
      const u0 = group.map((i, k) => readyU(from, k)), u1 = group.map((i, k) => readyU(1 - from, group.length - 1 - k));
      const start = group.map((i) => [figs[i].x, figs[i].y]);
      right ^= group.reduce((m, i) => m | (1 << i), 0);
      torch = 1 - from;
      time += tt;
      ready = [];
      const dest = group.map((i) => home(i));
      carrier = group[0];
      tween(clock, ms, (t) => {
        group.forEach((i, k) => {
          let x, y;
          if (t < 0.82) { const e = t / 0.82, q = bridgePt(u0[k] + (u1[k] - u0[k]) * e); x = q[0]; y = q[1] - Math.abs(Math.sin(e * Math.PI * (4 + tt / 3))) * 0.22; }
          else { const e = ease((t - 0.82) / 0.18), q = bridgePt(u1[k]); x = q[0] + (dest[k][0] - q[0]) * e; y = q[1] + (dest[k][1] - q[1]) * e; }
          if (t === 0) { x = start[k][0]; y = start[k][1]; }
          place(i, x, y, from ? -1 : 1);
        });
        placeTorch();
        draw();
      }, () => {
        busy = false; carrier = -1;
        layout();
        ctx.move();
        if (right === full) ctx.say('Everyone is across with ' + C.plural(d.limit - time, 'minute') + ' of torch to spare.', 'good');
        if (done) done(); else ctx.changed('cross');
      });
    }
    const goP = ctx.h('button.btn.primary', { type: 'button', onclick: () => crossNow() }, 'Cross 🔦');
    ctx.panel.append(goP, ctx.h('div.cx-rules', { html: ctx.md('**Bridge:** ' + num(cap) + ' at a time, with the torch<br>**Pace:** a group walks at its slowest member\'s speed<br>**Torch:** ' + d.limit + ' minutes') }));
    layout();
    ctx.setGoal(p.goal || goalText(d));

    const who = (g) => listText(g.map((i) => d.people[i].n || nameOf(d, i)));
    return {
      check() {
        if (right === full && time <= d.limit) return { solved: true, msg: 'Across in ' + time + ' minutes.' };
        return { solved: false, msg: 'Not everyone is across yet.' };
      },
      hint() {
        if (right === full) return 'Done!';
        const r = fastest(d, { right, boat: torch });
        if (!r) return 'Nobody can move from here.';
        if (time + r.cost > d.limit) return 'From here the quickest finish takes ' + r.cost + ' more minutes, and only ' + (d.limit - time) + ' are left. Undo a crossing or two (Ctrl+Z).';
        const m = r.path[0], tt = Math.max.apply(null, m.group.map((i) => d.people[i].t));
        return {
          text: (torch ? Cap1(who(m.group)) + ' bring' + (m.group.length > 1 ? '' : 's') + ' the torch back' : 'Send ' + who(m.group) + ' across') + ' (' + tt + ' min). The best finish from here takes ' + r.cost + ' of the ' + (d.limit - time) + ' minutes left.',
          show() { m.group.forEach((i) => { const el = figs[i].g; el.classList.add('cx-hint'); setTimeout(() => el.classList.remove('cx-hint'), 2600); }); }
        };
      },
      solve() {
        clock.stop(); busy = false;
        let r = fastest(d, { right, boat: torch });
        if (!r || time + r.cost > d.limit) { right = 0; torch = 0; ready = []; time = 0; layout(); r = fastest(d); }
        let k = 0;
        const next = () => {
          if (k >= r.path.length) { ctx.changed('solve'); return; }
          const m = r.path[k++];
          const out = ready.filter((i) => !m.group.includes(i));
          ready = m.group.slice();
          walkTo(out.concat(ready), 380, () => crossNow(() => clock.later(next, 250)));
        };
        next();
      },
      explain() {
        const r = fastest(d);
        if (!r) return '';
        let tSide = 0;
        const steps = r.path.map((m, i) => { const tt = Math.max.apply(null, m.group.map((j) => d.people[j].t)); const s = (i + 1) + '. ' + (tSide ? who(m.group) + ' back' : who(m.group) + ' over') + ' (' + tt + ')'; tSide = 1 - tSide; return s; });
        const naive = naiveTime(d);
        return 'The best time is ' + r.cost + ' minutes: ' + steps.join(', ') + '.' + (naive != null && naive > r.cost ? ' The obvious plan — the fastest walker escorts everyone and brings the torch back each time — takes ' + naive + '. The trick is to send the two slowest over **together**, so the slow times are paid only once, with a fast walker waiting on the far side to bring the torch back.' : '');
      },
      getState() { return { right, torch, ready: ready.slice(), time }; },
      setState(s) { clock.stop(); busy = false; right = s.right; torch = s.torch; ready = (s.ready || []).slice(); time = s.time || 0; layout(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.key === 'Enter' || ev.key === 'g' || ev.key === 'G') { crossNow(); return true; }
        const k = parseInt(ev.key, 10);
        if (k >= 1 && k <= Math.min(9, n)) { tap(k - 1); return true; }
        return false;
      },
      destroy() { clock.stop(); }
    };
  }

  /* ================= the engine ================= */

  C.engine({
    id: 'crossing',
    name: 'Crossings',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: '**The river.** Tap a character to put them in the boat, tap again to take them out; then press **Row** (or Enter). Characters stay in the boat when it lands, so tap the ones who should get off. Only those who can row can take the boat across, and the rules are checked the moment the boat lands — break one and you will see what happens, then the boat comes back. Keys: 1–9 tap a character, Enter rows.\n\n' +
      '**The bridge.** Tap people on the torch\'s side to step them onto the bridge, then press **Cross**. A group walks at its slowest member\'s pace, and the torch must go with every crossing, so someone has to bring it back. Watch the clock: the torch will not last forever.\n\nHints show the next crossing of a shortest solution from wherever you are.',
    verify,
    generate(rng, level, fam) {
      const bridge = fam && fam.id === 'bridge-torch';
      const v = bridge ? bridgeVariant(rng, level) : riverVariant(rng, level);
      if (!v) return null;
      const d = v.d;
      const out = { title: titleOf(d), text: describe(d), goal: goalText(d), diff: level, data: d };
      if (!bridge) out.par = v.par;
      return out;
    },
    mount(ctx, p) {
      return p.data.mode === 'bridge' ? mountBridge(ctx, p, p.data) : mountRiver(ctx, p, p.data);
    },
    thumb(p) {
      const d = p.data, show = d.people.slice(0, d.mode === 'bridge' ? 5 : 6);
      let x = 0, s = '';
      show.forEach((q, j) => {
        const w = widthOf(q.k), i = d.people.indexOf(q);
        s += '<g transform="translate(' + f2(x + w / 2) + ' 0)">' + figSVG(d, i) + '</g>';
        if (d.mode === 'bridge') s += '<text x="' + f2(x + w / 2) + '" y="1.3" text-anchor="middle" font-size="1" font-weight="800" fill="var(--gold)" font-family="Segoe UI, system-ui, sans-serif">' + q.t + '</text>';
        x += w + 0.1;
      });
      const W = x + 9;
      if (d.mode === 'bridge') {
        return '<svg viewBox="-1 -5 ' + f2(W + 1) + ' 8" preserveAspectRatio="xMidYMid meet"><rect x="-1" y="-5" width="' + f2(W + 1) + '" height="8" fill="#141a38"/>' +
          '<path d="M-1 0H' + f2(x + 0.5) + 'L' + f2(x + 1) + ' 3H-1Z" fill="#4a4660"/><path d="M' + f2(x + 0.5) + ' 0Q' + f2(x + 4.5) + ' 1.6 ' + f2(W - 0.5) + ' 0" stroke="#b08a5a" stroke-width=".3" fill="none"/>' + s +
          '<text x="' + f2(x + 4.5) + '" y="-2.5" text-anchor="middle" font-size="1.5" font-weight="800" fill="#ffcf6a" font-family="Segoe UI, system-ui, sans-serif">' + d.limit + ' min</text></svg>';
      }
      return '<svg viewBox="-1 -4.5 ' + f2(W + 1) + ' 7" preserveAspectRatio="xMidYMid meet"><path d="M-1 0H' + f2(x + 0.4) + 'L' + f2(x + 1) + ' 2.5H-1Z" fill="#5f9a4a"/><rect x="' + f2(x + 0.8) + '" y=".3" width="' + f2(W - x) + '" height="2.2" fill="var(--water)" opacity=".8"/>' +
        '<path d="M' + f2(x + 1.3) + ' .1H' + f2(x + 6.5) + 'Q' + f2(x + 6.3) + ' 1.4 ' + f2(x + 5.4) + ' 1.5H' + f2(x + 2.3) + 'Q' + f2(x + 1.4) + ' 1.4 ' + f2(x + 1.3) + ' .1Z" fill="#a8683a"/>' + s + '</svg>';
    }
  });

  C.crossingSolver = { bfs, fastest, trouble, bankTrouble, movesFrom, describe, goalText, titleOf, eaters, explorers, couples, soldiers, family, THEMES, riverVariant, bridgeVariant, riverLevel, riverScore, bridgeLevel, naiveTime };

  C.css('crossing', `
    .cx-hill { fill: #6fae5a; opacity: .55; }
    [data-theme="light"] .cx-hill { opacity: .45; }
    .cx-bank { fill: #5f9a4a; stroke: #3f6f32; stroke-width: .08; }
    .cx-banklabel { font: 700 .75px "Segoe UI", system-ui, sans-serif; fill: rgba(255,255,255,.55); letter-spacing: .05px; }
    .cx-water { fill: var(--water); opacity: .75; }
    .cx-ripple { stroke: rgba(255,255,255,.45); stroke-width: .12; stroke-linecap: round; stroke-dasharray: .6 .5; animation: cxflow 2.4s linear infinite; }
    @keyframes cxflow { to { stroke-dashoffset: -2.2; } }
    .cx-hull { fill: #a8683a; stroke: #5e3a1c; stroke-width: .1; stroke-linejoin: round; }
    .cx-hull-in { fill: #6e4424; }
    .cx-hull-line { stroke: #d59a64; stroke-width: .1; fill: none; }
    .cx-oar { stroke: #d8b07a; stroke-width: .16; stroke-linecap: round; }
    .cx-fig { cursor: pointer; transition: opacity .3s, filter .3s; }
    .cx-fig .cx-hit { fill: transparent; }
    .cx-fig:hover { filter: brightness(1.12) drop-shadow(0 0 .15px var(--gold)); }
    .cx-fig.far { opacity: .78; }
    .cx-fig.aboard { filter: drop-shadow(0 0 .2px #fff); }
    .cx-fig.cx-hint { filter: drop-shadow(0 0 .35px var(--gold)) drop-shadow(0 0 .35px var(--gold)); }
    .cx-fig.cx-bad > g { animation: cxjump .35s ease-in-out 4; }
    @keyframes cxjump { 50% { transform: translateY(-.7px); } }
    .cx-fig.cx-gone { opacity: .2; }
    .cx-tag { font: 700 .62px "Segoe UI", system-ui, sans-serif; fill: var(--text); paint-order: stroke; stroke: var(--stage); stroke-width: .18px; }
    .cx-norow { font: 600 .5px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .cx-boom { font: 900 1.4px "Segoe UI", system-ui, sans-serif; fill: var(--red); paint-order: stroke; stroke: #fff; stroke-width: .25px; animation: cxpop .4s ease-out; }
    @keyframes cxpop { from { opacity: 0; transform: translateY(.6px); } }
    .cx-btn { cursor: pointer; }
    .cx-btn rect { fill: var(--accent); stroke: rgba(0,0,0,.25); stroke-width: .08; }
    .cx-btn:hover rect { fill: var(--accent-2); }
    .cx-btn text { font: 700 1px "Segoe UI", system-ui, sans-serif; fill: #fff; pointer-events: none; }
    .cx-btn.off { opacity: .35; }
    .cx-rules { font-size: .8rem; color: var(--muted); line-height: 1.5; width: 100%; }
    .cx-night { fill: #141a38; }
    .cx-stars { stroke: #fff; stroke-width: .14; stroke-linecap: round; opacity: .7; }
    .cx-moon { fill: #f4efd6; opacity: .9; }
    .cx-cliff { fill: #4a4660; stroke: #2e2b40; stroke-width: .1; }
    .cx-deck { fill: none; stroke: #7a5a3a; stroke-width: .18; }
    .cx-planks { stroke: #b08a5a; stroke-width: .34; }
    .cx-rope { fill: none; stroke: #c9a878; stroke-width: .08; opacity: .8; }
    .cx-postline { stroke: #7a5a3a; stroke-width: .22; }
    .cx-flame { fill: #ffb347; transform-origin: 0 -1.8px; animation: cxflick .5s ease-in-out infinite alternate; }
    @keyframes cxflick { to { transform: scale(.85, 1.1); fill: #ffd27a; } }
    .cx-time { font: 800 1.05px "Segoe UI", system-ui, sans-serif; fill: #ffe3a0; }
    .cx-lifebg { fill: rgba(255,255,255,.15); }
    .cx-life { fill: #ffb347; transition: width .4s; }
    .cx-life.low { fill: var(--red); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
