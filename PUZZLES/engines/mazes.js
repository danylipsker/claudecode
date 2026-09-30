/* The Puzzle Cabinet · engines/mazes.js
 *
 * Mazes and logic mazes. One engine, many kinds (data.kind):
 *
 *   labyrinth  { grid: 'square'|'hex'|'theta', w, h | R, shape?, algo, seed, braid?, goal? }
 *              a perfect maze grown again from its seed (js/lib/mazes-logic.js);
 *              walk it with the arrow keys or drag a glowing trail
 *   unicursal  { seq: [3, 2, 1, 4, 7, 6, 5] }  a classical labyrinth: one path, walked to the centre
 *   arrow      { rows: ['→↓…', …, '★'], start }   move any distance along the arrow you stand on
 *   number     { rows: ['312…', '*'], start }       jump exactly the number you stand on
 *   colour     { w, h, hs, vs, order: 'rb', start, goal }   coloured streets, colours in turn
 *   streets    { w, h, hs, vs, start, goal, noLeft? }       one-way streets, no U-turns
 *   die        { rows: ['S3#…'], start, goal, die: [top, north, east] }   roll onto matching numbers
 *   chase      { w, h, ew, sw, t, m, exit: [x, y, side] }    Theseus and a minotaur who takes two steps
 *   ice        { rows: ['.#:/\\'], start, goal }            slide until stopped; mirrors turn you
 *
 * p.par = the fewest moves (steps for labyrinths), found by breadth-first search.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const M = () => C.MazeLogic;

  const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cellName = (w, i) => COLS[i % w] + (Math.floor(i / w) + 1);
  const DIRW4 = ['north', 'east', 'south', 'west'];
  const DIRW8 = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
  const KEYDIR = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
  const COLNAME = { r: 'red', b: 'blue', y: 'yellow' };
  const COLHEX = { r: '#ff6b6b', b: '#5b8cff', y: '#ffc933' };
  const GRIDN = { square: 'square', hex: 'hexagonal', theta: 'circular' };
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const f2 = (v) => Math.round(v * 100) / 100;

  const TEXTURE = {
    backtrack: 'long winding corridors and few, long dead ends',
    prim: 'lots of short dead ends and a fairly direct way through',
    kruskal: 'many short dead ends, no favourite direction',
    eller: 'built row by row, with a faint grain across',
    wilson: 'every possible maze of this shape equally likely'
  };
  const ALGO_EXPLAIN = {
    backtrack: 'The **recursive backtracker** digs like a mole: it runs on as far as it can and only backs up to the last junction with an unexplored side when it is boxed in. That is why the corridors are long and the dead ends few but deep.',
    prim: '**Prim\'s algorithm** (after Robert Prim, 1957, who used it for the cheapest network joining a set of points) grows the maze outward from one cell like frost on a window, adding a random cell on the edge each time. Many short dead ends branch off a fairly direct route.',
    kruskal: '**Kruskal\'s algorithm** (Joseph Kruskal, 1956) starts with every cell walled in and knocks down walls in random order — except a wall between two cells that are already connected. The result has many short dead ends and no grain.',
    eller: '**Eller\'s algorithm** builds the maze one row at a time, remembering only which cells of the current row are already joined — so it could make a maze as long as you like with a fixed amount of memory. A faint horizontal grain shows.',
    wilson: '**Wilson\'s algorithm** (David Wilson, 1996) uses loop-erased random walks: wander at random until you meet the maze, erase any loops, add the path. Every possible perfect maze on this grid is then equally likely.'
  };

  function labSize(d) {
    if (d.grid === 'square') return d.w + ' × ' + d.h;
    if (d.grid === 'hex') return d.shape === 'rect' ? d.w + ' × ' + d.h : (3 * d.R * (d.R + 1) + 1) + ' cells';
    return C.plural(d.R, 'ring');
  }
  function labGoalWord(d) {
    if (d.goal === 'centre' || d.grid === 'theta') return 'the centre';
    return 'the exit';
  }

  // the statement for a generated maze (stored puzzles carry their own)
  function statement(d) {
    switch (d.kind) {
      case 'labyrinth':
        return 'A ' + GRIDN[d.grid] + ' maze (' + labSize(d) + ') grown by ' + M().ALGOS[d.algo] + ': ' + TEXTURE[d.algo] + '. ' +
          (d.goal === 'centre' || d.grid === 'theta' ? 'Find your way in to the centre.' : 'Walk from the entrance to the exit.') +
          (d.braid ? ' This one has **loops**, so there is more than one way — and a hand on the wall will not always get you there.' : '');
      case 'unicursal': return 'A classical labyrinth: one path, no choices. Walk it to the centre and watch the order in which it visits the circuits.';
      case 'arrow': return 'Every square has an arrow. From the square you stand on you may move **any number of squares** in the direction of its arrow — and no other way. Get from the glowing counter to the **star**.';
      case 'number': return 'Jump **exactly** as many squares as the number you stand on, in a straight line along its row or column. Get from the glowing counter to the **star**.';
      case 'colour': return 'Walk the streets of this town from **S** to **G**. Each street is painted, and you must take the colours in turn: ' + colourCycle(d.order) + ' You may start with any colour.';
      case 'streets': return 'Drive from **S** to **G**. Arrows mark one-way streets; the others go both ways. **No U-turns**' + (d.noLeft ? ', and **no left turns** either' : '') + '.';
      case 'die': return 'Roll the die from square to square: it tips over one edge at a time. You may only roll onto a square whose **number matches the face that comes up on top**. Holes cannot be crossed' + (d.rows.some((r) => r.indexOf('*') >= 0) ? '; a square with a star takes any face' : '') + '. Roll to the goal' + (dieGoalFace(d) ? ', arriving with ' + dieGoalFace(d) + ' on top' : '') + '.';
      case 'chase': return 'Lead Theseus out through the exit. For each step you take — or each turn you wait — the Minotaur takes **two** steps toward you: across first, if that brings him closer and no wall is in the way; otherwise up or down; otherwise he stands still. Do not let him reach you.';
      case 'ice': return 'The floor is ice. Once you push off you slide until something stops you: a rock or the wall' + (iceHas(d, ':') ? ', or a patch of snow' : '') + '.' + (iceHas(d, '/') || iceHas(d, '\\') ? ' Mirrors turn you through a right angle.' : '') + ' Come to rest on the **flag**.';
      default: return '';
    }
  }
  function colourCycle(order) {
    const o = (order || 'rb').split('').map((c) => COLNAME[c]);
    return o.concat(o[0]).join(', ') + '…';
  }
  function dieGoalFace(d) {
    const ch = Array.from(d.rows[d.goal[1]])[d.goal[0]];
    return /[1-6]/.test(ch) ? ch : '';
  }
  function iceHas(d, ch) { return d.rows.some((r) => r.indexOf(ch) >= 0); }

  function goalText(d) {
    switch (d.kind) {
      case 'labyrinth': return 'Reach ' + labGoalWord(d) + '.';
      case 'unicursal': return 'Walk the one path all the way to the centre.';
      case 'arrow': return 'Reach the ★, moving only as the arrows say.';
      case 'number': return 'Reach the ★ with jumps of exactly the numbers shown.';
      case 'colour': return 'Reach **G**, taking the colours in turn: ' + colourCycle(d.order);
      case 'streets': return 'Drive from **S** to **G**: follow the one-way arrows, no U-turns' + (d.noLeft ? ', no left turns' : '') + '.';
      case 'die': return 'Roll to the goal; every square you land on must match the top face.';
      case 'chase': return 'Get Theseus out through the exit without being caught.';
      case 'ice': return 'Come to rest on the flag.';
      default: return '';
    }
  }

  const ABOUT = {
    labyrinth: 'Walk with the **arrow keys** (hold **Shift** to run to the next junction), or **drag** the glowing end of your trail through the passages. Walking back over your trail rubs it out; click a cell on the trail to go straight back there. Cells you have visited keep a faint breadcrumb. Use the paint tool to colour dead ends, or the highlighter to mark them.',
    unicursal: '**Drag** the walker along the path, or hold the **arrow keys** (→ or ↑ forward, ← or ↓ back; **Shift** runs). There is only one way — the fun is in watching where it takes you.',
    arrow: '**Click** a square on the line of your arrow to move there, or drag the counter onto it. Keys: the **arrow keys** pick a square along the line, **Enter** or **Space** moves; or type a **digit** to move that many squares. **Backspace** takes a move back. Dots show where you may go.',
    number: '**Click** one of the dotted squares to jump there, or drag the counter. Keys: the **arrow keys** jump in that direction. **Backspace** takes a move back.',
    colour: '**Click** a dot next to you (or the street to it) to walk there, or use the **arrow keys**. The ring round your counter shows the colour you must take next; the streets you may take glow. **Backspace** takes a move back.',
    streets: '**Click** the next crossing (or the street to it), or use the **arrow keys**. Streets you may take now glow. **Backspace** takes a move back.',
    die: 'Roll with the **arrow keys**, by **clicking** a square next to the die, or by dragging the die. Dots show the rolls allowed now; a square with a star takes any face; the unfolded die in the panel shows every face. **Backspace** takes a roll back.',
    chase: 'Move Theseus with the **arrow keys**, or click (or drag toward) a square next to him. **Space** (or clicking Theseus, or the Wait button) waits a turn. After each of your moves the Minotaur takes his two steps. **Backspace** takes a turn back.',
    ice: 'Slide with the **arrow keys**, by **clicking** anywhere in the direction you want to go, or by flicking the puck. **Backspace** takes a slide back.'
  };

  /* ---------- labyrinth drawing helpers (shared by the board and the thumbnails) ---------- */

  function isDoor(L, i, k) { return L.doors.some((dd) => dd.cell === i && dd.side === k); }

  function sidePath(s, U) {
    if (s.arc) {
      const r = s.arc[0] * U, a0 = s.arc[1], a1 = s.arc[2];
      return 'M' + f2(r * Math.cos(a0)) + ' ' + f2(r * Math.sin(a0)) + 'A' + f2(r) + ' ' + f2(r) + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + f2(r * Math.cos(a1)) + ' ' + f2(r * Math.sin(a1));
    }
    return 'M' + f2(s.a[0] * U) + ' ' + f2(s.a[1] * U) + 'L' + f2(s.b[0] * U) + ' ' + f2(s.b[1] * U);
  }

  // every wall as one path: outer walls (except doors) and walls between cells with no passage
  function labWalls(L, U) {
    const g = L.g, open = L.open;
    let d = '';
    for (let i = 0; i < g.n; i++) {
      const ss = g.sides[i];
      for (let k = 0; k < ss.length; k++) {
        const s = ss[k];
        if (s.j < 0) { if (!isDoor(L, i, k)) d += sidePath(s, U); }
        else if (s.j > i && open[i].indexOf(s.j) < 0) d += sidePath(s, U);
      }
    }
    return d;
  }

  // the midpoint of a side and the way out through it
  function sideMid(g, i, k) {
    const s = g.sides[i][k];
    if (s.arc) {
      const a = (s.arc[1] + s.arc[2]) / 2, r = s.arc[0];
      return { p: [r * Math.cos(a), r * Math.sin(a)], out: [Math.cos(a), Math.sin(a)] };
    }
    const p = [(s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2], c = g.pos[i];
    const v = [p[0] - c[0], p[1] - c[1]], l = Math.hypot(v[0], v[1]) || 1;
    return { p, out: [v[0] / l, v[1] / l] };
  }

  /* ---------- thumbnails ---------- */

  function svgOpen(x0, y0, w, h) {
    return '<svg viewBox="' + f2(x0) + ' ' + f2(y0) + ' ' + f2(w) + ' ' + f2(h) + '" preserveAspectRatio="xMidYMid meet">';
  }
  function thumbLab(d) {
    const L = M().buildLabyrinth(d), g = L.g, U = 10, b = g.box, pad = 1.2;
    let s = svgOpen(b.x0 * U - pad * U, b.y0 * U - pad * U, (b.x1 - b.x0 + 2 * pad) * U, (b.y1 - b.y0 + 2 * pad) * U);
    const col = g.type === 'hex' ? 'var(--wood)' : g.type === 'theta' ? 'var(--teal)' : 'var(--ink-2)';
    s += '<path d="' + labWalls(L, U) + '" fill="none" stroke="' + col + '" stroke-width="' + (U * 0.16) + '" stroke-linecap="round"/>';
    const dot = (c, fill) => '<circle cx="' + f2(g.pos[c][0] * U) + '" cy="' + f2(g.pos[c][1] * U) + '" r="' + (U * 0.32) + '" fill="' + fill + '"/>';
    return s + dot(L.start, 'var(--green)') + dot(L.goal, 'var(--gold)') + '</svg>';
  }
  function thumbUni(d) {
    const P = M().unicursalPath(d);
    if (!P) return '';
    const R = P.outR + 1.5;
    let s = svgOpen(-R, -R, 2 * R, 2 * R + 1);
    s += '<circle r="' + f2(P.outR + 0.35) + '" fill="#3f6b45"/>';
    s += '<path d="' + P.pts.filter((p, i) => i % 3 === 0 || i === P.pts.length - 1).map((p, i) => (i ? 'L' : 'M') + f2(p[0]) + ' ' + f2(p[1])).join('') + '" fill="none" stroke="#e9dcb8" stroke-width=".66" stroke-linejoin="round" stroke-linecap="round"/>';
    s += '<circle r="' + f2(P.rc - 0.35) + '" fill="#e9dcb8"/>';
    return s + '</svg>';
  }
  function thumbGrid(d) {
    const m = M().model(d), w = m.w, h = m.h, U = 10;
    let s = svgOpen(-2, -2, w * U + 4, h * U + 4);
    s += '<rect x="0" y="0" width="' + w * U + '" height="' + h * U + '" rx="2" fill="var(--board-2)" stroke="var(--ink-2)" stroke-width=".8"/>';
    const cx = (i) => (i % w + 0.5) * U, cy = (i) => (Math.floor(i / w) + 0.5) * U;
    const put = (i, txt, fill, size) => { s += '<text x="' + cx(i) + '" y="' + (cy(i) + (size || 6) * 0.36) + '" text-anchor="middle" font-size="' + (size || 6) + '" font-weight="700" fill="' + (fill || 'var(--ink-2)') + '">' + txt + '</text>'; };
    const token = (i, col) => { s += '<circle cx="' + cx(i) + '" cy="' + cy(i) + '" r="' + U * 0.3 + '" fill="' + (col || 'var(--teal)') + '"/>'; };
    if (d.kind === 'arrow' || d.kind === 'number' || d.kind === 'die' || d.kind === 'ice') {
      const G = d.rows.map((r) => Array.from(r));
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const ch = G[y][x], i = y * w + x;
          if (ch === '★' || ch === '*') put(i, '★', 'var(--gold)', 7);
          else if (d.kind === 'ice') {
            if (ch === '#') s += '<rect x="' + (x * U + 1.5) + '" y="' + (y * U + 1.5) + '" width="' + (U - 3) + '" height="' + (U - 3) + '" rx="3" fill="var(--ink-2)" opacity=".7"/>';
            else if (ch === ':') s += '<rect x="' + (x * U + 1) + '" y="' + (y * U + 1) + '" width="' + (U - 2) + '" height="' + (U - 2) + '" fill="#f1ead8" opacity=".55"/>';
            else if (ch === '/' || ch === '\\') s += '<path d="M' + (x * U + (ch === '/' ? 2 : U - 2)) + ' ' + (y * U + U - 2) + 'L' + (x * U + (ch === '/' ? U - 2 : 2)) + ' ' + (y * U + 2) + '" stroke="var(--metal)" stroke-width="1.6"/>';
          } else if (ch === '#') s += '<rect x="' + (x * U + 1.5) + '" y="' + (y * U + 1.5) + '" width="' + (U - 3) + '" height="' + (U - 3) + '" rx="3" fill="var(--bg)" opacity=".8"/>';
          else if (ch !== 'S' && ch !== '.') put(i, ch);
        }
      }
      if (d.kind === 'ice') put(d.goal[1] * w + d.goal[0], '⚑', 'var(--gold)', 8);
      if (d.kind === 'die') put(d.goal[1] * w + d.goal[0], '◎', 'var(--gold)', 9);
      token(d.start[1] * w + d.start[0], d.kind === 'die' ? '#f4f1e8' : null);
    } else if (d.kind === 'colour' || d.kind === 'streets') {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          [1, 2].forEach((k) => {
            const c = M().streetOf(d, w, h, i, k);
            if (c === '.') return;
            const j = i + (k === 1 ? 1 : w);
            const col = d.kind === 'colour' ? COLHEX[c] : 'var(--ink-2)';
            s += '<line x1="' + cx(i) + '" y1="' + cy(i) + '" x2="' + cx(j) + '" y2="' + cy(j) + '" stroke="' + col + '" stroke-width="' + (d.kind === 'colour' ? 2.4 : 3) + '" stroke-linecap="round"' + (d.kind === 'streets' && /[<>v^]/.test(c) ? ' stroke-dasharray="3 1.5"' : '') + '/>';
          });
        }
      }
      put(d.goal[1] * w + d.goal[0], 'G', 'var(--gold)', 7);
      token(d.start[1] * w + d.start[0]);
    } else if (d.kind === 'chase') {
      let wd = '';
      for (let y = 0; y < h; y++) for (let x = 0; x < w - 1; x++) if (d.ew[y][x] === '|') wd += 'M' + (x + 1) * U + ' ' + y * U + 'v' + U;
      for (let y = 0; y < h - 1; y++) for (let x = 0; x < w; x++) if (d.sw[y][x] === '-') wd += 'M' + x * U + ' ' + (y + 1) * U + 'h' + U;
      s += '<path d="' + wd + '" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/>';
      token(d.t[1] * w + d.t[0], '#5b8cff');
      token(d.m[1] * w + d.m[0], '#c0533e');
      const e = d.exit, ex = e[0], ey = e[1];
      const mid = e[2] === 'N' ? [(ex + 0.5) * U, 0] : e[2] === 'S' ? [(ex + 0.5) * U, h * U] : e[2] === 'E' ? [w * U, (ey + 0.5) * U] : [0, (ey + 0.5) * U];
      s += '<circle cx="' + mid[0] + '" cy="' + mid[1] + '" r="2.4" fill="var(--green)"/>';
    }
    return s + '</svg>';
  }

  const STAR = (r) => {
    let d = '';
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; d += (k ? 'L' : 'M') + f2(rr * Math.cos(a)) + ' ' + f2(rr * Math.sin(a)); }
    return d + 'Z';
  };
  const ARROWHEAD = 'M-9 -8L6 0L-9 8L-5 0Z';
  const vecWord = (v) => {
    const a = (Math.atan2(v[1], v[0]) * 180 / Math.PI + 450) % 360; // 0 = north, clockwise
    return DIRW8[Math.round(a / 45) % 8];
  };

  /* ================= labyrinths ================= */

  function mountLabyrinth(ctx, p) {
    const d = p.data, wb = ctx.wb, ML = M();
    const L = ML.buildLabyrinth(d), g = L.g;
    const U = 40;
    const P = (c) => [g.pos[c][0] * U, g.pos[c][1] * U];
    const b = g.box;
    wb.setBounds({ x0: b.x0 * U - 0.95 * U, y0: b.y0 * U - 0.95 * U, x1: b.x1 * U + 0.95 * U, y1: b.y1 * U + 0.95 * U }, 0.03);
    ctx.setGoal(goalText(d));
    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    const rootG = ctx.s('g', { class: 'mz mz-lab mz-' + g.type }, bg);
    const floor = ctx.s('g', { class: 'mz-floor' }, rootG);
    for (let i = 0; i < g.n; i++) ctx.s('path', { d: C.pathOf(g.shape(i).map((q) => [q[0] * U, q[1] * U])), class: 'mz-cell', 'data-key': 'c' + i }, floor);
    const wallD = labWalls(L, U);
    ctx.s('path', { d: wallD, class: 'mz-walls-shadow', 'stroke-width': U * 0.16, transform: 'translate(' + U * 0.05 + ' ' + U * 0.08 + ')' }, board);
    ctx.s('path', { d: wallD, class: 'mz-walls mz-walls-' + g.type, 'stroke-width': U * 0.15 }, board);

    // doors and the goal
    const marks = ctx.s('g', { class: 'mz-marks' }, board);
    let inPt = null, outPt = null;
    L.doors.forEach((dd) => {
      const sm = sideMid(g, dd.cell, dd.side), start = dd.cell === L.start;
      const q = [(sm.p[0] + sm.out[0] * 0.62) * U, (sm.p[1] + sm.out[1] * 0.62) * U];
      const ang = Math.atan2(sm.out[1], sm.out[0]) * 180 / Math.PI + (start ? 180 : 0);
      ctx.s('path', { d: ARROWHEAD, class: start ? 'mz-door-in' : 'mz-door-out', transform: 'translate(' + f2(q[0]) + ' ' + f2(q[1]) + ') rotate(' + f2(ang) + ') scale(' + U / 26 + ')' }, marks);
      if (start) inPt = [(sm.p[0] + sm.out[0] * 0.3) * U, (sm.p[1] + sm.out[1] * 0.3) * U];
      else outPt = [(sm.p[0] + sm.out[0] * 0.75) * U, (sm.p[1] + sm.out[1] * 0.75) * U];
    });
    const gp = P(L.goal);
    ctx.s('path', { d: STAR(U * 0.3), class: 'mz-goal-star', transform: 'translate(' + f2(gp[0]) + ' ' + f2(gp[1]) + ')' }, marks);

    // the trail
    const gTrail = ctx.s('g', { class: 'mz-trail' }, top);
    const crumbs = ctx.s('path', { class: 'mz-crumbs', 'stroke-width': U * 0.13 }, gTrail);
    const glow = ctx.s('path', { class: 'mz-trail-glow', 'stroke-width': U * 0.5 }, gTrail);
    const line = ctx.s('path', { class: 'mz-trail-line', 'stroke-width': U * 0.18 }, gTrail);
    const headG = ctx.s('g', { class: 'mz-head' }, gTrail);
    const headIn = ctx.s('g', { class: 'mz-head-in' }, headG);
    ctx.s('circle', { r: U * 0.42, class: 'mz-head-halo' }, headIn);
    ctx.s('circle', { r: U * 0.26, class: 'mz-head-dot' }, headIn);
    const gHint = ctx.s('g', { class: 'mz-hint' }, top);

    let trail = [L.start], seen = new Set([L.start]), lastDX = 0, busy = false, drag = null, crumbsOn = true, timer = null;
    const head = () => trail[trail.length - 1];

    function seg(a, bb) {
      const pb = P(bb);
      if (g.type === 'theta' && a > 0 && bb > 0 && g.ring[a] === g.ring[bb]) {
        const r = (g.ring[a] + 0.5) * U, pa = P(a);
        let da = Math.atan2(pb[1], pb[0]) - Math.atan2(pa[1], pa[0]);
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        return 'A' + f2(r) + ' ' + f2(r) + ' 0 0 ' + (da > 0 ? 1 : 0) + ' ' + f2(pb[0]) + ' ' + f2(pb[1]);
      }
      return 'L' + f2(pb[0]) + ' ' + f2(pb[1]);
    }
    function pathD(cells, from) {
      const p0 = P(cells[0]);
      let s = from ? 'M' + f2(from[0]) + ' ' + f2(from[1]) + 'L' + f2(p0[0]) + ' ' + f2(p0[1]) : 'M' + f2(p0[0]) + ' ' + f2(p0[1]);
      for (let k = 1; k < cells.length; k++) s += seg(cells[k - 1], cells[k]);
      return s;
    }
    function drawTrail() {
      const arrived = head() === L.goal;
      let s = pathD(trail, inPt);
      if (arrived && outPt) s += 'L' + f2(outPt[0]) + ' ' + f2(outPt[1]);
      glow.setAttribute('d', s);
      line.setAttribute('d', s);
      const hp = P(head());
      headG.setAttribute('transform', 'translate(' + f2(hp[0]) + ' ' + f2(hp[1]) + ')');
      let cd = '';
      if (crumbsOn) {
        const on = new Set(trail);
        seen.forEach((c) => { if (!on.has(c)) { const q = P(c); cd += 'M' + f2(q[0]) + ' ' + f2(q[1]) + 'h0.01'; } });
      }
      crumbs.setAttribute('d', cd);
      rootG.classList.toggle('arrived', arrived);
      gTrail.classList.toggle('arrived', arrived);
    }

    function step(j) {
      const h = head();
      if (trail.length > 1 && trail[trail.length - 2] === j) trail.pop();
      else if (L.open[h].indexOf(j) >= 0) {
        const at = trail.indexOf(j);
        if (at >= 0) trail.length = at + 1; else trail.push(j);
      } else return false;
      const dx = g.pos[j][0] - g.pos[h][0];
      if (Math.abs(dx) > 0.2) lastDX = Math.sign(dx);
      seen.add(j);
      ctx.move();
      return true;
    }
    function after(why) {
      drawTrail();
      gHint.innerHTML = '';
      if (head() === L.goal) ctx.say('You are through!', 'good');
      ctx.changed(why || 'walk');
    }
    function bump() {
      headIn.classList.remove('bump'); void headIn.getBBox; headIn.classList.add('bump');
      clearTimeout(timer); timer = setTimeout(() => headIn.classList.remove('bump'), 260);
    }
    // the open neighbour of the head that lies best in direction vec (screen), or -1
    function toward(vec) {
      const h = head(), c = g.pos[h];
      let best = -1, bs = 0.34;
      L.open[h].forEach((j) => {
        const q = g.pos[j], v = [q[0] - c[0], q[1] - c[1]], l = Math.hypot(v[0], v[1]) || 1;
        const sc = (v[0] * vec[0] + v[1] * vec[1]) / l + 0.04 * Math.sign(v[0]) * lastDX;
        if (sc > bs) { bs = sc; best = j; }
      });
      return best;
    }
    function walk(vec, run) {
      if (busy) return;
      const j = toward(vec);
      if (j < 0) { bump(); ctx.sfx('tap'); return; }
      let prev = head();
      step(j);
      if (run) {
        let cur = j, n = 0;
        while (cur !== L.goal && L.open[cur].length === 2 && n++ < 2000) {
          const nx = L.open[cur][0] === prev ? L.open[cur][1] : L.open[cur][0];
          prev = cur; step(nx); cur = nx;
        }
      }
      ctx.sfx('tap');
      after('walk');
    }
    // a short way along the passages (for quick drags that skip a cell or two)
    function hop(a, bb, maxD) {
      if (a === bb) return [a];
      const prev = new Map([[a, -1]]);
      let q = [a];
      for (let dpt = 0; dpt < maxD && q.length; dpt++) {
        const nq = [];
        for (const c of q) {
          for (const j of L.open[c]) {
            if (prev.has(j)) continue;
            prev.set(j, c);
            if (j === bb) { const out = [bb]; let k = bb; while (prev.get(k) !== -1) { k = prev.get(k); out.push(k); } return out.reverse(); }
            nq.push(j);
          }
        }
        q = nq;
      }
      return null;
    }

    wb.handlers.board = {
      down(pt, ev) {
        if (ev.button === 2) return false;
        const i = g.cellAt([pt[0] / U, pt[1] / U]);
        if (busy) return i >= 0;
        if (i < 0) return false;
        const h = head();
        if (i === h) { drag = { moved: 0 }; return true; }
        const at = trail.indexOf(i);
        if (at >= 0) {
          while (trail.length > at + 1) { trail.pop(); ctx.move(); }
          ctx.sfx('tap');
          drawTrail();
          drag = { moved: 1 };
          return true;
        }
        if (L.open[h].indexOf(i) >= 0) { step(i); ctx.sfx('tap'); drawTrail(); drag = { moved: 1 }; return true; }
        if (ev.pointerType === 'touch') return false;
        ctx.say('Start from the glowing end of your trail — or use the arrow keys.', 'info');
        bump();
        return true;
      },
      move(pt) {
        if (!drag) return;
        const i = g.cellAt([pt[0] / U, pt[1] / U]), h = head();
        if (i < 0 || i === h) return;
        const path = hop(h, i, 3);
        if (!path) return;
        path.slice(1).forEach((c) => { if (step(c)) drag.moved++; });
        drawTrail();
      },
      up() {
        const dd = drag;
        drag = null;
        if (dd && dd.moved) after('walk');
      }
    };

    // the panel
    const crumbBtn = ctx.button('Breadcrumbs: on', () => { crumbsOn = !crumbsOn; crumbBtn.textContent = 'Breadcrumbs: ' + (crumbsOn ? 'on' : 'off'); drawTrail(); }, 'small ghost');
    crumbBtn.title = 'Faint dots on cells you have visited but left';
    drawTrail();
    ctx.stat('Moves', 0);

    function stopAnim() { clearTimeout(timer); busy = false; ctx.lockUndo(false); }

    return {
      check() {
        if (head() === L.goal) {
          const par = (ML.pathIn(L, L.start, L.goal) || []).length - 1;
          return { solved: true, msg: d.braid ? 'The shortest way is ' + par + ' steps.' : 'The one true way is ' + par + ' steps long.' };
        }
        return { solved: false, msg: 'Not there yet — keep walking.' };
      },
      hint(n) {
        const h = head(), path = ML.pathIn(L, h, L.goal);
        if (!path) return null;
        if (path.length === 1) return 'You are there!';
        // are we going back along the trail? then this branch is a dead end
        let k = 0;
        while (k + 1 < path.length && trail.length - 2 - k >= 0 && path[k + 1] === trail[trail.length - 2 - k]) k++;
        const show = (cells, junction) => () => {
          gHint.innerHTML = '';
          ctx.s('path', { d: pathD(cells), class: 'mz-hint-path', 'stroke-width': U * 0.16 }, gHint);
          if (junction != null) { const q = P(junction); ctx.s('circle', { cx: q[0], cy: q[1], r: U * 0.45, class: 'mz-hint-ring' }, gHint); }
          clearTimeout(timer);
          timer = setTimeout(() => { gHint.innerHTML = ''; }, 4500);
        };
        if (k > 0) {
          const j = path[k];
          return { text: 'You are in a dead end. Go back ' + C.plural(k, 'step') + ' to the ringed cell and take the other way from there.', show: show(path.slice(0, Math.min(path.length, k + 4 + 4 * n)), j) };
        }
        const len = Math.min(path.length, 7 + 6 * n);
        const v = [g.pos[path[1]][0] - g.pos[h][0], g.pos[path[1]][1] - g.pos[h][1]];
        return { text: 'Go ' + vecWord(v) + '. The dashed stretch (' + C.plural(len - 1, 'step') + ') is on the way' + (len === path.length ? ' — right to the end.' : '; ' + (path.length - 1) + ' steps to go in all.'), show: show(path.slice(0, len)) };
      },
      solve() {
        const path = ML.pathIn(L, head(), L.goal);
        if (!path) return;
        busy = true;
        ctx.lockUndo(true);
        const ms = Math.max(12, Math.min(90, 2600 / Math.max(1, path.length)));
        let k = 1;
        const next = () => {
          if (k >= path.length) { busy = false; ctx.lockUndo(false); after('solve'); return; }
          step(path[k++]);
          drawTrail();
          timer = setTimeout(next, C.anim(ms));
        };
        next();
      },
      explain() {
        const st = ML.labyrinthStats(L);
        return ALGO_EXPLAIN[d.algo] + '\n\nThis maze has ' + st.cells + ' cells, ' + C.plural(st.dead, 'dead end') + ' and ' + C.plural(st.junctions, 'junction') + '; the way through is **' + st.par + ' steps**.' +
          (d.braid ? ' Because it has loops, a wall can be an island: keep your hand on the wall of an island and you walk round it for ever, never reaching a goal that lies inside. Loops are what make a garden maze with a centre hard.' : ' It is a *perfect* maze: exactly one path joins any two cells, so the way you found is the only one — and keeping one hand on the wall always gets you to the goal in the end, though often by the scenic route.');
      },
      getState() { return { t: trail.slice(), s: Array.from(seen) }; },
      setState(st) {
        stopAnim();
        if (!st || !st.t || !st.t.length) return;
        trail = st.t.filter((c) => c >= 0 && c < g.n);
        if (!trail.length) trail = [L.start];
        seen = new Set(st.s || trail);
        gHint.innerHTML = '';
        drawTrail();
      },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        const k = ev.key;
        const vec = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[k];
        if (vec) { walk(vec, ev.shiftKey); return true; }
        if (k === 'Backspace' && trail.length > 1 && !busy) { trail.pop(); ctx.move(); after('walk'); return true; }
        return false;
      },
      destroy() { stopAnim(); wb.handlers.board = null; }
    };
  }

  /* ================= the unicursal labyrinth ================= */

  function mountUnicursal(ctx, p) {
    const d = p.data, wb = ctx.wb, ML = M();
    const P = ML.unicursalPath(d);
    if (!P) { ctx.say('This labyrinth cannot be drawn.', 'warn'); return {}; }
    const U = 28, n = P.n;
    const pts = P.pts.map((q) => [q[0] * U, q[1] * U]);
    const last = pts.length - 1;
    const R = (P.outR + 1.7) * U;
    wb.setBounds({ x0: -R, y0: -R, x1: R, y1: R }, 0.03);
    ctx.setGoal(goalText(d));
    const rootG = ctx.s('g', { class: 'mz mz-uni' }, wb.layer('bg'));
    ctx.s('circle', { r: (P.outR + 0.4) * U, class: 'mz-hedge' }, rootG);
    for (let c = 1; c <= n + 1; c++) ctx.s('circle', { r: (P.rc + n - c + 1) * U, class: 'mz-hedge-line' }, rootG);
    ctx.s('path', { d: C.pathOf(pts, false), class: 'mz-uni-path', 'stroke-width': 0.64 * U }, rootG);
    ctx.s('circle', { r: (P.rc - 0.33) * U, class: 'mz-uni-centre', 'data-key': 'centre' }, rootG);
    const labels = ctx.s('g', { class: 'mz-uni-labels' }, wb.layer('board'));
    for (let c = 1; c <= n; c++) ctx.s('text', { x: 0, y: -P.rad(c) * U + 0.2 * U, 'text-anchor': 'middle', 'font-size': 0.5 * U, text: String(c) }, labels);
    const gTrail = ctx.s('g', { class: 'mz-trail' }, wb.layer('top'));
    const glow = ctx.s('path', { class: 'mz-trail-glow', 'stroke-width': U * 0.42 }, gTrail);
    const line = ctx.s('path', { class: 'mz-trail-line', 'stroke-width': U * 0.14 }, gTrail);
    const headG = ctx.s('g', { class: 'mz-head' }, gTrail);
    ctx.s('circle', { r: U * 0.36, class: 'mz-head-halo' }, headG);
    ctx.s('circle', { r: U * 0.22, class: 'mz-head-dot' }, headG);
    const seqEl = ctx.h('div.mz-seq');
    ctx.panel.appendChild(seqEl);

    let cur = 0, drag = null, timer = null, keyT = null, busy = false;

    function circuits(upto) {
      const out = [];
      for (let i = 0; i <= upto; i++) { const r = P.ringOf[i]; if (r >= 1 && r <= n && out[out.length - 1] !== r) out.push(r); }
      return out;
    }
    function draw() {
      const s = C.pathOf(pts.slice(0, cur + 1), false);
      glow.setAttribute('d', s);
      line.setAttribute('d', s);
      headG.setAttribute('transform', 'translate(' + f2(pts[cur][0]) + ' ' + f2(pts[cur][1]) + ')');
      const seq = circuits(cur);
      seqEl.innerHTML = '<b>Circuits walked</b><div class="mz-seq-row">' + (seq.length ? seq.map((c) => '<span>' + c + '</span>').join('<i>→</i>') : '<em>none yet</em>') + (cur >= last ? '<i>→</i><span class="c">centre</span>' : '') + '</div>';
      rootG.classList.toggle('arrived', cur >= last);
      gTrail.classList.toggle('arrived', cur >= last);
    }
    function nearest(pt, from, span) {
      let best = -1, bd = Infinity;
      for (let i = Math.max(0, from - span); i <= Math.min(last, from + span); i++) {
        const dd = (pts[i][0] - pt[0]) ** 2 + (pts[i][1] - pt[1]) ** 2;
        if (dd < bd) { bd = dd; best = i; }
      }
      return { i: best, d: Math.sqrt(bd) };
    }
    wb.handlers.board = {
      down(pt, ev) {
        if (ev.button === 2 || busy) return false;
        if (Math.hypot(pt[0] - pts[cur][0], pt[1] - pts[cur][1]) < 1.2 * U) { drag = { moved: false }; return true; }
        if (ev.pointerType === 'touch') return false;
        ctx.say('Drag the glowing walker along the path, or hold an arrow key.', 'info');
        return true;
      },
      move(pt) {
        if (!drag) return;
        for (let t = 0; t < 8; t++) {
          const r = nearest(pt, cur, 14);
          if (r.i === cur || r.d > 1.1 * U) break;
          cur = r.i; drag.moved = true;
        }
        draw();
      },
      up() { const dd = drag; drag = null; if (dd && dd.moved) ctx.changed('walk'); }
    };
    draw();

    return {
      noMoves: true,
      check() {
        if (cur >= last) return { solved: true, msg: 'The path took you round the circuits in the order ' + circuits(last).join(', ') + ', then into the centre.' };
        return { solved: false, msg: 'Keep walking — the centre is still ahead.' };
      },
      hint() {
        const left = Math.round((P.len[last] - P.len[cur]) / 1);
        const r = P.ringOf[cur];
        return 'A labyrinth has no wrong turns: there is only one path, folded up. Just keep going' + (r >= 1 && r <= n ? ' (you are on circuit ' + r + ')' : '') + ' — about ' + left + ' circuit-widths of path are left.';
      },
      solve() {
        busy = true;
        const stepN = Math.max(2, Math.ceil((last - cur) / 150));
        const next = () => {
          cur = Math.min(last, cur + stepN);
          draw();
          if (cur >= last) { busy = false; ctx.changed('solve'); return; }
          timer = setTimeout(next, C.anim(18));
        };
        next();
      },
      explain() {
        return 'A labyrinth, unlike a maze, has **one path and no choices**: it winds to the centre by the longest possible road. This one visits its circuits in the order **' + d.seq.join(' – ') + '** and then the centre. On each side of the axis the turns nest inside one another without crossing, which is exactly the condition for a sequence to make a labyrinth drawn this way.';
      },
      getState() { return { c: cur }; },
      setState(st) { clearTimeout(timer); busy = false; if (st && st.c != null) { cur = Math.max(0, Math.min(last, st.c)); draw(); } },
      key(ev) {
        if (ev.type !== 'keydown' || busy) return false;
        const fwd = ev.key === 'ArrowRight' || ev.key === 'ArrowUp', back = ev.key === 'ArrowLeft' || ev.key === 'ArrowDown';
        if (!fwd && !back) return false;
        const k = ev.shiftKey ? 8 : 2;
        cur = Math.max(0, Math.min(last, cur + (fwd ? k : -k)));
        draw();
        clearTimeout(keyT);
        keyT = setTimeout(() => ctx.changed('walk'), cur >= last ? 0 : 350);
        return true;
      },
      destroy() { clearTimeout(timer); clearTimeout(keyT); wb.handlers.board = null; }
    };
  }

  /* ================= logic mazes: the shared board ================= */

  const UG = 48; // world units per square

  function tween(ms, frame, done) {
    let stopped = false, raf = 0;
    const t0 = (root.performance ? root.performance.now() : Date.now());
    const tick = (now) => {
      if (stopped) return;
      const t = Math.min(1, ((now || Date.now()) - t0) / Math.max(1, ms));
      frame(t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { stopped = true; if (done) done(); }
    };
    raf = requestAnimationFrame(tick);
    return {
      finish() { if (stopped) return; stopped = true; cancelAnimationFrame(raf); frame(1); if (done) done(); },
      cancel() { stopped = true; cancelAnimationFrame(raf); }
    };
  }
  const ease = (t) => 0.5 - Math.cos(t * Math.PI) / 2;
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // a point along a polyline, t in 0..1 by length
  function along(pts, t) {
    if (pts.length === 1) return pts[0];
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const want = L[L.length - 1] * t;
    for (let i = 1; i < pts.length; i++) {
      if (want <= L[i] || i === pts.length - 1) { const seg = L[i] - L[i - 1] || 1; return lerp(pts[i - 1], pts[i], Math.max(0, Math.min(1, (want - L[i - 1]) / seg))); }
    }
    return pts[pts.length - 1];
  }

  function mountLogic(ctx, p) {
    const d = p.data, wb = ctx.wb, ML = M();
    const m = ML.model(d);
    const K = RENDER[d.kind];
    const w = m.w, h = m.h, U = UG;
    const cen = (i) => [(i % w + 0.5) * U, (Math.floor(i / w) + 0.5) * U];
    const V = { ctx, m, d, w, h, U, cen, name: (i) => cellName(w, i) };
    ctx.setGoal(goalText(d));
    V.bg = ctx.s('g', { class: 'mz mz-logic mz-k-' + d.kind }, wb.layer('bg'));
    V.board = ctx.s('g', { class: 'mz-board mz-k-' + d.kind }, wb.layer('board'));
    V.top = ctx.s('g', { class: 'mz-topl mz-k-' + d.kind }, wb.layer('top'));
    V.trailG = ctx.s('g', { class: 'mz-trail mz-trail-logic' }, V.top);
    V.trailGlow = ctx.s('path', { class: 'mz-trail-glow', 'stroke-width': U * 0.34 }, V.trailG);
    V.trailLine = ctx.s('path', { class: 'mz-trail-line', 'stroke-width': U * 0.1 }, V.trailG);
    V.marks = ctx.s('g', { class: 'mz-marks-l' }, V.top);
    V.tokG = ctx.s('g', { class: 'mz-tokens' }, V.top);
    V.hintG = ctx.s('g', { class: 'mz-hint' }, V.top);
    V.dragG = ctx.s('g', { class: 'mz-drag' }, V.top);
    const pad = K.pad || [0.85, 0.85, 0.5, 0.5]; // left, top, right, bottom (in squares)
    wb.setBounds({ x0: -pad[0] * U, y0: -pad[1] * U, x1: (w + pad[2]) * U, y1: (h + pad[3]) * U }, 0.04);
    if (!K.noLabels) {
      const lab = ctx.s('g', { class: 'mz-coords' }, V.bg);
      for (let x = 0; x < w; x++) ctx.s('text', { x: (x + 0.5) * U, y: -0.28 * U, 'text-anchor': 'middle', text: COLS[x] }, lab);
      for (let y = 0; y < h; y++) ctx.s('text', { x: -0.3 * U, y: (y + 0.5) * U + 5, 'text-anchor': 'middle', text: String(y + 1) }, lab);
    }
    K.draw(V);

    let s = m.start, hist = [], anim = null, busy = false, dotsOn = C.store.get('mz:dots', true) !== false, drag = null, hintT = null, cursor = null;
    V.state = () => s;
    V.cursor = () => cursor;
    V.hist = () => hist;

    function trailD() {
      const states = hist.concat([s]);
      let dd = '';
      for (let k = 1; k < states.length; k++) {
        const pts = K.segment ? K.segment(V, states[k - 1], states[k]) : [cen(m.cellOf(states[k - 1])), cen(m.cellOf(states[k]))];
        if (!pts || pts.length < 2) continue;
        dd += 'M' + pts.map((q) => f2(q[0]) + ' ' + f2(q[1])).join('L');
      }
      return dd;
    }
    function drawMarks() {
      V.marks.innerHTML = '';
      if (!dotsOn || m.isGoal(s) || !K.marks) return;
      K.marks(V, s, m.moves(s));
    }
    function redraw() {
      K.place(V, s);
      const dd = trailD();
      V.trailGlow.setAttribute('d', dd);
      V.trailLine.setAttribute('d', dd);
      drawMarks();
      if (K.status) K.status(V, s);
      const done = m.isGoal(s);
      V.top.classList.toggle('arrived', done);
      V.bg.classList.toggle('arrived', done);
    }
    V.redraw = redraw;
    function stopAnim() { if (anim) { anim.cancel(); anim = null; } busy = false; }
    function finishAnim() { if (anim) anim.finish(); }

    // make a legal move, animated
    function play(mv, quiet, then) {
      finishAnim();
      const from = s;
      hist.push(s);
      s = mv.s;
      ctx.move();
      V.marks.innerHTML = '';
      V.hintG.innerHTML = '';
      cursor = null;
      if (K.sfx !== false) ctx.sfx(K.sfx || 'tap');
      const spec = K.animate(V, from, mv);
      const complete = () => {
        anim = null;
        redraw();
        if (m.isGoal(s)) { ctx.say(K.arrived ? K.arrived(V) : 'There!', 'good'); }
        else if (!quiet && K.after) { const t = K.after(V, s, mv); if (t) ctx.say(t, ''); }
        if (!quiet) ctx.changed('move');
        if (then) then();
      };
      anim = tween(C.anim(spec.ms), spec.frame, complete);
    }
    // an attempt that is not allowed: explain, maybe animate the failure
    function refuse(msg, spec) {
      finishAnim();
      ctx.say(msg, 'warn');
      ctx.sfx('wrong');
      if (spec) {
        busy = true;
        anim = tween(C.anim(spec.ms), spec.frame, () => { anim = null; busy = false; redraw(); });
      } else {
        V.tokG.classList.remove('bump'); void V.tokG.getBBox; V.tokG.classList.add('bump');
        clearTimeout(hintT); hintT = setTimeout(() => V.tokG.classList.remove('bump'), 280);
      }
    }
    const api = {
      m, V, play, refuse,
      get s() { return s; },
      moves: () => m.moves(s),
      byCell: (cell) => m.moves(s).filter((mv) => m.cellOf(mv.s) === cell),
      say: (t, k) => ctx.say(t, k),
      setCursor: (c) => { cursor = c; drawMarks(); },
      busy: () => busy
    };

    wb.handlers.board = {
      down(pt, ev) {
        if (ev.button === 2) return false;
        const inside = pt[0] >= -0.6 * U && pt[1] >= -0.6 * U && pt[0] <= (w + 0.6) * U && pt[1] <= (h + 0.6) * U;
        if (!inside) return false;
        if (busy) return true;
        const tc = cen(m.cellOf(s));
        const onTok = Math.hypot(pt[0] - tc[0], pt[1] - tc[1]) < 0.5 * U;
        drag = { p0: pt, onTok, moved: false, touch: ev.pointerType === 'touch' };
        if (!onTok && drag.touch && !K.tapAnywhere) {
          // on a phone a drag that does not start on the counter pans the view
          const c = cellAt(pt);
          if (c < 0) { drag = null; return false; }
        }
        return true;
      },
      move(pt) {
        if (!drag) return;
        if (Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > 0.28 * U) drag.moved = true;
        V.dragG.innerHTML = '';
        if (drag.onTok && drag.moved) {
          const tc = cen(m.cellOf(s));
          ctx.s('path', { d: 'M' + f2(tc[0]) + ' ' + f2(tc[1]) + 'L' + f2(pt[0]) + ' ' + f2(pt[1]), class: 'mz-drag-line', 'stroke-width': U * 0.08 }, V.dragG);
          ctx.s('circle', { cx: pt[0], cy: pt[1], r: U * 0.2, class: 'mz-drag-end' }, V.dragG);
        }
      },
      up(pt) {
        const dd = drag;
        drag = null;
        V.dragG.innerHTML = '';
        if (!dd || busy) return;
        if (dd.onTok && dd.moved) { K.drop(api, pt, [pt[0] - dd.p0[0], pt[1] - dd.p0[1]], cellAt(pt)); return; }
        if (!dd.moved) K.tap(api, pt, cellAt(pt), dd.onTok);
      },
      hover(pt) {
        const c = cellAt(pt);
        V.marks.querySelectorAll('.hot').forEach((el) => el.classList.remove('hot'));
        if (c < 0) return;
        V.marks.querySelectorAll('[data-cell="' + c + '"]').forEach((el) => el.classList.add('hot'));
      }
    };
    function cellAt(pt) {
      const x = Math.floor(pt[0] / U), y = Math.floor(pt[1] / U);
      return x >= 0 && y >= 0 && x < w && y < h ? y * w + x : -1;
    }
    V.cellAt = cellAt;

    if (K.marks) {
      const btn = ctx.button('Dots for legal moves: ' + (dotsOn ? 'on' : 'off'), () => {
        dotsOn = !dotsOn;
        C.store.set('mz:dots', dotsOn);
        btn.textContent = 'Dots for legal moves: ' + (dotsOn ? 'on' : 'off');
        drawMarks();
      }, 'small ghost');
    }
    if (K.panel) K.panel(V, api);
    redraw();

    function solvableBack() {
      // how many moves must be taken back before the goal is reachable again
      for (let k = hist.length - 1; k >= 0; k--) if (ML.bfs(m, hist[k]).par != null) return { k, need: hist.length - k };
      return null;
    }

    return {
      check() {
        if (m.isGoal(s)) return { solved: true, msg: K.solvedMsg ? K.solvedMsg(V, hist.length) : '' };
        return { solved: false, msg: 'Not there yet.' };
      },
      hint() {
        const r = ML.bfs(m, s);
        if (r.par == null) {
          const b = solvableBack();
          return 'From here the goal can no longer be reached — you are in a trap. Take back ' + (b ? C.plural(b.need, 'move') : 'some moves') + ' (Backspace or Undo) and try another way.';
        }
        if (r.par === 0) return 'You are there!';
        const mv = r.path[0];
        return {
          text: cap1(K.describe(V, s, mv)) + '. ' + (r.par === 1 ? 'That finishes it.' : 'From there it takes ' + C.plural(r.par - 1, 'more move') + '.'),
          show() {
            V.hintG.innerHTML = '';
            const pts = K.segment ? K.segment(V, s, mv.s) : [cen(m.cellOf(s)), cen(m.cellOf(mv.s))];
            if (pts && pts.length > 1) ctx.s('path', { d: 'M' + pts.map((q) => f2(q[0]) + ' ' + f2(q[1])).join('L'), class: 'mz-hint-path', 'stroke-width': U * 0.09 }, V.hintG);
            const q = pts ? pts[pts.length - 1] : cen(m.cellOf(mv.s));
            ctx.s('circle', { cx: q[0], cy: q[1], r: U * 0.42, class: 'mz-hint-ring' }, V.hintG);
            clearTimeout(hintT);
            hintT = setTimeout(() => { V.hintG.innerHTML = ''; }, 4500);
          }
        };
      },
      solve() {
        stopAnim();
        let r = ML.bfs(m, s);
        if (r.par == null) {
          const b = solvableBack();
          if (b) { s = hist[b.k]; hist.length = b.k; } else { s = m.start; hist = []; }
          redraw();
          r = ML.bfs(m, s);
        }
        if (!r.path) return;
        ctx.lockUndo(true);
        busy = true;
        let k = 0;
        const next = () => {
          if (k >= r.path.length) { busy = false; ctx.lockUndo(false); ctx.changed('solve'); return; }
          play(r.path[k++], true, () => { hintT = setTimeout(next, C.anim(110)); });
        };
        next();
      },
      explain() {
        const r = ML.bfs(m, m.start);
        if (!r.path) return '';
        const cur = [];
        let st = m.start;
        r.path.forEach((mv) => { cur.push(K.describe(V, st, mv, true)); st = mv.s; });
        return (K.explainIntro ? K.explainIntro(V) + '\n\n' : '') + 'A shortest solution takes **' + C.plural(r.par, 'move') + '**' + (r.count > 1 ? ' (there are ' + r.count + ' of that length)' : ' and it is the only one that short') + ': ' + cur.map((t, i) => (i + 1) + '. ' + t).join('; ') + '.';
      },
      getState() { return { s, h: hist.slice() }; },
      setState(st) {
        stopAnim();
        if (!st || st.s == null) return;
        clearTimeout(hintT); ctx.lockUndo(false);
        s = st.s; hist = (st.h || []).slice(); cursor = null;
        V.hintG.innerHTML = '';
        redraw();
      },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.key === 'Backspace') { if (!busy && hist.length) { finishAnim(); ctx.undo(); } return true; }
        if (busy) return KEYDIR[ev.key] != null || ev.key === ' ';
        return K.key ? K.key(api, ev) === true : false;
      },
      destroy() { stopAnim(); clearTimeout(hintT); wb.handlers.board = null; }
    };
  }

  /* ================= logic mazes: one renderer per kind ================= */

  const RENDER = {};
  const tr = (q) => 'translate(' + f2(q[0]) + ' ' + f2(q[1]) + ')';
  const placeAt = (g, q) => g.setAttribute('transform', tr(q));
  const ARROW_GLYPH = 'M0 -16L12 -3H5V15H-5V-3H-12Z';

  function squares(V, cls) {
    const { ctx, w, h, U } = V;
    ctx.s('rect', { x: -4, y: -4, width: w * U + 8, height: h * U + 8, rx: 10, class: 'mz-frame' }, V.bg);
    V.sq = [];
    for (let i = 0; i < w * h; i++) {
      const x = i % w, y = (i - x) / w;
      V.sq.push(ctx.s('rect', { x: x * U + 2, y: y * U + 2, width: U - 4, height: U - 4, rx: 7, class: 'mz-sq ' + (cls || ''), 'data-key': 'q' + i }, V.bg));
    }
  }
  function ringToken(V) {
    const g = V.ctx.s('g', { class: 'mz-token' }, V.tokG);
    V.ctx.s('circle', { r: V.U * 0.46, class: 'mz-tok-halo' }, g);
    V.ctx.s('circle', { r: V.U * 0.39, class: 'mz-tok-ring', 'stroke-width': V.U * 0.075 }, g);
    V.tok = g;
    return g;
  }
  function markCell(V, i, cls) {
    const x = i % V.w, y = (i - x) / V.w, U = V.U;
    V.ctx.s('rect', { x: x * U + 5, y: y * U + 5, width: U - 10, height: U - 10, rx: 8, class: 'mz-target ' + (cls || ''), 'data-cell': i }, V.marks);
  }
  function hop(V, a, b, ms, lift) {
    return { ms, frame(t) { const e = ease(t), q = lerp(a, b, e); q[1] -= Math.sin(Math.PI * t) * lift; placeAt(V.tok, q); } };
  }
  function slideSpec(V, a, b, ms) { return { ms, frame(t) { placeAt(V.tok, lerp(a, b, ease(t))); } }; }
  function startPad(V, i) {
    const c = V.cen(i);
    V.ctx.s('circle', { cx: c[0], cy: c[1], r: V.U * 0.36, class: 'mz-startpad' }, V.bg);
  }
  // which way (0-3) a click at pt asks for, seen from the token; -1 on the token, -2 too far
  function tapDir(V, pt, far) {
    const c = V.cen(V.m.cellOf(V.state())), v = [pt[0] - c[0], pt[1] - c[1]], L = Math.hypot(v[0], v[1]);
    if (L < 0.32 * V.U) return -1;
    if (!far && L > 1.8 * V.U) return -2;
    return vecDir(v);
  }
  const vecDir = (v) => (Math.abs(v[0]) > Math.abs(v[1]) ? (v[0] > 0 ? 1 : 3) : (v[1] > 0 ? 2 : 0));

  /* ---------- arrows ---------- */
  RENDER.arrow = {
    draw(V) {
      const { ctx, m, U } = V;
      squares(V);
      startPad(V, m.start);
      V.glyphs = [];
      for (let i = 0; i < m.n; i++) {
        const c = V.cen(i);
        if (i === m.goal) { ctx.s('path', { d: STAR(U * 0.32), class: 'mz-star', transform: tr(c) }, V.board); V.glyphs.push(null); continue; }
        V.glyphs.push(ctx.s('path', { d: ARROW_GLYPH, class: 'mz-arrow', transform: tr(c) + ' rotate(' + 45 * m.dir[i] + ') scale(' + f2(U / 52) + ')' }, V.board));
      }
      ringToken(V);
    },
    place(V, s) { placeAt(V.tok, V.cen(s)); V.glyphs.forEach((g, i) => g && g.classList.toggle('cur', i === s)); },
    marks(V, s, moves) { const cu = V.cursor(); moves.forEach((mv) => markCell(V, mv.s, mv.s === cu ? 'cursor' : '')); },
    animate(V, from, mv) { return hop(V, V.cen(from), V.cen(mv.s), 140 + 50 * mv.dist, V.U * 0.14 * Math.sqrt(mv.dist)); },
    describe(V, s, mv, short) { return (short ? '' : 'move ') + mv.dist + ' ' + DIRW8[mv.dir] + ' to ' + V.name(mv.s); },
    after(V, s) { return V.m.dir[s] >= 0 ? 'On ' + V.name(s) + ': the arrow points ' + DIRW8[V.m.dir[s]] + '.' : ''; },
    arrived: () => 'Home — you reached the star.',
    tap(api, pt, cell, onTok) {
      if (cell < 0 || onTok) return;
      const mv = api.byCell(cell)[0];
      if (mv) api.play(mv);
      else api.refuse('From ' + api.V.name(api.s) + ' you may only move ' + DIRW8[api.m.dir[api.s]] + ', along its arrow.');
    },
    drop(api, pt, vec, cell) { RENDER.arrow.tap(api, pt, cell, false); },
    key(api, ev) {
      const moves = api.moves();
      if (/^[1-9]$/.test(ev.key)) {
        const mv = moves.find((x) => x.dist === +ev.key);
        if (mv) api.play(mv); else api.refuse('There is no square ' + ev.key + ' away along this arrow.');
        return true;
      }
      const k = KEYDIR[ev.key];
      if (k != null) {
        if (!moves.length) return true;
        const dv = D8(api.m.dir[api.s]), sgn = D4v[k][0] * dv[0] + D4v[k][1] * dv[1] >= 0 ? 1 : -1;
        const cu = api.V.cursor(), at = moves.findIndex((x) => x.s === cu);
        const idx = at < 0 ? (sgn > 0 ? 0 : moves.length - 1) : Math.max(0, Math.min(moves.length - 1, at + sgn));
        api.setCursor(moves[idx].s);
        api.say('**Enter** or **Space** moves to ' + api.V.name(moves[idx].s) + ' (' + C.plural(moves[idx].dist, 'square') + ' ' + DIRW8[moves[idx].dir] + ').', 'info');
        return true;
      }
      if (ev.key === 'Enter' || ev.key === ' ') {
        const cu = api.V.cursor(), mv = cu != null && moves.find((x) => x.s === cu);
        if (mv) { api.play(mv); return true; }
        return ev.key === ' ';
      }
      return false;
    },
    explainIntro: () => 'Work backwards from the star: which squares have an arrow pointing at it? Which squares point at *those*? The chain of squares that can reach the star is often much thinner than the board.'
  };
  const D4v = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const D8 = (k) => [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]][k] || [0, 0];

  /* ---------- numbers ---------- */
  RENDER.number = {
    draw(V) {
      const { ctx, m, U } = V;
      squares(V);
      startPad(V, m.start);
      V.glyphs = [];
      for (let i = 0; i < m.n; i++) {
        const c = V.cen(i);
        if (i === m.goal) { ctx.s('path', { d: STAR(U * 0.32), class: 'mz-star', transform: tr(c) }, V.board); V.glyphs.push(null); continue; }
        V.glyphs.push(ctx.s('text', { x: c[0], y: c[1] + U * 0.19, 'text-anchor': 'middle', class: 'mz-num', 'font-size': U * 0.52, text: String(m.num[i]) }, V.board));
      }
      ringToken(V);
    },
    place(V, s) { placeAt(V.tok, V.cen(s)); V.glyphs.forEach((g, i) => g && g.classList.toggle('cur', i === s)); },
    marks(V, s, moves) { moves.forEach((mv) => markCell(V, mv.s)); },
    animate(V, from, mv) { return hop(V, V.cen(from), V.cen(mv.s), 150 + 50 * mv.dist, V.U * 0.16 * Math.sqrt(mv.dist)); },
    describe(V, s, mv, short) { return (short ? '' : 'jump ') + mv.dist + ' ' + DIRW8[mv.dir] + ' to ' + V.name(mv.s); },
    after(V, s) { const n = V.m.num[s]; return n ? 'On a ' + n + ': the next jump is exactly ' + C.plural(n, 'square') + '.' : ''; },
    arrived: () => 'Home — you reached the star.',
    tryDir(api, k) {
      const mv = api.moves().find((x) => x.dir === 2 * k);
      if (mv) { api.play(mv); return; }
      const n = api.m.num[api.s];
      api.refuse('A jump of ' + n + ' ' + DIRW4[k] + ' would leave the board.');
    },
    tap(api, pt, cell, onTok) {
      if (cell < 0 || onTok) return;
      const mv = api.byCell(cell)[0];
      if (mv) api.play(mv);
      else { const n = api.m.num[api.s]; api.refuse('From a ' + n + ' you must jump exactly ' + C.plural(n, 'square') + ' along the row or the column.'); }
    },
    drop(api, pt, vec, cell) {
      const mv = api.byCell(cell)[0];
      if (mv) api.play(mv); else RENDER.number.tryDir(api, vecDir(vec));
    },
    key(api, ev) { const k = KEYDIR[ev.key]; if (k == null) return false; RENDER.number.tryDir(api, k); return true; },
    explainIntro: () => 'Number mazes reward working backwards: list the squares from which a single jump lands on the star, then the squares that jump onto those, until the list meets the start.'
  };

  /* ---------- streets: shared drawing ---------- */
  function nodeLabels(V) {
    const { ctx, m, d, U } = V;
    const sc = V.cen(d.start[1] * V.w + d.start[0]), gc = V.cen(m.goal);
    ctx.s('circle', { cx: gc[0], cy: gc[1], r: U * 0.3, class: 'mz-goal-ring' }, V.board);
    ctx.s('text', { x: sc[0] - U * 0.3, y: sc[1] - U * 0.22, 'text-anchor': 'middle', class: 'mz-sg', 'font-size': U * 0.3, text: 'S' }, V.board);
    ctx.s('text', { x: gc[0] + U * 0.32, y: gc[1] - U * 0.24, 'text-anchor': 'middle', class: 'mz-sg mz-g', 'font-size': U * 0.32, text: 'G' }, V.board);
  }
  function eachStreet(V, fn) {
    for (let i = 0; i < V.w * V.h; i++) {
      [1, 2].forEach((k) => {
        const c = M().streetOf(V.d, V.w, V.h, i, k);
        if (c !== '.') fn(i, i + (k === 1 ? 1 : V.w), c, k);
      });
    }
  }
  function streetsTap(R) {
    return {
      tap(api, pt, cell, onTok) { if (onTok) return; const k = tapDir(api.V, pt); if (k >= 0) R.tryDir(api, k); },
      drop(api, pt, vec) { R.tryDir(api, vecDir(vec)); },
      key(api, ev) { const k = KEYDIR[ev.key]; if (k == null) return false; R.tryDir(api, k); return true; }
    };
  }

  /* ---------- colour-alternating streets ---------- */
  RENDER.colour = {
    pad: [0.8, 0.8, 0.45, 0.45],
    draw(V) {
      const { ctx, m, U } = V;
      ctx.s('rect', { x: 0, y: 0, width: V.w * U, height: V.h * U, rx: 12, class: 'mz-town' }, V.bg);
      eachStreet(V, (i, j, c) => {
        const a = V.cen(i), b = V.cen(j);
        ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'mz-cstreet', stroke: COLHEX[c] || '#888', 'stroke-width': U * 0.15 }, V.board);
      });
      for (let i = 0; i < m.n; i++) { const c = V.cen(i); ctx.s('circle', { cx: c[0], cy: c[1], r: U * 0.11, class: 'mz-node', 'data-key': 'n' + i }, V.board); }
      nodeLabels(V);
      const g = V.ctx.s('g', { class: 'mz-token' }, V.tokG);
      V.need = ctx.s('circle', { r: U * 0.3, class: 'mz-need', 'stroke-width': U * 0.08 }, g);
      ctx.s('circle', { r: U * 0.19, class: 'mz-tok-dot' }, g);
      V.tok = g;
    },
    place(V, s) {
      placeAt(V.tok, V.cen(V.m.cellOf(s)));
      const last = V.m.lastOf(s), order = V.m.order;
      const need = last ? order[last % order.length] : null;
      V.need.setAttribute('stroke', need ? COLHEX[need] : 'var(--ink-2)');
      V.need.classList.toggle('free', !need);
    },
    status(V, s) {
      const last = V.m.lastOf(s), order = V.m.order;
      if (V.needEl) V.needEl.innerHTML = last ? 'Next street: <b style="color:' + COLHEX[order[last % order.length]] + '">' + COLNAME[order[last % order.length]] + '</b>' : 'Next street: <b>any colour</b>';
    },
    panel(V) { V.needEl = V.ctx.h('div.mz-need-line'); V.ctx.panel.appendChild(V.needEl); },
    marks(V, s, moves) {
      const a = V.cen(V.m.cellOf(s));
      moves.forEach((mv) => {
        const j = V.m.cellOf(mv.s), b = V.cen(j);
        V.ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'mz-street-glow', stroke: COLHEX[mv.col], 'stroke-width': V.U * 0.36, 'data-cell': j }, V.marks);
        V.ctx.s('circle', { cx: b[0], cy: b[1], r: V.U * 0.16, class: 'mz-street-dot', 'data-cell': j }, V.marks);
      });
    },
    animate(V, from, mv) { return slideSpec(V, V.cen(V.m.cellOf(from)), V.cen(V.m.cellOf(mv.s)), 190); },
    describe(V, s, mv, short) { return (short ? '' : 'take the ') + COLNAME[mv.col] + (short ? ' ' : ' street ') + DIRW4[mv.dir] + ' to ' + V.name(V.m.cellOf(mv.s)); },
    arrived: () => 'You reached G.',
    tryDir(api, k) {
      const m = api.m, node = m.cellOf(api.s), c = M().streetOf(m.d, m.w, m.h, node, k);
      if (c === '.') { api.refuse('No street goes ' + DIRW4[k] + ' from here.'); return; }
      const mv = api.moves().find((x) => x.dir === k);
      if (mv) { api.play(mv); return; }
      const last = m.lastOf(api.s);
      api.refuse('You came along a ' + COLNAME[m.order[last - 1]] + ' street, so the next must be ' + COLNAME[m.order[last % m.order.length]] + ' — this one is ' + COLNAME[c] + '.');
    },
    explainIntro: () => 'The trick is that one crossing counts as several places: arriving by red and arriving by blue are different positions, because they allow different next moves. Search the pairs (crossing, last colour) and the maze opens up.'
  };
  Object.assign(RENDER.colour, streetsTap(RENDER.colour));

  /* ---------- one-way streets ---------- */
  const HEADING_DEG = [-90, 0, 90, 180, -90];
  RENDER.streets = {
    pad: [0.8, 0.8, 0.45, 0.45],
    draw(V) {
      const { ctx, m, U } = V;
      ctx.s('rect', { x: 0, y: 0, width: V.w * U, height: V.h * U, rx: 12, class: 'mz-town' }, V.bg);
      const roads = ctx.s('g', { class: 'mz-roads' }, V.board);
      const paint = ctx.s('g', { class: 'mz-roadpaint' }, V.board);
      eachStreet(V, (i, j, c, k) => {
        const a = V.cen(i), b = V.cen(j);
        ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'mz-road', 'stroke-width': U * 0.36, 'data-key': 'r' + i + '-' + k }, roads);
        if (c === '=' || c === '|') ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'mz-road-mid', 'stroke-width': U * 0.035 }, paint);
        else {
          const fwd = c === '>' || c === 'v';
          const from = fwd ? a : b, to = fwd ? b : a, ang = Math.atan2(to[1] - from[1], to[0] - from[0]) * 180 / Math.PI;
          [0.36, 0.64].forEach((t) => { const q = lerp(from, to, t); ctx.s('path', { d: 'M-5 -6L3 0L-5 6', class: 'mz-chev', transform: tr(q) + ' rotate(' + f2(ang) + ') scale(' + f2(U / 44) + ')' }, paint); });
        }
      });
      for (let i = 0; i < m.n; i++) {
        if (![0, 1, 2, 3].some((k) => M().streetOf(V.d, V.w, V.h, i, k) !== '.')) continue;
        const c = V.cen(i);
        ctx.s('circle', { cx: c[0], cy: c[1], r: U * 0.19, class: 'mz-junction' }, roads);
      }
      nodeLabels(V);
      const g = ctx.s('g', { class: 'mz-token mz-car' }, V.tokG);
      V.carBody = ctx.s('g', null, g);
      ctx.s('rect', { x: -U * 0.24, y: -U * 0.14, width: U * 0.48, height: U * 0.28, rx: U * 0.08, class: 'mz-car-body' }, V.carBody);
      ctx.s('rect', { x: U * 0.04, y: -U * 0.1, width: U * 0.1, height: U * 0.2, rx: U * 0.03, class: 'mz-car-glass' }, V.carBody);
      ctx.s('circle', { cx: U * 0.21, cy: -U * 0.08, r: U * 0.035, class: 'mz-car-light' }, V.carBody);
      ctx.s('circle', { cx: U * 0.21, cy: U * 0.08, r: U * 0.035, class: 'mz-car-light' }, V.carBody);
      V.tok = g;
      V.heading = -90;
    },
    place(V, s) {
      placeAt(V.tok, V.cen(V.m.cellOf(s)));
      V.heading = HEADING_DEG[V.m.headOf(s)];
      V.carBody.setAttribute('transform', 'rotate(' + V.heading + ')');
    },
    panel(V) {
      const d = V.d;
      const sign = (label, inner) => '<span class="mz-sign"><svg viewBox="-12 -12 24 24"><circle r="10.5" fill="#fff" stroke="#d8443f" stroke-width="2.6"/>' + inner + '<path d="M-7.4 -7.4L7.4 7.4" stroke="#d8443f" stroke-width="2.4"/></svg>' + label + '</span>';
      const uturn = '<path d="M-3 6V-1a3.4 3.4 0 0 1 6.8 0V3" fill="none" stroke="#222" stroke-width="2"/><path d="M1.2 2.2L3.8 5.6L6.2 2.2" fill="none" stroke="#222" stroke-width="1.8"/>';
      const left = '<path d="M3 7V-1H-4" fill="none" stroke="#222" stroke-width="2"/><path d="M-1.5 -4L-5 -1L-1.5 2" fill="none" stroke="#222" stroke-width="1.8"/>';
      V.ctx.panel.appendChild(V.ctx.h('div.mz-rules', { html: sign('No U-turns', uturn) + (d.noLeft ? sign('No left turns', left) : '') }));
    },
    marks(V, s, moves) {
      const a = V.cen(V.m.cellOf(s));
      moves.forEach((mv) => {
        const j = V.m.cellOf(mv.s), b = V.cen(j);
        V.ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'mz-road-glow', 'stroke-width': V.U * 0.46, 'data-cell': j }, V.marks);
      });
    },
    animate(V, from, mv) {
      const a = V.cen(V.m.cellOf(from)), b = V.cen(V.m.cellOf(mv.s));
      const h0 = HEADING_DEG[V.m.headOf(from)];
      let h1 = HEADING_DEG[mv.dir];
      while (h1 - h0 > 180) h1 -= 360;
      while (h1 - h0 < -180) h1 += 360;
      return { ms: 260, frame(t) { const e = ease(t); placeAt(V.tok, lerp(a, b, e)); V.carBody.setAttribute('transform', 'rotate(' + f2(h0 + (h1 - h0) * Math.min(1, t * 2.2)) + ')'); } };
    },
    describe(V, s, mv, short) {
      const hd = V.m.headOf(s);
      const turn = hd >= 4 ? '' : mv.dir === hd ? ' (straight on)' : mv.dir === (hd + 1) % 4 ? ' (a right turn)' : ' (a left turn)';
      return (short ? '' : 'drive ') + DIRW4[mv.dir] + ' to ' + V.name(V.m.cellOf(mv.s)) + (short ? '' : turn);
    },
    arrived: () => 'You drove into G.',
    tryDir(api, k) {
      const m = api.m, node = m.cellOf(api.s), c = M().streetOf(m.d, m.w, m.h, node, k);
      if (c === '.') { api.refuse('No street goes ' + DIRW4[k] + ' from here.'); return; }
      if (!m.can(node, k)) { api.refuse('That street is one-way — the other way.'); return; }
      const why = m.rule(m.headOf(api.s), k);
      if (why === 'uturn') { api.refuse('No U-turns!'); return; }
      if (why === 'left') { api.refuse('No left turns — you could go round the block to the right instead.'); return; }
      if (why === 'right') { api.refuse('No right turns here.'); return; }
      const mv = api.moves().find((x) => x.dir === k);
      if (mv) api.play(mv);
    },
    explainIntro: () => 'With no U-turns, where you are is not enough: the direction you arrived from matters too. The search runs over (crossing, heading) pairs — four times as many places as there are crossings.'
  };
  Object.assign(RENDER.streets, streetsTap(RENDER.streets));

  /* ---------- the rolling die ---------- */
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  const EYE = [0.32, 0.55, 1];          // toward the viewer: an oblique view from the south-east, above
  const LIGHT = [-0.33, 0.28, 0.9];
  const proj = (q) => [q[0] - 0.32 * q[2], q[1] - 0.55 * q[2]];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function rot3(v, k, th) {
    const c = Math.cos(th), s = Math.sin(th), dk = dot3(k, v);
    const cr = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
    return [v[0] * c + cr[0] * s + k[0] * dk * (1 - c), v[1] * c + cr[1] * s + k[1] * dk * (1 - c), v[2] * c + cr[2] * s + k[2] * dk * (1 - c)];
  }
  const ROLL_AXIS = [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0]];
  // draw the die into g: base centred at c (world), orientation o = [top, north, east]; tipping toward dir by deg
  function drawDie(ctx, g, c, o, U, dir, deg) {
    g.innerHTML = '';
    const a = U * 0.6, h = a / 2;
    const C0 = [c[0] + U * 0.07, c[1] + U * 0.1, h];
    const faces = [
      { n: o[0], c: [0, 0, h], u: [1, 0, 0], v: [0, 1, 0], nr: [0, 0, 1] },
      { n: 7 - o[0], c: [0, 0, -h], u: [1, 0, 0], v: [0, -1, 0], nr: [0, 0, -1] },
      { n: o[1], c: [0, -h, 0], u: [-1, 0, 0], v: [0, 0, -1], nr: [0, -1, 0] },
      { n: 7 - o[1], c: [0, h, 0], u: [1, 0, 0], v: [0, 0, -1], nr: [0, 1, 0] },
      { n: o[2], c: [h, 0, 0], u: [0, -1, 0], v: [0, 0, -1], nr: [1, 0, 0] },
      { n: 7 - o[2], c: [-h, 0, 0], u: [0, 1, 0], v: [0, 0, -1], nr: [-1, 0, 0] }
    ];
    let R = (q) => q, Rn = (q) => q;
    if (dir != null && deg) {
      const k = ROLL_AXIS[dir], th = deg * Math.PI / 180;
      const pv = [[0, -h, -h], [h, 0, -h], [0, h, -h], [-h, 0, -h]][dir];
      R = (q) => { const r = rot3([q[0] - pv[0], q[1] - pv[1], q[2] - pv[2]], k, th); return [r[0] + pv[0], r[1] + pv[1], r[2] + pv[2]]; };
      Rn = (q) => rot3(q, k, th);
    }
    const W = (q) => { const r = R(q); return proj([C0[0] + r[0], C0[1] + r[1], C0[2] + r[2]]); };
    // the shadow on the board
    C.s('rect', { x: c[0] - U * 0.27, y: c[1] - U * 0.2, width: U * 0.62, height: U * 0.6, rx: U * 0.1, class: 'mz-die-shadow' }, g);
    const lz = Math.hypot(LIGHT[0], LIGHT[1], LIGHT[2]);
    faces.forEach((f) => {
      const nr = Rn(f.nr);
      if (dot3(nr, EYE) <= 0.001) return;
      const pt = (su, sv) => W([f.c[0] + f.u[0] * su + f.v[0] * sv, f.c[1] + f.u[1] * su + f.v[1] * sv, f.c[2] + f.u[2] * su + f.v[2] * sv]);
      const corners = [pt(-h, -h), pt(h, -h), pt(h, h), pt(-h, h)];
      const lit = 0.72 + 0.28 * Math.max(0, dot3(nr, LIGHT) / lz);
      const col = 'rgb(' + Math.round(246 * lit) + ',' + Math.round(242 * lit) + ',' + Math.round(230 * lit) + ')';
      C.s('path', { d: C.pathOf(corners), fill: col, class: 'mz-die-face' }, g);
      (PIPS[f.n] || []).forEach((pp) => {
        const pts = [];
        for (let k = 0; k < 10; k++) {
          const al = k * Math.PI / 5, r = h * 0.19;
          pts.push(pt(pp[0] * h * 0.52 + r * Math.cos(al), pp[1] * h * 0.52 + r * Math.sin(al)));
        }
        C.s('path', { d: C.pathOf(pts), class: 'mz-pip' + (f.n === 1 ? ' one' : '') }, g);
      });
    });
  }
  function pipTile(ctx, parent, c, n, U, cls) {
    (PIPS[n] || []).forEach((pp) => ctx.s('circle', { cx: c[0] + pp[0] * U * 0.2, cy: c[1] + pp[1] * U * 0.2, r: U * 0.062, class: cls || 'mz-tile-pip' }, parent));
  }
  function netSVG(o) {
    const S = 26, G = 3;
    const cells = [[o[1], 1, 0, 'N'], [7 - o[2], 0, 1, 'W'], [o[0], 1, 1, 'top'], [o[2], 2, 1, 'E'], [7 - o[1], 1, 2, 'S'], [7 - o[0], 1, 3, 'under']];
    let s = '<svg viewBox="-2 -2 ' + (3 * S + 2 * G + 4) + ' ' + (4 * S + 3 * G + 4) + '" class="mz-net">';
    cells.forEach(([n, cx, cy, lab]) => {
      const x = cx * (S + G), y = cy * (S + G);
      s += '<rect x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '" rx="4" class="' + (lab === 'top' ? 'top' : '') + '"/>';
      (PIPS[n] || []).forEach((pp) => { s += '<circle cx="' + (x + S / 2 + pp[0] * 6.5) + '" cy="' + (y + S / 2 + pp[1] * 6.5) + '" r="2.3"' + (n === 1 ? ' class="one"' : '') + '/>'; });
      s += '<text x="' + (x + 2.5) + '" y="' + (y + 7) + '">' + lab + '</text>';
    });
    return s + '</svg>';
  }

  RENDER.die = {
    draw(V) {
      const { ctx, m, U } = V;
      squares(V, 'mz-tile');
      for (let i = 0; i < m.n; i++) {
        const x = i % V.w, y = (i - x) / V.w, ch = m.g[y][x], c = V.cen(i);
        if (ch === '#') { V.sq[i].classList.add('mz-hole'); continue; }
        if (i === m.startCell) { ctx.s('circle', { cx: c[0], cy: c[1], r: U * 0.34, class: 'mz-startpad' }, V.bg); continue; }
        if (i === m.goal) ctx.s('rect', { x: x * U + 3.5, y: y * U + 3.5, width: U - 7, height: U - 7, rx: 7, class: 'mz-goal-tile' }, V.board);
        if (ch === '*') ctx.s('path', { d: STAR(U * 0.24), class: 'mz-star', transform: tr(c) }, V.board);
        else pipTile(ctx, V.board, c, +ch, U, i === m.goal ? 'mz-tile-pip gold' : 'mz-tile-pip');
      }
      V.tok = ctx.s('g', { class: 'mz-die' }, V.tokG);
    },
    place(V, s) { const [c, o] = V.m.dec(s); drawDie(V.ctx, V.tok, V.cen(c), o, V.U); },
    status(V, s) { if (V.netEl) { const o = V.m.dec(s)[1]; V.netEl.innerHTML = '<b>Your die, unfolded</b>' + netSVG(o); } },
    panel(V) { V.netEl = V.ctx.h('div.mz-netbox'); V.ctx.panel.appendChild(V.netEl); },
    marks(V, s, moves) { moves.forEach((mv) => markCell(V, V.m.cellOf(mv.s), 'die')); },
    sfx: 'snap',
    animate(V, from, mv) {
      const [c0, o0] = V.m.dec(from);
      return { ms: 280, frame(t) { drawDie(V.ctx, V.tok, V.cen(c0), o0, V.U, mv.dir, 90 * ease(t)); } };
    },
    describe(V, s, mv, short) { return (short ? '' : 'roll ') + DIRW4[mv.dir] + ' onto ' + V.name(V.m.cellOf(mv.s)) + ' (' + mv.o[0] + ' up)'; },
    after(V, s) { return 'The ' + V.m.dec(s)[1][0] + ' is on top.'; },
    arrived: () => 'The die has reached the goal.',
    tryDir(api, k) {
      const r = api.m.tryRoll(api.s, k);
      if (r.ok) { api.play(api.moves().find((x) => x.dir === k)); return; }
      const V = api.V, [c0, o0] = api.m.dec(api.s);
      const wob = { ms: 300, frame(t) { drawDie(V.ctx, V.tok, V.cen(c0), o0, V.U, k, 24 * Math.sin(Math.PI * t)); } };
      if (r.why === 'edge') api.refuse('The die would roll off the board.', wob);
      else if (r.why === 'hole') api.refuse('That square is a hole.', wob);
      else api.refuse('Rolling ' + DIRW4[k] + ' brings **' + r.o[0] + '** to the top, but that square shows ' + r.need + '.', wob);
    },
    tap(api, pt, cell, onTok) { if (onTok) return; const k = tapDir(api.V, pt); if (k >= 0) RENDER.die.tryDir(api, k); else if (k === -2) api.refuse('The die rolls one square at a time.'); },
    drop(api, pt, vec) { RENDER.die.tryDir(api, vecDir(vec)); },
    key(api, ev) { const k = KEYDIR[ev.key]; if (k == null) return false; RENDER.die.tryDir(api, k); return true; },
    explainIntro: () => 'A die has 24 ways to sit on a square, so each square is really 24 places. That is why the same square can be a dead end once and the way through the next time — it depends which face is up.'
  };

  /* ---------- the chase ---------- */
  function theseusIcon(ctx, g, U) {
    const k = U / 48;
    ctx.s('circle', { r: 14 * k, class: 'mz-theseus' }, g);
    ctx.s('path', { d: 'M' + (-10 * k) + ' ' + (-9 * k) + 'Q0 ' + (-25 * k) + ' ' + (10 * k) + ' ' + (-9 * k), class: 'mz-crest', 'stroke-width': 4.2 * k }, g);
    [-5, 5].forEach((x) => { ctx.s('circle', { cx: x * k, cy: -1 * k, r: 2.6 * k, fill: '#fff' }, g); ctx.s('circle', { cx: x * k + 0.6 * k, cy: -0.6 * k, r: 1.3 * k, fill: '#1b2140' }, g); });
    ctx.s('path', { d: 'M' + (-4 * k) + ' ' + (6 * k) + 'Q0 ' + (9 * k) + ' ' + (4 * k) + ' ' + (6 * k), fill: 'none', stroke: '#fff', 'stroke-width': 1.6 * k, 'stroke-linecap': 'round' }, g);
  }
  function minoIcon(ctx, g, U) {
    const k = U / 48;
    ctx.s('path', { d: 'M' + (-10 * k) + ' ' + (-8 * k) + 'Q' + (-22 * k) + ' ' + (-12 * k) + ' ' + (-18 * k) + ' ' + (-25 * k) + 'M' + (10 * k) + ' ' + (-8 * k) + 'Q' + (22 * k) + ' ' + (-12 * k) + ' ' + (18 * k) + ' ' + (-25 * k), class: 'mz-horns', 'stroke-width': 4.4 * k }, g);
    ctx.s('ellipse', { rx: 15 * k, ry: 14 * k, class: 'mz-mino' }, g);
    ctx.s('ellipse', { cx: 0, cy: 6 * k, rx: 8 * k, ry: 5.5 * k, class: 'mz-muzzle' }, g);
    [-3.2, 3.2].forEach((x) => ctx.s('circle', { cx: x * k, cy: 6 * k, r: 1.3 * k, fill: '#4a1f18' }, g));
    [-6, 6].forEach((x) => ctx.s('circle', { cx: x * k, cy: -3 * k, r: 2.2 * k, fill: '#ffd166' }, g));
    ctx.s('circle', { cx: 0, cy: 11 * k, r: 2.6 * k, fill: 'none', stroke: '#ffd166', 'stroke-width': 1.3 * k }, g);
  }
  function exitPoint(V) { const m = V.m, c = V.cen(m.exitCell), v = D4v[m.exitSide]; return [c[0] + v[0] * 0.95 * V.U, c[1] + v[1] * 0.95 * V.U]; }

  RENDER.chase = {
    pad: [0.95, 0.95, 0.95, 0.95],
    draw(V) {
      const { ctx, m, d, w, h, U } = V;
      squares(V, 'mz-stone');
      let wd = '';
      const seg = (x1, y1, x2, y2) => { wd += 'M' + f2(x1 * U) + ' ' + f2(y1 * U) + 'L' + f2(x2 * U) + ' ' + f2(y2 * U); };
      for (let y = 0; y < h; y++) for (let x = 0; x < w - 1; x++) if (d.ew[y][x] === '|') seg(x + 1, y, x + 1, y + 1);
      for (let y = 0; y < h - 1; y++) for (let x = 0; x < w; x++) if (d.sw[y][x] === '-') seg(x, y + 1, x + 1, y + 1);
      const ex = d.exit[0], ey = d.exit[1], es = m.exitSide;
      for (let x = 0; x < w; x++) { if (!(es === 0 && x === ex)) seg(x, 0, x + 1, 0); if (!(es === 2 && x === ex)) seg(x, h, x + 1, h); }
      for (let y = 0; y < h; y++) { if (!(es === 3 && y === ey)) seg(0, y, 0, y + 1); if (!(es === 1 && y === ey)) seg(w, y, w, y + 1); }
      ctx.s('path', { d: wd, class: 'mz-walls-shadow', 'stroke-width': U * 0.13, transform: 'translate(2 3)' }, V.board);
      ctx.s('path', { d: wd, class: 'mz-walls mz-cwalls', 'stroke-width': U * 0.12 }, V.board);
      const ep = exitPoint(V), ang = [-90, 0, 90, 180][es];
      ctx.s('path', { d: ARROWHEAD, class: 'mz-door-out', transform: tr(ep) + ' rotate(' + ang + ') scale(' + f2(U / 26) + ')' }, V.board);
      // the exit arrow sits where a coordinate label would be: hide that label
      const labs = V.bg.querySelectorAll('.mz-coords text');
      if (es === 0 && labs[ex]) labs[ex].style.display = 'none';
      if (es === 3 && labs[w + ey]) labs[w + ey].style.display = 'none';
      V.theseus = ctx.s('g', { class: 'mz-t' }, V.tokG);
      theseusIcon(ctx, V.theseus, U);
      V.mino = ctx.s('g', { class: 'mz-m' }, V.tokG);
      minoIcon(ctx, V.mino, U);
      V.tok = V.theseus;
    },
    place(V, s) {
      const m = V.m;
      if (s < 0) {
        placeAt(V.theseus, exitPoint(V));
        const prev = V.hist().filter((x) => x >= 0).pop();
        if (prev != null) placeAt(V.mino, V.cen(m.minoOf(prev)));
        return;
      }
      placeAt(V.theseus, V.cen(m.cellOf(s)));
      placeAt(V.mino, V.cen(m.minoOf(s)));
    },
    segment(V, a, b) {
      if (a < 0) return null;
      const ta = V.m.cellOf(a);
      if (b < 0) return [V.cen(ta), exitPoint(V)];
      const tb = V.m.cellOf(b);
      return ta === tb ? null : [V.cen(ta), V.cen(tb)];
    },
    animate(V, from, mv) { return RENDER.chase.run(V, from, mv.win ? -1 : V.m.cellOf(mv.s), mv.mp, mv.win); },
    run(V, from, t2, mp, win) {
      const a = V.cen(V.m.cellOf(from)), b = win ? exitPoint(V) : V.cen(t2);
      const mc = (mp || []).map((c) => V.cen(c));
      const ms = win || mc.length < 2 ? 330 : 640;
      return {
        ms,
        frame(t) {
          const f = win || mc.length < 2 ? 1 : 0.36;
          placeAt(V.theseus, lerp(a, b, ease(Math.min(1, t / f))));
          if (win || mc.length < 2) { if (mc[0]) placeAt(V.mino, mc[0]); return; }
          const u = Math.max(0, (t - f) / (1 - f)), steps = mc.length - 1;
          const k = Math.min(steps - 1, Math.floor(u * steps)), lu = u * steps - k;
          placeAt(V.mino, lerp(mc[k], mc[k + 1], ease(Math.min(1, lu))));
        }
      };
    },
    describe(V, s, mv, short) { return mv.win ? 'step out through the exit' : mv.dir === 4 ? 'wait' : (short ? '' : 'step ') + DIRW4[mv.dir] + (short ? '' : ' to ' + V.name(V.m.cellOf(mv.s))); },
    after(V, s) {
      const m = V.m, t = m.cellOf(s), mi = m.minoOf(s);
      const dist = Math.abs(t % V.w - mi % V.w) + Math.abs(Math.floor(t / V.w) - Math.floor(mi / V.w));
      return dist <= 2 ? 'The Minotaur is ' + (dist === 1 ? 'right beside you' : 'close') + '…' : '';
    },
    arrived: () => 'Theseus is out — the Minotaur is left snorting in the maze.',
    tryDir(api, k) {
      const r = api.m.tryMove(api.s, k);
      if (r.ok) { api.play(api.moves().find((x) => x.dir === k)); return; }
      if (r.blocked) { api.refuse('A wall is in the way.'); return; }
      const V = api.V, spec = RENDER.chase.run(V, api.s, r.t2, r.mp, false);
      const frame = spec.frame;
      spec.ms += 380;
      spec.frame = (t) => {
        const f = (spec.ms - 380) / spec.ms;
        frame(Math.min(1, t / f));
        V.tokG.classList.toggle('caught', t > f * 0.95);
        if (t >= 1) V.tokG.classList.remove('caught');
      };
      api.refuse(r.into ? 'That square is the Minotaur\'s — do not walk into his arms!' : 'Caught! ' + (k === 4 ? 'Waiting there' : 'That step') + ' lets the Minotaur reach you. (Not counted — try something else.)', spec);
    },
    tap(api, pt, cell, onTok) {
      if (onTok) { RENDER.chase.tryDir(api, 4); return; }
      const m = api.m, t = m.cellOf(api.s);
      const ep = exitPoint(api.V);
      if (t === m.exitCell && Math.hypot(pt[0] - ep[0], pt[1] - ep[1]) < 0.6 * api.V.U) { RENDER.chase.tryDir(api, m.exitSide); return; }
      const k = tapDir(api.V, pt);
      if (k >= 0) RENDER.chase.tryDir(api, k);
      else if (k === -2) api.refuse('Theseus moves one square at a time.');
    },
    drop(api, pt, vec) { RENDER.chase.tryDir(api, vecDir(vec)); },
    tapAnywhere: false,
    key(api, ev) {
      if (ev.key === ' ' || ev.key === '.') { RENDER.chase.tryDir(api, 4); return true; }
      const k = KEYDIR[ev.key];
      if (k == null) return false;
      RENDER.chase.tryDir(api, k);
      return true;
    },
    panel(V, api) { V.ctx.button('Wait a turn (Space)', () => { if (!api.busy()) RENDER.chase.tryDir(api, 4); }, 'small'); },
    explainIntro: () => 'The Minotaur is strong but stupid: he always tries to close the gap across first. Lure him behind a wall where moving across does not help him, and he stands there stuck while you walk round.'
  };

  /* ---------- ice and mirrors ---------- */
  function rockPath(i, r) {
    const rng = C.rng('rock' + i), n = 9;
    const pts = [];
    for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + rng() * 0.3, rr = r * (0.78 + rng() * 0.26); pts.push([rr * Math.cos(a), rr * Math.sin(a) * 0.9]); }
    let d = '';
    for (let k = 0; k < n; k++) {
      const p0 = pts[k], p1 = pts[(k + 1) % n], mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      d += (k ? '' : 'M' + f2((pts[n - 1][0] + p0[0]) / 2) + ' ' + f2((pts[n - 1][1] + p0[1]) / 2)) + 'Q' + f2(p0[0]) + ' ' + f2(p0[1]) + ' ' + f2(mid[0]) + ' ' + f2(mid[1]);
    }
    return d + 'Z';
  }
  RENDER.ice = {
    tapAnywhere: true,
    draw(V) {
      const { ctx, m, U } = V;
      squares(V, 'mz-icesq');
      for (let i = 0; i < m.n; i++) {
        const x = i % V.w, y = (i - x) / V.w, ch = m.g[y][x], c = V.cen(i);
        const rr = C.rng('ice' + i);
        if (ch === '.' && rr() < 0.35) { const a = [x * U + 8 + rr() * 18, y * U + 10 + rr() * 22]; ctx.s('path', { d: 'M' + f2(a[0]) + ' ' + f2(a[1]) + 'l' + f2(8 + rr() * 8) + ' ' + f2(-5 - rr() * 5), class: 'mz-frost' }, V.bg); }
        if (ch === '#') {
          const g = ctx.s('g', { transform: tr(c), class: 'mz-rock' }, V.board);
          ctx.s('path', { d: rockPath(i, U * 0.4), class: 'mz-rock-body' }, g);
          ctx.s('path', { d: 'M' + f2(-U * 0.18) + ' ' + f2(-U * 0.12) + 'q' + f2(U * 0.1) + ' ' + f2(-U * 0.1) + ' ' + f2(U * 0.22) + ' ' + f2(-U * 0.06), class: 'mz-rock-hi', 'stroke-width': U * 0.05 }, g);
        } else if (ch === ':') {
          V.sq[i].classList.add('mz-snow');
          for (let k = 0; k < 6; k++) ctx.s('circle', { cx: x * U + 8 + rr() * (U - 16), cy: y * U + 8 + rr() * (U - 16), r: 1.6 + rr() * 1.4, class: 'mz-snowdot' }, V.bg);
        } else if (ch === '/' || ch === '\\') {
          const s1 = ch === '/' ? 1 : -1, e = U * 0.34;
          ctx.s('path', { d: 'M' + f2(c[0] - e) + ' ' + f2(c[1] + s1 * e) + 'L' + f2(c[0] + e) + ' ' + f2(c[1] - s1 * e), class: 'mz-mirror-back', 'stroke-width': U * 0.16 }, V.board);
          ctx.s('path', { d: 'M' + f2(c[0] - e) + ' ' + f2(c[1] + s1 * e) + 'L' + f2(c[0] + e) + ' ' + f2(c[1] - s1 * e), class: 'mz-mirror', 'stroke-width': U * 0.08 }, V.board);
        }
      }
      const gc = V.cen(m.goal);
      ctx.s('circle', { cx: gc[0], cy: gc[1], r: U * 0.34, class: 'mz-goal-mat' }, V.bg);
      const fl = ctx.s('g', { transform: tr([gc[0] - U * 0.05, gc[1] + U * 0.22]), class: 'mz-flagpole' }, V.board);
      ctx.s('path', { d: 'M0 0V' + f2(-U * 0.5), class: 'mz-pole', 'stroke-width': U * 0.045 }, fl);
      ctx.s('path', { d: 'M0 ' + f2(-U * 0.5) + 'L' + f2(U * 0.3) + ' ' + f2(-U * 0.4) + 'L0 ' + f2(-U * 0.3) + 'Z', class: 'mz-flag' }, fl);
      const g = ctx.s('g', { class: 'mz-token mz-puck' }, V.tokG);
      ctx.s('circle', { r: U * 0.3, class: 'mz-puck-body' }, g);
      ctx.s('circle', { r: U * 0.19, class: 'mz-puck-top' }, g);
      ctx.s('circle', { cx: -U * 0.07, cy: -U * 0.08, r: U * 0.05, class: 'mz-puck-shine' }, g);
      V.tok = g;
    },
    place(V, s) { placeAt(V.tok, V.cen(s)); },
    segment(V, a, b) {
      const mv = V.m.moves(a).find((x) => x.s === b);
      return mv ? mv.path.map((c) => V.cen(c)) : [V.cen(a), V.cen(b)];
    },
    sfx: false,
    animate(V, from, mv) {
      const pts = mv.path.map((c) => V.cen(c));
      V.ctx.sfx('tap');
      return { ms: 70 + 62 * (pts.length - 1), frame(t) { placeAt(V.tok, along(pts, 1 - (1 - t) * (1 - t))); if (t >= 1) V.ctx.sfx('snap'); } };
    },
    describe(V, s, mv, short) { return (short ? '' : 'slide ') + DIRW4[mv.dir] + (short ? ' to ' + V.name(mv.s) : ' (you come to rest on ' + V.name(mv.s) + ')'); },
    arrived: () => 'You came to rest on the flag.',
    tryDir(api, k) {
      const r = api.m.slide(api.s, k);
      if (!r) { api.refuse('Something is in the way — you cannot slide ' + DIRW4[k] + '.'); return; }
      if (r.loop) { api.refuse('You would spin round the mirrors for ever!'); return; }
      api.play(api.moves().find((x) => x.dir === k));
    },
    tap(api, pt, cell, onTok) { if (onTok) return; const k = tapDir(api.V, pt, true); if (k >= 0) RENDER.ice.tryDir(api, k); },
    drop(api, pt, vec) { RENDER.ice.tryDir(api, vecDir(vec)); },
    key(api, ev) { const k = KEYDIR[ev.key]; if (k == null) return false; RENDER.ice.tryDir(api, k); return true; },
    explainIntro: () => 'On ice the only places that matter are the places you can stop. Mark them — beside rocks, against walls, on snow — and the maze becomes a small map of stopping points joined by slides.'
  };

  /* ================= the engine ================= */

  const FLAVOUR = {
    square: ['Box Hedge', 'Stone Court', 'Walled Garden', 'Yew Walk', 'Cloister'],
    hex: ['Honeycomb', 'Beehive', 'Basalt Steps', 'Wasps\' Nest'],
    theta: ['Round Tower', 'Rose Window', 'Tree Rings', 'Whirlpool'],
    arrow: ['Signposts', 'Weathervanes', 'Compass Rose', 'Arrow Storm', 'Pointing Fingers'],
    number: ['Leapfrog', 'Hopscotch', 'Kangaroo Court', 'Springboards', 'Stepping Stones'],
    colour: ['Painted Streets', 'Two-Tone Town', 'Red Letter Day', 'Bunting'],
    streets: ['One-Way Town', 'Rush Hour', 'Sunday Driver', 'Traffic Warden'],
    die: ['Rolling Stone', 'Tumbling Cube', 'Snake Eyes', 'Six of One', 'Loaded Die'],
    chase: ['Horns in the Dark', 'Two Steps Behind', 'Bull Run', 'The Lair', 'Ariadne\'s Thread'],
    ice: ['Frozen Lake', 'Skating Rink', 'Glacier', 'Black Ice', 'Cold Snap']
  };
  function endlessTitle(d, rng) {
    let key = d.kind === 'labyrinth' ? d.grid : d.kind;
    if (d.kind === 'ice' && (iceHas(d, '/') || iceHas(d, '\\'))) return rng.pick(['Hall of Mirrors', 'Periscope', 'Looking-Glass Lake']) + ' · ' + d.rows[0].length + ' × ' + d.rows.length;
    const name = rng.pick(FLAVOUR[key] || ['Maze']);
    if (d.kind === 'labyrinth') return name + ' · ' + labSize(d);
    const m = M().model(d);
    return name + ' · ' + m.w + ' × ' + m.h;
  }

  function verifyLab(p) {
    const d = p.data, ML = M();
    if (!['square', 'hex', 'theta'].includes(d.grid)) return { ok: false, err: 'grid must be square, hex or theta' };
    if (d.grid === 'square' && !(d.w >= 2 && d.h >= 2)) return { ok: false, err: 'w and h are needed' };
    if (d.grid !== 'square' && !(d.R >= 2 || (d.shape === 'rect' && d.w >= 2 && d.h >= 2))) return { ok: false, err: 'R is needed' };
    const L = ML.buildLabyrinth(d);
    const path = ML.pathIn(L, L.start, L.goal);
    if (!path) return { ok: false, err: 'no way through' };
    const par = path.length - 1;
    if (!par) return { ok: false, err: 'the start is the goal' };
    if (p.par != null && p.par !== par) return { ok: false, err: 'par is ' + p.par + ' but the way through is ' + par + ' steps' };
    if (!d.braid) {
      let e = 0;
      L.open.forEach((o) => { e += o.length; });
      const reach = new Set([L.start]), q = [L.start];
      while (q.length) { const c = q.pop(); L.open[c].forEach((j) => { if (!reach.has(j)) { reach.add(j); q.push(j); } }); }
      if (e / 2 !== L.g.n - 1 || reach.size !== L.g.n) return { ok: false, err: 'not a perfect maze' };
    }
    return { ok: true, par };
  }

  C.engine({
    id: 'mazes',
    name: 'Mazes',
    deps: ['js/lib/mazes-logic.js'],
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    workbench: { selectFrame: false, ctxBar: false },
    about(p) { return ABOUT[(p && p.data && p.data.kind) || 'labyrinth'] || ABOUT.labyrinth; },

    verify(p) {
      const d = p.data;
      if (!d || !d.kind) return { ok: false, err: 'data.kind is needed' };
      try {
        if (d.kind === 'labyrinth') return verifyLab(p);
        if (d.kind === 'unicursal') { const U = M().unicursal(d); return U.ok ? { ok: true } : { ok: false, err: U.err }; }
        if (!RENDER[d.kind]) return { ok: false, err: 'unknown kind ' + d.kind };
        const m = M().model(d);
        if (!(m.w >= 2 && m.h >= 2)) return { ok: false, err: 'the board is too small' };
        if ((d.kind === 'arrow' || d.kind === 'number') && m.goal < 0) return { ok: false, err: 'no goal square (★ or *)' };
        const r = M().bfs(m);
        if (r.par == null) return { ok: false, err: 'no solution' };
        if (r.par === 0) return { ok: false, err: 'solved at the start' };
        if (p.par != null && p.par !== r.par) return { ok: false, err: 'par is ' + p.par + ' but the fewest moves is ' + r.par };
        return r.count > 60 ? { ok: true, par: r.par, warn: r.count + ' shortest solutions' } : { ok: true, par: r.par };
      } catch (e) {
        return { ok: false, err: 'bad data: ' + e.message };
      }
    },

    generate(rng, level, fam) {
      const fid = fam && fam.id;
      const kind = fid === 'labyrinths' ? 'labyrinth' : fid === 'rolling-die' ? 'die' : fid === 'chase-mazes' ? 'chase' : fid === 'sliding-mazes' ? 'ice'
        : rng.pick(['arrow', 'arrow', 'number', 'number', 'colour', 'streets']);
      const r = M().GEN[kind](rng, level, {});
      if (!r || r.par == null) return null;
      return { title: endlessTitle(r.data, rng), text: statement(r.data), par: r.par, diff: level, data: r.data };
    },

    mount(ctx, p) {
      const k = p.data.kind;
      if (k === 'labyrinth') return mountLabyrinth(ctx, p);
      if (k === 'unicursal') return mountUnicursal(ctx, p);
      return mountLogic(ctx, p);
    },

    thumb(p) {
      const d = p.data;
      if (d.kind === 'labyrinth') return thumbLab(d);
      if (d.kind === 'unicursal') return thumbUni(d);
      return thumbGrid(d);
    }
  });

  C.mazeText = { statement, goalText, labSize, cellName, DIRW4, DIRW8, COLNAME };

  C.css('mazes', `
    .mz-cell { fill: var(--board); stroke: var(--board); stroke-width: 1; }
    .mz-cell.wb-painted { fill-opacity: .55; }
    .mz-walls { fill: none; stroke: var(--ink); stroke-linecap: round; stroke-linejoin: round; }
    .mz-walls-hex { stroke: var(--wood); }
    .mz-walls-theta { stroke: var(--teal); }
    .mz-walls-shadow { fill: none; stroke: #000; opacity: .25; stroke-linecap: round; }
    .mz-marks, .mz-star, .mz-goal-tile, .mz-startpad, .mz-goal-ring, .mz-rock, .mz-mirror, .mz-mirror-back, .mz-flagpole, .mz-goal-mat,
    .mz-trail, .mz-hint, .mz-drag, .mz-cstreet, .mz-roadpaint, .mz-junction, .mz-tokens, .mz-uni-labels { pointer-events: none; }
    .mz-door-in { fill: var(--green); }
    .mz-door-out { fill: var(--gold); animation: mzblink 1.4s ease-in-out infinite; }
    .mz-goal-star, .mz-star { fill: var(--gold); stroke: rgba(0,0,0,.28); stroke-width: 1; }
    .mz-trail-glow { fill: none; stroke: var(--gold); opacity: .2; stroke-linecap: round; stroke-linejoin: round; }
    .mz-trail-line { fill: none; stroke: var(--gold); stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 3px var(--gold)); }
    .mz-trail.arrived .mz-trail-line { stroke-dasharray: 14 9; animation: mzflow .7s linear infinite; }
    .mz-trail.arrived .mz-trail-glow { opacity: .34; }
    .mz-crumbs { fill: none; stroke: var(--gold); opacity: .38; stroke-linecap: round; }
    .mz-head-halo { fill: var(--gold); opacity: .22; animation: mzpulse 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .mz-head-dot { fill: #fff6d6; stroke: var(--gold); stroke-width: 3; }
    .mz-trail.arrived .mz-head-halo { animation: mzarrive 1s ease-out infinite; opacity: .5; }
    .mz-head-in.bump, .mz-tokens.bump { animation: mzshake .26s; }
    .mz-hint-path { fill: none; stroke: var(--accent); stroke-dasharray: 8 6; stroke-linecap: round; stroke-linejoin: round; animation: mzflow .6s linear infinite; }
    .mz-hint-ring { fill: none; stroke: var(--accent); stroke-width: 3; animation: mzblink .9s ease-in-out infinite; }
    @keyframes mzpulse { 50% { opacity: .07; transform: scale(1.3); } }
    @keyframes mzarrive { from { transform: scale(.9); opacity: .6; } to { transform: scale(2.2); opacity: 0; } }
    @keyframes mzblink { 50% { opacity: .35; } }
    @keyframes mzflow { to { stroke-dashoffset: -23; } }
    @keyframes mzshake { 20% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 80% { transform: translateX(-2px); } }

    .mz-uni .mz-hedge { fill: #3d6a45; }
    .mz-hedge-line { fill: none; stroke: #2b4f31; stroke-width: 1.4; opacity: .7; }
    .mz-uni-path { fill: none; stroke: #eadcb6; stroke-linecap: round; stroke-linejoin: round; }
    .mz-uni-centre { fill: #eadcb6; }
    .mz-uni-labels text { font-weight: 700; fill: #9b8a5e; font-family: "Segoe UI", system-ui, sans-serif; pointer-events: none; }
    .mz-seq { font-size: .9rem; width: 100%; }
    .mz-seq-row { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-top: 4px; }
    .mz-seq-row span { display: inline-block; min-width: 1.6em; text-align: center; padding: 1px 6px; border-radius: 6px; background: var(--panel-2); font-weight: 700; }
    .mz-seq-row span.c { background: var(--gold); color: #222; }
    .mz-seq-row i { color: var(--muted); font-style: normal; }

    .mz-frame { fill: var(--board-2); stroke: var(--line); stroke-width: 2; }
    .mz-sq { fill: var(--cell); }
    .mz-sq.wb-painted { fill-opacity: .6; }
    .mz-coords text { font: 600 13px "Segoe UI", system-ui, sans-serif; fill: var(--faint); pointer-events: none; }
    .mz-arrow { fill: var(--ink-2); transition: fill .2s; pointer-events: none; }
    .mz-arrow.cur, .mz-num.cur { fill: var(--gold); }
    .mz-num { font-weight: 700; fill: var(--ink-2); font-family: "Segoe UI", system-ui, sans-serif; pointer-events: none; transition: fill .2s; }
    .mz-startpad { fill: none; stroke: var(--teal); stroke-width: 2; stroke-dasharray: 4 4; opacity: .7; }
    .mz-tok-halo { fill: var(--teal); opacity: .15; }
    .mz-tok-ring { fill: none; stroke: var(--teal); filter: drop-shadow(0 0 4px var(--teal)); transform-box: fill-box; transform-origin: center; }
    .mz-topl.arrived .mz-tok-ring, .mz-topl.arrived .mz-need { animation: mzbeat 1s ease-in-out infinite; }
    @keyframes mzbeat { 50% { transform: scale(1.18); } }
    .mz-target { fill: var(--teal); fill-opacity: .1; stroke: var(--teal); stroke-opacity: .55; stroke-width: 1.5; stroke-dasharray: 4 3; pointer-events: none; }
    .mz-target.hot, .mz-target.cursor { fill-opacity: .3; stroke-opacity: 1; stroke-dasharray: none; }
    .mz-target.cursor { animation: mzblink 1s ease-in-out infinite; }
    .mz-trail-logic .mz-trail-glow { stroke: var(--teal); opacity: .14; }
    .mz-trail-logic .mz-trail-line { stroke: var(--teal); opacity: .75; filter: none; stroke-dasharray: 1 9; }
    .mz-drag-line { stroke: var(--teal); stroke-dasharray: 5 5; opacity: .8; stroke-linecap: round; }
    .mz-drag-end { fill: var(--teal); opacity: .45; }

    .mz-town { fill: var(--board-2); stroke: var(--line); stroke-width: 2; }
    .mz-cstreet { stroke-linecap: round; opacity: .95; }
    .mz-node { fill: var(--board); stroke: var(--ink-2); stroke-width: 2; }
    .mz-node.wb-painted { fill-opacity: .9; }
    .mz-goal-ring { fill: none; stroke: var(--gold); stroke-width: 3; }
    .mz-sg { font-weight: 800; font-family: "Segoe UI", system-ui, sans-serif; fill: var(--teal); pointer-events: none; }
    .mz-sg.mz-g { fill: var(--gold); }
    .mz-need { fill: none; transform-box: fill-box; transform-origin: center; }
    .mz-need.free { stroke-dasharray: 4 4; }
    .mz-tok-dot { fill: var(--teal); stroke: #fff; stroke-width: 2; }
    .mz-street-glow { stroke-linecap: round; opacity: .3; pointer-events: none; }
    .mz-street-dot { fill: #fff; opacity: .75; pointer-events: none; }
    .mz-street-glow.hot { opacity: .6; }
    .mz-need-line { font-size: .92rem; }
    .mz-road { stroke: var(--faint); stroke-linecap: round; }
    .mz-road.wb-painted { stroke-opacity: .9; }
    .mz-junction { fill: var(--faint); }
    .mz-road-mid { stroke: var(--board); stroke-dasharray: 5 6; opacity: .85; }
    .mz-chev { fill: none; stroke: #fff; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; opacity: .92; }
    .mz-road-glow { stroke: var(--teal); opacity: .28; stroke-linecap: round; pointer-events: none; }
    .mz-road-glow.hot { opacity: .55; }
    .mz-car-body { fill: var(--red); stroke: rgba(0,0,0,.4); stroke-width: 1.5; }
    .mz-car-glass { fill: #bfe6ff; }
    .mz-car-light { fill: #ffe9a0; }
    .mz-rules { display: flex; gap: 12px; flex-wrap: wrap; font-size: .88rem; }
    .mz-sign { display: inline-flex; align-items: center; gap: 6px; }
    .mz-sign svg { width: 28px; height: 28px; }

    .mz-hole { fill: var(--bg); stroke: rgba(0,0,0,.45); stroke-width: 2; }
    .mz-tile-pip { fill: var(--ink-2); opacity: .7; pointer-events: none; }
    .mz-tile-pip.gold { fill: var(--gold); opacity: 1; }
    .mz-goal-tile { fill: none; stroke: var(--gold); stroke-width: 3; }
    .mz-die-shadow { fill: #000; opacity: .26; }
    .mz-die-face { stroke: rgba(40, 30, 20, .6); stroke-width: 1.2; stroke-linejoin: round; }
    .mz-pip { fill: #23263a; }
    .mz-pip.one { fill: #d8443f; }
    .mz-netbox { font-size: .9rem; }
    .mz-net { display: block; width: 104px; margin-top: 4px; }
    .mz-net rect { fill: #f4f1e8; stroke: rgba(0,0,0,.35); stroke-width: .8; }
    .mz-net rect.top { stroke: var(--gold); stroke-width: 2; }
    .mz-net circle { fill: #23263a; }
    .mz-net circle.one { fill: #d8443f; }
    .mz-net text { font: 600 5.5px "Segoe UI", system-ui, sans-serif; fill: #8a8577; }

    .mz-cwalls { stroke: var(--ink); }
    .mz-theseus { fill: #4f7bff; stroke: #fff; stroke-width: 1.5; }
    .mz-crest { fill: none; stroke: #ffd166; stroke-linecap: round; }
    .mz-mino { fill: #9c3f30; stroke: #3b140e; stroke-width: 1.2; }
    .mz-horns { fill: none; stroke: #f3e7c9; stroke-linecap: round; }
    .mz-muzzle { fill: #c9745f; }
    .mz-tokens.caught .mz-t { filter: drop-shadow(0 0 8px #ff6b6b); }
    .mz-tokens.caught .mz-m { filter: drop-shadow(0 0 6px #ffd166); }
    .mz-topl.arrived .mz-t { filter: drop-shadow(0 0 7px var(--green)); }

    .mz-sq.mz-icesq { fill: color-mix(in srgb, var(--water) 24%, var(--cell)); }
    .mz-sq.mz-icesq.mz-snow { fill: color-mix(in srgb, #ffffff 62%, var(--cell)); }
    .mz-frost { stroke: #fff; opacity: .28; stroke-width: 1.6; stroke-linecap: round; pointer-events: none; }
    .mz-rock-body { fill: #7a8294; stroke: #454b5e; stroke-width: 2; }
    .mz-rock-hi { fill: none; stroke: #c9cfdc; stroke-linecap: round; opacity: .8; }
    .mz-snowdot { fill: #fff; opacity: .75; pointer-events: none; }
    .mz-mirror-back { stroke: #394060; stroke-linecap: round; }
    .mz-mirror { stroke: #e8f6ff; stroke-linecap: round; filter: drop-shadow(0 0 3px #9fd8ff); }
    .mz-goal-mat { fill: var(--gold); fill-opacity: .2; stroke: var(--gold); stroke-width: 2; }
    .mz-pole { stroke: var(--ink-2); stroke-linecap: round; }
    .mz-flag { fill: var(--red); }
    .mz-puck-body { fill: var(--teal); stroke: rgba(0,0,0,.35); stroke-width: 2; }
    .mz-puck-top { fill: #8ff3ee; opacity: .55; }
    .mz-puck-shine { fill: #fff; opacity: .85; }
    .mz-topl.arrived .mz-puck-body { filter: drop-shadow(0 0 7px var(--gold)); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
