/* The Puzzle Cabinet · engines/hackenbush.js
 *
 * Hackenbush (John H. Conway): drawings made of coloured edges standing on
 * the ground. In your turn you cut one edge; everything no longer joined to
 * the ground falls away. Whoever cannot move loses.
 *
 *   Blue-Red: you cut blue edges, the computer cuts red ones. Every position
 *     is worth a number — positive is good for Blue — and the numbers of
 *     separate pictures simply add. A stalk is read by its sign expansion;
 *     a tree is valued from the top down (a blue edge carrying x is worth
 *     (x + j) / 2^(j−1), j the least whole number with x + j > 1).
 *   Green: anyone may cut any edge. Every picture is worth a Nim heap: a
 *     stalk of n edges is a heap of n; branches meeting at a fork combine by
 *     nim-sum and act as one stalk (the colon principle). Pictures with
 *     cycles are valued by trying every cut (small drawings only).
 *
 * data: {
 *   kind: 'br' | 'green',
 *   v: [[x, y], …]            vertices in edge-lengths; y = 0 lies on the ground
 *   e: [[a, b, c, bend], …]   edges: vertex indices, colour 'b' | 'r' | 'g';
 *                             a === b is a loop (bend = its direction in degrees, 0 = up);
 *                             otherwise bend bows the edge sideways (a fraction of its length)
 *   names: ['the flower', …]  optional: the pictures from left to right (for the words)
 *   first: 'cpu'              the computer moves first (then the start must be a loss for the mover)
 * }
 * A position is a string with one character per edge: '1' standing, '0' gone.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* =====================================================================
   * the graph, and what stays joined to the ground
   * ===================================================================== */

  const GRAPHS = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function graphOf(d) {
    let G = GRAPHS && GRAPHS.get(d);
    if (G) return G;
    const n = d.e.length;
    const ground = d.v.map((p) => p[1] === 0);
    const inc = d.v.map(() => []);
    d.e.forEach((e, i) => { inc[e[0]].push(i); if (e[1] !== e[0]) inc[e[1]].push(i); });
    G = { d, n, ground, inc, green: d.kind === 'green', memo: new Map(), all: '1'.repeat(n) };
    if (GRAPHS) GRAPHS.set(d, G);
    return G;
  }

  // drop every edge no longer joined to the ground
  function prune(G, s) {
    const d = G.d, reached = new Uint8Array(d.v.length), keep = new Uint8Array(G.n);
    const stack = [];
    d.v.forEach((p, i) => { if (G.ground[i]) { reached[i] = 1; stack.push(i); } });
    while (stack.length) {
      const v = stack.pop();
      for (const ei of G.inc[v]) {
        if (s.charCodeAt(ei) !== 49 || keep[ei]) continue;
        keep[ei] = 1;
        const e = d.e[ei], w = e[0] === v ? e[1] : e[0];
        if (!reached[w]) { reached[w] = 1; stack.push(w); }
      }
    }
    let out = '';
    for (let i = 0; i < G.n; i++) out += keep[i] ? '1' : '0';
    return out;
  }
  const cut = (G, s, i) => prune(G, s.slice(0, i) + '0' + s.slice(i + 1));
  const alive = (s) => { const out = []; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) === 49) out.push(i); return out; };
  const count = (s) => alive(s).length;

  // the separate pictures: edges joined through vertices above the ground (the ground itself joins nothing)
  function parts(G, s) {
    const d = G.d, par = d.v.map((p, i) => i);
    const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    const es = alive(s);
    es.forEach((i) => { const [a, b] = d.e[i]; if (!G.ground[a] && !G.ground[b]) par[find(a)] = find(b); });
    const groups = new Map();
    es.forEach((i) => {
      const [a, b] = d.e[i];
      const r = find(G.ground[a] ? b : a);
      if (!groups.has(r)) groups.set(r, []);
      groups.get(r).push(i);
    });
    const out = [];
    groups.forEach((list) => {
      const arr = new Array(G.n).fill('0');
      list.forEach((i) => { arr[i] = '1'; });
      let x = Infinity;
      list.forEach((i) => { x = Math.min(x, d.v[d.e[i][0]][0], d.v[d.e[i][1]][0]); });
      out.push({ s: arr.join(''), edges: list, x });
    });
    return out.sort((a, b) => a.x - b.x);
  }

  /* =====================================================================
   * values
   * ===================================================================== */

  // the simplest number strictly between L and R (either may be infinite)
  function simplest(L, R) {
    if (L < 0 && R > 0) return 0;
    if (R <= 0) return -simplest(-R, -L);
    let n = Math.floor(L) + 1;
    if (n < R) return n;
    for (let den = 2; den <= 1 << 24; den *= 2) {
      n = Math.floor(L * den) + 1;
      if (n / den < R) return n / den;
    }
    return (L + R) / 2;
  }
  // Blue-Red: a blue edge carrying x above it
  function blueOn(x) {
    let j = 1;
    while (x + j <= 1) j++;
    return (x + j) / Math.pow(2, j - 1);
  }
  const edgeOn = (c, x) => (c === 'b' ? blueOn(x) : -blueOn(-x));

  // a part is a tree when, counting the ground as one vertex, it has one vertex more than edges
  function isTree(G, edges) {
    const vs = new Set();
    for (const i of edges) {
      const [a, b] = G.d.e[i];
      if (a === b) return false;
      vs.add(G.ground[a] ? 'g' : a);
      vs.add(G.ground[b] ? 'g' : b);
    }
    return vs.size === edges.length + 1;
  }
  function treeValue(G, edges) {
    const d = G.d, adj = new Map();
    const key = (v) => (G.ground[v] ? 'g' : v);
    edges.forEach((i) => {
      const a = key(d.e[i][0]), b = key(d.e[i][1]);
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push([b, i]);
      adj.get(b).push([a, i]);
    });
    const val = (v, from) => {
      let t = 0;
      for (const [w, i] of adj.get(v) || []) {
        if (i === from) continue;
        const up = val(w, i);
        if (G.green) t ^= up + 1;
        else t += edgeOn(d.e[i][2], up);
      }
      return t;
    };
    return val('g', -1);
  }

  function partValue(G, P) {
    let v = G.memo.get(P.s);
    if (v !== undefined) return v;
    if (isTree(G, P.edges)) v = treeValue(G, P.edges);
    else if (G.green) {
      const seen = new Set();
      P.edges.forEach((i) => seen.add(total(G, cut(G, P.s, i))));
      v = 0;
      while (seen.has(v)) v++;
    } else {
      let L = -Infinity, R = Infinity;
      P.edges.forEach((i) => {
        const t = total(G, cut(G, P.s, i));
        if (G.d.e[i][2] === 'b') L = Math.max(L, t); else R = Math.min(R, t);
      });
      v = simplest(L, R);
    }
    G.memo.set(P.s, v);
    return v;
  }
  // the value of a (pruned) position: numbers add (Blue-Red), Nim heaps nim-add (green)
  function total(G, s) {
    let t = 0;
    for (const P of parts(G, s)) t = G.green ? t ^ partValue(G, P) : t + partValue(G, P);
    return t;
  }

  // exhaustive value (tests: checks the tree rules)
  function bruteValue(G, s, memo) {
    memo = memo || new Map();
    let v = memo.get(s);
    if (v !== undefined) return v;
    const es = alive(s);
    if (G.green) {
      const seen = new Set();
      es.forEach((i) => seen.add(bruteValue(G, cut(G, s, i), memo)));
      v = 0;
      while (seen.has(v)) v++;
    } else {
      let L = -Infinity, R = Infinity;
      es.forEach((i) => {
        const t = bruteValue(G, cut(G, s, i), memo);
        if (G.d.e[i][2] === 'b') L = Math.max(L, t); else R = Math.min(R, t);
      });
      v = simplest(L, R);
    }
    memo.set(s, v);
    return v;
  }

  /* =====================================================================
   * moves and choices
   * ===================================================================== */

  function movesOf(G, s, who) {
    const out = [];
    alive(s).forEach((i) => {
      const c = G.d.e[i][2];
      if (!G.green && c !== (who === 'cpu' ? 'r' : 'b')) return;
      out.push({ m: { e: i }, s: cut(G, s, i) });
    });
    return out;
  }
  // does the player to move win?
  function wins(G, s, who) {
    const t = total(G, s);
    if (G.green) return t !== 0;
    return who === 'cpu' ? t < 0 : t > 0;
  }
  function winningMoves(G, s, who) {
    const other = who === 'cpu' ? 'you' : 'cpu';
    return movesOf(G, s, who).filter((x) => !wins(G, x.s, other));
  }
  // your move: the winning cut that costs the least (Blue-Red), or keeps the most standing (green)
  function bestMove(G, s) {
    const W = winningMoves(G, s, 'you');
    if (!W.length) return null;
    if (G.green) return W.reduce((b, x) => (count(x.s) > count(b.s) ? x : b), W[0]);
    return W.reduce((b, x) => { const t = total(G, x.s), tb = total(G, b.s); return t > tb || (t === tb && count(x.s) > count(b.s)) ? x : b; }, W[0]);
  }
  function cpuMove(G, s) {
    const all = movesOf(G, s, 'cpu');
    if (!all.length) return null;
    if (!G.green) {
      // the cut that raises the value least — the winning one when there is one
      return all.reduce((b, x) => { const t = total(G, x.s), tb = total(G, b.s); return t < tb || (t === tb && count(x.s) > count(b.s)) ? x : b; }, all[0]);
    }
    const W = all.filter((x) => total(G, x.s) === 0);
    if (W.length) return W.reduce((b, x) => (count(x.s) > count(b.s) ? x : b), W[0]);
    let best = null, bs = Infinity;
    all.forEach((x) => {
      const sc = winningMoves(G, x.s, 'you').length * 1000 - count(x.s);
      if (sc < bs) { bs = sc; best = x; }
    });
    return best;
  }

  /* =====================================================================
   * drawings to build positions from (Endless drawers and tools/gen/hackenbush.js)
   *   each returns { v: [[x, y]], e: [[a, b, bend]], name, w }
   * ===================================================================== */

  function shape(name) {
    const v = [], e = [];
    const V = (x, y) => {
      x = Math.round(x * 1000) / 1000; y = Math.round(y * 1000) / 1000;
      let i = v.findIndex((p) => Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6);
      if (i < 0) { v.push([x, y]); i = v.length - 1; }
      return i;
    };
    const E = (p, q, bend) => { e.push([V(p[0], p[1]), V(q[0], q[1]), bend || 0]); };
    const L = (p, ang) => { const i = V(p[0], p[1]); e.push([i, i, ang]); };
    return { v, e, V, E, L, name };
  }
  function done(S) {
    const xs = S.v.map((p) => p[0]);
    const x0 = Math.min(...xs) - (S.e.some((e) => e[0] === e[1]) ? 0.45 : 0.15);
    const x1 = Math.max(...xs) + (S.e.some((e) => e[0] === e[1]) ? 0.45 : 0.15);
    S.v = S.v.map((p) => [Math.round((p[0] - x0) * 1000) / 1000, p[1]]);
    S.w = x1 - x0;
    delete S.V; delete S.E; delete S.L;
    return S;
  }
  const SHAPES = {
    stalk(n) { const S = shape('stalk'); for (let i = 0; i < n; i++) S.E([0, i], [0, i + 1]); return done(S); },
    fork(t, l, r) {
      const S = shape('tree');
      for (let i = 0; i < t; i++) S.E([0, i], [0, i + 1]);
      for (let i = 0; i < l; i++) S.E([-0.6 * i, t + 0.8 * i], [-0.6 * (i + 1), t + 0.8 * (i + 1)]);
      for (let i = 0; i < r; i++) S.E([0.6 * i, t + 0.8 * i], [0.6 * (i + 1), t + 0.8 * (i + 1)]);
      return done(S);
    },
    bush(t, k) {
      const S = shape('bush');
      for (let i = 0; i < t; i++) S.E([0, i], [0, i + 1]);
      for (let j = 0; j < k; j++) { const a = (j - (k - 1) / 2) * (k > 3 ? 0.55 : 0.75); S.E([0, t], [Math.sin(a) * 0.95, t + Math.cos(a) * 0.95]); }
      return done(S);
    },
    antlers() {
      const S = shape('tree');
      S.E([0, 0], [0, 1]);
      S.E([0, 1], [-0.6, 1.8]); S.E([-0.6, 1.8], [-1.1, 2.5]); S.E([-0.6, 1.8], [-0.35, 2.7]);
      S.E([0, 1], [0.6, 1.8]); S.E([0.6, 1.8], [1.1, 2.5]); S.E([0.6, 1.8], [0.35, 2.7]);
      return done(S);
    },
    flower(stem, petals, leaf) {
      const S = shape('flower');
      for (let i = 0; i < stem; i++) S.E([0, i], [0, i + 1]);
      if (leaf) S.L([0, 1], leaf > 0 ? 62 : -62);
      if (leaf === 2) S.L([0, 1], -62);
      for (let j = 0; j < petals; j++) S.L([0, stem], (j - (petals - 1) / 2) * (petals > 3 ? 62 : 75));
      return done(S);
    },
    girl() {
      const S = shape('girl');
      S.E([-0.45, 0], [0, 1.1]); S.E([0.45, 0], [0, 1.1]);
      S.E([0, 1.1], [0, 2]);
      S.E([0, 2], [-0.75, 1.45]); S.E([0, 2], [0.75, 1.45]);
      S.E([0, 2], [0, 2.3]);
      S.L([0, 2.3], 0);
      return done(S);
    },
    house(door) {
      const S = shape('house');
      S.E([0, 0], [0, 1.4]); S.E([2, 0], [2, 1.4]);
      S.E([0, 1.4], [2, 1.4]);
      S.E([0, 1.4], [1, 2.4]); S.E([1, 2.4], [1.5, 1.9]); S.E([1.5, 1.9], [2, 1.4]);
      S.E([1.5, 1.9], [1.5, 2.45]);
      if (door) { S.E([0.7, 0], [0.7, 0.85]); S.E([0.7, 0.85], [1.3, 0.85]); S.E([1.3, 0], [1.3, 0.85]); }
      return done(S);
    },
    tree2() {
      const S = shape('tree');
      S.E([0, 0], [0, 1]); S.E([0, 1], [0, 1.8]);
      S.E([0, 1.8], [-0.7, 2.5]); S.E([0, 1.8], [0.7, 2.5]);
      S.E([-0.7, 2.5], [-1.2, 3]); S.E([-0.7, 2.5], [-0.45, 3.25]);
      S.E([0.7, 2.5], [1.2, 3]); S.E([0.7, 2.5], [0.45, 3.25]);
      return done(S);
    },
    windmill() {
      const S = shape('windmill');
      S.E([0, 0], [0, 1]); S.E([0, 1], [0, 2]);
      S.E([0, 2], [-0.75, 2.75]); S.E([0, 2], [0.75, 2.75]); S.E([0, 2], [-0.75, 1.25]); S.E([0, 2], [0.75, 1.25]);
      return done(S);
    },
    cactus() {
      const S = shape('cactus');
      S.E([0, 0], [0, 1]); S.E([0, 1], [0, 1.7]); S.E([0, 1.7], [0, 2.5]);
      S.E([0, 1], [-0.6, 1]); S.E([-0.6, 1], [-0.6, 1.8]);
      S.E([0, 1.7], [0.6, 1.7]); S.E([0.6, 1.7], [0.6, 2.3]);
      return done(S);
    },
    dog() {
      const S = shape('dog');
      S.E([-0.25, 0], [0, 1]); S.E([0.25, 0], [0, 1]);
      S.E([0, 1], [1.4, 1]);
      S.E([1.15, 0], [1.4, 1]); S.E([1.65, 0], [1.4, 1]);
      S.E([0, 1], [-0.45, 1.55]);
      S.E([1.4, 1], [1.75, 1.6]);
      S.L([1.75, 1.6], 35);
      return done(S);
    },
    arch(n) {
      const S = shape('arch');
      S.E([-0.5, 0], [0, 1]); S.E([0.5, 0], [0, 1]);
      for (let i = 0; i < n; i++) S.E([0, 1 + i], [0, 2 + i]);
      return done(S);
    }
  };
  const NICE = { stalk: 'stalk', tree: 'tree', bush: 'bush', flower: 'flower', girl: 'girl', house: 'house', windmill: 'windmill', cactus: 'cactus', dog: 'dog', arch: 'arch' };

  // place shapes side by side and colour them: colours(i, shapeIndex, edge) -> 'b' | 'r' | 'g'
  function compose(kind, list, colour) {
    const v = [], e = [], names = [];
    let x = 0;
    list.forEach((S, k) => {
      const base = v.length;
      S.v.forEach((p) => v.push([Math.round((p[0] + x) * 1000) / 1000, p[1]]));
      S.e.forEach((q, j) => {
        const c = kind === 'green' ? 'g' : colour(k, j, S);
        e.push(q[2] ? [q[0] + base, q[1] + base, c, q[2]] : [q[0] + base, q[1] + base, c]);
      });
      names.push(S.name);
      x += S.w + 0.7;
    });
    return { kind, v, e, names: nameList(names) };
  }
  const ORDW = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  function nameList(names) {
    const cnt = {}, seen = {};
    names.forEach((n) => { cnt[n] = (cnt[n] || 0) + 1; });
    return names.map((n) => {
      if (cnt[n] === 1) return 'the ' + n;
      seen[n] = (seen[n] || 0) + 1;
      return 'the ' + (cnt[n] === 2 ? (seen[n] === 1 ? 'left' : 'right') : ORDW[seen[n] - 1]) + ' ' + n;
    });
  }

  /* =====================================================================
   * words
   * ===================================================================== */

  const COLW = { b: 'blue', r: 'red', g: 'green' };
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const numw = (n) => NUMW[n] || String(n);
  const capw = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const fmtV = (G, v) => (G.green ? '*' + v : C.fmtDyadic(v, true));

  // where each edge sits: its picture (from the start, left to right) and how high in it
  function placesOf(G) {
    if (G.places) return G.places;
    const d = G.d, ps = parts(G, prune(G, G.all));
    const partOf = new Array(G.n).fill(0), names = [], height = [];
    ps.forEach((P, k) => {
      P.edges.forEach((i) => { partOf[i] = k; });
      height.push(Math.max(...P.edges.map((i) => Math.max(d.v[d.e[i][0]][1], d.v[d.e[i][1]][1]))));
      names.push((d.names && d.names[k]) || (ps.length === 1 ? 'the drawing' : 'the ' + (ORDW[k] || (k + 1) + 'th') + ' piece'));
    });
    G.places = { partOf, names, height };
    return G.places;
  }
  function edgeWords(G, i) {
    const d = G.d, e = d.e[i], pl = placesOf(G), k = pl.partOf[i];
    const name = pl.names[k];
    if (e[0] === e[1]) return COLW[e[2]] + ' loop on ' + name;
    const ya = d.v[e[0]][1], yb = d.v[e[1]][1];
    if (!ya || !yb) return COLW[e[2]] + ' edge at the foot of ' + name;
    const r = (ya + yb) / 2 / (pl.height[k] || 1);
    return COLW[e[2]] + ' edge ' + (r >= 0.68 ? 'near the top of ' : 'in the middle of ') + name;
  }
  function describe(G, m, s, who) {
    if (who !== 'cpu') return 'Cut the ' + edgeWords(G, m.e) + '.';
    const fell = count(s) - count(cut(G, s, m.e)) - 1;
    return 'I cut the ' + edgeWords(G, m.e) + (fell ? ' — ' + (fell === 1 ? 'one more edge fell' : numw(fell) + ' more edges fell') + ' with it' : '') + '.';
  }

  // a stalk read from the ground up: its colours, or null if the part is not a single stalk
  function stalkColours(G, P) {
    const d = G.d;
    if (P.edges.some((i) => d.e[i][0] === d.e[i][1])) return null;
    const deg = new Map();
    P.edges.forEach((i) => d.e[i].slice(0, 2).forEach((v) => { if (!G.ground[v]) deg.set(v, (deg.get(v) || 0) + 1); }));
    const foot = P.edges.filter((i) => G.ground[d.e[i][0]] || G.ground[d.e[i][1]]);
    if (foot.length !== 1 || [...deg.values()].some((n) => n > 2)) return null;
    const out = [];
    const i = foot[0];
    let at = G.ground[d.e[i][0]] ? d.e[i][1] : d.e[i][0];
    const used = new Set([i]);
    out.push(d.e[i][2]);
    for (;;) {
      const nx = P.edges.find((j) => !used.has(j) && (d.e[j][0] === at || d.e[j][1] === at));
      if (nx == null) break;
      used.add(nx);
      out.push(d.e[nx][2]);
      at = d.e[nx][0] === at ? d.e[nx][1] : d.e[nx][0];
    }
    return out.length === P.edges.length ? out : null;
  }
  // the sign expansion of a Blue-Red stalk: 1 + 1 − ½ + ¼
  function stalkReading(cols) {
    const terms = [];
    let w = 1, changed = false;
    cols.forEach((c, k) => {
      if (k && c !== cols[k - 1]) changed = true;
      if (changed) w /= 2;
      terms.push((c === 'b' ? ' + ' : ' − ') + C.fmtDyadic(w));
    });
    return terms.join('').replace(/^ \+ /, '').replace(/^ − /, '−');
  }

  function binTable(rows) {
    const w = Math.max(1, ...rows.map((r) => r[1].toString(2).length));
    const lw = Math.max(4, ...rows.map((r) => r[0].length));
    let x = 0, t = '<span class="hb-bin">';
    rows.forEach((r) => { x ^= r[1]; t += r[0].padStart(lw, ' ') + '  ' + r[1].toString(2).padStart(w, '0') + '<br>'; });
    return t + '<span class="hb-sum">' + 'sum'.padStart(lw, ' ') + '  ' + x.toString(2).padStart(w, '0') + '</span></span>';
  }

  function partName(G, P) {
    const pl = placesOf(G);
    return pl.names[pl.partOf[P.edges[0]]];
  }

  function reason(G, s, mv) {
    const ps = parts(G, s);
    const T = total(G, s);
    if (G.green) {
      const cyc = ps.some((P) => !isTree(G, P.edges));
      const rows = ps.map((P) => [partName(G, P).replace(/^the /, ''), partValue(G, P)]);
      return 'Green Hackenbush is Nim in disguise: every piece is worth a Nim heap. A stalk of n edges is a heap of n. Where branches meet, work from the top down: the branches above a fork combine by **nim-sum** and count as one stalk of that length, standing on the edge below (the colon principle)' +
        (cyc ? '; pieces with loops or cycles are worked out by trying every cut' : '') + '. Here: ' + ps.map((P) => partName(G, P) + ' ' + fmtV(G, partValue(G, P))).join(', ') + ' — nim-sum **' + T + '**. Cut so that it becomes 0.<br>' + binTable(rows) +
        (mv ? '<br>' + describe(G, mv.m, s, 'you') : '');
    }
    const items = ps.map((P) => {
      const cols = stalkColours(G, P);
      return partName(G, P) + ' ' + fmtV(G, partValue(G, P)) + (cols && cols.length > 1 ? ' (' + stalkReading(cols) + ')' : '');
    });
    const after = mv ? total(G, mv.s) : null;
    return 'Every Blue-Red position is worth a **number** — positive counts for you (Blue), negative for me — and the pieces simply add. ' +
      'Here: ' + items.join(', ') + '; total **' + fmtV(G, T) + '**. ' + (T > 0 ? 'More than 0: you win if you play well. ' : '') +
      'Each blue cut lowers the total; choose one that keeps it at **0 or more**, and lose as little as you can. ' +
      (mv ? describe(G, mv.m, s, 'you').replace(/\.$/, '') + ': it leaves ' + fmtV(G, after) + '.' : '');
  }
  function rulesNote(G) {
    return G.green ?
      'A stalk of n green edges is exactly a Nim heap of n: cut the k-th edge from the ground and everything above falls, leaving k − 1. The **colon principle** says the branches at a fork can be replaced by one stalk as long as their nim-sum, so every tree shrinks to a single stalk; the **fusion principle** does the same for cycles (a cycle of even length shrinks to a point, an odd one to a single loop).' :
      'How to value a **stalk**: read it from the ground up. Each edge until the colour first changes is worth a whole 1 (plus for blue, minus for red); after the change each edge is worth half the one below it. A **tree** is valued from the top down: a blue edge carrying branches worth x in all is worth (x + j) ÷ 2^(j−1), where j is the smallest whole number with x + j > 1 (a red edge is the mirror image). A position worth more than 0 is a win for Blue whoever starts; worth exactly 0, it is a win for whoever moves **second**.';
  }

  /* =====================================================================
   * the view
   * ===================================================================== */

  const U = 72, LR = 0.33;
  const COLS = { b: '#3d7fe6', r: '#e2474b', g: '#2fae5c' };

  function geometry(d) {
    const P = (i) => [d.v[i][0] * U, -d.v[i][1] * U];
    return d.e.map((e) => {
      const a = P(e[0]);
      if (e[0] === e[1]) {
        const ang = (e[3] || 0) * Math.PI / 180, r = LR * U;
        const c = [a[0] + Math.sin(ang) * r, a[1] - Math.cos(ang) * r];
        const pts = [];
        for (let k = 0; k <= 24; k++) { const t = ang + Math.PI + k * Math.PI / 12; pts.push([c[0] + Math.sin(t) * r, c[1] - Math.cos(t) * r]); }
        const f = (v) => Math.round(v * 100) / 100;
        return { d: 'M' + f(c[0] - r) + ' ' + f(c[1]) + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0Z', pts, ends: [a], mid: c, loop: true };
      }
      const b = P(e[1]), bend = e[3] || 0;
      if (!bend) return { d: 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], pts: [a, b], ends: [a, b], mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
      const q = [(a[0] + b[0]) / 2 + nx * bend * len * 2, (a[1] + b[1]) / 2 + ny * bend * len * 2];
      const pts = [];
      for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push([(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * q[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * q[1] + t * t * b[1]]); }
      return { d: 'M' + a[0] + ' ' + a[1] + 'Q' + q[0] + ' ' + q[1] + ' ' + b[0] + ' ' + b[1], pts, ends: [a, b], mid: pts[6] };
    });
  }
  function segD(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    const t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2)) : 0;
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }
  function boxOf(geo) {
    let x0 = Infinity, x1 = -Infinity, y0 = 0;
    geo.forEach((g) => g.pts.forEach((p) => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); }));
    return { x0: x0 - 40, x1: x1 + 40, y0: y0 - 70, y1: 70 };
  }

  function view(G) {
    const d = G.d;
    return function (ctx, g0, top) {
      const geo = geometry(d);
      const bx = boxOf(geo);
      // the ground
      const gw = bx.x1 - bx.x0;
      ctx.s('rect', { x: bx.x0 + 10, y: 0, width: gw - 20, height: 46, rx: 12, class: 'hb-soil' }, g0);
      let grass = 'M' + (bx.x0 + 12) + ' 2';
      for (let x = bx.x0 + 12, k = 0; x < bx.x1 - 14; x += 14, k++) grass += 'L' + (x + 7) + ' ' + (k % 2 ? -8 : -5) + 'L' + (x + 14) + ' 2';
      ctx.s('path', { d: grass, class: 'hb-grass' }, g0);
      const eg = ctx.s('g', { class: 'hb-edges' }, g0);
      const els = d.e.map((e, i) => {
        const g = ctx.s('g', { class: 'hb-e c-' + e[2] }, eg);
        ctx.s('path', { d: geo[i].d, class: 'hb-halo' }, g);
        ctx.s('path', { d: geo[i].d, class: 'hb-line', stroke: COLS[e[2]], 'data-key': 'e' + i }, g);
        geo[i].ends.forEach((p) => ctx.s('circle', { cx: p[0], cy: p[1], r: p[1] === 0 ? 7 : 6.5, class: p[1] === 0 ? 'hb-nail' : 'hb-dot' }, g));
        return g;
      });
      const tags = ctx.s('g', { class: 'hb-tags' }, top);
      let stop = null;

      function show(s) {
        els.forEach((g, i) => {
          g.removeAttribute('transform');
          g.style.opacity = '';
          g.style.display = s.charCodeAt(i) === 49 ? '' : 'none';
          g.classList.remove('hov', 'bad', 'doom', 'cpu', 'mark');
        });
      }
      // falling pieces: edges that share a vertex fall together
      function clusters(list) {
        const out = [], seen = new Set();
        list.forEach((i) => {
          if (seen.has(i)) return;
          const cl = [i];
          seen.add(i);
          for (let k = 0; k < cl.length; k++) {
            const [a, b] = d.e[cl[k]];
            list.forEach((j) => { if (!seen.has(j) && (d.e[j][0] === a || d.e[j][1] === a || d.e[j][0] === b || d.e[j][1] === b)) { seen.add(j); cl.push(j); } });
          }
          let lowest = -Infinity, cx = 0, n = 0;
          cl.forEach((j) => geo[j].pts.forEach((p) => { lowest = Math.max(lowest, p[1]); cx += p[0]; n++; }));
          out.push({ edges: cl, drop: -lowest + 16, cx: cx / n, cy: lowest, spin: (cl[0] % 2 ? 1 : -1) * (7 + (cl[0] * 13) % 9) });
        });
        return out;
      }
      function draw(s, info, done) {
        if (stop) { stop(); stop = null; }
        tags.innerHTML = '';
        if (!info || !info.m || !info.from) { show(s); done(); return; }
        const from = info.from, cutE = info.m.e;
        show(from);
        const falling = alive(from).filter((i) => i !== cutE && s.charCodeAt(i) !== 49);
        const cls = clusters(falling);
        const run = () => {
          const g = els[cutE], mid = geo[cutE].mid;
          stop = C.tween(C.anim(falling.length ? 950 : 380), (t) => {
            const a = Math.min(1, t / (falling.length ? 0.3 : 1));
            g.setAttribute('transform', 'translate(' + mid[0] + ' ' + mid[1] + ') scale(' + (1 - 0.5 * a) + ') translate(' + (-mid[0]) + ' ' + (-mid[1]) + ')');
            g.style.opacity = String(1 - a);
            if (!falling.length) return;
            const f = Math.max(0, (t - 0.1) / 0.9);
            cls.forEach((c) => {
              const y = c.drop * f * f;
              c.edges.forEach((j) => {
                els[j].setAttribute('transform', 'translate(0 ' + y + ') rotate(' + c.spin * f + ' ' + c.cx + ' ' + c.cy + ')');
                els[j].style.opacity = String(f < 0.72 ? 1 : Math.max(0, 1 - (f - 0.72) / 0.28));
              });
            });
          }, () => { stop = null; show(s); done(); }, 'linear');
        };
        if (info.who === 'cpu') {
          els[cutE].classList.add('cpu');
          stop = C.tween(C.anim(420), () => {}, () => { stop = null; els[cutE].classList.remove('cpu'); run(); });
        } else run();
      }
      function moveAt(pt, s) {
        let best = -1, bd = 22;
        alive(s).forEach((i) => {
          const ps = geo[i].pts;
          for (let k = 1; k < ps.length; k++) { const dd = segD(pt, ps[k - 1], ps[k]); if (dd < bd) { bd = dd; best = i; } }
        });
        if (best < 0) return null;
        if (!G.green && d.e[best][2] !== 'b') return { e: best, bad: 'That edge is red — it is mine. You cut the blue ones.' };
        return { e: best };
      }
      function preview(m, s) {
        els.forEach((g) => g.classList.remove('hov', 'bad', 'doom'));
        if (!m) return;
        els[m.e].classList.add(m.bad ? 'bad' : 'hov');
        if (m.bad) return;
        const after = cut(G, s, m.e);
        alive(s).forEach((i) => { if (i !== m.e && after.charCodeAt(i) !== 49) els[i].classList.add('doom'); });
      }
      function mark(m) { clearMarks(); els[m.e].classList.add('mark'); }
      function clearMarks() { els.forEach((g) => g.classList.remove('mark')); }
      function showReason(s) {
        tags.innerHTML = '';
        parts(G, s).forEach((P) => {
          let x0 = Infinity, x1 = -Infinity, yt = 0;
          P.edges.forEach((i) => geo[i].pts.forEach((p) => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); yt = Math.min(yt, p[1]); }));
          const v = partValue(G, P);
          const t = fmtV(G, v);
          const w = 26 + t.length * 14, cx = (x0 + x1) / 2, cy = yt - 34;
          const g = ctx.s('g', { class: 'hb-tag ' + (G.green ? 'g' : v > 0 ? 'b' : v < 0 ? 'r' : 'z') }, tags);
          ctx.s('rect', { x: cx - w / 2, y: cy - 17, width: w, height: 34, rx: 17 }, g);
          ctx.s('text', { x: cx, y: cy + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: t }, g);
        });
      }
      return { box: bx, draw, moveAt, preview, mark, clearMarks, showReason, destroy() { if (stop) stop(); } };
    };
  }

  /* =====================================================================
   * checking and making positions
   * ===================================================================== */

  function checkData(d) {
    if (!d || (d.kind !== 'br' && d.kind !== 'green')) return 'kind must be br or green';
    if (!Array.isArray(d.v) || !Array.isArray(d.e) || !d.e.length) return 'v and e are needed';
    if (d.v.some((p) => !Array.isArray(p) || p.length !== 2 || !isFinite(p[0]) || !(p[1] >= 0))) return 'every vertex is [x, y] with y ≥ 0';
    if (d.e.length > 40) return 'at most 40 edges';
    for (const e of d.e) {
      if (!Number.isInteger(e[0]) || !Number.isInteger(e[1]) || !d.v[e[0]] || !d.v[e[1]]) return 'an edge joins a missing vertex';
      if (d.kind === 'green' ? e[2] !== 'g' : e[2] !== 'b' && e[2] !== 'r') return 'edge colours must be ' + (d.kind === 'green' ? 'g' : 'b or r');
      if (d.v[e[0]][1] === 0 && d.v[e[1]][1] === 0) return 'an edge may not lie on the ground';
    }
    if (d.first != null && d.first !== 'cpu') return 'first must be "cpu" or absent';
    const G = graphOf(d);
    if (prune(G, G.all) !== G.all) return 'some edges do not reach the ground';
    for (const P of parts(G, G.all)) if (!isTree(G, P.edges) && P.edges.length > 14) return 'a piece with cycles has more than 14 edges (too many to search)';
    return null;
  }

  function startOf(d) {
    const G = graphOf(d), s0 = prune(G, G.all);
    if (d.first !== 'cpu') return { start: s0, opening: null };
    const x = cpuMove(G, s0);
    return { start: x.s, opening: { m: x.m, from: s0 } };
  }

  const pickW = (rng, arr) => arr[rng.int(arr.length)];
  function times(n, f) { const out = []; for (let i = 0; i < n; i++) out.push(f(i)); return out; }

  // shapes for each level: [list of shapes, may the computer move first?]
  function shapesFor(rng, level, green) {
    const S = SHAPES, r = (a, b) => rng.range(a, b);
    const picture = () => pickW(rng, green ? [() => S.girl(), () => S.house(rng() < 0.4), () => S.dog(), () => S.arch(r(1, 2)), () => S.flower(2, r(2, 3), rng() < 0.5 ? 1 : 0)] :
      [() => S.flower(r(2, 3), r(2, 4), rng() < 0.6 ? 1 : 0), () => S.girl(), () => S.windmill(), () => S.cactus(), () => S.tree2(), () => S.house(false), () => S.dog()])();
    const tree = () => pickW(rng, [() => S.fork(r(1, 2), r(1, 2), r(1, 2)), () => S.bush(r(1, 2), r(2, 3)), () => S.antlers()])();
    switch (level) {
      case 1: return times(r(2, 3), () => S.stalk(green ? r(1, 5) : r(1, 3)));
      case 2: return green ? [tree()].concat(times(r(1, 2), () => S.stalk(r(1, 4)))) : times(r(2, 3), () => S.stalk(r(2, 4)));
      case 3: return green ? [tree(), tree()].concat(rng() < 0.5 ? [S.stalk(r(1, 3))] : []) : [tree()].concat(times(r(1, 2), () => S.stalk(r(1, 3))));
      case 4: return [picture()].concat(rng() < 0.6 ? [S.stalk(r(1, 3))] : green ? [tree()] : []);
      default: return rng() < 0.5 ? [picture(), picture()] : [picture(), tree()].concat(rng() < 0.4 ? [S.stalk(r(1, 3))] : []);
    }
  }

  function colourFor(rng, level) {
    if (level === 1) {
      const plan = [];
      return (k, j, S) => {
        if (!plan[k]) { const c0 = rng() < 0.55 ? 'b' : 'r'; plan[k] = { c0, at: rng() < 0.5 ? rng.range(1, Math.max(1, S.e.length - 1)) : 99 }; }
        const p = plan[k];
        return j >= p.at ? (p.c0 === 'b' ? 'r' : 'b') : p.c0;
      };
    }
    return () => (rng() < 0.52 ? 'b' : 'r');
  }

  // how hard a start is, beyond its size: the share of your moves that win
  function quality(d) {
    const G = graphOf(d), so = startOf(d);
    const M = movesOf(G, so.start, 'you'), W = winningMoves(G, so.start, 'you');
    return { M: M.length, W: W.length, T: total(G, so.start) };
  }

  function titleFrom(names, d) {
    const shapes = names.map((n) => n.replace(/^the (left |right |first |second |third |fourth |fifth |sixth )?/, ''));
    const G = graphOf(d);
    if (shapes.every((n) => n === 'stalk')) {
      if (d.kind === 'green') return 'Green Stalks of ' + andList(parts(G, G.all).map((P) => P.edges.length));
      return capw(numw(shapes.length)) + ' Striped Stalks';
    }
    const order = [], cnt = {};
    shapes.forEach((n) => { if (!cnt[n]) order.push(n); cnt[n] = (cnt[n] || 0) + 1; });
    const words = order.map((n) => (cnt[n] === 1 ? 'a ' + capw(n) : capw(numw(cnt[n])) + ' ' + capw(n) + 's'));
    let t = andList(words).replace(/^a /, 'A ');
    if (d.kind === 'green') t = t.replace(/^A /, 'A Green ').replace(/^(Two|Three|Four) /, '$1 Green ');
    return t;
  }
  function andList(a) { return a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  function textOf(d, shapes) {
    const G = graphOf(d);
    const words = shapes.map((n) => n.replace(/^the (left |right |first |second |third |fourth |fifth |sixth )?/, ''));
    const cnt = {}, order = [];
    words.forEach((n) => { if (!cnt[n]) order.push(n); cnt[n] = (cnt[n] || 0) + 1; });
    const what = andList(order.map((n) => (cnt[n] === 1 ? 'a ' + n : numw(cnt[n]) + ' ' + n + 's')));
    const who = d.first === 'cpu' ? 'I cut first.' : 'You cut first.';
    if (G.green) return capw(what) + ', drawn in green on the ground. Either of us may cut **any** edge in a turn; everything no longer joined to the ground falls away. Whoever has nothing left to cut loses. ' + who;
    return capw(what) + ', drawn in blue and red on the ground. You are **Blue**: in your turn cut one blue edge; I cut red ones. Everything no longer joined to the ground falls away, and whoever has nothing left to cut loses. ' + who;
  }

  function generate(rng, level, green) {
    for (let tries = 0; tries < 90; tries++) {
      const list = shapesFor(rng, level, green);
      const d = compose(green ? 'green' : 'br', list, colourFor(rng, level));
      if (level >= 4 && rng() < 0.3) d.first = 'cpu';
      if (checkData(d)) continue;
      const G = graphOf(d), s0 = prune(G, G.all), T = total(G, s0);
      if (!green && (!d.e.some((e) => e[2] === 'r') || !d.e.some((e) => e[2] === 'b'))) continue;
      if (d.first === 'cpu') { if (green ? T !== 0 : T < 0) continue; }
      else if (green ? T === 0 : T <= 0) continue;
      const q = quality(d);
      if (!q.W || q.M < 2) continue;
      const share = q.W / q.M;
      if (level === 1 && !green && share > 0.8) continue;
      if (level === 2 && share > 0.6) continue;
      if (level === 3 && share > 0.5) continue;
      if (level >= 4 && share > (level === 4 ? 0.4 : 0.34)) continue;
      if (!green && level >= 4 && q.T > (level === 4 ? 2 : 1)) continue;
      return { d, title: titleFrom(d.names, d), text: textOf(d, d.names) };
    }
    return null;
  }

  C.hackenbushLogic = { graphOf, prune, cut, parts, simplest, blueOn, total, bruteValue, movesOf, wins, winningMoves, bestMove, cpuMove, SHAPES, compose, alive, count, isTree, stalkReading, stalkColours, partValue, reason, describe, checkData, startOf, generate, quality, titleFrom, textOf, rulesNote };

  /* =====================================================================
   * the engine
   * ===================================================================== */

  const ABOUT_BR = '**Blue-Red Hackenbush.** You are Blue. Point at a blue edge: it lights up, and every edge that would fall with it turns dashed. Click to cut it. Then I cut a red edge. Anything no longer joined to the ground falls away. Whoever has no edge of their own colour left to cut **loses**.\n\nThe computer knows the value of every position and never slips: let it in and it will win — but **Take back** (or Undo) is always there. Hints give the winning cut first, then the arithmetic behind it.';
  const ABOUT_GREEN = '**Green Hackenbush.** Every edge is green: either of us may cut any edge. Point at an edge to see what would fall with it, and click to cut. Whoever has nothing left to cut **loses**.\n\nThe computer knows the Nim value of every picture and never slips — but **Take back** (or Undo) is always there. Hints give the winning cut first, then the nim-sums behind it.';

  C.engine({
    id: 'hackenbush',
    name: 'Hackenbush',
    deps: ['js/lib/duel.js'],
    movesLabel: 'Cuts',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about(p) {
      const k = p && p.data && p.data.kind;
      return k === 'green' ? ABOUT_GREEN : k === 'br' ? ABOUT_BR : ABOUT_BR + '\n\n' + ABOUT_GREEN;
    },

    verify(p) {
      const d = p.data;
      const e = checkData(d);
      if (e) return { ok: false, err: e };
      const G = graphOf(d), s0 = prune(G, G.all), T = total(G, s0);
      if (d.first === 'cpu') {
        if (G.green ? T !== 0 : T < 0) return { ok: false, err: 'the computer, cutting first, would win (value ' + T + ')' };
        if (!movesOf(G, s0, 'cpu').length) return { ok: false, err: 'the computer has nothing to cut' };
        return { ok: true };
      }
      if (G.green ? T === 0 : T <= 0) return { ok: false, err: 'you, cutting first, would lose (value ' + T + ')' };
      if (!winningMoves(G, s0, 'you').length) return { ok: false, err: 'no winning cut found' };
      return { ok: true };
    },

    generate(rng, level, fam) {
      const green = rng() < 0.4;
      const g = generate(rng, level, green);
      if (!g) return null;
      return { title: g.title, text: g.text, diff: level, data: g.d };
    },

    mount(ctx, p) {
      const d = p.data, G = graphOf(d);
      const so = startOf(d);
      if (!p.goal) {
        ctx.setGoal(G.green ? 'Cut any green edge in your turn; whatever loses touch with the ground falls. Whoever cannot cut loses. ' + (d.first === 'cpu' ? 'I cut first — then win.' : 'You cut first — win.') :
          'You cut **blue** edges, I cut **red** ones; whatever loses touch with the ground falls. Whoever cannot cut loses. ' + (d.first === 'cpu' ? 'I cut first — then win.' : 'You cut first — win.'));
      }
      return C.duel(ctx, p, {
        start: so.start,
        opening: so.opening,
        moves: (s, who) => movesOf(G, s, who),
        wins: (s, who) => wins(G, s, who),
        best: (s) => bestMove(G, s),
        cpu: (s) => cpuMove(G, s),
        same: (a, b) => !!a && !!b && a.e === b.e,
        describe: (m, s, who) => describe(G, m, s, who),
        reason: (s, mv) => reason(G, s, mv),
        explain() { const mv = bestMove(G, so.start); return (mv ? reason(G, so.start, mv) : '') + '\n\n' + rulesNote(G); },
        winMsg: G.green ? 'Nothing is left to cut, and it is my turn — you win!' : 'I have no red edge left to cut — you win!',
        loseMsg: G.green ? 'Nothing is left for you to cut — I win this time.' : 'You have no blue edge left to cut — I win this time.',
        view: view(G)
      });
    },

    thumb(p) {
      const d = p.data, geo = geometry(d), bx = boxOf(geo);
      let b = '<rect x="' + (bx.x0 + 10) + '" y="0" width="' + (bx.x1 - bx.x0 - 20) + '" height="40" rx="10" fill="#6b4a2b"/><rect x="' + (bx.x0 + 10) + '" y="-3" width="' + (bx.x1 - bx.x0 - 20) + '" height="9" rx="4" fill="#4c9a3c"/>';
      d.e.forEach((e, i) => { b += '<path d="' + geo[i].d + '" fill="none" stroke="' + COLS[e[2]] + '" stroke-width="12" stroke-linecap="round"/>'; });
      return '<svg viewBox="' + bx.x0 + ' ' + (bx.y0 + 40) + ' ' + (bx.x1 - bx.x0) + ' ' + (bx.y1 - bx.y0 - 50) + '" preserveAspectRatio="xMidYMid meet">' + b + '</svg>';
    }
  });

  C.css('hackenbush', `
    .hb-soil { fill: #6b4a2b; }
    [data-theme="light"] .hb-soil { fill: #8a6541; }
    .hb-grass { fill: #4c9a3c; stroke: #3b7f2e; stroke-width: 2; stroke-linejoin: round; }
    .hb-e { cursor: pointer; }
    .hb-line { fill: none; stroke-width: 12; stroke-linecap: round; stroke-linejoin: round; }
    .hb-halo { fill: none; stroke: transparent; stroke-width: 26; stroke-linecap: round; }
    .hb-dot { fill: var(--ink); stroke: var(--board); stroke-width: 2; }
    .hb-nail { fill: #3a2614; stroke: #c9a57a; stroke-width: 2; }
    .hb-e.hov .hb-halo { stroke: var(--gold); stroke-opacity: .55; }
    .hb-e.bad .hb-halo { stroke: var(--red); stroke-opacity: .45; }
    .hb-e.doom .hb-line { stroke-dasharray: 3 14; opacity: .75; }
    .hb-e.cpu .hb-halo { stroke: var(--pink); stroke-opacity: .8; stroke-dasharray: 10 8; }
    .hb-e.mark .hb-halo { stroke: var(--gold); stroke-opacity: .9; stroke-dasharray: 12 9; animation: hbblink 1s ease-in-out infinite; }
    @keyframes hbblink { 50% { stroke-opacity: .25; } }
    .hb-tag { pointer-events: none; }
    .hb-tag rect { stroke-width: 2; }
    .hb-tag text { font: 800 20px "Segoe UI", system-ui, sans-serif; }
    .hb-tag.b rect { fill: #3d7fe6; stroke: #2a5fb3; } .hb-tag.b text { fill: #fff; }
    .hb-tag.r rect { fill: #e2474b; stroke: #a92d31; } .hb-tag.r text { fill: #fff; }
    .hb-tag.z rect { fill: var(--panel-2); stroke: var(--line); } .hb-tag.z text { fill: var(--text); }
    .hb-tag.g rect { fill: #2fae5c; stroke: #1f7f41; } .hb-tag.g text { fill: #fff; }
    .hb-bin { white-space: pre; font-family: Consolas, "Cascadia Mono", Menlo, monospace; font-size: 13px; line-height: 1.35; display: inline-block; margin: 6px 0 4px; padding: 6px 10px; border-radius: 8px; background: var(--panel-3, rgba(127,127,127,.12)); }
    .hb-sum { display: inline-block; border-top: 1px solid currentColor; margin-top: 2px; font-weight: 700; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
