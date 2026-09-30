/* The Puzzle Cabinet · engines/words.js
 *
 * Word puzzles on the letter tiles of the workbench: three kinds.
 *
 *   ladder   Lewis Carroll's Doublets (1879): turn one word into another by
 *            changing one letter at a time, every step a real word.
 *            data: { kind: 'ladder', from: 'head', to: 'tail' }   p.par = fewest steps
 *   crypto   a quotation enciphered by a letter substitution in which no
 *            letter stands for itself. Crack it.
 *            data: { kind: 'crypto', q: 'QUOTE', c: 'CIPHER', key: 'QWERTY…' (cipher letter
 *                    for A, B, C …), given: 'ET' (plain letters shown at the start),
 *                    by: 'Author', src: 'Work (year)' }
 *   anagram  unscramble letter tiles into a word (or a famous pair of words).
 *            data: { kind: 'anagram', letters: 'LMECA', words: ['camel'],
 *                    theme: 'animal' | 'pairs' | null, any: false }
 *              theme: the answer is the only word of that theme with these letters;
 *              no theme: the only word in the dictionary; any: every dictionary word counts.
 *
 * The dictionary is js/lib/wordlist.js (Cabinet.words).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const Wd = () => C.words;
  const up = (s) => String(s).toUpperCase();
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

  /* =====================================================================
   * Word ladders: the graph of words one letter apart
   * ===================================================================== */

  const graphs = {};
  function graph(n) {
    if (graphs[n]) return graphs[n];
    const words = Wd().list(n);
    const idx = new Map(words.map((w, i) => [w, i]));
    const core = Uint8Array.from(words, (w) => (Wd().isCore(w) ? 1 : 0));
    const buckets = new Map();
    words.forEach((w, i) => {
      for (let k = 0; k < n; k++) {
        const pat = w.slice(0, k) + '_' + w.slice(k + 1);
        const b = buckets.get(pat);
        if (b) b.push(i); else buckets.set(pat, [i]);
      }
    });
    const adj = words.map(() => []);
    buckets.forEach((b) => { for (const i of b) for (const j of b) if (i !== j) adj[i].push(j); });
    graphs[n] = { n, words, idx, core, adj };
    return graphs[n];
  }

  // distances (in steps) from word index s; coreOnly: walk only through common words
  function bfs(g, s, coreOnly) {
    const dist = new Int16Array(g.words.length).fill(-1);
    dist[s] = 0;
    let q = [s];
    while (q.length) {
      const nq = [];
      for (const v of q) {
        for (const u of g.adj[v]) {
          if (dist[u] >= 0 || (coreOnly && !g.core[u])) continue;
          dist[u] = dist[v] + 1;
          nq.push(u);
        }
      }
      q = nq;
    }
    return dist;
  }

  function hamming(a, b) {
    if (a.length !== b.length) return 99;
    let d = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
    return d;
  }

  // everything about the shortest ladders from a to b: the steps, one best ladder
  // (fewest uncommon words, then alphabetical) and how many shortest ladders there are
  function ladder(a, b) {
    a = String(a).toLowerCase(); b = String(b).toLowerCase();
    if (a.length !== b.length) return null;
    const g = graph(a.length);
    const ia = g.idx.get(a), ib = g.idx.get(b);
    if (ia == null || ib == null) return null;
    const d = bfs(g, ib, false);
    if (d[ia] < 0) return { steps: -1, path: null, count: 0 };
    // cost to the goal along shortest ladders: uncommon words cost 1
    const memo = new Map();
    const best = (v) => {
      if (v === ib) return { cost: 0, next: -1, count: 1 };
      if (memo.has(v)) return memo.get(v);
      let r = { cost: 1e9, next: -1, count: 0 };
      for (const u of g.adj[v]) {
        if (d[u] !== d[v] - 1) continue;
        const bu = best(u);
        r.count += bu.count;
        const c = bu.cost + (g.core[u] ? 0 : 1);
        if (c < r.cost || (c === r.cost && r.next >= 0 && g.words[u] < g.words[r.next])) { r.cost = c; r.next = u; }
      }
      memo.set(v, r);
      return r;
    };
    const path = [a];
    for (let v = ia; v !== ib;) { v = best(v).next; path.push(g.words[v]); }
    return { steps: d[ia], path, count: best(ia).count, rare: best(ia).cost };
  }

  // endless and stored ladders: a pair of common words whose shortest ladder is `band` steps
  // long and can be climbed on common words alone
  const LADDER_BAND = [null, [3, 3], [4, 4], [5, 5], [6, 6], [7, 10]];
  // good words, but not ones to build a cheerful puzzle around
  const NOEND = new Set('kill dead death die dies died gun guns bomb bombs drug drugs evil hate war wars fat ugly sick grave tomb blood knife fight fights'.split(' '));
  const endOK = (w) => Wd().isBase(w) && !NOEND.has(w);
  function makeLadder(rng, level, n) {
    const band = LADDER_BAND[level];
    for (let tries = 0; tries < 60; tries++) {
      const len = n || (level <= 2 ? rng.pick([3, 4, 4]) : level <= 4 ? rng.pick([4, 4, 5]) : rng.pick([4, 5, 5]));
      const g = graph(len);
      const pool = g.words.filter((w, i) => g.core[i] && g.adj[i].length >= 2 && endOK(w));
      const a = rng.pick(pool);
      const ia = g.idx.get(a);
      const dc = bfs(g, ia, true), df = bfs(g, ia, false);
      const targets = [];
      for (let i = 0; i < g.words.length; i++) {
        if (!g.core[i] || dc[i] < band[0] || dc[i] > band[1] || df[i] !== dc[i] || !endOK(g.words[i])) continue;
        targets.push(i);
      }
      if (!targets.length) continue;
      // prefer the longer ones on the hardest level
      const t = level === 5 ? targets.sort((x, y) => dc[y] - dc[x])[Math.min(targets.length - 1, rng.int(Math.max(1, Math.ceil(targets.length / 4))))] : rng.pick(targets);
      return { from: a, to: g.words[t], par: dc[t] };
    }
    return null;
  }

  /* =====================================================================
   * Cryptograms
   * ===================================================================== */

  function derangement(rng) {
    for (;;) {
      const p = rng.shuffle(AZ.split(''));
      if (p.every((c, i) => c !== AZ[i])) return p.join('');
    }
  }
  function encipher(q, key) {
    return up(q).replace(/[A-Z]/g, (ch) => key[ch.charCodeAt(0) - 65]);
  }
  function decipher(c, key) {
    const inv = {};
    for (let i = 0; i < 26; i++) inv[key[i]] = AZ[i];
    return c.replace(/[A-Z]/g, (ch) => inv[ch]);
  }
  function letterCounts(s) {
    const n = {};
    for (const ch of up(s)) if (ch >= 'A' && ch <= 'Z') n[ch] = (n[ch] || 0) + 1;
    return n;
  }
  const lettersIn = (s) => (up(s).match(/[A-Z]/g) || []).length;
  const QUOTE_OK = /^[A-Za-z .,;:!?'"()\-]+$/;

  // make a cipher with no rude cipher words; givens: how many plain letters to show
  function makeCipher(rng, q, givens) {
    let key = null, c = null;
    for (let t = 0; t < 40; t++) {
      key = derangement(rng);
      c = encipher(q, key);
      if (Wd().clean(c.replace(/[^A-Z ]/g, ' ').split(/ +/).join('|'))) break;
    }
    const counts = letterCounts(q);
    const order = Object.keys(counts).sort((x, y) => counts[y] - counts[x] || (x < y ? -1 : 1));
    let given = '';
    if (givens >= 3) given = order.slice(0, 3).join('');
    else if (givens > 0) {
      const pool = order.slice(1, Math.min(order.length, givens === 2 ? 7 : 9));
      rng.shuffle(pool);
      given = pool.slice(0, givens).join('');
    }
    return { c, key, given };
  }

  const CRYPTO_BAND = [null, [15, 52, 3], [30, 75, 2], [45, 100, 1], [60, 220, 0], [20, 60, 0]];

  /* =====================================================================
   * Anagrams
   * ===================================================================== */

  const key = (s) => String(s).toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');

  // every answer that the checker would accept (for verify and for feedback)
  function anagramAnswers(d) {
    const W = Wd();
    const lens = d.words.map((w) => w.length);
    const k = key(d.letters);
    if (d.words.length === 1) {
      if (d.theme) return W.theme(d.theme).words.filter((w) => w.length === lens[0] && key(w) === k).map((w) => [w]);
      return W.anagrams(k).filter((w) => w.length === lens[0]).map((w) => [w]);
    }
    const out = [];
    if (d.theme === 'pairs') {
      W.pairs().forEach((p) => {
        if (key(p[0] + p[1]) !== k) return;
        if (p[0].length === lens[0] && p[1].length === lens[1]) out.push(p);
        else if (p[1].length === lens[0] && p[0].length === lens[1]) out.push([p[1], p[0]]);
      });
      return out;
    }
    const T = W.theme(d.theme);
    const A = T.words.filter((w) => w.length === lens[0]), B = new Set(T.words.filter((w) => w.length === lens[1]));
    const seen = new Set();
    A.forEach((x) => {
      const rest = removeLetters(k, x);
      if (rest == null) return;
      B.forEach((y) => {
        if (y === x || key(y) !== rest) return;
        const id = [x, y].sort().join('+');
        if (seen.has(id)) return;
        seen.add(id);
        out.push([x, y]);
      });
    });
    return out;
  }
  function removeLetters(sortedKey, w) {
    const a = sortedKey.split('');
    for (const ch of w) { const i = a.indexOf(ch); if (i < 0) return null; a.splice(i, 1); }
    return a.join('');
  }
  // is this arrangement (list of words) a solution?
  function anagramAccepts(d, arr) {
    const got = arr.map((w) => String(w).toLowerCase());
    if (got.join('').length !== d.letters.length || key(got.join('')) !== key(d.letters)) return false;
    if (d.any && got.length === 1) return Wd().has(got[0]);
    return anagramAnswers(d).some((ans) => ans.length === got.length && (ans.every((w, i) => w === got[i]) || (got.length === 2 && got[0].length === got[1].length && ans[0] === got[1] && ans[1] === got[0])));
  }

  // shuffle letters so that they do not spell an answer or a word, and most letters move
  function scramble(rng, word, avoid) {
    const s = word.toLowerCase().replace(/[^a-z]/g, '');
    const n = s.length;
    let best = null;
    for (let t = 0; t < 200; t++) {
      const p = rng.shuffle(s.split('')).join('');
      if (p === s || (avoid && avoid(p))) continue;
      if (!Wd().clean(p)) continue;
      let moved = 0;
      for (let i = 0; i < n; i++) if (p[i] !== s[i]) moved++;
      if (moved >= Math.ceil(n * 0.6)) return p;
      if (!best) best = p;
    }
    return best;
  }

  function anagramLevel(d) {
    const n = d.words.join('').length;
    let lv;
    if (d.words.length === 1) lv = n <= 5 ? 1 : n === 6 ? 2 : n === 7 ? 3 : n === 8 ? 4 : 5;
    else lv = n <= 7 ? 2 : n <= 9 ? 3 : n <= 11 ? 4 : 5;
    if (!d.theme && !d.any) lv += 1;
    if (d.any) lv -= 1;
    return Math.max(1, Math.min(5, lv));
  }

  function makeAnagram(rng, level) {
    const W = Wd();
    for (let tries = 0; tries < 80; tries++) {
      let d;
      const r = rng();
      if (level >= 3 && r < 0.3) {
        // a pair: two words of one theme, or a famous pair
        if (rng() < 0.5) {
          const p = rng.pick(W.pairs());
          d = { kind: 'anagram', words: p.slice(), theme: 'pairs' };
        } else {
          const T = W.theme(rng.pick(['animal', 'bird', 'food', 'colour', 'country', 'body', 'clothes']));
          const x = rng.pick(T.words), y = rng.pick(T.words);
          if (x === y) continue;
          d = { kind: 'anagram', words: [x, y], theme: T.id };
        }
      } else if (level >= 3 && r < 0.45) {
        // a plain word with only one anagram in the dictionary
        const n = level === 3 ? 6 : level === 4 ? 7 : 7;
        const w = rng.pick(W.list(n, true).filter((x) => W.isBase(x)));
        d = { kind: 'anagram', words: [w], theme: null };
      } else {
        const T = W.theme(rng.pick(W.themeIds));
        d = { kind: 'anagram', words: [rng.pick(T.words)], theme: T.id };
      }
      if (anagramLevel(d) !== level) continue;
      const answers = anagramAnswers(Object.assign({ letters: d.words.join('') }, d));
      if (answers.length !== 1) continue;
      const letters = scramble(rng, d.words.join(''), (p) => W.has(p) || (d.words.length === 1 && d.theme && W.theme(d.theme).set.has(p)));
      if (!letters) continue;
      d.letters = letters;
      return d;
    }
    return null;
  }

  function anagramStatement(d) {
    const W = Wd();
    const lens = d.words.map((w) => w.length);
    if (d.any) return 'Rearrange all ' + d.letters.length + ' letters to make **any English word**.';
    if (d.theme === 'pairs') return 'These letters make a famous pair — two words that go together, like *salt and pepper* (' + lens.join(' + ') + ' letters).';
    if (d.theme && d.words.length === 2) return 'These letters make **two ' + W.theme(d.theme).many + '** (' + lens.join(' + ') + ' letters).';
    if (d.theme) return 'Unscramble the letters to make **' + W.theme(d.theme).name + '**.';
    return 'Unscramble the letters to make a word — there is only one.';
  }

  /* =====================================================================
   * Checking the puzzles
   * ===================================================================== */

  function verifyLadder(p) {
    const d = p.data;
    const a = String(d.from || '').toLowerCase(), b = String(d.to || '').toLowerCase();
    if (!a || a.length !== b.length) return { ok: false, err: 'from and to must be words of the same length' };
    if (!Wd().has(a) || !Wd().has(b)) return { ok: false, err: 'not in the dictionary: ' + [a, b].filter((w) => !Wd().has(w)).join(', ') };
    if (a === b) return { ok: false, err: 'from and to are the same' };
    const L = ladder(a, b);
    if (!L || L.steps < 0) return { ok: false, err: 'no ladder from ' + a + ' to ' + b };
    if (p.par == null) return { ok: false, err: 'par is missing (it is ' + L.steps + ')' };
    if (p.par !== L.steps) return { ok: false, err: 'par is ' + p.par + ' but the shortest ladder has ' + L.steps + ' steps' };
    return { ok: true, par: L.steps };
  }

  function verifyCrypto(p) {
    const d = p.data;
    if (!d.q || !d.c || !d.key) return { ok: false, err: 'q, c and key are needed' };
    if (!QUOTE_OK.test(d.q)) return { ok: false, err: 'the quotation has characters I cannot show: ' + d.q.replace(/[A-Za-z .,;:!?'"()\-]/g, '') };
    if (!/^[A-Z]{26}$/.test(d.key) || new Set(d.key).size !== 26) return { ok: false, err: 'the key is not a rearrangement of the alphabet' };
    for (let i = 0; i < 26; i++) if (d.key[i] === AZ[i]) return { ok: false, err: 'the key maps ' + AZ[i] + ' to itself' };
    if (encipher(d.q, d.key) !== d.c) return { ok: false, err: 'the cipher text does not match the quotation' };
    if (decipher(d.c, d.key) !== up(d.q)) return { ok: false, err: 'the cipher text does not decode to the quotation' };
    const counts = letterCounts(d.q);
    const given = d.given || '';
    for (const ch of given) if (!counts[ch]) return { ok: false, err: 'given letter ' + ch + ' is not in the quotation' };
    if (given.length >= Object.keys(counts).length) return { ok: false, err: 'every letter is given' };
    if (!d.by) return { ok: false, err: 'no author' };
    return { ok: true };
  }

  function verifyAnagram(p) {
    const d = p.data;
    if (!d.letters || !d.words || !d.words.length) return { ok: false, err: 'letters and words are needed' };
    if (key(d.letters) !== key(d.words.join(''))) return { ok: false, err: 'the letters do not make the answer' };
    if (d.letters !== d.letters.toLowerCase()) return { ok: false, err: 'letters must be lower case' };
    if (d.theme && d.theme !== 'pairs' && !Wd().theme(d.theme)) return { ok: false, err: 'unknown theme ' + d.theme };
    if (d.any) {
      if (d.words.length !== 1 || !Wd().has(d.words[0])) return { ok: false, err: 'the answer is not in the dictionary' };
      if (Wd().has(d.letters)) return { ok: false, err: 'the scramble is already a word' };
      return { ok: true };
    }
    const answers = anagramAnswers(d);
    if (!answers.length || !anagramAccepts(d, d.words)) return { ok: false, err: 'the answer is not accepted by its own checker' };
    if (answers.length > 1) return { ok: false, err: 'more than one answer: ' + answers.map((a) => a.join(' ')).join(', ') };
    if (d.words.length === 1 && (Wd().has(d.letters) || d.letters === d.words[0])) return { ok: false, err: 'the scramble is already a word' };
    if (!Wd().clean(d.letters)) return { ok: false, err: 'the scramble spells something rude' };
    return { ok: true };
  }

  const TOOLS = ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'];

  /* =====================================================================
   * Drawing helpers
   * ===================================================================== */

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
  const ordinal = (i) => ORD[i] || (i + 1) + 'th';

  // the stage's width / height, to choose a layout that fills it
  function stageAspect(wb) {
    const el = wb.host || wb.svg;
    const w = el && el.clientWidth, h = el && el.clientHeight;
    return w > 40 && h > 40 ? w / h : 1.5;
  }
  // how large a block of world size (w, h) would be drawn on a stage of this aspect (bigger = better)
  const fitScale = (aspect, w, h) => Math.min(aspect * 1000 / w, 1000 / h);

  // an on-board keyboard: tap the keys with a finger or a mouse
  const KB_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', '<ZXCVBNM>'];
  const KB = { kw: 40, kh: 50, gap: 6, w: 454, h: 162 };
  function drawKeyboard(ctx, parent, x0, y0, labels) {
    const g = ctx.s('g', { class: 'wd-kb' }, parent);
    const keys = {};
    KB_ROWS.forEach((row, r) => {
      const chars = row.split('');
      const wid = (c) => (c === '<' || c === '>' ? KB.kw * 1.5 + KB.gap / 2 : KB.kw);
      const total = chars.reduce((s, c) => s + wid(c), 0) + KB.gap * (chars.length - 1);
      let x = x0 + (KB.w - total) / 2;
      const y = y0 + r * (KB.kh + KB.gap);
      chars.forEach((c) => {
        const w = wid(c);
        const kg = ctx.s('g', { class: 'wd-key' + (c === '<' || c === '>' ? ' wd-special' : ''), 'data-kb': c }, g);
        ctx.s('rect', { x, y, width: w, height: KB.kh, rx: 8 }, kg);
        const lab = c === '<' ? (labels && labels['<']) || '⌫' : c === '>' ? (labels && labels['>']) || 'Enter' : c;
        ctx.s('text', { x: x + w / 2, y: y + KB.kh / 2 + (c.length && /[A-Z]/.test(c) ? 8 : 6), 'text-anchor': 'middle', class: 'wd-keyt' + (lab.length > 2 ? ' small' : ''), text: lab }, kg);
        const sub = ctx.s('text', { x: x + w - 6, y: y + 14, 'text-anchor': 'end', class: 'wd-keysub' }, kg);
        keys[c] = { g: kg, sub };
        x += w + KB.gap;
      });
    });
    return keys;
  }
  function flashKey(keys, c) {
    const k = keys && keys[c];
    if (!k) return;
    k.g.classList.remove('down');
    void k.g.getBBox;
    k.g.classList.add('down');
    setTimeout(() => k.g.classList.remove('down'), 160);
  }
  function shake(el) {
    if (!el) return;
    el.classList.remove('wd-shake');
    void (el.getBoundingClientRect && el.getBoundingClientRect());
    el.classList.add('wd-shake');
    setTimeout(() => el.classList.remove('wd-shake'), 480);
  }

  /* =====================================================================
   * Word ladders: the board
   * ===================================================================== */

  function mountLadder(ctx, p) {
    const wb = ctx.wb, d = p.data;
    const from = String(d.from).toLowerCase(), to = String(d.to).toLowerCase(), n = from.length;
    const best = ladder(from, to) || { steps: p.par, path: [from, to], count: 1 };
    const par = p.par != null ? p.par : best.steps;
    let words = [from];
    let input = new Array(n).fill('');
    let cur = 0, fresh = null, popAt = -1, hintCol = -1, busy = false, bad = false;
    let lastHint = null;
    const timers = [];
    const T = 58, G = 8, R = 74, RAIL = 30;
    const WW = n * T + (n - 1) * G;
    const aspect = stageAspect(wb);
    let boundsRows = -1;

    ctx.setGoal('Reach **' + up(to) + '**. Change one letter at a time; every rung must be a word.');
    const board = wb.layer('board');
    const root_ = ctx.s('g', { class: 'wd wd-ladder' }, board);
    const colX = (c) => c * (T + G);
    const solved = () => words[words.length - 1] === to;

    // dashed rungs still to go before par (at most three are drawn)
    const ghosts = () => Math.min(3, Math.max(0, par - (words.length - 1) - 2));
    function rows() {
      if (solved()) return words.length;
      return words.length + 1 + ghosts() + 1;
    }
    function layout(nr) {
      const LH = nr * R - (R - T);
      const side = { W: WW + 2 * RAIL + 70 + KB.w, H: Math.max(LH, KB.h) };
      const below = { W: Math.max(WW + 2 * RAIL, KB.w), H: LH + 46 + KB.h };
      const useSide = fitScale(aspect, side.W, side.H) >= fitScale(aspect, below.W, below.H);
      const L = { LH, side: useSide };
      if (useSide) {
        L.x0 = 0; L.kx = WW + RAIL + 70; L.ky = Math.max(0, (LH - KB.h) / 2);
        L.box = { x0: -RAIL - 14, y0: -24, x1: L.kx + KB.w + 10, y1: Math.max(LH, L.ky + KB.h) + 24 };
      } else {
        const W = Math.max(WW + 2 * RAIL, KB.w);
        L.x0 = (W - 2 * RAIL - WW) / 2; L.kx = (W - 2 * RAIL - KB.w) / 2; L.ky = LH + 46;
        L.box = { x0: -RAIL - 14, y0: -24, x1: W - RAIL + 14, y1: L.ky + KB.h + 16 };
      }
      return L;
    }

    let keys = null, inputRow = null;
    function draw() {
      root_.innerHTML = '';
      const nr = rows();
      const L = layout(nr);
      if (nr !== boundsRows) { wb.setBounds(L.box, 0.05); boundsRows = nr; }
      const g = ctx.s('g', { transform: 'translate(' + L.x0 + ' 0)' }, root_);
      // the ladder's rails
      ctx.s('rect', { x: -RAIL - 8, y: -18, width: 12, height: L.LH + 36, rx: 6, class: 'wd-rail' }, g);
      ctx.s('rect', { x: WW + RAIL - 4, y: -18, width: 12, height: L.LH + 36, rx: 6, class: 'wd-rail' }, g);
      const last = words[words.length - 1];
      let row = 0;
      const drawRow = (letters, cls, rowIdx, opts) => {
        const y = row * R;
        const rg = ctx.s('g', { class: 'wd-row ' + cls + (rowIdx === fresh ? ' fresh' : '') }, g);
        ctx.s('rect', { x: -RAIL, y: y + T / 2 - 4, width: WW + 2 * RAIL, height: 8, rx: 4, class: 'wd-rung' }, rg);
        for (let c = 0; c < n; c++) {
          const ch = letters[c] || '';
          const extra = opts && opts.cls ? opts.cls(c, ch) : '';
          const tg = ctx.s('g', { class: 'wd-tile ' + extra, 'data-tile': rowIdx + ',' + c, 'data-key': 'wl-' + rowIdx + '-' + c, style: rowIdx === fresh ? 'animation-delay:' + (c * 40) + 'ms' : null }, rg);
          ctx.s('rect', { x: colX(c), y, width: T, height: T, rx: 9, class: 'wd-tbg' }, tg);
          ctx.s('text', { x: colX(c) + T / 2, y: y + T / 2 + 11, 'text-anchor': 'middle', class: 'wd-tl', text: up(ch) }, tg);
          if (opts && opts.ph && !ch) ctx.s('text', { x: colX(c) + T / 2, y: y + T / 2 + 11, 'text-anchor': 'middle', class: 'wd-tl ph', text: up(opts.ph[c]) }, tg);
        }
        if (opts && opts.label) ctx.s('text', { x: WW + RAIL + 16, y: y + T / 2 + 5, class: 'wd-rowlab', text: opts.label }, rg);
        row++;
        return rg;
      };
      // the start, then every rung so far
      words.forEach((w, i) => {
        const isGoal = i === words.length - 1 && w === to && i > 0;
        const prev = words[i - 1];
        drawRow(w, i === 0 ? 'start' : isGoal ? 'goal done' : 'word', i, {
          label: i === 0 ? 'start' : String(i),
          cls: (c) => (i > 0 && prev[c] !== w[c] ? 'chg' : '') + (i === words.length - 1 && c === hintCol ? ' hinted' : '') + (i === words.length - 1 && !solved() ? ' tap' : '')
        });
      });
      inputRow = null;
      if (!solved()) {
        const diffs = input.map((ch, c) => (ch && ch !== last[c] ? 1 : 0)).reduce((a, b) => a + b, 0);
        inputRow = drawRow(input, 'input' + (bad ? ' bad' : ''), -1, {
          ph: last,
          label: String(words.length),
          cls: (c) => 'slot' + (c === cur ? ' cur' : '') + (input[c] ? ' typed' : '') + (input[c] && input[c] !== last[c] ? (diffs > 1 ? ' over' : ' diff') : '') + (c === popAt ? ' pop' : '')
        });
        const k = words.length - 1, gN = ghosts(), more = Math.max(0, par - k - 2);
        for (let gI = 0; gI < gN; gI++) drawRow([], 'ghost', -2, { label: gI === gN - 1 && more > gN ? '⋮' : '' });
        drawRow(to, 'goal', -3, { label: 'goal', cls: (c) => (to[c] === last[c] ? 'got' : '') });
        ctx.s('text', { x: WW + RAIL + 16, y: (row - 1) * R + T / 2 + 22, class: 'wd-rowlab par', text: 'par ' + par }, g);
      }
      // the keyboard
      keys = drawKeyboard(ctx, root_, L.kx, L.ky, { '>': 'Enter' });
      popAt = -1; fresh = null;
      wb.applyPaints();
    }

    function say(msg, kind) { ctx.say(msg, kind); }
    function reject(msg) {
      bad = true;
      ctx.sfx('wrong');
      say(msg, 'warn');
      draw();
      shake(inputRow);
    }

    function typeLetter(ch) {
      if (busy || solved()) return;
      ch = ch.toLowerCase();
      bad = false;
      input[cur] = ch;
      popAt = cur;
      ctx.sfx('tap');
      let nx = -1;
      for (let i = cur + 1; i < n; i++) if (!input[i]) { nx = i; break; }
      if (nx < 0) for (let i = 0; i < cur; i++) if (!input[i]) { nx = i; break; }
      if (nx < 0) { draw(); submit(false); return; }
      cur = nx;
      draw();
    }
    function backspace() {
      if (busy || solved()) return;
      bad = false;
      if (input[cur]) input[cur] = '';
      else {
        let i = cur - 1;
        while (i >= 0 && !input[i]) i--;
        if (i < 0) { i = input.findIndex(Boolean); }
        if (i >= 0) { input[i] = ''; cur = i; }
        else {
          if (words.length > 1) {
            const w = words.pop();
            ctx.move(words.length - 1);
            say('Took **' + up(w) + '** off the ladder.');
            input = new Array(n).fill(''); cur = 0;
            draw();
            ctx.changed('rung');
            return;
          }
        }
      }
      draw();
    }
    function submit(fill) {
      if (busy || solved()) return;
      const last = words[words.length - 1];
      if (!input.some(Boolean)) { say('Type the next word — or click a letter of **' + up(last) + '** and type its replacement.', 'info'); return; }
      const w = input.map((c, i) => c || (fill ? last[i] : '')).join('');
      if (w.length < n) { reject('Fill in all ' + n + ' letters (Enter fills the empty ones from ' + up(last) + ').'); return; }
      if (w === last) { reject('That is the word you are standing on. Change one letter.'); return; }
      const h = hamming(w, last);
      if (h > 1) { reject('**' + up(w) + '** changes ' + h + ' letters of ' + up(last) + ' — a ladder changes only one at a time.'); return; }
      if (!Wd().has(w)) { reject('**' + up(w) + '** is not in my dictionary. Try another letter.'); return; }
      if (words.includes(w)) { reject('**' + up(w) + '** is already on the ladder.'); return; }
      bad = false;
      words.push(w);
      fresh = words.length - 1;
      let msg = 'Rung ' + (words.length - 1) + ': **' + up(w) + '**.';
      if (w !== to && hamming(w, to) === 1) { words.push(to); msg = '**' + up(w) + '** is one letter from **' + up(to) + '** — the last rung falls into place.'; }
      input = new Array(n).fill('');
      cur = 0; hintCol = -1;
      ctx.move(words.length - 1);
      ctx.sfx('snap');
      if (!solved()) say(msg);
      draw();
      ctx.changed('rung');
    }

    function tapTile(r, c) {
      if (busy || solved()) return;
      if (r === -1) { cur = c; draw(); return; }
      if (r === words.length - 1) {
        const last = words[r];
        input = last.split('');
        input[c] = '';
        cur = c; bad = false;
        say('Type the new ' + ordinal(c) + ' letter for **' + up(last) + '**.', 'info');
        draw();
        return;
      }
      if (r === -3) { ctx.toast('That is where you are going.'); return; }
      if (r >= 0) ctx.toast('To climb back down: Undo, or Backspace on an empty rung.');
    }
    function pressKey(k) {
      flashKey(keys, k);
      if (k === '<') backspace();
      else if (k === '>') submit(true);
      else typeLetter(k);
    }

    wb.handlers.board = {
      down(pt, ev, el) {
        const kb = el && el.closest && el.closest('[data-kb]');
        if (kb) { pressKey(kb.getAttribute('data-kb')); return true; }
        const t = el && el.closest && el.closest('[data-tile]');
        if (t) { const rc = t.getAttribute('data-tile').split(',').map(Number); tapTile(rc[0], rc[1]); return true; }
        return false;
      }
    };

    draw();
    ctx.stat('Moves', 0);

    return {
      check() {
        if (solved()) {
          const k = words.length - 1;
          return { solved: true, msg: up(from) + ' became ' + up(to) + ' in ' + C.plural(k, 'step') + (k <= par ? ' — par!' : ' (par is ' + par + ').') };
        }
        return { solved: false, msg: 'The ladder has not reached ' + up(to) + ' yet.' };
      },
      hint() {
        const last = words[words.length - 1];
        if (last === to) return 'You are there!';
        const L = ladder(last, to);
        if (!L || L.steps < 0) return 'From **' + up(last) + '** there is no ladder to ' + up(to) + ' at all — climb back down a rung or two (Undo or Backspace).';
        const next = L.path[1];
        let col = 0;
        while (col < n && next[col] === last[col]) col++;
        if (!lastHint || lastHint.word !== last) {
          lastHint = { word: last };
          return {
            text: 'Change the **' + ordinal(col) + '** letter of ' + up(last) + ' (the ' + up(last[col]) + '). From here the goal is ' + C.plural(L.steps, 'step') + ' away.',
            show() { hintCol = col; draw(); timers.push(setTimeout(() => { hintCol = -1; draw(); }, 4000)); }
          };
        }
        lastHint = { word: last, done: true };
        return {
          text: 'Try **' + up(next) + '**' + (L.steps > 1 ? ' — then ' + C.plural(L.steps - 1, 'more step') + '.' : ', and you are there.'),
          show() { hintCol = col; draw(); timers.push(setTimeout(() => { hintCol = -1; draw(); }, 4000)); }
        };
      },
      solve() {
        timers.forEach(clearTimeout);
        busy = true;
        const path = best.path;
        words = [from]; input = new Array(n).fill(''); cur = 0; bad = false;
        draw();
        let i = 1;
        const step = () => {
          if (i >= path.length) { busy = false; ctx.move(words.length - 1); draw(); ctx.changed('solve'); return; }
          words.push(path[i++]);
          fresh = words.length - 1;
          ctx.sfx('tap');
          draw();
          timers.push(setTimeout(step, C.anim(430)));
        };
        timers.push(setTimeout(step, C.anim(260)));
      },
      explain() {
        if (!best.path) return '';
        return 'One shortest ladder (' + C.plural(best.steps, 'step') + '): ' + best.path.map(up).join(' → ') + '. ' +
          (best.count > 1 ? 'There are ' + best.count + ' shortest ladders in this dictionary.' : 'It is the only shortest ladder in this dictionary.');
      },
      getState() { return { w: words.slice() }; },
      setState(s) {
        words = s && s.w && s.w.length && s.w[0] === from ? s.w.slice() : [from];
        input = new Array(n).fill(''); cur = 0; bad = false; hintCol = -1;
        draw();
      },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        if (/^[a-zA-Z]$/.test(k)) { if (solved()) return false; flashKey(keys, k.toUpperCase()); typeLetter(k); return true; }
        if (solved() || busy) return false;
        if (k === 'Backspace') { flashKey(keys, '<'); backspace(); return true; }
        if (k === 'Delete') { input[cur] = ''; bad = false; draw(); return true; }
        if (k === 'Enter') { flashKey(keys, '>'); submit(true); return true; }
        if (k === 'ArrowLeft') { cur = Math.max(0, cur - 1); draw(); return true; }
        if (k === 'ArrowRight') { cur = Math.min(n - 1, cur + 1); draw(); return true; }
        if (k === 'Escape' && input.some(Boolean)) { input = new Array(n).fill(''); cur = 0; bad = false; draw(); return true; }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); }
    };
  }

  /* =====================================================================
   * Anagrams: the board
   * ===================================================================== */

  function mountAnagram(ctx, p) {
    const wb = ctx.wb, d = p.data;
    const tiles = d.letters.toUpperCase().split('');
    const N = tiles.length;
    const lens = d.words.map((w) => w.length);
    const answer = d.words.join('').toUpperCase();
    const groupOf = [];               // slot -> word index
    lens.forEach((l, wi) => { for (let k = 0; k < l; k++) groupOf.push(wi); });
    let slots = new Array(N).fill(-1);    // slot -> tile
    let order = tiles.map((_, i) => i);   // tray place -> tile
    let locked = [];                      // slots fixed by hints
    let busy = false, drag = null, warned = '';
    const timers = [];
    const TS = 64, P = 76;

    // layout: the tray on top, the slots below (a pair side by side if it fits)
    const aspect = stageAspect(wb);
    let best = null;
    for (let cols = Math.min(N, 4); cols <= Math.min(N, 12); cols++) {
      const trayRows = Math.ceil(N / cols);
      const trayW = cols * P;
      const oneRow = lens.reduce((s, l) => s + l * P, 0) + (lens.length - 1) * 60;
      const slotRows = lens.length > 1 && oneRow > Math.max(trayW, 7 * P) ? lens.length : 1;
      const slotW = slotRows === 1 ? oneRow : Math.max(...lens) * P;
      const W = Math.max(trayW, slotW, 7 * P);
      const H = Math.max(trayRows * P + 70 + slotRows * (P + 34) + 30, 3.2 * P);
      const sc = fitScale(aspect, W + 40, H + 40);
      if (!best || sc > best.sc + 1e-9) best = { sc, cols, trayRows, slotRows, W, H };
    }
    const { cols, trayRows, slotRows, W } = best;
    const trayY = 0, slotY0 = trayRows * P + 70;
    const trayPos = (t) => {
      const r = Math.floor(t / cols), inRow = Math.min(cols, N - r * cols);
      return [(W - inRow * P) / 2 + (t % cols) * P + (P - TS) / 2, trayY + r * P];
    };
    const slotXY = [];
    const joins = [];
    if (slotRows === 1) {
      const total = lens.reduce((s, l) => s + l * P, 0) + (lens.length - 1) * 60;
      let x = (W - total) / 2, s = 0;
      lens.forEach((l, wi) => {
        if (wi) { joins.push([x + 30, slotY0 + TS / 2]); x += 60; }
        for (let k = 0; k < l; k++) { slotXY[s++] = [x + k * P + (P - TS) / 2, slotY0]; }
        x += l * P;
      });
    } else {
      let s = 0;
      lens.forEach((l, wi) => {
        const y = slotY0 + wi * (P + 34);
        const x0 = (W - l * P) / 2;
        if (wi) joins.push([W / 2, y - 23]);
        for (let k = 0; k < l; k++) slotXY[s++] = [x0 + k * P + (P - TS) / 2, y];
      });
    }
    const slotsBottom = slotY0 + slotRows * (P + 34) - 14;

    ctx.setGoal(d.any ? 'Make any word from all ' + N + ' letters.' : d.theme === 'pairs' ? 'Make the famous pair.' : d.theme ? 'Make ' + (d.words.length > 1 ? 'two ' + Wd().theme(d.theme).many : Wd().theme(d.theme).name) + ' from all the letters.' : 'Make the one word these letters spell.');
    const board = wb.layer('board');
    const g = ctx.s('g', { class: 'wd wd-anagram' }, board);
    const trayW0 = Math.min(N, cols) * P;
    ctx.s('rect', { x: (W - trayW0) / 2 - 10, y: trayY - 12, width: trayW0 + 20, height: trayRows * P + 12, rx: 14, class: 'wd-tray' }, g);
    ctx.s('path', { d: 'M' + ((W - trayW0) / 2 - 4) + ' ' + (trayY + trayRows * P - 2) + 'h' + (trayW0 + 8), class: 'wd-traylip' }, g);
    const slotEls = slotXY.map((xy, s) => ctx.s('rect', { x: xy[0] - 3, y: xy[1] - 3, width: TS + 6, height: TS + 6, rx: 12, class: 'wd-slot', 'data-slot': s }, g));
    joins.forEach((xy) => ctx.s('text', { x: xy[0], y: xy[1] + (slotRows === 1 ? 10 : 6), 'text-anchor': 'middle', class: 'wd-join', text: d.theme === 'pairs' ? '&' : '+' }, g));
    ctx.s('text', { x: W / 2, y: slotsBottom + 18, 'text-anchor': 'middle', class: 'wd-help', text: 'Tap a tile or type its letter · drag to swap · Space shuffles' }, g);
    const tileLayer = ctx.s('g', { class: 'wd-tiles' }, g);
    const tileEls = tiles.map((ch, i) => {
      const tg = ctx.s('g', { class: 'wd-at', 'data-tile': i, 'data-key': 'at-' + i }, tileLayer);
      ctx.s('rect', { x: 0, y: 0, width: TS, height: TS, rx: 11, class: 'wd-atbg' }, tg);
      ctx.s('text', { x: TS / 2, y: TS / 2 + 13, 'text-anchor': 'middle', class: 'wd-atl', text: ch }, tg);
      return tg;
    });
    wb.setBounds({ x0: -24, y0: -24, x1: W + 24, y1: slotsBottom + 30 }, 0.05);

    const slotOf = (t) => slots.indexOf(t);
    const posOf = (t) => { const s = slotOf(t); return s >= 0 ? slotXY[s] : trayPos(order.indexOf(t)); };
    function place(t, instant) {
      const el = tileEls[t], xy = posOf(t);
      el.classList.toggle('noanim', !!instant);
      el.style.transform = 'translate(' + xy[0] + 'px,' + xy[1] + 'px)';
    }
    function current() {
      const out = [];
      let s = 0;
      lens.forEach((l) => { out.push(slots.slice(s, s + l).map((t) => (t >= 0 ? tiles[t] : '?')).join('')); s += l; });
      return out;
    }
    const full = () => slots.every((t) => t >= 0);
    const accepted = () => full() && anagramAccepts(d, current());
    function render(instant) {
      tiles.forEach((_, t) => place(t, instant));
      tileEls.forEach((el, t) => {
        const s = slotOf(t);
        el.classList.toggle('inslot', s >= 0);
        el.classList.toggle('locked', s >= 0 && locked.includes(s));
      });
      const ok = accepted();
      g.classList.toggle('solved', ok);
      slotEls.forEach((el, s) => el.classList.toggle('filled', slots[s] >= 0));
      wb.applyPaints();
    }

    function afterChange(why) {
      render();
      ctx.changed(why);
      if (full() && !accepted()) {
        const got = current();
        const words = got.map((w) => w.toLowerCase());
        let msg;
        if (words.length === 1 && Wd().has(words[0])) msg = '**' + got[0] + '** is a word, but not ' + (d.theme ? Wd().theme(d.theme).name : 'the one these letters are hiding') + '.';
        else if (words.length === 2 && words.every((w) => Wd().has(w) || (d.theme && d.theme !== 'pairs' && Wd().theme(d.theme).set.has(w)))) msg = '**' + got.join(' ') + '** — real words, but not ' + (d.theme === 'pairs' ? 'a famous pair' : 'two ' + Wd().theme(d.theme).many) + '.';
        else msg = '**' + got.join(' ') + '** is not a word I know. Try again.';
        if (msg !== warned) { ctx.sfx('wrong'); warned = msg; }
        ctx.say(msg, 'warn');
        g.classList.remove('wd-shake'); void g.getBBox; g.classList.add('wd-shake');
        timers.push(setTimeout(() => g.classList.remove('wd-shake'), 480));
      } else if (!full()) { warned = ''; }
    }
    function firstEmpty() { for (let s = 0; s < N; s++) if (slots[s] < 0) return s; return -1; }
    function toSlot(t, s) {
      if (s < 0 || locked.includes(s)) return false;
      const from = slotOf(t);
      const occupant = slots[s];
      if (from >= 0) slots[from] = occupant >= 0 ? occupant : -1;
      slots[s] = t;
      if (from < 0 && occupant >= 0) { /* the occupant goes back to the tray */ }
      return true;
    }
    function toTray(t) { const s = slotOf(t); if (s >= 0 && !locked.includes(s)) { slots[s] = -1; return true; } return false; }

    function tapTile(t) {
      if (busy) return;
      const s = slotOf(t);
      if (s >= 0) {
        if (locked.includes(s)) { ctx.toast('A hint put that letter there.'); return; }
        slots[s] = -1; ctx.sfx('tap'); afterChange('tile');
        return;
      }
      const e = firstEmpty();
      if (e < 0) { ctx.toast('The slots are full: tap a placed tile to take it out.'); return; }
      slots[e] = t; ctx.sfx('snap'); afterChange('tile');
    }
    function typeLetter(ch) {
      if (busy) return;
      ch = ch.toUpperCase();
      const e = firstEmpty();
      if (e < 0) { ctx.toast('The slots are full.'); return; }
      const t = order.find((x) => slotOf(x) < 0 && tiles[x] === ch);
      if (t == null) { ctx.sfx('wrong'); ctx.toast(tiles.includes(ch) ? 'No ' + ch + ' left in the tray.' : 'There is no ' + ch + ' among these letters.'); return; }
      slots[e] = t; ctx.sfx('snap'); afterChange('tile');
    }
    function backspace() {
      for (let s = N - 1; s >= 0; s--) if (slots[s] >= 0 && !locked.includes(s)) { slots[s] = -1; ctx.sfx('tap'); afterChange('tile'); return; }
    }
    function clearAll() {
      let any = false;
      slots = slots.map((t, s) => { if (t >= 0 && !locked.includes(s)) { any = true; return -1; } return t; });
      if (any) afterChange('clear');
    }
    function shuffleTray() {
      const inTray = order.filter((t) => slotOf(t) < 0);
      const places = order.map((t, i) => (slotOf(t) < 0 ? i : -1)).filter((i) => i >= 0);
      const mixed = inTray.slice();
      for (let k = 0; k < 8; k++) { C.rng(Date.now() + k).shuffle(mixed); if (mixed.join() !== inTray.join() || mixed.length < 2) break; }
      places.forEach((pl, k) => { order[pl] = mixed[k]; });
      ctx.sfx('pour');
      afterChange('shuffle');
    }

    wb.handlers.board = {
      down(pt, ev, el) {
        const te = el && el.closest && el.closest('[data-tile]');
        if (!te || busy) return false;
        const t = +te.getAttribute('data-tile');
        const s = slotOf(t);
        if (s >= 0 && locked.includes(s)) { ctx.toast('A hint put that letter there.'); return true; }
        const xy = posOf(t);
        drag = { t, p0: pt, xy, moved: false };
        return true;
      },
      move(pt) {
        if (!drag) return;
        const dx = pt[0] - drag.p0[0], dy = pt[1] - drag.p0[1];
        if (!drag.moved && Math.hypot(dx, dy) < 6) return;
        if (!drag.moved) { drag.moved = true; tileLayer.appendChild(tileEls[drag.t]); tileEls[drag.t].classList.add('drag'); }
        tileEls[drag.t].classList.add('noanim');
        tileEls[drag.t].style.transform = 'translate(' + (drag.xy[0] + dx) + 'px,' + (drag.xy[1] + dy) + 'px)';
        const s = nearestSlot(drag.xy[0] + dx + TS / 2, drag.xy[1] + dy + TS / 2);
        slotEls.forEach((el, k) => el.classList.toggle('over', k === s));
      },
      up(pt) {
        const dr = drag;
        drag = null;
        slotEls.forEach((el) => el.classList.remove('over'));
        if (!dr) return;
        tileEls[dr.t].classList.remove('drag');
        if (!dr.moved) { tapTile(dr.t); return; }
        const dx = pt[0] - dr.p0[0], dy = pt[1] - dr.p0[1];
        const s = nearestSlot(dr.xy[0] + dx + TS / 2, dr.xy[1] + dy + TS / 2);
        if (s >= 0 && !locked.includes(s)) { toSlot(dr.t, s); ctx.sfx('snap'); }
        else if (slotOf(dr.t) >= 0 && (dr.xy[1] + dy) < slotY0 - P / 2) toTray(dr.t);
        afterChange('tile');
      }
    };
    function nearestSlot(x, y) {
      let bestS = -1, bd = (TS * 0.75) ** 2;
      slotXY.forEach((xy, s) => { const dd = (xy[0] + TS / 2 - x) ** 2 + (xy[1] + TS / 2 - y) ** 2; if (dd < bd) { bd = dd; bestS = s; } });
      return bestS;
    }

    const row = ctx.h('div.wd-btns');
    row.append(
      ctx.h('button.btn.small', { type: 'button', onclick: () => shuffleTray() }, 'Shuffle the tray'),
      ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => clearAll() }, 'Clear the slots')
    );
    ctx.panel.appendChild(row);
    render(true);

    // the correct tile for slot s (a tray tile first, then one in a wrong slot)
    function tileFor(s) {
      const want = answer[s];
      if (slots[s] >= 0 && tiles[slots[s]] === want) return slots[s];
      const inTray = order.find((t) => slotOf(t) < 0 && tiles[t] === want);
      if (inTray != null) return inTray;
      for (let k = 0; k < N; k++) { const t = slots[k]; if (t >= 0 && !locked.includes(k) && tiles[t] === want && answer[k] !== want) return t; }
      for (let k = 0; k < N; k++) { const t = slots[k]; if (t >= 0 && !locked.includes(k) && tiles[t] === want) return t; }
      return -1;
    }
    function putRight(s) {
      const t = tileFor(s);
      if (t < 0) return false;
      const from = slotOf(t);
      if (from === s) return true;
      const occ = slots[s];
      if (from >= 0) slots[from] = -1;
      slots[s] = t;
      if (occ >= 0 && from >= 0 && !locked.includes(from)) slots[from] = -1;
      return true;
    }

    return {
      noMoves: true,
      check() {
        if (accepted()) return { solved: true, msg: '**' + current().join(' ') + '**' + (d.theme === 'pairs' ? ' — ' + current().map((w) => w.toLowerCase()).join(' and ') + '.' : '.') };
        return { solved: false, msg: full() ? 'Not those words.' : 'Fill every slot first.' };
      },
      hint() {
        let s = -1;
        for (let k = 0; k < N; k++) if (!locked.includes(k) && !(slots[k] >= 0 && tiles[slots[k]] === answer[k])) { s = k; break; }
        if (s < 0) {
          for (let k = 0; k < N; k++) if (!locked.includes(k)) { s = k; break; }
          if (s < 0) return 'Every letter is in place.';
        }
        // slots before s already hold the right letters: lock them all in as well
        putRight(s);
        locked.push(s);
        render();
        ctx.changed('hint');
        const wi = groupOf[s], pos = s - lens.slice(0, wi).reduce((a, b) => a + b, 0);
        const text = 'The ' + ordinal(pos) + ' letter' + (lens.length > 1 ? ' of the ' + ordinal(wi) + ' word' : '') + ' is **' + answer[s] + '**.';
        return { text, show() { const el = tileEls[slots[s]]; if (el) { el.classList.add('hinted'); timers.push(setTimeout(() => el.classList.remove('hinted'), 1800)); } } };
      },
      solve() {
        timers.forEach(clearTimeout);
        busy = true;
        // first clear the wrong ones, then place the right tiles one by one
        slots = slots.map((t, s) => (t >= 0 && (locked.includes(s) || tiles[t] === answer[s]) ? t : -1));
        render();
        let s = 0;
        const step = () => {
          while (s < N && slots[s] >= 0 && tiles[slots[s]] === answer[s]) s++;
          if (s >= N) { busy = false; render(); ctx.changed('solve'); return; }
          putRight(s); s++;
          ctx.sfx('tap');
          render();
          timers.push(setTimeout(step, C.anim(170)));
        };
        timers.push(setTimeout(step, C.anim(200)));
      },
      explain() {
        const k = key(d.letters);
        const all = d.words.length === 1 ? Wd().anagrams(k).filter((w) => w.length === N) : [];
        let t = 'The answer: **' + d.words.map(up).join(' ' + (d.theme === 'pairs' ? '&' : '+') + ' ') + '**.';
        if (d.any && all.length > 1) t += ' Every word these letters make: ' + all.map(up).join(', ') + '.';
        else if (d.theme && d.words.length === 1 && all.length > 1) t += ' The same letters also spell ' + all.filter((w) => w !== d.words[0]).map(up).join(', ') + ' — but only one of them is ' + Wd().theme(d.theme).name + '.';
        return t;
      },
      getState() { return { s: slots.slice(), o: order.slice(), l: locked.slice() }; },
      setState(st) {
        if (st && st.s && st.s.length === N) { slots = st.s.slice(); order = (st.o && st.o.length === N ? st.o : order).slice(); locked = (st.l || []).slice(); }
        else { slots = new Array(N).fill(-1); order = tiles.map((_, i) => i); locked = []; }
        render(true);
      },
      reset() { warned = ''; },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        if (accepted()) return false;
        if (/^[a-zA-Z]$/.test(k)) { typeLetter(k); return true; }
        if (k === 'Backspace') { backspace(); return true; }
        if (k === 'Escape' || k === 'Delete') { clearAll(); return true; }
        if (k === ' ') { shuffleTray(); return true; }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); }
    };
  }

  /* =====================================================================
   * Cryptograms: the board
   * ===================================================================== */

  function mountCrypto(ctx, p) {
    const wb = ctx.wb, d = p.data;
    const cipher = d.c;
    const inv = {};
    for (let i = 0; i < 26; i++) inv[d.key[i]] = AZ[i];
    const givenC = new Set((d.given || '').split('').map((pl) => d.key[pl.charCodeAt(0) - 65]));
    const counts = letterCounts(cipher);
    const letters = Object.keys(counts).sort();
    const byFreq = letters.slice().sort((a, b) => counts[b] - counts[a] || (a < b ? -1 : 1));
    let guess = {};        // cipher letter -> plain letter
    let revealed = [];     // cipher letters shown by hints
    let sel = null, cur = -1, busy = false, sortFreq = false;
    const timers = [];
    const CW = 34, PW = 15, SP = 20, LH = 92, TH = 46;

    // the words of the cipher, laid out in lines that suit the stage
    const toks = cipher.split(/ +/).map((w) => w.split('').map((ch) => ({ ch, L: /[A-Z]/.test(ch) })));
    const wordW = (t) => t.reduce((s, c) => s + (c.L ? CW : PW), 0);
    function lineUp(maxW) {
      const lines = [];
      let line = [], w = 0;
      toks.forEach((t) => {
        const tw = wordW(t);
        if (line.length && w + SP + tw > maxW) { lines.push(line); line = []; w = 0; }
        w += (line.length ? SP : 0) + tw;
        line.push(t);
      });
      if (line.length) lines.push(line);
      return lines;
    }
    const aspect = stageAspect(wb);
    const FQ = 34;
    let bestL = null;
    for (let m = 9; m <= 30; m++) {
      const maxW = m * CW;
      const lines = lineUp(maxW);
      const textW = Math.max(...lines.map((l) => l.reduce((s, t, i) => s + wordW(t) + (i ? SP : 0), 0)));
      const W = Math.max(textW, KB.w + 20, 13 * FQ);
      const perRow = Math.max(1, Math.floor(W / FQ));
      const stripRows = Math.ceil(letters.length / perRow);
      const H = lines.length * LH + 50 + stripRows * 86 + 28 + KB.h;
      const sc = fitScale(aspect, W + 40, H + 40);
      if (!bestL || sc > bestL.sc + 1e-9) bestL = { sc, lines, W, perRow, stripRows, textW };
    }
    const { lines, W, perRow } = bestL;

    ctx.setGoal('Find the letter each cipher letter stands for, and read the quotation' + (d.by ? ' (by **' + d.by + '**)' : '') + '.');
    const board = wb.layer('board');
    const g = ctx.s('g', { class: 'wd wd-crypto' }, board);
    const cells = [];                 // { ch, x, y, line, el… } for every letter
    const byLetter = {};
    lines.forEach((line, li) => {
      const lw = line.reduce((s, t, i) => s + wordW(t) + (i ? SP : 0), 0);
      let x = (W - lw) / 2;
      const y = li * LH;
      line.forEach((t, ti) => {
        if (ti) x += SP;
        t.forEach((c) => {
          if (!c.L) {
            ctx.s('text', { x: x + PW / 2, y: y + 34, 'text-anchor': 'middle', class: 'wd-cp', text: c.ch }, g);
            x += PW;
            return;
          }
          const i = cells.length;
          const cg = ctx.s('g', { class: 'wd-cc', 'data-cell': i, 'data-key': 'cc-' + c.ch + '-' + i }, g);
          ctx.s('rect', { x: x + 2, y: 0 + y, width: CW - 4, height: TH, rx: 7, class: 'wd-ccbg' }, cg);
          const gt = ctx.s('text', { x: x + CW / 2, y: y + 34, 'text-anchor': 'middle', class: 'wd-cg' }, cg);
          ctx.s('path', { d: 'M' + (x + 5) + ' ' + (y + TH + 5) + 'h' + (CW - 10), class: 'wd-cline' }, cg);
          ctx.s('text', { x: x + CW / 2, y: y + TH + 25, 'text-anchor': 'middle', class: 'wd-cx', text: c.ch }, cg);
          cells.push({ ch: c.ch, x, y, line: li, g: cg, gt });
          (byLetter[c.ch] = byLetter[c.ch] || []).push(i);
          x += CW;
        });
      });
    });
    const textH = lines.length * LH;
    const attrib = ctx.s('text', { x: W / 2, y: textH + 6, 'text-anchor': 'middle', class: 'wd-attrib', text: '— ' + d.by + (d.src ? ', ' + d.src.replace(/\*/g, '') : '') }, g);

    // the frequency strip: how often each cipher letter appears
    const stripY = textH + 42;
    const strip = ctx.s('g', { class: 'wd-strip' }, g);
    const maxCount = Math.max(...letters.map((c) => counts[c]));
    let fq = {};
    function drawStrip() {
      strip.innerHTML = '';
      fq = {};
      const list = sortFreq ? byFreq : letters;
      const rowsN = Math.ceil(list.length / perRow);
      list.forEach((c, i) => {
        const r = Math.floor(i / perRow), inRow = Math.min(perRow, list.length - r * perRow);
        const x = (W - inRow * FQ) / 2 + (i % perRow) * FQ, y = stripY + r * 86;
        const fg = ctx.s('g', { class: 'wd-fq', 'data-fq': c }, strip);
        ctx.s('rect', { x: x + 1, y: y - 4, width: FQ - 2, height: 82, rx: 7, class: 'wd-fqbg' }, fg);
        const h = 18 * counts[c] / maxCount;
        ctx.s('rect', { x: x + 9, y: y + 33 - h, width: FQ - 18, height: Math.max(2, h), rx: 2, class: 'wd-fqbar' }, fg);
        ctx.s('text', { x: x + FQ / 2, y: y + 46, 'text-anchor': 'middle', class: 'wd-fqc', text: c }, fg);
        const gtx = ctx.s('text', { x: x + FQ / 2, y: y + 70, 'text-anchor': 'middle', class: 'wd-fqg' }, fg);
        ctx.s('text', { x: x + FQ / 2, y: y + 9, 'text-anchor': 'middle', class: 'wd-fqn', text: counts[c] }, fg);
        fq[c] = { g: fg, gt: gtx };
      });
      return rowsN;
    }
    const stripRowsN = drawStrip();
    const kbY = stripY + stripRowsN * 86 + 22;
    const keys = drawKeyboard(ctx, g, (W - KB.w) / 2, kbY, { '<': '⌫', '>': 'Next' });
    wb.setBounds({ x0: -16, y0: -18, x1: W + 16, y1: kbY + KB.h + 14 }, 0.04);

    const locked = (c) => givenC.has(c) || revealed.includes(c);
    const value = (c) => (locked(c) ? inv[c] : guess[c] || '');
    const holderOf = (pl) => letters.find((c) => value(c) === pl) || null;
    const isSolved = () => letters.every((c) => value(c) === inv[c]);

    function refresh() {
      const done = isSolved();
      cells.forEach((cl, i) => {
        const v = value(cl.ch);
        cl.gt.textContent = v;
        const cls = cl.g.classList;
        cls.toggle('sel', !done && cl.ch === sel);
        cls.toggle('cur', !done && i === cur);
        cls.toggle('given', givenC.has(cl.ch));
        cls.toggle('rev', revealed.includes(cl.ch));
        cls.toggle('filled', !!v);
      });
      letters.forEach((c) => {
        const f = fq[c];
        if (!f) return;
        f.gt.textContent = value(c) || '·';
        f.g.classList.toggle('sel', !done && c === sel);
        f.g.classList.toggle('filled', !!value(c));
        f.g.classList.toggle('given', locked(c));
      });
      for (const k of AZ) {
        const key = keys[k];
        if (!key) continue;
        const h = holderOf(k);
        key.g.classList.toggle('used', !!h);
        key.g.classList.toggle('lock', !!h && locked(h));
        key.sub.textContent = h || '';
      }
      g.classList.toggle('solved', done);
      attrib.classList.toggle('show', done);
      wb.applyPaints();
    }

    function flash(c) {
      (byLetter[c] || []).forEach((i) => {
        const el = cells[i].g;
        el.classList.remove('flash'); void el.getBBox; el.classList.add('flash');
        timers.push(setTimeout(() => el.classList.remove('flash'), 1200));
      });
    }
    function selectCell(i) {
      if (i < 0 || i >= cells.length) return;
      cur = i; sel = cells[i].ch;
      refresh();
    }
    function nextOpen(from, dir) {
      const N = cells.length;
      for (let k = 1; k <= N; k++) {
        const i = ((from + dir * k) % N + N) % N;
        if (!value(cells[i].ch)) return i;
      }
      return -1;
    }
    function advance() {
      const i = nextOpen(cur < 0 ? -1 : cur, 1);
      if (i >= 0) selectCell(i); else refresh();
    }

    function assign(pl) {
      if (busy || isSolved()) return;
      if (!sel) { ctx.toast('Click a letter of the cipher first.'); return; }
      if (locked(sel)) {
        ctx.toast(sel + ' is ' + (givenC.has(sel) ? 'given' : 'shown') + ': it stands for ' + inv[sel] + '.');
        if (pl) advance();
        return;
      }
      if (pl && pl === sel) { ctx.sfx('wrong'); ctx.toast('In these ciphers no letter stands for itself.'); return; }
      if (pl) {
        const other = holderOf(pl);
        if (other && other !== sel) {
          if (locked(other)) { ctx.sfx('wrong'); ctx.toast(pl + ' is already taken: ' + other + ' stands for ' + pl + '.'); return; }
          delete guess[other];
          flash(other);
          ctx.say('Moved **' + pl + '** from ' + other + ' to ' + sel + '.', 'info');
        } else ctx.say('');
        guess[sel] = pl;
        ctx.sfx('tap');
      } else {
        if (!guess[sel]) return;
        delete guess[sel];
      }
      refresh();
      ctx.changed('guess');
      if (pl && !isSolved()) advance();
    }
    function backspace() {
      if (!sel) return;
      if (!locked(sel) && guess[sel]) { assign(''); return; }
      // step back to the previous letter
      if (cur > 0) selectCell(cur - 1);
    }
    function moveLine(dir) {
      if (cur < 0) { selectCell(0); return; }
      const c0 = cells[cur], target = c0.line + dir;
      let best = -1, bd = 1e9;
      cells.forEach((c, i) => { if (c.line === target) { const dd = Math.abs(c.x - c0.x); if (dd < bd) { bd = dd; best = i; } } });
      if (best >= 0) selectCell(best);
    }
    function pressKey(k) {
      flashKey(keys, k);
      if (k === '<') { if (sel && !locked(sel) && guess[sel]) assign(''); else backspace(); }
      else if (k === '>') advance();
      else assign(k);
    }

    wb.handlers.board = {
      down(pt, ev, el) {
        const kb = el && el.closest && el.closest('[data-kb]');
        if (kb) { pressKey(kb.getAttribute('data-kb')); return true; }
        const cc = el && el.closest && el.closest('[data-cell]');
        if (cc) { selectCell(+cc.getAttribute('data-cell')); ctx.sfx('tap'); return true; }
        const f = el && el.closest && el.closest('[data-fq]');
        if (f) { const c = f.getAttribute('data-fq'); const i = (byLetter[c] || [])[0]; if (i != null) selectCell(i); return true; }
        return false;
      }
    };

    const sortBtn = ctx.button('Sort the strip by count', () => {
      sortFreq = !sortFreq;
      sortBtn.textContent = sortFreq ? 'Sort the strip A to Z' : 'Sort the strip by count';
      drawStrip(); refresh();
    }, 'small');
    ctx.panel.appendChild(ctx.h('div.wd-note', { html: 'In English the commonest letters run roughly <b>E T A O I N S H R D L U</b>. One-letter words are nearly always A or I; <b>THE</b> and <b>AND</b> are the commonest three-letter words.' }));

    selectCell(nextOpen(-1, 1) >= 0 ? nextOpen(-1, 1) : 0);

    function reveal(c) {
      const P = inv[c];
      const other = holderOf(P);
      if (other && other !== c && !locked(other)) delete guess[other];
      delete guess[c];
      if (!revealed.includes(c)) revealed.push(c);
    }

    return {
      noMoves: true,
      check() {
        if (isSolved()) return { solved: true, msg: '“' + d.q + '” — ' + d.by };
        const open = letters.filter((c) => !value(c)).length;
        if (open) return { solved: false, msg: C.plural(open, 'cipher letter') + ' still ' + (open === 1 ? 'has' : 'have') + ' no guess.' };
        const wrong = letters.filter((c) => value(c) !== inv[c]).length;
        return { solved: false, msg: 'Every letter has a guess, but ' + (wrong === 1 ? 'one of them is' : wrong + ' of them are') + ' wrong.' };
      },
      hint(k) {
        const todo = byFreq.filter((c) => value(c) !== inv[c]);
        if (!todo.length) return 'Every letter is right!';
        const c = todo[0];
        const rank = byFreq.indexOf(c);
        reveal(c);
        refresh();
        ctx.changed('hint');
        const first = !revealed.some((x) => x !== c);
        const text = rank === 0
          ? 'The commonest letter in the cipher, **' + c + '** (' + C.plural(counts[c], 'time') + '), stands for **' + inv[c] + '**.'
          : first
            ? 'The commonest cipher letter you have not got yet, **' + c + '** (' + C.plural(counts[c], 'time') + '), stands for **' + inv[c] + '**.'
            : 'The cipher letter **' + c + '** (' + C.plural(counts[c], 'time') + ') stands for **' + inv[c] + '**.';
        return { text, show() { flash(c); } };
      },
      solve() {
        timers.forEach(clearTimeout);
        busy = true;
        const todo = byFreq.filter((c) => value(c) !== inv[c]);
        let i = 0;
        const step = () => {
          if (i >= todo.length) { busy = false; refresh(); ctx.changed('solve'); return; }
          const c = todo[i++];
          guess[c] = inv[c];
          const other = letters.find((x) => x !== c && !locked(x) && guess[x] === inv[c]);
          if (other) delete guess[other];
          refresh(); flash(c);
          timers.push(setTimeout(step, C.anim(160)));
        };
        step();
      },
      explain() {
        return '“' + d.q + '”\n\n— ' + d.by + (d.src ? ', ' + d.src : '') + '.';
      },
      getState() { return { g: Object.assign({}, guess), r: revealed.slice() }; },
      setState(s) {
        guess = Object.assign({}, (s && s.g) || {});
        revealed = ((s && s.r) || []).filter((c) => counts[c]);
        refresh();
      },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        if (isSolved()) return false;
        if (/^[a-zA-Z]$/.test(k)) { flashKey(keys, k.toUpperCase()); assign(k.toUpperCase()); return true; }
        if (k === 'Backspace') { flashKey(keys, '<'); backspace(); return true; }
        if (k === 'Delete' || k === ' ') { assign(''); return true; }
        if (k === 'ArrowLeft') { selectCell(Math.max(0, cur - 1)); return true; }
        if (k === 'ArrowRight') { selectCell(Math.min(cells.length - 1, cur + 1)); return true; }
        if (k === 'ArrowUp') { moveLine(-1); return true; }
        if (k === 'ArrowDown') { moveLine(1); return true; }
        if (k === 'Tab') { const i = nextOpen(cur, ev.shiftKey ? -1 : 1); if (i >= 0) selectCell(i); return true; }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); }
    };
  }

  const E = {
    graph, bfs, ladder, makeLadder, hamming, LADDER_BAND,
    derangement, encipher, decipher, letterCounts, lettersIn, makeCipher, CRYPTO_BAND, QUOTE_OK,
    key, anagramAnswers, anagramAccepts, scramble, anagramLevel, makeAnagram, anagramStatement,
    verifyLadder, verifyCrypto, verifyAnagram
  };
  C.wordPuzzles = E;

  /* =====================================================================
   * Endless drawers
   * ===================================================================== */

  function genLadder(rng, level) {
    const L = makeLadder(rng, level);
    if (!L) return null;
    return {
      title: cap(L.from) + ' to ' + cap(L.to),
      text: 'Turn **' + up(L.from) + '** into **' + up(L.to) + '**, one letter at a time. Every rung of the ladder must be a real word.',
      data: { kind: 'ladder', from: L.from, to: L.to },
      par: L.par,
      diff: level
    };
  }

  function genCrypto(rng, level, fam) {
    const f = C.families[(fam && fam.id) || 'cryptograms'];
    const pool = ((f && f.puzzles) || []).filter((p) => p.data && p.data.kind === 'crypto');
    if (!pool.length) return null;
    const band = CRYPTO_BAND[level];
    const fit = pool.filter((p) => { const n = lettersIn(p.data.q); return n >= band[0] && n <= band[1]; });
    const src = rng.pick(fit.length ? fit : pool);
    const q = src.data.q;
    const ci = makeCipher(rng, q, band[2]);
    return {
      title: 'A cipher from ' + src.data.by,
      text: 'A quotation from **' + src.data.by + '**, enciphered: every letter has been swapped for another, the same one each time, and no letter stands for itself.' + (ci.given ? ' ' + ['', 'One letter is', 'Two letters are', 'Three letters are'][ci.given.length] + ' given to start you off.' : ''),
      data: { kind: 'crypto', q, c: ci.c, key: ci.key, given: ci.given, by: src.data.by, src: src.data.src },
      diff: level
    };
  }

  function genAnagram(rng, level) {
    const d = makeAnagram(rng, level);
    if (!d) return null;
    const T = d.theme && d.theme !== 'pairs' ? Wd().theme(d.theme) : null;
    return {
      title: (d.theme === 'pairs' ? 'A famous pair' : T ? (d.words.length > 1 ? 'Two ' + T.many : T.name.charAt(0).toUpperCase() + T.name.slice(1)) : 'One word') + ': ' + up(d.letters),
      text: anagramStatement(d),
      data: d,
      diff: level
    };
  }

  /* =====================================================================
   * Pictures for the family page
   * ===================================================================== */

  const TFONT = 'font-family="Segoe UI, system-ui, sans-serif" font-weight="800"';
  function thumbTiles(word, x0, y, size, fill, ink) {
    let s = '';
    word.split('').forEach((ch, i) => {
      const x = x0 + i * (size + 4);
      s += '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" rx="' + size * 0.18 + '" fill="' + fill + '"/>';
      s += '<text x="' + (x + size / 2) + '" y="' + (y + size * 0.72) + '" text-anchor="middle" font-size="' + size * 0.62 + '" ' + TFONT + ' fill="' + ink + '">' + C.esc(up(ch)) + '</text>';
    });
    return s;
  }
  function thumb(p) {
    const d = p.data || {};
    if (d.kind === 'ladder') {
      const n = d.from.length, size = 22, w = n * (size + 4) - 4;
      const rungs = Math.max(0, Math.min(5, (p.par || 3) - 1));
      const H = 34 + (rungs + 1) * 16 + size;
      const x0 = (200 - w) / 2;
      let s = '<svg viewBox="0 0 200 ' + (H + 8) + '" preserveAspectRatio="xMidYMid meet">';
      s += '<rect x="' + (x0 - 16) + '" y="4" width="7" height="' + H + '" rx="3" fill="var(--wood)" opacity=".75"/><rect x="' + (x0 + w + 9) + '" y="4" width="7" height="' + H + '" rx="3" fill="var(--wood)" opacity=".75"/>';
      for (let r = 0; r < rungs; r++) s += '<rect x="' + (x0 - 12) + '" y="' + (8 + size + 12 + r * 16) + '" width="' + (w + 24) + '" height="5" rx="2" fill="var(--wood)" opacity=".45"/>';
      s += thumbTiles(d.from, x0, 8, size, 'var(--paper)', '#3a3226');
      s += thumbTiles(d.to, x0, H - size, size, 'var(--gold)', '#3a2a00');
      return s + '</svg>';
    }
    if (d.kind === 'crypto') {
      // the first few cipher words, as many as fit in about nine cells
      const toks = d.c.replace(/[^A-Z ]/g, '').split(/ +/).filter(Boolean);
      const shown = [];
      let len = 0;
      for (const t of toks) {
        if (shown.length && len + 1 + t.length > 10) break;
        shown.push(t.slice(0, 9)); len += (shown.length > 1 ? 1 : 0) + Math.min(9, t.length);
        if (len >= 6) break;
      }
      const cw = 22, gap = 12;
      const w = len * cw - (shown.length - 1) * (cw - gap);
      let s = '<svg viewBox="-8 4 ' + (Math.max(w, 110) + 16) + ' 84" preserveAspectRatio="xMidYMid meet">';
      let x = Math.max(0, (110 - w) / 2);
      shown.forEach((t, ti) => {
        if (ti) x += gap;
        t.split('').forEach((ch) => {
          const pl = d.given && d.given.includes(decipher(ch, d.key)) ? decipher(ch, d.key) : '';
          s += '<rect x="' + (x + 1.5) + '" y="12" width="' + (cw - 3) + '" height="32" rx="5" fill="var(--board-2)" stroke="var(--line)"/>';
          if (pl) s += '<text x="' + (x + cw / 2) + '" y="36" text-anchor="middle" font-size="21" ' + TFONT + ' fill="var(--teal)">' + pl + '</text>';
          s += '<path d="M' + (x + 3) + ' 51h' + (cw - 6) + '" stroke="var(--muted)" stroke-width="1.5"/>';
          s += '<text x="' + (x + cw / 2) + '" y="70" text-anchor="middle" font-size="16" ' + TFONT + ' fill="var(--muted)">' + ch + '</text>';
          x += cw;
        });
      });
      return s + '</svg>';
    }
    if (d.kind === 'anagram') {
      const letters = d.letters.slice(0, 9).split('');
      const n = letters.length, size = Math.min(26, 176 / n - 4);
      const w = n * (size + 4) - 4, x0 = (200 - w) / 2;
      let s = '<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">';
      letters.forEach((ch, i) => {
        const x = x0 + i * (size + 4), y = 30 + Math.sin(i * 1.7) * 8;
        const rot = (i % 2 ? 1 : -1) * (4 + (i * 7) % 9);
        s += '<g transform="rotate(' + rot + ' ' + (x + size / 2) + ' ' + (y + size / 2) + ')">' + thumbTiles(ch, x, y, size, 'var(--paper)', '#3a3226') + '</g>';
      });
      const lens = d.words.map((w) => w.length);
      let sx = (200 - (d.words.join('').length * 12 + (lens.length - 1) * 10)) / 2;
      lens.forEach((l) => { for (let k = 0; k < l; k++) { s += '<rect x="' + sx + '" y="80" width="9" height="3" rx="1" fill="var(--muted)"/>'; sx += 12; } sx += 10; });
      return s + '</svg>';
    }
    return '';
  }

  /* =====================================================================
   * The engine
   * ===================================================================== */

  C.engine({
    id: 'words',
    name: 'Word puzzles',
    tools: TOOLS,
    noMoves: false,
    deps: ['js/lib/wordlist.js'],
    about: '**Word ladders.** Type the next word — or click a letter of the last word and type its replacement — and press Enter to add the rung. Each rung changes exactly one letter and must be a real word; the changed letter lights up. Backspace on an empty rung takes the last one off. Letters of the goal that already match glow green.\n\n' +
      '**Cryptograms.** Click a cipher letter (or move with the arrow keys) and type the letter you think it stands for: it fills in everywhere. No letter stands for itself. The strip under the quotation counts each cipher letter; in English E, T, A, O, I and N are the commonest.\n\n' +
      '**Anagrams.** Tap a tile, or type its letter, to put it in the next slot; drag tiles to swap them; tap a placed tile to send it back. Space shuffles the tray.\n\n' +
      'The keyboard on the table works with a finger or a mouse. Hints look at where you are now: the next rung of a shortest ladder, the commonest letter still wrong, the next letter of the answer.',

    verify(p) {
      const d = p.data || {};
      if (d.kind === 'ladder') return verifyLadder(p);
      if (d.kind === 'crypto') return verifyCrypto(p);
      if (d.kind === 'anagram') return verifyAnagram(p);
      return { ok: false, err: 'unknown kind ' + d.kind };
    },

    generate(rng, level, fam) {
      const id = fam && fam.id;
      if (id === 'cryptograms') return genCrypto(rng, level, fam);
      if (id === 'anagrams') return genAnagram(rng, level);
      return genLadder(rng, level);
    },
    generates: ['word-ladders', 'cryptograms', 'anagrams'],

    mount(ctx, p) {
      const k = p.data && p.data.kind;
      if (k === 'crypto') return mountCrypto(ctx, p);
      if (k === 'anagram') return mountAnagram(ctx, p);
      return mountLadder(ctx, p);
    },

    thumb
  });

  C.css('words', `
    .wd text { font-family: "Segoe UI", system-ui, sans-serif; }
    /* ladders */
    .wd-rail { fill: var(--wood); opacity: .8; }
    .wd-rung { fill: var(--wood-dark); opacity: .55; }
    .wd-tile { cursor: default; }
    .wd-tile .wd-tbg { fill: var(--paper); stroke: rgba(0,0,0,.25); stroke-width: 1.5; filter: drop-shadow(0 2px 2px rgba(0,0,0,.35)); transition: fill .2s, stroke .2s; }
    .wd-tile .wd-tl { font-size: 34px; font-weight: 800; fill: #2e2718; pointer-events: none; }
    .wd-tile .wd-tl.ph { fill: rgba(128,128,160,.28); }
    .wd-row.start .wd-tbg { fill: var(--paper-back); }
    .wd-row.word .wd-tile.chg .wd-tbg { fill: #bfe3ff; stroke: var(--accent); stroke-width: 2.5; }
    .wd-row.word .wd-tile.tap { cursor: pointer; }
    .wd-row.word .wd-tile.tap:hover .wd-tbg, .wd-row.start .wd-tile.tap:hover .wd-tbg { stroke: var(--accent); stroke-width: 3; }
    .wd-row.start .wd-tile.tap { cursor: pointer; }
    .wd-tile.hinted .wd-tbg { stroke: var(--gold) !important; stroke-width: 5 !important; animation: wdpulse .8s ease-in-out infinite; }
    .wd-row.goal .wd-tbg { fill: #ffe7a3; stroke: var(--gold); stroke-width: 2.5; }
    .wd-row.goal .wd-tile.got .wd-tbg { fill: #c9f2d9; stroke: var(--green); }
    .wd-row.goal.done .wd-tbg { fill: #c9f2d9; stroke: var(--green); stroke-width: 3; }
    .wd-row.input .wd-tbg { fill: var(--board-2); stroke: var(--grid-2); stroke-dasharray: 6 5; filter: none; }
    .wd-row.input .wd-tile { cursor: text; }
    .wd-row.input .wd-tile.typed .wd-tbg { fill: var(--paper); stroke-dasharray: none; stroke: rgba(0,0,0,.25); }
    .wd-row.input .wd-tile.diff .wd-tbg { fill: #bfe3ff; stroke: var(--accent); stroke-width: 2.5; }
    .wd-row.input .wd-tile.over .wd-tbg { fill: #ffd0d0; stroke: var(--red); stroke-width: 2.5; }
    .wd-row.input.bad .wd-tile.typed .wd-tbg { stroke: var(--red); stroke-width: 2.5; }
    .wd-row.input .wd-tile.cur .wd-tbg { stroke: var(--accent); stroke-width: 3; stroke-dasharray: none; animation: wdcaret 1.1s steps(2) infinite; }
    .wd-row.input .wd-tile.pop { animation: wdpop .18s ease-out; transform-box: fill-box; transform-origin: center; }
    .wd-row.ghost .wd-tbg { fill: none; stroke: var(--grid-2); stroke-dasharray: 3 6; filter: none; }
    .wd-row.ghost .wd-rung { opacity: .25; }
    .wd-row.fresh .wd-tile { animation: wdpop .32s cubic-bezier(.3,1.6,.5,1) both; transform-box: fill-box; transform-origin: center; }
    .wd-rowlab { font-size: 13px; font-weight: 700; fill: var(--faint); }
    .wd-rowlab.par { font-size: 11px; fill: var(--gold); opacity: .8; }
    @keyframes wdpop { 0% { transform: scale(.6); opacity: .2; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes wdcaret { 50% { stroke: var(--gold); } }
    @keyframes wdpulse { 50% { stroke-opacity: .35; } }
    .wd-shake { animation: wdshake .42s ease-in-out; }
    @keyframes wdshake { 20% { transform: translateX(-7px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }
    /* keyboard */
    .wd-key { cursor: pointer; }
    .wd-key rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; transition: fill .12s; }
    .wd-key:hover rect { stroke: var(--accent); }
    .wd-key.down rect { fill: var(--accent); }
    .wd-key.down .wd-keyt { fill: #fff; }
    .wd-keyt { font-size: 22px; font-weight: 700; fill: var(--text); pointer-events: none; }
    .wd-keyt.small { font-size: 15px; }
    .wd-special rect { fill: var(--panel-3); }
    .wd-keysub { font-size: 11px; font-weight: 700; fill: var(--muted); pointer-events: none; }
    .wd-key.used rect { fill: var(--board); }
    .wd-key.used .wd-keyt { fill: var(--muted); }
    .wd-key.lock .wd-keyt { fill: var(--teal); }
    /* cryptograms */
    .wd-cc { cursor: pointer; }
    .wd-ccbg { fill: transparent; stroke: none; transition: fill .15s; }
    .wd-cc:hover .wd-ccbg { fill: var(--grid); }
    .wd-cc.sel .wd-ccbg { fill: rgba(108,123,255,.22); }
    .wd-cc.cur .wd-ccbg { fill: rgba(108,123,255,.38); stroke: var(--accent); stroke-width: 2; }
    .wd-cc.flash .wd-ccbg { animation: wdflash 1.1s ease-out; }
    @keyframes wdflash { 0%, 40% { fill: rgba(255,209,102,.55); } 100% { fill: transparent; } }
    .wd-cg { font-size: 30px; font-weight: 800; fill: var(--ink); pointer-events: none; }
    .wd-cc.given .wd-cg { fill: var(--teal); }
    .wd-cc.rev .wd-cg { fill: var(--gold); }
    .wd-cline { stroke: var(--ink-2); stroke-width: 2; opacity: .6; }
    .wd-cx { font-size: 16px; font-weight: 700; fill: var(--muted); pointer-events: none; letter-spacing: .5px; }
    .wd-cc.sel .wd-cx { fill: var(--accent); }
    .wd-cp { font-size: 30px; font-weight: 800; fill: var(--ink-2); }
    .wd-attrib { font: italic 600 20px Georgia, "Times New Roman", serif; fill: var(--gold); opacity: 0; transition: opacity .8s .3s; }
    .wd-attrib.show { opacity: 1; }
    .wd-crypto.solved .wd-cg { fill: var(--green); }
    .wd-crypto.solved .wd-cc.given .wd-cg, .wd-crypto.solved .wd-cc.rev .wd-cg { fill: var(--green); }
    .wd-fq { cursor: pointer; }
    .wd-fqbg { fill: var(--board-2); stroke: var(--line); stroke-width: 1; }
    .wd-fq.sel .wd-fqbg { fill: rgba(108,123,255,.22); stroke: var(--accent); stroke-width: 2; }
    .wd-fqbar { fill: var(--purple); opacity: .75; }
    .wd-fq.filled .wd-fqbar { fill: var(--green); }
    .wd-fqc { font-size: 17px; font-weight: 800; fill: var(--muted); }
    .wd-fqg { font-size: 20px; font-weight: 800; fill: var(--ink); }
    .wd-fq.given .wd-fqg { fill: var(--teal); }
    .wd-fqn { font-size: 10px; font-weight: 700; fill: var(--faint); }
    .wd-note { font-size: .8rem; color: var(--muted); line-height: 1.45; width: 100%; }
    /* anagrams */
    .wd-tray { fill: var(--wood-dark); opacity: .16; }
    .wd-traylip { stroke: var(--wood); stroke-width: 6; stroke-linecap: round; opacity: .55; }
    .wd-slot { fill: var(--board-2); stroke: var(--grid-2); stroke-width: 2; stroke-dasharray: 6 5; transition: stroke .15s, fill .15s; }
    .wd-slot.over { stroke: var(--accent); stroke-dasharray: none; fill: rgba(108,123,255,.15); }
    .wd-join { font-size: 30px; font-weight: 800; fill: var(--gold); }
    .wd-help { font-size: 12px; fill: var(--faint); }
    .wd-at { cursor: grab; transition: transform .22s cubic-bezier(.3,1.3,.5,1); }
    .wd-at.noanim { transition: none; }
    .wd-at.drag { cursor: grabbing; }
    .wd-at.drag .wd-atbg { filter: drop-shadow(0 8px 8px rgba(0,0,0,.45)); }
    .wd-atbg { fill: var(--paper); stroke: rgba(0,0,0,.28); stroke-width: 1.5; filter: drop-shadow(0 2px 2px rgba(0,0,0,.35)); }
    .wd-atl { font-size: 38px; font-weight: 800; fill: #2e2718; pointer-events: none; }
    .wd-at.locked .wd-atbg { fill: #ffe7a3; stroke: var(--gold); stroke-width: 2.5; }
    .wd-at.locked { cursor: default; }
    .wd-at.hinted .wd-atbg { stroke: var(--gold); stroke-width: 5; }
    .wd-anagram.solved .wd-at .wd-atbg { fill: #c9f2d9; stroke: var(--green); stroke-width: 2.5; }
    .wd-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
