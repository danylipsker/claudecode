/*  Writes the built-in level sets into sokoban.html.
 *
 *    node tools/embed-levels.js
 *
 *  The game is one page that has to play with no connection, so the sets that
 *  are small enough travel inside it:
 *
 *    set-microban   niveles.txt as it is (Microban, David W. Skinner)
 *    set-hard       boxoban-levels-master/hard, packed and in base64
 *
 *  Packing: a boxoban level is a walled 10x10 board, so only its 64 inner
 *  cells are stored, three to a byte in base 5 over the glyphs " #$.@":
 *  22 bytes a level. unpackLevels() in sokoban.html is the other half, and
 *  this tool unpacks what it packed to make sure the two agree.
 *
 *  The boxoban dataset is not in the repository (171 MB, see .gitignore);
 *  get it from https://github.com/google-deepmind/boxoban-levels and unzip it
 *  beside sokoban.html before running this.
 */
const fs = require('fs');
const path = require('path');

const here = path.join(__dirname, '..');
const page = path.join(here, 'sokoban.html');
const GLYPHS = ' #$.@';
const PACKED = 22;
const EDGE = '##########';

function readLevels(file) {
  const levels = [];
  let rows = [];
  const flush = () => { if (rows.length) levels.push(rows); rows = []; };
  for (const raw of fs.readFileSync(file, 'latin1').split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    if (/^[ #.$*@+]+$/.test(line) && line.includes('#')) rows.push(line);
    else flush();
  }
  flush();
  return levels;
}

function pack(levels) {
  const out = Buffer.alloc(levels.length * PACKED);
  levels.forEach((rows, n) => {
    const walled = rows.length === 10 && rows[0] === EDGE && rows[9] === EDGE &&
      rows.every((r) => r.length === 10 && r[0] === '#' && r[9] === '#');
    if (!walled) throw new Error(`level ${n} is not a walled 10x10 board`);
    const cells = rows.slice(1, 9).map((r) => r.slice(1, 9)).join('');
    for (let i = 0; i < 64; i += 3) {
      let b = 0;
      for (let j = Math.min(2, 63 - i); j >= 0; j--) {
        const g = GLYPHS.indexOf(cells[i + j]);
        if (g < 0) throw new Error(`level ${n} holds the glyph "${cells[i + j]}"`);
        b = b * 5 + g;
      }
      out[n * PACKED + i / 3] = b;
    }
  });
  return out;
}

function unpack(bytes) {
  const levels = [];
  for (let at = 0; at + PACKED <= bytes.length; at += PACKED) {
    let cells = '';
    for (let i = 0; i < PACKED; i++) {
      let b = bytes[at + i];
      for (let j = 0; j < 3; j++) { cells += GLYPHS[b % 5]; b = Math.floor(b / 5); }
    }
    const rows = [EDGE];
    for (let y = 0; y < 8; y++) rows.push('#' + cells.substr(y * 8, 8) + '#');
    rows.push(EDGE);
    levels.push(rows);
  }
  return levels;
}

function embed(html, id, body) {
  const block = new RegExp(`(<script type="text/plain" id="${id}">)[\\s\\S]*?(</script>)`);
  if (!block.test(html)) throw new Error(`sokoban.html has no block "${id}"`);
  if (/<\/script|<!--/i.test(body)) throw new Error(`the ${id} data would end its own block`);
  return html.replace(block, (all, open, close) => `${open}\n${body}\n${close}`);
}

// Microban, as the text it is.
const microbanText = fs.readFileSync(path.join(here, 'niveles.txt'), 'latin1')
  .split(/\r?\n/).map((l) => l.replace(/\s+$/, '')).join('\n').trim();
const microban = readLevels(path.join(here, 'niveles.txt'));

// Boxoban hard, every file in order.
const hardDir = path.join(here, 'boxoban-levels-master', 'hard');
if (!fs.existsSync(hardDir)) {
  console.error(`Missing ${hardDir}\nUnzip the boxoban dataset beside sokoban.html first.`);
  process.exit(1);
}
const hard = [];
for (const f of fs.readdirSync(hardDir).filter((n) => /^\d+\.txt$/.test(n)).sort()) {
  hard.push(...readLevels(path.join(hardDir, f)));
}
const packed = pack(hard);
const back = unpack(packed);
if (back.length !== hard.length || back.some((rows, n) => rows.join('\n') !== hard[n].join('\n'))) {
  throw new Error('the packed hard set does not unpack to what went in');
}
const base64 = packed.toString('base64').replace(/(.{100})/g, '$1\n').trim();

let html = fs.readFileSync(page, 'utf8');
const crlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');
html = embed(html, 'set-microban', microbanText);
html = embed(html, 'set-hard', base64);
if (crlf) html = html.replace(/\n/g, '\r\n');
fs.writeFileSync(page, html);

console.log(`Microban   ${microban.length} levels, ${microbanText.length} characters`);
console.log(`Hard       ${hard.length} levels, ${packed.length} bytes packed, ${base64.length} characters`);
console.log(`sokoban.html is now ${fs.statSync(page).size} bytes`);
