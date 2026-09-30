/* The Puzzle Cabinet · engines/hanoi.js
 *
 * The Tower of Hanoi and its relatives: discs on pegs, one disc at a time,
 * never a bigger disc on a smaller one. Variants: four pegs (Dudeney's
 * Reve's puzzle, cheeses on stools), discs that may only travel clockwise,
 * moves only between neighbouring pegs, twin towers of two colours, any
 * starting position ("finish from here"), and Tower-of-London patterns with
 * coloured balls on pegs of different heights.
 *
 * data (Hanoi): {
 *   n: 3,                       discs; disc 0 is the smallest
 *   pegs: 3,                    3 or 4
 *   start: [0, 0, 0],           the peg of each disc, smallest first
 *   goal:  [2, 2, 2],           the peg each disc must end on (null = anywhere)
 *   rule: 'free' | 'cyclic' | 'adjacent',
 *   look: 'toy' | 'wood' | 'cheese' | 'gold' | 'twin',
 *   names: ['A', 'B', 'C']      optional peg (or stool) names
 * }
 * data (Tower of London): {
 *   london: true, n: 3, pegs: 3, caps: [3, 2, 1],  how many balls each peg holds
 *   start: [[0, 1], [2], []],   balls on each peg, bottom first
 *   goal:  [[2], [1, 0], []]
 * }
 * p.par = the fewest moves, found by breadth-first search over every position.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const PEG_NAMES = ['A', 'B', 'C', 'D'];
  const BALLS = [
    { name: 'red', c: '#e4572e' }, { name: 'green', c: '#4caf50' }, { name: 'blue', c: '#3f6fd8' },
    { name: 'yellow', c: '#f0c93a' }, { name: 'purple', c: '#9057d0' }
  ];

  /* ---------- the rules and the solver ---------- */

  function allowedFn(rule, P) {
    if (rule === 'cyclic') return (a, b) => b === (a + 1) % P;
    if (rule === 'adjacent') return (a, b) => Math.abs(a - b) === 1;
    return (a, b) => a !== b;
  }

  // Hanoi positions are numbers: disc i sits on peg digit i (base P)
  function hanoiModel(d) {
    const n = d.n, P = d.pegs || 3, rule = d.rule || 'free';
    const ok = allowedFn(rule, P);
    const pw = [1];
    for (let i = 1; i <= n; i++) pw.push(pw[i - 1] * P);
    const total = pw[n];
    let dist = null;

    function goalStates() {
      let list = [0];
      for (let i = 0; i < n; i++) {
        const g = d.goal[i];
        const opts = g == null ? Array.from({ length: P }, (_, k) => k) : [g];
        const next = [];
        list.forEach((s) => opts.forEach((q) => next.push(s + q * pw[i])));
        list = next;
      }
      return list;
    }
    // distance of every position to the goal (moves walked backwards from the goal)
    function table() {
      if (dist) return dist;
      dist = new Int32Array(total).fill(-1);
      const q = new Int32Array(total);
      let qh = 0, qt = 0;
      goalStates().forEach((g) => { if (dist[g] < 0) { dist[g] = 0; q[qt++] = g; } });
      const tp = new Int8Array(P);
      while (qh < qt) {
        const s = q[qh++], ds = dist[s];
        tp.fill(n);
        let x = s;
        for (let i = 0; i < n; i++) { const pg = x % P; x = (x - pg) / P; if (tp[pg] === n) tp[pg] = i; }
        for (let a = 0; a < P; a++) {
          const t = tp[a];
          if (t === n) continue;
          for (let b = 0; b < P; b++) {
            // the move that led here went from b to a
            if (b === a || t > tp[b] || !ok(b, a)) continue;
            const pr = s + (b - a) * pw[t];
            if (dist[pr] < 0) { dist[pr] = ds + 1; q[qt++] = pr; }
          }
        }
      }
      return dist;
    }
    function stacksOf(pos) {
      const st = Array.from({ length: P }, () => []);
      for (let i = n - 1; i >= 0; i--) st[pos[i]].push(i);
      return st;
    }
    function key(st) {
      let s = 0;
      st.forEach((pile, pg) => pile.forEach((i) => { s += pg * pw[i]; }));
      return s;
    }
    function legal(st, a, b) {
      if (a === b) return 'same';
      if (!st[a].length) return 'empty';
      if (!ok(a, b)) return rule;
      const t = st[a][st[a].length - 1], u = st[b][st[b].length - 1];
      if (u != null && u < t) return 'bigger';
      return '';
    }
    return {
      kind: 'hanoi', n, P, rule, ok, total,
      start: () => stacksOf(d.start),
      goalStacks: () => (d.goal.every((g) => g != null) ? stacksOf(d.goal) : null),
      stacksOf, key, legal,
      dist: (st) => table()[key(st)],
      distOfKey: (k) => table()[k],
      table,
      isGoal: (st) => {
        for (let pg = 0; pg < P; pg++) for (const i of st[pg]) if (d.goal[i] != null && d.goal[i] !== pg) return false;
        return true;
      }
    };
  }

  // Tower of London: balls of different colours, any ball on any other, pegs of limited height
  function londonModel(d) {
    const P = d.pegs || 3, n = d.n, caps = d.caps, rule = d.rule || 'free';
    const ok = allowedFn(rule, P);
    const key = (st) => st.map((s) => s.join('')).join('|');
    const parse = (k) => k.split('|').map((s) => (s ? s.split('').map(Number) : []));
    let dist = null;
    function table() {
      if (dist) return dist;
      dist = new Map();
      const g = key(d.goal);
      dist.set(g, 0);
      let frontier = [g];
      while (frontier.length) {
        const next = [];
        for (const k of frontier) {
          const st = parse(k), ds = dist.get(k);
          for (let a = 0; a < P; a++) {
            if (!st[a].length) continue;
            for (let b = 0; b < P; b++) {
              // backwards: the ball on top of a came from b
              if (b === a || st[b].length >= caps[b] || !ok(b, a)) continue;
              const s2 = st.map((x) => x.slice());
              s2[b].push(s2[a].pop());
              const k2 = key(s2);
              if (!dist.has(k2)) { dist.set(k2, ds + 1); next.push(k2); }
            }
          }
        }
        frontier = next;
      }
      return dist;
    }
    function legal(st, a, b) {
      if (a === b) return 'same';
      if (!st[a].length) return 'empty';
      if (!ok(a, b)) return rule;
      if (st[b].length >= caps[b]) return 'full';
      return '';
    }
    return {
      kind: 'london', n, P, rule, ok, caps,
      start: () => d.start.map((s) => s.slice()),
      goalStacks: () => d.goal.map((s) => s.slice()),
      key, legal,
      dist: (st) => { const v = table().get(key(st)); return v == null ? -1 : v; },
      table,
      isGoal: (st) => key(st) === key(d.goal)
    };
  }

  function modelOf(d) { return d.london ? londonModel(d) : hanoiModel(d); }

  function apply(st, a, b) {
    const s2 = st.map((x) => x.slice());
    s2[b].push(s2[a].pop());
    return s2;
  }

  // one best move from here (the first found, in a fixed order), or null
  function bestMove(M, st) {
    const cur = M.dist(st);
    if (cur <= 0) return null;
    for (let a = 0; a < M.P; a++) {
      for (let b = 0; b < M.P; b++) {
        if (M.legal(st, a, b)) continue;
        if (M.dist(apply(st, a, b)) === cur - 1) return { a, b, disc: st[a][st[a].length - 1] };
      }
    }
    return null;
  }

  function solutionFrom(M, st) {
    const path = [];
    let s = st;
    for (let guard = 0; guard < 100000; guard++) {
      const m = bestMove(M, s);
      if (!m) break;
      path.push(m);
      s = apply(s, m.a, m.b);
    }
    return path;
  }

  /* ---------- words ---------- */

  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const W = (k) => WORDS[k] || String(k);
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const pegName = (d, i) => (d.names && d.names[i]) || PEG_NAMES[i];

  function isTower(pos) { return pos.every((g) => g != null && g === pos[0]); }
  function thing(d, plural) {
    if (d.london) return plural ? 'balls' : 'ball';
    if (d.look === 'cheese') return plural ? 'cheeses' : 'cheese';
    return plural ? 'discs' : 'disc';
  }
  function place(d) { return d.look === 'cheese' ? 'stool' : 'peg'; }

  function ruleText(d) {
    const P = d.pegs || 3;
    if (d.rule === 'cyclic') return 'Discs travel only **clockwise**: ' + Array.from({ length: P }, (_, i) => pegName(d, i)).join(' → ') + ' → ' + pegName(d, 0) + '.';
    if (d.rule === 'adjacent') return 'Discs move only **between neighbouring pegs**: ' + Array.from({ length: P }, (_, i) => pegName(d, i)).join(' ↔ ') + ' — never straight from one end to the other.';
    return '';
  }

  function goalText(d) {
    if (d.london) return 'Make the pattern in the **Goal** picture, one ball at a time. A peg holds only as many balls as it is tall.';
    const t = thing(d, true), pl = place(d);
    if (d.look === 'twin' && isTwinSwap(d)) return 'Exchange the two towers, one ' + thing(d) + ' at a time, never a bigger on a smaller.';
    if (d.look === 'twin' && isTwinSort(d)) return 'Sort the ' + t + ' by colour: ' + twinSortWords(d) + '.';
    if (isTower(d.goal)) return 'Move every ' + thing(d) + ' to ' + pl + ' **' + pegName(d, d.goal[0]) + '**, one at a time, never a bigger on a smaller.';
    return 'Arrange the ' + t + ' as in the **Goal** picture, one at a time, never a bigger on a smaller.';
  }

  function isTwinSwap(d) {
    // two towers that must change places
    const a = new Set(d.start), b = new Set(d.goal);
    return a.size === 2 && b.size === 2 && d.start.every((pg, i) => d.goal[i] !== pg);
  }
  function isTwinSort(d) { return !isTower(d.goal) && isTower(d.start) && new Set(d.goal).size === 2; }
  function twinSortWords(d) {
    const byPeg = {};
    d.goal.forEach((pg, i) => { (byPeg[pg] = byPeg[pg] || new Set()).add(toneOf(d, i)); });
    return Object.keys(byPeg).map((pg) => 'the ' + (byPeg[pg].has('a') ? 'red' : 'blue') + ' ones on ' + pegName(d, +pg)).join(', ');
  }
  function toneOf(d, i) { return d.tone ? d.tone[i] : (i % 2 === 0 ? 'a' : 'b'); }

  /* ---------- making puzzles (endless drawers and the generator) ---------- */

  const BANDS = [null, [3, 7], [8, 15], [16, 31], [32, 63], [64, 150]];

  function towerPos(n, pg) { return Array.from({ length: n }, () => pg); }

  // every position whose distance to the goal lies in the band
  function statesInBand(M, band) {
    const tab = M.table(), out = [];
    if (M.kind === 'hanoi') {
      for (let s = 0; s < tab.length; s++) if (tab[s] >= band[0] && tab[s] <= band[1]) out.push(s);
    } else {
      tab.forEach((v, k) => { if (v >= band[0] && v <= band[1]) out.push(k); });
    }
    return out;
  }
  function posOfKey(k, n, P) {
    const pos = [];
    for (let i = 0; i < n; i++) { const pg = k % P; pos.push(pg); k = (k - pg) / P; }
    return pos;
  }
  function randomLondon(rng, n, P, caps) {
    const st = Array.from({ length: P }, () => []);
    const balls = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    balls.forEach((b) => {
      const room = [];
      for (let pg = 0; pg < P; pg++) if (st[pg].length < caps[pg]) room.push(pg);
      st[rng.pick(room)].push(b);
    });
    return st;
  }

  // kind: 'classic' 'scramble' 'pattern' 'reve' 'reve-scramble' 'cyclic' 'adjacent' 'twin' 'london'
  function build(kind, rng, level, opts) {
    opts = opts || {};
    const band = opts.band || BANDS[level];
    const byLevel = (arr) => arr[Math.min(arr.length, level) - 1];
    let d;
    if (kind === 'london') {
      const n = opts.n || (level <= 1 ? 3 : rng() < 0.5 ? 3 : 4);
      const caps = n === 3 ? [3, 2, 1] : [4, 3, 2];
      const goal = randomLondon(rng, n, 3, caps);
      d = { london: true, n, pegs: 3, caps, start: null, goal };
      const M = modelOf(d);
      const keys = statesInBand(M, band);
      if (!keys.length) return null;
      d.start = keys[rng.int(keys.length)].split('|').map((s) => (s ? s.split('').map(Number) : []));
      return d;
    }
    if (kind === 'classic' || kind === 'reve' || (kind === 'cyclic' && opts.tower) || (kind === 'adjacent' && opts.tower)) {
      const P = kind === 'reve' ? 4 : 3;
      const rule = kind === 'cyclic' ? 'cyclic' : kind === 'adjacent' ? 'adjacent' : 'free';
      const n = opts.n;
      const to = opts.to != null ? opts.to : P - 1;
      d = { n, pegs: P, start: towerPos(n, 0), goal: towerPos(n, to), rule, look: kind === 'reve' ? 'cheese' : 'toy' };
      if (kind === 'reve') d.names = ['A', 'B', 'C', 'D'];
      return d;
    }
    if (kind === 'twin') {
      const half = opts.half || byLevel([1, 2, 2, 3, 4]);
      const n = half * 2;
      const sort = opts.sort != null ? opts.sort : rng() < 0.4;
      const tone = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 'a' : 'b'));
      if (sort) {
        const from = rng.int(3), pa = (from + 1 + rng.int(2)) % 3, pb = 3 - from - pa;
        d = { n, pegs: 3, start: towerPos(n, from), goal: tone.map((t) => (t === 'a' ? pa : pb)), look: 'twin', rule: 'free' };
      } else {
        d = { n, pegs: 3, start: tone.map((t) => (t === 'a' ? 0 : 2)), goal: tone.map((t) => (t === 'a' ? 2 : 0)), look: 'twin', rule: 'free' };
      }
      return d;
    }
    // positions picked by their distance to the goal
    const P = kind === 'reve-scramble' ? 4 : 3;
    const rule = kind === 'cyclic' ? 'cyclic' : kind === 'adjacent' ? 'adjacent' : 'free';
    let n = opts.n;
    if (!n) {
      if (rule === 'cyclic') n = byLevel([2, 3, 3, 4, 5]);
      else if (rule === 'adjacent') n = byLevel([2, 3, 3, 4, 4]);
      else if (P === 4) n = byLevel([3, 4, 6, 7, 8]);
      else n = byLevel([3, 4, 5, 6, 7]);
    }
    let goal;
    if (kind === 'pattern') {
      goal = Array.from({ length: n }, () => rng.int(P));
      if (isTower(goal)) goal[rng.int(n)] = (goal[0] + 1) % P;
    } else goal = towerPos(n, opts.to != null ? opts.to : rng.int(P));
    d = { n, pegs: P, start: null, goal, rule, look: P === 4 ? 'cheese' : (kind === 'pattern' ? 'wood' : 'toy') };
    const M = modelOf(d);
    const keys = statesInBand(M, band);
    if (!keys.length) return null;
    d.start = posOfKey(keys[rng.int(keys.length)], n, P);
    if (kind === 'pattern' && isTower(d.start) && rng() < 0.7) return null;
    return d;
  }

  function titleOf(d, kind) {
    const n = d.n;
    if (d.london) return 'Tower of London, ' + W(n) + ' balls';
    if (kind === 'classic') return cap1(W(n)) + ' discs';
    if (kind === 'reve') return 'Four stools, ' + W(n) + ' cheeses';
    if (kind === 'reve-scramble') return 'Cheeses to stool ' + pegName(d, d.goal[0]);
    if (kind === 'twin') return isTwinSwap(d) ? 'Twin towers, ' + W(n) + ' discs' : 'Sort ' + W(n) + ' discs by colour';
    if (d.rule === 'cyclic') return 'Clockwise only, ' + W(n) + ' discs';
    if (d.rule === 'adjacent') return 'Next door only, ' + W(n) + ' discs';
    if (kind === 'pattern') return 'A pattern of ' + W(n);
    return 'Finish the tower of ' + W(n);
  }

  function textOf(d, kind) {
    const n = d.n;
    if (d.london) return 'Coloured balls on three pegs of different heights: the tall peg holds ' + W(d.caps[0]) + ', the middle ' + W(d.caps[1]) + ', the short one ' + W(d.caps[2]) + '. Move one ball at a time — any ball may sit on any other — until the balls look like the goal picture.';
    const rt = ruleText(d);
    if (kind === 'classic') return 'A tower of ' + W(n) + ' discs stands on peg A. Move it to peg ' + pegName(d, d.goal[0]) + ', one disc at a time, never putting a disc on a smaller one.';
    if (kind === 'reve' || kind === 'reve-scramble') {
      return (kind === 'reve' ? cap1(W(n)) + ' cheeses of different sizes sit in a pile on stool A.' : cap1(W(n)) + ' cheeses are spread over four stools.') +
        ' Move them all to stool ' + pegName(d, d.goal[0]) + ', one at a time, never a larger cheese on a smaller. With four stools there is more room to work — how few moves will do?';
    }
    if (kind === 'twin') {
      return isTwinSwap(d)
        ? 'Two towers, red and blue, stand on pegs A and C, their sizes interleaved. Make them change places: the red discs to C and the blue to A.'
        : 'One tower of red and blue discs, alternating. Separate the colours: ' + twinSortWords(d) + '.';
    }
    if (d.rule === 'cyclic' || d.rule === 'adjacent') {
      const from = isTower(d.start) ? 'A tower of ' + W(n) + ' discs stands on peg ' + pegName(d, d.start[0]) + '.' : cap1(W(n)) + ' discs are spread over the pegs.';
      return from + ' ' + rt + ' Bring them all to peg ' + pegName(d, d.goal[0]) + '.';
    }
    if (kind === 'pattern') return cap1(W(n)) + ' discs, three pegs. Rearrange them into the pattern of the goal picture, one disc at a time and never a bigger on a smaller.';
    return 'Someone started moving this tower and walked away. Finish the job: bring all ' + W(n) + ' discs to peg ' + pegName(d, d.goal[0]) + ' in as few moves as possible.';
  }

  function diffOf(par, d) {
    let df = par <= 7 ? 1 : par <= 15 ? 2 : par <= 31 ? 3 : par <= 70 ? 4 : 5;
    if (d && (d.rule === 'cyclic' || d.rule === 'adjacent') && par > 12) df = Math.min(5, df + 1);
    if (d && d.london && par >= 6) df = Math.max(df, 2);
    return df;
  }

  function parOf(d) {
    const M = modelOf(d);
    return M.dist(M.start());
  }

  /* ---------- colours ---------- */

  function hex2rgb(h) { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
  function rgb2hex(c) { return '#' + c.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join(''); }
  function shade(h, f) { return rgb2hex(hex2rgb(h).map((v) => (f >= 0 ? v + (255 - v) * f : v * (1 + f)))); }
  function lum(h) { const c = hex2rgb(h); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
  function hsl(hh, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + hh / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return rgb2hex([f(0) * 255, f(8) * 255, f(4) * 255]);
  }

  function baseColor(d, i) {
    if (d.london) return BALLS[i % BALLS.length].c;
    switch (d.look) {
      case 'wood': return ['#d9aa6c', '#9b6437', '#c4834f'][i % 3];
      case 'twin': return toneOf(d, i) === 'a' ? '#cc3f35' : '#3569c9';
      case 'cheese': return '#f0bd45';
      case 'gold': return shade('#e2b33c', i % 2 ? -0.07 : 0.03);
      default: return hsl(4 + (d.n > 1 ? i / (d.n - 1) : 0) * 262, 64, 53);
    }
  }

  /* ---------- geometry ---------- */

  const K = 0.22; // how much of each disc's top face we see

  function layout(d) {
    const P = d.pegs || 3, n = d.n;
    const px = (SP) => (pg) => SP / 2 + pg * SP;
    if (d.london) {
      const R = 17, T = 34, SP = 104;
      const tips = d.caps.map((c) => -(c * T + 20));
      const tipMin = Math.min.apply(null, tips);
      return { P, n, R, T, SP, W: P * SP, px: px(SP), tips, tipMin, BY: 20, liftY: () => tipMin - 12, rx: () => R, ry: () => 0, london: true };
    }
    const step = n > 1 ? Math.min(24, 136 / (n - 1)) : 0;
    const widths = Array.from({ length: n }, (_, i) => 40 + i * step);
    const maxW = widths[n - 1];
    const T = n >= 7 ? 16 : 18;
    const SP = maxW + 36;
    const tip = -(n * T + 30);
    const rx = (i) => widths[i] / 2, ry = (i) => widths[i] / 2 * K;
    const BY = Math.round(ry(n - 1) + 8);
    const tips = Array.from({ length: P }, () => tip);
    return { P, n, T, SP, W: P * SP, px: px(SP), widths, tip, tips, tipMin: tip, BY, rx, ry, liftY: (i) => tip - 10 - ry(i), stools: d.look === 'cheese' };
  }

  function bandPath(rx, ry, T) {
    return 'M' + (-rx) + ' ' + (-T) + 'L' + (-rx) + ' 0A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' 0L' + rx + ' ' + (-T) +
      'A' + rx + ' ' + ry + ' 0 0 1 ' + (-rx) + ' ' + (-T) + 'Z';
  }
  function outlinePath(rx, ry, T) {
    return 'M' + (-rx) + ' ' + (-T) + 'A' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + (-T) + 'L' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 ' + (-rx) + ' 0Z';
  }
  const f1 = (v) => Math.round(v * 10) / 10;

  // a still picture of a position as SVG markup (thumbnails, the goal picture): flat colours
  function sceneSVG(d, L, st, opts) {
    opts = opts || {};
    let s = '';
    const W = L.W, BY = L.BY;
    if (L.stools) {
      for (let pg = 0; pg < L.P; pg++) {
        const x = L.px(pg), r = L.rx(L.n - 1) + 8;
        s += '<path d="M' + f1(x - r + 8) + ' 8L' + f1(x - r + 2) + ' 58M' + f1(x + r - 8) + ' 8L' + f1(x + r - 2) + ' 58M' + f1(x) + ' 10L' + f1(x) + ' 62" stroke="#7a4c1a" stroke-width="7" stroke-linecap="round"/>';
        s += '<rect x="' + f1(x - r) + '" y="0" width="' + f1(2 * r) + '" height="11" rx="4" fill="#a8723a"/>';
        s += '<ellipse cx="' + f1(x) + '" cy="0" rx="' + f1(r) + '" ry="' + f1(r * K) + '" fill="#c98c45"/>';
      }
    } else {
      s += '<rect x="0" y="' + (-BY) + '" width="' + W + '" height="' + (2 * BY + 16) + '" rx="10" fill="#8a5a26"/>';
      s += '<rect x="0" y="' + (-BY) + '" width="' + W + '" height="' + (2 * BY) + '" rx="10" fill="#c98c45"/>';
      for (let pg = 0; pg < L.P; pg++) {
        const x = L.px(pg), tip = L.tips[pg];
        s += '<rect x="' + f1(x - 5) + '" y="' + tip + '" width="10" height="' + (-tip + 2) + '" rx="5" fill="' + (d.look === 'gold' ? '#dfe8f0' : '#b07a42') + '"/>';
      }
    }
    for (let pg = 0; pg < L.P; pg++) {
      st[pg].forEach((i, h) => {
        const x = L.px(pg), c = baseColor(d, i);
        if (L.london) {
          s += '<circle cx="' + x + '" cy="' + f1(-h * L.T - L.R) + '" r="' + (L.R - 1) + '" fill="' + c + '" stroke="' + shade(c, -0.35) + '" stroke-width="2"/>';
          return;
        }
        const rx = L.rx(i), ry = L.ry(i), y = -h * L.T;
        s += '<path transform="translate(' + f1(x) + ' ' + f1(y) + ')" d="' + bandPath(f1(rx), f1(ry), L.T) + '" fill="' + shade(c, -0.18) + '"/>';
        s += '<ellipse cx="' + f1(x) + '" cy="' + f1(y - L.T) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="' + shade(c, 0.14) + '"/>';
      });
    }
    return s;
  }
  function sceneBox(L) {
    const top = L.tipMin - 14, bottom = L.stools ? 66 : L.BY + 18;
    return { x0: -6, y0: top, x1: L.W + 6, y1: bottom };
  }

  function whyText(d, why, st, a, b) {
    const t = thing(d), pl = place(d);
    const nm = (i) => (d.london ? 'the ' + BALLS[i % BALLS.length].name + ' ball' : t + ' ' + (i + 1));
    const P = d.pegs || 3;
    if (why === 'empty') return cap1(pl) + ' ' + pegName(d, a) + ' is empty.';
    if (why === 'full') return cap1(pl) + ' ' + pegName(d, b) + ' holds only ' + W(d.caps[b]) + ' ball' + (d.caps[b] === 1 ? '' : 's') + ', and it is full.';
    if (why === 'bigger') {
      const i = st[a][st[a].length - 1], u = st[b][st[b].length - 1];
      return 'Too big! ' + cap1(nm(i)) + ' will not sit on ' + nm(u) + ' — a ' + t + ' goes only onto a larger one or an empty ' + pl + '.';
    }
    if (why === 'cyclic') return 'Clockwise only: from ' + pegName(d, a) + ' a disc may go to ' + pegName(d, (a + 1) % P) + ' and nowhere else.';
    if (why === 'adjacent') {
      const nb = [a - 1, a + 1].filter((x) => x >= 0 && x < P).map((x) => pegName(d, x));
      return 'Neighbours only: from ' + pegName(d, a) + ' a disc may go to ' + nb.join(' or ') + '.';
    }
    return '';
  }

  function moveWords(d, st, m) {
    const i = m.disc;
    const who = d.london ? 'the ' + BALLS[i % BALLS.length].name + ' ball' : thing(d) + ' ' + (i + 1) + (i === 0 && !d.london ? ' (the smallest)' : '');
    return 'Move ' + who + ' from ' + pegName(d, m.a) + ' to ' + pegName(d, m.b) + '.';
  }

  let uid = 0;

  C.engine({
    id: 'hanoi',
    name: 'Towers of Hanoi',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about(p) {
      const d = p && p.data || {};
      const keys = ' Keys **1–' + (d.pegs || 3) + '** pick ' + place(d) + 's the same way.';
      if (d.london) return 'Drag a ball from the top of one peg onto another — or click a peg, then the peg to move to. Any ball may sit on any other, but a peg holds only as many balls as it is tall. Make the pattern in the **Goal** picture.' + keys + ' The par is the fewest moves possible.';
      return 'Drag the top ' + thing(d) + ' of a ' + place(d) + ' onto another — or click a ' + place(d) + ', then the one to move to. One ' + thing(d) + ' at a time, and never a larger one on a smaller: a move that breaks the rules just bounces back.' +
        (ruleText(d) ? ' ' + ruleText(d) : '') + keys + ' The par under the board is the fewest moves possible, found by searching every position.';
    },

    generate(rng, level) {
      const pools = [null,
        ['london', 'london', 'scramble', 'pattern', 'reve', 'cyclic', 'classic', 'twin'],
        ['scramble', 'pattern', 'reve', 'cyclic', 'adjacent', 'london', 'twin', 'classic'],
        ['scramble', 'pattern', 'reve', 'reve-scramble', 'cyclic', 'adjacent', 'twin', 'classic'],
        ['scramble', 'pattern', 'reve', 'reve-scramble', 'cyclic', 'adjacent', 'twin', 'classic'],
        ['scramble', 'pattern', 'scramble', 'cyclic', 'adjacent', 'twin', 'classic']];
      const band = BANDS[level];
      for (let tries = 0; tries < 14; tries++) {
        const kind = rng.pick(pools[level]);
        const opts = {};
        if (kind === 'classic') { opts.n = [0, 3, 4, 5, 6, 7][level]; opts.to = 1 + rng.int(2); }
        if (kind === 'reve') {
          opts.n = [0, 3, rng.pick([4, 5]), rng.pick([6, 7]), 8, 0][level];
          if (!opts.n) continue;
          opts.to = 1 + rng.int(3);
        }
        const d = build(kind, rng, level, opts);
        if (!d) continue;
        const par = parOf(d);
        if (!(par >= band[0] && par <= band[1])) continue;
        return { title: titleOf(d, kind), text: textOf(d, kind), data: d, par, diff: level };
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !d.n || !d.start || !d.goal) return { ok: false, err: 'n, start and goal are needed' };
      const P = d.pegs || 3;
      if (P < 3 || P > 4) return { ok: false, err: 'pegs must be 3 or 4' };
      if (d.london) {
        if (!d.caps || d.caps.length !== P) return { ok: false, err: 'caps needed for each peg' };
        for (const pos of [d.start, d.goal]) {
          if (pos.length !== P) return { ok: false, err: 'a pile is needed for each peg' };
          const all = [].concat.apply([], pos).sort((a, b) => a - b);
          if (all.join() !== Array.from({ length: d.n }, (_, i) => i).join()) return { ok: false, err: 'every ball must appear exactly once' };
          if (pos.some((s, pg) => s.length > d.caps[pg])) return { ok: false, err: 'a peg holds more balls than it can' };
        }
      } else {
        if (Math.pow(P, d.n) > 70000) return { ok: false, err: 'too many discs for the solver' };
        if (d.start.length !== d.n || d.goal.length !== d.n) return { ok: false, err: 'start and goal need one peg per disc' };
        if (d.start.some((g) => !(g >= 0 && g < P)) || d.goal.some((g) => g != null && !(g >= 0 && g < P))) return { ok: false, err: 'a peg number is out of range' };
        if (d.rule && !['free', 'cyclic', 'adjacent'].includes(d.rule)) return { ok: false, err: 'unknown rule ' + d.rule };
      }
      const par = parOf(d);
      if (par < 0) return { ok: false, err: 'the goal cannot be reached' };
      if (par === 0) return { ok: false, err: 'already solved at the start' };
      if (p.par != null && p.par !== par) return { ok: false, err: 'par is ' + p.par + ' but the fewest moves is ' + par };
      return { ok: true, par };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb, M = modelOf(d), L = layout(d);
      const S = ctx.s;
      const pre = 'hn' + (++uid);
      const P = L.P;
      let st = M.start();
      let sel = -1, press = null, dragging = null, fly = null, hoverCol = -1, underCol = -1;
      let solving = false, dead = false, told = false, hintMark = null;
      const timers = [];
      const later = (fn, ms) => {
        const t = setTimeout(() => { const k = timers.indexOf(t); if (k >= 0) timers.splice(k, 1); if (!dead) fn(); }, ms);
        timers.push(t);
        return t;
      };
      const towerGoal = !d.london && isTower(d.goal) ? d.goal[0] : -1;
      ctx.setGoal(goalText(d) + (ruleText(d) ? ' ' + ruleText(d) : ''));

      /* the scene */
      const bg = wb.layer('bg'), board = wb.layer('board');
      const box = sceneBox(L);
      const liftTop = L.london ? L.tipMin - 12 - 2 * L.R - 10 : L.tip - 10 - 2 * L.ry(L.n - 1) - L.T - 12;
      box.y0 = Math.min(box.y0, liftTop);
      if (d.rule === 'cyclic' && !L.stools) box.y1 += 26;
      if (L.stools) box.y1 = 96;
      const inset = towerGoal < 0;
      const sc = P === 4 ? 0.3 : 0.36;
      const sb = sceneBox(L);
      const iw = (sb.x1 - sb.x0) * sc + 24, ih = (sb.y1 - sb.y0) * sc + 40;
      const bounds = { x0: box.x0, y0: box.y0, x1: box.x1 + (inset ? iw + 26 : 0), y1: Math.max(box.y1, box.y0 + ih + 4) };
      wb.setBounds(bounds, 0.06);

      const defs = S('defs', null, bg);
      let dd = '';
      const gold = d.look === 'gold';
      dd += '<linearGradient id="' + pre + '-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (gold ? '#caa04a' : '#dca565') + '"/><stop offset="1" stop-color="' + (gold ? '#a47c2c' : '#c08144') + '"/></linearGradient>';
      dd += '<linearGradient id="' + pre + '-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (gold ? '#7c5c1c' : '#93602c') + '"/><stop offset="1" stop-color="' + (gold ? '#4f3a10' : '#6a4118') + '"/></linearGradient>';
      dd += gold
        ? '<linearGradient id="' + pre + '-peg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d97a8"/><stop offset=".35" stop-color="#ffffff"/><stop offset=".6" stop-color="#cfe6f2"/><stop offset="1" stop-color="#6f8898"/></linearGradient>'
        : '<linearGradient id="' + pre + '-peg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d4318"/><stop offset=".35" stop-color="#e0b37a"/><stop offset=".65" stop-color="#b07a42"/><stop offset="1" stop-color="#5e3812"/></linearGradient>';
      for (let i = 0; i < L.n; i++) {
        const c = baseColor(d, i);
        if (L.london) {
          dd += '<radialGradient id="' + pre + '-b' + i + '" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="' + shade(c, 0.6) + '"/><stop offset=".3" stop-color="' + shade(c, 0.15) + '"/><stop offset=".78" stop-color="' + c + '"/><stop offset="1" stop-color="' + shade(c, -0.4) + '"/></radialGradient>';
        } else {
          dd += '<linearGradient id="' + pre + '-b' + i + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + shade(c, -0.5) + '"/><stop offset=".16" stop-color="' + shade(c, 0.14) + '"/><stop offset=".42" stop-color="' + c + '"/><stop offset=".8" stop-color="' + shade(c, -0.24) + '"/><stop offset="1" stop-color="' + shade(c, -0.56) + '"/></linearGradient>';
          dd += '<radialGradient id="' + pre + '-f' + i + '" cx=".42" cy=".36" r=".72"><stop offset="0" stop-color="' + shade(c, gold ? 0.5 : 0.3) + '"/><stop offset="1" stop-color="' + shade(c, 0.04) + '"/></radialGradient>';
        }
      }
      defs.innerHTML = dd;
      const url = (k) => 'url(#' + pre + '-' + k + ')';

      // columns (highlights behind everything), then the base or the stools
      const gCols = S('g', { class: 'hn-cols' }, bg);
      const cols = [];
      for (let pg = 0; pg < P; pg++) {
        cols.push(S('rect', { x: L.px(pg) - L.SP / 2 + 5, y: liftTop - 4, width: L.SP - 10, height: (L.stools ? 14 : L.BY) - liftTop + 4, rx: 16, class: 'hn-col' }, gCols));
      }
      const gBase = S('g', { class: 'hn-base' }, bg);
      const labels = [];
      if (L.stools) {
        for (let pg = 0; pg < P; pg++) {
          const x = L.px(pg), r = L.rx(L.n - 1) + 9;
          S('ellipse', { cx: x, cy: 66, rx: r + 6, ry: 6, class: 'hn-shadow' }, gBase);
          S('path', { d: 'M' + f1(x - r + 9) + ' 8L' + f1(x - r + 2) + ' 64M' + f1(x + r - 9) + ' 8L' + f1(x + r - 2) + ' 64', class: 'hn-leg' }, gBase);
          S('path', { d: 'M' + f1(x) + ' 12L' + f1(x) + ' 60', class: 'hn-leg back' }, gBase);
          S('path', { d: bandPath(f1(r), f1(r * K), 12), transform: 'translate(' + f1(x) + ' 12)', fill: url('front') }, gBase);
          S('ellipse', { cx: x, cy: 0, rx: r, ry: r * K, fill: url('top'), class: 'hn-seat' }, gBase);
          labels.push(S('text', { x, y: 88, class: 'hn-label stool', 'text-anchor': 'middle', text: pegName(d, pg) }, gBase));
        }
      } else {
        const W = L.W, BY = L.BY;
        S('ellipse', { cx: W / 2, cy: BY + 20, rx: W / 2 + 8, ry: 9, class: 'hn-shadow' }, gBase);
        S('rect', { x: 0, y: -BY + 4, width: W, height: 2 * BY + 16, rx: 12, fill: url('front') }, gBase);
        S('rect', { x: 0, y: -BY, width: W, height: 2 * BY, rx: 12, fill: url('top') }, gBase);
        // a little wood grain
        const gr = C.rng('grain:' + W + ':' + BY);
        let gp = '';
        for (let k = 0; k < 7; k++) {
          const y = -BY + 5 + gr() * (2 * BY - 10), a = gr() * 6 - 3, b = gr() * 6 - 3;
          gp += 'M' + f1(8 + gr() * 30) + ' ' + f1(y) + 'C' + f1(W * 0.3) + ' ' + f1(y + a) + ' ' + f1(W * 0.6) + ' ' + f1(y + b) + ' ' + f1(W - 8 - gr() * 30) + ' ' + f1(y + a * 0.5);
        }
        S('path', { d: gp, class: 'hn-grain' + (gold ? ' gold' : '') }, gBase);
        S('rect', { x: 1, y: -BY + 1, width: W - 2, height: 2 * BY - 2, rx: 11, class: 'hn-bevel' }, gBase);
        for (let pg = 0; pg < P; pg++) {
          const x = L.px(pg);
          if (towerGoal === pg) S('ellipse', { cx: x, cy: 0, rx: L.rx(L.n - 1) + 5, ry: L.ry(L.n - 1) + 2.5, class: 'hn-foot' }, gBase);
          S('ellipse', { cx: x, cy: 1, rx: 9, ry: 3.2, class: 'hn-socket' }, gBase);
          labels.push(S('text', { x, y: BY + 14.5, class: 'hn-label', 'text-anchor': 'middle', text: pegName(d, pg) }, gBase));
        }
        if (d.rule === 'cyclic') {
          for (let pg = 0; pg < P - 1; pg++) S('text', { x: L.px(pg) + L.SP / 2, y: BY + 14.5, class: 'hn-label arrow', 'text-anchor': 'middle', text: '→' }, gBase);
          const xa = L.px(0), xc = L.px(P - 1), y0 = BY + 24;
          S('path', { d: 'M' + xc + ' ' + y0 + 'Q' + (W / 2) + ' ' + (y0 + 26) + ' ' + (xa + 8) + ' ' + (y0 + 5), class: 'hn-return' }, gBase);
          S('path', { d: 'M' + (xa + 1) + ' ' + (y0 + 1) + 'l12 -1l-5 10z', class: 'hn-return-head' }, gBase);
        } else if (d.rule === 'adjacent') {
          for (let pg = 0; pg < P - 1; pg++) S('text', { x: L.px(pg) + L.SP / 2, y: BY + 14.5, class: 'hn-label arrow', 'text-anchor': 'middle', text: '↔' }, gBase);
        }
      }
      if (towerGoal >= 0) {
        labels[towerGoal].classList.add('goal');
        const lb = labels[towerGoal];
        S('text', { x: +lb.getAttribute('x') + 14, y: +lb.getAttribute('y'), class: 'hn-label goal star', text: '★' }, gBase);
      }

      // the goal picture
      if (inset) {
        const ix = box.x1 + 26, iy = box.y0 + 2;
        const gi = S('g', { class: 'hn-inset', transform: 'translate(' + f1(ix) + ' ' + f1(iy) + ')' }, bg);
        S('rect', { x: 0, y: 0, width: f1(iw), height: f1(ih), rx: 12, class: 'hn-inset-card' }, gi);
        S('text', { x: iw / 2, y: 20, class: 'hn-inset-label', 'text-anchor': 'middle', text: 'Goal' }, gi);
        const gs = M.goalStacks() || M.stacksOf(d.goal.map((g) => (g == null ? 0 : g)));
        const inner = S('g', { transform: 'translate(12 30) scale(' + sc + ') translate(' + (-sb.x0) + ' ' + (-sb.y0) + ')' }, gi);
        inner.innerHTML = sceneSVG(d, L, gs);
      }

      // pegs (a back part, and a front stub that shows the peg rising out of the top disc)
      const gPegBack = S('g', { class: 'hn-pegs' }, board);
      const gDiscs = S('g', { class: 'hn-discs' }, board);
      const gPegFront = S('g', { class: 'hn-pegs front' }, board);
      const gFly = S('g', { class: 'hn-fly' }, board);
      const PW = gold ? 7 : 11;
      const pegFront = [];
      if (!L.stools) {
        for (let pg = 0; pg < P; pg++) {
          const x = L.px(pg), tip = L.tips[pg];
          S('rect', { x: x - PW / 2, y: tip, width: PW, height: -tip + 1, rx: PW / 2, fill: url('peg'), class: 'hn-peg' }, gPegBack);
          if (!L.london) pegFront.push(S('rect', { x: x - PW / 2, y: tip, width: PW, height: 0, rx: PW / 2, fill: url('peg'), class: 'hn-peg' }, gPegFront));
        }
      }
      const stub = S('rect', { x: -PW / 2, width: PW, rx: PW / 2, fill: url('peg'), class: 'hn-peg', height: 0, y: 0 }, gFly);

      // the discs (or balls)
      const discs = [];
      for (let i = 0; i < L.n; i++) {
        const g = S('g', { class: 'hn-disc' }, gDiscs);
        const inn = S('g', { class: 'hn-in' }, g);
        const c = baseColor(d, i);
        if (L.london) {
          const R = L.R;
          S('circle', { cx: 0, cy: -R, r: R - 0.5, fill: url('b' + i), 'data-key': 'ball' + i, class: 'hn-ball' }, inn);
          S('ellipse', { cx: -R * 0.32, cy: -R * 1.42, rx: R * 0.34, ry: R * 0.2, class: 'hn-shine' }, inn);
          S('circle', { cx: 0, cy: -R, r: R - 0.5, class: 'hn-outline' }, inn);
        } else {
          const rx = L.rx(i), ry = L.ry(i), T = L.T;
          S('path', { d: bandPath(f1(rx), f1(ry), T), fill: url('b' + i) }, inn);
          S('ellipse', { cx: 0, cy: -T, rx: f1(rx), ry: f1(ry), fill: url('f' + i), 'data-key': 'disc' + i, class: 'hn-face' }, inn);
          if (d.look === 'cheese') {
            const hr = C.rng('holes' + i);
            for (let k = 0; k < 3 + Math.round(rx / 25); k++) {
              const hx = (hr() * 1.6 - 0.8) * rx, hy = -T * (0.25 + hr() * 0.5) + ry * Math.sqrt(Math.max(0, 1 - (hx / rx) * (hx / rx))) * 0.9;
              S('ellipse', { cx: f1(hx), cy: f1(hy), rx: f1(1.6 + hr() * 2.4), ry: f1(1.2 + hr() * 1.6), class: 'hn-cheese-hole' }, inn);
            }
            for (let k = 0; k < 2 + Math.round(rx / 30); k++) {
              const a = hr() * Math.PI * 2, rr = 0.25 + hr() * 0.6;
              S('ellipse', { cx: f1(Math.cos(a) * rx * rr), cy: f1(-T + Math.sin(a) * ry * rr), rx: f1(2 + hr() * 2.5), ry: f1(0.9 + hr() * 0.8), class: 'hn-cheese-hole' }, inn);
            }
          } else {
            S('ellipse', { cx: 0, cy: -T, rx: f1(rx * 0.7), ry: f1(ry * 0.7), class: 'hn-rings' }, inn);
            S('ellipse', { cx: 0, cy: -T, rx: f1(rx * 0.45), ry: f1(ry * 0.45), class: 'hn-rings' }, inn);
            S('ellipse', { cx: 0, cy: -T, rx: PW / 2 + 2.5, ry: Math.max(2, (PW / 2 + 2.5) * K * 1.3), class: 'hn-hole' }, inn);
          }
          const fs = Math.min(T * 0.62, 12);
          S('text', { x: 0, y: f1(-T / 2 + ry * 0.55 + fs * 0.36), 'text-anchor': 'middle', class: 'hn-num', 'font-size': fs, fill: lum(c) > 0.62 ? 'rgba(60,35,10,.62)' : 'rgba(255,248,235,.78)', text: String(i + 1) }, inn);
          S('path', { d: outlinePath(f1(rx), f1(ry), T), class: 'hn-outline' }, inn);
        }
        discs.push({ g, inn });
      }
      wb.applyPaints();

      /* placing and drawing */
      const topOf = (pg) => { const s = st[pg]; return s.length ? s[s.length - 1] : -1; };
      function put(i, x, y) {
        discs[i].g.setAttribute('transform', 'translate(' + f1(x) + ' ' + f1(y) + ')');
        discs[i].at = [x, y];
      }
      function restOf(i) {
        for (let pg = 0; pg < P; pg++) {
          const h = st[pg].indexOf(i);
          if (h >= 0) return [L.px(pg), -h * L.T];
        }
        return [0, 0];
      }
      const liftedAt = (i, pg) => [L.px(pg), L.liftY(i)];
      // the peg seen through the hole of a disc that is in the air over it
      function updStub(i) {
        if (L.stools || L.london) { stub.setAttribute('height', 0); return; }
        const at = discs[i].at || [0, 0];
        for (let pg = 0; pg < P; pg++) {
          const x = L.px(pg), face = at[1] - L.T;
          if (Math.abs(at[0] - x) < 1.5 && face > L.tip) {
            stub.setAttribute('x', x - PW / 2);
            stub.setAttribute('y', L.tip);
            stub.setAttribute('height', f1(face - L.tip));
            gFly.appendChild(stub);
            return;
          }
        }
        stub.setAttribute('height', 0);
      }
      function render() {
        const skip = new Set();
        if (fly) skip.add(fly.i);
        if (dragging) skip.add(dragging.i);
        const liftedI = sel >= 0 ? topOf(sel) : -1;
        for (let pg = 0; pg < P; pg++) {
          let faceY = null;
          st[pg].forEach((i, h) => {
            if (skip.has(i) || i === liftedI) return;
            put(i, L.px(pg), -h * L.T);
            gDiscs.appendChild(discs[i].g);
            faceY = -h * L.T - L.T;
          });
          if (pegFront[pg]) pegFront[pg].setAttribute('height', faceY == null ? 0 : f1(Math.max(0, faceY - L.tip)));
        }
        if (liftedI >= 0 && !skip.has(liftedI)) {
          const at = liftedAt(liftedI, sel);
          put(liftedI, at[0], at[1]);
          gFly.appendChild(discs[liftedI].g);
          updStub(liftedI);
        } else if (!fly && !dragging) stub.setAttribute('height', 0);
        discs.forEach((D, i) => D.g.classList.toggle('lifted', i === liftedI || (!!dragging && dragging.i === i) || (!!fly && fly.i === i)));
        drawCols();
      }
      function drawCols() {
        const held = dragging ? dragging.a : sel;
        cols.forEach((r, pg) => {
          const target = held >= 0 && pg === underCol && pg !== held;
          const bad = target ? !!M.legal(st, held, pg) : false;
          r.classList.toggle('hov', held < 0 && pg === hoverCol && st[pg].length > 0 && !solving);
          r.classList.toggle('ok', target && !bad);
          r.classList.toggle('no', target && bad);
          r.classList.toggle('from', held === pg);
          r.classList.toggle('hint', !!hintMark && hintMark.b === pg);
        });
        discs.forEach((D, i) => D.g.classList.toggle('hinted', !!hintMark && hintMark.disc === i));
      }

      /* flight: one disc in the air at a time */
      function flyTo(i, pts, ms, done) {
        if (fly) finishFly();
        const segs = [];
        let total = 0;
        for (let k = 1; k < pts.length; k++) { const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); segs.push(l); total += l; }
        const me = fly = { i, pts, segs, total: Math.max(total, 1e-6), t0: performance.now(), ms: Math.max(1, C.anim(ms)), done };
        gFly.appendChild(discs[i].g);
        discs[i].g.classList.add('lifted');
        const step = (now) => {
          if (fly !== me || dead) return;
          const t = Math.min(1, (now - me.t0) / me.ms);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          let rem = e * me.total, k = 0;
          while (k < me.segs.length - 1 && rem > me.segs[k]) { rem -= me.segs[k]; k++; }
          const a = me.pts[k], b = me.pts[k + 1] || a, f = me.segs[k] ? Math.min(1, rem / me.segs[k]) : 1;
          put(i, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
          updStub(i);
          if (t < 1) me.raf = requestAnimationFrame(step);
          else finishFly();
        };
        me.raf = requestAnimationFrame(step);
      }
      function finishFly() {
        const f = fly;
        if (!f) return;
        fly = null;
        render();
        if (f.done) f.done();
      }
      function pathTo(i, from, to) {
        const lift = L.liftY(i), pts = [from];
        if (from[1] > lift + 0.5 && Math.abs(from[0] - to[0]) > 0.5) pts.push([from[0], lift]);
        if (Math.abs(from[0] - to[0]) > 0.5) pts.push([to[0], lift]);
        pts.push(to);
        return pts;
      }
      const lenOf = (pts) => pts.reduce((s, q, k) => (k ? s + Math.hypot(q[0] - pts[k - 1][0], q[1] - pts[k - 1][1]) : 0), 0);

      function doMove(a, b, silent, ms) {
        const i = topOf(a);
        const from = discs[i].at ? discs[i].at.slice() : restOf(i);
        st = apply(st, a, b);
        sel = -1;
        const to = [L.px(b), -(st[b].length - 1) * L.T];
        const pts = pathTo(i, from, to);
        flyTo(i, pts, ms || Math.max(220, Math.min(560, 160 + lenOf(pts) * 0.8)), () => {
          if (silent) return;
          ctx.sfx('snap');
          ctx.move();
          ctx.changed('move');
        });
        render();
      }
      function goHome(i, a) {
        sel = -1;
        const from = discs[i].at ? discs[i].at.slice() : restOf(i);
        const to = [L.px(a), -st[a].indexOf(i) * L.T];
        const pts = pathTo(i, from, to);
        flyTo(i, pts, Math.max(200, Math.min(480, 140 + lenOf(pts) * 0.7)), null);
        render();
      }
      function complain(why, a, b) {
        ctx.say(whyText(d, why, st, a, b), 'warn');
        ctx.sfx('tap');
        const u = topOf(b);
        if (why === 'bigger' && u >= 0) {
          const g = discs[u].g;
          g.classList.remove('nudge'); void g.getBBox; g.classList.add('nudge');
          later(() => g.classList.remove('nudge'), 450);
        }
      }
      function tryMove(a, b) {
        const i = topOf(a);
        if (i < 0) return;
        if (b < 0 || b === a) { goHome(i, a); return; }
        const why = M.legal(st, a, b);
        if (why) { goHome(i, a); complain(why, a, b); return; }
        clearHint();
        ctx.say('');
        doMove(a, b);
      }
      function lift(pg) {
        const i = topOf(pg);
        if (i < 0) { ctx.say(whyText(d, 'empty', st, pg, pg), 'warn'); return; }
        const from = discs[i].at ? discs[i].at.slice() : restOf(i);
        sel = pg;
        flyTo(i, [from, liftedAt(i, pg)], 200, null);
        fly.lifted = true;
        render();
        ctx.sfx('tap');
        if (!told) { told = true; ctx.say('Now click the ' + place(d) + ' to move it to.', 'info'); }
      }
      function lower() {
        if (sel < 0) return;
        const pg = sel, i = topOf(pg);
        sel = -1;
        if (i >= 0) goHome(i, pg);
        render();
      }
      function tap(pg) {
        if (solving) return;
        finishFly();
        if (sel < 0) lift(pg);
        else if (sel === pg) lower();
        else tryMove(sel, pg);
      }
      function columnAt(pt) {
        if (pt[0] < 0 || pt[0] >= L.W) return -1;
        if (pt[1] < liftTop - 30 || pt[1] > (L.stools ? 96 : L.BY + 30)) return -1;
        return Math.max(0, Math.min(P - 1, Math.floor(pt[0] / L.SP)));
      }

      wb.handlers.board = {
        down(pt) {
          if (solving) return true;
          const col = columnAt(pt);
          if (col < 0) { if (sel >= 0) { finishFly(); lower(); } return false; }
          finishFly();
          press = { col, pt, drag: null };
          return true;
        },
        move(pt) {
          if (!press || solving) return;
          if (!press.drag) {
            if (Math.hypot(pt[0] - press.pt[0], pt[1] - press.pt[1]) < wb.px(6)) return;
            const a = sel >= 0 ? sel : press.col;
            const i = topOf(a);
            if (i < 0) { press = null; return; }
            finishFly();
            const at = discs[i].at || restOf(i);
            press.drag = dragging = { a, i, off: [at[0] - press.pt[0], at[1] - press.pt[1]] };
            sel = -1;
            gFly.appendChild(discs[i].g);
            clearHint();
          }
          const g = press.drag;
          put(g.i, pt[0] + g.off[0], pt[1] + g.off[1]);
          updStub(g.i);
          const u = columnAt(pt);
          if (u !== underCol) { underCol = u; drawCols(); }
          render();
        },
        up(pt) {
          const pr = press;
          press = null;
          if (!pr) return;
          if (pr.drag) {
            dragging = null;
            underCol = -1;
            tryMove(pr.drag.a, columnAt(pt));
            return;
          }
          tap(pr.col);
        },
        hover(pt) {
          const c = columnAt(pt);
          if (c !== hoverCol || c !== underCol) { hoverCol = c; underCol = c; drawCols(); }
        }
      };

      /* hints */
      function clearHint() { if (hintMark) { hintMark = null; drawCols(); } }
      function showHint(m) {
        hintMark = m;
        drawCols();
        later(() => { if (hintMark === m) clearHint(); }, 2800);
      }

      render();

      return {
        check() {
          if (M.isGoal(st)) return { solved: true, msg: d.london ? 'The pattern matches.' : (towerGoal >= 0 ? 'The tower stands on ' + pegName(d, towerGoal) + '.' : 'Every ' + thing(d) + ' is in place.') };
          const left = M.dist(st);
          return { solved: false, msg: 'Not there yet' + (left > 0 && ctx.hintCount() > 0 ? ' — the goal is ' + C.plural(left, 'move') + ' away.' : '.') };
        },
        hint() {
          const m = bestMove(M, st);
          const left = M.dist(st);
          if (left === 0) return 'You are there already!';
          if (!m) return 'From here the goal cannot be reached — undo a few moves.';
          return {
            text: moveWords(d, st, m) + ' (From here the goal is ' + C.plural(left, 'move') + ' away.)',
            show() { finishFly(); if (sel >= 0) lower(); showHint(m); }
          };
        },
        solve() {
          finishFly();
          sel = -1; press = null; dragging = null; clearHint();
          render();
          const path = solutionFrom(M, st);
          if (!path.length) { ctx.changed('solve'); return; }
          solving = true;
          ctx.lockUndo(true);
          const stepMs = Math.max(80, Math.min(560, 38000 / path.length));
          let k = 0;
          const next = () => {
            if (k >= path.length) {
              finishFly();
              solving = false;
              ctx.lockUndo(false);
              render();
              ctx.changed('solve');
              return;
            }
            const m = path[k++];
            finishFly();
            doMove(m.a, m.b, true, stepMs * 0.88);
            ctx.move();
            later(next, C.anim(stepMs));
          };
          next();
        },
        explain() {
          const path = solutionFrom(M, M.start());
          const n = path.length;
          let s = 'The fewest moves is **' + n + '**, found by searching every position breadth first.';
          if (n <= 14) {
            let sim = M.start();
            s += ' One shortest way: ' + path.map((m, k) => {
              const i = sim[m.a][sim[m.a].length - 1];
              sim = apply(sim, m.a, m.b);
              return (k + 1) + '. ' + (d.london ? BALLS[i % BALLS.length].name : String(i + 1)) + ' ' + pegName(d, m.a) + '→' + pegName(d, m.b);
            }).join(', ') + '.';
          }
          return s;
        },
        getState() { return { st: st.map((s) => s.slice()) }; },
        setState(s) {
          if (!s || !s.st) return;
          if (solving) { timers.forEach(clearTimeout); timers.length = 0; solving = false; ctx.lockUndo(false); }
          fly = null; press = null; dragging = null; sel = -1; hintMark = null;
          st = s.st.map((x) => x.slice());
          render();
        },
        key(ev) {
          if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
          const k = parseInt(ev.key, 10);
          if (k >= 1 && k <= P) { tap(k - 1); return true; }
          if (ev.key === 'Escape' && sel >= 0) { finishFly(); lower(); return true; }
          return false;
        },
        destroy() {
          dead = true;
          timers.forEach(clearTimeout);
          fly = null;
          wb.handlers.board = null;
        }
      };
    },

    thumb(p) {
      const d = p.data, L = layout(d), M = modelOf(d);
      const b = sceneBox(L);
      let s = '<svg viewBox="' + b.x0 + ' ' + b.y0 + ' ' + (b.x1 - b.x0) + ' ' + (b.y1 - b.y0) + '" preserveAspectRatio="xMidYMid meet">' + sceneSVG(d, L, M.start());
      if (!d.london && isTower(d.goal)) s += '<text x="' + L.px(d.goal[0]) + '" y="' + (L.tipMin - 2) + '" text-anchor="middle" font-size="22" fill="var(--gold)">★</text>';
      return s + '</svg>';
    }
  });

  C.hanoi = { modelOf, bestMove, solutionFrom, build, titleOf, textOf, diffOf, parOf, isTower, goalText, BANDS };

  C.css('hanoi', `
    .hn-col { fill: transparent; transition: fill .15s; cursor: pointer; }
    .hn-col.hov { fill: rgba(255, 255, 255, .045); }
    .hn-col.from { fill: rgba(108, 123, 255, .08); }
    .hn-col.ok { fill: rgba(78, 203, 141, .16); }
    .hn-col.no { fill: rgba(255, 107, 107, .13); }
    .hn-col.hint { fill: rgba(255, 209, 102, .2); animation: hnpulse 1s ease-in-out infinite; }
    .hn-shadow { fill: rgba(0, 0, 0, .28); }
    .hn-grain { fill: none; stroke: rgba(90, 50, 15, .22); stroke-width: 1.1; }
    .hn-grain.gold { stroke: rgba(255, 240, 200, .18); }
    .hn-bevel { fill: none; stroke: rgba(255, 235, 200, .22); stroke-width: 1.2; }
    .hn-socket { fill: rgba(40, 20, 5, .5); }
    .hn-foot { fill: rgba(255, 209, 102, .1); stroke: var(--gold); stroke-width: 1.6; stroke-dasharray: 5 4; }
    .hn-label { font: 800 12.5px "Segoe UI", system-ui, sans-serif; fill: rgba(255, 238, 215, .88); letter-spacing: .06em; pointer-events: none; }
    .hn-label.stool { fill: var(--muted); font-size: 16px; }
    .hn-label.goal { fill: #ffd98a; }
    .hn-label.stool.goal { fill: var(--gold); }
    .hn-label.arrow { fill: rgba(255, 238, 215, .6); font-size: 14px; }
    .hn-return { fill: none; stroke: var(--muted); stroke-width: 2; stroke-dasharray: 5 4; }
    .hn-return-head { fill: var(--muted); }
    .hn-leg { stroke: #7a4c1a; stroke-width: 7; stroke-linecap: round; }
    .hn-leg.back { stroke: #5e3812; }
    .hn-peg { pointer-events: none; }
    .hn-inset-card { fill: var(--panel); stroke: var(--line); stroke-width: 1.2; opacity: .92; }
    .hn-inset-label { font: 800 13px "Segoe UI", system-ui, sans-serif; fill: var(--gold); letter-spacing: .12em; }
    .hn-disc { cursor: grab; }
    .hn-disc .hn-outline { fill: none; stroke: rgba(0, 0, 0, .32); stroke-width: 1; }
    .hn-disc.lifted { filter: drop-shadow(0 7px 5px rgba(0, 0, 0, .35)); cursor: grabbing; }
    .hn-disc.lifted .hn-outline { stroke: var(--gold); stroke-width: 2; }
    .hn-disc.hinted .hn-outline { stroke: var(--gold); stroke-width: 3.2; animation: hnpulse .9s ease-in-out infinite; }
    .hn-disc.nudge .hn-in { animation: hnnudge .42s ease; }
    .hn-rings { fill: none; stroke: rgba(60, 30, 0, .16); stroke-width: 1; }
    .hn-hole { fill: #24140a; }
    .hn-cheese-hole { fill: rgba(150, 95, 10, .45); }
    .hn-shine { fill: rgba(255, 255, 255, .42); pointer-events: none; }
    .hn-ball .hn-outline, .hn-disc circle.hn-outline { fill: none; }
    .hn-num { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 800; pointer-events: none; }
    @keyframes hnpulse { 50% { opacity: .45; } }
    @keyframes hnnudge { 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
