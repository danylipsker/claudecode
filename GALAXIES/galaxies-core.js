/*  GALAXIES core engine
 *  ---------------------
 *  Puzzle model, solver, generator, game-ID codec, board analysis and hint
 *  finder for the Galaxies / Tentai Show puzzle.
 *
 *  Everything lives inside one self-contained function so the very same
 *  code can run on the page and inside a Web Worker (the UI stringifies
 *  this function to build the worker) and in Node for the bench script.
 *
 *  Conventions
 *  -----------
 *  - Cells are indexed c = y * W + x.
 *  - Dots live on the "doubled" grid: (dx, dy) with 1 <= dx <= 2W-1 and
 *    1 <= dy <= 2H-1.  Odd coordinates are cell centres, even ones are grid
 *    lines, so a dot can sit on a cell centre, an edge midpoint or a vertex.
 *  - The mirror of cell (x, y) about dot (dx, dy) is (dx-1-x, dy-1-y).
 *  - Edges between cells are identified by 2*(y*W+x) for the edge to the
 *    right of cell (x,y) and 2*(y*W+x)+1 for the edge below it.
 */
function GalaxiesCore() {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Random numbers (deterministic, seedable)                            */
  /* ------------------------------------------------------------------ */

  function hashSeed(str) {                       // cyrb128
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
  }

  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  function makeRng(seed) {
    const s = hashSeed(String(seed));
    const r = sfc32(s[0], s[1], s[2], s[3]);
    for (let i = 0; i < 20; i++) r();
    return r;
  }

  function randInt(rng, n) { return Math.floor(rng() * n); }

  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(rng, i + 1);
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function randomSeed() {
    const a = new Uint32Array(2);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(a);
    else { a[0] = (Math.random() * 4294967296) >>> 0; a[1] = (Math.random() * 4294967296) >>> 0; }
    return (a[0].toString(36) + a[1].toString(36)).slice(0, 10);
  }

  /* ------------------------------------------------------------------ */
  /*  Puzzle model                                                        */
  /* ------------------------------------------------------------------ */

  const DIFFICULTIES = ['easy', 'normal', 'hard', 'unreasonable'];

  function coreCells(W, dot) {
    const xs = (dot.x & 1) ? [(dot.x - 1) / 2] : [dot.x / 2 - 1, dot.x / 2];
    const ys = (dot.y & 1) ? [(dot.y - 1) / 2] : [dot.y / 2 - 1, dot.y / 2];
    const cs = [];
    for (const y of ys) for (const x of xs) cs.push(y * W + x);
    return cs;
  }

  /** Build the derived tables for a set of dots. Throws on invalid input. */
  function makePuzzle(W, H, dots) {
    if (!(W >= 2 && H >= 2)) throw new Error('Grid must be at least 2×2');
    const N = W * H, G = dots.length;
    if (G < 1) throw new Error('The puzzle has no dots');
    const mirror = new Int16Array(N * G);
    const cores = [];
    const coreOf = new Int16Array(N).fill(-1);
    for (let g = 0; g < G; g++) {
      const { x: dx, y: dy } = dots[g];
      if (!(dx >= 1 && dx <= 2 * W - 1 && dy >= 1 && dy <= 2 * H - 1))
        throw new Error('A dot lies outside the grid');
      for (let c = 0; c < N; c++) {
        const x = c % W, y = (c / W) | 0;
        const mx = dx - 1 - x, my = dy - 1 - y;
        mirror[g * N + c] = (mx >= 0 && mx < W && my >= 0 && my < H) ? my * W + mx : -1;
      }
      const cs = coreCells(W, dots[g]);
      for (const c of cs) {
        if (coreOf[c] >= 0) throw new Error('Two dots are too close together');
        coreOf[c] = g;
      }
      cores.push(cs);
    }
    return {
      W, H, N, G, dots, mirror, cores, coreOf,
      scratch: { seen: new Int32Array(N), stamp: 0, stack: new Int32Array(N) }
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Solver                                                              */
  /* ------------------------------------------------------------------ */
  /*  Each cell keeps the set of galaxies that could still contain it
   *  ("candidates").  Rules:
   *    - a galaxy is a candidate for a cell only if the cell's mirror image
   *      about that dot is inside the grid;
   *    - candidate sets are always symmetric: whatever is removed from a cell
   *      is removed from its mirror as well;
   *    - a galaxy must be able to reach every one of its candidate cells
   *      from its dot through candidate cells (reachability pruning);
   *    - a cell with one candidate is assigned to it;
   *  Level 2 adds "must connect": if an assigned cell can only be linked to
   *  its dot through one specific cell, that cell is assigned too.
   *  Level 3 adds one-step hypotheticals: assume a candidate, propagate at
   *  level 2, drop the candidate on contradiction.
   *  Beyond that the search branches (backtracking).
   */

  class SState {
    constructor(p) {
      this.p = p;
      const { N, G } = p;
      this.cand = new Uint8Array(N * G);
      this.nCand = new Uint16Array(N);
      this.owner = new Int16Array(N).fill(-1);
      this.unassigned = N;
      this.dead = false;
      this.queue = [];
      this.dirty = new Uint8Array(G).fill(1);
      this.ops = 0;
      for (let g = 0; g < G; g++) {
        const base = g * N;
        for (let c = 0; c < N; c++) if (p.mirror[base + c] >= 0) { this.cand[c * G + g] = 1; this.nCand[c]++; }
      }
    }
    clone() {
      const s = Object.create(SState.prototype);
      s.p = this.p;
      s.cand = this.cand.slice();
      s.nCand = this.nCand.slice();
      s.owner = this.owner.slice();
      s.unassigned = this.unassigned;
      s.dead = this.dead;
      s.queue = this.queue.slice();
      s.dirty = this.dirty.slice();
      s.ops = this.ops;
      return s;
    }
  }

  function remove(s, c, g) {
    const G = s.p.G, i = c * G + g;
    if (!s.cand[i]) return;
    s.cand[i] = 0; s.nCand[c]--; s.dirty[g] = 1; s.ops++;
    if (s.owner[c] === g || s.nCand[c] === 0) { s.dead = true; return; }
    const m = s.p.mirror[g * s.p.N + c];
    if (m >= 0 && s.cand[m * G + g]) remove(s, m, g);
    if (s.nCand[c] === 1 && s.owner[c] < 0) s.queue.push(c);
  }

  function assign(s, c, g) {
    if (s.owner[c] === g) return;
    const G = s.p.G;
    if (s.owner[c] >= 0 || !s.cand[c * G + g]) { s.dead = true; return; }
    s.owner[c] = g; s.unassigned--; s.ops++;
    const base = c * G;
    for (let h = 0; h < G; h++) if (h !== g && s.cand[base + h]) { remove(s, c, h); if (s.dead) return; }
    const m = s.p.mirror[g * s.p.N + c];
    if (m !== c) assign(s, m, g);
  }

  function assignCores(s) {
    const p = s.p;
    for (let g = 0; g < p.G && !s.dead; g++) for (const c of p.cores[g]) { assign(s, c, g); if (s.dead) return; }
  }

  /** Remove galaxy g from every cell it cannot reach from its dot. */
  function pruneReach(s, g) {
    const p = s.p, N = p.N, G = p.G, W = p.W;
    const seen = p.scratch.seen, stack = p.scratch.stack;
    const stamp = ++p.scratch.stamp;
    let top = 0;
    for (const c of p.cores[g]) {
      if (!s.cand[c * G + g]) { s.dead = true; return; }
      seen[c] = stamp; stack[top++] = c;
    }
    while (top) {
      const c = stack[--top], x = c % W;
      let n;
      if (x > 0) { n = c - 1; if (seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; } }
      if (x < W - 1) { n = c + 1; if (seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; } }
      if (c >= W) { n = c - W; if (seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; } }
      if (c + W < N) { n = c + W; if (seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; } }
    }
    for (let c = 0; c < N; c++) {
      if (s.cand[c * G + g] && seen[c] !== stamp) { remove(s, c, g); if (s.dead) return; }
    }
  }

  /** Can every assigned cell of g still reach the dot if `avoid` is blocked? Returns an unreachable assigned cell or -1. */
  function unreachableAssigned(s, g, avoid) {
    const p = s.p, N = p.N, G = p.G, W = p.W;
    const seen = p.scratch.seen, stack = p.scratch.stack;
    const stamp = ++p.scratch.stamp;
    let top = 0, need = 0;
    for (let c = 0; c < N; c++) if (s.owner[c] === g) need++;
    for (const c of p.cores[g]) { seen[c] = stamp; stack[top++] = c; need--; }
    while (top && need > 0) {
      const c = stack[--top], x = c % W;
      let n;
      if (x > 0) { n = c - 1; if (n !== avoid && seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; if (s.owner[n] === g) need--; } }
      if (x < W - 1) { n = c + 1; if (n !== avoid && seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; if (s.owner[n] === g) need--; } }
      if (c >= W) { n = c - W; if (n !== avoid && seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; if (s.owner[n] === g) need--; } }
      if (c + W < N) { n = c + W; if (n !== avoid && seen[n] !== stamp && s.cand[n * G + g]) { seen[n] = stamp; stack[top++] = n; if (s.owner[n] === g) need--; } }
    }
    if (need <= 0) return -1;
    for (let c = 0; c < N; c++) if (s.owner[c] === g && seen[c] !== stamp) return c;
    return -1;
  }

  /** Level-2 rule. Returns the first forced {cell, galaxy, target} (and applies it) or null. */
  function forceConnection(s, g, apply) {
    const p = s.p, N = p.N, G = p.G;
    let extra = false;
    for (let c = 0; c < N; c++) if (s.owner[c] === g && p.coreOf[c] !== g) { extra = true; break; }
    if (!extra) return null;
    const done = new Uint8Array(N);
    for (let x = 0; x < N; x++) {
      if (done[x] || s.owner[x] >= 0 || !s.cand[x * G + g]) continue;
      done[x] = 1; const mx = p.mirror[g * N + x]; if (mx >= 0) done[mx] = 1;
      const t = unreachableAssigned(s, g, x);
      if (t >= 0) {
        if (apply) assign(s, x, g);
        return { cell: x, galaxy: g, target: t };
      }
    }
    return null;
  }

  /** Level-3 rule: one-step hypotheticals. Returns true if something changed. */
  function hypotheticals(s, hintOut) {
    const p = s.p, N = p.N, G = p.G;
    const cells = [];
    for (let c = 0; c < N; c++) if (s.owner[c] < 0) cells.push(c);
    cells.sort((a, b) => s.nCand[a] - s.nCand[b] || a - b);
    for (const c of cells) {
      if (s.owner[c] >= 0) continue;
      let changed = false, wrong = -1;
      for (let g = 0; g < G; g++) {
        if (!s.cand[c * G + g]) continue;
        const t = s.clone();
        assign(t, c, g);
        propagate(t, 1);
        if (t.dead) {
          remove(s, c, g); changed = true; wrong = g;
          if (s.dead) return true;
          propagate(s, 2);
          if (s.dead || s.owner[c] >= 0) break;
        }
      }
      if (changed) {
        if (hintOut) { hintOut.cell = c; hintOut.wrong = wrong; hintOut.galaxy = s.owner[c]; }
        return true;
      }
    }
    return false;
  }

  function drainQueue(s) {
    const G = s.p.G;
    while (s.queue.length && !s.dead) {
      const c = s.queue.pop();
      if (s.owner[c] >= 0) continue;
      let g = -1;
      for (let h = 0; h < G; h++) if (s.cand[c * G + h]) { g = h; break; }
      if (g < 0) { s.dead = true; return; }
      assign(s, c, g);
    }
  }

  function propagate(s, level) {
    const G = s.p.G;
    while (!s.dead) {
      drainQueue(s);
      if (s.dead) return;
      const before = s.ops;
      for (let g = 0; g < G; g++) if (s.dirty[g]) { s.dirty[g] = 0; pruneReach(s, g); if (s.dead) return; }
      if (s.ops !== before || s.queue.length) continue;
      if (s.unassigned === 0) return;
      if (level >= 2) {
        let forced = false;
        for (let g = 0; g < G; g++) { if (forceConnection(s, g, true)) { forced = true; break; } }
        if (s.dead) return;
        if (forced) continue;
      }
      if (level >= 3) { if (hypotheticals(s)) continue; if (s.dead) return; }
      return;
    }
  }

  function initialState(p) {
    const s = new SState(p);
    assignCores(s);
    return s;
  }

  /**
   * Search for solutions (up to `limit`). Returns { count, solutions, nodes }.
   * `solutions` holds owner arrays (galaxy index per cell).
   */
  function solve(p, opts) {
    const limit = (opts && opts.limit) || 2;
    // Level 2 propagation inside the search costs more per node but prunes so
    // much that it is far cheaper overall; on a 20x20 grid it turned a 5 second
    // uniqueness check into 120 ms.
    const level = (opts && opts.level) || 2;
    const maxNodes = (opts && opts.maxNodes) || 400000;
    const deadline = (opts && opts.deadline) || 0;
    const G = p.G, N = p.N;
    const out = [];
    let nodes = 0, aborted = false;
    function rec(s) {
      if (++nodes > maxNodes) { aborted = true; return 0; }
      if (deadline && (nodes & 63) === 0 && Date.now() > deadline) { aborted = true; return 0; }
      propagate(s, level);
      if (s.dead) return 0;
      if (s.unassigned === 0) { out.push(s.owner.slice()); return 1; }
      let best = -1, bn = 1e9;
      for (let c = 0; c < N; c++) if (s.owner[c] < 0 && s.nCand[c] < bn) { bn = s.nCand[c]; best = c; if (bn === 2) break; }
      let total = 0;
      for (let g = 0; g < G && !aborted; g++) {
        if (!s.cand[best * G + g]) continue;
        const t = s.clone();
        assign(t, best, g);
        total += rec(t);
        if (total >= limit) break;
      }
      return total;
    }
    const s0 = initialState(p);
    const count = s0.dead ? 0 : rec(s0);
    return { count, solutions: out, nodes, aborted };
  }

  /**
   * Grade a (uniquely solvable) puzzle by the strongest rule it needs.
   * `maxLevel` stops early: a puzzle not solved by that level is reported as
   * the next tier up, which is all a generator targeting a lower tier needs.
   */
  function rate(p, maxLevel) {
    const s = initialState(p);
    const cap = maxLevel || 3;
    propagate(s, 1);
    if (s.dead) return 'impossible';
    if (s.unassigned === 0) return 'easy';
    if (cap < 2) return 'normal';
    propagate(s, 2);
    if (s.dead) return 'impossible';
    if (s.unassigned === 0) return 'normal';
    if (cap < 3) return 'hard';
    propagate(s, 3);
    if (s.dead) return 'impossible';
    if (s.unassigned === 0) return 'hard';
    return 'unreasonable';
  }

  function validateSolution(p, owner) {
    const { W, H, N, G } = p;
    const seen = new Uint8Array(N);
    for (let g = 0; g < G; g++) {
      const cells = [];
      for (let c = 0; c < N; c++) if (owner[c] === g) cells.push(c);
      if (!cells.length) return false;
      for (const c of p.cores[g]) if (owner[c] !== g) return false;
      for (const c of cells) { const m = p.mirror[g * N + c]; if (m < 0 || owner[m] !== g) return false; }
      const stack = [cells[0]]; seen[cells[0]] = 1; let n = 1;
      while (stack.length) {
        const c = stack.pop(), x = c % W, y = (c / W) | 0;
        const nb = [];
        if (x > 0) nb.push(c - 1); if (x < W - 1) nb.push(c + 1); if (y > 0) nb.push(c - W); if (y < H - 1) nb.push(c + W);
        for (const k of nb) if (!seen[k] && owner[k] === g) { seen[k] = 1; n++; stack.push(k); }
      }
      if (n !== cells.length) return false;
    }
    for (let c = 0; c < N; c++) if (owner[c] < 0 || owner[c] >= G) return false;
    return true;
  }

  /* ------------------------------------------------------------------ */
  /*  Generator                                                           */
  /* ------------------------------------------------------------------ */

  const EARLY_ACCEPT_FRACTION = 0.35;

  const GEN_PARAMS = {
    easy:         { stop: 0.22, sizeMul: 1.5, edgeW: 0.30, vertexW: 0.10, attempts: 80 },
    normal:       { stop: 0.12, sizeMul: 2.0, edgeW: 0.30, vertexW: 0.12, attempts: 120 },
    hard:         { stop: 0.07, sizeMul: 2.4, edgeW: 0.28, vertexW: 0.12, attempts: 160 },
    unreasonable: { stop: 0.05, sizeMul: 2.8, edgeW: 0.26, vertexW: 0.12, attempts: 240 }
  };

  /**
   * Grow symmetric galaxies over every free cell allowed by `mask`.
   * Mutates `owner` (galaxy index per cell) and `dots`.
   */
  function growInto(W, H, owner, dots, mask, rng, prm) {
    const N = W * H;
    const order = [];
    for (let c = 0; c < N; c++) if (mask[c] && owner[c] < 0) order.push(c);
    shuffle(order, rng);
    const mark = new Int32Array(N); let stamp = 0;
    const free = (c) => c >= 0 && c < N && mask[c] && owner[c] < 0;
    for (const c of order) {
      if (owner[c] >= 0) continue;
      const x = c % W, y = (c / W) | 0;
      const opts = [{ dx: 2 * x + 1, dy: 2 * y + 1, cells: [c], w: Math.max(0.05, 1 - prm.edgeW - prm.vertexW) }];
      if (x + 1 < W && free(c + 1)) opts.push({ dx: 2 * x + 2, dy: 2 * y + 1, cells: [c, c + 1], w: prm.edgeW / 2 });
      if (y + 1 < H && free(c + W)) opts.push({ dx: 2 * x + 1, dy: 2 * y + 2, cells: [c, c + W], w: prm.edgeW / 2 });
      if (x + 1 < W && y + 1 < H && free(c + 1) && free(c + W) && free(c + W + 1))
        opts.push({ dx: 2 * x + 2, dy: 2 * y + 2, cells: [c, c + 1, c + W, c + W + 1], w: prm.vertexW });
      let tw = 0; for (const o of opts) tw += o.w;
      let r = rng() * tw, pick = opts[0];
      for (const o of opts) { r -= o.w; if (r <= 0) { pick = o; break; } }
      const g = dots.length;
      dots.push({ x: pick.dx, y: pick.dy });
      const members = pick.cells.slice();
      for (const k of members) owner[k] = g;
      let size = members.length;
      const maxSize = prm.maxSize;
      while (size < maxSize) {
        if (rng() < prm.stop) break;
        stamp++;
        const frontier = [];
        for (const m of members) {
          const mx = m % W, my = (m / W) | 0;
          const nbs = [];
          if (mx > 0) nbs.push(m - 1); if (mx < W - 1) nbs.push(m + 1); if (my > 0) nbs.push(m - W); if (my < H - 1) nbs.push(m + W);
          for (const n of nbs) {
            if (mark[n] === stamp || !free(n)) continue;
            const nx = n % W, ny = (n / W) | 0;
            const rx = pick.dx - 1 - nx, ry = pick.dy - 1 - ny;
            if (rx < 0 || rx >= W || ry < 0 || ry >= H) continue;
            const mc = ry * W + rx;
            if (!free(mc)) continue;
            mark[n] = stamp;
            frontier.push(n);
          }
        }
        if (!frontier.length) break;
        const n = frontier[randInt(rng, frontier.length)];
        const nx = n % W, ny = (n / W) | 0;
        const mc = (pick.dy - 1 - ny) * W + (pick.dx - 1 - nx);
        owner[n] = g; owner[mc] = g;
        members.push(n); if (mc !== n) members.push(mc);
        size = members.length;
      }
    }
  }

  /**
   * Merge tiny galaxies (1-2 cells) into a neighbouring galaxy when their
   * mirror image about that neighbour's dot is also made of tiny galaxies.
   * Keeps every region symmetric and connected while removing the
   * confetti of single cells that random growth leaves behind.
   */
  function absorbSmall(W, H, owner, dots, rng) {
    const N = W * H;
    for (let pass = 0; pass < 4; pass++) {
      const G = dots.length;
      const cells = Array.from({ length: G }, () => []);
      for (let c = 0; c < N; c++) cells[owner[c]].push(c);
      const alive = new Uint8Array(G).fill(1);
      const order = []; for (let g = 0; g < G; g++) if (cells[g].length <= 2) order.push(g);
      shuffle(order, rng);
      let merged = 0;
      for (const s of order) {
        if (!alive[s]) continue;
        const mine = cells[s];
        const nbrs = new Set();
        for (const c of mine) {
          const x = c % W, y = (c / W) | 0;
          if (x > 0) nbrs.add(owner[c - 1]); if (x < W - 1) nbrs.add(owner[c + 1]);
          if (y > 0) nbrs.add(owner[c - W]); if (y < H - 1) nbrs.add(owner[c + W]);
        }
        nbrs.delete(s);
        const opts = shuffle(Array.from(nbrs), rng);
        for (const g of opts) {
          if (!alive[g] || cells[g].length <= 2) continue;
          const d = dots[g];
          const mirrorCells = [];
          let ok = true;
          for (const c of mine) {
            const x = c % W, y = (c / W) | 0, mx = d.x - 1 - x, my = d.y - 1 - y;
            if (mx < 0 || mx >= W || my < 0 || my >= H) { ok = false; break; }
            mirrorCells.push(my * W + mx);
          }
          if (!ok) continue;
          const victims = new Set();
          for (const m of mirrorCells) { const v = owner[m]; if (v === g || v === s || !alive[v] || cells[v].length > 2) { ok = false; break; } victims.add(v); }
          if (!ok) continue;
          let covered = 0; for (const v of victims) covered += cells[v].length;
          if (covered !== mirrorCells.length) continue;          // mirror set must be whole galaxies
          for (const c of mine) { owner[c] = g; cells[g].push(c); }
          for (const v of victims) { for (const c of cells[v]) { owner[c] = g; cells[g].push(c); } alive[v] = 0; }
          alive[s] = 0; merged++;
          break;
        }
      }
      if (!merged) break;
      // compact galaxy indices
      const remap = new Int16Array(G).fill(-1); const nd = [];
      for (let g = 0; g < G; g++) if (alive[g]) { remap[g] = nd.length; nd.push(dots[g]); }
      for (let c = 0; c < N; c++) owner[c] = remap[owner[c]];
      dots.length = 0; for (const d of nd) dots.push(d);
    }
  }

  /** Split the largest galaxy involved in an ambiguity into smaller ones. */
  function repair(W, H, owner, dots, alt, rng, prm) {
    const N = W * H, G = dots.length;
    const sizes = new Int32Array(G);
    for (let c = 0; c < N; c++) sizes[owner[c]]++;
    let g = -1, best = -1;
    for (let c = 0; c < N; c++) {
      if (owner[c] !== alt[c]) { const k = owner[c]; if (sizes[k] > best) { best = sizes[k]; g = k; } }
    }
    if (g < 0 || best < 2) return false;
    const mask = new Uint8Array(N);
    for (let c = 0; c < N; c++) if (owner[c] === g) { mask[c] = 1; owner[c] = -1; }
    const last = G - 1;
    if (g !== last) { dots[g] = dots[last]; for (let c = 0; c < N; c++) if (owner[c] === last) owner[c] = g; }
    dots.pop();
    growInto(W, H, owner, dots, mask, rng, Object.assign({}, prm, { maxSize: Math.max(1, Math.floor(best / 2)) }));
    return true;
  }

  /** Put dots in reading order and remap the solution accordingly. */
  function canonicalize(W, H, owner, dots) {
    const idx = dots.map((d, i) => i);
    idx.sort((a, b) => (dots[a].y - dots[b].y) || (dots[a].x - dots[b].x));
    const remap = new Int16Array(dots.length);
    idx.forEach((old, nu) => { remap[old] = nu; });
    const nd = idx.map(i => dots[i]);
    const no = new Int16Array(owner.length);
    for (let c = 0; c < owner.length; c++) no[c] = remap[owner[c]];
    return { dots: nd, owner: no };
  }

  function diffRank(d) { return DIFFICULTIES.indexOf(d); }

  /** Is rating `a` a better stand-in for `want` than `b`? Prefer the closest, and easier over harder on ties. */
  function closerRating(a, b, want) {
    const w = diffRank(want), ra = diffRank(a), rb = diffRank(b);
    const da = Math.abs(ra - w), db = Math.abs(rb - w);
    if (da !== db) return da < db;
    return ra < rb;
  }

  function generate(opts) {
    const W = opts.W, H = opts.H;
    const difficulty = DIFFICULTIES.includes(opts.difficulty) ? opts.difficulty : 'normal';
    const seed = opts.seed == null ? randomSeed() : String(opts.seed);
    const rng = makeRng(seed);
    const base = GEN_PARAMS[difficulty];
    const N = W * H;
    const maxAttempts = opts.maxAttempts || base.attempts;
    const prm = Object.assign({}, base, { maxSize: Math.max(3, Math.round(Math.sqrt(N) * base.sizeMul)) });
    const fullMask = new Uint8Array(N).fill(1);
    let fallback = null;
    const t0 = Date.now();
    // Overall budget, plus a shorter one per uniqueness check, so that a single
    // awkward grid can never stall the caller. Running out returns the best
    // puzzle found so far rather than nothing.
    const timeLimit = opts.timeLimitMs || 15000;
    const left = () => timeLimit - (Date.now() - t0);
    const checkBudget = () => Date.now() + Math.max(250, Math.min(3000, left()));
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (opts.shouldStop && opts.shouldStop()) break;
      if (left() <= 0) break;
      let owner = new Int16Array(N).fill(-1);
      let dots = [];
      growInto(W, H, owner, dots, fullMask, rng, prm);
      absorbSmall(W, H, owner, dots, rng);
      let puzzle = makePuzzle(W, H, dots);
      let res = solve(puzzle, { limit: 2, deadline: checkBudget() });
      let repairs = 0;
      while ((res.count !== 1 || res.aborted) && repairs < 20 && left() > 0) {
        let alt = null;
        for (const sol of res.solutions) { let same = true; for (let c = 0; c < N; c++) if (sol[c] !== owner[c]) { same = false; break; } if (!same) { alt = sol; break; } }
        if (!alt) break;
        if (!repair(W, H, owner, dots, alt, rng, prm)) break;
        puzzle = makePuzzle(W, H, dots);
        res = solve(puzzle, { limit: 2, deadline: checkBudget() });
        repairs++;
      }
      if (res.count !== 1 || res.aborted) { if (opts.onProgress) opts.onProgress(attempt + 1, maxAttempts); continue; }
      const rating = rate(puzzle, Math.max(1, diffRank(difficulty) + (difficulty === 'unreasonable' ? 0 : 1)));
      const cand = { W, H, owner, dots, rating, attempts: attempt + 1 };
      if (rating === difficulty) return finish(cand, seed, difficulty, t0);
      if (!fallback || closerRating(rating, fallback.rating, difficulty)) fallback = cand;
      if (opts.onProgress) opts.onProgress(attempt + 1, maxAttempts);
      // Some combinations are simply rare: an 'easy' rating on a 20x20 grid
      // needs every one of 400 cells to fall to the simplest rules. Rather than
      // burn the whole budget, settle for a puzzle one step off the request
      // once a good part of the time is gone.
      if (fallback && Date.now() - t0 > timeLimit * EARLY_ACCEPT_FRACTION &&
          Math.abs(diffRank(fallback.rating) - diffRank(difficulty)) <= 1)
        return finish(fallback, seed, difficulty, t0);
    }
    return fallback ? finish(fallback, seed, difficulty, t0) : null;
  }

  function finish(cand, seed, wanted, t0) {
    const { dots, owner } = canonicalize(cand.W, cand.H, cand.owner, cand.dots);
    return {
      W: cand.W, H: cand.H, dots, solution: Array.from(owner),
      rating: cand.rating, wanted, seed,
      id: encodeId(cand.W, cand.H, dots),
      attempts: cand.attempts, ms: Date.now() - t0
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Game-ID codec (compatible with Simon Tatham's Galaxies)             */
  /* ------------------------------------------------------------------ */
  /*  "WxH:" followed by the dots in reading order over the (2W-1)×(2H-1)
   *  interior of the doubled grid.  Each dot is one letter, 'a' + the
   *  number of empty positions since the previous dot; 'z' skips 25.
   *  Capital letters mark black dots in Tatham's picture variant; they are
   *  accepted and treated as ordinary dots.
   */

  function encodeId(W, H, dots) {
    const cols = 2 * W - 1, rows = 2 * H - 1;
    const has = new Uint8Array(cols * rows);
    for (const d of dots) has[(d.y - 1) * cols + (d.x - 1)] = 1;
    let out = '', run = 0;
    for (let i = 0; i < cols * rows; i++) {
      if (!has[i]) { run++; continue; }
      while (run > 24) { out += 'z'; run -= 25; }
      out += String.fromCharCode(97 + run);
      run = 0;
    }
    return W + 'x' + H + ':' + out;
  }

  function decodeId(text) {
    const m = /^\s*(\d+)\s*x\s*(\d+)\s*(?:d[nu])?\s*:\s*([A-Za-z]+)\s*$/.exec(text || '');
    if (!m) throw new Error('Expected a puzzle code like 7x7:abcd…');
    const W = +m[1], H = +m[2];
    if (W < 3 || H < 3 || W > 40 || H > 40) throw new Error('Grid size must be between 3×3 and 40×40');
    const cols = 2 * W - 1, rows = 2 * H - 1;
    const dots = [];
    let i = 0;
    for (const ch of m[3]) {
      const code = ch.charCodeAt(0);
      if (ch === 'z' || ch === 'Z') { i += 25; continue; }
      if (code >= 97 && code <= 121) i += code - 97;
      else if (code >= 65 && code <= 89) i += code - 65;
      else throw new Error('Invalid character in puzzle code');
      if (i >= cols * rows) throw new Error('Too many dots for this grid size');
      dots.push({ x: (i % cols) + 1, y: Math.floor(i / cols) + 1 });
      i++;
    }
    if (!dots.length) throw new Error('The puzzle code contains no dots');
    return { W, H, dots };
  }

  /* ------------------------------------------------------------------ */
  /*  Board analysis (used by the UI)                                     */
  /* ------------------------------------------------------------------ */

  /** The two cells an edge separates, or [c, -1] for an edge on the border. */
  function edgeCells(p, e) {
    const c = e >> 1, x = c % p.W, y = (c / p.W) | 0;
    if (e & 1) return [c, y + 1 < p.H ? c + p.W : -1];
    return [c, x + 1 < p.W ? c + 1 : -1];
  }

  /**
   * Partition the board by the player's walls plus the boundaries between
   * differently painted cells, then judge every region.
   * Returns per-cell region ids, per-region validity, the dot each valid
   * region belongs to, walls that sit inside a region, dots that are cut by
   * a wall, and whether the whole board is solved.
   */
  function analyze(p, owner, walls) {
    const { W, H, N, G } = p;
    const parent = new Int32Array(N);
    for (let i = 0; i < N; i++) parent[i] = i;
    const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
    const union = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[a] = b; };
    const blocked = (a, b, e) => walls.has(e) || (owner[a] >= 0 && owner[b] >= 0 && owner[a] !== owner[b]);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = y * W + x;
      if (x + 1 < W && !blocked(c, c + 1, 2 * c)) union(c, c + 1);
      if (y + 1 < H && !blocked(c, c + W, 2 * c + 1)) union(c, c + W);
    }
    const regionOf = new Int32Array(N);
    const roots = new Map();
    const members = [];
    for (let c = 0; c < N; c++) {
      const r = find(c);
      let id = roots.get(r);
      if (id === undefined) { id = members.length; roots.set(r, id); members.push([]); }
      regionOf[c] = id; members[id].push(c);
    }
    const R = members.length;
    const valid = new Uint8Array(R).fill(1);
    const regionDot = new Int32Array(R).fill(-1);
    const dotsIn = Array.from({ length: R }, () => []);
    const cutDots = new Uint8Array(G);
    for (let g = 0; g < G; g++) {
      const cs = p.cores[g];
      const r0 = regionOf[cs[0]];
      let whole = true;
      for (const c of cs) if (regionOf[c] !== r0) { whole = false; break; }
      if (whole) dotsIn[r0].push(g);
      else { cutDots[g] = 1; for (const c of cs) valid[regionOf[c]] = 0; }
    }
    for (let r = 0; r < R; r++) {
      if (!valid[r]) continue;
      if (dotsIn[r].length !== 1) { valid[r] = 0; continue; }
      const g = dotsIn[r][0];
      for (const c of members[r]) {
        const m = p.mirror[g * N + c];
        if (m < 0 || regionOf[m] !== r) { valid[r] = 0; break; }
        if (owner[c] >= 0 && owner[c] !== g) { valid[r] = 0; break; }
      }
      if (valid[r]) regionDot[r] = g;
    }
    // A wall with the same region on both sides separates nothing. While the
    // board is still open that is just an unfinished line, but inside an
    // otherwise finished galaxy it is a stray line the player should remove.
    const innerWalls = new Set();
    for (const e of walls) {
      const [a, b] = edgeCells(p, e);
      if (b >= 0 && regionOf[a] === regionOf[b] && valid[regionOf[a]]) { innerWalls.add(e); valid[regionOf[a]] = 0; }
    }
    let solved = true, settled = 0;
    for (let r = 0; r < R; r++) { if (!valid[r]) solved = false; else settled++; }
    return { regionOf, regionCount: R, valid, regionDot, innerWalls, cutDots, solved, settled };
  }

  /** Cells and walls that contradict the known solution. */
  function findMistakes(p, solution, owner, walls) {
    const cells = new Set(), badWalls = new Set();
    for (let c = 0; c < p.N; c++) if (owner[c] >= 0 && owner[c] !== solution[c]) cells.add(c);
    for (const e of walls) { const [a, b] = edgeCells(p, e); if (b >= 0 && solution[a] === solution[b]) badWalls.add(e); }
    return { cells, walls: badWalls };
  }

  /** Walls of the solved position (edges between different galaxies). */
  function solutionWalls(p, solution) {
    const { W, H } = p, out = new Set();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = y * W + x;
      if (x + 1 < W && solution[c] !== solution[c + 1]) out.add(2 * c);
      if (y + 1 < H && solution[c] !== solution[c + W]) out.add(2 * c + 1);
    }
    return out;
  }

  /* ------------------------------------------------------------------ */
  /*  Hints                                                               */
  /* ------------------------------------------------------------------ */
  /*  Finds one next step that follows from the puzzle plus the player's
   *  (correct) paint.  Kinds:
   *    wrongCell / wrongWall  - something already placed is wrong
   *    core                   - a cell touching a dot belongs to it
   *    only                   - just one galaxy can contain this cell
   *    connect                - a galaxy must pass through here to reach a claimed cell
   *    contradiction          - assuming another galaxy leads to a dead end
   *    reveal                 - no simple deduction; a cell from the solution
   */
  function findHint(p, solution, owner, walls) {
    const { N, G } = p;
    const mist = findMistakes(p, solution, owner, walls);
    if (mist.cells.size) return { kind: 'wrongCell', cell: mist.cells.values().next().value };
    if (mist.walls.size) return { kind: 'wrongWall', edge: mist.walls.values().next().value };
    for (let g = 0; g < G; g++) for (const c of p.cores[g]) if (owner[c] < 0) return { kind: 'core', cell: c, galaxy: g };

    const s = initialState(p);
    for (let c = 0; c < N && !s.dead; c++) if (owner[c] >= 0 && s.owner[c] < 0) assign(s, c, owner[c]);
    if (s.dead) return null;
    // silent pruning: reachability only, no automatic assignments
    for (let iter = 0; iter < 50; iter++) {
      const before = s.ops;
      for (let g = 0; g < G; g++) if (s.dirty[g]) { s.dirty[g] = 0; pruneReach(s, g); }
      if (s.dead || s.ops === before) break;
    }
    if (s.dead) return null;
    s.queue.length = 0;

    // prefer cells next to the painted area so hints feel local
    const near = (c) => {
      const x = c % p.W, y = (c / p.W) | 0;
      return (x > 0 && owner[c - 1] >= 0) || (x < p.W - 1 && owner[c + 1] >= 0) || (y > 0 && owner[c - p.W] >= 0) || (y < p.H - 1 && owner[c + p.W] >= 0);
    };
    let pickOnly = -1;
    for (let c = 0; c < N; c++) {
      if (s.owner[c] >= 0 || s.nCand[c] !== 1) continue;
      if (pickOnly < 0 || (near(c) && !near(pickOnly))) pickOnly = c;
    }
    if (pickOnly >= 0) {
      let g = -1; for (let h = 0; h < G; h++) if (s.cand[pickOnly * G + h]) { g = h; break; }
      return { kind: 'only', cell: pickOnly, galaxy: g, mirror: p.mirror[g * N + pickOnly] };
    }
    for (let g = 0; g < G; g++) {
      const f = forceConnection(s, g, false);
      if (f) return { kind: 'connect', cell: f.cell, galaxy: g, target: f.target, mirror: p.mirror[g * N + f.cell] };
    }
    const t = s.clone();
    const h = {};
    if (hypotheticals(t, h) && !t.dead && h.galaxy >= 0)
      return { kind: 'contradiction', cell: h.cell, galaxy: h.galaxy, wrong: h.wrong, mirror: p.mirror[h.galaxy * N + h.cell] };
    let pick = -1;
    for (let c = 0; c < N; c++) if (owner[c] < 0 && near(c)) { pick = c; break; }
    if (pick < 0) for (let c = 0; c < N; c++) if (owner[c] < 0) { pick = c; break; }
    if (pick < 0) return null;
    return { kind: 'reveal', cell: pick, galaxy: solution[pick], mirror: p.mirror[solution[pick] * N + pick] };
  }

  /* ------------------------------------------------------------------ */
  /*  Colours: galaxies whose dots are near each other get different hues */
  /* ------------------------------------------------------------------ */

  function assignColors(p, paletteSize) {
    const G = p.G, K = Math.max(2, paletteSize);
    const color = new Int16Array(G).fill(-1);
    const nbrs = [];
    for (let g = 0; g < G; g++) {
      const d = [];
      for (let h = 0; h < G; h++) if (h !== g) {
        const dx = p.dots[g].x - p.dots[h].x, dy = p.dots[g].y - p.dots[h].y;
        d.push({ h, d2: dx * dx + dy * dy });
      }
      d.sort((a, b) => a.d2 - b.d2);
      nbrs.push(d.slice(0, Math.min(d.length, K - 1)).map(o => o.h));
    }
    const order = [];
    for (let g = 0; g < G; g++) order.push(g);
    order.sort((a, b) => (p.dots[a].y - p.dots[b].y) || (p.dots[a].x - p.dots[b].x));
    for (const g of order) {
      const used = new Set();
      for (const h of nbrs[g]) if (color[h] >= 0) used.add(color[h]);
      for (const h of order) if (color[h] >= 0 && nbrs[h].includes(g)) used.add(color[h]);
      let pick = -1;
      for (let k = 0; k < K; k++) { const kk = (k + g) % K; if (!used.has(kk)) { pick = kk; break; } }
      if (pick < 0) pick = g % K;
      color[g] = pick;
    }
    return color;
  }

  return {
    DIFFICULTIES, GEN_PARAMS,
    makeRng, randomSeed,
    makePuzzle, coreCells,
    solve, rate, validateSolution,
    generate,
    encodeId, decodeId,
    analyze, findMistakes, solutionWalls, findHint, assignColors, edgeCells
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = GalaxiesCore;
