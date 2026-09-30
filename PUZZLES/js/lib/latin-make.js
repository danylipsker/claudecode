/* The Puzzle Cabinet · js/lib/latin-make.js
 *
 * Making number-in-cell puzzles (Sudoku, KenKen, Futoshiki, Skyscrapers).
 * Used by engines/latin.js generate() for the Endless drawers and by
 * tools/gen/latin.js (with fixed seeds) for the stored puzzles.
 *
 * Every puzzle starts as a random Latin square (dancing links with a seeded
 * shuffle). Clues are then taken away one at a time, keeping each removal
 * only while the human-style solver (js/lib/latin-logic.js) still finishes
 * with techniques up to a target level. So every puzzle has exactly one
 * solution, reachable without guessing, and its difficulty is honest.
 *
 *   Cabinet.Latin.make.once(kind, rng, spec)   one attempt: { d, r, diff } | null
 *   Cabinet.Latin.make.endless(rng, diff, fid)  a puzzle of that difficulty, or null
 *   Cabinet.Latin.make.words(d, diff)           { series, title, text, tags }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  const Lt = () => C.Latin;

  /* ---------- full grids ---------- */

  // a random filled grid: a Latin square, with boxes, regions or diagonals if the data has them
  function fullGrid(rng, d) {
    const L = Lt(), n = d.n, N = n * n;
    const P = L.build(Object.assign({}, d, { givens: '' }));
    const extra = P.units.filter((u) => u.type === 'box' || u.type === 'diag');
    const rows = [], meta = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / n), c = i % n;
      for (let v = 1; v <= n; v++) {
        const cols = [i, N + r * n + v - 1, 2 * N + c * n + v - 1];
        extra.forEach((u, k) => { if (u.cells.indexOf(i) >= 0) cols.push(3 * N + k * n + v - 1); });
        rows.push(cols);
        meta.push([i, v]);
      }
    }
    const sols = C.DLX.solve({ primary: 3 * N + extra.length * n, rows, max: 1, shuffle: rng, nodeLimit: 200000 });
    if (!sols.length) return null;
    const g = new Array(N).fill(0);
    sols[0].forEach((ri) => { g[meta[ri][0]] = meta[ri][1]; });
    return g;
  }

  function neighbours(n, i) {
    const r = Math.floor(i / n), c = i % n, out = [];
    if (r > 0) out.push(i - n);
    if (r < n - 1) out.push(i + n);
    if (c > 0) out.push(i - 1);
    if (c < n - 1) out.push(i + 1);
    return out;
  }

  function connected(n, reg, k) {
    let first = -1, size = 0;
    for (let i = 0; i < reg.length; i++) if (reg[i] === k) { size++; if (first < 0) first = i; }
    if (first < 0) return false;
    const seen = new Set([first]), stack = [first];
    while (stack.length) {
      const i = stack.pop();
      for (const j of neighbours(n, i)) if (reg[j] === k && !seen.has(j)) { seen.add(j); stack.push(j); }
    }
    return seen.size === size;
  }

  // jigsaw regions: start from the boxes and trade cells across borders, keeping every region in one piece
  function jigsawRegions(rng, n, box) {
    const N = n * n, reg = [], perRow = n / box[1];
    for (let i = 0; i < N; i++) reg.push(Math.floor(Math.floor(i / n) / box[0]) * perRow + Math.floor((i % n) / box[1]));
    const orig = reg.slice();
    for (let it = 0; it < N * 50; it++) {
      const a = rng.int(N), A = reg[a];
      const nbA = neighbours(n, a).filter((j) => reg[j] !== A);
      if (!nbA.length) continue;
      const Bk = reg[rng.pick(nbA)];
      const bs = [];
      for (let i = 0; i < N; i++) if (reg[i] === Bk && neighbours(n, i).some((j) => j !== a && reg[j] === A)) bs.push(i);
      if (!bs.length) continue;
      const b = rng.pick(bs);
      reg[a] = Bk; reg[b] = A;
      if (!connected(n, reg, A) || !connected(n, reg, Bk)) { reg[a] = A; reg[b] = Bk; }
    }
    if (reg.filter((k, i) => k !== orig[i]).length < N * 0.35) return null;
    return reg.map((k) => String.fromCharCode(97 + k)).join('');
  }

  /* ---------- grading ---------- */

  function solvable(d, maxLevel) {
    const L = Lt(), P = L.build(d);
    return L.logic(P, P.givens, { maxLevel }).solved;
  }
  function grade(d) {
    const L = Lt(), P = L.build(d);
    const r = L.logic(P, P.givens, { maxLevel: 5 });
    return { r, diff: r.solved ? L.diffOf(P, r) : 0 };
  }

  /* ---------- Sudoku ---------- */

  // take givens away (in turn-symmetric pairs if sym) while the grid stays solvable at maxLevel
  function thinGivens(rng, d, giv, maxLevel, sym) {
    const L = Lt(), N = d.n * d.n;
    const order = rng.shuffle(Array.from({ length: N }, (_, i) => i));
    const done = new Uint8Array(N);
    for (const i of order) {
      if (done[i] || !giv[i]) continue;
      const j = N - 1 - i;
      const group = sym && j !== i ? [i, j] : [i];
      group.forEach((x) => { done[x] = 1; });
      const keep = group.map((x) => giv[x]);
      group.forEach((x) => { giv[x] = 0; });
      if (!solvable(Object.assign({}, d, { givens: L.gridStr(giv) }), maxLevel)) group.forEach((x, k) => { giv[x] = keep[k]; });
    }
    return giv;
  }

  // a fiendish grid often turns merely hard when one clue is given back: try a few
  function easeTo(rng, d, sol, giv, diff, sym) {
    const L = Lt(), N = d.n * d.n;
    const empties = rng.shuffle(Array.from({ length: N }, (_, i) => i).filter((i) => !giv[i])).slice(0, 12);
    for (const i of empties) {
      const g2 = giv.slice();
      g2[i] = sol[i];
      if (sym) g2[N - 1 - i] = sol[N - 1 - i];
      const x = grade(Object.assign({}, d, { givens: L.gridStr(g2) }));
      if (x.r.solved && x.diff === diff) return g2;
    }
    return null;
  }

  // spec: { n, variant: '' | 'jigsaw' | 'diag', diff, sym }
  function sudokuOnce(rng, spec) {
    const L = Lt(), n = spec.n, box = n === 4 ? [2, 2] : n === 6 ? [2, 3] : [3, 3];
    const d = { kind: 'sudoku', n };
    if (spec.variant === 'jigsaw') { d.regions = jigsawRegions(rng, n, box); if (!d.regions) return null; } else d.box = box;
    if (spec.variant === 'diag') d.diag = true;
    const sol = fullGrid(rng, d);
    if (!sol) return null;
    const sym = spec.sym !== false && spec.variant !== 'jigsaw';
    let giv = thinGivens(rng, d, sol.slice(), Math.min(4, spec.diff), sym);
    d.givens = L.gridStr(giv);
    let g = grade(d);
    if (g.r.solved && g.diff === 5 && spec.diff === 4) {
      giv = easeTo(rng, d, sol, giv, 4, sym);
      if (!giv) return null;
      d.givens = L.gridStr(giv);
      g = grade(d);
    }
    if (!g.r.solved || g.diff !== spec.diff) return null;
    d.sol = sol.join('');
    return { d, r: g.r, diff: g.diff };
  }

  /* ---------- KenKen ---------- */

  function makeCages(rng, n, sol, style) {
    const N = n * n, cageOf = new Int16Array(N).fill(-1), groups = [];
    const sizes = style === 'easy' ? [0.14, 0.56, 0.26, 0.04] : style === 'hard' ? [0.03, 0.42, 0.4, 0.15] : [0.07, 0.5, 0.33, 0.1];
    const order = rng.shuffle(Array.from({ length: N }, (_, i) => i));
    for (const s of order) {
      if (cageOf[s] >= 0) continue;
      let x = rng(), size = sizes.length;
      for (let k = 0; k < sizes.length; k++) { if (x < sizes[k]) { size = k + 1; break; } x -= sizes[k]; }
      const cells = [s];
      cageOf[s] = groups.length;
      while (cells.length < size) {
        const fr = [];
        cells.forEach((c) => neighbours(n, c).forEach((j) => { if (cageOf[j] < 0 && fr.indexOf(j) < 0) fr.push(j); }));
        if (!fr.length) break;
        const j = rng.pick(fr);
        cageOf[j] = groups.length;
        cells.push(j);
      }
      groups.push(cells.sort((a, b) => a - b));
    }
    return groups.map((cells) => {
      const vs = cells.map((i) => sol[i]);
      if (cells.length === 1) return [vs[0], '=', cells[0]];
      if (cells.length === 2) {
        const a = Math.max(vs[0], vs[1]), b = Math.min(vs[0], vs[1]);
        const x = rng();
        if (a % b === 0 && x < 0.4) return [a / b, '/'].concat(cells);
        if (x < 0.62) return [a - b, '-'].concat(cells);
        if (x < 0.82) return [a + b, '+'].concat(cells);
        return [a * b, '*'].concat(cells);
      }
      if (rng() < 0.55) return [vs.reduce((s, v) => s + v, 0), '+'].concat(cells);
      return [vs.reduce((s, v) => s * v, 1), '*'].concat(cells);
    });
  }

  // spec: { n, style: 'easy' | 'mid' | 'hard' } -> any difficulty (the caller keeps what it wants)
  function kenkenOnce(rng, spec) {
    const L = Lt(), n = spec.n;
    const sol = fullGrid(rng, { kind: 'kenken', n });
    if (!sol) return null;
    const d = { kind: 'kenken', n, cages: makeCages(rng, n, sol, spec.style || 'mid'), sol: sol.join('') };
    const P = L.build(d);
    const cnt = L.count(P, null, 2, 20000);
    if (cnt.n !== 1 || cnt.aborted) return null;
    const r = L.logic(P, P.givens, { maxLevel: 5 });
    if (!r.solved) return null;
    return { d, r, diff: L.diffOf(P, r) };
  }

  /* ---------- Futoshiki ---------- */

  function allSigns(n, sol) {
    const out = [];
    for (let i = 0; i < n * n; i++) {
      const r = Math.floor(i / n), c = i % n;
      if (c < n - 1) out.push(sol[i] < sol[i + 1] ? [i, i + 1] : [i + 1, i]);
      if (r < n - 1) out.push(sol[i] < sol[i + n] ? [i, i + n] : [i + n, i]);
    }
    return out;
  }

  // spec: { n, level }
  function futoshikiOnce(rng, spec) {
    const L = Lt(), n = spec.n, level = spec.level;
    const sol = fullGrid(rng, { kind: 'futoshiki', n });
    if (!sol) return null;
    const signs = allSigns(n, sol);
    const giv = sol.slice();
    const keep = signs.map(() => true);
    const mk = () => ({ kind: 'futoshiki', n, givens: L.gridStr(giv), lt: signs.filter((s, k) => keep[k]) });
    const tryGivens = () => rng.shuffle(Array.from({ length: n * n }, (_, i) => i)).forEach((i) => {
      if (!giv[i]) return;
      const v = giv[i];
      giv[i] = 0;
      if (!solvable(mk(), level)) giv[i] = v;
    });
    tryGivens();
    rng.shuffle(signs.map((s, k) => k)).forEach((k) => {
      keep[k] = false;
      if (!solvable(mk(), level)) keep[k] = true;
    });
    tryGivens();
    const d = mk();
    const g = grade(d);
    if (!g.r.solved || g.r.level !== level) return null;
    d.sol = sol.join('');
    return { d, r: g.r, diff: g.diff };
  }

  /* ---------- Skyscrapers ---------- */

  function allClues(n, sol) {
    const seen = Lt().seen;
    const row = (r) => sol.slice(r * n, r * n + n);
    const col = (c) => Array.from({ length: n }, (_, r) => sol[r * n + c]);
    const t = [], b = [], l = [], r = [];
    for (let k = 0; k < n; k++) {
      t.push(seen(col(k))); b.push(seen(col(k).reverse()));
      l.push(seen(row(k))); r.push(seen(row(k).reverse()));
    }
    return { t, b, l, r };
  }

  // spec: { n, level }
  function skyscrapersOnce(rng, spec) {
    const L = Lt(), n = spec.n, level = spec.level;
    const sol = fullGrid(rng, { kind: 'skyscrapers', n });
    if (!sol) return null;
    const clues = allClues(n, sol);
    const giv = sol.slice();
    const mk = () => ({ kind: 'skyscrapers', n, givens: L.gridStr(giv), clues: { t: clues.t.slice(), b: clues.b.slice(), l: clues.l.slice(), r: clues.r.slice() } });
    const tryGivens = () => rng.shuffle(Array.from({ length: n * n }, (_, i) => i)).forEach((i) => {
      if (!giv[i]) return;
      const v = giv[i];
      giv[i] = 0;
      if (!solvable(mk(), level)) giv[i] = v;
    });
    tryGivens();
    const slots = [];
    ['t', 'b', 'l', 'r'].forEach((s) => { for (let k = 0; k < n; k++) slots.push([s, k]); });
    // easy towns keep plenty of clues around the edge: they are the fun of it
    const keepAtLeast = Math.ceil(4 * n * (level === 1 ? 0.5 : level === 2 ? 0.35 : 0));
    let left = 4 * n;
    rng.shuffle(slots).forEach(([s, k]) => {
      if (left <= keepAtLeast) return;
      const v = clues[s][k];
      clues[s][k] = 0;
      if (!solvable(mk(), level)) clues[s][k] = v; else left--;
    });
    tryGivens();
    const d = mk();
    const g = grade(d);
    if (!g.r.solved || g.r.level !== level) return null;
    d.sol = sol.join('');
    return { d, r: g.r, diff: g.diff };
  }

  const ONCE = { sudoku: sudokuOnce, kenken: kenkenOnce, futoshiki: futoshikiOnce, skyscrapers: skyscrapersOnce };
  function once(kind, rng, spec) { return ONCE[kind](rng, spec); }

  /* ---------- words ---------- */

  const SERIES9 = ['', 'Meadow', 'Orchard', 'Woodland', 'Mountain', 'Summit'];
  function words(d, diff) {
    const n = d.n, size = n + '×' + n;
    let series, text;
    const tags = [size];
    if (d.kind === 'sudoku') {
      series = d.regions ? 'Patchwork' : d.diag ? 'Crossroads' : n === 4 ? 'Seedling' : n === 6 ? 'Garden' : SERIES9[diff] || 'Classic';
      const bx = d.box ? d.box[0] + ' × ' + d.box[1] + ' box' : 'outlined region';
      text = 'Fill the grid so that every row, every column and every ' + bx + ' holds each of the digits 1 to ' + n + ' exactly once.' + (d.diag ? ' So do the two long diagonals.' : '');
      if (d.regions) tags.push('jigsaw');
      if (d.diag) tags.push('diagonal');
    } else if (d.kind === 'kenken') {
      series = 'Abacus';
      text = 'Fill in the digits 1 to ' + n + ' so that none repeats in a row or a column. The digits in each outlined cage must make the number in its corner with the sign shown (for − and ÷ start from the larger digit). A digit may repeat inside a cage, as long as not in the same row or column.';
    } else if (d.kind === 'futoshiki') {
      series = 'Staircase';
      text = 'Fill in the digits 1 to ' + n + ' so that none repeats in a row or a column, and every sign between two cells is true: the point of each sign faces the smaller number.';
    } else {
      series = 'Skyline';
      text = 'Every cell holds a building 1 to ' + n + ' storeys tall, and no height repeats in a row or a column. A number on the edge tells how many buildings you can see looking in from there: a taller building hides every shorter one behind it.';
    }
    return { series, title: series + ' ' + size, text, tags };
  }

  const TECH_TAG = {
    pointing: 'pointing', naked2: 'naked pair', hidden2: 'hidden pair', naked3: 'naked triple', hidden3: 'hidden triple',
    naked4: 'quad', hidden4: 'quad', fish2: 'x-wing', fish3: 'swordfish', xywing: 'xy-wing', cagemust: 'cage logic', line: 'line logic'
  };
  function techTags(r) {
    const t = new Set();
    Object.keys(r.counts).forEach((k) => { if (TECH_TAG[k]) t.add(TECH_TAG[k]); });
    return Array.from(t);
  }

  /* ---------- Endless: a fresh puzzle of a given difficulty ----------
   * Each entry: the specs to draw from, and how many attempts to allow (each
   * attempt is a few milliseconds to a few tens; the whole call stays well
   * under a second). Deterministic for a given rng. */
  const ENDLESS = {
    sudoku: {
      1: { tries: 12, specs: [{ n: 9, diff: 1 }, { n: 9, diff: 1 }, { n: 6, diff: 1 }] },
      2: { tries: 12, specs: [{ n: 9, diff: 2 }, { n: 9, diff: 2 }, { n: 9, diff: 2, variant: 'diag' }, { n: 6, diff: 2 }] },
      3: { tries: 24, specs: [{ n: 9, diff: 3 }, { n: 9, diff: 3 }, { n: 9, diff: 3 }, { n: 9, diff: 3, variant: 'diag' }, { n: 9, diff: 3, variant: 'jigsaw' }] },
      4: { tries: 50, specs: [{ n: 9, diff: 4 }, { n: 9, diff: 4 }, { n: 9, diff: 4, variant: 'diag' }] },
      5: { tries: 60, specs: [{ n: 9, diff: 5 }, { n: 9, diff: 5 }, { n: 9, diff: 5, variant: 'diag' }] }
    },
    kenken: {
      1: { tries: 400, specs: [{ n: 4, style: 'easy' }, { n: 5, style: 'easy' }] },
      2: { tries: 400, specs: [{ n: 5, style: 'mid' }, { n: 6, style: 'easy' }, { n: 4, style: 'hard' }] },
      3: { tries: 500, specs: [{ n: 6, style: 'mid' }, { n: 7, style: 'easy' }, { n: 5, style: 'hard' }] },
      4: { tries: 1000, specs: [{ n: 6, style: 'hard' }, { n: 6, style: 'mid' }] },
      5: { tries: 800, specs: [{ n: 7, style: 'hard' }, { n: 7, style: 'mid' }] }
    },
    futoshiki: {
      1: { tries: 10, specs: [{ n: 4, level: 1 }, { n: 5, level: 1 }] },
      2: { tries: 20, specs: [{ n: 5, level: 2 }, { n: 6, level: 1 }] },
      3: { tries: 20, specs: [{ n: 6, level: 2 }, { n: 5, level: 3 }, { n: 7, level: 2 }] },
      4: { tries: 25, specs: [{ n: 6, level: 3 }] },
      5: { tries: 25, specs: [{ n: 7, level: 3 }, { n: 6, level: 4 }] }
    },
    skyscrapers: {
      1: { tries: 10, specs: [{ n: 4, level: 1 }, { n: 5, level: 1 }] },
      2: { tries: 20, specs: [{ n: 5, level: 2 }, { n: 6, level: 1 }] },
      3: { tries: 20, specs: [{ n: 6, level: 2 }, { n: 5, level: 3 }] },
      4: { tries: 25, specs: [{ n: 6, level: 3 }] },
      5: { tries: 35, specs: [{ n: 6, level: 4 }] }
    }
  };

  function endless(rng, diff, kind) {
    const plan = ENDLESS[kind] && ENDLESS[kind][diff];
    if (!plan) return null;
    for (let t = 0; t < plan.tries; t++) {
      const spec = plan.specs[t % plan.specs.length];
      const x = once(kind, rng, spec);
      if (x && x.diff === diff) return x;
    }
    return null;
  }

  C.Latin = C.Latin || {};
  C.Latin.make = { fullGrid, jigsawRegions, thinGivens, easeTo, grade, solvable, makeCages, allSigns, allClues, once, words, techTags, endless, ENDLESS };
})(typeof window !== 'undefined' ? window : globalThis);
