/* Curves Workshop · tools/docs.js
 *
 * Writes the documentation in docs/: one Markdown page per section of the book with every
 * figure (the SVG from svg/), its construction steps and the section's text, plus
 * docs/README.md (the index) and docs/FIGURES.md (every figure with its page).
 * Run tools/build-svg.js first so the SVG files exist.
 *
 *   node tools/docs.js
 */
const fs = require('fs');
const path = require('path');
const C = require('./load')();
const ROOT = C.ROOT, OUT = path.join(ROOT, 'docs');
fs.mkdirSync(OUT, { recursive: true });

/* the small markdown of the sections -> GitHub markdown: keep $TeX$, turn [[links]] into links */
function md(s) {
  return String(s || '')
    .replace(/\[\[fig-([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, id, l) => { const f = C.figures.get('fig-' + id); return '[' + (l || (f ? f.caption : 'fig-' + id)) + '](' + (f ? f.section + '.md#' + anchor('fig-' + id) : '#') + ')'; })
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, id, l) => { const sec = C.manifest.sections.find(x => x.id === id); return '[' + (l || (sec ? sec.title : id)) + '](' + id + '.md)'; })
    .replace(/\[\[\?([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, id, l) => l || id);
}
const anchor = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

const built = new Set(fs.existsSync(path.join(ROOT, 'svg')) ? fs.readdirSync(path.join(ROOT, 'svg')).filter(f => f.endsWith('.svg')).map(f => f.replace(/\.svg$/, '')) : []);
let pages = 0, figsTotal = 0;
const index = ['# Curves Workshop — the book, section by section', '',
  'The figures of Robert C. Yates, *A Handbook on Curves and Their Properties* (1947), redrawn as step-by-step constructions. Each page below is one section of the book: its figures as SVG (the files are in [`../svg/`](../svg/)), the construction steps with the tool of each step, the equations and properties, and the bibliography. The same content is the app at [`../index.html`](../index.html).', '',
  '| Section | Pages | Figures | Group |', '|---|---|---|---|'];
const figIndex = ['# Every figure of the book', '', '| Figure | Title | Section | Page | Steps | Tools | SVG |', '|---|---|---|---|---|---|---|'];

for (const m of C.manifest.sections) {
  const s = C.sections.get(m.id);
  const figs = C.order.map(id => C.figures.get(id)).filter(f => f.section === m.id).sort((a, b) => a.fig - b.fig || a.part.localeCompare(b.part));
  const L = [];
  L.push('# ' + m.title);
  L.push('');
  L.push('*' + (C.manifest.groups[m.group]) + ' · pages ' + m.pages[0] + '–' + m.pages[1] + ' of the book · ' + figs.length + ' figure' + (figs.length === 1 ? '' : 's') + '.* [Back to the index](README.md)');
  L.push('');
  if (s) {
    L.push('**History.** ' + md(s.history));
    L.push('');
    L.push(md(s.description));
    L.push('');
  } else L.push('*(The text of this section is not written yet.)*\n');
  L.push('## Figures');
  L.push('');
  for (const f of figs) {
    figsTotal++;
    let sc = null; try { sc = C.build(f); } catch (e) { sc = { error: e.message }; }
    L.push('### ' + f.caption + ' — ' + (f.title || '') + ' {#' + anchor(f.id) + '}');
    L.push('');
    L.push('<a id="' + anchor(f.id) + '"></a>');
    L.push('');
    L.push('*Page ' + f.page + ' of the book.*' + (f.note ? ' ' + md(f.note) : ''));
    L.push('');
    if (built.has(f.id)) L.push('![' + f.caption + '](../svg/' + f.id + '.svg)'); else L.push('*(svg/' + f.id + '.svg not built)*');
    L.push('');
    if (sc && !sc.error) {
      L.push('The construction:');
      L.push('');
      sc.steps.forEach((st, i) => L.push((i + 1) + '. **' + C.TOOLS[st.tool].name + '** — ' + st.text));
      L.push('');
    } else if (sc) L.push('*(does not build: ' + sc.error + ')*\n');
    figIndex.push('| ' + f.caption + ' | ' + esc(f.title) + ' | [' + m.title + '](' + m.id + '.md#' + anchor(f.id) + ') | ' + f.page + ' | ' + (sc && !sc.error ? sc.steps.length : '—') + ' | ' + (sc && !sc.error ? Array.from(new Set(sc.steps.map(x => x.tool))).filter(t => t !== 'given' && t !== 'note').join(', ') : '') + ' | [' + f.id + '.svg](../svg/' + f.id + '.svg) |');
  }
  if (s) {
    if (s.equations && s.equations.length) { L.push('## Equations'); L.push(''); s.equations.forEach(e => L.push('- $' + e.tex + '$' + (e.note ? ' — ' + md(e.note) : ''))); L.push(''); }
    if (s.metrical && s.metrical.length) { L.push('## Metrical properties'); L.push(''); s.metrical.forEach(e => L.push('- $' + e.tex + '$' + (e.note ? ' — ' + md(e.note) : ''))); L.push(''); }
    if (s.items && s.items.length) { L.push('## General items'); L.push(''); s.items.forEach(it => L.push('- ' + (it.label ? '**(' + it.label + ')** ' : '') + md(it.text))); L.push(''); }
    if (s.tables && s.tables.length) s.tables.forEach(t => {
      L.push('### ' + (t.title || 'Table')); L.push('');
      L.push('| ' + (t.head || []).map(esc).join(' | ') + ' |'); L.push('|' + (t.head || []).map(() => '---').join('|') + '|');
      (t.rows || []).forEach(r => L.push('| ' + r.map(c => esc(md(c))).join(' | ') + ' |')); L.push(''); if (t.note) { L.push('*' + md(t.note) + '*'); L.push(''); }
    });
    if (s.extra) { L.push(md(s.extra)); L.push(''); }
    if (s.constructions && s.constructions.length) { L.push('## To practise'); L.push(''); s.constructions.forEach(c => { const f = C.figures.get(c.fig); L.push('- [' + (c.title || c.fig) + '](#' + anchor(c.fig) + ') — ' + (f ? f.caption : c.fig) + ', level ' + (c.level || 1)); }); L.push(''); }
    if (s.bibliography && s.bibliography.length) { L.push('## Bibliography'); L.push(''); s.bibliography.forEach(b => L.push('- ' + b)); L.push(''); }
    if (s.seeAlso && s.seeAlso.length) { L.push('## See also'); L.push(''); L.push(s.seeAlso.map(r => { const x = C.manifest.sections.find(y => y.id === r); return '[' + (x ? x.title : r) + '](' + r + '.md)'; }).join(' · ')); L.push(''); }
  }
  fs.writeFileSync(path.join(OUT, m.id + '.md'), L.join('\n'));
  pages++;
  index.push('| [' + m.title + '](' + m.id + '.md) | ' + m.pages[0] + '–' + m.pages[1] + ' | ' + figs.length + ' | ' + C.manifest.groups[m.group] + ' |');
}
index.push('', 'See also [FIGURES.md](FIGURES.md), every figure in the order of the book, and [TOOLS.md](TOOLS.md), the tools and the rules of the practice.');
fs.writeFileSync(path.join(OUT, 'README.md'), index.join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'FIGURES.md'), figIndex.join('\n') + '\n');
console.log('docs/: ' + pages + ' section pages, ' + figsTotal + ' figures, index and figure list');
