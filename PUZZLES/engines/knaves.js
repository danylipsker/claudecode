/* The Puzzle Cabinet · engines/knaves.js
 *
 * The island of knights, who always tell the truth, and knaves, who always
 * lie — and its neighbours: normals and spies who do as they please, larks and
 * owls whose honesty turns with the sun, natives who answer only "da" or "ja".
 * The islanders stand on the beach with their words in speech bubbles; the
 * player marks each one with the tokens under them, then declares.
 *
 * data: {
 *   types:  ['knight', 'knave']            the kinds on this island (see TYPES)
 *   people: ['Ada', 'Bram', ...]            names (looks and jobs come from NAMES)
 *   says:   [{ s: 0, f: formula, t?: 'text' }            s says f
 *            | { s: 1, q: formula, w: 'da'|'ja'|'yes'|'no', t? }]   s answers question q
 *   facts:  [formula, ...]                  things known to be true ("exactly one is a spy")
 *   vars:   [{ id: 'day', name: 'The time', yes: 'Day', no: 'Night', s: 'it is day', ns: 'it is night',
 *              mark: true }]                unknowns beyond the people (mark: false = hidden, not asked)
 *   open:   true                            some islanders cannot be determined: mark them "?"
 *   ask:    { kind: 'entail', q: 'text', choices: [{ t: 'text', f: formula | null }], ans: 1 }
 *         | { kind: 'question', q, to: [0, 1], goal: formula, choices: [{ t, f }], ans }   choose a question
 *   scene:  'doors' | 'sea' | 'fog' | 'night' | 'crowd'        scenery
 *   sol:    ['knight', 'knave', …, 1, …]    the answer (people, then marked vars; '?' = cannot tell)
 * }
 * Formulas (arrays): ['is', i, type] ['not', f] ['and', f, g, …] ['or', …] ['xor', …] ['imp', f, g]
 * ['iff', f, g] ['same', i, j] ['diff', i, j] ['cnt', type, 'all' | [i, …], 'eq'|'ge'|'le', k]
 * ['var', id] ['ans', i, f] (i would answer yes to f) ['T'] ['F'].  People are 0-based indices;
 * in a 'question' ask, 'Y' is the one you ask and 'O' the other one.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the kinds of islander ---------- */

  const TYPES = {
    knight: { label: 'Knight', a: 'a knight', pl: 'knights', truth: 1, color: '#ffd166', key: 'k' },
    knave: { label: 'Knave', a: 'a knave', pl: 'knaves', truth: 0, color: '#ff6b6b', key: 'n' },
    normal: { label: 'Normal', a: 'normal', pl: 'normal', truth: null, color: '#38d9d3', key: 'o' },
    spy: { label: 'Spy', a: 'the spy', pl: 'spies', truth: null, color: '#b388ff', key: 's' },
    lark: { label: 'Lark', a: 'a lark', pl: 'larks', truth: 'day', color: '#ffb057', key: 'l' },
    owl: { label: 'Owl', a: 'an owl', pl: 'owls', truth: 'night', color: '#8f9bff', key: 'w' }
  };

  /* The islanders: the same person looks the same in every puzzle. */
  const NAMES = {
    Ada: ['f', 'the ferry-keeper'], Bram: ['m', 'the baker'], Cleo: ['f', 'the cartographer'], Dex: ['m', 'the pearl diver'],
    Edda: ['f', 'the net-mender'], Finn: ['m', 'the fisherman'], Gus: ['m', 'the goatherd'], Hattie: ['f', 'the hat-maker'],
    Ivo: ['m', 'the ice-cream seller'], Juno: ['f', 'the juggler'], Kit: ['f', 'the kite-flyer'], Lars: ['m', 'the lighthouse keeper'],
    Mona: ['f', 'the mango farmer'], Nils: ['m', 'the nut gatherer'], Olga: ['f', 'the oyster diver'], Pip: ['m', 'the parrot trainer'],
    Quill: ['m', 'the poet'], Rosa: ['f', 'the rope-maker'], Sven: ['m', 'the sailor'], Tilly: ['f', 'the tailor'],
    Ulf: ['m', 'the umbrella mender'], Vera: ['f', 'the vet'], Wren: ['f', 'the weaver'], Xavi: ['m', 'the xylophone player'],
    Yara: ['f', 'the yam grower'], Zed: ['m', 'the zookeeper'], Bea: ['f', 'the beekeeper'], Cato: ['m', 'the cook'],
    Dora: ['f', 'the dancer'], Eli: ['m', 'the engraver'], Flora: ['f', 'the florist'], Hugo: ['m', 'the harbour master'],
    Iris: ['f', 'the innkeeper'], Jonas: ['m', 'the joiner'], Leo: ['m', 'the lamplighter'], Maud: ['f', 'the milliner'],
    Otto: ['m', 'the oarsman'], Pia: ['f', 'the painter'], Remy: ['m', 'the rower'], Suki: ['f', 'the surfer'],
    Tom: ['m', 'the tinker'], Una: ['f', 'the umpire'], Vic: ['m', 'the vintner'], Walt: ['m', 'the whittler'],
    Nell: ['f', 'the net-maker'], Gwen: ['f', 'the glass-blower'], Ravi: ['m', 'the rice farmer'], Kofi: ['m', 'the canoe builder'],
    Epimenides: ['m', 'the Cretan poet'], Ariadne: ['f', 'of Knossos'], Minos: ['m', 'of Knossos']
  };
  const pron = (name) => {
    const g = (NAMES[name] || [])[0];
    return g === 'f' ? { s: 'she', o: 'her', p: 'her' } : g === 'm' ? { s: 'he', o: 'him', p: 'his' } : { s: 'they', o: 'them', p: 'their' };
  };

  /* ---------- the model ---------- */

  // the puzzle's variables: people first (values = type indices), then vars (0/1)
  function model(d) {
    const types = d.types || ['knight', 'knave'];
    const nP = d.people.length;
    const vars = d.vars || [];
    const varIdx = {};
    vars.forEach((v, i) => { varIdx[v.id] = nP + i; });
    const M = { d, types, nP, vars, varIdx, n: nP + vars.length, dayVar: varIdx.day };
    M.dom0 = [];
    for (let i = 0; i < nP; i++) M.dom0.push(types.map((t, k) => k));
    vars.forEach(() => M.dom0.push([0, 1]));
    M.cons = [];
    (d.facts || []).forEach((f, k) => M.cons.push({ kind: 'fact', f, k }));
    (d.says || []).forEach((st, k) => { if (st.f || st.q) M.cons.push({ kind: 'say', s: st.s, f: claimOf(st), st, k }); });
    M.cons.forEach((c) => { c.scope = scopeOf(M, c); });
    M.marked = [];
    for (let i = 0; i < nP; i++) M.marked.push(i);
    vars.forEach((v, i) => { if (v.mark !== false) M.marked.push(nP + i); });
    return M;
  }

  // what an answer amounts to saying
  function claimOf(st) {
    if (!st.q) return st.f;
    if (st.w === 'yes') return st.q;
    if (st.w === 'no') return ['not', st.q];
    if (st.w === 'da') return ['iff', st.q, ['var', 'da']];
    if (st.w === 'ja') return ['iff', st.q, ['not', ['var', 'da']]];
    return st.q;
  }

  function truthOf(M, i, w) {
    const t = TYPES[M.types[w[i]]];
    if (t.truth === 'day') return w[M.dayVar] ? 1 : 0;
    if (t.truth === 'night') return w[M.dayVar] ? 0 : 1;
    return t.truth;
  }
  const timeTypes = (M) => M.types.some((t) => TYPES[t].truth === 'day' || TYPES[t].truth === 'night');

  function ev(M, f, w) {
    switch (f[0]) {
      case 'is': return M.types[w[f[1]]] === f[2];
      case 'not': return !ev(M, f[1], w);
      case 'and': for (let i = 1; i < f.length; i++) if (!ev(M, f[i], w)) return false; return true;
      case 'or': for (let i = 1; i < f.length; i++) if (ev(M, f[i], w)) return true; return false;
      case 'xor': { let n = 0; for (let i = 1; i < f.length; i++) if (ev(M, f[i], w)) n++; return n === 1; }
      case 'imp': return !ev(M, f[1], w) || ev(M, f[2], w);
      case 'iff': return ev(M, f[1], w) === ev(M, f[2], w);
      case 'same': return w[f[1]] === w[f[2]];
      case 'diff': return w[f[1]] !== w[f[2]];
      case 'cnt': {
        const g = f[2] === 'all' ? null : f[2];
        let n = 0;
        if (g) { for (const i of g) if (M.types[w[i]] === f[1]) n++; } else { for (let i = 0; i < M.nP; i++) if (M.types[w[i]] === f[1]) n++; }
        return f[3] === 'eq' ? n === f[4] : f[3] === 'ge' ? n >= f[4] : n <= f[4];
      }
      case 'var': return !!w[M.varIdx[f[1]]];
      case 'ans': { const t = truthOf(M, f[1], w); const v = ev(M, f[2], w); return t == null ? v : (t === 1) === v; }
      case 'T': return true;
      case 'F': return false;
      default: throw new Error('knaves: unknown formula ' + f[0]);
    }
  }

  function refs(M, f, out) {
    switch (f[0]) {
      case 'is': out.add(f[1]); break;
      case 'same': case 'diff': out.add(f[1]); out.add(f[2]); break;
      case 'cnt': (f[2] === 'all' ? M.d.people.map((x, i) => i) : f[2]).forEach((i) => out.add(i)); break;
      case 'var': out.add(M.varIdx[f[1]]); break;
      case 'ans': out.add(f[1]); if (timeTypes(M)) out.add(M.dayVar); refs(M, f[2], out); break;
      default: for (let i = 1; i < f.length; i++) if (Array.isArray(f[i])) refs(M, f[i], out);
    }
    return out;
  }
  function scopeOf(M, c) {
    const s = refs(M, c.f, new Set());
    if (c.kind === 'say') { s.add(c.s); if (timeTypes(M)) s.add(M.dayVar); }
    return Array.from(s).filter((x) => x != null).sort((a, b) => a - b);
  }

  function holds(M, c, w) {
    if (c.kind === 'fact') return ev(M, c.f, w);
    const t = truthOf(M, c.s, w);
    if (t == null) return true;
    return (t === 1) === ev(M, c.f, w);
  }

  // every world (assignment of all variables) in the domains that satisfies everything
  function worlds(M, dom) {
    dom = dom || M.dom0;
    const out = [];
    const w = new Array(M.n).fill(0);
    const rec = (i) => {
      if (i === M.n) {
        for (const c of M.cons) if (!holds(M, c, w)) return;
        out.push(w.slice());
        return;
      }
      for (const v of dom[i]) { w[i] = v; rec(i + 1); }
    };
    rec(0);
    return out;
  }

  // the answer: for each marked variable its value if every world agrees, else '?'
  function analyse(d) {
    const M = model(d);
    const ws = worlds(M);
    const ans = M.marked.map((x) => {
      if (!ws.length) return null;
      const v = ws[0][x];
      if (ws.some((w) => w[x] !== v)) return '?';
      return x < M.nP ? M.types[v] : v;
    });
    return { M, ws, ans };
  }

  // the set of values each variable can take in some world
  function spans(M, ws) {
    const out = [];
    for (let x = 0; x < M.n; x++) out.push(Array.from(new Set(ws.map((w) => w[x]))).sort());
    return out;
  }

  /* ---------- English ---------- */

  const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  function listJoin(a, and) {
    and = and || 'and';
    if (a.length <= 1) return a.join('');
    return a.slice(0, -1).join(', ') + ' ' + and + ' ' + a[a.length - 1];
  }

  // a clause as said by speaker sp (sp = -1: said by nobody in particular)
  function say(M, f, sp, you) {
    const names = M.d.people;
    const who = (i) => i === sp ? 'I' : i === 'Y' || i === you ? 'you' : i === 'O' ? 'the other one' : names[i];
    const be = (i) => i === sp ? 'am' : i === 'Y' || i === you ? 'are' : 'is';
    const T = (t) => TYPES[t];
    const pairSubj = (i, j) => (i === sp ? [who(j), 'I'] : j === sp ? [who(i), 'I'] : j === you ? [who(j), who(i)] : [who(i), who(j)]).join(' and ');
    switch (f[0]) {
      case 'is': return who(f[1]) + ' ' + be(f[1]) + ' ' + T(f[2]).a;
      case 'not':
        if (f[1][0] === 'is') return who(f[1][1]) + ' ' + be(f[1][1]) + ' not ' + T(f[1][2]).a;
        if (f[1][0] === 'var') return varSay(M, f[1][1], false);
        return 'it is not true that ' + say(M, f[1], sp, you);
      case 'same': return pairSubj(f[1], f[2]) + ' are of the same kind';
      case 'diff': return pairSubj(f[1], f[2]) + ' are of different kinds';
      case 'var': return varSay(M, f[1], true);
      case 'T': return 'two and two make four';
      case 'F': return 'two and two make five';
      case 'cnt': {
        const t = T(f[1]), k = f[4];
        const all = f[2] === 'all';
        const grp = all ? null : f[2];
        const n = all ? M.nP : grp.length;
        const op = (f[3] === 'le' && k === 0) || (f[3] === 'ge' && k === n) ? 'eq' : f[3];
        const verb = (m) => m === 1 ? 'is ' + t.a : 'are ' + t.pl;
        if (all) {
          const allSpeak = sp >= 0;
          const of = allSpeak ? 'of us' : 'of them';
          if (op === 'eq' && k === 0) return 'none ' + of + ' is ' + t.a;
          if (op === 'eq' && k === n) return n === 2 ? (allSpeak ? 'we are both ' : 'they are both ') + t.pl : (allSpeak ? 'we are all ' : 'they are all ') + t.pl;
          if (op === 'ge' && k === 1) return 'at least one ' + of + ' is ' + t.a;
          if (op === 'le' && k === n - 1) return 'not all ' + of + ' are ' + t.pl;
          const lead = op === 'eq' ? 'exactly ' : op === 'ge' ? 'at least ' : 'at most ';
          return lead + NUM[k] + ' ' + of + ' ' + verb(k);
        }
        const hasMe = grp.includes(sp);
        const others = grp.filter((i) => i !== sp).map(who);
        if (op === 'eq' && k === 0 && n === 2) {
          if (hasMe) return 'neither ' + others[0] + ' nor I am ' + t.a;
          if (others.includes('you')) return 'neither ' + others.filter((x) => x !== 'you')[0] + ' nor you are ' + t.a;
          return 'neither ' + others[0] + ' nor ' + others[1] + ' is ' + t.a;
        }
        const subjList = hasMe ? listJoin(others.concat(['I'])) : listJoin(others);
        if (op === 'eq' && k === n) return subjList + (n === 2 ? ' are both ' : ' are all ') + t.pl;
        const ofList = hasMe ? listJoin(others.concat(['me'])) : listJoin(others);
        if (op === 'eq' && k === 0) return 'none of ' + ofList + ' is ' + t.a;
        const lead = op === 'eq' ? 'exactly ' : op === 'ge' ? 'at least ' : 'at most ';
        return lead + NUM[k] + ' of ' + ofList + ' ' + verb(k);
      }
      case 'and': {
        const a = f.slice(1);
        if (a.length === 2 && a[0][0] === 'is' && a[1][0] === 'is' && a[0][2] === a[1][2]) return pairSubj(a[0][1], a[1][1]) + ' are both ' + T(a[0][2]).pl;
        return listJoin(a.map((g) => say(M, g, sp, you)));
      }
      case 'or': return 'either ' + listJoin(f.slice(1).map((g) => say(M, g, sp, you)), 'or');
      case 'xor': return 'either ' + listJoin(f.slice(1).map((g) => say(M, g, sp, you)), 'or') + ', but not both';
      case 'imp': return 'if ' + say(M, f[1], sp, you) + ', then ' + say(M, f[2], sp, you);
      case 'iff': return say(M, f[1], sp, you) + ' if and only if ' + say(M, f[2], sp, you);
      case 'ans': {
        const i = f[1];
        if (i === sp) return 'I would tell you that ' + say(M, f[2], sp, you);
        return who(i) + ' would tell you that ' + say(M, f[2], sp, you);
      }
      default: return '…';
    }
  }
  function varSay(M, id, yes) {
    const v = M.vars.find((x) => x.id === id);
    if (!v) return id;
    return yes ? v.s : v.ns;
  }

  // a question put to person `to` ("Are you a knight?")
  function ask(M, f, to) {
    const names = M.d.people;
    const who = (i) => i === to ? 'you' : names[i];
    const T = (t) => TYPES[t];
    switch (f[0]) {
      case 'is': return f[1] === to ? 'Are you ' + T(f[2]).a + '?' : 'Is ' + who(f[1]) + ' ' + T(f[2]).a + '?';
      case 'same': {
        const [i, j] = f[1] === to ? [f[1], f[2]] : f[2] === to ? [f[2], f[1]] : [f[1], f[2]];
        return 'Are ' + who(i) + ' and ' + who(j) + ' of the same kind?';
      }
      case 'cnt':
        if (f[2] === 'all') {
          const k = f[4], t = T(f[1]);
          if ((f[3] === 'eq' || f[3] === 'ge') && k === M.nP) return 'Are you all ' + t.pl + '?';
          if ((f[3] === 'eq' || f[3] === 'le') && k === 0) return 'Is none of you ' + t.a + '?';
          const lead = f[3] === 'eq' ? 'exactly ' : f[3] === 'ge' ? 'at least ' : 'at most ';
          return (k === 1 ? 'Is ' + lead + 'one of you ' + t.a : 'Are ' + lead + NUM[k] + ' of you ' + t.pl) + '?';
        } else {
          const k = f[4], t = T(f[1]), g = f[2];
          const list = listJoin(g.filter((i) => i === to).map(() => 'you').concat(g.filter((i) => i !== to).map(who)));
          if (f[3] === 'eq' && k === g.length) return 'Are ' + list + (g.length === 2 ? ' both ' : ' all ') + t.pl + '?';
          if (f[3] === 'eq' && k === 0) break;
          const lead = f[3] === 'eq' ? 'exactly ' : f[3] === 'ge' ? 'at least ' : 'at most ';
          return (k === 1 ? 'Is ' + lead + 'one of ' + list + ' ' + t.a : 'Are ' + lead + NUM[k] + ' of ' + list + ' ' + t.pl) + '?';
        }
        break;
      case 'and':
        if (f.length === 3 && f[1][0] === 'is' && f[2][0] === 'is' && f[1][2] === f[2][2]) {
          const [i, j] = f[2][1] === to ? [f[2][1], f[1][1]] : [f[1][1], f[2][1]];
          return 'Are ' + who(i) + ' and ' + who(j) + ' both ' + T(f[1][2]).pl + '?';
        }
        break;
      case 'var': { const v = M.vars.find((x) => x.id === f[1]); if (v && v.q) return v.q; break; }
      case 'T': return 'Do two and two make four?';
      default:
    }
    return 'Is it true that ' + say(M, f, -1, to) + '?';
  }

  // the words in a statement's bubble
  function stText(M, st) {
    if (st.t) return st.t;
    const name = M.d.people[st.s];
    if (st.q) {
      const ans = st.w === 'da' ? 'Da.' : st.w === 'ja' ? 'Ja.' : st.w === 'yes' ? 'Yes.' : 'No.';
      return 'You ask: “' + ask(M, st.q, st.s) + '”\n' + name + ': “' + ans + '”';
    }
    return '“' + cap(say(M, st.f, st.s)) + '.”';
  }
  // the same words, flattened for a sentence
  function stQuote(M, st) {
    if (st.q && !st.t) return 'the answer “' + st.w + '” to “' + ask(M, st.q, st.s) + '”';
    if (!st.t) return '“' + cap(say(M, st.f, st.s)) + '”';
    return stText(M, st).replace(/\n/g, ' ').replace(/[.!]”$/, '”');
  }

  /* ---------- reasoning: the deductions behind the hints ---------- */

  // generalised arc consistency on one constraint: which values of its variables keep some support
  function gac(M, c, dom) {
    const S = c.scope;
    const sup = S.map(() => new Set());
    const w = new Array(M.n).fill(0);
    const rec = (k) => {
      if (k === S.length) { if (holds(M, c, w)) S.forEach((x, j) => sup[j].add(w[x])); return; }
      for (const v of dom[S[k]]) { w[S[k]] = v; rec(k + 1); }
    };
    rec(0);
    const out = [];
    S.forEach((x, j) => {
      const keep = dom[x].filter((v) => sup[j].has(v));
      if (keep.length < dom[x].length) out.push({ c, x, keep, gone: dom[x].filter((v) => !sup[j].has(v)) });
    });
    return out;
  }

  // apply every constraint until nothing changes; steps (if given) records each change with the domains before it
  function propagate(M, dom, steps, limit) {
    dom = dom.map((a) => a.slice());
    let changed = true, guard = 0;
    while (changed && guard++ < 50) {
      changed = false;
      for (const c of M.cons) {
        const r = gac(M, c, dom);
        if (!r.length) continue;
        for (const e of r) {
          if (steps) steps.push(Object.assign({ before: dom.map((a) => a.slice()) }, e));
          if (!e.keep.length) return { dom, fail: e };
          dom[e.x] = e.keep;
          changed = true;
          if (limit && steps && steps.length > limit) return { dom, fail: null, long: true };
        }
      }
    }
    return { dom, fail: null };
  }

  // the truth values the claim of c can take within the domains (with some variables fixed)
  function claimVals(M, c, dom, fix) {
    const S = c.scope;
    const w = new Array(M.n).fill(0);
    let T = false, F = false;
    const rec = (k) => {
      if (T && F) return;
      if (k === S.length) { if (ev(M, c.f, w)) T = true; else F = true; return; }
      const x = S[k];
      const vals = fix && fix[x] != null ? [fix[x]] : dom[x];
      for (const v of vals) { w[x] = v; rec(k + 1); }
    };
    rec(0);
    return { T, F };
  }

  function words(M) {
    const names = M.d.people;
    const W = {};
    W.name = (x) => x < M.nP ? names[x] : (M.vars[x - M.nP].name || M.vars[x - M.nP].id);
    W.poss = (x) => x < M.nP ? names[x] + '’s' : 'its';
    W.a = (x, v) => x < M.nP ? TYPES[M.types[v]].a : (v ? M.vars[x - M.nP].s : M.vars[x - M.nP].ns);
    W.is = (x, v) => x < M.nP ? names[x] + ' is ' + TYPES[M.types[v]].a : (v ? M.vars[x - M.nP].s : M.vars[x - M.nP].ns);
    W.isnt = (x, v) => x < M.nP ? names[x] + ' is not ' + TYPES[M.types[v]].a : (v ? M.vars[x - M.nP].ns : M.vars[x - M.nP].s);
    W.were = (x, v) => x < M.nP ? 'if ' + names[x] + ' were ' + TYPES[M.types[v]].a : 'if ' + (v ? M.vars[x - M.nP].s : M.vars[x - M.nP].ns);
    W.would = (x, v) => x < M.nP ? names[x] + ' would be ' + TYPES[M.types[v]].a : wouldify(v ? M.vars[x - M.nP].s : M.vars[x - M.nP].ns);
    W.concl = (x, keep, gone) => keep.length === 1 ? W.is(x, keep[0]) : gone.length === 1 ? W.isnt(x, gone[0]) : names[x] + ' is ' + keep.map((v) => W.a(x, v)).join(' or ');
    W.quote = (c) => c.kind === 'fact' ? factText(M, c.f) : stQuote(M, c.st);
    W.words = (c) => c.kind === 'fact' ? factText(M, c.f) : c.st.q && !c.st.t ? names[c.s] + '’s answer “' + c.st.w + '” to “' + ask(M, c.st.q, c.s) + '”' : names[c.s] + '’s words ' + stQuote(M, c.st);
    W.fact = (c) => factText(M, c.f);
    return W;
  }
  function wouldify(s) {
    if (/^(it|there) is /.test(s)) return s.replace(/^(it|there) is /, '$1 would be ');
    if (/ means /.test(s)) return s.replace(/ means /, ' would mean ');
    if (/ is /.test(s)) return s.replace(/ is /, ' would be ');
    return s;
  }
  function factText(M, f) {
    if (M.d.factText && M.d.factText[M.d.facts.indexOf(f)]) return M.d.factText[M.d.facts.indexOf(f)];
    return say(M, f, -1);
  }
  const decided = (dom, x) => dom[x].length === 1;
  const fsize = (f) => Array.isArray(f) ? 1 + f.slice(1).reduce((s, g) => s + (Array.isArray(g) && typeof g[0] === 'string' ? fsize(g) : 0), 0) : 0;
  function truthKnown(M, s, dom) {
    if (!decided(dom, s)) return null;
    const t = TYPES[M.types[dom[s][0]]].truth;
    if (t === 'day' || t === 'night') {
      if (!decided(dom, M.dayVar)) return null;
      return (t === 'day') === !!dom[M.dayVar][0] ? 1 : 0;
    }
    return t;
  }

  // one step explained: constraint c took values `gone` away from variable x
  function explainStep(M, e, W) {
    const { c, x, gone, keep, before } = e;
    const who = c.kind === 'say' ? M.d.people[c.s] : null;
    const qa = c.kind === 'say' && !!c.st.q && !c.st.t;
    const wd = c.kind === 'say' ? W.words(c) : '';
    const tv = (v) => qa ? (v ? 'honest' : 'a lie') : (v ? 'true' : 'false');
    const they = qa ? 'it' : 'they';
    const ifs = cap(gone.map((v) => W.were(x, v)).join(', or '));
    let s = '';
    if (c.kind === 'fact') {
      s = 'We know that ' + W.fact(c) + '. ' + ifs + ', that could not be.';
    } else if (x === c.s) {
      const parts = gone.map((v) => {
        const t = TYPES[M.types[v]].truth;
        const cv = claimVals(M, c, before, { [x]: v });
        if (t === 1) return cap(W.were(x, v)) + ', ' + wd + ' would be ' + tv(true) + ' — but with ' + who + ' ' + W.a(x, v) + ' ' + they + ' would be ' + tv(false) + (cv.T ? '' : whatever(M, c, before, x)) + '.';
        if (t === 0) return cap(W.were(x, v)) + ', ' + wd + ' would be a lie — but with ' + who + ' ' + W.a(x, v) + ' ' + they + ' would be ' + (qa ? 'honest' : 'true') + (cv.F ? '' : whatever(M, c, before, x)) + '.';
        return cap(W.were(x, v)) + ', ' + wd + ' could not match the way ' + TYPES[M.types[v]].pl + ' speak.';
      });
      s = parts.join(' ');
    } else {
      const t = truthKnown(M, c.s, before);
      if (t === 1 || t === 0) {
        s = who + ' is ' + W.a(c.s, before[c.s][0]) + (M.dayVar != null && timeTypes(M) ? ' and ' + W.is(M.dayVar, before[M.dayVar][0]) : '') + ', so ' +
          (qa ? pron(who).p + ' answer “' + c.st.w + '” is ' + tv(t) : W.quote(c) + ' is ' + tv(t)) + '. ' + ifs + ', it would be ' + tv(!t) + '.';
      } else if (timeTypes(M) || before[c.s].some((u) => TYPES[M.types[u]].truth == null)) {
        s = ifs + ', nothing would fit ' + wd + ', whatever the rest are.';
      } else {
        const us = before[c.s].map((u) => {
          const tu = TYPES[M.types[u]].truth;
          return TYPES[M.types[u]].a + (tu === 1 ? ' (' + (qa ? 'the answer' : 'the words') + ' would be ' + tv(false) + ')' : tu === 0 ? ' (' + they + ' would be ' + (qa ? 'honest' : 'true') + ')' : '');
        });
        s = ifs + ', ' + who + ' could be neither ' + us.join(' nor ') + ': nothing would fit ' + wd + '.';
      }
    }
    return s;
  }
  function whatever(M, c, before, x) {
    const others = c.scope.filter((y) => y !== x && y < M.nP && !decided(before, y));
    return others.length ? ', whatever ' + listJoin(others.map((y) => M.d.people[y])) + (others.length > 1 ? ' are' : ' is') : '';
  }

  // a short line for a step inside a "suppose" chain
  function chainLine(M, e, W) {
    const { c, x, keep, gone, before } = e;
    const res = keep.length === 1 ? W.would(x, keep[0]) : W.isnt(x, gone[0]).replace(' is not ', ' would not be ');
    if (c.kind === 'fact') return 'Then, since ' + W.fact(c) + ', ' + res + '.';
    const who = M.d.people[c.s];
    const qa = !!c.st.q && !c.st.t;
    if (x === c.s) {
      const cv = claimVals(M, c, before, null);
      if (cv.T !== cv.F) return 'Then ' + (qa ? W.words(c) + ' would be ' + (cv.T ? 'honest' : 'a lie') : W.quote(c) + ' would be ' + (cv.T ? 'true' : 'false')) + ', so ' + res + '.';
      return 'Then, by ' + who + '’s ' + (qa ? 'answer' : 'words') + ', ' + res + '.';
    }
    const t = truthKnown(M, c.s, before);
    if (t === 1) return 'Then ' + who + ' tells the truth, so ' + res + '.';
    if (t === 0) return 'Then ' + who + ' is lying, so ' + res + '.';
    return 'Then, by ' + who + '’s ' + (qa ? 'answer' : 'words') + ', ' + res + '.';
  }
  function failLine(M, e, W) {
    const { c, before } = e;
    if (c.kind === 'fact') return 'But then it could not be that ' + W.fact(c) + ' — a contradiction.';
    const who = M.d.people[c.s];
    const qa = !!c.st.q && !c.st.t;
    const t = truthKnown(M, c.s, before);
    const cv = claimVals(M, c, before, null);
    if ((t === 1 || t === 0) && cv.T !== cv.F) {
      if (qa) return 'But then ' + who + '’s answer “' + c.st.w + '” would have to be ' + (t ? 'honest' : 'a lie') + ', and it would not be — a contradiction.';
      return 'But then ' + who + ' would be ' + (t ? 'telling the truth' : 'lying') + ' while ' + W.quote(c) + ' is ' + (cv.T ? 'true' : 'false') + ' — a contradiction.';
    }
    return 'But then nothing fits ' + W.words(c) + ' — a contradiction.';
  }

  // the easiest next deduction from the domains dom: { x, keep, gone, text, cons: [statement indices], people: [...] }
  function nextStep(M, dom, opts) {
    opts = opts || {};
    const W = words(M);
    const want = (x) => !decided(dom, x);
    // 1. one statement on its own
    let best = null;
    for (const c of M.cons) {
      for (const e of gac(M, c, dom)) {
        if (!want(e.x) || !e.keep.length) continue;
        const unk = c.scope.filter((y) => !decided(dom, y)).length;
        let score = unk + (e.keep.length === 1 ? 0 : 3) + (e.x < M.nP ? 0 : 0.5) + (M.marked.includes(e.x) ? 0 : 4);
        if (c.kind === 'say' && e.x !== c.s && truthKnown(M, c.s, dom) != null) score -= 1;
        if (!best || score < best.score) best = Object.assign({ score, kind: 'direct' }, e, { before: dom.map((a) => a.slice()) });
      }
    }
    if (best && best.score < 8) {
      const unk = best.c.scope.filter((y) => !decided(dom, y)).length;
      return {
        kind: 'direct', x: best.x, keep: best.keep, gone: best.gone, cost: 0.6 + 0.45 * Math.max(0, unk - 1) + 0.12 * Math.max(0, fsize(best.c.f) - 1) + (best.keep.length > 1 ? 0.5 : 0),
        text: explainStep(M, best, W) + ' So ' + W.concl(best.x, best.keep, best.gone) + '.',
        cons: [best.c], people: best.c.scope.filter((y) => y < M.nP)
      };
    }
    // 2. suppose something and follow it to a contradiction
    let sup = null;
    const order = M.marked.concat(dom.map((a, i) => i).filter((i) => !M.marked.includes(i)));
    for (const x of order) {
      if (!want(x)) continue;
      for (const v of dom[x]) {
        const d2 = dom.map((a) => a.slice());
        d2[x] = [v];
        const steps = [];
        const r = propagate(M, d2, steps, sup ? sup.steps.length : 14);
        if (!r.fail) continue;
        if (!sup || steps.length < sup.steps.length) sup = { x, v, steps };
      }
    }
    if (sup) {
      const keep = dom[sup.x].filter((v) => v !== sup.v);
      const lines = sup.steps.slice(0, -1).map((e) => chainLine(M, e, W));
      const shown = lines.length > 5 ? lines.slice(0, 2).concat(['…and following the statements on, one after another…'], lines.slice(-2)) : lines;
      const text = 'Suppose ' + (sup.x < M.nP ? M.d.people[sup.x] + ' were ' + W.a(sup.x, sup.v) : W.is(sup.x, sup.v)) + '. ' + shown.join(' ') + (shown.length ? ' ' : '') +
        failLine(M, sup.steps[sup.steps.length - 1], W) + ' So ' + W.concl(sup.x, keep, [sup.v]) + '.';
      const cons = Array.from(new Set(sup.steps.map((e) => e.c)));
      const people = Array.from(new Set([].concat.apply([sup.x < M.nP ? [sup.x] : []], cons.map((c) => c.scope.filter((y) => y < M.nP)))));
      return { kind: 'suppose', x: sup.x, keep, gone: [sup.v], cost: 3 + sup.steps.length * 0.8, text, cons, people };
    }
    // 3. both ways: whatever x is, y comes out the same
    let split = null;
    for (const x of order) {
      if (!want(x)) continue;
      const branches = [];
      for (const v of dom[x]) {
        const d2 = dom.map((a) => a.slice());
        d2[x] = [v];
        const steps = [];
        const r = propagate(M, d2, steps, 16);
        if (!r.fail && !r.long) branches.push({ v, dom: r.dom, steps });
      }
      if (branches.length < 2 || branches.length !== dom[x].length) continue;
      for (const y of order) {
        if (y === x || !want(y)) continue;
        const union = new Set();
        branches.forEach((b) => b.dom[y].forEach((u) => union.add(u)));
        if (union.size >= dom[y].length) continue;
        const len = branches.reduce((s, b) => s + b.steps.length, 0);
        const score = len + (union.size === 1 ? 0 : 4) + (M.marked.includes(y) ? 0 : 6);
        if (!split || score < split.score) split = { x, y, keep: Array.from(union).sort(), branches, score };
      }
    }
    if (split) {
      const { x, y, keep, branches } = split;
      const gone = dom[y].filter((u) => !keep.includes(u));
      const res = W.concl(y, keep, gone);
      const parts = branches.map((b) => {
        // the steps up to the one that settles y
        let upto = b.steps.findIndex((e) => e.x === y && e.keep.every((u) => keep.includes(u)));
        if (upto < 0) upto = b.steps.length - 1;
        const lines = b.steps.slice(0, upto + 1).map((e) => chainLine(M, e, W));
        const shown = lines.length > 4 ? lines.slice(0, 1).concat(['…'], lines.slice(-2)) : lines;
        return cap(x < M.nP ? W.were(x, b.v) : 'if ' + W.is(x, b.v)).replace(/^If /, 'If ') + ': ' + shown.join(' ').replace(/^Then,? /, '').replace(/^by /, 'by ');
      });
      const text = (x < M.nP ? M.d.people[x] + ' is ' + dom[x].map((v) => W.a(x, v)).join(' or ') + '. ' : 'Either ' + dom[x].map((v) => W.is(x, v)).join(' or ') + '. ') +
        parts.join(' ') + ' Either way, ' + res + '.';
      const cons = Array.from(new Set([].concat.apply([], branches.map((b) => b.steps.map((e) => e.c)))));
      const people = Array.from(new Set([y].concat(x < M.nP ? [x] : [], [].concat.apply([], cons.map((c) => c.scope))))).filter((z) => z < M.nP);
      return { kind: 'split', x: y, keep, gone, cost: 4 + split.score * 0.6, text, cons, people };
    }
    // 4. only a longer search settles it
    const ws = worlds(M, dom);
    if (!ws.length) return null;
    const sp = spans(M, ws);
    const x = order.find((y) => want(y) && sp[y].length < dom[y].length);
    if (x == null) return null;
    return {
      kind: 'search', x, keep: sp[x], gone: dom[x].filter((v) => !sp[x].includes(v)), cost: 10,
      text: 'This one needs patience: try each possibility for ' + W.name(x) + ' in turn and follow every statement to the end. Only ' + (sp[x].length === 1 ? (x < M.nP ? W.a(x, sp[x][0]) : W.is(x, sp[x][0])) : sp[x].map((v) => W.a(x, v)).join(' or ')) + ' survives.',
      cons: [], people: x < M.nP ? [x] : []
    };
  }

  // how hard is it? follow the easiest deductions from nothing to the answer
  function grade(d) {
    const M = model(d);
    let dom = M.dom0.map((a) => a.slice());
    const ws = worlds(M);
    const sp = spans(M, ws);
    const target = (x) => sp[x].length === 1;
    let cost = 0, n = 0, supposes = 0, searches = 0, maxChain = 0;
    const done = () => M.marked.every((x) => !target(x) || decided(dom, x));
    while (!done() && n < 40) {
      const st = nextStep(M, dom);
      if (!st) break;
      dom[st.x] = st.keep;
      cost += st.cost;
      n++;
      if (st.kind === 'suppose' || st.kind === 'split') { supposes++; maxChain = Math.max(maxChain, st.cost); }
      if (st.kind === 'search') searches++;
    }
    return { cost, steps: n, supposes, searches, maxChain, ok: done() };
  }

  // the whole chain of reasoning, for the explanation after solving
  function reasoning(d, max) {
    const M = model(d);
    let dom = M.dom0.map((a) => a.slice());
    const sp = spans(M, worlds(M));
    const lines = [];
    const done = () => M.marked.every((x) => sp[x].length > 1 || decided(dom, x));
    while (!done() && lines.length < (max || 12)) {
      const st = nextStep(M, dom);
      if (!st) break;
      dom[st.x] = st.keep;
      lines.push(st.text);
    }
    return lines;
  }

  // the choices of an 'ask' puzzle: which of them are right
  function substYO(f, Y, O) {
    return f.map((g) => Array.isArray(g) ? substYO(g, Y, O) : g === 'Y' ? Y : g === 'O' ? O : g);
  }
  function choiceResults(d) {
    const a = d.ask;
    const { M, ws } = analyse(d);
    if (a.kind === 'question') {
      return a.choices.map((ch) => a.to.every((t) => {
        const o = a.to.find((u) => u !== t);
        const q = substYO(ch.f, t, o), goal = substYO(a.goal, t, o);
        const seen = {};
        for (const w of ws) {
          const tr = truthOf(M, t, w);
          if (tr == null) return false;
          const yes = (tr === 1) === ev(M, q, w);
          const g = ev(M, goal, w);
          if (seen[yes] != null && seen[yes] !== g) return false;
          seen[yes] = g;
        }
        return ws.length > 0;
      }));
    }
    const ent = a.choices.map((ch) => ch.f ? ws.length > 0 && ws.every((w) => ev(M, ch.f, w)) : null);
    const any = ent.some((e) => e === true);
    return a.choices.map((ch, i) => ch.f ? ent[i] : !any);
  }

  /* ---------- drawing the islanders ---------- */

  function lookOf(name) {
    const r = C.rng('islander:' + name);
    const g = (NAMES[name] || ['n'])[0];
    return {
      skin: r.pick(['#f3cfb0', '#e3b08a', '#c98b62', '#a06a47', '#74492f']),
      hair: r.pick(['#2b1d14', '#5a3a22', '#a0642d', '#d9b36a', '#9a9aa6', '#c2552c', '#1d1d2c']),
      style: g === 'f' ? r.pick(['long', 'bun', 'bob', 'curly', 'braid']) : r.pick(['short', 'curly', 'bald', 'short', 'mop']),
      hat: r.pick(['none', 'none', 'straw', 'cap', 'beret', 'scarf', 'flower', 'bandana', 'top']),
      shirt: r.pick(['#4ecb8d', '#6c7bff', '#ff7eb6', '#ffb057', '#38d9d3', '#b388ff', '#ff6b6b', '#e8d9b0', '#5fb3ff']),
      stripes: r() < 0.3,
      extra: g === 'm' ? r.pick(['none', 'beard', 'moustache', 'glasses', 'none']) : r.pick(['none', 'glasses', 'earring', 'none', 'freckles']),
      legs: r.pick(['#3b4a6b', '#5b4636', '#2f5d50', '#6b3b4a', '#44405a']),
      tilt: (r() - 0.5) * 6
    };
  }

  // an islander as SVG markup, feet at (0, 0); mark = a type id, '?' or null
  function islanderSVG(name, mark, opts) {
    opts = opts || {};
    const L = lookOf(name);
    const dark = '#2a2230';
    let s = '<ellipse cx="0" cy="2" rx="34" ry="6" fill="rgba(0,0,0,.18)"/>';
    // legs and shoes
    s += '<path d="M-15 -46h11v44h-11zM4 -46h11v44H4z" fill="' + L.legs + '"/>';
    s += '<ellipse cx="-10" cy="-1" rx="10" ry="4.5" fill="' + dark + '"/><ellipse cx="10" cy="-1" rx="10" ry="4.5" fill="' + dark + '"/>';
    // long hair falls behind the body
    if (L.style === 'long' || L.style === 'braid') s += '<path d="M-24 -128Q-27 -104 -22 -90H22Q27 -104 24 -128Z" fill="' + L.hair + '"/>';
    // arms
    s += '<path d="M-24 -96Q-38 -74 -33 -52M24 -96Q38 -74 33 -52" fill="none" stroke="' + L.shirt + '" stroke-width="11" stroke-linecap="round"/>';
    s += '<circle cx="-33" cy="-49" r="6" fill="' + L.skin + '"/><circle cx="33" cy="-49" r="6" fill="' + L.skin + '"/>';
    // body
    s += '<path class="kn-body"' + (opts.key ? ' data-key="' + opts.key + '"' : '') + ' d="M-27 -93Q-28 -103 -17 -104H17Q28 -103 27 -93L24 -42Q0 -37 -24 -42Z" fill="' + L.shirt + '"/>';
    if (L.stripes) s += '<path d="M-26 -88H26M-25 -76H25M-25 -64H25M-24 -52H24" stroke="rgba(255,255,255,.4)" stroke-width="4" pointer-events="none"/>';
    // neck and head
    s += '<rect x="-6" y="-110" width="12" height="9" fill="' + L.skin + '"/>';
    s += '<g transform="rotate(' + L.tilt.toFixed(1) + ' 0 -110)">';
    s += '<circle cx="0" cy="-126" r="20" fill="' + L.skin + '"/>';
    // hair
    const H = L.hair;
    if (L.style === 'short' || L.style === 'braid') s += '<path d="M-20 -128Q-22 -148 0 -148Q22 -148 20 -128Q14 -139 0 -139Q-14 -139 -20 -128Z" fill="' + H + '"/>';
    if (L.style === 'mop') s += '<path d="M-22 -122Q-26 -152 0 -151Q26 -152 22 -122Q18 -136 8 -138Q0 -132 -8 -138Q-18 -136 -22 -122Z" fill="' + H + '"/>';
    if (L.style === 'long') s += '<path d="M-21 -120Q-24 -150 0 -149Q24 -150 21 -120Q18 -140 0 -140Q-18 -140 -21 -120Z" fill="' + H + '"/>';
    if (L.style === 'bob') s += '<path d="M-23 -112Q-27 -150 0 -149Q27 -150 23 -112L17 -112Q18 -136 0 -139Q-18 -136 -17 -112Z" fill="' + H + '"/>';
    if (L.style === 'bun') s += '<path d="M-20 -126Q-22 -148 0 -148Q22 -148 20 -126Q14 -139 0 -139Q-14 -139 -20 -126Z" fill="' + H + '"/><circle cx="0" cy="-151" r="8" fill="' + H + '"/>';
    if (L.style === 'curly') { for (let k = 0; k < 7; k++) { const a = Math.PI * (1.05 + k * 0.15); s += '<circle cx="' + (Math.cos(a) * 19).toFixed(1) + '" cy="' + (-128 + Math.sin(a) * 19).toFixed(1) + '" r="7" fill="' + H + '"/>'; } }
    if (L.style === 'bald') s += '<path d="M-20 -122q-3 -6 1 -10M20 -122q3 -6 -1 -10" stroke="' + H + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    if (L.style === 'braid') s += '<path d="M17 -126Q27 -110 24 -92" stroke="' + H + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="5 2"/>';
    // face
    s += '<circle cx="-7" cy="-127" r="2.3" fill="' + dark + '"/><circle cx="7" cy="-127" r="2.3" fill="' + dark + '"/>';
    s += '<path d="M-7 -116Q0 -110 7 -116" fill="none" stroke="' + dark + '" stroke-width="2" stroke-linecap="round"/>';
    s += '<circle cx="-12" cy="-119" r="3.2" fill="rgba(255,120,120,.28)"/><circle cx="12" cy="-119" r="3.2" fill="rgba(255,120,120,.28)"/>';
    if (L.extra === 'glasses') s += '<g fill="none" stroke="' + dark + '" stroke-width="1.6"><circle cx="-7" cy="-127" r="5.5"/><circle cx="7" cy="-127" r="5.5"/><path d="M-1.5 -127h3"/></g>';
    if (L.extra === 'beard') s += '<path d="M-19 -124Q-18 -100 0 -100Q18 -100 19 -124Q14 -112 0 -113Q-14 -112 -19 -124Z" fill="' + H + '"/><path d="M-6 -115Q0 -112 6 -115" fill="none" stroke="' + dark + '" stroke-width="1.6"/>';
    if (L.extra === 'moustache') s += '<path d="M-9 -118Q-4 -122 0 -119Q4 -122 9 -118Q4 -116 0 -118Q-4 -116 -9 -118Z" fill="' + H + '"/>';
    if (L.extra === 'earring') s += '<circle cx="-20" cy="-117" r="2.4" fill="#ffd166"/>';
    if (L.extra === 'freckles') s += '<g fill="rgba(120,70,40,.55)"><circle cx="-11" cy="-121" r=".9"/><circle cx="-13" cy="-118" r=".9"/><circle cx="11" cy="-121" r=".9"/><circle cx="13" cy="-118" r=".9"/></g>';
    // the knave's mask (only when marked so)
    if (mark === 'knave') s += '<path d="M-19 -131Q0 -135 19 -131Q20 -122 12 -121Q7 -125 0 -122Q-7 -125 -12 -121Q-20 -122 -19 -131Z" fill="#1d1d24"/><circle cx="-7" cy="-127" r="2" fill="#fff"/><circle cx="7" cy="-127" r="2" fill="#fff"/>';
    if (mark === 'spy') s += '<path d="M-15 -130h12v6a6 6 0 01-12 0zM3 -130h12v6a6 6 0 01-12 0zM-3 -129h6" fill="#1d1d24" stroke="#1d1d24" stroke-width="1.5"/>';
    // hats
    if (L.hat === 'straw') s += '<ellipse cx="0" cy="-141" rx="31" ry="6" fill="#e3c170"/><path d="M-15 -141Q-15 -160 0 -160Q15 -160 15 -141Z" fill="#e8c878"/><path d="M-15 -145h30" stroke="#c0392b" stroke-width="3"/>';
    if (L.hat === 'cap') s += '<path d="M-20 -137Q-20 -157 0 -157Q20 -157 20 -137Z" fill="#3d5a99"/><path d="M4 -138Q22 -140 30 -135Q18 -133 4 -134Z" fill="#2c4278"/>';
    if (L.hat === 'beret') s += '<ellipse cx="3" cy="-145" rx="22" ry="8" fill="#b23a48" transform="rotate(-8 3 -145)"/><circle cx="4" cy="-153" r="2.5" fill="#b23a48"/>';
    if (L.hat === 'scarf') s += '<path d="M-22 -126Q-24 -152 0 -152Q24 -152 22 -126Q14 -144 0 -144Q-14 -144 -22 -126Z" fill="#e0703a"/><circle cx="-2" cy="-148" r="1.6" fill="#fff"/><circle cx="7" cy="-146" r="1.6" fill="#fff"/><circle cx="-10" cy="-145" r="1.6" fill="#fff"/>';
    if (L.hat === 'flower') s += '<g transform="translate(-15 -142)"><circle r="4" cx="0" cy="-4" fill="#ff7eb6"/><circle r="4" cx="4" cy="0" fill="#ff7eb6"/><circle r="4" cx="0" cy="4" fill="#ff7eb6"/><circle r="4" cx="-4" cy="0" fill="#ff7eb6"/><circle r="2.6" fill="#ffd166"/></g>';
    if (L.hat === 'bandana') s += '<path d="M-20 -134Q0 -142 20 -134L20 -140Q0 -150 -20 -140Z" fill="#c0392b"/><path d="M19 -137l9 5-3 -8z" fill="#c0392b"/>';
    if (L.hat === 'top') s += '<rect x="-14" y="-172" width="28" height="30" rx="2" fill="#26222e"/><ellipse cx="0" cy="-142" rx="23" ry="4.5" fill="#26222e"/><path d="M-14 -149h28" stroke="#c9a227" stroke-width="3"/>';
    s += '</g>';
    // the badge on the chest
    if (mark) {
      const t = TYPES[mark];
      const col = t ? t.color : '#9aa0b8';
      const sym = mark === 'knight' ? '<path d="M0 -8l7 3v4c0 5-3 8-7 10-4-2-7-5-7-10v-4z" fill="#fff8e0" stroke="#8a6d10" stroke-width="1.2"/>' :
        mark === 'knave' ? '<path d="M-6 -3q6 -5 12 0M-4 3q4 3 8 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' :
          mark === 'lark' ? '<circle r="5" fill="#fff3c0"/><path d="M0 -9v3M0 6v3M-9 0h3M6 0h3" stroke="#fff3c0" stroke-width="2"/>' :
            mark === 'owl' ? '<path d="M3 -7a7 7 0 1 0 4 11a6 6 0 0 1 -4 -11z" fill="#fff"/>' :
              '<text y="4.5" text-anchor="middle" font-size="13" font-weight="800" fill="#1d1d24">' + (mark === '?' ? '?' : mark === 'normal' ? '≈' : mark === 'spy' ? 'S' : '') + '</text>';
      s += '<g transform="translate(15 -78)"><circle r="11" fill="' + col + '" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>' + sym + '</g>';
    }
    return s;
  }

  // split words into lines of at most n characters; '\n' forces a break
  function wrap(text, n) {
    const out = [];
    String(text).split('\n').forEach((para) => {
      let line = '';
      para.split(/\s+/).forEach((w) => {
        if (!w) return;
        if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w;
      });
      if (line) out.push(line);
    });
    return out;
  }
  const CHAR_W = 7.3;

  function sceneBG(kind, W, H, ground, sky) {
    let s = '<defs><clipPath id="kn-card"><rect x="-20" y="-20" width="' + (W + 40) + '" height="' + (H + 40) + '" rx="22"/></clipPath></defs><g clip-path="url(#kn-card)">';
    if (kind === 'doors') {
      s += '<rect x="-20" y="-20" width="' + (W + 40) + '" height="' + (ground + 20) + '" fill="rgba(150,140,130,.14)"/>';
      for (let y = 30; y < ground - 10; y += 34) s += '<path d="M-20 ' + y + 'H' + (W + 20) + '" stroke="rgba(0,0,0,.12)" stroke-width="2"/>';
      s += '<rect x="-20" y="' + (ground - 10) + '" width="' + (W + 40) + '" height="' + (H - ground + 30) + '" fill="rgba(138,90,38,.3)"/></g>';
      return s;
    }
    s += '<rect x="-20" y="-20" width="' + (W + 40) + '" height="' + (ground + 20) + '" fill="' + (sky || 'rgba(120,170,255,.07)') + '"/>';
    if (kind !== 'crowd') {
      s += '<path d="M-20 ' + (ground - 34) + 'Q' + (W * 0.25) + ' ' + (ground - 44) + ' ' + (W * 0.5) + ' ' + (ground - 34) + 'T' + (W + 20) + ' ' + (ground - 34) + 'V' + ground + 'H-20Z" fill="rgba(56,168,232,.16)"/>';
    }
    s += '<path d="M-20 ' + (ground - 10) + 'Q' + (W * 0.3) + ' ' + (ground - 22) + ' ' + (W * 0.6) + ' ' + (ground - 12) + 'T' + (W + 20) + ' ' + (ground - 8) + 'V' + (H + 20) + 'H-20Z" fill="rgba(217,160,91,.17)"/>';
    return s + '</g>';
  }
  function palm(x, y, k) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')" opacity=".5"><path d="M0 0Q-6 -60 6 -118" fill="none" stroke="#8a5a26" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M6 -118Q-30 -128 -52 -104Q-26 -116 6 -114ZM6 -118Q40 -132 60 -106Q34 -118 6 -114ZM6 -118Q-10 -150 -34 -150Q-8 -140 4 -116ZM6 -118Q26 -152 46 -146Q22 -138 8 -116Z" fill="#3f9d6a"/></g>';
  }
  function sunMoon(x, y, v) {
    if (v === 1) return '<g transform="translate(' + x + ' ' + y + ')"><circle r="17" fill="#ffd166" opacity=".85"/><path d="M0 -29v7M0 22v7M-29 0h7M22 0h7M-20 -20l5 5M15 15l5 5M20 -20l-5 5M-15 15l-5 5" stroke="#ffd166" stroke-width="3" stroke-linecap="round" opacity=".85"/></g>';
    if (v === 0) return '<g transform="translate(' + x + ' ' + y + ')"><path d="M6 -17a17 17 0 1 0 11 29a14 14 0 0 1 -11 -29z" fill="#e8eaf6" opacity=".85"/><circle cx="-30" cy="-8" r="1.6" fill="#e8eaf6"/><circle cx="26" cy="-18" r="1.3" fill="#e8eaf6"/><circle cx="-18" cy="16" r="1.1" fill="#e8eaf6"/></g>';
    return '<g transform="translate(' + x + ' ' + y + ')" opacity=".6"><path d="M-30 -4h60M-24 6h52M-34 -14h44" stroke="#9aa0b8" stroke-width="5" stroke-linecap="round"/></g>';
  }

  /* ---------- making puzzles ---------- */

  // places to meet the islanders: [title, where]
  const PLACES = [
    ['The Ferry Port', 'at the ferry port, waiting for the morning boat'], ['The Fish Market', 'haggling at the fish market'], ['Lighthouse Steps', 'on the lighthouse steps'],
    ['The Coconut Grove', 'in the coconut grove'], ['The Mango Orchard', 'picking fruit in the mango orchard'], ['The Harbour Wall', 'sitting on the harbour wall'],
    ['The Tide Pools', 'poking about in the tide pools'], ['The Village Well', 'drawing water at the village well'], ['The Rope Walk', 'twisting rope on the rope walk'],
    ['The Boatyard', 'tarring a hull in the boatyard'], ['The Salt Pans', 'raking the salt pans'], ['The Cliff Path', 'on the cliff path'],
    ['The Old Windmill', 'in the shade of the old windmill'], ['The Tavern Garden', 'in the tavern garden'], ['Market Day', 'in the market square on market day'],
    ['The Bandstand', 'by the bandstand'], ['Smugglers’ Cave', 'in the smugglers’ cave'], ['Turtle Beach', 'counting turtle nests on the beach'],
    ['The Blue Lagoon', 'swimming in the blue lagoon'], ['The Long Pier', 'fishing off the long pier'], ['The Chapel Steps', 'on the chapel steps'],
    ['The Goat Pasture', 'in the goat pasture'], ['The Bakery Queue', 'in the queue at the bakery'], ['Kite Hill', 'flying kites on the hill'],
    ['The Oyster Beds', 'wading in the oyster beds'], ['The Sea Wall', 'strolling along the sea wall'], ['The Custom House', 'outside the custom house'],
    ['The Parrot Aviary', 'at the parrot aviary'], ['On the Ferry Deck', 'on the ferry deck'], ['The Pearl Bank', 'diving on the pearl bank'],
    ['The Banana Terraces', 'on the banana terraces'], ['Sundial Square', 'in sundial square'], ['The Net Loft', 'mending nets in the net loft'],
    ['The Lobster Pots', 'hauling lobster pots'], ['The Sand Dunes', 'in the sand dunes'], ['The Driftwood Bonfire', 'round a driftwood bonfire'],
    ['The Reef Jetty', 'on the reef jetty'], ['Under the Fig Tree', 'under the old fig tree'], ['The Sugar Mill', 'at the sugar mill'],
    ['The Cricket Match', 'at the cricket match'], ['The Post Office', 'queuing at the post office'], ['The Schoolhouse', 'outside the schoolhouse'],
    ['The Clock Tower', 'under the clock tower'], ['The Stone Bridge', 'on the stone bridge'], ['The Hot Springs', 'soaking in the hot springs'],
    ['The Waterfall Pool', 'by the waterfall pool'], ['The Bamboo Grove', 'in the bamboo grove'], ['The Cocoa Barn', 'at the cocoa barn'],
    ['The Spice Stall', 'at the spice stall'], ['The Beehives', 'among the beehives'], ['The Sheepfold', 'at the sheepfold'],
    ['The Weather Station', 'at the weather station'], ['The Rowing Club', 'at the rowing club'], ['The Anchor Inn', 'in the Anchor Inn'],
    ['The Ship’s Chandler', 'in the ship’s chandler'], ['The Lantern Parade', 'at the lantern parade'], ['Regatta Day', 'at the regatta'],
    ['The Seaweed Farm', 'at the seaweed farm'], ['The Pineapple Patch', 'in the pineapple patch'], ['The Donkey Track', 'on the donkey track'],
    ['The Old Fort', 'on the ramparts of the old fort'], ['Pelican Point', 'at Pelican Point'], ['Shell Beach', 'collecting shells on the beach'],
    ['The Crab Races', 'at the crab races'], ['The Bell Tower', 'at the foot of the bell tower'], ['The Grain Store', 'at the grain store'],
    ['The Harvest Fair', 'at the harvest fair'], ['The Mooring Posts', 'by the mooring posts'], ['The Glass Works', 'at the glass works'],
    ['The Olive Press', 'at the olive press'], ['The Cable Car', 'in the cable car'], ['The Coral Garden', 'snorkelling over the coral garden'],
    ['The Rain Shelter', 'sheltering from a squall'], ['The Signal Station', 'at the signal station'], ['The Fishermen’s Chapel', 'outside the fishermen’s chapel'],
    ['The Sponge Divers', 'with the sponge divers'], ['The Watermelon Cart', 'round the watermelon cart'], ['The Tea House', 'in the tea house'],
    ['The Lookout', 'at the lookout'], ['The Mule Stable', 'at the mule stable'], ['The Island Library', 'in the island library'],
    ['The Sailmaker’s Loft', 'in the sailmaker’s loft'], ['The Dockside Café', 'at the dockside café'], ['The Tamarind Tree', 'under the tamarind tree'],
    ['The Sea Caves', 'exploring the sea caves'], ['The Wishing Rock', 'at the wishing rock'], ['The Toll Gate', 'at the toll gate'],
    ['The Chess Tables', 'over the chess tables in the park'], ['The Ice House', 'at the ice house'], ['The Pottery', 'at the pottery'],
    ['The Rope Bridge', 'on the rope bridge'], ['The Palm Nursery', 'at the palm nursery'], ['The Flying Fish Dock', 'at the flying-fish dock']
  ];
  const TWILIGHT_PLACES = [
    ['Fog on the Quay', 'on the quay'], ['The Misty Orchard', 'in the misty orchard'], ['The Owl Tower', 'at the old owl tower'], ['Grey Morning, or Evening?', 'on the beach'],
    ['The Lamplighter’s Round', 'on the lamplighter’s round'], ['The Foghorn', 'by the foghorn'], ['Twilight Market', 'at the twilight market'], ['The Sleepless Inn', 'at the Sleepless Inn'],
    ['The Dew Meadow', 'in the dew meadow'], ['The Veiled Harbour', 'in the veiled harbour'], ['Larks and Owls', 'on the village green'], ['The Sundial in the Fog', 'by the useless sundial'],
    ['The Night Nets', 'by the drying nets'], ['The Cloud Forest', 'in the cloud forest'], ['The Bell Buoy', 'by the bell buoy'], ['The Moth Garden', 'in the moth garden'],
    ['Dawn or Dusk', 'at the crossroads'], ['The Dim Lighthouse', 'in the dim lighthouse'], ['The Hazy Pier', 'on the hazy pier'], ['The Mist Bridge', 'on the mist bridge']
  ];
  const DAJA_PLACES = [
    ['Da or Ja?', 'at the harbour'], ['The Phrasebook', 'at the market'], ['Lost in Translation', 'on the beach'], ['Two Little Words', 'in the tavern'],
    ['The Interpreter’s Day Off', 'at the town gate'], ['Yes, No, or Ja?', 'under the palms'], ['The Silent Dictionary', 'at the library'], ['Nodding Terms', 'at the ferry'],
    ['The Da-Ja Isle', 'by the lighthouse'], ['Answers Without Words', 'at the well'], ['A Word in Your Ear', 'at the fair'], ['Ja, Da, Da', 'on the pier'],
    ['The Grammar of Liars', 'in the schoolhouse'], ['Two Syllables', 'in the orchard'], ['Tongue-Tied', 'on the hill']
  ];
  const MIXED_PLACES = [
    ['One of Each', 'in the town hall'], ['The Normal One', 'at the barber’s'], ['Spy in the Market', 'in the market'], ['Three Brothers at the Fair', 'at the fair'],
    ['The Stranger at the Inn', 'at the inn'], ['The Card Table', 'round a card table'], ['The Masked Ball', 'at the masked ball'], ['Who Is the Spy?', 'on the quay'],
    ['The Ordinary Islander', 'at the ferry'], ['An Honest Mix', 'in the square'], ['Three Cousins', 'in the orchard'], ['The Mole', 'at the signal station'],
    ['The Double Agent', 'on the bridge'], ['The Council of Three', 'in the council chamber'], ['The Informer', 'in the tea house'], ['Nobody in Particular', 'at the bus stop'],
    ['A Knight, a Knave and the Other', 'at the crossroads'], ['The Suspect', 'at the harbour office'], ['The Night Watch', 'on the night watch'],
    ['Tea for Three', 'at a tea party'], ['The Locked Room', 'outside a locked room'], ['The Ferry Crew', 'among the ferry crew'], ['The Trial', 'in the courtroom'],
    ['The Lighthouse Crew', 'with the lighthouse crew'], ['The Choir', 'at choir practice'], ['The Treasure Map', 'round a treasure map'], ['The Password', 'at the fort gate']
  ];

  const NAME_LIST = Object.keys(NAMES).filter((n) => !['Epimenides', 'Ariadne', 'Minos'].includes(n));
  function pickNames(rng, n) {
    for (let t = 0; t < 50; t++) {
      const a = rng.shuffle(NAME_LIST.slice()).slice(0, n);
      if (new Set(a.map((x) => x[0])).size === n) return a;
    }
    return NAME_LIST.slice(0, n);
  }

  // a random statement for speaker s among n people (level 1..5); world kind k
  function randFormula(rng, s, n, level, k) {
    const others = [];
    for (let i = 0; i < n; i++) if (i !== s) others.push(i);
    const o = () => rng.pick(others);
    const anyone = () => rng.int(n);
    const T = k.types;
    const kk = [T[0], T[1]];
    const atomOf = (x) => ['is', x, x === s && k.id === 'kk' ? rng.pick(['knave', 'knave', 'knight']) : rng.pick(k.id === 'kkn' ? T : kk)];
    const two = (f1, f2) => rng() < 0.5 ? [f1, f2] : [f2, f1];
    const twoDiff = () => { const a = rng.shuffle(Array.from({ length: n }, (_, i) => i)); return [a[0], a[1]]; };
    const grp = (m) => rng.shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, m).sort((a, b) => a - b);
    const pool = [];
    const add = (w, fn) => pool.push([w, fn]);
    if (k.id === 'lo') {
      add(3, () => ['is', o(), rng.pick(T)]);
      add(2, () => [rng() < 0.5 ? 'and' : 'or', rng() < 0.5 ? ['var', 'day'] : ['not', ['var', 'day']], ['is', o(), rng.pick(T)]]);
      add(level >= 2 ? 2 : 0, () => ['same', s, o()]);
      add(level >= 2 ? 2 : 0, () => ['imp', rng() < 0.5 ? ['var', 'day'] : ['not', ['var', 'day']], ['is', anyone(), rng.pick(T)]]);
      add(level >= 3 ? 2 : 0, () => ['cnt', rng.pick(T), 'all', 'eq', rng.int(n + 1)]);
      add(level >= 3 ? 1 : 0, () => ['xor', ['var', 'day'], ['is', o(), rng.pick(T)]]);
      add(1, () => rng() < 0.5 ? ['var', 'day'] : ['not', ['var', 'day']]);
    } else if (k.id === 'kkn' || k.id === 'spy') {
      const odd = k.id === 'kkn' ? 'normal' : 'spy';
      add(3, () => ['is', anyone(), rng.pick(T)]);
      add(3, () => ['not', ['is', anyone(), rng.pick(T)]]);
      add(2, () => ['is', s, odd]);
      add(level >= 2 ? 2 : 0, () => { const a = twoDiff(); return [rng() < 0.5 ? 'and' : 'or', ['is', a[0], rng.pick(T)], ['is', a[1], rng.pick(T)]]; });
      add(level >= 3 ? 2 : 0, () => { const a = twoDiff(); return ['imp', ['is', a[0], rng.pick(T)], ['is', a[1], rng.pick(T)]]; });
      add(level >= 2 ? 1 : 0, () => ['same', ...twoDiff()]);
      add(k.id === 'spy' ? 2 : 0, () => ['cnt', 'knight', 'all', rng.pick(['eq', 'ge', 'le']), rng.int(n)]);
    } else {
      // knights and knaves
      add(level <= 2 ? 4 : level === 3 ? 1.5 : 0.6, () => ['is', o(), rng.pick(kk)]);
      add(level <= 2 ? 2 : 1, () => ['cnt', rng.pick(kk), 'all', rng.pick(['ge', 'eq', 'le']), rng.int(n + 1)]);
      add(level >= 4 ? 2.5 : 1.5, () => [rng.pick(['and', 'or'])].concat(two(atomOf(s), ['is', o(), rng.pick(kk)])));
      add(level >= 2 ? 2 : 1, () => [rng() < 0.6 ? 'same' : 'diff', ...(rng() < 0.5 ? [s, o()] : twoDiff())]);
      add(level >= 2 ? 2 : 0, () => { const g = grp(2); return ['cnt', rng.pick(kk), g, 'eq', rng.int(3)]; });
      add(level >= 2 ? 2 : 0, () => { const a = twoDiff(); return [rng.pick(['and', 'or']), ['is', a[0], rng.pick(kk)], ['is', a[1], rng.pick(kk)]]; });
      add(level >= 3 ? 3 : 0, () => { const a = twoDiff(); return ['imp', ['is', a[0], rng.pick(kk)], ['is', a[1], rng.pick(kk)]]; });
      add(level >= 3 ? 2 : 0, () => ['cnt', rng.pick(kk), 'all', rng.pick(['eq', 'eq', 'ge', 'le']), rng.range(1, n - 1)]);
      add(level >= 3 ? 1 : 0, () => { const a = twoDiff(); return ['xor', ['is', a[0], rng.pick(kk)], ['is', a[1], rng.pick(kk)]]; });
      add(level >= 4 ? 2 : 0, () => { const a = twoDiff(); return ['iff', ['is', a[0], rng.pick(kk)], ['is', a[1], rng.pick(kk)]]; });
      add(level >= 4 && n >= 3 && k.id !== 'da' ? 3 : 0, () => { const y = o(); let x = anyone(); if (x === y) x = s; return ['ans', y, ['is', x, rng.pick(kk)]]; });
      add(level >= 4 && n >= 4 ? 2 : 0, () => { const g = grp(3); return ['cnt', rng.pick(kk), g, rng.pick(['eq', 'ge']), rng.range(1, 2)]; });
      add(level >= 4 ? 1 : 0, () => ['imp', ['same', ...twoDiff()], ['is', anyone(), rng.pick(kk)]]);
    }
    let tot = 0;
    pool.forEach((p) => { tot += p[0]; });
    let r = rng() * tot;
    for (const p of pool) { r -= p[0]; if (r < 0 && p[0] > 0) return p[1](); }
    return pool[pool.length - 1][1]();
  }

  // the kinds of island a generated puzzle can be set on
  const WORLDS = {
    kk: { id: 'kk', types: ['knight', 'knave'] },
    kkn: { id: 'kkn', types: ['knight', 'knave', 'normal'] },
    spy: { id: 'spy', types: ['knight', 'knave', 'spy'] },
    lo: { id: 'lo', types: ['lark', 'owl'] },
    da: { id: 'da', types: ['knight', 'knave'] }
  };
  const DAY_VAR = { id: 'day', name: 'Day or night?', what: 'whether it is day or night', yes: 'Day', no: 'Night', s: 'it is day', ns: 'it is night', q: 'Is it day?' };
  const DA_VAR = { id: 'da', name: '“Da” means', what: 'what “da” means', yes: 'Yes', no: 'No', s: '“da” means yes', ns: '“da” means no', q: 'Does “da” mean yes?', glyph: 'da' };

  function formulaKey(f) { return JSON.stringify(f); }
  // true when a formula comes out the same in every assignment (says nothing)
  function constant(M, f) {
    let T = false, F = false;
    const w = new Array(M.n).fill(0);
    const rec = (i) => {
      if (T && F) return;
      if (i === M.n) { if (ev(M, f, w)) T = true; else F = true; return; }
      for (const v of M.dom0[i]) { w[i] = v; rec(i + 1); }
    };
    rec(0);
    return !(T && F);
  }

  // one attempt at a puzzle: { data, grade } or null
  function makeData(rng, level, wid, n) {
    const k = WORLDS[wid];
    const d = { types: k.types.slice(), people: pickNames(rng, n), says: [] };
    if (wid === 'lo') d.vars = [Object.assign({}, DAY_VAR)];
    if (wid === 'da') d.vars = [Object.assign({}, DA_VAR)];
    if (wid === 'kkn') { d.facts = [['and', ['cnt', 'knight', 'all', 'eq', 1], ['cnt', 'knave', 'all', 'eq', 1], ['cnt', 'normal', 'all', 'eq', 1]]]; d.factText = ['there is exactly one knight, one knave and one normal among them']; }
    if (wid === 'spy') { d.facts = [['cnt', 'spy', 'all', 'eq', 1]]; d.factText = ['exactly one of them is the spy']; }
    // the truth
    let sol;
    for (;;) {
      if (wid === 'kkn') sol = rng.shuffle([0, 1, 2]).slice(0, n);
      else if (wid === 'spy') { sol = Array.from({ length: n }, () => rng.int(2)); sol[rng.int(n)] = 2; }
      else sol = Array.from({ length: n }, () => rng.int(2));
      if (wid === 'kk' && n >= 3 && sol.every((v) => v === sol[0]) && rng() < 0.7) continue;
      break;
    }
    const world = sol.slice();
    if (wid === 'lo' || wid === 'da') world.push(rng.int(2));
    const M0 = model(d);
    const keys = new Set();
    const speakFor = (s) => {
      for (let t = 0; t < 60; t++) {
        const f = randFormula(rng, s, n, level, k);
        if (!f) continue;
        const kf = formulaKey([s, f]);
        if (keys.has(kf) || keys.has(formulaKey([s, ['not', f]])) || (f[0] === 'not' && keys.has(formulaKey([s, f[1]])))) continue;
        if (constant(M0, f)) continue;
        if (wid === 'da') {
          const tr = truthOf(M0, s, world);
          const yes = (tr === 1) === ev(M0, f, world);
          const w = yes === !!world[M0.varIdx.da] ? 'da' : 'ja';
          keys.add(kf);
          return { s, q: f, w };
        }
        const tr = truthOf(M0, s, world);
        const v = ev(M0, f, world);
        if (tr != null && v !== (tr === 1)) continue;
        if (wid === 'kk' && level >= 2 && level <= 4 && rng() < 0.15 && ['is', 'same', 'cnt'].includes(f[0])) { keys.add(kf); return { s, q: f, w: v === (tr === 1) ? 'yes' : 'no' }; }
        keys.add(kf);
        return { s, f };
      }
      return null;
    };
    const order = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    const silent = level >= 3 && n >= 4 && rng() < 0.35 ? 1 : 0;
    for (let i = 0; i < n - silent; i++) { const st = speakFor(order[i]); if (st) d.says.push(st); }
    let A = analyse(d);
    let extra = 0;
    while (A.ws.length && A.ans.includes('?') && extra < (level >= 4 ? 3 : 2)) {
      // the next word goes to someone who has said least
      const cnt = (i) => d.says.filter((x) => x.s === i).length;
      const least = Math.min.apply(null, order.map(cnt));
      const st = speakFor(rng.pick(order.filter((i) => cnt(i) === least)));
      if (st) d.says.push(st);
      A = analyse(d);
      extra++;
    }
    if (!A.ws.length || A.ans.includes('?')) return null;
    // leave out statements that add nothing (a puzzle is neater without them)
    {
      for (const i of rng.shuffle(d.says.map((x, j) => j))) {
        if (d.says.length <= 1) break;
        const st = d.says[i];
        const trial = Object.assign({}, d, { says: d.says.filter((x) => x !== st) });
        const B = analyse(trial);
        if (B.ws.length && !B.ans.includes('?')) d.says = trial.says;
      }
    }
    d.says.sort((a, b) => a.s - b.s);
    d.sol = analyse(d).ans;
    return { data: d, grade: grade(d) };
  }

  // the score a level asks for
  const BANDS = [null, [0, 3.2], [3.2, 6], [6, 10.5], [10.5, 17], [17, 999]];
  function levelOf(g) {
    for (let l = 5; l >= 1; l--) if (g.cost >= BANDS[l][0]) return l;
    return 1;
  }

  // the words of a generated puzzle
  function dress(rng, d, wid, place) {
    const names = d.people;
    const who = listJoin(names.map((nm) => nm + (NAMES[nm] ? ' ' + NAMES[nm][1] : '')));
    const intro = {
      kk: 'Every native of this island is a **knight**, who always tells the truth, or a **knave**, who always lies.',
      kkn: 'On this island live **knights**, who always tell the truth, **knaves**, who always lie, and **normals**, who do either as they please. Among the three you meet there is exactly one of each.',
      spy: 'The natives here are **knights**, who always tell the truth, and **knaves**, who always lie — but among the people you meet is exactly one **spy**, who lies or not as it suits.',
      lo: 'On the Twilight Isle, **larks** tell the truth by day and lie by night; **owls** lie by day and tell the truth by night. A thick sea fog hides the sky, so you cannot tell whether it is day or night.',
      da: 'These natives are **knights** and **knaves** who understand every word you say but answer only in their own tongue: **da** or **ja**. One means yes and the other no — you do not know which.'
    }[wid];
    const M = model(d);
    const lines = d.says.map((st) => st.q ? 'You ask **' + names[st.s] + '**: “' + ask(M, st.q, st.s) + '” — “' + cap(st.w) + '.”' : '**' + names[st.s] + '**: ' + stText(M, st));
    const silent = names.filter((nm, i) => !d.says.some((st) => st.s === i));
    return intro + '\n\nYou meet ' + who + ' ' + place[1] + '.\n\n' + lines.join('<br>') + (silent.length ? '<br>' + listJoin(silent) + ' ' + (silent.length > 1 ? 'say' : 'says') + ' nothing.' : '');
  }

  // which world and how many people for a level
  const PLANS = {
    1: [['kk', 2], ['kk', 3], ['kk', 3], ['kk', 4]],
    2: [['kk', 3], ['kk', 4], ['kk', 4], ['kk', 5], ['kkn', 3], ['lo', 2]],
    3: [['kk', 4], ['kk', 5], ['kk', 6], ['kkn', 3], ['lo', 2], ['lo', 3], ['da', 2], ['spy', 3]],
    4: [['kk', 5], ['kk', 6], ['kk', 6], ['kkn', 3], ['lo', 3], ['lo', 4], ['da', 3], ['spy', 3], ['spy', 4]],
    5: [['kk', 6], ['kk', 6], ['kk', 5], ['kkn', 3], ['spy', 4], ['spy', 4], ['da', 3], ['lo', 4]]
  };
  function planFor(rng, level, only) {
    let opts = PLANS[level];
    if (only) {
      opts = opts.filter((o) => o[0] === only);
      if (!opts.length) opts = [[only, only === 'kkn' ? 3 : only === 'kk' ? 4 : 3]];
    }
    const o = rng.pick(opts);
    return { wid: o[0], n: o[1] };
  }

  // a whole puzzle for a level, or null
  function makePuzzle(rng, level, only, placeIn) {
    for (let t = 0; t < 30; t++) {
      const plan = planFor(rng, level, only);
      const r = makeData(rng, level, plan.wid, plan.n);
      if (!r || !r.grade.ok) continue;
      const lv = levelOf(r.grade);
      if (lv !== level) continue;
      const place = placeIn || rng.pick(plan.wid === 'lo' ? TWILIGHT_PLACES : plan.wid === 'da' ? DAJA_PLACES : plan.wid === 'kk' ? PLACES : MIXED_PLACES);
      return { title: place[0], text: dress(rng, r.data, plan.wid, place), diff: level, data: r.data, world: plan.wid, cost: r.grade.cost };
    }
    return null;
  }

  const TYPE_WORDS = {
    knight: 'always tells the truth', knave: 'always lies', normal: 'sometimes lies, sometimes not', spy: 'lies or not, as it suits',
    lark: 'truthful by day, lies by night', owl: 'lies by day, truthful by night'
  };

  C.engine({
    id: 'knaves',
    name: 'Knights and knaves',
    noMoves: true,
    autoCheck: false,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Each islander says something in a speech bubble. Knights always tell the truth; knaves always lie (other islands have other folk — the panel lists who lives here). **Click the tokens** under an islander to mark what you think they are (or click the islander to cycle through the marks). Where some islander cannot be worked out, mark them **?**. When everyone is marked, press **Declare**.\n\n**Click a bubble** to note whether you think the words are true (✓) or false (✗) — just for you, it is not checked. The **lamp** in the panel lights up any statement that cannot fit your marks. Keys: **1–6** pick an islander, then **K** knight, **N** knave, **O** normal, **S** spy, **L** lark, **W** owl, **U** ?; arrows move along the row.\n\n“Or” always allows both, unless it says “but not both”. A statement like “Exactly one of us is a knight” counts the speaker too.',

    answerKey(p) { return p.data.ask ? p.data.ask.ans : null; },

    generate(rng, level) {
      const r = makePuzzle(rng, level);
      if (!r) return null;
      return { title: r.title, text: r.text, diff: level, data: r.data };
    },

    verify(p) {
      const d = p.data;
      if (!d || !Array.isArray(d.people) || !d.people.length) return { ok: false, err: 'no people' };
      if (d.people.length > 7) return { ok: false, err: 'too many people to draw' };
      const types = d.types || ['knight', 'knave'];
      if (types.some((t) => !TYPES[t])) return { ok: false, err: 'unknown type' };
      if (types.some((t) => TYPES[t].truth === 'day' || TYPES[t].truth === 'night') && !(d.vars || []).some((v) => v.id === 'day')) return { ok: false, err: 'larks and owls need a day var' };
      for (const st of d.says || []) if (!(st.s >= 0 && st.s < d.people.length)) return { ok: false, err: 'bad speaker' };
      let A;
      try { A = analyse(d); } catch (e) { return { ok: false, err: e.message }; }
      if (!A.ws.length) return { ok: false, err: 'no assignment fits every statement' };
      if (d.ask) {
        const r = choiceResults(d);
        const good = r.map((v, i) => v ? i : -1).filter((i) => i >= 0);
        if (good.length !== 1) return { ok: false, err: good.length + ' choices are right (' + good.join(',') + ')' };
        if (good[0] !== d.ask.ans) return { ok: false, err: 'the right choice is ' + good[0] + ', not ' + d.ask.ans };
        return { ok: true };
      }
      if (!d.open && A.ans.includes('?')) return { ok: false, err: 'not unique: ' + A.ws.length + ' assignments fit' };
      if (d.open && A.ans.every((a) => a === '?')) return { ok: false, err: 'nothing can be determined' };
      if (d.sol && JSON.stringify(d.sol) !== JSON.stringify(A.ans)) return { ok: false, err: 'stored sol ' + JSON.stringify(d.sol) + ' but the answer is ' + JSON.stringify(A.ans) };
      if (d.open && !A.ans.includes('?')) return { ok: true, warn: 'open, but everyone can be determined' };
      return { ok: true };
    },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data;
      const M = model(d);
      const A = analyse(d);
      const nP = M.nP;
      const choice = !!d.ask;
      const tokTypes = M.types.concat(d.open ? ['?'] : []);
      const mvars = (d.vars || []).map((v, i) => ({ v, x: nP + i })).filter((o) => o.v.mark !== false);
      let marks = new Array(nP).fill(null);
      let vm = {};
      let ann = {};
      let lamp = false, focus = -1;
      const hl = { people: new Set(), says: new Set(), t: null };

      const CW = nP <= 2 ? 250 : nP === 3 ? 232 : nP === 4 ? 214 : 200;
      const wrapN = Math.floor((CW - 40) / CHAR_W);
      const bubbles = (d.says || []).map((st, k) => {
        const lines = wrap(stText(M, st), wrapN);
        const w = Math.min(CW - 14, Math.max(84, Math.max.apply(null, lines.map((l) => l.length)) * CHAR_W + 30));
        return { st, k, lines, w, h: lines.length * 18 + 18 };
      });
      const stackH = Math.max(46, Math.max.apply(null, d.people.map((nm, i) => {
        const b = bubbles.filter((x) => x.st.s === i);
        return b.reduce((s, x) => s + x.h, 0) + Math.max(0, b.length - 1) * 12;
      })));
      const bubBottom = 14 + stackH;
      const feetY = bubBottom + 180;
      const VW = 196;
      const W = nP * CW + (mvars.length ? 26 + mvars.length * (VW + 12) : 0);
      const H = feetY + 92;
      const cx = (i) => CW * (i + 0.5);
      const skyKind = d.scene || (M.types.includes('lark') ? 'fog' : 'sea');

      const bgG = ctx.s('g', { class: 'kn-scene' }, wb.layer('bg'));
      const board = ctx.s('g', { class: 'kn' }, wb.layer('board'));
      wb.setBounds({ x0: -12, y0: 0, x1: W + 12, y1: H }, 0.04);

      if (!p.goal && !choice) {
        ctx.setGoal('Mark every islander as ' + listJoin(M.types.map((t) => TYPES[t].a), 'or') + (d.open ? ' — or **?** where it cannot be told' : '') +
          (mvars.length ? ', and settle ' + listJoin(mvars.map((o) => o.v.what || (o.v.name || o.v.id).toLowerCase())) : '') + '. Then press **Declare**.');
      }

      /* the answer box for choice puzzles */
      let box = null;
      if (choice) {
        box = ctx.answer({
          kind: 'choice', label: d.ask.q, choices: d.ask.choices.map((c) => c.t),
          check: (v) => v === d.ask.ans ? { ok: true, msg: d.ask.ok || 'Yes!' } : { ok: false, msg: (d.ask.choices[v] && d.ask.choices[v].why) || null }
        });
      }

      /* the panel: who lives here, the lamp */
      const legend = ctx.h('div.kn-legend');
      M.types.forEach((t) => legend.appendChild(ctx.h('div.kn-leg', ctx.h('i', { style: { background: TYPES[t].color } }), ctx.h('b', TYPES[t].label), ' ', ctx.h('span', TYPE_WORDS[t]))));
      ctx.panel.appendChild(legend);
      let lampBtn = null;
      if (!choice) {
        lampBtn = ctx.button('Lamp: off', () => { lamp = !lamp; draw(); if (lamp) lampSay(); else ctx.say(''); }, 'small');
        lampBtn.title = 'Light up statements that cannot fit your marks';
        ctx.button('Clear marks', () => { marks = new Array(nP).fill(null); vm = {}; draw(); ctx.changed('clear'); }, 'small.ghost');
      }

      function userDom() {
        const dom = M.dom0.map((a) => a.slice());
        marks.forEach((m, i) => { if (m && m !== '?') dom[i] = [M.types.indexOf(m)]; });
        mvars.forEach((o) => { const v = vm[o.v.id]; if (v === 1 || v === 0) dom[o.x] = [v]; });
        return dom;
      }
      // can constraint c still be satisfied within dom? 'bad' = never, 'ok' = always, '' = depends
      function lampOf(c, dom) {
        let any = false, all = true;
        const S = c.scope, w = new Array(M.n).fill(0);
        const rec = (k) => {
          if (any && !all) return;
          if (k === S.length) { if (holds(M, c, w)) any = true; else all = false; return; }
          for (const v of dom[S[k]]) { w[S[k]] = v; rec(k + 1); }
        };
        rec(0);
        return !any ? 'bad' : all ? 'ok' : '';
      }
      function lampSay() {
        const dom = userDom();
        const bad = M.cons.filter((c) => lampOf(c, dom) === 'bad');
        if (!bad.length) ctx.say('The lamp finds no clash with your marks so far.', 'info');
        else ctx.say(bad.map((c) => c.kind === 'fact' ? 'Your marks break the rule: ' + factText(M, c.f) + '.' : cap(M.d.people[c.s]) + '’s words cannot fit your marks.').join(' '), 'warn');
      }

      function draw() {
        const dom = lamp ? userDom() : null;
        // scenery
        let bgs = sceneBG(skyKind, W, H, feetY - 16, skyKind === 'fog' ? (vm.day === 1 ? 'rgba(255,209,102,.09)' : vm.day === 0 ? 'rgba(40,50,110,.25)' : 'rgba(150,155,175,.12)') : null);
        if (skyKind === 'sea') bgs += palm(-6, feetY - 8, 0.9) + (W > 500 ? palm(W + 6, feetY - 6, 0.75) : '');
        if (skyKind === 'fog') bgs += sunMoon(W - 40, 40, vm.day === 1 ? 1 : vm.day === 0 ? 0 : null);
        if (skyKind === 'doors') {
          for (let i = 0; i < nP; i++) {
            const x = cx(i);
            bgs += '<g transform="translate(' + x + ' ' + (feetY - 14) + ')"><path d="M-52 0V-150Q-52 -190 0 -190Q52 -190 52 -150V0Z" fill="#8a5a26" opacity=".55"/>' +
              '<path d="M-44 0V-148Q-44 -180 0 -180Q44 -180 44 -148V0Z" fill="#b07a3e" opacity=".55"/><circle cx="30" cy="-80" r="4" fill="#ffd166"/>' +
              '<text y="-196" text-anchor="middle" class="kn-door">' + (i === 0 ? 'Left door' : 'Right door') + '</text></g>';
          }
        }
        bgG.innerHTML = bgs;
        board.innerHTML = '';
        // the islanders
        d.people.forEach((name, i) => {
          const g = ctx.s('g', { class: 'kn-person' + (focus === i ? ' focus' : '') + (hl.people.has(i) ? ' hinted' : ''), transform: 'translate(' + cx(i) + ' ' + feetY + ')' }, board);
          if (focus === i) ctx.s('ellipse', { cx: 0, cy: 2, rx: 46, ry: 11, class: 'kn-focus' }, g);
          const fig = ctx.s('g', { class: 'kn-fig', 'data-kn': 'fig:' + i }, g);
          fig.innerHTML = islanderSVG(name, marks[i], { key: 'kn-p' + i });
          const job = (NAMES[name] || [])[1];
          ctx.s('title', { text: name + (job ? ' ' + job : '') }, fig);
          ctx.s('rect', { x: -40, y: -175, width: 80, height: 178, class: 'kn-hit' }, fig);
          ctx.s('text', { x: 0, y: 24, class: 'kn-name', 'text-anchor': 'middle', text: name }, g);
          // tokens
          const n = tokTypes.length;
          const tw = Math.min(62, (CW - 14) / n - 4);
          const x0 = -(n * tw + (n - 1) * 4) / 2;
          tokTypes.forEach((t, k) => {
            const on = marks[i] === t;
            const tg = ctx.s('g', { class: 'kn-tok' + (on ? ' on' : ''), 'data-kn': 'tok:' + i + ':' + t, transform: 'translate(' + (x0 + k * (tw + 4)) + ' 36)' }, g);
            ctx.s('rect', { width: tw, height: 25, rx: 12.5, style: on ? 'fill:' + (TYPES[t] ? TYPES[t].color : '#9aa0b8') : null }, tg);
            ctx.s('text', { x: tw / 2, y: 17, 'text-anchor': 'middle', text: t === '?' ? '?' : TYPES[t].label }, tg);
          });
        });
        // the speech bubbles
        d.people.forEach((name, i) => {
          let y = bubBottom;
          bubbles.filter((b) => b.st.s === i).reverse().forEach((b, j) => {
            const x = cx(i) - b.w / 2;
            const top = y - b.h;
            const c = M.cons.find((cc) => cc.kind === 'say' && cc.k === b.k);
            const lp = dom && c ? lampOf(c, dom) : '';
            const a = ann[b.k];
            const g = ctx.s('g', { class: 'kn-bub' + (c ? '' : ' deco') + (a === 'T' ? ' ann-t' : a === 'F' ? ' ann-f' : '') + (lp ? ' lamp-' + lp : '') + (hl.says.has(b.k) ? ' hinted' : ''), 'data-kn': 'bub:' + b.k }, board);
            ctx.s('rect', { x, y: top, width: b.w, height: b.h, rx: 14, class: 'kn-bubbg', 'data-key': 'kn-s' + b.k }, g);
            if (j === 0) ctx.s('path', { d: 'M' + (cx(i) - 9) + ' ' + (y - 1) + 'L' + (cx(i) - 2) + ' ' + (y + 18) + 'L' + (cx(i) + 9) + ' ' + (y - 1) + 'Z', class: 'kn-tail' }, g);
            b.lines.forEach((ln, k) => ctx.s('text', { x: cx(i), y: top + 22 + k * 18, 'text-anchor': 'middle', class: 'kn-say', text: ln }, g));
            if (a) {
              const bx = x + b.w - 4, by = top + 4;
              ctx.s('circle', { cx: bx, cy: by, r: 10, class: 'kn-annb' }, g);
              ctx.s('text', { x: bx, y: by + 4.5, 'text-anchor': 'middle', class: 'kn-annt', text: a === 'T' ? '✓' : '✗' }, g);
            }
            if (lp === 'bad') ctx.s('text', { x: x + 10, y: top - 5, class: 'kn-clash', text: 'cannot fit your marks' }, g);
            y = top - 12;
          });
        });
        // the unknowns beyond the people
        mvars.forEach((o, k) => {
          const x = nP * CW + 26 + k * (VW + 12), y = feetY - 160;
          const g = ctx.s('g', { class: 'kn-var' + (hl.people.has(o.x) ? ' hinted' : ''), transform: 'translate(' + x + ' ' + y + ')' }, board);
          ctx.s('rect', { width: VW, height: 170, rx: 16, class: 'kn-varbg', 'data-key': 'kn-v' + k }, g);
          ctx.s('text', { x: VW / 2, y: 26, 'text-anchor': 'middle', class: 'kn-vname', text: o.v.name || o.v.id }, g);
          const cur = vm[o.v.id];
          const icon = ctx.s('g', null, g);
          if (o.v.id === 'day') icon.innerHTML = sunMoon(VW / 2, 78, cur === 1 ? 1 : cur === 0 ? 0 : null);
          else icon.innerHTML = '<text x="' + VW / 2 + '" y="92" text-anchor="middle" class="kn-vglyph">' + C.esc(o.v.glyph || '?') + '</text>';
          const opts = [[1, o.v.yes || 'Yes'], [0, o.v.no || 'No']].concat(d.open ? [['?', '?']] : []);
          const tw = (VW - 20) / opts.length - 4;
          opts.forEach((op, j) => {
            const on = cur === op[0];
            const tg = ctx.s('g', { class: 'kn-tok' + (on ? ' on' : ''), 'data-kn': 'var:' + o.v.id + ':' + op[0], transform: 'translate(' + (10 + j * (tw + 4) + 2) + ' 128)' }, g);
            ctx.s('rect', { width: tw, height: 27, rx: 13.5, style: on ? 'fill:' + (op[0] === 1 ? '#ffd166' : op[0] === 0 ? '#8f9bff' : '#9aa0b8') : null }, tg);
            ctx.s('text', { x: tw / 2, y: 18, 'text-anchor': 'middle', text: op[1] }, tg);
          });
        });
        if (lampBtn) { lampBtn.textContent = lamp ? 'Lamp: on' : 'Lamp: off'; lampBtn.classList.toggle('gold', lamp); }
        wb.applyPaints();
      }

      function setMark(i, t) {
        marks[i] = marks[i] === t ? null : t;
        ctx.sfx('tap');
        draw();
        ctx.changed('mark');
        if (lamp) lampSay();
      }
      function act(a) {
        const part = a.split(':');
        if (part[0] === 'tok') { focus = +part[1]; setMark(+part[1], part[2]); return; }
        if (part[0] === 'fig') {
          const i = +part[1];
          focus = i;
          const k = tokTypes.indexOf(marks[i]);
          marks[i] = k + 1 < tokTypes.length ? tokTypes[k + 1] : null;
          ctx.sfx('tap');
          draw();
          ctx.changed('mark');
          if (lamp) lampSay();
          return;
        }
        if (part[0] === 'bub') {
          const k = +part[1];
          ann[k] = ann[k] == null ? 'T' : ann[k] === 'T' ? 'F' : null;
          if (ann[k] == null) delete ann[k];
          ctx.sfx('tap');
          draw();
          ctx.changed('note');
          return;
        }
        if (part[0] === 'var') {
          const v = part[2] === '?' ? '?' : +part[2];
          vm[part[1]] = vm[part[1]] === v ? null : v;
          ctx.sfx('tap');
          draw();
          ctx.changed('mark');
          if (lamp) lampSay();
        }
      }

      let pend = null;
      wb.handlers.board = {
        down(pt, ev, el) {
          const t = el && el.closest ? el.closest('[data-kn]') : null;
          if (!t) return false;
          pend = { a: t.getAttribute('data-kn'), pt };
          return true;
        },
        move() { },
        up(pt) {
          const pd = pend;
          pend = null;
          if (!pd) return;
          if (Math.hypot(pt[0] - pd.pt[0], pt[1] - pd.pt[1]) > wb.px(12)) return;
          act(pd.a);
        }
      };

      function flash(people, says) {
        hl.people = new Set(people);
        hl.says = new Set(says);
        draw();
        clearTimeout(hl.t);
        hl.t = setTimeout(() => { hl.people.clear(); hl.says.clear(); draw(); }, 4200);
      }

      function have() { return M.marked.map((x) => x < nP ? marks[x] : (vm[M.vars[x - nP].id] == null ? null : vm[M.vars[x - nP].id])); }

      function summary() {
        const parts = [];
        M.types.concat(['?']).forEach((t) => {
          const who = d.people.filter((nm, i) => A.ans[i] === t);
          if (!who.length) return;
          parts.push(t === '?' ? listJoin(who) + (who.length > 1 ? ' cannot be told' : ' cannot be told') : listJoin(who) + (who.length > 1 ? ' are ' + TYPES[t].pl : ' is ' + TYPES[t].a));
        });
        mvars.forEach((o) => {
          const i = M.marked.indexOf(o.x);
          const v = A.ans[i];
          if (v === 1 || v === 0) parts.push(v ? o.v.s : o.v.ns);
        });
        return cap(parts.join('; ')) + '.';
      }

      draw();
      if (!choice && nP) ctx.say('Click the tokens under each islander to mark them.', '');

      const inst = {
        noMoves: true,
        checkLabel: 'Declare',
        hint() {
          if (choice) {
            const st = nextStep(M, M.dom0.map((a) => a.slice()));
            if (!st || st.kind === 'search') return null;
            return { text: st.text, show() { flash(st.people, st.cons.filter((c) => c.kind === 'say').map((c) => c.k)); } };
          }
          const h = have();
          // a wrong mark first
          for (let j = 0; j < M.marked.length; j++) {
            const u = h[j];
            if (u == null || String(u) === String(A.ans[j])) continue;
            const x = M.marked[j];
            const nm = x < nP ? d.people[x] : (M.vars[x - nP].name || '').toLowerCase();
            let t;
            if (x < nP) t = A.ans[j] === '?' ? 'Look again at ' + nm + ': nobody can tell what ' + pron(nm).s + ' is from what was said — mark ' + pron(nm).o + ' **?**.' :
              u === '?' ? 'Look again at ' + nm + ': ' + pron(nm).p + ' kind *can* be worked out.' : 'Look again at ' + nm + ': ' + pron(nm).s + ' is not ' + TYPES[u].a + '.';
            else t = 'Your mark for ' + (M.vars[x - nP].what || nm) + ' is not right.';
            return { text: t, show() { flash([x], []); } };
          }
          const dom = M.dom0.map((a) => a.slice());
          M.marked.forEach((x, j) => {
            if (h[j] == null || h[j] === '?' || String(h[j]) !== String(A.ans[j])) return;
            dom[x] = [x < nP ? M.types.indexOf(h[j]) : h[j]];
          });
          const st = nextStep(M, dom);
          if (!st) {
            const left = h.filter((u) => u == null).length;
            if (!left) return 'Every mark is right — press **Declare**.';
            if (A.ans.includes('?')) return 'Everything that can be known is known. Whoever is left cannot be pinned down: mark them **?**.';
            return 'Your marks are right so far — mark the rest the same way.';
          }
          return { text: st.text, show() { flash(st.people.concat(st.x >= nP ? [st.x] : []), st.cons.filter((c) => c.kind === 'say').map((c) => c.k)); } };
        },
        solve() {
          if (choice) { box.feedback('The answer: <b>' + ctx.md(d.ask.choices[d.ask.ans].t) + '</b>', 'good'); return; }
          marks = A.ans.slice(0, nP);
          vm = {};
          mvars.forEach((o) => { vm[o.v.id] = A.ans[M.marked.indexOf(o.x)]; });
          draw();
          ctx.changed('solve');
        },
        explain() {
          const lines = reasoning(d, 10);
          if (!lines.length) return '';
          return 'One way to reason it out:\n\n' + lines.map((l, i) => (i + 1) + '. ' + l).join('\n\n') + (choice ? '' : '\n\n' + summary());
        },
        getState() { return { m: marks.slice(), v: Object.assign({}, vm), a: Object.assign({}, ann), l: lamp ? 1 : 0 }; },
        setState(s) {
          if (!s) return;
          marks = (s.m || []).slice(0, nP);
          while (marks.length < nP) marks.push(null);
          vm = Object.assign({}, s.v || {});
          ann = Object.assign({}, s.a || {});
          lamp = !!s.l;
          draw();
        },
        reset() { focus = -1; draw(); },
        key(ev) {
          if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey || choice) return false;
          const k = ev.key;
          const n = parseInt(k, 10);
          if (n >= 1 && n <= nP) { focus = n - 1; draw(); return true; }
          if (focus < 0) return false;
          if (k === 'ArrowRight') { focus = (focus + 1) % nP; draw(); return true; }
          if (k === 'ArrowLeft') { focus = (focus + nP - 1) % nP; draw(); return true; }
          if (k === 'Escape') { focus = -1; draw(); return false; }
          if (k === 'Delete' || k === 'Backspace') { if (marks[focus] != null) { marks[focus] = null; draw(); ctx.changed('mark'); } return true; }
          const low = k.toLowerCase();
          const t = tokTypes.find((tt) => (tt === '?' ? 'u' : TYPES[tt].key) === low);
          if (t) { if (marks[focus] !== t) setMark(focus, t); return true; }
          return false;
        },
        destroy() { clearTimeout(hl.t); wb.handlers.board = null; }
      };
      if (!choice) {
        inst.check = function () {
          const h = have();
          const missing = h.filter((u) => u == null).length;
          if (missing) {
            const pm = marks.filter((m) => m == null).length;
            return { solved: false, msg: pm ? (pm === nP ? 'Mark the islanders first.' : C.plural(pm, 'islander') + ' still unmarked.') : 'Settle ' + listJoin(mvars.filter((o) => vm[o.v.id] == null).map((o) => o.v.what || (o.v.name || o.v.id).toLowerCase())) + ' too.' };
          }
          const wrong = h.filter((u, j) => String(u) !== String(A.ans[j])).length;
          if (!wrong) return { solved: true, msg: summary() };
          return { solved: false, msg: wrong === 1 ? 'Not quite: one mark is wrong.' : 'Not quite: ' + wrong + ' marks are wrong.' };
        };
      }
      return inst;
    },

    thumb(p) {
      const d = p.data, n = d.people.length;
      const cw = 150;
      const W = n * cw, VW = Math.max(W, 3 * cw), H = VW * 0.75;
      const vx = (W - VW) / 2;
      let s = '<svg viewBox="' + (vx - 20) + ' -30 ' + (VW + 40) + ' ' + (H + 20) + '" preserveAspectRatio="xMidYMid meet">';
      const base = H - 40;
      s += '<rect x="' + (vx - 20) + '" y="' + (base - 14) + '" width="' + (VW + 40) + '" height="80" fill="rgba(217,160,91,.22)"/>';
      if (d.scene === 'doors') for (let i = 0; i < n; i++) s += '<path transform="translate(' + (cw * (i + 0.5)) + ' ' + (base - 10) + ')" d="M-52 0V-150Q-52 -190 0 -190Q52 -190 52 -150V0Z" fill="#8a5a26" opacity=".5"/>';
      if ((d.types || []).includes('lark')) s += sunMoon(vx + VW - 30, 20, null);
      d.people.forEach((name, i) => {
        s += '<g transform="translate(' + (cw * (i + 0.5)) + ' ' + base + ') scale(.95)">' + islanderSVG(name, null) + '</g>';
        const said = (d.says || []).some((st) => st.s === i);
        if (said) s += '<g transform="translate(' + (cw * (i + 0.5) + 20) + ' ' + (base - 205) + ')"><rect x="-34" y="-22" width="68" height="36" rx="14" fill="var(--paper)" opacity=".92"/><path d="M-10 13l-6 14 14 -14z" fill="var(--paper)" opacity=".92"/><text y="5" text-anchor="middle" font-size="26" font-weight="800" fill="#6b5a3a">' + (d.says.find((st) => st.s === i).q ? (d.says.find((st) => st.s === i).w === 'da' || d.says.find((st) => st.s === i).w === 'ja' ? d.says.find((st) => st.s === i).w : '?') : '…') + '</text></g>';
      });
      if (d.ask) s += '<text x="' + (vx + VW - 10) + '" y="' + (base - 150) + '" text-anchor="end" font-size="64" font-weight="800" fill="var(--gold)">?</text>';
      return s + '</svg>';
    }
  });

  C.knaves = { model, analyse, worlds, grade, nextStep, reasoning, say, stText, choiceResults, makePuzzle, makeData, levelOf, dress, TYPES, NAMES, PLACES, TWILIGHT_PLACES, DAJA_PLACES, MIXED_PLACES, DAY_VAR, DA_VAR };

  C.css('knaves', `
    .kn-hit { fill: transparent; }
    .kn-fig { cursor: pointer; }
    .kn-person.hinted .kn-fig { filter: drop-shadow(0 0 7px var(--gold)); }
    .kn-focus { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-dasharray: 6 5; }
    .kn-name { font: 700 16px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .kn-tok { cursor: pointer; }
    .kn-tok rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; transition: fill .15s; }
    .kn-tok:hover rect { stroke: var(--accent); }
    .kn-tok text { font: 700 11.5px "Segoe UI", system-ui, sans-serif; fill: var(--muted); pointer-events: none; }
    .kn-tok.on rect { stroke: rgba(0,0,0,.35); }
    .kn-tok.on text { fill: #1d1d24; }
    .kn-bub { cursor: pointer; }
    .kn-bubbg { fill: var(--paper); stroke: rgba(0,0,0,.18); stroke-width: 1.5; }
    .kn-tail { fill: var(--paper); stroke: none; }
    .kn-say { font: 600 14px "Segoe UI", system-ui, sans-serif; fill: #2a2433; pointer-events: none; }
    .kn-bub:hover .kn-bubbg { stroke: var(--accent); }
    .kn-bub.ann-t .kn-bubbg { stroke: var(--green); stroke-width: 3; }
    .kn-bub.ann-f .kn-bubbg { stroke: var(--red); stroke-width: 3; }
    .kn-bub.ann-f .kn-say { fill: #6d6470; }
    .kn-bub.deco .kn-say { font-style: italic; fill: #6d6470; }
    .kn-bub.deco .kn-bubbg, .kn-bub.deco .kn-tail { fill: var(--paper-back); }
    .kn-annb { fill: var(--panel); stroke: var(--line); }
    .kn-bub.ann-t .kn-annb { fill: var(--green); } .kn-bub.ann-f .kn-annb { fill: var(--red); }
    .kn-annt { font: 800 12px "Segoe UI", system-ui, sans-serif; fill: #fff; pointer-events: none; }
    .kn-bub.lamp-bad .kn-bubbg { stroke: var(--red); stroke-width: 3.5; stroke-dasharray: 7 4; }
    .kn-bub.lamp-ok .kn-bubbg { stroke: var(--green); stroke-width: 2; }
    .kn-clash { font: 700 11px "Segoe UI", system-ui, sans-serif; fill: var(--red); }
    .kn-bub.hinted .kn-bubbg { stroke: var(--gold); stroke-width: 4; filter: drop-shadow(0 0 6px var(--gold)); }
    .kn-door { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .kn-varbg { fill: var(--panel); stroke: var(--line); stroke-width: 1.5; }
    .kn-var.hinted .kn-varbg { stroke: var(--gold); stroke-width: 4; }
    .kn-vname { font: 700 14px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .kn-vglyph { font: 800 40px Georgia, serif; fill: var(--gold); }
    .kn-legend { display: flex; flex-direction: column; gap: 4px; width: 100%; font-size: .82rem; color: var(--muted); }
    .kn-leg { display: flex; align-items: center; gap: 6px; }
    .kn-leg i { width: 11px; height: 11px; border-radius: 50%; flex: 0 0 auto; }
    .kn-leg b { color: var(--text); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
