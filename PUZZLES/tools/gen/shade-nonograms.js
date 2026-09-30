/* The Puzzle Cabinet · tools/gen/shade-nonograms.js
 *
 * Called by tools/gen/shade.js: writes data/nonograms.js from
 *   - the drawn pictures in tools/gen/shade-pictures.js
 *   - capital letters and three-letter words in a 5 × 5 font
 *   - geometric pictures drawn with circles and lines (a target, a smiley,
 *     square spirals)
 *   - symmetric inkblots (random noise, smoothed and mirrored)
 * A picture is kept only if line logic alone solves its clues (then it is the
 * one solution). Drawn pictures that fall short get up to three pixels
 * changed (the flips that settle the most cells); letters and words are kept
 * only as drawn.
 */
'use strict';
const PICS = require('./shade-pictures.js');

/* ---------- the 5 × 5 font ---------- */

const FONT = {
  A: '.###.|#...#|#####|#...#|#...#', B: '####.|#...#|####.|#...#|####.', C: '.####|#....|#....|#....|.####',
  D: '####.|#...#|#...#|#...#|####.', E: '#####|#....|####.|#....|#####', F: '#####|#....|####.|#....|#....',
  G: '.####|#....|#..##|#...#|.###.', H: '#...#|#...#|#####|#...#|#...#', I: '#####|..#..|..#..|..#..|#####',
  J: '..###|...#.|...#.|#..#.|.##..', K: '#...#|#..#.|###..|#..#.|#...#', L: '#....|#....|#....|#....|#####',
  M: '#...#|##.##|#.#.#|#...#|#...#', N: '#...#|##..#|#.#.#|#..##|#...#', O: '.###.|#...#|#...#|#...#|.###.',
  P: '####.|#...#|####.|#....|#....', Q: '.###.|#...#|#.#.#|#..#.|.##.#', R: '####.|#...#|####.|#..#.|#...#',
  S: '.####|#....|.###.|....#|####.', T: '#####|..#..|..#..|..#..|..#..', U: '#...#|#...#|#...#|#...#|.###.',
  V: '#...#|#...#|#...#|.#.#.|..#..', W: '#...#|#...#|#.#.#|##.##|#...#', X: '#...#|.#.#.|..#..|.#.#.|#...#',
  Y: '#...#|.#.#.|..#..|..#..|..#..', Z: '#####|...#.|..#..|.#...|#####'
};
function word(txt, color) {
  const rows = ['', '', '', '', ''];
  txt.split('').forEach((ch, k) => {
    const g = FONT[ch].split('|');
    for (let r = 0; r < 5; r++) rows[r] += (k ? '.' : '') + g[r].replace(/#/g, color);
  });
  return rows;
}

/* ---------- drawing with circles and lines ---------- */

function canvas(w, h) { return Array.from({ length: h }, () => new Array(w).fill('.')); }
const rowsOf = (cv) => cv.map((r) => r.join(''));
function paint(cv, fn) { for (let y = 0; y < cv.length; y++) for (let x = 0; x < cv[0].length; x++) { const c = fn(x + 0.5, y + 0.5); if (c) cv[y][x] = c; } }
function disc(cv, cx, cy, r, ch) { paint(cv, (x, y) => ((x - cx) ** 2 + (y - cy) ** 2 <= r * r ? ch : null)); }
function ring(cv, cx, cy, r0, r1, ch) { paint(cv, (x, y) => { const d = Math.hypot(x - cx, y - cy); return d >= r0 && d <= r1 ? ch : null; }); }
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function line(cv, ax, ay, bx, by, ch, th) { paint(cv, (x, y) => (segDist(x, y, ax, ay, bx, by) <= (th || 0.5) ? ch : null)); }

function geometric() {
  const out = [];
  let cv;
  // a target
  cv = canvas(15, 15);
  disc(cv, 7.5, 7.5, 7.5, 'R'); disc(cv, 7.5, 7.5, 6, '.'); disc(cv, 7.5, 7.5, 4.6, 'R'); disc(cv, 7.5, 7.5, 3.1, '.'); disc(cv, 7.5, 7.5, 1.6, 'R');
  out.push({ name: 'a target', title: 'Dead Centre', art: rowsOf(cv) });
  // a smiley
  cv = canvas(15, 15);
  disc(cv, 7.5, 7.5, 7.5, 'Y');
  disc(cv, 5, 5.5, 1.2, '.'); disc(cv, 10, 5.5, 1.2, '.');
  paint(cv, (x, y) => { const d = Math.hypot(x - 7.5, y - 7.5); return d >= 3.4 && d <= 4.6 && y > 8.6 ? '.' : null; });
  out.push({ name: 'a smiling face', title: 'Have a Nice Day', art: rowsOf(cv) });
  // square spirals
  for (const n of [15, 20]) {
    cv = canvas(n, n);
    let x = 0, y = 0, dx = 1, dy = 0, len = n, turn = 0;
    const put = (a, b) => { cv[b][a] = 'C'; };
    let steps = 0;
    while (len > 0 && steps < 1000) {
      for (let k = 0; k < len; k++) { put(x, y); if (k < len - 1) { x += dx; y += dy; } }
      [dx, dy] = [-dy, dx];
      x += dx; y += dy;
      turn++;
      if (turn >= 2 && turn % 2 === 0) len -= 2;
      else if (turn === 1) len -= 1;
      steps++;
    }
    out.push({ name: 'a spiral', title: n === 15 ? 'Round and Round' : 'The Long Way Round', art: rowsOf(cv) });
  }
  return out;
}

function inkblots(C, L) {
  const out = [];
  const colours = [['B', 'U'], ['V', 'U'], ['R', 'M'], ['G', 'D'], ['O', 'N'], ['C', 'U'], ['P', 'V'], ['A', 'K'], ['L', 'B'], ['I', 'M'], ['F', 'D'], ['T', 'N']];
  const sizes = [[10, 10], [10, 10], [12, 12], [15, 15], [15, 15], [15, 12], [16, 20], [18, 18], [20, 15], [20, 20], [20, 20], [20, 20], [20, 18], [20, 20]];
  const rng = C.rng(20260930 + 41);
  sizes.forEach(([w, h], k) => {
    for (let t = 0; t < 40; t++) {
      const bits = L.nonoBlot(w, h, rng, 0.52);
      let filled = 0;
      for (const b of bits) filled += b;
      if (filled < w * h * 0.35 || filled > w * h * 0.7) continue;
      const [edge, inner] = colours[k % colours.length];
      out.push({ name: 'an inkblot (what do you see in it?)', title: 'Inkblot No. ' + (k + 1), art: L.nonoPaint(bits, w, h, edge, inner), maxFlips: 10, blot: true });
      break;
    }
  });
  return out;
}

/* ---------- making the puzzles ---------- */

function run({ C, L, writeFamily, pad3 }) {
  const cands = [];
  PICS.forEach((p) => cands.push(Object.assign({ maxFlips: p.art[0].length >= 15 || p.art.length >= 15 ? 4 : 3 }, p)));
  const LETTER_TITLES = ['Capital Idea', 'Block Letter', 'Upper Case', 'Typeface', 'Mind Your Serifs', 'Alphabet Soup', 'Letterhead', 'Monogram', 'Initial Thoughts', 'Big Print'];
  let lt = 0;
  'AEHKMNRSWXZ'.split('').forEach((ch) => {
    cands.push({ name: 'the letter ' + ch, title: LETTER_TITLES[lt++] || 'Letter ' + ch, art: word(ch, 'K'), maxFlips: 0, letter: true });
  });
  const WORD_TITLES = ['In a Word', 'Spell It Out', 'Short Story', 'Brief Message', 'Three of a Kind', 'Word Up', 'Headline'];
  let wt = 0;
  ['ZEN', 'ELF', 'FEZ', 'HEN', 'THE', 'NET', 'LET', 'ZED', 'TEN', 'HUT', 'EEL', 'MEN', 'HEM', 'ZIP', 'ELM', 'FIN', 'LID'].forEach((wd, k) => {
    cands.push({ name: 'the word “' + wd + '”', title: WORD_TITLES[wt] || 'Word ' + (k + 1), art: word(wd, ['B', 'V', 'O', 'D', 'R', 'U', 'L', 'M', 'G', 'N', 'C', 'I'][k % 12]), maxFlips: 0, word: true });
  });
  geometric().forEach((p) => cands.push(Object.assign({ maxFlips: 3 }, p)));
  inkblots(C, L).forEach((p) => cands.push(p));

  const kept = [], dropped = [];
  let letters = 0, words = 0;
  for (const cd of cands) {
    const h = cd.art.length, w = cd.art[0].length;
    if (cd.art.some((r) => r.length !== w)) { dropped.push(cd.name + ': rows of different lengths'); continue; }
    if (w < 5 || h < 5 || w > 20 || h > 20) { dropped.push(cd.name + ': size ' + w + '×' + h); continue; }
    if (cd.letter && letters >= 6) continue;
    if (cd.word && words >= 5) continue;
    const bits = Uint8Array.from(cd.art.join('').split(''), (ch) => (ch === '.' ? 0 : 1));
    const fix = L.nonoFix(bits, w, h, cd.maxFlips);
    if (!fix) { dropped.push(cd.name + ' (' + w + '×' + h + '): line logic cannot finish it'); continue; }
    let art = cd.art;
    if (fix.flips.length) {
      const g = art.map((r) => r.split(''));
      fix.flips.forEach((i) => {
        const r = Math.floor(i / w), c = i % w;
        if (g[r][c] !== '.') { g[r][c] = '.'; return; }
        const near = {};
        [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([rr, cc]) => { if (rr >= 0 && rr < h && cc >= 0 && cc < w && g[rr][cc] !== '.') near[g[rr][cc]] = (near[g[rr][cc]] || 0) + 1; });
        g[r][c] = Object.keys(near).sort((a, b) => near[b] - near[a])[0] || 'K';
      });
      art = g.map((r) => r.join(''));
      if (!cd.blot) console.log('  ' + cd.name + ': ' + fix.flips.length + ' pixel(s) changed\n    ' + art.join('\n    '));
    }
    if (cd.letter) letters++;
    if (cd.word) { words++; cd.title = WORD_TITLES[words - 1]; }
    const cl = L.nonoClues(art);
    const r = L.nonoEffort(w, h, cl.rows, cl.cols);
    if (!r) { dropped.push(cd.name + ': effort measure failed'); continue; }
    kept.push({ cd, art, w, h, cl, r, diff: L.nonoDiff(w, h, r) });
  }
  dropped.forEach((d) => console.log('  dropped: ' + d));
  kept.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.r.steps - b.r.steps);
  const titles = new Set();
  const puzzles = kept.map((k, i) => {
    let title = k.cd.title;
    while (titles.has(title)) title += ' (again)';
    titles.add(title);
    const d = { kind: 'nonogram', w: k.w, h: k.h, rows: k.cl.rows, cols: k.cl.cols, sol: k.art, name: k.cd.name };
    return {
      id: 'nonogram-' + pad3(i + 1),
      title,
      diff: k.diff,
      text: 'Shade cells so that every row and column shows its clue: the lengths of its runs of filled cells, in order. Something is hiding in this ' + k.w + '×' + k.h + ' grid.',
      explain: 'The picture: **' + k.cd.name + '**. ' + (k.cd.blot ? 'Mirror-symmetric blots like this one were used by the Swiss psychiatrist Hermann Rorschach in 1921; here a computer made it from random noise, smoothed and folded.' : 'Every clue was solved by line logic alone: no guessing is ever needed, and this is the only picture the clues allow.'),
      concepts: ['deduction'],
      tags: [k.w + 'x' + k.h, 'nonogram', 'griddler', 'paint by numbers'].concat(k.cd.blot ? ['inkblot'] : []),
      data: d
    };
  });
  // a closer look at the grading
  const stat = {};
  kept.forEach((k) => { const key = k.diff; (stat[key] = stat[key] || []).push(k.w + '×' + k.h + '/h' + k.r.hardest + '/' + k.r.heavy); });
  Object.keys(stat).forEach((d) => console.log('  diff ' + d + ': ' + stat[d].join(' ')));
  writeFamily('nonograms.js', {
    id: 'nonograms', engine: 'shade', cat: 'pencil', name: 'Nonograms', order: 20,
    blurb: 'Paint by numbers: the clues give the runs of filled cells in every row and column. Fill them in and a picture appears.',
    origin: { year: 1987, who: 'Non Ishida and Tetsuya Nishio, Japan', note: 'The graphic designer Non Ishida and the puzzle maker Tetsuya Nishio each came up with these picture grids in Japan in 1987; British newspapers ran them from 1990 as Griddlers and Nonograms.' },
    concepts: ['deduction']
  }, puzzles);
}

module.exports = { run, FONT, word };
