/*  Headless checks for the GALAXIES engine.
 *
 *    node tools/bench.js                 quick run (default sizes)
 *    node tools/bench.js 15 15 hard 5    W H difficulty count
 *
 *  For every generated puzzle it verifies that the stored solution is
 *  valid, that the solver finds exactly one solution, that the game ID
 *  round-trips, and reports timings and the achieved difficulty.
 */
const GalaxiesCore = require('../galaxies-core.js');
const core = GalaxiesCore();

function check(W, H, difficulty, count, seedBase) {
  const stats = { ok: 0, fail: 0, ratings: {}, ms: 0, maxMs: 0, attempts: 0, galaxies: 0 };
  for (let i = 0; i < count; i++) {
    const seed = `${seedBase}-${W}x${H}-${difficulty}-${i}`;
    const t0 = Date.now();
    const g = core.generate({ W, H, difficulty, seed });
    const ms = Date.now() - t0;
    if (!g) { stats.fail++; console.log(`  ${seed}: generation returned null`); continue; }
    const p = core.makePuzzle(W, H, g.dots);
    const valid = core.validateSolution(p, g.solution);
    const res = core.solve(p, { limit: 2 });
    const rt = core.decodeId(g.id);
    const idOk = rt.W === W && rt.H === H && rt.dots.length === g.dots.length &&
      rt.dots.every((d, k) => d.x === g.dots[k].x && d.y === g.dots[k].y);
    const same = res.solutions.length === 1 && res.solutions[0].every((v, k) => v === g.solution[k]);
    const good = valid && res.count === 1 && same && idOk;
    if (good) stats.ok++; else { stats.fail++; console.log(`  ${seed}: valid=${valid} count=${res.count} same=${same} idOk=${idOk}`); }
    stats.ratings[g.rating] = (stats.ratings[g.rating] || 0) + 1;
    stats.ms += ms; stats.maxMs = Math.max(stats.maxMs, ms); stats.attempts += g.attempts; stats.galaxies += g.dots.length;
  }
  const n = Math.max(1, count);
  console.log(`${W}x${H} ${difficulty.padEnd(12)} ok=${stats.ok}/${count} avg=${Math.round(stats.ms / n)}ms max=${stats.maxMs}ms ` +
    `attempts=${(stats.attempts / n).toFixed(1)} galaxies=${(stats.galaxies / n).toFixed(1)} ratings=${JSON.stringify(stats.ratings)}`);
  return stats.fail === 0;
}

function ratingDistribution(W, H, count) {
  // how often does plain growth land on each rating? (helps tune GEN_PARAMS)
  for (const d of core.DIFFICULTIES) {
    const dist = {};
    for (let i = 0; i < count; i++) {
      const g = core.generate({ W, H, difficulty: d, seed: `dist-${d}-${i}`, maxAttempts: 1 });
      if (!g) { dist.none = (dist.none || 0) + 1; continue; }
      dist[g.rating] = (dist[g.rating] || 0) + 1;
    }
    console.log(`  growth tuned for ${d.padEnd(12)} -> single-attempt ratings ${JSON.stringify(dist)}`);
  }
}

const args = process.argv.slice(2);
let allOk = true;
if (args.length >= 3) {
  const [W, H, d, n] = [+args[0], +args[1], args[2], +(args[3] || 5)];
  allOk = check(W, H, d, n, 'cli') && allOk;
} else {
  console.log('Rating distribution of raw growth (10x10):');
  ratingDistribution(10, 10, 20);
  console.log('Generation checks:');
  for (const [W, H] of [[7, 7], [10, 10], [15, 15]]) {
    for (const d of core.DIFFICULTIES) allOk = check(W, H, d, 4, 'bench') && allOk;
  }
}
console.log(allOk ? 'ALL OK' : 'FAILURES');
process.exit(allOk ? 0 : 1);
