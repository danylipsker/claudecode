/* The Puzzle Cabinet · engines/lights.js
 *
 * Two kinds of switching puzzle that share one idea — doing a move twice
 * undoes it, so only WHICH moves you make matters, never their order:
 *
 * 1. Lamps (Lights Out and its relatives). Pressing a lamp switches it and
 *    its neighbours. Solved over the numbers mod 2 (or mod 3 for lamps with
 *    three colours) by Gaussian elimination; the par is the fewest presses.
 *
 *    data: {
 *      grid: [w, h]                  a rectangle of lamps
 *      mask: '111/1.1/111'           optional: which cells hold a lamp ('.' = none), rows top to bottom
 *      graph: { pts: [[x, y], ...], edges: [[i, j], ...] }   lamps on the corners of a figure instead
 *      nb: 'plus' | 'ortho' | 'x' | 'king' | 'knight' | 'merlin'   whom a press switches (grid only)
 *      torus: true                   the grid wraps round: left edge meets right, top meets bottom
 *      k: 2 | 3                      states of a lamp (3: off → red → green → off)
 *      start: '0110…'                each lamp's state, in reading order
 *      target: '000…'                the goal (default: all off)
 *    }
 *
 * 2. Glasses (or coins): a row or a ring, some upside down; every turn
 *    turns over exactly `turn` of them. Solved by breadth-first search; some
 *    are impossible, and then the answer is to say so (with the reason).
 *
 *    data: {
 *      mode: 'glasses', look: 'glass' | 'coin', n: 7, ring: false,
 *      turn: 3,                      glasses turned at every move
 *      adj: false,                   true: the ones turned must stand side by side
 *      start: '0100110',             1 = upside down (tails)
 *      target: '0000000',            optional, default all upright (heads)
 *      impossible: true, why: 'parity' | 'all' | 'colours'   when it cannot be done
 *    }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const U = 100; // world units per lamp

  /* =====================================================================
   * Lamps: the model
   * ===================================================================== */

  const NB = {
    plus: [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]],
    ortho: [[1, 0], [-1, 0], [0, 1], [0, -1]],
    x: [[0, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
    king: [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
    knight: [[0, 0], [1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]
  };
  const NB_WORDS = {
    plus: 'switches itself and its neighbours above, below, left and right',
    ortho: 'switches its neighbours above, below, left and right — but not itself',
    x: 'switches itself and its four diagonal neighbours',
    king: 'switches itself and all eight lamps around it',
    knight: 'switches itself and every lamp a chess knight’s move away',
    merlin: 'does something different on a corner, an edge or the centre',
    graph: 'switches itself and every lamp joined to it by a wire'
  };

  function digits(str, n) {
    const a = String(str || '').split('').map(Number);
    if (n != null && a.length !== n) return null;
    return a;
  }

  function parseGrid(d) {
    const w = d.grid[0], h = d.grid[1];
    const rows = d.mask ? d.mask.split('/') : null;
    const cells = [], idx = [];
    for (let r = 0; r < h; r++) {
      idx.push([]);
      for (let c = 0; c < w; c++) {
        const on = !rows || (rows[r] != null && rows[r][c] != null && rows[r][c] !== '.');
        idx[r].push(on ? cells.length : -1);
        if (on) cells.push([c, r]);
      }
    }
    return { w, h, cells, idx };
  }

  // Merlin's magic square (3 × 3): a corner switches its 2 × 2 block, an edge
  // its whole side, the centre itself and the four edge lamps
  function merlinPress(c, r, g) {
    const out = [];
    const add = (cc, rr) => { const j = g.idx[rr] ? g.idx[rr][cc] : -1; if (j != null && j >= 0) out.push(j); };
    if (c === 1 && r === 1) [[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]].forEach((q) => add(q[0], q[1]));
    else if (c !== 1 && r !== 1) { const c0 = c === 0 ? 0 : 1, r0 = r === 0 ? 0 : 1; add(c0, r0); add(c0 + 1, r0); add(c0, r0 + 1); add(c0 + 1, r0 + 1); }
    else if (r === 1) { for (let rr = 0; rr < 3; rr++) add(c, rr); }
    else { for (let cc = 0; cc < 3; cc++) add(cc, r); }
    return out.sort((a, b) => a - b);
  }

  const cache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function model(d) {
    let B = cache && cache.get(d);
    if (B) return B;
    B = buildModel(d);
    if (cache) cache.set(d, B);
    return B;
  }

  function buildModel(d) {
    const B = { k: d.k || 2 };
    if (d.graph) {
      const pts = d.graph.pts;
      let md = Infinity;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) md = Math.min(md, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]));
      const f = (1.3 * U) / (md || 1);
      B.kind = 'graph';
      B.n = pts.length;
      B.pos = pts.map((q) => [q[0] * f, q[1] * f]);
      B.edges = d.graph.edges.slice();
      B.press = pts.map((q, i) => [i]);
      B.edges.forEach((e) => { B.press[e[0]].push(e[1]); B.press[e[1]].push(e[0]); });
      B.press.forEach((l) => l.sort((a, b) => a - b));
    } else {
      const g = parseGrid(d);
      Object.assign(B, g);
      B.kind = 'grid';
      B.n = g.cells.length;
      B.pos = g.cells.map((q) => [q[0] * U, q[1] * U]);
      B.press = g.cells.map((q) => {
        const c = q[0], r = q[1];
        if (d.nb === 'merlin') return merlinPress(c, r, g);
        const out = new Set();
        (NB[d.nb || 'plus'] || NB.plus).forEach((o) => {
          let cc = c + o[0], rr = r + o[1];
          if (d.torus) { cc = ((cc % g.w) + g.w) % g.w; rr = ((rr % g.h) + g.h) % g.h; }
          if (cc < 0 || rr < 0 || cc >= g.w || rr >= g.h) return;
          const j = g.idx[rr][cc];
          if (j >= 0) out.add(j);
        });
        return Array.from(out).sort((a, b) => a - b);
      });
    }
    B.start = digits(d.start, B.n);
    B.target = d.target ? digits(d.target, B.n) : new Array(B.n).fill(0);
    return B;
  }

  /* ---------- solving: linear algebra mod 2 or mod 3 ---------- */

  function matrixOf(B) {
    const A = [];
    for (let j = 0; j < B.n; j++) A.push(new Array(B.n).fill(0));
    B.press.forEach((list, i) => list.forEach((j) => { A[j][i] = (A[j][i] + 1) % B.k; }));
    return A;
  }

  // solve A x = b (mod p, p prime): a particular solution and a basis of the null space
  function gauss(A, b, p) {
    const n = A.length, m = A[0].length;
    const M = A.map((row, i) => row.concat([b[i]]).map((v) => ((v % p) + p) % p));
    const inv = p === 2 ? [0, 1] : [0, 1, 2];
    const pivCol = [];
    let r = 0;
    for (let c = 0; c < m && r < n; c++) {
      let piv = -1;
      for (let i = r; i < n; i++) if (M[i][c]) { piv = i; break; }
      if (piv < 0) continue;
      const t = M[r]; M[r] = M[piv]; M[piv] = t;
      const iv = inv[M[r][c]];
      if (iv !== 1) for (let j = c; j <= m; j++) M[r][j] = (M[r][j] * iv) % p;
      for (let i = 0; i < n; i++) {
        if (i === r || !M[i][c]) continue;
        const f = M[i][c];
        for (let j = c; j <= m; j++) if (M[r][j]) M[i][j] = ((M[i][j] - f * M[r][j]) % p + p) % p;
      }
      pivCol.push(c);
      r++;
    }
    for (let i = r; i < n; i++) if (M[i][m]) return null;
    const x = new Array(m).fill(0);
    pivCol.forEach((c, i) => { x[c] = M[i][m]; });
    const isPiv = new Array(m).fill(false);
    pivCol.forEach((c) => { isPiv[c] = true; });
    const basis = [];
    for (let f = 0; f < m; f++) {
      if (isPiv[f]) continue;
      const v = new Array(m).fill(0);
      v[f] = 1;
      pivCol.forEach((c, i) => { v[c] = (p - M[i][f]) % p; });
      basis.push(v);
    }
    return { x, basis };
  }

  // the fewest presses from state s to the target: { x: presses per lamp, n: total, exact, free: null-space dimension }
  function plan(B, s) {
    const p = B.k;
    if (!B.A) B.A = matrixOf(B);
    const b = B.target.map((t, j) => ((t - s[j]) % p + p) % p);
    const g = gauss(B.A, b, p);
    if (!g) return null;
    const kd = g.basis.length;
    const total = Math.pow(p, kd);
    const cost = (v) => { let c = 0; for (let i = 0; i < v.length; i++) c += v[i]; return c; };
    let best = g.x.slice(), bestC = cost(best);
    let exact = true;
    if (kd && total <= 65536) {
      const cur = g.x.slice(), dig = new Array(kd).fill(0);
      for (let step = 1; step < total; step++) {
        let i = 0;
        for (;;) {
          const v = g.basis[i];
          for (let j = 0; j < cur.length; j++) if (v[j]) cur[j] = (cur[j] + v[j]) % p;
          if (++dig[i] < p) break;
          dig[i] = 0;
          i++;
        }
        const c = cost(cur);
        if (c < bestC) { bestC = c; best = cur.slice(); }
      }
    } else if (kd) exact = false;
    return { x: best, n: bestC, exact, free: kd };
  }

  function applyPress(B, s, i) {
    B.press[i].forEach((j) => { s[j] = (s[j] + 1) % B.k; });
    return s;
  }

  /* =====================================================================
   * Glasses: the model
   * ===================================================================== */

  function gModel(d) {
    const n = d.n;
    return {
      n, k: d.turn, adj: !!d.adj, ring: !!d.ring, look: d.look || 'glass',
      start: digits(d.start, n), target: d.target ? digits(d.target, n) : new Array(n).fill(0)
    };
  }

  function blocksOf(G) {
    const out = [];
    const cnt = G.ring ? G.n : G.n - G.k + 1;
    for (let s = 0; s < cnt; s++) {
      const b = [];
      for (let t = 0; t < G.k; t++) b.push((s + t) % G.n);
      out.push(b);
    }
    return out;
  }

  // the shortest list of turns (each a list of glass indices) from state st to the target, or null
  function gSolve(G, st) {
    const n = G.n, k = G.k;
    const mis = st.map((v, i) => (v !== G.target[i] ? 1 : 0));
    if (G.adj) {
      const blocks = blocksOf(G);
      const bm = blocks.map((b) => b.reduce((m, i) => m | (1 << i), 0));
      let s0 = 0;
      mis.forEach((v, i) => { if (v) s0 |= 1 << i; });
      if (!s0) return [];
      const size = 1 << n;
      const prev = new Int32Array(size).fill(-1);
      const via = new Int16Array(size);
      prev[s0] = s0;
      let front = [s0];
      while (front.length) {
        const next = [];
        for (const a of front) {
          for (let b = 0; b < bm.length; b++) {
            const c = a ^ bm[b];
            if (prev[c] >= 0) continue;
            prev[c] = a; via[c] = b;
            if (c === 0) {
              const path = [];
              let cur = 0;
              while (cur !== s0) { path.unshift(blocks[via[cur]].slice()); cur = prev[cur]; }
              return path;
            }
            next.push(c);
          }
        }
        front = next;
      }
      return null;
    }
    // any k glasses: only the number of wrong ones matters
    const m0 = mis.reduce((a, b) => a + b, 0);
    if (!m0) return [];
    const from = new Array(n + 1).fill(-2), jOf = new Array(n + 1).fill(0);
    from[m0] = -1;
    let front = [m0], found = false;
    while (front.length && !found) {
      const next = [];
      for (const m of front) {
        for (let j = Math.max(0, k - (n - m)); j <= Math.min(k, m); j++) {
          const m2 = m - j + (k - j);
          if (from[m2] !== -2) continue;
          from[m2] = m; jOf[m2] = j;
          if (m2 === 0) { found = true; break; }
          next.push(m2);
        }
        if (found) break;
      }
      front = next;
    }
    if (!found) return null;
    const js = [];
    let cur = 0;
    while (cur !== m0) { js.unshift(jOf[cur]); cur = from[cur]; }
    // turn the first j wrong glasses and the first k - j right ones
    const w = mis.slice(), path = [];
    js.forEach((j) => {
      const bad = [], good = [];
      w.forEach((v, i) => { if (v && bad.length < j) bad.push(i); else if (!v && good.length < k - j) good.push(i); });
      const mv = bad.concat(good).sort((a, b) => a - b);
      mv.forEach((i) => { w[i] ^= 1; });
      path.push(mv);
    });
    return path;
  }

  // why an impossible start cannot be solved (the reasons the texts explain)
  function gReasons(G) {
    const mis = G.start.map((v, i) => (v !== G.target[i] ? 1 : 0));
    const m = mis.reduce((a, b) => a + b, 0);
    const out = {};
    if (G.k % 2 === 0 && m % 2 === 1) out.parity = true;
    if (!G.adj && G.k === G.n && m !== 0 && m !== G.n) out.all = true;
    if (G.adj && G.k >= 2 && (!G.ring || G.n % G.k === 0)) {
      const par = new Array(G.k).fill(0);
      mis.forEach((v, i) => { par[i % G.k] ^= v; });
      if (par.some((v) => v !== par[0])) out.colours = par;
    }
    return out;
  }

  function wordsOf(G) {
    const thing = G.look === 'coin' ? 'coin' : 'glass';
    const things = G.look === 'coin' ? 'coins' : 'glasses';
    const down = G.look === 'coin' ? 'tails up' : 'upside down';
    const up = G.look === 'coin' ? 'heads up' : 'upright';
    return { thing, things, down, up };
  }

  function gWhyText(G, why) {
    const W = wordsOf(G);
    const mis = G.start.map((v, i) => (v !== G.target[i] ? 1 : 0));
    const m = mis.reduce((a, b) => a + b, 0);
    const wrong = G.target.some((v) => v) ? 'wrong way round' : W.down;
    if (why === 'all') {
      return 'Every turn turns over **all** ' + G.n + ' ' + W.things + ', so there are only two positions: this one and its exact opposite. Neither has every ' + W.thing + ' ' + W.up + '.';
    }
    if (why === 'colours') {
      const R = gReasons(G).colours || [];
      const names = ['red', 'blue', 'green', 'gold', 'violet', 'teal'];
      const odd = [], even = [];
      R.forEach((v, i) => (v ? odd : even).push(names[i] || 'colour ' + (i + 1)));
      return 'Colour the ' + W.things + ' in ' + G.k + ' colours in turn (' + names.slice(0, G.k).join(', ') + ', ' + names[0] + ', …). ' +
        G.k + ' ' + W.things + ' side by side always include exactly **one of each colour**, so every turn changes, for *every* colour, the number of ' + W.things + ' that are ' + wrong + ' by one: all those numbers switch between odd and even together. ' +
        'At the start ' + odd.join(' and ') + ' ' + (odd.length === 1 ? 'has' : 'have') + ' an odd number wrong and ' + even.join(' and ') + ' an even number. They can never all reach zero (even) at the same time — so it cannot be done.';
    }
    return 'Each ' + W.thing + ' you turn over either puts one right or puts one wrong, so the number of ' + W.things + ' that are ' + wrong + ' goes up or down by one for each. Turning ' + G.k + ' — an even number — at a time changes it by an even amount: **odd stays odd**. It starts at ' + m + ', which is odd, and the goal is 0, which is even. So it cannot be done, however long you try.';
  }

  /* =====================================================================
   * texts shared by the engine and the generator
   * ===================================================================== */

  function lampWhere(B, i) {
    if (B.kind !== 'grid') return 'lamp ' + (i + 1);
    const q = B.cells[i];
    return 'row ' + (q[1] + 1) + ', column ' + (q[0] + 1);
  }

  function goalText(d, B) {
    if (d.nb === 'merlin' && d.target === '111101111') return 'Light the eight outer lamps and leave the centre dark — Merlin’s magic square.';
    const any = B.target.some((v) => v);
    if (B.k === 3) return any ? 'Make every lamp show the colour of its goal dot. A press moves a lamp one step round: off → red → green → off.' : 'Switch every lamp **off**. A press moves each lamp it touches one step round: off → red → green → off.';
    if (any) return 'Make the lamps match the goal pattern (the small picture, and the dot in each lamp’s corner).';
    return 'Switch every lamp **off**.';
  }

  function lampExplain(d, B) {
    const pl = plan(B, B.start);
    if (!pl) return '';
    const list = [];
    pl.x.forEach((v, i) => { if (v) list.push(lampWhere(B, i) + (v === 2 ? ' (twice)' : '')); });
    let t = 'Pressing a lamp twice' + (B.k === 3 ? ' — or three times with three colours — puts it back' : ' undoes itself') + ', and the order of presses makes no difference: each lamp just counts how often it was switched. So a solution is only a *set* of lamps to press, and the puzzle is a system of equations ' + (B.k === 3 ? 'in arithmetic mod 3' : 'in arithmetic mod 2 (1 + 1 = 0)') + ', one equation per lamp. Gaussian elimination solves it — and says at once when a pattern cannot be solved at all.';
    t += '\n\nThe fewest presses here: **' + pl.n + '** — ' + list.join('; ') + '.';
    if (pl.free) t += ' (This board has ' + Math.pow(B.k, pl.free) + ' different sets of presses that do nothing at all, so every solvable pattern has ' + Math.pow(B.k, pl.free) + ' solutions; the one above is the shortest.)';
    if (B.kind === 'grid' && (d.nb || 'plus') === 'plus' && !d.torus && !d.mask && B.k === 2) {
      t += '\n\nA method that always works on the ordinary board is **chasing the lights**: go down row by row, pressing each lamp under a lamp that is still on. Everything ends up in the bottom row; then a short table of top-row presses (worked out once, by the same algebra) clears it on a second chase.';
    }
    return t;
  }

  /* =====================================================================
   * making puzzles (Endless drawers, and tools/gen/lights.js)
   * ===================================================================== */

  const MASKS = {
    octagon: { grid: [5, 5], mask: '.111./11111/11111/11111/.111.', name: 'an octagon', short: 'Octagon' },
    diamond: { grid: [5, 5], mask: '..1../.111./11111/.111./..1..', name: 'a diamond', short: 'Diamond' },
    ring: { grid: [5, 5], mask: '11111/11111/11.11/11111/11111', name: 'a square with a hole in the middle', short: 'Hollow Square' },
    letterH: { grid: [5, 5], mask: '11.11/11.11/11111/11.11/11.11', name: 'the letter H', short: 'Letter H' },
    tee: { grid: [5, 5], mask: '11111/11111/.111./.111./.111.', name: 'a letter T', short: 'Letter T' },
    stairs: { grid: [5, 5], mask: '1..../11.../111../1111./11111', name: 'a staircase', short: 'Staircase' },
    frame: { grid: [6, 6], mask: '111111/111111/11..11/11..11/111111/111111', name: 'a picture frame', short: 'Picture Frame' },
    heart: { grid: [7, 6], mask: '.11.11./1111111/1111111/.11111./..111../...1...', name: 'a heart', short: 'Heart' },
    cross: { grid: [7, 7], mask: '..111../..111../1111111/1111111/1111111/..111../..111..', name: 'a fat plus sign', short: 'Plus Sign' },
    donut: { grid: [7, 7], mask: '1111111/1111111/11...11/11...11/11...11/1111111/1111111', name: 'a square doughnut', short: 'Doughnut' },
    arrow: { grid: [7, 5], mask: '...1.../..111../.11111./1111111/..111..', name: 'an arrowhead', short: 'Arrowhead' }
  };

  const r2 = (v) => Math.round(v * 100) / 100;
  function ringPts(n, r, cx, cy, rot) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = (rot || -Math.PI / 2) + (2 * Math.PI * i) / n; out.push([r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))]); }
    return out;
  }
  const cycle = (n, off) => { const e = []; for (let i = 0; i < n; i++) e.push([off + i, off + ((i + 1) % n)]); return e; };
  const GRAPHS = {
    tetra: { name: 'the corners of a tetrahedron (a triangle and its centre)', short: 'Tetrahedron', make() { return { pts: ringPts(3, 2, 0, 0).concat([[0, 0]]), edges: cycle(3, 0).concat([[0, 3], [1, 3], [2, 3]]) }; } },
    pentagon: { name: 'the corners of a pentagon', short: 'Pentagon', make() { return { pts: ringPts(5, 2, 0, 0), edges: cycle(5, 0) }; } },
    hexagon: { name: 'the corners of a hexagon', short: 'Hexagon', make() { return { pts: ringPts(6, 2, 0, 0), edges: cycle(6, 0) }; } },
    heptagon: { name: 'a ring of seven', short: 'Ring of Seven', make() { return { pts: ringPts(7, 2.4, 0, 0), edges: cycle(7, 0) }; } },
    ring9: { name: 'a ring of nine', short: 'Ring of Nine', make() { return { pts: ringPts(9, 3, 0, 0), edges: cycle(9, 0) }; } },
    wheel: { name: 'a wheel: six on the rim and one at the hub', short: 'Wheel', make() { return { pts: ringPts(6, 2, 0, 0).concat([[0, 0]]), edges: cycle(6, 0).concat([0, 1, 2, 3, 4, 5].map((i) => [i, 6])) }; } },
    cube: { name: 'the corners of a cube (drawn flat: the small square is the back face)', short: 'Cube', make() { return { pts: [[0, 0], [3, 0], [3, 3], [0, 3], [1, 1], [2, 1], [2, 2], [1, 2]], edges: cycle(4, 0).concat(cycle(4, 4), [[0, 4], [1, 5], [2, 6], [3, 7]]) }; } },
    prism: { name: 'the corners of a triangular prism (drawn flat)', short: 'Prism', make() { return { pts: ringPts(3, 3, 0, 0).concat(ringPts(3, 1.2, 0, 0)), edges: cycle(3, 0).concat(cycle(3, 3), [[0, 3], [1, 4], [2, 5]]) }; } },
    octahedron: { name: 'the corners of an octahedron (drawn flat)', short: 'Octahedron', make() { return { pts: ringPts(3, 3, 0, 0).concat(ringPts(3, 1.1, 0, 0, Math.PI / 2)), edges: cycle(3, 0).concat(cycle(3, 3), [[0, 4], [0, 5], [1, 5], [1, 3], [2, 3], [2, 4]]) }; } },
    pentaprism: { name: 'the corners of a five-sided prism (drawn flat)', short: 'Pentagonal Prism', make() { return { pts: ringPts(5, 3, 0, 0).concat(ringPts(5, 1.5, 0, 0)), edges: cycle(5, 0).concat(cycle(5, 5), [0, 1, 2, 3, 4].map((i) => [i, i + 5])) }; } },
    petersen: { name: 'the Petersen graph: a pentagon, a five-pointed star, and spokes', short: 'Petersen Graph', make() { return { pts: ringPts(5, 3, 0, 0).concat(ringPts(5, 1.4, 0, 0)), edges: cycle(5, 0).concat([0, 1, 2, 3, 4].map((i) => [i, i + 5]), [0, 1, 2, 3, 4].map((i) => [5 + i, 5 + ((i + 2) % 5)])) }; } },
    dodecahedron: { name: 'the twenty corners of a dodecahedron (drawn flat)', short: 'Dodecahedron', make() {
      const pts = ringPts(5, 4, 0, 0).concat(ringPts(10, 2.6, 0, 0), ringPts(5, 1.3, 0, 0, Math.PI / 2));
      const e = cycle(5, 0).concat([0, 1, 2, 3, 4].map((i) => [i, 5 + 2 * i]), cycle(10, 5), [0, 1, 2, 3, 4].map((i) => [5 + 2 * i + 1, 15 + ((i + 3) % 5)]), cycle(5, 15));
      return { pts, edges: e };
    } },
    honeycomb: { name: 'a hexagon of nineteen lamps, each touching up to six others', short: 'Honeycomb', make() {
      const pts = [];
      for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) { if (Math.abs(q + r) > 2) continue; pts.push([r2(q + r / 2), r2(r * Math.sqrt(3) / 2)]); }
      const edges = [];
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.abs(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) - 1) < 0.05) edges.push([i, j]);
      return { pts, edges };
    } },
    triangle: { name: 'a triangle of ten lamps', short: 'Triangle of Ten', make() {
      const pts = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c <= r; c++) pts.push([r2(c - r / 2), r2(r * Math.sqrt(3) / 2)]);
      const edges = [];
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.abs(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) - 1) < 0.05) edges.push([i, j]);
      return { pts, edges };
    } }
  };
  // the dodecahedron's inner pentagon must meet the right middle lamps: check and repair at load
  (function fixDodeca() {
    const g = GRAPHS.dodecahedron.make();
    const deg = new Array(g.pts.length).fill(0);
    g.edges.forEach((e) => { deg[e[0]]++; deg[e[1]]++; });
    if (deg.some((v) => v !== 3)) GRAPHS.dodecahedron.bad = true;
  })();

  const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const numw = (n) => NUMW[n] || String(n);
  const capw = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function lampScore(d, B, par) {
    let s = par;
    if (B.n > 25) s += 1;
    if (B.n > 36) s += 1;
    const nb = d.graph ? 'graph' : d.nb || 'plus';
    s += { plus: 0, x: 1, ortho: 2, king: 2, knight: 3, merlin: 1, graph: 1 }[nb] || 0;
    if (d.torus) s += 2;
    if (B.k === 3) s += 3;
    if (B.target.some((v) => v)) s += 1;
    return s;
  }
  function lampDiff(score) { return score <= 3 ? 1 : score <= 6 ? 2 : score <= 9 ? 3 : score <= 13 ? 4 : 5; }

  function lampText(d, info) {
    const B = model(d);
    const onCount = B.start.filter((v) => v).length;
    let t;
    if (d.nb === 'merlin') {
      t = 'Merlin’s magic square: nine buttons that light up. Pressing a **corner** switches the four lamps of its corner block; an **edge** switches the three along its side; the **centre** switches itself and the four edge lamps.';
    } else if (d.graph) {
      t = capw(numw(B.n)) + ' lamps sit on ' + (info && info.name ? info.name : 'the corners of a figure') + '. Pressing a lamp switches it and every lamp joined to it by a wire.';
    } else {
      const shape = info && info.name ? ', in the shape of ' + info.name : '';
      t = 'A ' + d.grid[0] + ' × ' + d.grid[1] + ' panel of lamps' + shape + '. Pressing a lamp ' + NB_WORDS[d.nb || 'plus'] + '.';
      if (d.torus) t += ' The panel **wraps round**: the left edge touches the right edge and the top touches the bottom, so a lamp on the edge has neighbours on the far side.';
    }
    if (B.k === 3) t += ' Each lamp has three settings — off, red, green — and a press moves every lamp it touches one step on (green goes back to off).';
    if (B.target.some((v) => v)) t += ' Make the lamps show the goal pattern.';
    else t += ' ' + capw(numw(onCount)) + (onCount === 1 ? ' lamp is' : ' lamps are') + ' ' + (B.k === 3 ? 'showing a colour' : 'lit') + ': put them all out.';
    return t;
  }

  // a random start: press a random set of lamps, starting from the goal
  function scramble(d, rng, presses) {
    const B = buildModel(Object.assign({}, d, { start: '0'.repeat(buildModel(Object.assign({}, d, { start: '' })).n) }));
    const s = B.target.slice();
    const order = rng.shuffle(Array.from({ length: B.n }, (_, i) => i)).slice(0, Math.min(presses, B.n));
    order.forEach((i) => {
      const c = B.k === 3 ? 1 + rng.int(2) : 1;
      B.press[i].forEach((j) => { s[j] = ((s[j] - c) % B.k + B.k) % B.k; });
    });
    return s.join('');
  }

  const LAMP_KINDS = [
    // [min level, max level, weight, maker(rng) -> { d, info }]
    [1, 3, 3, (rng) => { const n = rng.range(3, 5); return { d: { grid: [n, n] } }; }],
    [2, 5, 3, (rng) => { const n = rng.range(5, 7); return { d: { grid: [n, n] } }; }],
    [1, 4, 2, (rng) => { const k = rng.pick(Object.keys(MASKS)); const M = MASKS[k]; return { d: { grid: M.grid.slice(), mask: M.mask }, info: { name: M.name, short: M.short } }; }],
    [1, 4, 2, (rng) => { const k = rng.pick(Object.keys(GRAPHS).filter((g) => !GRAPHS[g].bad)); return { d: { graph: GRAPHS[k].make() }, info: { name: GRAPHS[k].name, short: GRAPHS[k].short } }; }],
    [2, 4, 1, (rng) => { const n = rng.range(4, 5); return { d: { grid: [n, n], nb: 'x' } }; }],
    [3, 5, 1, (rng) => { const n = rng.range(3, 5); return { d: { grid: [n, n], nb: 'ortho' } }; }],
    [3, 5, 1, (rng) => { const n = rng.range(3, 5); return { d: { grid: [n, n], nb: 'king' } }; }],
    [3, 5, 1, (rng) => { const n = rng.range(4, 6); return { d: { grid: [n, n], nb: 'knight' } }; }],
    [3, 5, 2, (rng) => { const n = rng.range(4, 6); return { d: { grid: [n, n], torus: true } }; }],
    [2, 4, 1, () => ({ d: { grid: [3, 3], nb: 'merlin', target: '111101111' } })],
    [3, 5, 2, (rng) => { const n = rng.range(3, 5); return { d: { grid: [n, n], k: 3 } }; }],
    [3, 5, 1, (rng) => { const n = rng.range(4, 6); const t = []; for (let i = 0; i < n * n; i++) t.push(rng() < 0.4 ? 1 : 0); return { d: { grid: [n, n], target: t.join('') } }; }]
  ];

  function makeLamp(rng, level, pick) {
    const kinds = LAMP_KINDS.filter((k) => level >= k[0] && level <= k[1]);
    const wsum = kinds.reduce((a, k) => a + k[2], 0);
    for (let tries = 0; tries < 60; tries++) {
      let r = rng() * wsum, K = kinds[0];
      for (const k of kinds) { r -= k[2]; if (r <= 0) { K = k; break; } }
      const made = pick ? pick(rng) : K[3](rng);
      const d = made.d;
      const nLamps = buildModel(Object.assign({}, d, { start: '' })).n;
      const presses = Math.max(1, Math.min(nLamps, [0, rng.range(1, 3), rng.range(3, 6), rng.range(5, 9), rng.range(8, 13), rng.range(11, 22)][level]));
      d.start = scramble(d, rng, presses);
      const B = buildModel(d);
      const pl = plan(B, B.start);
      if (!pl || !pl.n || !pl.exact) continue;
      const sc = lampScore(d, B, pl.n);
      if (lampDiff(sc) !== level) continue;
      return { d, info: made.info || null, par: pl.n, score: sc };
    }
    return null;
  }

  function lampTitle(d, info, par) {
    const B = model(d);
    if (d.nb === 'merlin') return 'Merlin’s Square';
    let base;
    if (d.graph) base = info && info.short ? info.short : 'Lamps on a Figure';
    else if (d.mask) base = info && info.short ? info.short : 'Odd Shape';
    else base = d.grid[0] + ' × ' + d.grid[1];
    const extra = d.torus ? ', wrapped' : d.nb && d.nb !== 'plus' ? ', ' + { x: 'diagonal', king: 'king', knight: 'knight', ortho: 'neighbours only' }[d.nb] : '';
    return base + extra + (B.k === 3 ? ', three colours' : '') + ' · ' + par + (par === 1 ? ' press' : ' presses');
  }

  // glasses and coins
  function glassText(d) {
    const G = gModel(d), W = wordsOf(G);
    const m = G.start.filter((v) => v).length;
    const where = G.ring ? (G.look === 'coin' ? 'lie in a ring' : 'stand in a ring') : (G.look === 'coin' ? 'lie in a row' : 'stand in a row');
    let t = capw(numw(G.n)) + ' ' + W.things + ' ' + where + '; ' + (m === G.n ? 'all of them are ' : numw(m) + ' of them ' + (m === 1 ? 'is ' : 'are ')) + W.down + '. ';
    t += 'At every turn you must turn over exactly **' + numw(G.k) + '** of them' + (G.adj ? ' that ' + (G.look === 'coin' ? 'lie' : 'stand') + ' side by side' + (G.ring ? ' (round the ring)' : '') : ' — any ' + numw(G.k) + ' you like') + '. ';
    t += 'Get every one ' + W.up + ' in as few turns as you can — or, if it cannot be done, say so.';
    return t;
  }
  function glassTitle(d) {
    const G = gModel(d), W = wordsOf(G);
    return capw(numw(G.n)) + ' ' + capw(W.things) + ', ' + capw(numw(G.k)) + ' at a Time' + (G.adj ? (G.ring ? ', Round the Ring' : ', Side by Side') : G.ring ? ' (Ring)' : '');
  }
  function glassScore(G, par) { return par + (G.adj ? 1 : 0) + (G.ring ? 1 : 0) + (G.n > 9 ? 1 : 0); }
  function glassDiff(sc) { return sc <= 2 ? 1 : sc <= 4 ? 2 : sc <= 6 ? 3 : sc <= 8 ? 4 : 5; }
  function glassImpDiff(G, why) { return why === 'colours' ? (G.n <= 7 ? 3 : 4) : why === 'all' ? 2 : G.n <= 5 ? 1 : 2; }

  function makeGlasses(rng, level) {
    for (let tries = 0; tries < 300; tries++) {
      const coin = rng() < 0.4;
      const adj = level >= 2 && rng() < 0.45;
      const ring = (adj && rng() < 0.4) || (!adj && rng() < 0.12);
      const n = rng.range(3, [0, 6, 8, 10, 12, 14][level]);
      if (adj && n > 16) continue;
      const k = adj ? rng.range(2, Math.min(4, n - 1)) : rng.range(2, n - 1);
      let st = '';
      for (let i = 0; i < n; i++) st += rng() < 0.45 ? '1' : '0';
      if (!/1/.test(st)) continue;
      const d = { mode: 'glasses', look: coin ? 'coin' : 'glass', n, turn: k, start: st };
      if (adj) d.adj = true;
      if (ring) d.ring = true;
      const G = gModel(d);
      const path = gSolve(G, G.start);
      if (!path) {
        const R = gReasons(G);
        const why = R.parity ? 'parity' : R.all ? 'all' : R.colours ? 'colours' : null;
        if (!why || glassImpDiff(G, why) !== level || rng() < 0.35) continue;
        d.impossible = true;
        d.why = why;
        return { d, par: null };
      }
      if (!path.length || glassDiff(glassScore(G, path.length)) !== level) continue;
      return { d, par: path.length };
    }
    return null;
  }

  C.lightsSolver = { model, plan, applyPress, gauss, gModel, gSolve, gReasons, gWhyText, blocksOf, NB_WORDS, goalText, lampExplain, lampWhere, wordsOf,
    MASKS, GRAPHS, LAMP_KINDS, lampScore, lampDiff, lampText, lampTitle, scramble, makeLamp, glassText, glassTitle, glassScore, glassDiff, glassImpDiff, makeGlasses };

  /* =====================================================================
   * Lamps on the table
   * ===================================================================== */

  function mountLamps(ctx, p) {
    const d = p.data, wb = ctx.wb, B = model(d), K = B.k;
    const graph = B.kind === 'graph';
    const hasTarget = B.target.some((v) => v);
    let s = B.start.slice();
    let busy = false, timer = null, downI = -1, cursor = -1, lastHint = null;
    let marks = [];
    const pid = (wb.id || 'wb') + '-lo';
    if (!p.goal) ctx.setGoal(goalText(d, B));

    const layer = wb.layer('board'), top = wb.layer('top');
    const g0 = ctx.s('g', { class: 'lo-board lo-k' + K + (graph ? ' lo-graph' : '') }, layer);
    const defs = ctx.s('defs', null, g0);
    defs.innerHTML = '<filter id="' + pid + '-blur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="' + (U * 0.11) + '"/></filter>';

    const xs = B.pos.map((q) => q[0]), ys = B.pos.map((q) => q[1]);
    const bx0 = Math.min.apply(null, xs), bx1 = Math.max.apply(null, xs);
    const by0 = Math.min.apply(null, ys), by1 = Math.max.apply(null, ys);
    const R = U * 0.5, pad = U * 0.3;
    const cx0 = bx0 - R - pad, cy0 = by0 - R - pad, cx1 = bx1 + R + pad, cy1 = by1 + R + pad;
    ctx.s('rect', { x: cx0, y: cy0, width: cx1 - cx0, height: cy1 - cy0, rx: U * 0.28, class: 'lo-case' }, g0);
    ctx.s('rect', { x: cx0 + U * 0.08, y: cy0 + U * 0.08, width: cx1 - cx0 - U * 0.16, height: cy1 - cy0 - U * 0.16, rx: U * 0.22, class: 'lo-case-in' }, g0);
    if (d.torus) {
      const mx = (cx0 + cx1) / 2, my = (cy0 + cy1) / 2;
      [[cx0 - U * 0.02, my, '⇆'], [cx1 + U * 0.02, my, '⇆'], [mx, cy0 - U * 0.02, '⇅'], [mx, cy1 + U * 0.1, '⇅']].forEach((t) => {
        ctx.s('text', { x: t[0], y: t[1], class: 'lo-wrap', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: t[2] }, g0);
      });
    }
    if (graph) {
      B.edges.forEach((e) => {
        const a = B.pos[e[0]], b = B.pos[e[1]];
        ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'lo-wire', 'data-e': e[0] + '-' + e[1] }, g0);
      });
    }
    const cells = B.pos.map((q, i) => {
      const g = ctx.s('g', { class: 'lo-cell s' + s[i], 'data-i': i, transform: 'translate(' + q[0] + ' ' + q[1] + ')' }, g0);
      let lamp;
      if (graph) {
        ctx.s('circle', { r: U * 0.46, class: 'lo-tile', 'data-key': 'lamp' + i }, g);
        ctx.s('circle', { r: U * 0.36, class: 'lo-glow', filter: 'url(#' + pid + '-blur)' }, g);
        lamp = ctx.s('circle', { r: U * 0.31, class: 'lo-lamp' }, g);
        ctx.s('ellipse', { cx: -U * 0.1, cy: -U * 0.13, rx: U * 0.12, ry: U * 0.065, class: 'lo-shine' }, g);
      } else {
        ctx.s('rect', { x: -U * 0.47, y: -U * 0.47, width: U * 0.94, height: U * 0.94, rx: U * 0.14, class: 'lo-tile', 'data-key': 'lamp' + i }, g);
        ctx.s('rect', { x: -U * 0.37, y: -U * 0.37, width: U * 0.74, height: U * 0.74, rx: U * 0.22, class: 'lo-glow', filter: 'url(#' + pid + '-blur)' }, g);
        lamp = ctx.s('rect', { x: -U * 0.35, y: -U * 0.35, width: U * 0.7, height: U * 0.7, rx: U * 0.12, class: 'lo-lamp' }, g);
        ctx.s('rect', { x: -U * 0.27, y: -U * 0.28, width: U * 0.3, height: U * 0.09, rx: U * 0.045, class: 'lo-shine' }, g);
      }
      if (hasTarget) ctx.s('circle', { cx: U * 0.3, cy: -U * 0.3, r: U * 0.075, class: 'lo-pip t' + B.target[i] }, g);
      g.addEventListener('pointerenter', () => preview(i));
      g.addEventListener('pointerleave', () => preview(-1));
      return { g, lamp };
    });

    // the goal as a small picture beside the board
    let bx = cx1;
    if (hasTarget) {
      const f = 0.3, ox = cx1 + U * 0.7, oy = cy0 + U * 0.55;
      const mg = ctx.s('g', { class: 'lo-mini' }, g0);
      const w = (bx1 - bx0) * f + U * 0.5, h = (by1 - by0) * f + U * 0.5;
      ctx.s('rect', { x: ox - U * 0.25, y: oy - U * 0.25, width: w, height: h, rx: U * 0.1, class: 'lo-mini-bg' }, mg);
      ctx.s('text', { x: ox - U * 0.25 + w / 2, y: oy - U * 0.4, class: 'lo-mini-t', 'text-anchor': 'middle', text: 'goal' }, mg);
      if (graph) B.edges.forEach((e) => {
        const a = B.pos[e[0]], b = B.pos[e[1]];
        ctx.s('line', { x1: ox + (a[0] - bx0) * f, y1: oy + (a[1] - by0) * f, x2: ox + (b[0] - bx0) * f, y2: oy + (b[1] - by0) * f, class: 'lo-mini-wire' }, mg);
      });
      B.pos.forEach((q, i) => {
        const x = ox + (q[0] - bx0) * f, y = oy + (q[1] - by0) * f;
        if (graph) ctx.s('circle', { cx: x, cy: y, r: U * 0.12, class: 'lo-mini-l t' + B.target[i] }, mg);
        else ctx.s('rect', { x: x - U * 0.13, y: y - U * 0.13, width: U * 0.26, height: U * 0.26, rx: U * 0.05, class: 'lo-mini-l t' + B.target[i] }, mg);
      });
      bx = ox - U * 0.25 + w;
    }
    const cur = ctx.s('rect', { class: 'lo-cursor', width: U * 1.02, height: U * 1.02, rx: U * 0.18, x: -9999, y: -9999 }, top);
    wb.setBounds({ x0: cx0 - U * 0.25, y0: cy0 - U * (hasTarget ? 0.45 : 0.25), x1: bx + U * 0.25, y1: cy1 + U * 0.25 }, 0.06);

    function wrongCount() { let n = 0; for (let j = 0; j < B.n; j++) if (s[j] !== B.target[j]) n++; return n; }
    const statLabel = hasTarget || K === 3 ? 'Wrong' : 'Lit';
    function draw() {
      cells.forEach((c, i) => {
        c.g.classList.remove('s0', 's1', 's2');
        c.g.classList.add('s' + s[i]);
        if (hasTarget) c.g.classList.toggle('ok', s[i] === B.target[i]);
      });
      if (graph) {
        g0.querySelectorAll('.lo-wire').forEach((el) => {
          const e = el.getAttribute('data-e').split('-').map(Number);
          el.classList.toggle('lit', s[e[0]] > 0 && s[e[1]] > 0);
        });
      }
      ctx.stat(statLabel, wrongCount());
    }
    function preview(i) {
      cells.forEach((c) => { c.g.classList.remove('prev', 'hov'); });
      if (i < 0 || busy) return;
      B.press[i].forEach((j) => cells[j].g.classList.add('prev'));
      cells[i].g.classList.add('hov');
    }
    function pulse(i) {
      const q = B.pos[i];
      const rp = ctx.s('circle', { cx: q[0], cy: q[1], r: U * 0.46, class: 'lo-ripple' }, top);
      setTimeout(() => rp.remove(), 650);
      const L = cells[i].lamp;
      L.classList.remove('hit');
      L.getBoundingClientRect();
      L.classList.add('hit');
      B.press[i].forEach((j) => {
        if (j === i) return;
        const el = cells[j].lamp;
        el.classList.remove('ping');
        el.getBoundingClientRect();
        el.classList.add('ping');
      });
    }
    function clearMarks() { marks.forEach((m) => m.remove()); marks = []; }
    function mark(list, x) {
      clearMarks();
      list.forEach((i) => {
        const q = B.pos[i];
        marks.push(graph
          ? ctx.s('circle', { cx: q[0], cy: q[1], r: U * 0.53, class: 'lo-mark' }, top)
          : ctx.s('rect', { x: q[0] - U * 0.52, y: q[1] - U * 0.52, width: U * 1.04, height: U * 1.04, rx: U * 0.18, class: 'lo-mark' }, top));
        if (x && x[i] === 2) marks.push(ctx.s('text', { x: q[0] + U * 0.28, y: q[1] + U * 0.44, class: 'lo-mark-n', 'text-anchor': 'middle', text: '×2' }, top));
      });
    }
    function press(i, silent) {
      applyPress(B, s, i);
      draw();
      clearMarks();
      pulse(i);
      ctx.sfx('tap');
      if (!silent) {
        ctx.move();
        ctx.changed('press');
        const left = wrongCount();
        ctx.say(left ? (hasTarget || K === 3 ? C.plural(left, 'lamp') + ' still wrong.' : C.plural(left, 'lamp') + ' still lit.') : '');
      }
    }
    function lampAt(pt) {
      let best = -1, bd = Infinity;
      B.pos.forEach((q, i) => { const dd = Math.hypot(pt[0] - q[0], pt[1] - q[1]); if (dd < bd) { bd = dd; best = i; } });
      if (best < 0) return -1;
      const q = B.pos[best];
      if (graph) return bd <= U * 0.52 ? best : -1;
      return Math.abs(pt[0] - q[0]) <= U * 0.5 && Math.abs(pt[1] - q[1]) <= U * 0.5 ? best : -1;
    }
    function showCursor() {
      if (cursor < 0) { cur.setAttribute('x', -9999); return; }
      const q = B.pos[cursor];
      cur.setAttribute('x', q[0] - U * 0.51);
      cur.setAttribute('y', q[1] - U * 0.51);
      if (graph) { cur.setAttribute('rx', U * 0.51); }
    }
    function moveCursor(dir) {
      if (cursor < 0) { cursor = 0; showCursor(); return; }
      const c = B.pos[cursor];
      let best = -1, bs = Infinity;
      B.pos.forEach((q, j) => {
        if (j === cursor) return;
        const dx = q[0] - c[0], dy = q[1] - c[1];
        const along = dx * dir[0] + dy * dir[1];
        if (along < U * 0.3) return;
        const across = Math.abs(dx * dir[1] - dy * dir[0]);
        const sc = along + across * 2;
        if (sc < bs) { bs = sc; best = j; }
      });
      if (best >= 0) cursor = best;
      showCursor();
      preview(cursor);
    }

    wb.handlers.board = {
      down(pt) {
        if (busy) return false;
        const i = lampAt(pt);
        if (i < 0) return false;
        downI = i;
        cells[i].g.classList.add('down');
        return true;
      },
      up(pt) {
        const i = downI;
        downI = -1;
        if (i < 0) return;
        cells[i].g.classList.remove('down');
        if (!busy && lampAt(pt) === i) press(i);
      }
    };

    ctx.stat('Moves', 0);
    draw();

    const doneMsg = d.nb === 'merlin' && d.target === '111101111' ? 'The magic square is lit.' : hasTarget ? 'The pattern is made.' : K === 3 ? 'Every lamp is dark again.' : 'Lights out!';
    return {
      check() {
        const left = wrongCount();
        if (!left) return { solved: true, msg: doneMsg };
        return { solved: false, msg: hasTarget || K === 3 ? C.plural(left, 'lamp') + ' still wrong.' : C.plural(left, 'lamp') + ' still lit.' };
      },
      hint() {
        const pl = plan(B, s);
        if (!pl) return 'This pattern cannot be solved from here — press Reset.';
        if (!pl.n) return 'Every lamp is already right!';
        const key = s.join('');
        const whole = lastHint === key;
        lastHint = key;
        const idx = [];
        pl.x.forEach((v, i) => { if (v) idx.push(i); });
        if (!whole) {
          const i = idx[0];
          return {
            text: 'Press the lamp in the gold frame (' + lampWhere(B, i) + ')' + (pl.x[i] === 2 ? ' — it needs two presses in all' : '') + '. From here the shortest way takes ' + C.plural(pl.n, 'press', 'presses') + '. (Ask again without pressing to see the whole plan.)',
            show() { mark([i]); }
          };
        }
        return {
          text: 'The whole plan: press each framed lamp once' + (pl.x.some((v) => v === 2) ? ' (the ones marked ×2 twice)' : '') + ', in any order — the order of presses never matters.',
          show() { mark(idx, pl.x); }
        };
      },
      solve() {
        const pl = plan(B, s);
        if (!pl) return;
        const seq = [];
        pl.x.forEach((v, i) => { for (let t = 0; t < v; t++) seq.push(i); });
        busy = true;
        clearMarks();
        let k = 0;
        const step = () => {
          if (k >= seq.length) { busy = false; ctx.changed('solve'); return; }
          press(seq[k++], true);
          ctx.move();
          timer = setTimeout(step, C.anim(360));
        };
        step();
      },
      explain() { return lampExplain(d, B); },
      getState() { return { s: s.join('') }; },
      setState(st) {
        if (!st || st.s == null) return;
        clearTimeout(timer);
        busy = false;
        const a = digits(st.s, B.n);
        if (a) s = a;
        clearMarks();
        draw();
      },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return k === ' ' && cursor >= 0;
        const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        if (dirs[k]) { if (wb.selected().length) return false; moveCursor(dirs[k]); return true; }
        if ((k === ' ' || k === 'Enter') && cursor >= 0) { if (!busy) press(cursor); return true; }
        return false;
      },
      destroy() { clearTimeout(timer); wb.handlers.board = null; }
    };
  }

  /* =====================================================================
   * Glasses (and coins) on the table
   * ===================================================================== */

  const GLASS = 'M' + (-0.3 * U) + ' ' + (-0.46 * U) + 'L' + (0.3 * U) + ' ' + (-0.46 * U) + 'L' + (0.23 * U) + ' ' + (0.4 * U) +
    'Q' + (0.22 * U) + ' ' + (0.45 * U) + ' ' + (0.17 * U) + ' ' + (0.45 * U) + 'L' + (-0.17 * U) + ' ' + (0.45 * U) +
    'Q' + (-0.22 * U) + ' ' + (0.45 * U) + ' ' + (-0.23 * U) + ' ' + (0.4 * U) + 'Z';
  const GLASS_BASE = 'M' + (-0.2 * U) + ' ' + (0.35 * U) + 'L' + (0.2 * U) + ' ' + (0.35 * U) + 'L' + (0.19 * U) + ' ' + (0.44 * U) + 'L' + (-0.19 * U) + ' ' + (0.44 * U) + 'Z';

  function glassLayout(G) {
    const P = 1.25 * U;
    if (G.ring) {
      const R = Math.max(1.75 * U, (G.n * P) / (2 * Math.PI));
      const pos = [];
      for (let i = 0; i < G.n; i++) { const a = -Math.PI / 2 + (2 * Math.PI * i) / G.n; pos.push([Math.cos(a) * R, Math.sin(a) * R]); }
      return { pos, R, btn: [0, 0], box: { x0: -R - 0.8 * U, y0: -R - 0.8 * U, x1: R + 0.8 * U, y1: R + 0.95 * U } };
    }
    const pos = [];
    for (let i = 0; i < G.n; i++) pos.push([i * P, 0]);
    const w = (G.n - 1) * P;
    return { pos, btn: [w / 2, 1.35 * U], box: { x0: -0.75 * U, y0: -0.85 * U, x1: w + 0.75 * U, y1: 1.75 * U } };
  }

  function mountGlasses(ctx, p) {
    const d = p.data, wb = ctx.wb, G = gModel(d), W = wordsOf(G);
    const n = G.n, k = G.k, coin = G.look === 'coin';
    const L = glassLayout(G);
    const best = d.impossible ? null : (gSolve(G, G.start) || []).length;
    let s = G.start.slice(), sel = [], busy = false, timer = null, raf = 0, declared = false, auto = true;
    let marks = [], hoverBlock = [];
    const mixedTarget = G.target.some((v) => v) && G.target.some((v) => !v);
    const allDown = G.target.every((v) => v);

    const goal = allDown ? 'Turn every ' + W.thing + ' ' + W.down + '.' : mixedTarget ? 'Make every ' + W.thing + ' match the small mark beneath it.' : 'Every ' + W.thing + ' ' + W.up + '.';
    if (!p.goal) ctx.setGoal(goal + ' Each turn turns over exactly **' + k + '**' + (G.adj ? ' standing side by side' : '') + ' — or show that it cannot be done.');

    const layer = wb.layer('board'), top = wb.layer('top');
    const g0 = ctx.s('g', { class: 'gl-board' + (coin ? ' gl-coins' : '') }, layer);
    if (G.ring) ctx.s('circle', { cx: 0, cy: 0, r: L.R + 0.72 * U, class: 'gl-table' }, g0);
    else ctx.s('rect', { x: L.box.x0 + 0.1 * U, y: 0.5 * U, width: L.box.x1 - L.box.x0 - 0.2 * U, height: 0.14 * U, rx: 0.06 * U, class: 'gl-shelf' }, g0);

    const items = L.pos.map((q, i) => {
      const g = ctx.s('g', { class: 'gl-item', 'data-i': i, transform: 'translate(' + q[0] + ' ' + q[1] + ')' }, g0);
      ctx.s('ellipse', { cx: 0, cy: (coin ? 0.44 : 0.49) * U, rx: (coin ? 0.3 : 0.32) * U, ry: 0.06 * U, class: 'gl-shadow' }, g);
      const lift = ctx.s('g', { class: 'gl-lift' }, g);
      const flip = ctx.s('g', { class: 'gl-flip' }, lift);
      if (coin) {
        ctx.s('circle', { r: 0.4 * U, class: 'gl-coin', 'data-key': 'g' + i }, flip);
        ctx.s('circle', { r: 0.32 * U, class: 'gl-coin-in' }, flip);
        ctx.s('text', { x: 0, y: 0.02 * U, class: 'gl-face gl-h', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: 'H' }, flip);
        ctx.s('text', { x: 0, y: 0.02 * U, class: 'gl-face gl-t', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: 'T' }, flip);
      } else {
        ctx.s('path', { d: GLASS, class: 'gl-glass', 'data-key': 'g' + i }, flip);
        ctx.s('path', { d: GLASS_BASE, class: 'gl-base' }, flip);
        ctx.s('ellipse', { cx: 0, cy: -0.46 * U, rx: 0.3 * U, ry: 0.06 * U, class: 'gl-rim' }, flip);
        ctx.s('path', { d: 'M' + (-0.19 * U) + ' ' + (-0.34 * U) + 'L' + (-0.13 * U) + ' ' + (0.28 * U), class: 'gl-shine' }, flip);
      }
      if (mixedTarget) ctx.s('text', { x: 0, y: 0.78 * U, class: 'gl-want', 'text-anchor': 'middle', text: G.target[i] ? '▼' : '▲' }, g);
      ctx.s('text', { x: 0, y: (G.ring ? -0.62 : 0.93) * U, class: 'gl-num', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(i + 1) }, g);
      g.addEventListener('pointerenter', () => hoverAt(i));
      g.addEventListener('pointerleave', () => hoverAt(-1));
      return { g, flip };
    });

    // the Turn button (for choosing k glasses one by one)
    const btn = ctx.s('g', { class: 'gl-btn' + (G.adj ? ' gone' : '') }, g0);
    const bw = 2.3 * U, bh = 0.46 * U;
    ctx.s('rect', { x: L.btn[0] - bw / 2, y: L.btn[1] - bh / 2, width: bw, height: bh, rx: 0.14 * U }, btn);
    const btnT = ctx.s('text', { x: L.btn[0], y: L.btn[1], 'text-anchor': 'middle', 'dominant-baseline': 'central' }, btn);
    btn.addEventListener('pointerdown', (e) => { e.stopPropagation(); if (wb.mode === 'select') doTurn(); });
    if (G.adj) ctx.s('text', { x: L.btn[0], y: G.ring ? L.R + 0.95 * U : L.btn[1], class: 'gl-tip', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: 'A tap turns ' + k + ' side by side' + (k > 1 ? ', centred where you tap' : '') }, g0);
    if (G.adj && G.ring) L.box.y1 += 0.35 * U;
    wb.setBounds(L.box, 0.06);

    if (!G.adj) {
      const box = C.h('label.gl-auto', C.h('input', { type: 'checkbox', checked: true, onchange: (e) => { auto = e.target.checked; } }), ' Turn over as soon as ' + k + ' are chosen');
      ctx.panel.appendChild(box);
    }
    const answer = ctx.answer({
      kind: 'choice',
      label: 'Or, if you are sure it cannot be done:',
      choices: ['It cannot be done'],
      check() {
        if (d.impossible) { declared = true; return { ok: true, msg: '**Right — it cannot be done.** ' + gWhyText(G, d.why) }; }
        return { ok: false, msg: 'Oh, but it can — in ' + C.plural(best, 'turn') + ' at best. Keep going!' };
      }
    });

    function blockAt(i) {
      const b = [];
      let s0 = i - Math.floor((k - 1) / 2);
      if (!G.ring) s0 = Math.max(0, Math.min(n - k, s0));
      for (let t = 0; t < k; t++) b.push(((s0 + t) % n + n) % n);
      return b;
    }
    function hoverAt(i) {
      hoverBlock = i >= 0 && G.adj && !busy ? blockAt(i) : [];
      draw();
    }
    function wrongCount() { let m = 0; for (let i = 0; i < n; i++) if (s[i] !== G.target[i]) m++; return m; }
    function staticFlip(i) {
      if (coin) items[i].flip.setAttribute('transform', 'scale(1 1)');
      else items[i].flip.setAttribute('transform', s[i] ? 'scale(1 -1)' : 'scale(1 1)');
    }
    function draw() {
      items.forEach((it, i) => {
        it.g.classList.toggle('dn', s[i] === 1);
        it.g.classList.toggle('bad', s[i] !== G.target[i]);
        it.g.classList.toggle('sel', sel.includes(i));
        it.g.classList.toggle('prev', hoverBlock.includes(i));
        if (!busy) staticFlip(i);
      });
      btn.classList.toggle('ready', sel.length === k);
      btnT.textContent = sel.length === k ? 'Turn them over (T)' : 'Chosen ' + sel.length + ' of ' + k;
      ctx.stat(G.target.some((v) => v) ? 'Wrong' : W.down.charAt(0).toUpperCase() + W.down.slice(1), wrongCount());
    }
    function clearMarks() { marks.forEach((m) => m.remove()); marks = []; }
    function mark(list) {
      clearMarks();
      list.forEach((i) => {
        const q = L.pos[i];
        marks.push(ctx.s('circle', { cx: q[0], cy: q[1], r: 0.6 * U, class: 'gl-mark' }, top));
      });
    }
    function turn(list, silent, done) {
      busy = true;
      clearMarks();
      hoverBlock = [];
      const from = list.map((i) => s[i]);
      const t0 = performance.now(), ms = C.anim(430);
      ctx.sfx('tap');
      const step = (now) => {
        const t = Math.min(1, (now - t0) / ms), c = Math.cos(Math.PI * t), up = Math.sin(Math.PI * t);
        list.forEach((i, a) => {
          const it = items[i];
          if (coin) {
            it.flip.setAttribute('transform', 'translate(0 ' + (-up * 0.4 * U) + ') scale(' + Math.max(0.03, Math.abs(c)) + ' 1)');
            it.g.classList.toggle('dn', t < 0.5 ? from[a] === 1 : from[a] === 0);
          } else {
            let sy = (from[a] ? -1 : 1) * c;
            if (Math.abs(sy) < 0.03) sy = sy < 0 ? -0.03 : 0.03;
            it.flip.setAttribute('transform', 'translate(0 ' + (-up * 0.35 * U) + ') scale(1 ' + sy + ')');
            it.g.classList.toggle('dn', sy < 0);
          }
        });
        if (t < 1) { raf = requestAnimationFrame(step); return; }
        list.forEach((i) => { s[i] ^= 1; });
        busy = false;
        draw();
        if (!silent) {
          ctx.move();
          ctx.changed('turn');
          const m = wrongCount();
          ctx.say(m ? C.plural(m, W.thing, W.things) + ' still ' + (G.target.some((v) => v) ? 'wrong' : W.down) + '.' : '');
        }
        if (done) done();
      };
      raf = requestAnimationFrame(step);
    }
    function doTurn() {
      clearTimeout(timer);
      if (busy || G.adj) return;
      if (sel.length !== k) { ctx.say('Choose exactly ' + k + ' ' + W.things + ' first (' + sel.length + ' chosen).', 'warn'); return; }
      const list = sel.slice();
      sel = [];
      turn(list);
    }
    function tap(i) {
      if (busy) return;
      if (G.adj) { turn(blockAt(i)); return; }
      const at = sel.indexOf(i);
      if (at >= 0) sel.splice(at, 1);
      else if (sel.length < k) sel.push(i);
      else { ctx.say('You have chosen ' + k + ' already — tap one again to put it back.', 'warn'); return; }
      ctx.sfx('tap');
      draw();
      clearTimeout(timer);
      if (sel.length === k && auto) timer = setTimeout(doTurn, C.anim(280));
      else ctx.say(sel.length ? 'Chosen ' + sel.length + ' of ' + k + '.' : '');
    }
    function itemAt(pt) {
      let bi = -1, bd = Infinity;
      L.pos.forEach((q, i) => { const dd = Math.hypot(pt[0] - q[0], (pt[1] - q[1]) * 0.8); if (dd < bd) { bd = dd; bi = i; } });
      return bd <= 0.55 * U ? bi : -1;
    }
    let downI = -1;
    wb.handlers.board = {
      down(pt) { const i = itemAt(pt); if (i < 0 || busy) return false; downI = i; return true; },
      up(pt) { const i = downI; downI = -1; if (i >= 0 && itemAt(pt) === i) tap(i); }
    };

    ctx.stat('Moves', 0);
    draw();

    const hintsFor = () => {
      const R = d.why;
      if (R === 'all') return ['Try the same turn twice. Then count how many different positions you can ever make.', 'Every turn turns over all ' + n + ' — so the position just flips between this and its opposite.'];
      if (R === 'colours') return ['Number the ' + W.things + ' and colour them in ' + k + ' colours in turn: 1, 2, …, ' + k + ', 1, 2, …', 'Any ' + k + ' side by side include one ' + W.thing + ' of each colour. Watch what one turn does to the number of wrong ones of each colour.'];
      return ['Count the ' + W.things + ' that are ' + W.down + '. Now make a turn and count again. What can never change?', 'Think odd and even: each ' + W.thing + ' turned changes the count by one, and you always turn ' + k + '.'];
    };

    return {
      check() {
        if (declared) return { solved: true, msg: 'It cannot be done — and you knew why.' };
        const m = wrongCount();
        if (!m) return { solved: true, msg: 'All ' + W.up + '.' };
        return { solved: false, msg: C.plural(m, W.thing, W.things) + ' still ' + (G.target.some((v) => v) ? 'wrong' : W.down) + '. (If you think it is impossible, say so in the panel.)' };
      },
      hint(h) {
        if (d.impossible) {
          const hs = hintsFor();
          if (h < hs.length) return hs[h];
          return 'It really cannot be done. Say so in the panel: “It cannot be done”.';
        }
        const path = gSolve(G, s);
        if (!path) return 'Hmm — from here it cannot be done. Reset and try again.';
        if (!path.length) return 'Everything is already the right way up!';
        const mv = path[0];
        return {
          text: 'Turn over ' + (mv.length === 1 ? W.thing : W.things) + ' ' + listNums(mv) + ' (ringed). From here it takes ' + C.plural(path.length, 'turn') + '.',
          show() { sel = []; draw(); mark(mv); }
        };
      },
      solve() {
        if (d.impossible) {
          declared = true;
          answer.feedback(C.md('**It cannot be done.** ' + gWhyText(G, d.why)), 'good');
          ctx.changed('solve');
          return;
        }
        const path = gSolve(G, s) || [];
        sel = [];
        let i = 0;
        const next = () => {
          if (i >= path.length) { ctx.changed('solve'); return; }
          const mv = path[i++];
          mark(mv);
          timer = setTimeout(() => turn(mv, true, () => { ctx.move(); timer = setTimeout(next, C.anim(220)); }), C.anim(260));
        };
        next();
      },
      explain() {
        if (d.impossible) return gWhyText(G, d.why);
        const path = gSolve(G, G.start) || [];
        let t = 'The fewest turns is **' + path.length + '**: ' + path.map((mv, i) => (i + 1) + '. ' + listNums(mv)).join('; ') + '.';
        t += '\n\nOnly *which* ' + W.things + ' end up turned an odd number of times matters, not the order — and ';
        t += G.adj ? 'with neighbours only, the turns are like the presses in Lights Out: a set, not a sequence.' : 'since any ' + k + ' may be chosen, only the *number* of wrong ones matters: each turn puts right some of them and puts wrong the rest of the ' + k + '.';
        return t;
      },
      getState() { return { s: s.join(''), dc: declared ? 1 : 0 }; },
      setState(st) {
        if (!st || st.s == null) return;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        busy = false;
        const a = digits(st.s, n);
        if (a) s = a;
        declared = !!st.dc;
        sel = [];
        hoverBlock = [];
        clearMarks();
        draw();
      },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        const kk = ev.key;
        if (/^[0-9]$/.test(kk)) {
          const i = kk === '0' ? 9 : +kk - 1;
          if (i < n) { tap(i); return true; }
          return false;
        }
        if ((kk === 't' || kk === 'T') && !G.adj) { doTurn(); return true; }
        if (kk === 'Enter' && sel.length === k && !G.adj) { doTurn(); return true; }
        if (kk === 'Escape' && sel.length) { sel = []; draw(); return true; }
        return false;
      },
      destroy() { clearTimeout(timer); cancelAnimationFrame(raf); wb.handlers.board = null; }
    };
  }

  function listNums(list) {
    const a = list.map((i) => String(i + 1));
    if (a.length === 1) return a[0];
    return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  }

  /* =====================================================================
   * the engine
   * ===================================================================== */

  function verifyLamps(p) {
    const d = p.data;
    if (!d.graph && !(d.grid && d.grid.length === 2 && d.grid[0] >= 1 && d.grid[1] >= 1)) return { ok: false, err: 'a grid [w, h] or a graph is needed' };
    if (d.k != null && d.k !== 2 && d.k !== 3) return { ok: false, err: 'k must be 2 or 3' };
    if (d.nb === 'merlin' && (!d.grid || d.grid[0] !== 3 || d.grid[1] !== 3 || d.mask || d.torus)) return { ok: false, err: 'Merlin needs a plain 3 × 3 grid' };
    if (d.nb && !NB[d.nb] && d.nb !== 'merlin') return { ok: false, err: 'unknown neighbourhood ' + d.nb };
    if (d.graph && d.graph.edges.some((e) => !(e[0] >= 0 && e[0] < d.graph.pts.length && e[1] >= 0 && e[1] < d.graph.pts.length && e[0] !== e[1]))) return { ok: false, err: 'bad edge' };
    if (d.mask && d.mask.split('/').length !== d.grid[1]) return { ok: false, err: 'the mask needs one row per grid row' };
    const B = model(d);
    if (!B.n) return { ok: false, err: 'no lamps' };
    if (!B.start) return { ok: false, err: 'start needs one digit per lamp (' + B.n + ')' };
    if (!B.target) return { ok: false, err: 'target needs one digit per lamp (' + B.n + ')' };
    if (B.start.concat(B.target).some((v) => !(v >= 0 && v < B.k))) return { ok: false, err: 'a lamp state is out of range' };
    const pl = plan(B, B.start);
    if (!pl) return { ok: false, err: 'this pattern cannot be solved' };
    if (!pl.n) return { ok: false, err: 'already solved at the start' };
    if (p.par != null && p.par !== pl.n) return { ok: false, err: 'par is ' + p.par + ' but the fewest presses is ' + pl.n };
    return { ok: true, par: pl.n, warn: pl.exact ? undefined : 'the par is not proven to be the least' };
  }

  function verifyGlasses(p) {
    const d = p.data;
    const G = gModel(d);
    if (!(G.n >= 2 && G.n <= 20)) return { ok: false, err: 'n must be 2..20' };
    if (!G.start || !G.target) return { ok: false, err: 'start/target need one digit per glass' };
    if (G.start.concat(G.target).some((v) => v !== 0 && v !== 1)) return { ok: false, err: 'states are 0 or 1' };
    if (!(G.k >= 1 && G.k <= G.n)) return { ok: false, err: 'turn must be 1..n' };
    if (G.adj && G.n > 16) return { ok: false, err: 'at most 16 glasses when they must stand side by side' };
    const path = gSolve(G, G.start);
    if (d.impossible) {
      if (path) return { ok: false, err: 'marked impossible, but it can be done in ' + path.length };
      const R = gReasons(G);
      if (!d.why || !R[d.why]) return { ok: false, err: 'the reason given (why: ' + d.why + ') does not hold here' };
      if (p.par != null) return { ok: false, err: 'an impossible puzzle has no par' };
      return { ok: true };
    }
    if (!path) return { ok: false, err: 'cannot be done — mark it impossible, with a reason' };
    if (!path.length) return { ok: false, err: 'already solved at the start' };
    if (p.par != null && p.par !== path.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest turns is ' + path.length };
    return { ok: true, par: path.length };
  }

  C.engine({
    id: 'lights',
    name: 'Lamps and glasses',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: '**Lamps.** Click a lamp to press it: it switches itself and its neighbours — which neighbours depends on the puzzle (hover over a lamp to see the ones it will switch). Two presses of the same lamp cancel out, and the order of presses never matters. With three-colour lamps each press moves a lamp one step: off → red → green → off. Keys: the arrow keys move a frame over the lamps, Space presses.\n\n' +
      '**Glasses and coins.** Tap the glasses you want to turn over; when you have chosen exactly as many as the puzzle allows they turn together (or press **T**; number keys choose glasses too). Where they must stand side by side, one tap turns a whole group. Some of these cannot be done at all — if you can see why, say so with the button in the panel.',

    answerKey(p) { return p.data && p.data.mode === 'glasses' && p.data.impossible ? 0 : null; },

    // Endless: a new puzzle of the asked level. Lamps are graded by the fewest
    // presses plus a bonus for trickier rules; glasses by the fewest turns.
    generate(rng, level, fam) {
      if (fam && fam.id === 'glasses') {
        const g = makeGlasses(rng, level);
        if (!g) return null;
        const p = { title: glassTitle(g.d), text: glassText(g.d), diff: level, data: g.d };
        if (g.par != null) p.par = g.par;
        return p;
      }
      const r = makeLamp(rng, level);
      if (!r) return null;
      return { title: lampTitle(r.d, r.info, r.par), text: lampText(r.d, r.info), par: r.par, diff: level, data: r.d };
    },

    verify(p) {
      const d = p.data;
      if (!d) return { ok: false, err: 'no data' };
      return d.mode === 'glasses' ? verifyGlasses(p) : verifyLamps(p);
    },

    mount(ctx, p) {
      return p.data.mode === 'glasses' ? mountGlasses(ctx, p) : mountLamps(ctx, p);
    },

    thumb(p) {
      return p.data.mode === 'glasses' ? glassThumb(p) : lampThumb(p);
    }
  });

  const THUMB_ON = { 2: ['#ffd166'], 3: ['#ff6b6b', '#5ee39a'] };
  function lampThumb(p) {
    const d = p.data, B = model(d);
    const xs = B.pos.map((q) => q[0]), ys = B.pos.map((q) => q[1]);
    const x0 = Math.min.apply(null, xs) - 0.75 * U, x1 = Math.max.apply(null, xs) + 0.75 * U;
    const y0 = Math.min.apply(null, ys) - 0.75 * U, y1 = Math.max.apply(null, ys) + 0.75 * U;
    let s = '<svg viewBox="' + x0 + ' ' + y0 + ' ' + (x1 - x0) + ' ' + (y1 - y0) + '" preserveAspectRatio="xMidYMid meet">';
    s += '<rect x="' + (x0 + 0.1 * U) + '" y="' + (y0 + 0.1 * U) + '" width="' + (x1 - x0 - 0.2 * U) + '" height="' + (y1 - y0 - 0.2 * U) + '" rx="' + 0.3 * U + '" fill="#14182e"/>';
    if (B.kind === 'graph') B.edges.forEach((e) => { const a = B.pos[e[0]], b = B.pos[e[1]]; s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#4a5185" stroke-width="' + 0.08 * U + '"/>'; });
    B.pos.forEach((q, i) => {
      const v = B.start[i];
      const col = v ? THUMB_ON[B.k][v - 1] : '#2b3163';
      if (B.kind === 'graph') {
        if (v) s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + 0.46 * U + '" fill="' + col + '" opacity=".3"/>';
        s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + 0.32 * U + '" fill="' + col + '"/>';
      } else {
        if (v) s += '<rect x="' + (q[0] - 0.46 * U) + '" y="' + (q[1] - 0.46 * U) + '" width="' + 0.92 * U + '" height="' + 0.92 * U + '" rx="' + 0.2 * U + '" fill="' + col + '" opacity=".3"/>';
        s += '<rect x="' + (q[0] - 0.36 * U) + '" y="' + (q[1] - 0.36 * U) + '" width="' + 0.72 * U + '" height="' + 0.72 * U + '" rx="' + 0.12 * U + '" fill="' + col + '"/>';
      }
    });
    return s + '</svg>';
  }

  function glassThumb(p) {
    const G = gModel(p.data), L = glassLayout(G), b = L.box;
    const coin = G.look === 'coin';
    let s = '<svg viewBox="' + b.x0 + ' ' + (b.y0 + (G.ring ? 0 : 0.1 * U)) + ' ' + (b.x1 - b.x0) + ' ' + (b.y1 - b.y0 - (G.ring ? 0 : 0.7 * U)) + '" preserveAspectRatio="xMidYMid meet">';
    L.pos.forEach((q, i) => {
      const dn = G.start[i] === 1;
      if (coin) {
        s += '<g transform="translate(' + q[0] + ' ' + q[1] + ')"><circle r="' + 0.4 * U + '" fill="' + (dn ? '#c98f32' : '#f2c14e') + '" stroke="#8a5a14" stroke-width="' + 0.05 * U + '"/>' +
          '<text y="' + 0.16 * U + '" text-anchor="middle" font-size="' + 0.46 * U + '" font-weight="800" fill="#6b4306">' + (dn ? 'T' : 'H') + '</text></g>';
      } else {
        s += '<g transform="translate(' + q[0] + ' ' + q[1] + ') scale(1 ' + (dn ? -1 : 1) + ')"><path d="' + GLASS + '" fill="' + (dn ? 'rgba(255,176,87,.28)' : 'rgba(170,210,255,.22)') + '" stroke="' + (dn ? 'var(--warn)' : 'var(--ink-2)') + '" stroke-width="' + 0.06 * U + '" stroke-linejoin="round"/>' +
          '<ellipse cy="' + (-0.46 * U) + '" rx="' + 0.3 * U + '" ry="' + 0.06 * U + '" fill="none" stroke="' + (dn ? 'var(--warn)' : 'var(--ink-2)') + '" stroke-width="' + 0.05 * U + '"/></g>';
      }
    });
    return s + '</svg>';
  }

  C.css('lights', `
    .lo-case { fill: #11152a; stroke: rgba(255,255,255,.08); stroke-width: 3; }
    .lo-case-in { fill: #171c36; }
    .lo-wrap { font: 700 34px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .lo-wire { stroke: #3d4478; stroke-width: 7; stroke-linecap: round; transition: stroke .2s; }
    .lo-wire.lit { stroke: #8a7a3c; }
    .lo-k3 .lo-wire.lit { stroke: #5c6aa0; }
    .lo-cell { cursor: pointer; }
    .lo-tile { fill: #1c2143; stroke: rgba(255,255,255,.05); stroke-width: 2; transition: stroke .12s; }
    .lo-lamp { fill: #2a3060; stroke: rgba(0,0,0,.45); stroke-width: 2.5; transition: fill .18s; transform-box: fill-box; transform-origin: center; }
    .lo-glow { opacity: 0; transition: opacity .2s; fill: #ffc53d; pointer-events: none; }
    .lo-shine { fill: #fff; opacity: .07; pointer-events: none; transition: opacity .18s; }
    .lo-cell.s1 .lo-lamp { fill: #ffd76e; stroke: #b88a1c; }
    .lo-cell.s1 .lo-glow { opacity: .95; }
    .lo-cell.s1 .lo-shine, .lo-cell.s2 .lo-shine { opacity: .5; }
    .lo-k3 .lo-cell.s1 .lo-lamp { fill: #ff6b6b; stroke: #a8302f; }
    .lo-k3 .lo-cell.s1 .lo-glow { fill: #ff4747; }
    .lo-cell.s2 .lo-lamp { fill: #5ee39a; stroke: #1f8a52; }
    .lo-cell.s2 .lo-glow { fill: #2fe07e; opacity: .95; }
    .lo-cell.prev .lo-tile { stroke: #8f9bff; stroke-width: 7; }
    .lo-cell.hov .lo-tile { stroke: #d4d9ff; stroke-width: 8; }
    .lo-cell.down .lo-lamp { transform: scale(.9); }
    .lo-lamp.hit { animation: lohit .26s ease-out; }
    .lo-lamp.ping { animation: loping .3s ease-out; }
    @keyframes lohit { 40% { transform: scale(.84); } }
    @keyframes loping { 50% { transform: scale(1.08); } }
    .lo-pip { stroke: rgba(0,0,0,.5); stroke-width: 2; pointer-events: none; }
    .lo-pip.t0 { fill: #0d1022; stroke: #7d86c0; }
    .lo-pip.t1 { fill: #ffd76e; }
    .lo-k3 .lo-pip.t1 { fill: #ff6b6b; }
    .lo-pip.t2 { fill: #5ee39a; }
    .lo-mini-bg { fill: #11152a; stroke: var(--line); stroke-width: 2; }
    .lo-mini-t { font: 600 22px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .08em; }
    .lo-mini-wire { stroke: #3d4478; stroke-width: 3; }
    .lo-mini-l { fill: #2a3060; }
    .lo-mini-l.t1 { fill: #ffd76e; }
    .lo-k3 .lo-mini-l.t1 { fill: #ff6b6b; }
    .lo-mini-l.t2 { fill: #5ee39a; }
    .lo-ripple { fill: none; stroke: #fff3c4; stroke-width: 5; pointer-events: none; transform-box: fill-box; transform-origin: center; animation: loripple .55s ease-out forwards; }
    @keyframes loripple { from { transform: scale(.7); opacity: .9; } to { transform: scale(1.7); opacity: 0; } }
    .lo-mark { fill: none; stroke: var(--gold); stroke-width: 7; stroke-dasharray: 14 9; pointer-events: none; animation: lomark 1s ease-in-out infinite; }
    .lo-mark-n { font: 800 26px "Segoe UI", system-ui, sans-serif; fill: var(--gold); pointer-events: none; }
    @keyframes lomark { 50% { opacity: .35; } }
    .lo-cursor { fill: none; stroke: var(--accent); stroke-width: 6; pointer-events: none; }

    .gl-table { fill: var(--wood-dark); opacity: .28; }
    .gl-shelf { fill: var(--wood-dark); opacity: .55; }
    .gl-item { cursor: pointer; }
    .gl-shadow { fill: rgba(0,0,0,.28); }
    .gl-lift { transition: transform .15s; }
    .gl-item.sel .gl-lift { transform: translateY(-16px); }
    .gl-item.prev .gl-lift { transform: translateY(-9px); }
    .gl-glass { fill: rgba(170,210,255,.16); stroke: var(--ink-2); stroke-width: 5; stroke-linejoin: round; transition: fill .15s, stroke .15s; }
    .gl-base { fill: rgba(170,210,255,.28); pointer-events: none; }
    .gl-rim { fill: rgba(200,225,255,.22); stroke: var(--ink-2); stroke-width: 4; pointer-events: none; }
    .gl-shine { stroke: rgba(255,255,255,.35); stroke-width: 5; stroke-linecap: round; fill: none; pointer-events: none; }
    .gl-item.dn .gl-glass { fill: rgba(255,176,87,.2); stroke: var(--warn); }
    .gl-item.dn .gl-rim { stroke: var(--warn); fill: rgba(255,176,87,.25); }
    .gl-item.dn .gl-base { fill: rgba(255,176,87,.3); }
    .gl-coin { fill: #f2c14e; stroke: #8a5a14; stroke-width: 5; transition: fill .15s; }
    .gl-coin-in { fill: none; stroke: #b07c1f; stroke-width: 3; stroke-dasharray: 5 5; pointer-events: none; }
    .gl-face { font: 800 44px Georgia, "Times New Roman", serif; fill: #6b4306; pointer-events: none; }
    .gl-item.dn .gl-coin { fill: #c98f32; }
    .gl-item.dn .gl-h, .gl-item:not(.dn) .gl-t { display: none; }
    .gl-item.sel .gl-glass, .gl-item.sel .gl-coin { stroke: var(--accent); stroke-width: 8; }
    .gl-item.prev .gl-glass, .gl-item.prev .gl-coin { stroke: var(--gold); stroke-width: 8; }
    .gl-num { font: 700 22px "Segoe UI", system-ui, sans-serif; fill: var(--faint); pointer-events: none; }
    .gl-want { font: 700 22px "Segoe UI", system-ui, sans-serif; fill: var(--teal); pointer-events: none; }
    .gl-btn { cursor: pointer; }
    .gl-btn.gone { display: none; }
    .gl-btn rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 3; transition: fill .15s, stroke .15s; }
    .gl-btn text { font: 600 24px "Segoe UI", system-ui, sans-serif; fill: var(--muted); pointer-events: none; }
    .gl-btn.ready rect { fill: var(--accent); stroke: var(--accent); }
    .gl-btn.ready text { fill: #fff; }
    .gl-tip { font: 500 21px "Segoe UI", system-ui, sans-serif; fill: var(--muted); pointer-events: none; }
    .gl-mark { fill: none; stroke: var(--gold); stroke-width: 7; stroke-dasharray: 14 9; pointer-events: none; animation: lomark 1s ease-in-out infinite; }
    .gl-auto { display: flex; gap: 8px; align-items: center; font-size: 13px; color: var(--muted); margin: 6px 0; cursor: pointer; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);

