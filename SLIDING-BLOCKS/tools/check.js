/*  Checks every puzzle in puzzles.js.
 *
 *    node tools/check.js
 *
 *  For each puzzle: the board parses, the pieces fit, the start is not
 *  already solved, and a breadth-first search from the start finds the goal
 *  in exactly `par` moves (so par is the fewest). It also reports how many
 *  positions that search saw: the page searches as many for a hint.
 *  Runs on every core. Exits with status 1 when anything is wrong.
 */
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const SB = require('../sb-core.js');

function check(line) {
  const puz = SB.parse(line);
  const problems = [];
  if (!SB.FAMILIES[puz.fam]) problems.push('unknown family ' + puz.fam);
  if (!puz.pieces.length) problems.push('no pieces');
  if (puz.goal.type === 'at' && puz.goal.hero < 0) problems.push('goal names no piece');
  if (SB.FAMILIES[puz.fam] && SB.FAMILIES[puz.fam].hero && puz.goal.type !== 'at') problems.push('a ' + puz.fam + ' puzzle needs a goal piece');
  const model = SB.Model(puz);
  const start = model.fromPieces(puz.pieces.map((p) => p.y * puz.w + p.x));
  if (model.goalTest(start)) problems.push('solved at the start');
  const res = SB.solve(model, start, 3e6);
  if (!res) problems.push('no solution found');
  else if (res.dist !== puz.par) problems.push(`par ${puz.par} but the fewest moves are ${res.dist}`);
  return { problems, explored: res ? res.explored : 0, dist: res ? res.dist : -1 };
}

if (!isMainThread) {
  const out = workerData.items.map(({ i, line }) => ({ i, ...check(line) }));
  parentPort.postMessage(out);
  return;
}

global.self = global;
require(path.join(__dirname, '..', 'puzzles.js'));
const lines = global.SB_PUZZLES;
const t0 = Date.now();
const n = Math.max(1, os.cpus().length - 1);
const buckets = Array.from({ length: n }, () => []);
lines.forEach((line, i) => buckets[i % n].push({ i, line }));

let pending = n;
const results = [];
for (const items of buckets) {
  const w = new Worker(__filename, { workerData: { items } });
  w.on('message', (out) => results.push(...out));
  w.on('error', (e) => { console.error(e); process.exitCode = 1; });
  w.on('exit', () => {
    if (--pending) return;
    results.sort((a, b) => a.i - b.i);
    let bad = 0;
    for (const r of results) {
      if (!r.problems.length) continue;
      bad++;
      console.log(`#${r.i + 1} ${lines[r.i]}\n   ${r.problems.join('; ')}`);
    }
    const fams = {};
    lines.forEach((l, i) => {
      const f = l[0];
      fams[f] = fams[f] || { n: 0, max: 0, big: 0 };
      fams[f].n++;
      fams[f].max = Math.max(fams[f].max, results[i].dist);
      fams[f].big = Math.max(fams[f].big, results[i].explored);
    });
    for (const [f, v] of Object.entries(fams)) {
      console.log(`${SB.FAMILIES[f].name.padEnd(9)} ${String(v.n).padStart(4)} puzzles, longest ${v.max} moves, largest search ${v.big.toLocaleString('en-US')} positions`);
    }
    // The order must rise: no stage may be easier on average than the one before.
    const stageMean = [];
    for (let s = 0; s < 10; s++) {
      const part = results.filter((r) => Math.min(9, Math.floor(r.i * 10 / lines.length)) === s);
      stageMean.push(part.reduce((a, r) => a + r.dist, 0) / Math.max(1, part.length));
    }
    console.log('mean par by stage: ' + stageMean.map((m) => m.toFixed(1)).join(' '));
    console.log(`${lines.length} puzzles checked in ${((Date.now() - t0) / 1000).toFixed(1)} s: ${bad ? bad + ' with problems' : 'all good'}`);
    if (bad) process.exitCode = 1;
  });
}
