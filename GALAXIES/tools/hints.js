/*  Hint-engine check:  node tools/hints.js [W H difficulty count]
 *
 *  For each puzzle, starts from an empty board and repeatedly asks for a hint,
 *  applying it, until the board is solved. Verifies that no hint ever names a
 *  cell that disagrees with the solution, counts how often the solver has to
 *  fall back to 'reveal' (no logical step found), and reports the mix of
 *  deduction types. Also checks that analyze() reports solved at the end.
 */
const core = require('../galaxies-core.js')();

function run(W, H, difficulty, count) {
  let ok = true;
  const kinds = {};
  for (let i = 0; i < count; i++) {
    const g = core.generate({ W, H, difficulty, seed: `hints-${W}x${H}-${difficulty}-${i}` });
    if (!g) { console.log(`  no puzzle for ${W}x${H} ${difficulty} #${i}`); ok = false; continue; }
    const p = core.makePuzzle(W, H, g.dots);
    const owner = new Int16Array(p.N).fill(-1);
    const walls = new Set();
    let steps = 0;
    while (steps++ < p.N * 3) {
      const a = core.analyze(p, owner, walls);
      if (a.solved) break;
      const h = core.findHint(p, g.solution, owner, walls);
      if (!h) { console.log(`  ${W}x${H} ${difficulty} #${i}: hint engine gave up with ${owner.filter(v => v < 0).length} cells left`); ok = false; break; }
      kinds[h.kind] = (kinds[h.kind] || 0) + 1;
      if (h.galaxy == null || h.galaxy < 0 || h.cell == null || h.cell < 0) { console.log(`  ${W}x${H} #${i}: unusable hint ${JSON.stringify(h)}`); ok = false; break; }
      if (g.solution[h.cell] !== h.galaxy) { console.log(`  ${W}x${H} #${i}: WRONG hint ${h.kind} cell ${h.cell} -> ${h.galaxy}, solution says ${g.solution[h.cell]}`); ok = false; break; }
      owner[h.cell] = h.galaxy;
      const m = p.mirror[h.galaxy * p.N + h.cell];
      if (m >= 0) owner[m] = h.galaxy;
    }
    const a = core.analyze(p, owner, walls);
    if (!a.solved) { console.log(`  ${W}x${H} ${difficulty} #${i}: hints did not finish the board`); ok = false; }
  }
  console.log(`${W}x${H} ${difficulty.padEnd(12)} hints ${ok ? 'OK ' : 'FAIL'} ${JSON.stringify(kinds)}`);
  return ok;
}

const args = process.argv.slice(2);
let ok = true;
if (args.length >= 3) ok = run(+args[0], +args[1], args[2], +(args[3] || 3));
else for (const d of core.DIFFICULTIES) { ok = run(7, 7, d, 3) && ok; ok = run(12, 12, d, 2) && ok; }
console.log(ok ? 'ALL OK' : 'FAILURES');
process.exit(ok ? 0 : 1);
