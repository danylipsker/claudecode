/* HYPER-CORE · text.js
 *
 * The small Markdown dialect the content is written in, turned into HTML.
 *
 *   Paragraphs, blank-line separated     **bold**   *italic*   `code`
 *   $inline TeX$   $$display TeX$$ (may span lines)
 *   [[concept-id]]  [[concept-id|shown text]]  [[math:derivative|a derivative]]
 *   [text](https://...)                 external link, opens in a new tab
 *   ### Heading   #### Smaller heading
 *   - bullet      1. numbered
 *   > [!tip] ...   > [!note] ...   > [!warn] ...   > [!key] ...   (callouts)
 *   | a | b |  tables, second line |---|---|
 *
 * Nothing here touches the DOM: text in, HTML string out.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escA = s => esc(s).replace(/"/g, '&quot;');

  function link(ref, label) {
    const exists = H.exists ? H.exists(ref) : true;
    const r = H.ref ? H.ref(ref) : { local: true };
    const text = label != null ? label : (H.titleOf ? H.titleOf(ref) : ref);
    const cls = 'clink' + (r.local ? '' : ' xdisc xd-' + r.disc) + (exists === false ? ' missing' : '');
    if (exists === false && H.linkErrors) H.linkErrors.push(ref);
    return '<a class="' + cls + '" href="' + escA(H.href ? H.href(ref) : '#/c/' + ref) + '" data-ref="' + escA(ref) + '">' + inline(text, true) + '</a>';
  }

  /* inline markup; `plain` skips links (used for link labels themselves) */
  function inline(s, plain) {
    if (s == null) return '';
    const keep = [];
    const hold = h => '\u0000' + (keep.push(h) - 1) + '\u0000';
    let t = String(s);
    t = t.replace(/\\\$/g, () => hold('$'));
    t = t.replace(/`([^`]+)`/g, (m, c) => hold('<code>' + esc(c) + '</code>'));
    t = t.replace(/\$\$([\s\S]+?)\$\$/g, (m, x) => hold(H.texSafe(x.trim(), true)));
    t = t.replace(/\$([^$]+?)\$/g, (m, x) => hold(H.texSafe(x.trim(), false)));
    if (!plain) {
      t = t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, id, label) => hold(link(id.trim(), label)));
      t = t.replace(/\[([^\]]+)\]\((https?:[^)\s]+|\.\.\/[^)\s]+)\)/g, (m, label, url) =>
        hold('<a class="xlink" href="' + escA(url) + '" target="_blank" rel="noopener">' + inline(label, true) + '</a>'));
    }
    t = esc(t);
    t = t.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
    t = t.replace(/ -- /g, ' – ');
    for (let k = 0; k < 3 && /\u0000\d+\u0000/.test(t); k++) t = t.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
    return t;
  }

  const CALLOUT = { tip: 'Tip', note: 'Note', warn: 'Careful', key: 'Key idea', example: 'Example', history: 'History', why: 'Why?', fact: 'Did you know?' };

  function render(src) {
    if (src == null) return '';
    const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
    let html = '';
    let para = [];
    const flush = () => { if (para.length) { html += '<p>' + inline(para.join(' ')) + '</p>'; para = []; } };
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const tr = line.trim();
      if (!tr) { flush(); continue; }
      // display math block
      if (tr.startsWith('$$')) {
        flush();
        let buf = tr.slice(2);
        let j = i;
        while (!/\$\$\s*$/.test(buf) || (j === i && buf.trim() === '')) {
          j++;
          if (j >= lines.length) break;
          buf += '\n' + lines[j];
        }
        i = j;
        html += '<div class="mathblock">' + H.texSafe(buf.replace(/\$\$\s*$/, '').trim(), true) + '</div>';
        continue;
      }
      let m;
      if ((m = /^(#{2,4})\s+(.*)$/.exec(tr))) {
        flush();
        const lvl = Math.min(4, m[1].length + 1);
        html += '<h' + lvl + '>' + inline(m[2]) + '</h' + lvl + '>';
        continue;
      }
      if (/^[-*]\s+/.test(tr) || /^\d+[.)]\s+/.test(tr)) {
        flush();
        const ordered = /^\d/.test(tr);
        const items = [];
        while (i < lines.length) {
          const l = lines[i];
          const lt = l.trim();
          if (ordered ? /^\d+[.)]\s+/.test(lt) : /^[-*]\s+/.test(lt)) items.push(lt.replace(/^([-*]|\d+[.)])\s+/, ''));
          else if (lt && /^\s{2,}/.test(l) && items.length) items[items.length - 1] += ' ' + lt;
          else break;
          i++;
        }
        i--;
        html += (ordered ? '<ol>' : '<ul>') + items.map(x => '<li>' + inline(x) + '</li>').join('') + (ordered ? '</ol>' : '</ul>');
        continue;
      }
      if (tr.startsWith('>')) {
        flush();
        const buf = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) { buf.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
        i--;
        let kind = 'note', first = buf.join('\n');
        const k = /^\[!(\w+)\]\s*/.exec(first);
        if (k) { kind = k[1].toLowerCase(); first = first.slice(k[0].length); }
        html += '<div class="callout co-' + kind + '"><div class="co-h">' + (CALLOUT[kind] || 'Note') + '</div>' + render(first) + '</div>';
        continue;
      }
      if (tr.startsWith('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        flush();
        // split on | but not inside $math$, [[links]] or where escaped as \|
        const cells = l => {
          const s = l.trim().replace(/^\|/, '').replace(/\|$/, '');
          const out = [];
          let cur = '', math = false, link = 0;
          for (let k = 0; k < s.length; k++) {
            const ch = s[k];
            if (ch === '\\' && s[k + 1] === '|' && !math) { cur += '|'; k++; continue; }
            if (ch === '$') math = !math;
            if (!math && ch === '[' && s[k + 1] === '[') link++;
            if (!math && ch === ']' && s[k + 1] === ']' && link) link--;
            if (ch === '|' && !math && !link) { out.push(cur.trim()); cur = ''; continue; }
            cur += ch;
          }
          out.push(cur.trim());
          return out;
        };
        const head = cells(tr);
        const align = cells(lines[i + 1]).map(c => /^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : 'left');
        i += 2;
        let body = '';
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          body += '<tr>' + cells(lines[i]).map((c, j) => '<td style="text-align:' + (align[j] || 'left') + '">' + inline(c) + '</td>').join('') + '</tr>';
          i++;
        }
        i--;
        html += '<div class="tablewrap"><table class="dtable"><thead><tr>' + head.map((c, j) => '<th style="text-align:' + (align[j] || 'left') + '">' + inline(c) + '</th>').join('') +
                '</tr></thead><tbody>' + body + '</tbody></table></div>';
        continue;
      }
      para.push(tr);
    }
    flush();
    return html;
  }

  H.text = render;
  H.inline = inline;
  H.plain = function (s) {           // text for search indexes and tooltips
    return String(s || '').replace(/\$\$?([^$]+)\$\$?/g, (m, x) => ' ' + x.replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}^_\\]/g, ' ') + ' ')
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, id, l) => l || (H.titleOf ? H.titleOf(id) : id))
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`#>|]/g, '').replace(/\s+/g, ' ').trim();
  };
})(typeof window !== 'undefined' ? window : globalThis);
