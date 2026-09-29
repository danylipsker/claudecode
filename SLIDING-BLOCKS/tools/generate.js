/*  Writes the puzzle library, puzzles.js.
 *
 *    node tools/generate.js           sample for 12 minutes on every core, then build
 *    node tools/generate.js 30        sample for 30 minutes, then build
 *    node tools/generate.js build     build from the samples kept before
 *
 *  Sampling draws random boards of every family and keeps what the solver
 *  says about them (tools/families.js). The candidates pile up in
 *  tools/cache/ (not in git), so sampling again only adds to them.
 *
 *  Building picks, for each family, puzzles along a rising ramp of par (the
 *  fewest moves), from a single move up to the hardest found, then deals the
 *  families together by their place on their ramps: puzzle 1 is the easiest
 *  of all, the last the hardest, and every stretch has all four kinds.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const F = require('./families.js');

const CACHE = path.join(__dirname, 'cache');
const OUT = path.join(__dirname, '..', 'puzzles.js');

// How many puzzles each family gets, and the most positions a puzzle may
// have: the page searches them all for a hint, so they must stay small.
const QUOTA = { G: 340, K: 330, R: 300, O: 280 };
const MAX_SIZE = 250000;

/* ---------- workers ---------- */

if (!isMainThread) {
  const { job, seed, until } = workerData;
  const r = F.rng(seed);
  let batch = [];
  const emit = (c) => {
    if (!c) return;
    if (Array.isArray(c)) { c.forEach(emit); return; }
    batch.push(c);
    if (batch.length >= 20) { parentPort.postMessage(batch); batch = []; }
  };
  while (Date.now() < until) {
    try {
      if (job === 'G') {
        if (r() < 0.25) emit(F.sampleGridlock(r));
        else {
          const board = r() < 0.12 ? F.GRIDLOCK_BOARDS[2] : r() < 0.1 ? F.GRIDLOCK_BOARDS[0] : F.GRIDLOCK_BOARDS[1];
          F.evolveGridlock(r, board, 600, emit);
        }
      } else if (job === 'K') emit(F.sampleKlotski(r));
      else if (job === 'R') emit(F.sampleRelease(r));
      else if (job === 'N') emit(F.sampleNumbers(r));
      else if (job === 'S') emit(F.sampleSort(r));
      else if (job === 'W') emit(F.sampleSwap(r));
    } catch (e) {
      parentPort.postMessage({ error: String(e && e.stack || e) });
    }
  }
  if (batch.length) parentPort.postMessage(batch);
  return;
}

/* ---------- sampling ---------- */

function loadCache() {
  const all = new Map();
  if (!fs.existsSync(CACHE)) return all;
  for (const f of fs.readdirSync(CACHE)) {
    if (!f.endsWith('.jsonl')) continue;
    for (const ln of fs.readFileSync(path.join(CACHE, f), 'utf8').split('\n')) {
      if (!ln.trim()) continue;
      try {
        const c = JSON.parse(ln);
        all.set(c.line, c);
      } catch (e) { /* a torn last line from an interrupted run */ }
    }
  }
  return all;
}

function sample(minutes) {
  fs.mkdirSync(CACHE, { recursive: true });
  const seen = loadCache();
  const cores = Math.max(2, os.cpus().length - 1);
  // Shares of the cores: Gridlock needs the most search to find hard boards.
  const shares = [['G', 9], ['K', 9], ['R', 5], ['N', 2], ['S', 4], ['W', 2]];
  const total = shares.reduce((s, x) => s + x[1], 0);
  const jobs = [];
  for (const [job, w] of shares) {
    const n = Math.max(1, Math.round(cores * w / total));
    for (let i = 0; i < n; i++) jobs.push(job);
  }
  const until = Date.now() + minutes * 60000;
  const files = {};
  const counts = {};
  const t0 = Date.now();
  let fresh = 0;
  console.log(`sampling on ${jobs.length} threads for ${minutes} min (${seen.size} candidates kept already)`);

  return new Promise((resolve) => {
    let live = jobs.length;
    jobs.forEach((job, i) => {
      const w = new Worker(__filename, { workerData: { job, seed: (Date.now() ^ (i * 7919)) >>> 0, until } });
      w.on('message', (msg) => {
        if (msg.error) { console.error(job, msg.error); return; }
        for (const c of msg) {
          if (seen.has(c.line)) continue;
          seen.set(c.line, c);
          fresh++;
          const f = files[c.fam] || (files[c.fam] = fs.openSync(path.join(CACHE, c.fam + '.jsonl'), 'a'));
          fs.writeSync(f, JSON.stringify(c) + '\n');
          const key = job + ' ' + c.kind;
          counts[key] = counts[key] || { n: 0, max: 0 };
          counts[key].n++;
          counts[key].max = Math.max(counts[key].max, c.par);
        }
      });
      w.on('exit', () => {
        if (--live) return;
        clearInterval(timer);
        for (const f of Object.values(files)) fs.closeSync(f);
        report();
        resolve();
      });
      w.on('error', (e) => console.error(job, e));
    });
    const report = () => {
      const s = Object.entries(counts).sort().map(([k, v]) => `${k}:${v.n}/max ${v.max}`).join('  ');
      console.log(`${Math.round((Date.now() - t0) / 1000)}s new ${fresh}  ${s}`);
    };
    const timer = setInterval(report, 60000);
  });
}

/* ---------- building ---------- */

// How each family's ramp rises: the par below which only a couple of
// teaching puzzles are taken, the most any puzzle may need (past about a
// hundred and fifty moves a puzzle is a chore, not a challenge), and the
// curve (above 1: more of the easier ones).
const RAMP = {
  G: { min: 3, max: 99, bend: 1.2 },
  K: { min: 4, max: 150, bend: 1.6 },
  R: { min: 3, max: 120, bend: 1.6 },
  O: { min: 3, max: 70, bend: 1.2 }
};

// Picks n puzzles from a pool along a ramp of par, from the easiest to the
// hardest in the pool: two quick teaching puzzles first, then from `min` up.
function ramp(pool, n, r, fam) {
  const shape = RAMP[fam] || { min: 1, bend: 1.2 };
  const easy = pool.filter((c) => c.par < shape.min).sort((a, b) => a.par - b.par || a.size - b.size);
  const teach = [];
  for (const c of easy) {
    if (teach.length >= 2) break;
    if (!teach.some((t) => t.par === c.par)) teach.push(c);
  }
  pool = pool.filter((c) => c.par >= shape.min && c.par <= (shape.max || Infinity));
  n -= teach.length;
  const byPar = new Map();
  for (const c of pool) {
    if (!byPar.has(c.par)) byPar.set(c.par, []);
    byPar.get(c.par).push(c);
  }
  for (const list of byPar.values()) list.sort(() => r() - 0.5);
  const pars = [...byPar.keys()].sort((a, b) => a - b);
  const lo = pars[0], hi = pars[pars.length - 1];
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = lo + (hi - lo) * Math.pow(i / Math.max(1, n - 1), shape.bend);
    // The nearest par that still has puzzles left; ties go to the harder.
    let best = null;
    for (const p of pars) {
      if (!byPar.get(p).length) continue;
      if (best === null || Math.abs(p - t) < Math.abs(best - t) || (Math.abs(p - t) === Math.abs(best - t) && p > best)) best = p;
    }
    if (best === null) break;
    out.push(byPar.get(best).pop());
  }
  return teach.concat(out.sort((a, b) => a.par - b.par || a.size - b.size));
}

// Order mixes several kinds of tray: each gets its share of the quota.
function orderPool(pool, n, r) {
  const kinds = {
    numbers: pool.filter((c) => c.kind[0] === 'n'),
    sort: pool.filter((c) => c.kind[0] === 'c'),
    swap: pool.filter((c) => c.kind[0] === 's'),
    // stepped wells and Panex columns: the Towers of Hanoi kind
    towers: pool.filter((c) => c.kind[0] === 't' || c.kind[0] === 'p')
  };
  const want = { towers: Math.min(kinds.towers.length, 40), swap: Math.min(kinds.swap.length, 45) };
  want.numbers = Math.round((n - want.towers - want.swap) * 0.5);
  want.sort = n - want.towers - want.swap - want.numbers;
  let out = [];
  for (const k of Object.keys(kinds)) out = out.concat(ramp(kinds[k], want[k], r, 'O'));
  return out.sort((a, b) => a.par - b.par || a.size - b.size);
}

// Named puzzles from the literature. The builder solves each again and
// stops if the count differs from the published one.
const CLASSICS = [
  // J. H. Fleming, 1932, after much older Klotski: 81 moves.
  { fam: 'K', kind: 'k45', line: "K|L'Âne Rouge|BAAC/BAAC/DEEF/DGHF/I..J|A@1,3|81|x:b1", par: 81 },
  // One of the two farthest positions of the eight puzzle: 31 moves.
  { fam: 'O', kind: 'n33', line: 'O|The Farthest Eight|867/254/3.1|123/456/78?|31|n', par: 31 }
];

function verifyClassics() {
  for (const c of CLASSICS) {
    const puz = F.SB.parse(c.line);
    const model = F.SB.Model(puz);
    const res = F.SB.solve(model, F.startOf(model));
    if (!res || res.dist !== c.par) throw new Error(`${puz.name}: the solver finds ${res && res.dist}, not ${c.par}`);
    c.size = res.explored;
  }
}

function build() {
  verifyClassics();
  const r = F.rng(20260929);
  const all = [...loadCache().values()];
  for (const t of F.towerPuzzles()) all.push(t);
  for (const t of F.towerSpread(r)) all.push(t);
  for (const t of F.panexPuzzles(r)) all.push(t);
  // Two draws that reach the same set of positions give the same puzzle
  // (or its mirror image): alike size and par give that away. Numbered trays
  // are exempt, since all their puzzles share one set of positions.
  const seen = new Set();
  const usable = all.filter((c) => {
    if (c.size > MAX_SIZE || c.par < 1) return false;
    if (c.kind[0] === 'n' || c.kind[0] === 't') return true;
    const sig = c.fam + c.kind + ':' + c.size + ':' + c.par;
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
  const byFam = { G: [], K: [], R: [], O: [] };
  for (const c of usable) byFam[c.fam].push(c);

  const lists = {};
  for (const fam of Object.keys(byFam)) {
    let pool = byFam[fam];
    const classics = CLASSICS.filter((c) => c.fam === fam);
    pool = pool.filter((c) => !classics.some((k) => k.line.split('|')[2] === c.line.split('|')[2]));
    let picked = fam === 'O' ? orderPool(pool, QUOTA[fam] - classics.length, r) : ramp(pool, QUOTA[fam] - classics.length, r, fam);
    picked = picked.concat(classics).sort((a, b) => a.par - b.par || a.size - b.size);
    lists[fam] = picked;
    const pars = picked.map((c) => c.par);
    console.log(`${fam}: ${picked.length} of ${pool.length}, par ${pars[0]}..${pars[pars.length - 1]}, median ${pars[pars.length >> 1]}`);
  }

  // Deal the families together by their place on their own ramps.
  const dealt = [];
  const famOrder = ['G', 'K', 'R', 'O'];
  for (const fam of famOrder) {
    lists[fam].forEach((c, i) => dealt.push({ c, at: (i + 0.5) / lists[fam].length + famOrder.indexOf(fam) * 1e-6 }));
  }
  dealt.sort((a, b) => a.at - b.at);

  const lines = dealt.map((d) => d.c.line);
  const head = `/* Sliding Blocks · puzzles.js — written by tools/generate.js, do not edit.
 * ${lines.length} puzzles, easiest first. Each line: family|name|board|goal|par|options
 * (the format is described at the top of sb-core.js). Every par is the
 * fewest moves, found by the solver; tools/check.js verifies them all.
 */
`;
  fs.writeFileSync(OUT, head + 'self.SB_PUZZLES = [\n' + lines.map((l) => JSON.stringify(l)).join(',\n') + '\n];\n');
  console.log(`wrote ${lines.length} puzzles to ${path.relative(process.cwd(), OUT)}`);
}

(async () => {
  const arg = process.argv[2];
  if (arg !== 'build') await sample(arg ? Number(arg) : 12);
  build();
})();
