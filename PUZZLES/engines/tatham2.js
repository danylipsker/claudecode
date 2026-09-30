/* The Puzzle Cabinet · engines/tatham2.js
 *
 * Five favourites from Simon Tatham's Portable Puzzle Collection, played
 * with his rules and gestures; the puzzles themselves are our own, made by
 * tools/gen/tatham2.js (and by the Endless drawers):
 *
 *   net        turn the tiles until the pipes make one tree, lit from the source
 *              (also on a board that wraps around)
 *   magnets    fill domino slots with magnets or blanks; like poles never touch
 *   tracks     lay a railway from A to B; clues count the track squares
 *   signpost   number the arrows 1 … n; each points at the next
 *   range      shade squares; numbers count the squares they see (Kurodoko)
 *
 * The reasoning (solvers, graded steps, the words of the hints) lives in
 * js/lib/tatham2-logic.js.
 *
 * data (see tools/gen/tatham2.js):
 *   { kind: 'net', w, h, wrap, src, tiles: ['3a5…', …], sol: ['…'] }    hex masks per cell: 1 up 2 right 4 down 8 left
 *   { kind: 'magnets', w, h, dom: ['LRTB…'], rp, rm, cp, cm, sol: ['+-..', …] }   partner of each cell; counts (−1 hidden)
 *   { kind: 'tracks', w, h, a, b, rows, cols, given: [[cell, mask]], sol: ['…'] }  track enters left of row a, leaves below column b
 *   { kind: 'signpost', w, h, dirs: ['2461…*'], nums: [[cell, n]], sol: [order of each cell] }  0 up, 1 up-right … 7 up-left, * the end
 *   { kind: 'range', w, h, grid: ['..3..', …], sol: ['.#…'] }          numbers in base 36
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const LG = () => C.tatham2Logic;

  const ABOUT = {
    net: 'Turn the tiles so that all the pipes join up into **one network**: every pipe end meets another pipe, there are no loops, and every tile is connected to the **source** (the tile with the big box). Tiles joined to the source light up, so you can watch the network grow. **Click** a tile to turn it anticlockwise, **right-click** to turn it clockwise. **Shift-click** (or middle-click) **locks** a tile you are sure of, so it cannot be turned by mistake; the hints build on your locked tiles. Loops show in red. On a phone, tap turns (switch the direction in the panel) and a long press locks. **Keys:** arrows move a cursor, **A** or **Enter** anticlockwise, **D** clockwise, **F** half a turn, **S** or **Space** lock. In the *wrapping* puzzles a pipe that leaves one edge comes back at the opposite edge; **Shift+arrows** slide the whole picture around.',
    magnets: 'Every domino slot holds either a **magnet** — one **+** half and one **−** half — or a **blank**. Two **+** halves may never touch side by side, nor two **−** halves (diagonals are fine). The numbers at the top and left count the **+** halves in each column and row; the numbers at the bottom and right count the **−** halves. **Click** a half to put a magnet there with its **+** on that half; click again to turn it round, and again to clear. **Right-click** makes the slot blank; again marks it **?** (a magnet, way round unknown); again clears. Click a clue to tick it off. Poles that touch and broken counts turn red. **Keys:** arrows move a cursor, **+** and **−** place a pole, **.** blank, **?**, **Backspace** clears.',
    tracks: 'Lay one railway line from **A** (on the left edge) to **B** (on the bottom edge). The numbers above the columns and beside the rows say how many squares of each hold track. The track runs through the middles of squares, turning only by quarter circles; it never branches or crosses itself. Some pieces are laid for you. **Click** on the side between two squares to lay a piece of track across it, **right-click** there to mark that no track crosses it. **Click** in the middle of a square to mark it as a track square, **right-click** to mark it empty. **Drag** from square to square to lay a stretch of line in one go. Counts that are exceeded, branches and loops turn red. **Keys:** arrows move a cursor, **Shift+arrow** lays track that way, **Enter** marks track, **Space** marks empty.',
    signpost: 'Every square holds an arrow, except the last. Number the squares from **1** to the last so that each arrow points at the square with the next number — in its direction, at any distance. **1** and the last number are given, and some others. **Drag** from one square to another to link them (the first must point at the second; dragging the other way round works too). Linked squares form chains: a chain that reaches a number is numbered, other chains get letters (*a*, *a+1*, *a+2* …) and a colour of their own. **Drag** a square off the board, or **right-click** it, to cut its link. On a phone, tap one square and then the next. Chains whose numbers cannot fit turn red. **Keys:** arrows move a cursor, **Enter** picks a square and then links it to the next, **Backspace** cuts.',
    range: 'Shade some squares black. Each **number** tells how many squares it can see along its row and column — itself included — before the view is stopped by a black square or the edge. Numbered squares stay white, **black squares never touch** side by side, and all the white squares must stay **joined** in one piece. **Click** a square to shade it, **right-click** for a dot (a square you know is white); again to clear. **Drag** along a line to do a run. Hover a number to see what it sees. Touching blacks, numbers that see too much or too little, and white squares cut off from the rest turn red. **Keys:** arrows, **Enter** = black, **Space** = dot.'
  };
  const ABOUT_ALL = 'Five puzzles from Simon Tatham\'s collection share this cabinet: Net, Magnets, Tracks, Signpost and Range. The *How to* tab of each puzzle tells its rules and gestures.';
  const FAMILY_KIND = { net: 'net', magnets: 'magnets', tracks: 'tracks', signpost: 'signpost', range: 'range' };
  const KIND_NAMES = { net: 'Net', magnets: 'Magnets', tracks: 'Tracks', signpost: 'Signpost', range: 'Range' };
  function currentKind() {
    try {
      const hash = root.location && root.location.hash || '';
      let m = /#\/p\/([\w-]+)/.exec(hash);
      const p = m && C.byId[m[1]];
      if (p && p.data && p.data.kind) return p.data.kind;
      m = /#\/[xf]\/([\w-]+)/.exec(hash);
      return m ? FAMILY_KIND[m[1]] : null;
    } catch (e) { return null; }
  }

  /* ---------- the data as numbers ---------- */

  const hexRows = (rows) => { const out = []; rows.forEach((r) => { for (const ch of r) out.push(parseInt(ch, 16)); }); return out; };
  function netModel(d) {
    const tiles = hexRows(d.tiles), sol = hexRows(d.sol);
    return { P: LG().netPrep(d.w, d.h, !!d.wrap, tiles, d.src), tiles, sol };
  }
  function magModel(d) {
    const P = LG().magPrep(d.w, d.h, d.dom, { rp: d.rp, rm: d.rm, cp: d.cp, cm: d.cm });
    const sol = [];
    d.sol.forEach((r) => { for (const ch of r) sol.push(ch === '+' ? 1 : ch === '-' ? 2 : 4); });
    // the solution as domino marks
    const smark = P.doms.map(([a]) => (sol[a] === 1 ? 1 : sol[a] === 2 ? 2 : 3));
    return { P, sol, smark };
  }
  function trkModel(d) {
    const P = LG().trkPrep(d.w, d.h, d.a, d.b, d.rows, d.cols, d.given || []);
    return { P, sol: hexRows(d.sol) };
  }
  function spModel(d) {
    const N = d.w * d.h, dirs = [], nums = new Array(N).fill(0);
    d.dirs.forEach((r) => { for (const ch of r) dirs.push(ch === '*' ? -1 : +ch); });
    (d.nums || []).forEach(([i, n]) => { nums[i] = n; });
    const P = LG().spPrep(d.w, d.h, dirs, nums);
    const at = new Array(N + 1).fill(-1);
    d.sol.forEach((k, i) => { at[k] = i; });
    const next = d.sol.map((k) => (k < N ? at[k + 1] : -1));
    return { P, next, order: d.sol };
  }
  function rgModel(d) {
    const num = [], sol = [];
    d.grid.forEach((r) => { for (const ch of r) num.push(ch === '.' ? -1 : parseInt(ch, 36)); });
    d.sol.forEach((r) => { for (const ch of r) sol.push(ch === '#' ? 1 : 0); });
    return { P: LG().rgPrep(d.w, d.h, num), sol };
  }

  /* ---------- verify (node) ---------- */

  function verify(p) {
    const d = p.data, L = LG();
    if (!L) return { ok: false, err: 'js/lib/tatham2-logic.js is not loaded' };
    if (!d || !d.kind) return { ok: false, err: 'data.kind is missing' };
    const N = d.w * d.h;
    if (!(d.w >= 2 && d.h >= 2)) return { ok: false, err: 'w and h needed' };
    if (d.kind === 'net') {
      if (!d.tiles || d.tiles.join('').length !== N || !d.sol || d.sol.join('').length !== N) return { ok: false, err: 'tiles and sol must have w × h hex digits' };
      const M = netModel(d), P = M.P;
      for (let i = 0; i < N; i++) if (P.list[i].indexOf(M.sol[i]) < 0) return { ok: false, err: 'the solution turns tile ' + i + ' into another shape' };
      // the stored solution: every pipe met, one tree
      let edges = 0;
      for (let i = 0; i < N; i++) for (let dd = 0; dd < 4; dd++) {
        const bit = M.sol[i] >> dd & 1, j = P.nb[4 * i + dd];
        if (j < 0) { if (bit) return { ok: false, err: 'a pipe runs off the board' }; continue; }
        if (bit !== (M.sol[j] >> ((dd + 2) & 3) & 1)) return { ok: false, err: 'a pipe end is not met' };
        edges += bit;
      }
      if (edges / 2 !== N - 1) return { ok: false, err: 'the solution is not a tree' };
      const g = L.netGrade(P, 4);
      if (g.ok && g.open === 0) {
        for (let i = 0; i < N; i++) if ((1 << M.sol[i]) !== g.S.al[i]) return { ok: false, err: 'logic finds a different network' };
        return { ok: true };
      }
      const c = L.netCount(P, null, 2);
      if (c.capped) return { ok: false, err: 'the solver gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      if (c.sols[0].join() !== M.sol.join()) return { ok: false, err: 'the solver found another network' };
      return { ok: true };
    }
    if (d.kind === 'magnets') {
      if (!d.dom || d.dom.join('').length !== N || !d.sol || d.sol.join('').length !== N) return { ok: false, err: 'dom and sol needed' };
      if (N % 2) return { ok: false, err: 'an odd number of squares' };
      for (let i = 0; i < N; i++) {
        const ch = d.dom[Math.floor(i / d.w)][i % d.w], r = Math.floor(i / d.w), c = i % d.w;
        const j = ch === 'L' ? i - 1 : ch === 'R' ? i + 1 : ch === 'T' ? i - d.w : ch === 'B' ? i + d.w : -1;
        const ok = (ch === 'L' && c > 0) || (ch === 'R' && c < d.w - 1) || (ch === 'T' && r > 0) || (ch === 'B' && r < d.h - 1);
        if (!ok) return { ok: false, err: 'domino letters broken at ' + i };
        const back = d.dom[Math.floor(j / d.w)][j % d.w];
        if ({ L: 'R', R: 'L', T: 'B', B: 'T' }[ch] !== back) return { ok: false, err: 'dominoes do not pair at ' + i };
      }
      const M = magModel(d), P = M.P;
      // the stored solution keeps every rule
      const D = Uint8Array.from(M.sol);
      if (L.magProp(P, D, 1, 0)) return { ok: false, err: 'the stored solution breaks the rules' };
      for (const [a, b] of P.doms) if (!((M.sol[a] === 4 && M.sol[b] === 4) || M.sol[a] + M.sol[b] === 3)) return { ok: false, err: 'a domino is half a magnet' };
      const g = L.magGrade(P, 3);
      if (g.ok && g.open === 0) {
        for (let i = 0; i < N; i++) if (g.D[i] !== M.sol[i]) return { ok: false, err: 'logic finds a different solution' };
        return { ok: true };
      }
      const c = L.magCount(P, null, 2);
      if (c.capped) return { ok: false, err: 'the solver gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      for (let i = 0; i < N; i++) if (c.sols[0][i] !== M.sol[i]) return { ok: false, err: 'the solver found another solution' };
      return { ok: true };
    }
    if (d.kind === 'tracks') {
      if (!d.rows || d.rows.length !== d.h || !d.cols || d.cols.length !== d.w || !d.sol || d.sol.join('').length !== N) return { ok: false, err: 'rows, cols and sol needed' };
      if (!(d.a >= 0 && d.a < d.h && d.b >= 0 && d.b < d.w)) return { ok: false, err: 'A or B off the board' };
      const M = trkModel(d), P = M.P;
      // the stored line: from A to B, every square twice-connected, the counts right
      for (let i = 0; i < N; i++) {
        const m = M.sol[i], k = L.BITS[m];
        if (k !== 0 && k !== 2) return { ok: false, err: 'the stored track branches or stops at ' + i };
        for (let dd = 0; dd < 4; dd++) {
          if (!(m >> dd & 1)) continue;
          const e = P.eid[4 * i + dd];
          if (e < 0) return { ok: false, err: 'the stored track runs off the board' };
          if (e < 2 * N && !(M.sol[P.nb[4 * i + dd]] >> ((dd + 2) & 3) & 1)) return { ok: false, err: 'the stored track is broken' };
        }
      }
      if (!(M.sol[P.A] & 8) || !(M.sol[P.B] & 4)) return { ok: false, err: 'the track does not start at A and end at B' };
      for (let li = 0; li < P.lines.length; li++) if (P.lines[li].filter((i) => M.sol[i]).length !== P.clue[li]) return { ok: false, err: 'a clue does not match the track' };
      for (const [i, m] of d.given || []) if (M.sol[i] !== m) return { ok: false, err: 'a given piece is not part of the track' };
      const g = L.trkGrade(P, 4);
      if (g.ok && g.open === 0) {
        if (L.trkMasks(P, g.S).join() !== M.sol.join()) return { ok: false, err: 'logic finds a different line' };
        return { ok: true };
      }
      const c = L.trkCount(P, null, 2);
      if (c.capped) return { ok: false, err: 'the solver gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      if (c.sols[0].join() !== M.sol.join()) return { ok: false, err: 'the solver found another line' };
      return { ok: true };
    }
    if (d.kind === 'signpost') {
      if (!d.dirs || d.dirs.join('').length !== N || !d.sol || d.sol.length !== N) return { ok: false, err: 'dirs and sol needed' };
      const M = spModel(d), P = M.P;
      if (Array.from(new Set(d.sol)).length !== N || d.sol.some((k) => !(k >= 1 && k <= N))) return { ok: false, err: 'sol must number the squares 1 … n' };
      for (let i = 0; i < N; i++) {
        if (d.sol[i] === N) { if (P.dirs[i] >= 0) return { ok: false, err: 'the last square has an arrow' }; continue; }
        if (P.succ[i].indexOf(M.next[i]) < 0) return { ok: false, err: 'the arrow of square ' + i + ' misses the next number' };
      }
      if (P.start < 0 || P.end < 0 || d.sol[P.start] !== 1 || d.sol[P.end] !== N) return { ok: false, err: '1 and the last number must be given' };
      for (const [i, n] of d.nums) if (d.sol[i] !== n) return { ok: false, err: 'a given number disagrees with the solution' };
      const g = L.spGrade(P, 3);
      if (g.ok && g.open === 0) {
        for (let i = 0; i < N; i++) if (g.S.nx[i] !== M.next[i]) return { ok: false, err: 'logic finds a different order' };
        return { ok: true };
      }
      const c = L.spCount(P, null, 2);
      if (c.capped) return { ok: false, err: 'the solver gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      if (Array.from(c.sols[0]).join() !== M.next.join()) return { ok: false, err: 'the solver found another order' };
      return { ok: true };
    }
    if (d.kind === 'range') {
      if (!d.grid || d.grid.join('').length !== N || !d.sol || d.sol.join('').length !== N) return { ok: false, err: 'grid and sol needed' };
      const M = rgModel(d), P = M.P;
      const full = L.rgNumbers(d.w, d.h, M.sol);
      for (let i = 0; i < N; i++) {
        if (P.num[i] > 0 && (M.sol[i] || full[i] !== P.num[i])) return { ok: false, err: 'a number does not match the stored solution' };
        if (M.sol[i]) for (const j of P.nb4[i]) if (M.sol[j]) return { ok: false, err: 'two black squares touch' };
      }
      const v = Int8Array.from(M.sol);
      if (L.rgProp(P, v, 2)) return { ok: false, err: 'the stored solution breaks the rules' };
      const g = L.rgGrade(P, 3);
      if (g.ok && g.open === 0) {
        for (let i = 0; i < N; i++) if (g.v[i] !== M.sol[i]) return { ok: false, err: 'logic finds a different solution' };
        return { ok: true };
      }
      const c = L.rgCount(P, null, 2);
      if (c.capped) return { ok: false, err: 'the solver gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      for (let i = 0; i < N; i++) if (c.sols[0][i] !== M.sol[i]) return { ok: false, err: 'the solver found another solution' };
      return { ok: true };
    }
    return { ok: false, err: 'unknown kind ' + d.kind };
  }

  /* ---------- statements ---------- */

  function textFor(d) {
    if (d.kind === 'net') return d.wrap
      ? 'Turn the tiles so that every pipe joins up into one network with no loops, all of it connected to the source. This board wraps around: a pipe leaving one edge comes back in at the opposite edge.'
      : 'Turn the tiles so that every pipe joins up into one network with no loops and no loose ends, all of it connected to the source in the middle.';
    if (d.kind === 'magnets') return 'Fill every domino slot with a magnet (a **+** half and a **−** half) or leave it blank. Like poles never touch side by side. The numbers count the **+** halves (top and left) and the **−** halves (bottom and right) in each line.';
    if (d.kind === 'tracks') return 'Lay one railway line from A to B. The numbers count the track squares in each row and column; the line never branches or crosses itself, and the pieces already laid belong to it.';
    if (d.kind === 'signpost') return 'Number the squares from 1 to ' + d.w * d.h + ' so that every arrow points at the square with the next number, in its direction and at any distance.';
    return 'Shade some squares. Every number counts the squares it sees along its row and column, itself included, up to a black square or the edge. Black squares never touch side by side, and the white squares stay joined in one piece.';
  }
  const GOALS = {
    net: 'Every tile connected to the source: no loose ends, no loops.',
    magnets: 'Every slot a magnet or a blank; like poles never touch; every count right.',
    tracks: 'One line from A to B with the right number of track squares in every row and column.',
    signpost: 'One chain 1 → 2 → … → n, each arrow pointing at the next number.',
    range: 'Every number sees exactly that many squares; blacks never touch; the whites stay joined.'
  };

  /* ---------- shared pieces for the boards ---------- */

  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const cnt = (k) => WORDS[k] || String(k);
  let uid = 0;

  /* The hint routine every board shares: first wrong marks (outlined, then
   * rubbed out), then the next step (shown, then filled in on the next hint).
   * api: wrong() -> items, rubOut(items), step() -> { text, set, focus } | null,
   * apply(set) -> the items it changed, done(item), show(step), showWrong(items),
   * clear(), flash(items), evaluate() -> { solved, msg }, noun(k) -> words for k items */
  function makeHinter(ctx, api) {
    let pending = null;
    return {
      reset() { pending = null; },
      hint() {
        const wrong = api.wrong();
        if (wrong.length) {
          const one = wrong.length === 1;
          if (pending && pending.fix) {
            api.rubOut(wrong);
            pending = null;
            api.clear();
            api.refresh();
            ctx.changed('hint');
            return 'I took back ' + (one ? 'the wrong ' + api.wrongWord : 'the ' + wrong.length + ' wrong ' + api.wrongWord + 's') + '. Carry on from here.';
          }
          pending = { fix: true };
          return {
            text: (one ? 'One of your ' + api.wrongWord + 's is wrong' : wrong.length + ' of your ' + api.wrongWord + 's are wrong') + ' (outlined in red). Look again — or ask for another hint and I will take ' + (one ? 'it' : 'them') + ' back.',
            show() { api.showWrong(wrong); }
          };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter((x) => !api.done(x));
          pending = null;
          if (todo.length) {
            const items = api.apply(todo);
            api.clear();
            api.refresh();
            ctx.changed('hint');
            return { text: 'Done: ' + api.describe(todo) + ', as the last hint said.', show() { api.flash(items); } };
          }
        }
        const st = api.step();
        if (!st) {
          const r = api.evaluate();
          return r.solved ? 'It is solved already!' : 'Nothing is left to deduce: ' + (r.msg || 'look over your marks.');
        }
        pending = { set: st.set };
        return { text: st.text + ' *(Another hint puts ' + (st.set.length === 1 ? 'it' : 'them') + ' in for you.)*', show() { api.show(st); } };
      },
      forget() { pending = null; }
    };
  }

  // keyboard arrows
  const DIRKEY = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };

  /* =====================================================================
   *  NET
   * ===================================================================== */

  const NT = 48;                         // world units per tile
  const rotCW = (m) => ((m << 1) | (m >> 3)) & 15, rotCCW = (m) => ((m >> 1) | (m << 3)) & 15;
  const ARM_END = [[NT / 2, 0], [NT, NT / 2], [NT / 2, NT], [0, NT / 2]];

  // one tile's pipes, drawn into g (tile-local coordinates 0..NT)
  function netDraw(s, g, mask, isSrc, bad) {
    while (g.firstChild) g.removeChild(g.firstChild);
    const c = NT / 2, BITS = LG().BITS;
    let dO = '', dP = '', dB = '';
    for (let dd = 0; dd < 4; dd++) {
      if (!(mask >> dd & 1)) continue;
      const seg = 'M' + c + ' ' + c + 'L' + ARM_END[dd][0] + ' ' + ARM_END[dd][1];
      dO += seg;
      if (bad >> dd & 1) dB += seg; else dP += seg;
    }
    if (dO) s('path', { d: dO, class: 'nt-po' }, g);
    if (dP) s('path', { d: dP, class: 'nt-p' }, g);
    if (dB) s('path', { d: dB, class: 'nt-p bad' }, g);
    if (isSrc) {
      s('rect', { x: c - 12, y: c - 12, width: 24, height: 24, rx: 5, class: 'nt-src' }, g);
      s('circle', { cx: c, cy: c, r: 5, class: 'nt-srcdot' }, g);
    } else if (BITS[mask] === 1) {
      s('rect', { x: c - 9, y: c - 8, width: 18, height: 15, rx: 2.5, class: 'nt-term' }, g);
      s('rect', { x: c - 6, y: c - 5, width: 12, height: 9, rx: 1.2, class: 'nt-screen' }, g);
    } else if (BITS[mask] >= 3) s('circle', { cx: c, cy: c, r: 5.2, class: 'nt-hub' }, g);
  }

  function mountNet(ctx, p) {
    const d = p.data, wb = ctx.wb, s = ctx.s, L = LG();
    const M = netModel(d), P = M.P, w = d.w, h = d.h, N = w * h, wrap = !!d.wrap;
    const cur = Int8Array.from(M.tiles), lock = new Uint8Array(N);
    const start = Int8Array.from(cur);
    let sx = 0, sy = 0;
    const ui = { tap: 'acw' };
    let won = false, wonT = 0;
    const timers = [], later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const spin = new Array(N).fill(null);
    const curs = { r: Math.floor(d.src / w), c: d.src % w, on: false };

    ctx.setGoal(p.goal || GOALS.net);
    const MG = wrap ? NT * 0.55 : 0;
    wb.setBounds({ x0: -MG - 6, y0: -MG - 6, x1: w * NT + MG + 6, y1: h * NT + MG + 6 }, 0.04);

    const G = s('g', { class: 'nt' + (wrap ? ' nt-wrap' : '') }, wb.layer('board'));
    s('rect', { x: -4, y: -4, width: w * NT + 8, height: h * NT + 8, rx: 8, class: 'nt-boardbg' }, G);
    const cellG = s('g', null, G);
    let clipAttr = null;
    if (wrap) {
      const id = 'ntclip' + (++uid);
      const defs = s('defs', null, G);
      const cp = s('clipPath', { id }, defs);
      s('rect', { x: -MG, y: -MG, width: w * NT + 2 * MG, height: h * NT + 2 * MG, rx: 6 }, cp);
      clipAttr = 'url(#' + id + ')';
    }
    const ghostG = s('g', { class: 'nt-ghosts', 'clip-path': clipAttr }, G);
    const tileG = s('g', null, G);
    s('rect', { x: 0, y: 0, width: w * NT, height: h * NT, rx: 3, class: 'nt-frame' + (wrap ? ' wrap' : '') }, G);
    const topG = s('g', { class: 'nt-top' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const curEl = s('rect', { width: NT, height: NT, rx: 5, class: 'nt-cursor' }, topG);

    const dispX = (i) => ((i % w + sx) % w) * NT, dispY = (i) => ((Math.floor(i / w) + sy) % h) * NT;
    const bgEls = [], views = [], inner = [], sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) {
      bgEls.push(s('rect', { width: NT, height: NT, class: 'nt-cell', 'data-key': 'n' + i }, cellG));
      const outer = s('g', null, tileG), inn = s('g', { class: 'nt-tile' }, outer);
      views.push([outer]); inner.push(inn);
    }
    let ghosts = [];                 // [tile, group] drawn outside the frame (wrap)
    function place() {
      for (let i = 0; i < N; i++) {
        const x = dispX(i), y = dispY(i);
        bgEls[i].setAttribute('x', x); bgEls[i].setAttribute('y', y);
        views[i][0].setAttribute('transform', 'translate(' + x + ' ' + y + ')');
      }
      while (ghostG.firstChild) ghostG.removeChild(ghostG.firstChild);
      ghosts = [];
      if (wrap) {
        for (let i = 0; i < N; i++) {
          const dc = dispX(i) / NT, dr = dispY(i) / NT;
          const cs = [dc], rs = [dr];
          if (dc === 0) cs.push(w); if (dc === w - 1) cs.push(-1);
          if (dr === 0) rs.push(h); if (dr === h - 1) rs.push(-1);
          for (const r of rs) for (const c of cs) {
            if (r === dr && c === dc) continue;
            const g = s('g', { transform: 'translate(' + c * NT + ' ' + r * NT + ')', class: 'nt-tile' }, ghostG);
            ghosts.push([i, g]);
          }
        }
      }
      sig.fill('');
      drawCursor();
    }

    /* ---------- the network as it stands ---------- */
    let A = null;
    function analyse() {
      const adj = Array.from({ length: N }, () => []);
      const edges = [];
      for (let i = 0; i < N; i++) for (let dd = 1; dd <= 2; dd++) {
        const j = P.nb[4 * i + dd];
        if (j >= 0 && (cur[i] >> dd & 1) && (cur[j] >> ((dd + 2) & 3) & 1)) { const k = edges.length; edges.push([i, dd, j]); adj[i].push([j, k]); adj[j].push([i, k]); }
      }
      const lit = new Uint8Array(N), dist = new Int32Array(N).fill(-1), q = [P.src];
      lit[P.src] = 1; dist[P.src] = 0;
      for (let t = 0; t < q.length; t++) for (const [j] of adj[q[t]]) if (!lit[j]) { lit[j] = 1; dist[j] = dist[q[t]] + 1; q.push(j); }
      // edges on loops: the matched edges that are not bridges
      const disc = new Int32Array(N).fill(-1), low = new Int32Array(N), onLoop = new Uint8Array(edges.length);
      let time = 0;
      const dfs = (u, pe) => {
        disc[u] = low[u] = time++;
        for (const [x, k] of adj[u]) {
          if (k === pe) continue;
          if (disc[x] < 0) { dfs(x, k); low[u] = Math.min(low[u], low[x]); if (low[x] <= disc[u]) onLoop[k] = 1; } else { low[u] = Math.min(low[u], disc[x]); onLoop[k] = 1; }
        }
      };
      for (let i = 0; i < N; i++) if (disc[i] < 0) dfs(i, -1);
      const bad = new Uint8Array(N);
      let loops = 0;
      edges.forEach(([i, dd, j], k) => { if (onLoop[k]) { loops++; bad[i] |= 1 << dd; bad[j] |= 1 << ((dd + 2) & 3); } });
      // locked tiles that cannot both be right
      for (let i = 0; i < N; i++) {
        if (!lock[i]) continue;
        for (let dd = 0; dd < 4; dd++) {
          if (!(cur[i] >> dd & 1)) continue;
          const j = P.nb[4 * i + dd];
          if (j < 0 || (lock[j] && !(cur[j] >> ((dd + 2) & 3) & 1))) bad[i] |= 1 << dd;
        }
      }
      let nlit = 0;
      for (let i = 0; i < N; i++) nlit += lit[i];
      return { lit, nlit, bad, loops, dist };
    }
    function evaluate() {
      const a = A || analyse();
      if (a.nlit === N) return { solved: true, msg: 'Every tile is on the network. Lights on!' };
      return { solved: false, msg: 'Not yet: ' + a.nlit + ' of ' + N + ' tiles are connected to the source' + (a.loops ? ', and there is a loop (in red)' : '') + '.' };
    }

    function drawTile(i) {
      const key = cur[i] + ':' + A.lit[i] + ':' + A.bad[i] + ':' + lock[i];
      if (sig[i] === key) return;
      sig[i] = key;
      netDraw(s, inner[i], cur[i], i === P.src, A.bad[i]);
      inner[i].classList.toggle('lit', !!A.lit[i]);
      bgEls[i].classList.toggle('locked', !!lock[i]);
      for (const [t, g] of ghosts) if (t === i) { netDraw(s, g, cur[i], i === P.src, A.bad[i]); g.classList.toggle('lit', !!A.lit[i]); }
    }
    function refresh() {
      A = analyse();
      for (let i = 0; i < N; i++) drawTile(i);
      ctx.stat('Connected', A.nlit + ' of ' + N);
      if (won && A.nlit !== N) setWon(false);
      if (shown) pruneHint();
    }
    function setWon(on, animate) {
      if (won === on) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      if (on && A) {
        let far = 1;
        for (let i = 0; i < N; i++) far = Math.max(far, A.dist[i]);
        for (let i = 0; i < N; i++) inner[i].style.animationDelay = (0.05 + 0.9 * Math.max(0, A.dist[i]) / far).toFixed(3) + 's';
      }
    }

    /* ---------- turning ---------- */
    function turn(i, how, quiet) {
      if (lock[i]) { if (!quiet) { ctx.toast('That tile is locked (shift-click to unlock).'); ctx.sfx('wrong'); } return false; }
      const from = cur[i];
      const to = how === 'cw' ? rotCW(from) : how === 'ccw' ? rotCCW(from) : rotCW(rotCW(from));
      cur[i] = to;
      animateTurn(i, how === 'cw' ? -90 : how === 'ccw' ? 90 : -180);
      return true;
    }
    function animateTurn(i, fromDeg) {
      if (spin[i]) spin[i]();
      const set = (a) => inner[i].setAttribute('transform', a ? 'rotate(' + a.toFixed(2) + ' ' + NT / 2 + ' ' + NT / 2 + ')' : '');
      set(fromDeg);
      spin[i] = C.tween(C.anim(Math.abs(fromDeg) > 90 ? 200 : 140), (t) => set(fromDeg * (1 - t)), () => { set(0); spin[i] = null; });
    }
    function turnTo(i, m) {
      if (cur[i] === m) return;
      const how = rotCW(cur[i]) === m ? 'cw' : rotCCW(cur[i]) === m ? 'ccw' : 'half';
      const was = lock[i];
      lock[i] = 0;
      turn(i, how, true);
      lock[i] = was;
    }
    function act(i, how) {
      if (i < 0) return;
      if (how === 'lock') { lock[i] = lock[i] ? 0 : 1; ctx.sfx('tap'); refresh(); ctx.changed('lock'); return; }
      if (turn(i, how)) { ctx.sfx('tap'); refresh(); ctx.changed('turn'); }
    }

    /* ---------- hints ---------- */
    let shown = null;
    const tname = (i) => (i === P.src ? 'source' : L.NET_NAME[L.netType(M.tiles[i])]);
    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function outline(i, cls) { return s('rect', { x: dispX(i) + 2, y: dispY(i) + 2, width: NT - 4, height: NT - 4, rx: 6, class: cls }, hintG); }
    function pruneHint() {
      shown.set = shown.set.filter(([i, m]) => { if (cur[i] === m && lock[i]) { (shown.els[i] || []).forEach((e) => e.remove()); return false; } return true; });
      if (!shown.set.length && !shown.wrong) clearHint();
    }
    const hinter = makeHinter(ctx, {
      wrongWord: 'locked tile',
      wrong: () => { const out = []; for (let i = 0; i < N; i++) if (lock[i] && cur[i] !== M.sol[i]) out.push(i); return out; },
      rubOut: (list) => list.forEach((i) => { lock[i] = 0; }),
      step: () => {
        const locked = new Int16Array(N);
        for (let i = 0; i < N; i++) locked[i] = lock[i] ? cur[i] : -1;
        return L.netStep(P, locked, 5, M.sol);
      },
      done: ([i, m]) => cur[i] === m && !!lock[i],
      apply: (set) => { set.forEach(([i, m]) => { turnTo(i, m); lock[i] = 1; }); return set.map((x) => x[0]); },
      describe: (set) => 'I turned the ' + tname(set[0][0]) + ' at ' + L.cellName(set[0][0], w) + ' to point ' + L.netArms(set[0][1]) + ' and locked it',
      show: (st) => {
        clearHint();
        shown = { set: st.set.slice(), els: {} };
        st.set.forEach(([i, m]) => {
          const els = [outline(i, 'nt-hcell')];
          const g = s('g', { transform: 'translate(' + dispX(i) + ' ' + dispY(i) + ')', class: 'nt-ghost' }, hintG);
          netDraw(s, g, m, i === P.src, 0);
          els.push(g);
          shown.els[i] = els;
        });
      },
      showWrong: (list) => { clearHint(); shown = { set: [], els: {}, wrong: true }; list.forEach((i) => outline(i, 'nt-hwrong')); },
      clear: clearHint,
      flash: (cells) => { const els = cells.map((i) => outline(i, 'nt-flash')); later(() => els.forEach((e) => e.remove()), 1400); },
      evaluate,
      refresh
    });

    /* ---------- gestures ---------- */
    function cellAt(pt) {
      const dc = Math.floor(pt[0] / NT), dr = Math.floor(pt[1] / NT);
      if (dc < 0 || dc >= w || dr < 0 || dr >= h) return -1;
      return ((dr - sy + h) % h) * w + ((dc - sx + w) % w);
    }
    function drawCursor() {
      curEl.style.display = curs.on ? '' : 'none';
      const i = curs.r * w + curs.c;
      curEl.setAttribute('x', dispX(i)); curEl.setAttribute('y', dispY(i));
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = cellAt(pt);
        if (i < 0) return false;
        if (ev.pointerType === 'touch') return false;       // taps and long presses come below
        curs.r = Math.floor(i / w); curs.c = i % w; curs.on = false; drawCursor();
        if (ev.button === 2) act(i, 'cw');
        else if (ev.shiftKey || ev.ctrlKey) act(i, 'lock');
        else act(i, 'ccw');
        return true;
      },
      tap(pt, ev) { const i = cellAt(pt); if (i >= 0) act(i, ui.tap); },
      longpress(pt) { const i = cellAt(pt); if (i >= 0) act(i, 'lock'); }
    };
    // the middle button locks (the workbench would pan with it)
    const svg = wb.svg;
    const onMid = (ev) => {
      if (ev.button !== 1 || wb.mode !== 'select' || wb.is3D) return;
      const i = cellAt(wb.toWorld(ev.clientX, ev.clientY));
      if (i < 0) return;
      ev.stopImmediatePropagation(); ev.preventDefault();
      act(i, 'lock');
    };
    svg.addEventListener('pointerdown', onMid, true);

    function shift(dr, dc) {
      sx = (sx + dc + w) % w; sy = (sy + dr + h) % h;
      clearHint();
      hinter.forget();
      place();
      refresh();
    }

    /* ---------- the panel ---------- */
    const TAP = [['acw', '⟲ Turn left'], ['cw', '⟳ Turn right'], ['lock', '🔒 Lock']];
    const segBtns = TAP.map(([k, label]) => ctx.h('button.t2-segb' + (k === ui.tap ? '.on' : ''), { type: 'button', onclick: () => { ui.tap = k; segBtns.forEach((b, j) => b.classList.toggle('on', TAP[j][0] === k)); } }, label));
    const box = ctx.h('div.t2-panel',
      ctx.h('div.t2-seg', ctx.h('span.t2-segl', 'Tap does:'), segBtns),
      ctx.h('div.t2-tip', 'Click turns anticlockwise, right-click clockwise, shift-click locks.' + (wrap ? ' Shift+arrows slide the board around.' : ''))
    );
    if (wrap) {
      const row = ctx.h('div.t2-seg', ctx.h('span.t2-segl', 'Slide:'),
        ctx.h('button.t2-segb', { type: 'button', onclick: () => shift(0, -1) }, '←'), ctx.h('button.t2-segb', { type: 'button', onclick: () => shift(0, 1) }, '→'),
        ctx.h('button.t2-segb', { type: 'button', onclick: () => shift(-1, 0) }, '↑'), ctx.h('button.t2-segb', { type: 'button', onclick: () => shift(1, 0) }, '↓'));
      box.appendChild(row);
    }
    box.appendChild(ctx.h('button.t2-segb', { type: 'button', onclick: () => { let k = 0; for (let i = 0; i < N; i++) if (lock[i]) { lock[i] = 0; k++; } if (k) { refresh(); ctx.changed('lock'); } } }, 'Unlock all'));
    ctx.panel.appendChild(box);

    place();
    refresh();

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); ctx.sfx('snap'); }
        return r;
      },
      hint() { return hinter.hint(); },
      solve() {
        clearHint(); hinter.forget();
        const order = [];
        for (let i = 0; i < N; i++) if (cur[i] !== M.sol[i]) order.push(i);
        const dist = (i) => { const r = Math.floor(i / w), c = i % w, r0 = Math.floor(P.src / w), c0 = P.src % w; return Math.abs(r - r0) + Math.abs(c - c0); };
        order.sort((a, b) => dist(a) - dist(b) || a - b);
        for (let i = 0; i < N; i++) if (lock[i] && cur[i] !== M.sol[i]) lock[i] = 0;
        const per = Math.max(1, Math.ceil(order.length / 18));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < order.length; t++, k++) turnTo(order[k], M.sol[order[k]]);
          refresh();
          if (k < order.length) later(tick, C.anim(45)); else later(() => ctx.changed('solve'), C.anim(220));
        };
        tick();
      },
      getState() {
        let m = '', k = '';
        for (let i = 0; i < N; i++) { m += cur[i].toString(16); k += lock[i]; }
        return { m, k, sx, sy };
      },
      setState(o) {
        if (!o || typeof o.m !== 'string' || o.m.length !== N) return;
        for (let i = 0; i < N; i++) {
          const m = parseInt(o.m[i], 16);
          cur[i] = P.list[i].indexOf(m) >= 0 ? m : start[i];
          lock[i] = o.k && o.k[i] === '1' ? 1 : 0;
          if (spin[i]) { spin[i](); spin[i] = null; }
          inner[i].setAttribute('transform', '');
        }
        if (wrap) { sx = (o.sx | 0) % w; sy = (o.sy | 0) % h; }
        clearHint();
        place();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { hinter.reset(); clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return curs.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (DIRKEY[k]) {
          if (ev.shiftKey && wrap) { shift(DIRKEY[k][0], DIRKEY[k][1]); return true; }
          if (!curs.on) { curs.on = true; drawCursor(); return true; }
          curs.r = (curs.r + DIRKEY[k][0] + h) % h; curs.c = (curs.c + DIRKEY[k][1] + w) % w;
          drawCursor();
          return true;
        }
        if (!curs.on) return false;
        const i = curs.r * w + curs.c, kk = k.toLowerCase();
        if (kk === 'a' || k === 'Enter') { act(i, 'ccw'); return true; }
        if (kk === 'd') { act(i, 'cw'); return true; }
        if (kk === 'f') { act(i, 'half'); return true; }
        if (kk === 's' || k === ' ') { act(i, 'lock'); return true; }
        if (k === 'Escape') { curs.on = false; drawCursor(); }
        return false;
      },
      destroy() {
        timers.forEach(clearTimeout);
        spin.forEach((f) => f && f());
        clearTimeout(wonT);
        svg.removeEventListener('pointerdown', onMid, true);
      }
    };
  }

  /* =====================================================================
   *  MAGNETS
   * ===================================================================== */

  const MS = 44;
  function mountMagnets(ctx, p) {
    const d = p.data, wb = ctx.wb, s = ctx.s, L = LG();
    const M = magModel(d), P = M.P, w = d.w, h = d.h, N = w * h, K = P.doms.length;
    const mark = new Int8Array(K), tick = new Uint8Array(2 * (w + h));
    const ui = { tapBlank: false };
    let won = false;
    const timers = [], later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const curs = { r: 0, c: 0, on: false };
    ctx.setGoal(p.goal || GOALS.magnets);

    const CW = MS * 0.78, ox = CW, oy = CW, GW = w * MS, GH = h * MS;
    wb.setBounds({ x0: 0, y0: 0, x1: ox + GW + CW, y1: oy + GH + CW }, 0.04);
    const G = s('g', { class: 'mg' }, wb.layer('board'));
    s('rect', { x: ox - 4, y: oy - 4, width: GW + 8, height: GH + 8, rx: 7, class: 'mg-boardbg' }, G);
    const cellG = s('g', null, G), domG = s('g', null, G), textG = s('g', { class: 'mg-texts' }, G);
    const topG = s('g', { class: 'mg-top' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const curEl = s('rect', { width: MS, height: MS, rx: 6, class: 'mg-cursor' }, topG);
    const cx = (i) => ox + (i % w) * MS, cy = (i) => oy + Math.floor(i / w) * MS;
    for (let i = 0; i < N; i++) s('rect', { x: cx(i), y: cy(i), width: MS, height: MS, class: 'mg-cell', 'data-key': 'g' + i }, cellG);
    let grid = '';
    for (let c = 1; c < w; c++) grid += 'M' + (ox + c * MS) + ' ' + oy + 'v' + GH;
    for (let r = 1; r < h; r++) grid += 'M' + ox + ' ' + (oy + r * MS) + 'h' + GW;
    s('path', { d: grid, class: 'mg-grid' }, cellG);
    const domEls = P.doms.map(([a, b]) => s('g', { class: 'mg-domg' }, domG));
    const sig = new Array(K).fill('');
    // clues: lines 0..h-1 rows, h.. columns; + (top, left) and − (bottom, right)
    const clueEls = [];            // [pole 0/1][line] -> text element or null
    for (let pole = 0; pole < 2; pole++) {
      const arr = [];
      for (let li = 0; li < h + w; li++) {
        const k = P.need[pole][li];
        if (k < 0) { arr.push(null); continue; }
        const isRow = li < h, idx = isRow ? li : li - h;
        const x = isRow ? (pole ? ox + GW + CW / 2 : CW / 2) : ox + idx * MS + MS / 2;
        const y = isRow ? oy + idx * MS + MS / 2 : (pole ? oy + GH + CW / 2 : CW / 2);
        arr.push(s('text', { x, y, class: 'mg-clue ' + (pole ? 'm' : 'p'), text: String(k) }, textG));
      }
      clueEls.push(arr);
    }
    s('text', { x: CW / 2, y: CW / 2, class: 'mg-sign p', text: '+' }, textG);
    s('text', { x: ox + GW + CW / 2, y: oy + GH + CW / 2, class: 'mg-sign m', text: '−' }, textG);

    /* ---------- the marks as cell values ---------- */
    function vals() {
      const v = new Uint8Array(N);          // 0 unknown, 1 +, 2 −, 4 blank, 3 magnet either way
      P.doms.forEach(([a, b], k) => {
        const m = mark[k];
        if (m === 1) { v[a] = 1; v[b] = 2; } else if (m === 2) { v[a] = 2; v[b] = 1; } else if (m === 3) { v[a] = v[b] = 4; } else if (m === 4) { v[a] = v[b] = 3; }
      });
      return v;
    }
    let V = null, err = new Uint8Array(N);
    function lineCount(li, pole) { let k = 0; for (const i of P.lines[li]) if (V[i] === pole) k++; return k; }
    function evaluate() {
      V = vals();
      let open = 0, clash = false, wrong = 0;
      for (let k = 0; k < K; k++) if (!mark[k] || mark[k] === 4) open++;
      for (let i = 0; i < N; i++) if ((V[i] === 1 || V[i] === 2) && P.adj[i].some((j) => V[j] === V[i])) clash = true;
      for (let li = 0; li < h + w; li++) for (const pole of [1, 2]) { const k = P.need[pole - 1][li]; if (k >= 0 && lineCount(li, pole) !== k) wrong++; }
      if (!open && !clash && !wrong) return { solved: true, msg: 'Every magnet in place, and not one of them repelled.' };
      if (clash) return { solved: false, msg: 'Two like poles are touching.' };
      if (open) return { solved: false, msg: C.plural(open, 'slot is', 'slots are') + ' still undecided' + (wrong ? ', and some counts are off' : '') + '.' };
      return { solved: false, msg: 'Every slot is filled, but ' + (wrong === 1 ? 'one count does' : wrong + ' counts do') + ' not match.' };
    }

    function halfGlyph(g, i, pole, e) {
      const x = cx(i) + 3, y = cy(i) + 3, sz = MS - 6;
      s('rect', { x, y, width: sz, height: sz, rx: 6, class: 'mg-half ' + (pole === 1 ? 'p' : 'm') + (e ? ' err' : '') }, g);
      s('text', { x: x + sz / 2, y: y + sz / 2 + 1, class: 'mg-pole', text: pole === 1 ? '+' : '−' }, g);
    }
    function drawDom(k) {
      const [a, b] = P.doms[k], m = mark[k];
      const key = m + ':' + err[a] + err[b];
      if (sig[k] === key) return;
      sig[k] = key;
      const g = domEls[k];
      while (g.firstChild) g.removeChild(g.firstChild);
      const x0 = Math.min(cx(a), cx(b)), y0 = Math.min(cy(a), cy(b));
      const horiz = b === a + 1;
      const W = horiz ? 2 * MS : MS, H = horiz ? MS : 2 * MS;
      s('rect', { x: x0 + 2, y: y0 + 2, width: W - 4, height: H - 4, rx: 8, class: 'mg-dom' + (m === 3 ? ' blank' : m === 4 ? ' any' : m ? ' mag' : '') }, g);
      if (m === 1 || m === 2) {
        halfGlyph(g, a, m === 1 ? 1 : 2, err[a]);
        halfGlyph(g, b, m === 1 ? 2 : 1, err[b]);
      } else if (m === 3) {
        for (const i of [a, b]) s('path', { d: 'M' + (cx(i) + 16) + ' ' + (cy(i) + 16) + 'l12 12m0 -12l-12 12', class: 'mg-x' }, g);
      } else if (m === 4) {
        for (const i of [a, b]) s('text', { x: cx(i) + MS / 2, y: cy(i) + MS / 2 + 1, class: 'mg-q', text: '?' }, g);
      }
      // the seam between the two halves
      if (m !== 1 && m !== 2) s('path', { d: horiz ? 'M' + (x0 + MS) + ' ' + (y0 + 9) + 'v' + (MS - 18) : 'M' + (x0 + 9) + ' ' + (y0 + MS) + 'h' + (MS - 18), class: 'mg-seam' }, g);
    }
    function refresh() {
      V = vals();
      err = new Uint8Array(N);
      for (let i = 0; i < N; i++) if ((V[i] === 1 || V[i] === 2)) for (const j of P.adj[i]) if (V[j] === V[i]) { err[i] = 1; err[j] = 1; }
      for (let k = 0; k < K; k++) drawDom(k);
      for (let pole = 0; pole < 2; pole++) for (let li = 0; li < h + w; li++) {
        const el = clueEls[pole][li];
        if (!el) continue;
        const k = P.need[pole][li], got = lineCount(li, pole + 1);
        let room = 0;
        for (const i of P.lines[li]) if (V[i] === 0 || V[i] === 3) room++;
        el.classList.toggle('done', got === k);
        el.classList.toggle('bad', got > k || got + room < k);
        el.classList.toggle('ticked', !!tick[pole * (h + w) + li]);
      }
      let open = 0;
      for (let k = 0; k < K; k++) if (!mark[k] || mark[k] === 4) open++;
      ctx.stat('Undecided', open);
      if (won && !evaluate().solved) setWon(false);
      if (shown) pruneHint();
    }
    function setWon(on, animate) {
      if (won === on) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      if (on) domEls.forEach((g, k) => { g.style.animationDelay = (0.04 * (P.doms[k][0] % w + Math.floor(P.doms[k][0] / w))).toFixed(2) + 's'; });
    }

    /* ---------- gestures ---------- */
    function setMark(k, m) { if (mark[k] === m) return false; mark[k] = m; return true; }
    function leftAct(i) {
      const k = P.domOf[i], [a] = P.doms[k], here = i === a ? 1 : 2, there = 3 - here;
      const m = mark[k];
      setMark(k, m === here ? there : m === there ? 0 : here);
      ctx.sfx('tap'); refresh(); ctx.changed('mark');
    }
    function rightAct(i) {
      const k = P.domOf[i], m = mark[k];
      setMark(k, m === 3 ? 4 : m === 4 ? 0 : 3);
      ctx.sfx('tap'); refresh(); ctx.changed('mark');
    }
    function put(i, what) {       // what: 'p' + here, 'm' − here, 3 blank, 4 ?, 0 clear
      const k = P.domOf[i], [a] = P.doms[k], here = i === a ? 1 : 2;
      const m = what === 'p' ? here : what === 'm' ? 3 - here : what;
      if (setMark(k, m)) { ctx.sfx('tap'); refresh(); ctx.changed('mark'); }
    }
    function cellAt(pt) {
      const c = Math.floor((pt[0] - ox) / MS), r = Math.floor((pt[1] - oy) / MS);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    function clueAt(pt) {
      const c = Math.floor((pt[0] - ox) / MS), r = Math.floor((pt[1] - oy) / MS);
      if (r >= 0 && r < h) { if (pt[0] < ox && pt[0] > 0) return [0, r]; if (pt[0] > ox + GW && pt[0] < ox + GW + CW) return [1, r]; }
      if (c >= 0 && c < w) { if (pt[1] < oy && pt[1] > 0) return [0, h + c]; if (pt[1] > oy + GH && pt[1] < oy + GH + CW) return [1, h + c]; }
      return null;
    }
    function tapClue(cl) {
      const [pole, li] = cl;
      if (!clueEls[pole][li]) return false;
      tick[pole * (h + w) + li] ^= 1;
      refresh(); ctx.changed('tick');
      return true;
    }
    wb.handlers.board = {
      down(pt, ev) {
        const cl = clueAt(pt);
        if (cl) return ev.pointerType === 'touch' ? false : tapClue(cl);
        const i = cellAt(pt);
        if (i < 0 || ev.pointerType === 'touch') return false;
        curs.on = false; curs.r = Math.floor(i / w); curs.c = i % w; drawCursor();
        if (ev.button === 2) rightAct(i); else leftAct(i);
        return true;
      },
      tap(pt) {
        const cl = clueAt(pt);
        if (cl) { tapClue(cl); return; }
        const i = cellAt(pt);
        if (i >= 0) { if (ui.tapBlank) rightAct(i); else leftAct(i); }
      },
      longpress(pt) { const i = cellAt(pt); if (i >= 0) { if (ui.tapBlank) leftAct(i); else rightAct(i); } }
    };
    function drawCursor() {
      curEl.style.display = curs.on ? '' : 'none';
      curEl.setAttribute('x', ox + curs.c * MS); curEl.setAttribute('y', oy + curs.r * MS);
    }
    drawCursor();

    /* ---------- hints ---------- */
    let shown = null;
    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function domBox(k, cls) {
      const [a, b] = P.doms[k], x0 = Math.min(cx(a), cx(b)), y0 = Math.min(cy(a), cy(b)), horiz = b === a + 1;
      return s('rect', { x: x0 + 1, y: y0 + 1, width: (horiz ? 2 : 1) * MS - 2, height: (horiz ? 1 : 2) * MS - 2, rx: 9, class: cls }, hintG);
    }
    function pruneHint() {
      shown.set = shown.set.filter(([k, m]) => { if (mark[k] === m) { (shown.els[k] || []).forEach((e) => e.remove()); return false; } return true; });
      if (!shown.set.length && !shown.wrong) clearHint();
    }
    const markWords = (k, m) => (m === 4 ? 'a **?** (a magnet, way round not yet known)' : m === 3 ? 'a blank' : 'a magnet, **+** ' + (P.doms[k][1] === P.doms[k][0] + 1 ? (m === 1 ? 'on the left' : 'on the right') : (m === 1 ? 'at the top' : 'at the bottom')));
    const hinter = makeHinter(ctx, {
      wrongWord: 'domino',
      wrong: () => { const out = []; for (let k = 0; k < K; k++) { const m = mark[k]; if ((m >= 1 && m <= 3 && m !== M.smark[k]) || (m === 4 && M.smark[k] === 3)) out.push(k); } return out; },
      rubOut: (list) => list.forEach((k) => { mark[k] = 0; }),
      step: () => L.magStep(P, Array.from(mark), 4, d.sol.join('')),
      done: ([k, m]) => mark[k] === m,
      apply: (set) => { set.forEach(([k, m]) => { mark[k] = m; }); return set.map((x) => x[0]); },
      describe: (set) => 'I made ' + L.magDomName(P, set[0][0]) + ' ' + markWords(set[0][0], set[0][1]),
      show: (st) => {
        clearHint();
        shown = { set: st.set.slice(), els: {} };
        st.set.forEach(([k]) => { shown.els[k] = [domBox(k, 'mg-hcell')]; });
      },
      showWrong: (list) => { clearHint(); shown = { set: [], els: {}, wrong: true }; list.forEach((k) => domBox(k, 'mg-hwrong')); },
      clear: clearHint,
      flash: (ks) => { const els = ks.map((k) => domBox(k, 'mg-flash')); later(() => els.forEach((e) => e.remove()), 1400); },
      evaluate,
      refresh
    });

    /* ---------- the panel ---------- */
    const segBtns = ['Magnet', 'Blank'].map((label, j) => ctx.h('button.t2-segb' + (j === 0 ? '.on' : ''), { type: 'button', onclick: () => { ui.tapBlank = j === 1; segBtns.forEach((b, t) => b.classList.toggle('on', t === j)); } }, label));
    ctx.panel.appendChild(ctx.h('div.t2-panel',
      ctx.h('div.t2-seg', ctx.h('span.t2-segl', 'Tap puts:'), segBtns),
      ctx.h('div.t2-tip', 'Click a half: + there, again: − there, again: empty. Right-click: blank, then ?, then empty. Click a clue to tick it off.')));

    refresh();

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() { return hinter.hint(); },
      solve() {
        clearHint(); hinter.forget();
        const order = [];
        for (let k = 0; k < K; k++) if (mark[k] !== M.smark[k]) order.push(k);
        order.sort((x, y) => P.doms[x][0] - P.doms[y][0]);
        const per = Math.max(1, Math.ceil(order.length / 16));
        let t = 0;
        const tick2 = () => {
          for (let j = 0; j < per && t < order.length; j++, t++) mark[order[t]] = M.smark[order[t]];
          refresh();
          if (t < order.length) later(tick2, C.anim(40)); else ctx.changed('solve');
        };
        tick2();
      },
      getState() { return { m: Array.from(mark).join(''), t: Array.from(tick).join('') }; },
      setState(o) {
        if (!o || typeof o.m !== 'string' || o.m.length !== K) return;
        for (let k = 0; k < K; k++) mark[k] = Math.max(0, Math.min(4, +o.m[k] || 0));
        for (let j = 0; j < tick.length; j++) tick[j] = o.t && o.t[j] === '1' ? 1 : 0;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { hinter.reset(); clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return curs.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (DIRKEY[k]) {
          if (!curs.on) { curs.on = true; drawCursor(); return true; }
          curs.r = Math.max(0, Math.min(h - 1, curs.r + DIRKEY[k][0])); curs.c = Math.max(0, Math.min(w - 1, curs.c + DIRKEY[k][1]));
          drawCursor();
          return true;
        }
        if (!curs.on) return false;
        const i = curs.r * w + curs.c;
        if (k === 'Enter') { leftAct(i); return true; }
        if (k === ' ') { rightAct(i); return true; }
        if (k === '+' || k === '=') { put(i, 'p'); return true; }
        if (k === '-' || k === '_') { put(i, 'm'); return true; }
        if (k === '.' || k === 'x' || k === '0') { put(i, 3); return true; }
        if (k === '?' || k === '/') { put(i, 4); return true; }
        if (k === 'Backspace' || k === 'Delete') { put(i, 0); return true; }
        if (k === 'Escape') { curs.on = false; drawCursor(); }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); }
    };
  }

  /* =====================================================================
   *  TRACKS
   * ===================================================================== */

  const TS = 44, RG = TS * 0.13;
  // a piece of railway in the square at (x, y): mask = sides the line leaves by
  function trkPiece(s, g, x, y, mask) {
    const c = TS / 2, mids = [[x + c, y], [x + TS, y + c], [x + c, y + TS], [x, y + c]];
    const arms = [];
    for (let d = 0; d < 4; d++) if (mask >> d & 1) arms.push(d);
    let sl = '', rl = '';
    const seg = (a, b) => 'M' + C.fmtNum(a[0]) + ' ' + C.fmtNum(a[1]) + 'L' + C.fmtNum(b[0]) + ' ' + C.fmtNum(b[1]);
    const straight = (p0, p1, n, from, to) => {
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      for (let k = 0; k < n; k++) {
        const t = from + (to - from) * (k + 0.5) / n, px = p0[0] + dx * t, py = p0[1] + dy * t;
        sl += seg([px - nx * RG * 1.75, py - ny * RG * 1.75], [px + nx * RG * 1.75, py + ny * RG * 1.75]);
      }
      rl += seg([p0[0] + nx * RG, p0[1] + ny * RG], [p1[0] + nx * RG, p1[1] + ny * RG]) + seg([p0[0] - nx * RG, p0[1] - ny * RG], [p1[0] - nx * RG, p1[1] - ny * RG]);
    };
    if (arms.length === 2 && (arms[1] - arms[0]) === 2) straight(mids[arms[0]], mids[arms[1]], 4, 0, 1);
    else if (arms.length === 2) {
      // a quarter circle round the corner between the two sides
      const [d1, d2] = arms;
      const kx = (d1 === 1 || d2 === 1) ? x + TS : x, ky = (d1 === 2 || d2 === 2) ? y + TS : y;
      const a1 = Math.atan2(mids[d1][1] - ky, mids[d1][0] - kx);
      let da = Math.atan2(mids[d2][1] - ky, mids[d2][0] - kx) - a1;
      while (da > Math.PI) da -= 2 * Math.PI;
      while (da < -Math.PI) da += 2 * Math.PI;
      for (let k = 0; k < 3; k++) {
        const a = a1 + da * (k + 0.5) / 3, co = Math.cos(a), si = Math.sin(a);
        sl += seg([kx + co * (c - RG * 1.75), ky + si * (c - RG * 1.75)], [kx + co * (c + RG * 1.75), ky + si * (c + RG * 1.75)]);
      }
      for (const r of [c - RG, c + RG]) {
        const p1 = [kx + Math.cos(a1) * r, ky + Math.sin(a1) * r], p2 = [kx + Math.cos(a1 + da) * r, ky + Math.sin(a1 + da) * r];
        rl += 'M' + C.fmtNum(p1[0]) + ' ' + C.fmtNum(p1[1]) + 'A' + C.fmtNum(r) + ' ' + C.fmtNum(r) + ' 0 0 ' + (da > 0 ? 1 : 0) + ' ' + C.fmtNum(p2[0]) + ' ' + C.fmtNum(p2[1]);
      }
    } else {
      for (const d of arms) straight(mids[d], [x + c, y + c], 2, 0, 1);
      if (arms.length === 1) { const d = arms[0], v = d % 2 ? [0, 1] : [1, 0]; sl += seg([x + c - v[0] * RG * 2, y + c - v[1] * RG * 2], [x + c + v[0] * RG * 2, y + c + v[1] * RG * 2]); }
    }
    if (sl) s('path', { d: sl, class: 'tk-sl' }, g);
    if (rl) s('path', { d: rl, class: 'tk-rl' }, g);
  }
  // the line from A to B as points, for the train
  function trkRoute(P, masks, ox, oy) {
    const w = P.w, pts = [[ox - TS * 1.6, oy + P.ra * TS + TS / 2]];
    let i = P.A, from = 3, guard = 0;
    while (i >= 0 && guard++ < P.N + 2) {
      const x = ox + (i % w) * TS, y = oy + Math.floor(i / w) * TS, c = TS / 2;
      const mids = [[x + c, y], [x + TS, y + c], [x + c, y + TS], [x, y + c]];
      let to = -1;
      for (let d = 0; d < 4; d++) if (d !== from && (masks[i] >> d & 1)) to = d;
      if (to < 0) break;
      if ((to - from + 4) % 4 === 2) pts.push(mids[to]);
      else {
        const kx = (from === 1 || to === 1) ? x + TS : x, ky = (from === 2 || to === 2) ? y + TS : y;
        const a1 = Math.atan2(mids[from][1] - ky, mids[from][0] - kx);
        let da = Math.atan2(mids[to][1] - ky, mids[to][0] - kx) - a1;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        for (let k = 1; k <= 6; k++) pts.push([kx + Math.cos(a1 + da * k / 6) * c, ky + Math.sin(a1 + da * k / 6) * c]);
      }
      if (i === P.B && to === 2) { pts.push([mids[2][0], mids[2][1] + TS * 1.4]); break; }
      i = P.nb[4 * i + to];
      from = (to + 2) % 4;
    }
    return pts;
  }

  function mountTracks(ctx, p) {
    const d = p.data, wb = ctx.wb, s = ctx.s, L = LG();
    const M = trkModel(d), P = M.P, w = d.w, h = d.h, N = w * h, E2 = 2 * N;
    const eu = new Int8Array(E2), su = new Int8Array(N);
    const fixedE = new Int8Array(E2).fill(-1);          // edges the given pieces settle: 1 track, 0 none
    for (let i = 0; i < N; i++) {
      if (P.gmask[i] < 0) continue;
      for (let dd = 0; dd < 4; dd++) { const e = P.eid[4 * i + dd]; if (e >= 0 && e < E2) fixedE[e] = P.gmask[i] >> dd & 1; }
    }
    const solE = new Uint8Array(E2);
    for (let i = 0; i < N; i++) { if (M.sol[i] & 2) solE[2 * i] = 1; if (M.sol[i] & 4 && i + w < N) solE[2 * i + 1] = 1; }
    const ui = { tapCross: false };
    let won = false, train = null, trainStop = null;
    const timers = [], later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const curs = { r: P.ra, c: 0, on: false };
    ctx.setGoal(p.goal || GOALS.tracks);

    const ox = TS * 1.15, oy = TS * 0.8, GW = w * TS, GH = h * TS;
    wb.setBounds({ x0: 0, y0: 0, x1: ox + GW + TS * 0.85, y1: oy + GH + TS * 1.15 }, 0.04);
    const G = s('g', { class: 'tk' }, wb.layer('board'));
    s('rect', { x: ox - 4, y: oy - 4, width: GW + 8, height: GH + 8, rx: 7, class: 'tk-boardbg' }, G);
    const cellG = s('g', null, G), markG = s('g', null, G), railG = s('g', null, G), textG = s('g', { class: 'tk-texts' }, G);
    const trainG = s('g', { class: 'tk-train' }, G);
    const topG = s('g', { class: 'tk-top' }, wb.layer('top'));
    const hovG = s('g', null, topG), hintG = s('g', null, topG);
    const curEl = s('rect', { width: TS, height: TS, rx: 6, class: 'tk-cursor' }, topG);
    const cx = (i) => ox + (i % w) * TS, cy = (i) => oy + Math.floor(i / w) * TS;
    const bgEls = [];
    for (let i = 0; i < N; i++) bgEls.push(s('rect', { x: cx(i), y: cy(i), width: TS, height: TS, class: 'tk-cell' + (P.gmask[i] >= 0 ? ' given' : ''), 'data-key': 'k' + i }, cellG));
    let grid = '';
    for (let c = 1; c < w; c++) grid += 'M' + (ox + c * TS) + ' ' + oy + 'v' + GH;
    for (let r = 1; r < h; r++) grid += 'M' + ox + ' ' + (oy + r * TS) + 'h' + GW;
    s('path', { d: grid, class: 'tk-grid' }, cellG);
    s('rect', { x: ox, y: oy, width: GW, height: GH, rx: 2, class: 'tk-frame' }, cellG);
    // A and B, with a stub of line outside the board
    const stubA = s('g', { class: 'tk-piece fixed' }, railG), stubB = s('g', { class: 'tk-piece fixed' }, railG);
    trkPiece(s, stubA, ox - TS, oy + P.ra * TS, 2);
    trkPiece(s, stubB, ox + P.cb * TS, oy + GH, 1);
    s('text', { x: ox - TS * 0.82, y: oy + P.ra * TS + TS / 2 - TS * 0.42, class: 'tk-ab', text: 'A' }, textG);
    s('text', { x: ox + P.cb * TS + TS / 2 + TS * 0.42, y: oy + GH + TS * 0.78, class: 'tk-ab', text: 'B' }, textG);
    const clueEls = [];
    for (let r = 0; r < h; r++) clueEls.push(s('text', { x: ox + GW + TS * 0.42, y: oy + r * TS + TS / 2, class: 'tk-clue', text: String(d.rows[r]) }, textG));
    for (let c = 0; c < w; c++) clueEls.push(s('text', { x: ox + c * TS + TS / 2, y: oy - TS * 0.4, class: 'tk-clue', text: String(d.cols[c]) }, textG));
    const pieceEls = [], markEls = [], sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) { markEls.push(s('g', null, markG)); pieceEls.push(s('g', { class: 'tk-piece' }, railG)); }
    const xEls = new Array(E2).fill(null);

    /* ---------- what is laid ---------- */
    const onE = (e) => (e >= E2 ? 1 : fixedE[e] >= 0 ? fixedE[e] : eu[e] === 1 ? 1 : 0);
    function masks() {
      const m = new Array(N).fill(0);
      for (let i = 0; i < N; i++) for (let dd = 0; dd < 4; dd++) { const e = P.eid[4 * i + dd]; if (e >= 0 && onE(e)) m[i] |= 1 << dd; }
      return m;
    }
    let MK = null;
    function evaluate() {
      MK = masks();
      let same = true;
      for (let e = 0; e < E2; e++) if (P.ea[e] >= 0 && onE(e) !== solE[e]) { same = false; break; }
      if (same) return { solved: true, msg: 'All aboard! The line runs from A to B.' };
      for (let li = 0; li < h + w; li++) {
        const k = P.lines[li].filter((i) => MK[i]).length;
        if (k > P.clue[li]) return { solved: false, msg: (li < h ? 'Row ' + (li + 1) : 'Column ' + (li - h + 1)) + ' has ' + k + ' track squares but wants ' + P.clue[li] + '.' };
      }
      for (let i = 0; i < N; i++) if (LG().BITS[MK[i]] > 2) return { solved: false, msg: 'The track branches at ' + L.cellName(i, w) + '.' };
      return { solved: false, msg: 'The line from A to B is not finished yet.' };
    }
    function refresh() {
      MK = masks();
      const BITS = LG().BITS;
      // loops: pieces of track that close on themselves
      const U = { p: Array.from({ length: N }, (_, i) => i) };
      const find = (x) => { while (U.p[x] !== x) { U.p[x] = U.p[U.p[x]]; x = U.p[x]; } return x; };
      const loopRoot = new Set();
      for (let e = 0; e < E2; e++) if (P.ea[e] >= 0 && onE(e)) { const a = find(P.ea[e]), b = find(P.eb[e]); if (a === b) loopRoot.add(a); else U.p[a] = b; }
      const loopy = (i) => loopRoot.size && loopRoot.has(find(i));
      for (let i = 0; i < N; i++) {
        const bad = BITS[MK[i]] > 2, lp = !bad && MK[i] && loopy(i);
        const key = MK[i] + ':' + su[i] + ':' + (bad ? 1 : 0) + (lp ? 1 : 0);
        if (sig[i] === key) continue;
        sig[i] = key;
        const g = pieceEls[i];
        while (g.firstChild) g.removeChild(g.firstChild);
        g.setAttribute('class', 'tk-piece' + (P.gmask[i] >= 0 ? ' fixed' : '') + (bad ? ' bad' : '') + (lp ? ' loop' : ''));
        if (MK[i]) trkPiece(s, g, cx(i), cy(i), MK[i]);
        const mg = markEls[i];
        while (mg.firstChild) mg.removeChild(mg.firstChild);
        if (su[i] === 1 && !MK[i]) s('rect', { x: cx(i) + 13, y: cy(i) + 13, width: TS - 26, height: TS - 26, rx: 4, class: 'tk-mark' }, mg);
        else if (su[i] === 2) s('path', { d: 'M' + (cx(i) + 16) + ' ' + (cy(i) + 16) + 'l12 12m0 -12l-12 12', class: 'tk-x' }, mg);
      }
      for (let e = 0; e < E2; e++) {
        if (P.ea[e] < 0) continue;
        const want = eu[e] === 2 && fixedE[e] < 0;
        if (want && !xEls[e]) {
          const i = P.ea[e], mx = e & 1 ? cx(i) + TS / 2 : cx(i) + TS, my = e & 1 ? cy(i) + TS : cy(i) + TS / 2;
          xEls[e] = s('path', { d: 'M' + (mx - 4.5) + ' ' + (my - 4.5) + 'l9 9m0 -9l-9 9', class: 'tk-ex' }, markG);
        } else if (!want && xEls[e]) { xEls[e].remove(); xEls[e] = null; }
      }
      for (let li = 0; li < h + w; li++) {
        const k = P.lines[li].filter((i) => MK[i]).length;
        let room = 0;
        for (const i of P.lines[li]) if (!MK[i] && su[i] !== 2) room++;
        clueEls[li].classList.toggle('done', k === P.clue[li]);
        clueEls[li].classList.toggle('bad', k > P.clue[li] || k + room < P.clue[li]);
      }
      let laid = 0;
      for (let i = 0; i < N; i++) if (MK[i]) laid++;
      ctx.stat('Track squares', laid + ' of ' + P.total);
      if (won && !evaluate().solved) setWon(false);
      if (shown) pruneHint();
    }

    /* ---------- the train ---------- */
    function runTrain(still) {
      if (trainStop) trainStop();
      while (trainG.firstChild) trainG.removeChild(trainG.firstChild);
      const pts = trkRoute(P, masks(), ox, oy);
      const cum = [0];
      for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      const total = cum[cum.length - 1];
      const at = (sd) => {
        sd = Math.max(0, Math.min(total, sd));
        let k = 1;
        while (k < cum.length - 1 && cum[k] < sd) k++;
        const t = (sd - cum[k - 1]) / Math.max(1e-6, cum[k] - cum[k - 1]);
        const a = pts[k - 1], b = pts[k];
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI];
      };
      const cars = [0, 1, 2].map((k) => {
        const g = s('g', { class: 'tk-car' + (k === 0 ? ' engine' : ' c' + k) }, trainG);
        s('rect', { x: -14, y: -8.5, width: 28, height: 17, rx: 4, class: 'tk-body' }, g);
        if (k === 0) { s('rect', { x: -12, y: -6, width: 9, height: 12, rx: 2, class: 'tk-cab' }, g); s('circle', { cx: 7, cy: 0, r: 3.6, class: 'tk-stack' }, g); s('circle', { cx: 13, cy: 0, r: 2.1, class: 'tk-lamp' }, g); } else { s('rect', { x: -10, y: -5, width: 20, height: 10, rx: 2, class: 'tk-roof' }, g); }
        return g;
      });
      const gap = 31;
      const place = (head) => cars.forEach((g, k) => { const [x, y, a] = at(head - k * gap); g.setAttribute('transform', 'translate(' + C.fmtNum(x) + ' ' + C.fmtNum(y) + ') rotate(' + C.fmtNum(a) + ')'); });
      const end = total - TS * 0.9;
      if (still) { place(end); return; }
      trainStop = C.tween(C.anim(Math.min(4200, 900 + total * 3.2)), (t) => place(2 * gap + (end - 2 * gap) * t), () => { trainStop = null; });
    }
    function setWon(on, animate) {
      if (won === on) return;
      won = on;
      G.classList.toggle('won', on);
      if (on) runTrain(!animate);
      else { if (trainStop) trainStop(); trainStop = null; while (trainG.firstChild) trainG.removeChild(trainG.firstChild); }
    }

    /* ---------- gestures ---------- */
    const edgeOf = (i, dd) => { const e = P.eid[4 * i + dd]; return e >= 0 && e < E2 ? e : -1; };
    function hit(pt) {
      const fx = (pt[0] - ox) / TS, fy = (pt[1] - oy) / TS, c = Math.floor(fx), r = Math.floor(fy);
      if (c < 0 || c >= w || r < 0 || r >= h) return null;
      const u = fx - c, v = fy - r, i = r * w + c;
      const du = Math.min(u, 1 - u), dv = Math.min(v, 1 - v), Z = 0.24;
      if (du < Z && dv < Z) return { i };
      if (du < Z) { const e = edgeOf(i, u < 0.5 ? 3 : 1); return e >= 0 ? { i, e } : { i }; }
      if (dv < Z) { const e = edgeOf(i, v < 0.5 ? 0 : 2); return e >= 0 ? { i, e } : { i }; }
      return { i };
    }
    function setEdge(e, val) {
      if (fixedE[e] >= 0) return false;
      if (eu[e] === val) return false;
      eu[e] = val;
      return true;
    }
    function toggleEdge(e, cross) {
      if (fixedE[e] >= 0) { ctx.toast('That piece of line is laid already.'); return; }
      const want = cross ? (eu[e] === 2 ? 0 : 2) : (eu[e] === 1 ? 0 : 1);
      if (setEdge(e, want)) { ctx.sfx('tap'); refresh(); ctx.changed('edge'); }
    }
    function toggleSq(i, empty) {
      if (P.gmask[i] >= 0) return;
      su[i] = empty ? (su[i] === 2 ? 0 : 2) : (su[i] === 1 ? 0 : 1);
      ctx.sfx('tap'); refresh(); ctx.changed('square');
    }
    let drag = null;
    function between(a, b) {
      const ra = Math.floor(a / w), ca = a % w, rb = Math.floor(b / w), cb = b % w;
      if (ra === rb && Math.abs(ca - cb) === 1) return 2 * (ra * w + Math.min(ca, cb));
      if (ca === cb && Math.abs(ra - rb) === 1) return 2 * (Math.min(ra, rb) * w + ca) + 1;
      return -1;
    }
    function down(pt, right, touch) {
      const t = hit(pt);
      if (!t) return false;
      curs.on = false; curs.r = Math.floor(t.i / w); curs.c = t.i % w; drawCursor();
      drag = { start: t, last: t.i, right, touch, moved: false, mode: null, changed: false, line: [t.i], pt0: pt };
      if (touch) drag.longT = later(() => { if (drag && !drag.moved) { const g = drag; drag = null; if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { /* no buzz */ } if (g.start.e != null) toggleEdge(g.start.e, !ui.tapCross); else toggleSq(g.start.i, !ui.tapCross); } }, 480);
      return true;
    }
    function move(pt) {
      if (!drag) return;
      const t = hit(pt);
      if (!t) return;
      if (t.i === drag.last) return;
      drag.moved = true;
      clearTimeout(drag.longT);
      // walk square by square towards the pointer
      let guard = 0;
      while (drag.last !== t.i && guard++ < 40) {
        const r = Math.floor(drag.last / w), c = drag.last % w, tr = Math.floor(t.i / w), tc = t.i % w;
        const nr = Math.abs(tr - r) >= Math.abs(tc - c) ? r + Math.sign(tr - r) : r, nc = nr === r ? c + Math.sign(tc - c) : c;
        const nxt = nr * w + nc;
        if (drag.right) {
          if (!drag.axis) drag.axis = nr !== r ? 'v' : 'h';
          if ((drag.axis === 'v' && nc !== c) || (drag.axis === 'h' && nr !== r)) break;
          if (!MK[nxt] && P.gmask[nxt] < 0 && su[nxt] === 0) { su[nxt] = 2; drag.changed = true; }
          if (drag.line.length === 1 && !MK[drag.last] && P.gmask[drag.last] < 0 && su[drag.last] === 0) { su[drag.last] = 2; drag.changed = true; }
          drag.line.push(nxt);
        } else {
          const e = between(drag.last, nxt);
          if (e >= 0 && fixedE[e] < 0) {
            if (!drag.mode) drag.mode = eu[e] === 1 ? 'erase' : 'lay';
            if (setEdge(e, drag.mode === 'lay' ? 1 : 0)) drag.changed = true;
          }
        }
        drag.last = nxt;
      }
      if (drag.changed) { ctx.sfx('tap'); refresh(); }
    }
    function up() {
      if (!drag) return;
      const g = drag;
      drag = null;
      clearTimeout(g.longT);
      if (!g.moved) {
        const cross = g.touch ? ui.tapCross : g.right;
        if (g.start.e != null) toggleEdge(g.start.e, cross); else toggleSq(g.start.i, cross);
        return;
      }
      if (g.changed) ctx.changed('lay');
    }
    wb.handlers.board = {
      down(pt, ev) { return down(pt, ev.button === 2, ev.pointerType === 'touch'); },
      move(pt) { move(pt); },
      up() { up(); },
      hover(pt) { hover(pt); }
    };
    const svgT = wb.svg, onLeaveT = () => hover(null);
    svgT.addEventListener('pointerleave', onLeaveT);
    function hover(pt) {
      while (hovG.firstChild) hovG.removeChild(hovG.firstChild);
      const t = pt && hit(pt);
      if (!t) return;
      if (t.e != null) {
        const i = P.ea[t.e];
        if (t.e & 1) s('path', { d: 'M' + (cx(i) + 8) + ' ' + (cy(i) + TS) + 'h' + (TS - 16), class: 'tk-hov' }, hovG);
        else s('path', { d: 'M' + (cx(i) + TS) + ' ' + (cy(i) + 8) + 'v' + (TS - 16), class: 'tk-hov' }, hovG);
      } else s('rect', { x: cx(t.i) + 10, y: cy(t.i) + 10, width: TS - 20, height: TS - 20, rx: 5, class: 'tk-hovsq' }, hovG);
    }
    function drawCursor() {
      curEl.style.display = curs.on ? '' : 'none';
      curEl.setAttribute('x', ox + curs.c * TS); curEl.setAttribute('y', oy + curs.r * TS);
    }
    drawCursor();

    /* ---------- hints ---------- */
    let shown = null;
    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function itemEls(it, cls) {
      if (it[0] === 'q') { const i = it[1]; return [s('rect', { x: cx(i) + 2, y: cy(i) + 2, width: TS - 4, height: TS - 4, rx: 6, class: cls }, hintG)]; }
      const e = it[1], i = P.ea[e];
      const x0 = cx(i), y0 = cy(i);
      return [s('rect', e & 1 ? { x: x0 + 6, y: y0 + TS - 7, width: TS - 12, height: 14, rx: 6, class: cls } : { x: x0 + TS - 7, y: y0 + 6, width: 14, height: TS - 12, rx: 6, class: cls }, hintG)];
    }
    const itemDone = (it) => (it[0] === 'q' ? (it[2] ? su[it[1]] === 1 || !!(MK && MK[it[1]]) : su[it[1]] === 2) : (it[2] ? onE(it[1]) === 1 : eu[it[1]] === 2 || fixedE[it[1]] === 0));
    function pruneHint() {
      shown.set = shown.set.filter((it) => { if (itemDone(it)) { (shown.els[it.join()] || []).forEach((e) => e.remove()); return false; } return true; });
      if (!shown.set.length && !shown.wrong) clearHint();
    }
    function userS() {
      const S = L.trkStart(P);
      for (let e = 0; e < E2; e++) { if (fixedE[e] >= 0 || P.ea[e] < 0) continue; if (eu[e] === 1) S.ed[e] = 1; else if (eu[e] === 2) S.ed[e] = 0; }
      for (let i = 0; i < N; i++) { if (P.gmask[i] >= 0) continue; if (su[i] === 1) S.q[i] = 1; else if (su[i] === 2) S.q[i] = 0; }
      return S;
    }
    const hinter = makeHinter(ctx, {
      wrongWord: 'mark',
      wrong: () => {
        const out = [];
        for (let e = 0; e < E2; e++) if (fixedE[e] < 0 && ((eu[e] === 1 && !solE[e]) || (eu[e] === 2 && solE[e]))) out.push(['e', e]);
        for (let i = 0; i < N; i++) if ((su[i] === 1 && !M.sol[i]) || (su[i] === 2 && M.sol[i])) out.push(['q', i]);
        return out;
      },
      rubOut: (list) => list.forEach(([k, x]) => { if (k === 'e') eu[x] = 0; else su[x] = 0; }),
      step: () => L.trkStep(P, userS(), 5, M.sol),
      done: itemDone,
      apply: (set) => { set.forEach(([k, x, v]) => { if (k === 'e') { if (fixedE[x] < 0) eu[x] = v ? 1 : 2; } else su[x] = v ? 1 : 2; }); return set; },
      describe: (set) => { const e = set.filter((x) => x[0] === 'e'), q = set.filter((x) => x[0] === 'q'); const parts = []; if (e.length) parts.push(e.some((x) => x[2]) ? 'I laid the track' : 'I marked where the track does not go'); if (q.length) parts.push('I marked ' + C.plural(q.length, 'square') + (q[0][2] ? ' as track' : ' as empty')); return parts.join(' and '); },
      show: (st) => { clearHint(); shown = { set: st.set.slice(), els: {} }; (st.focus || []).forEach((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: TS - 2, height: TS - 2, rx: 5, class: 'tk-hzone' }, hintG)); st.set.forEach((it) => { shown.els[it.join()] = itemEls(it, 'tk-hcell'); }); },
      showWrong: (list) => { clearHint(); shown = { set: [], els: {}, wrong: true }; list.forEach((it) => itemEls(it, 'tk-hwrong')); },
      clear: clearHint,
      flash: (items) => { const els = [].concat(...items.map((it) => itemEls(it, 'tk-flash'))); later(() => els.forEach((e) => e.remove()), 1400); },
      evaluate,
      refresh
    });

    /* ---------- the panel ---------- */
    const segBtns = ['Track', 'No track'].map((label, j) => ctx.h('button.t2-segb' + (j === 0 ? '.on' : ''), { type: 'button', onclick: () => { ui.tapCross = j === 1; segBtns.forEach((b, t) => b.classList.toggle('on', t === j)); } }, label));
    ctx.panel.appendChild(ctx.h('div.t2-panel',
      ctx.h('div.t2-seg', ctx.h('span.t2-segl', 'Tap marks:'), segBtns),
      ctx.h('div.t2-tip', 'Click a side between squares to lay track across it, right-click to rule it out. Click inside a square to mark it (right-click: empty). Drag from square to square to lay a stretch of line.')));

    refresh();

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!manual && !won) {
          setWon(true, true);
          clearHint();
          later(() => { if (won) ctx.solved({ msg: r.msg }); }, C.anim(1400));
          return { solved: false, msg: '' };
        }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() { return hinter.hint(); },
      solve() {
        clearHint(); hinter.forget();
        for (let e = 0; e < E2; e++) if (fixedE[e] < 0 && eu[e] === 1 && !solE[e]) eu[e] = 0;
        for (let e = 0; e < E2; e++) if (fixedE[e] < 0 && eu[e] === 2 && solE[e]) eu[e] = 0;
        for (let i = 0; i < N; i++) if (su[i] === 2 && M.sol[i]) su[i] = 0;
        // lay it from A to B
        const order = [];
        let i = P.A, from = 3, guard = 0;
        while (guard++ < N) {
          let to = -1;
          for (let dd = 0; dd < 4; dd++) if (dd !== from && (M.sol[i] >> dd & 1)) to = dd;
          const e = edgeOf(i, to);
          if (e < 0) break;
          order.push(e);
          i = P.nb[4 * i + to]; from = (to + 2) % 4;
        }
        const per = Math.max(1, Math.ceil(order.length / 20));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < order.length; t++, k++) if (fixedE[order[k]] < 0) eu[order[k]] = 1;
          refresh();
          if (k < order.length) later(tick, C.anim(40)); else ctx.changed('solve');
        };
        tick();
      },
      getState() { return { e: Array.from(eu).join(''), q: Array.from(su).join('') }; },
      setState(o) {
        if (!o || typeof o.e !== 'string' || o.e.length !== E2 || typeof o.q !== 'string' || o.q.length !== N) return;
        for (let e = 0; e < E2; e++) eu[e] = fixedE[e] >= 0 || P.ea[e] < 0 ? 0 : Math.max(0, Math.min(2, +o.e[e] || 0));
        for (let i = 0; i < N; i++) su[i] = P.gmask[i] >= 0 ? 0 : Math.max(0, Math.min(2, +o.q[i] || 0));
        drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { hinter.reset(); clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return curs.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (DIRKEY[k]) {
          if (!curs.on) { curs.on = true; drawCursor(); return true; }
          const nr = Math.max(0, Math.min(h - 1, curs.r + DIRKEY[k][0])), nc = Math.max(0, Math.min(w - 1, curs.c + DIRKEY[k][1]));
          if (ev.shiftKey) { const e = between(curs.r * w + curs.c, nr * w + nc); if (e >= 0) toggleEdge(e, false); }
          curs.r = nr; curs.c = nc;
          drawCursor();
          return true;
        }
        if (!curs.on) return false;
        const i = curs.r * w + curs.c;
        if (k === 'Enter') { toggleSq(i, false); return true; }
        if (k === ' ') { toggleSq(i, true); return true; }
        if (k === 'Escape') { curs.on = false; drawCursor(); }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); if (trainStop) trainStop(); svgT.removeEventListener('pointerleave', onLeaveT); }
    };
  }

  /* =====================================================================
   *  SIGNPOST
   * ===================================================================== */

  const SS = 52;
  const CHAIN_HUES = [205, 25, 140, 285, 50, 330, 175, 95, 245, 5, 305, 70];
  const ARROW_PATH = 'M0 11V-5M-7.5 0L0 -10.5L7.5 0';
  function mountSignpost(ctx, p) {
    const d = p.data, wb = ctx.wb, s = ctx.s, L = LG();
    const M = spModel(d), P = M.P, w = d.w, h = d.h, N = w * h;
    const nx = new Int32Array(N).fill(-1), pv = new Int32Array(N).fill(-1);
    const ui = { links: true };
    let won = false, picked = -1, drag = null;
    const timers = [], later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const curs = { r: 0, c: 0, on: false };
    ctx.setGoal(p.goal || GOALS.signpost);

    const GW = w * SS, GH = h * SS;
    wb.setBounds({ x0: -6, y0: -6, x1: GW + 6, y1: GH + 6 }, 0.05);
    const G = s('g', { class: 'sp' }, wb.layer('board'));
    s('rect', { x: -4, y: -4, width: GW + 8, height: GH + 8, rx: 8, class: 'sp-boardbg' }, G);
    const cellG = s('g', null, G), linkG = s('g', { class: 'sp-links' }, G), glyphG = s('g', { class: 'sp-glyphs' }, G);
    const topG = s('g', { class: 'sp-top' }, wb.layer('top'));
    const tgtG = s('g', null, topG), hintG = s('g', null, topG);
    const rubber = s('path', { class: 'sp-rubber' }, topG);
    rubber.style.display = 'none';
    const pickEl = s('rect', { width: SS - 4, height: SS - 4, rx: 7, class: 'sp-pick' }, topG);
    const curEl = s('rect', { width: SS, height: SS, rx: 7, class: 'sp-cursor' }, topG);
    const cx = (i) => (i % w) * SS, cy = (i) => Math.floor(i / w) * SS;
    const mid = (i) => [cx(i) + SS / 2, cy(i) + SS / 2];
    const bgEls = [], labEls = [], arrEls = [];
    for (let i = 0; i < N; i++) {
      bgEls.push(s('rect', { x: cx(i) + 1.5, y: cy(i) + 1.5, width: SS - 3, height: SS - 3, rx: 6, class: 'sp-cell', 'data-key': 's' + i }, cellG));
      const g = s('g', { transform: 'translate(' + (cx(i) + SS / 2 + 3) + ' ' + (cy(i) + SS / 2 + 4) + ')' }, glyphG);
      if (P.dirs[i] >= 0) arrEls.push(s('path', { d: ARROW_PATH, transform: 'rotate(' + P.dirs[i] * 45 + ')', class: 'sp-arrow' }, g));
      else { arrEls.push(null); s('text', { x: 0, y: 0, class: 'sp-star', text: '★' }, g); }
      labEls.push(s('text', { x: cx(i) + 7, y: cy(i) + 14, class: 'sp-lab' + (P.num[i] ? ' given' : '') }, glyphG));
    }

    /* ---------- chains ---------- */
    let CH = null;
    function chains() {
      const head = new Int32Array(N).fill(-1), idx = new Int32Array(N), bad = new Uint8Array(N);
      const heads = [];
      for (let hd = 0; hd < N; hd++) {
        if (pv[hd] >= 0) continue;
        let i = hd, k = 0;
        const cells = [];
        while (i >= 0 && k <= N) { head[i] = hd; idx[i] = k++; cells.push(i); i = nx[i]; }
        let p0 = 0, clash = false;
        for (const c of cells) if (P.num[c]) { const q = P.num[c] - idx[c]; if (p0 && q !== p0) clash = true; if (!p0) p0 = q; }
        if (p0 && (p0 < 1 || p0 + cells.length - 1 > N)) clash = true;
        if (clash) cells.forEach((c) => { bad[c] = 1; });
        heads.push({ hd, cells, p0: clash ? 0 : p0, clash });
      }
      return { head, idx, bad, heads };
    }
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    function refresh() {
      CH = chains();
      let letter = 0;
      const col = new Array(N).fill(-1), lab = new Array(N).fill('');
      for (const ch of CH.heads) {
        if (ch.p0) { ch.cells.forEach((c, k) => { lab[c] = String(ch.p0 + k); }); continue; }
        if (ch.cells.length < 2) { const c = ch.cells[0]; lab[c] = P.num[c] ? String(P.num[c]) : ''; continue; }
        const L0 = LETTERS[letter % 26] + (letter >= 26 ? Math.floor(letter / 26) : ''), hue = letter % CHAIN_HUES.length;
        letter++;
        ch.cells.forEach((c, k) => { lab[c] = ch.clash ? (P.num[c] ? String(P.num[c]) : '?') : (k ? L0 + '+' + k : L0); col[c] = hue; });
      }
      for (let i = 0; i < N; i++) {
        labEls[i].textContent = lab[i];
        const linked = nx[i] >= 0 || pv[i] >= 0;
        bgEls[i].setAttribute('class', 'sp-cell' + (col[i] >= 0 ? ' chain' : linked ? ' num' : '') + (CH.bad[i] ? ' bad' : ''));
        bgEls[i].style.fill = col[i] >= 0 ? 'hsl(' + CHAIN_HUES[col[i]] + ' 70% 60% / .30)' : '';
        labEls[i].classList.toggle('bad', !!CH.bad[i]);
        labEls[i].classList.toggle('derived', !P.num[i] && !!lab[i] && /^\d+$/.test(lab[i]));
      }
      // the links
      while (linkG.firstChild) linkG.removeChild(linkG.firstChild);
      if (ui.links) for (let i = 0; i < N; i++) {
        if (nx[i] < 0) continue;
        const a = mid(i), b = mid(nx[i]), dx = b[0] - a[0], dy = b[1] - a[1], Ln = Math.hypot(dx, dy);
        const ux = dx / Ln, uy = dy / Ln, a2 = [a[0] + ux * 12, a[1] + uy * 12], b2 = [b[0] - ux * 13, b[1] - uy * 13];
        const cls = 'sp-link' + (col[i] >= 0 ? '' : ' num');
        const style = col[i] >= 0 ? 'stroke: hsl(' + CHAIN_HUES[col[i]] + ' 65% 50%)' : '';
        s('path', { d: 'M' + C.fmtNum(a2[0]) + ' ' + C.fmtNum(a2[1]) + 'L' + C.fmtNum(b2[0]) + ' ' + C.fmtNum(b2[1]), class: cls, style }, linkG);
        s('path', { d: 'M' + C.fmtNum(b2[0] - ux * 7 - uy * 4.5) + ' ' + C.fmtNum(b2[1] - uy * 7 + ux * 4.5) + 'L' + C.fmtNum(b2[0]) + ' ' + C.fmtNum(b2[1]) + 'L' + C.fmtNum(b2[0] - ux * 7 + uy * 4.5) + ' ' + C.fmtNum(b2[1] - uy * 7 - ux * 4.5), class: cls + ' head', style }, linkG);
      }
      let links = 0;
      for (let i = 0; i < N; i++) if (nx[i] >= 0) links++;
      ctx.stat('Links', links + ' of ' + (N - 1));
      pickEl.style.display = picked >= 0 ? '' : 'none';
      if (picked >= 0) { pickEl.setAttribute('x', cx(picked) + 2); pickEl.setAttribute('y', cy(picked) + 2); }
      if (won && !evaluate().solved) setWon(false);
      if (shown) pruneHint();
    }
    function evaluate() {
      let links = 0, right = true;
      for (let i = 0; i < N; i++) { if (nx[i] >= 0) links++; if (i !== P.end && nx[i] !== M.next[i]) right = false; }
      if (right) return { solved: true, msg: 'Follow the signs: 1 to ' + N + ' without a detour.' };
      const ch = CH || chains();
      if (ch.heads.some((x) => x.clash)) return { solved: false, msg: 'The numbers of a chain do not fit (shown in red).' };
      return { solved: false, msg: links === N - 1 ? 'Every square is linked, but not into one chain from 1.' : C.plural(N - 1 - links, 'link is', 'links are') + ' still missing.' };
    }
    function setWon(on, animate) {
      if (won === on) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      if (on) for (let i = 0; i < N; i++) labEls[i].style.animationDelay = (0.9 * (M.order[i] - 1) / N).toFixed(3) + 's';
    }

    /* ---------- linking ---------- */
    function reaches(from, target) { let i = from, k = 0; while (i >= 0 && k++ <= N) { if (i === target) return true; i = nx[i]; } return false; }
    function link(i, j, quiet) {
      if (nx[i] === j) return false;
      if (j === P.start) { if (!quiet) ctx.toast('Nothing leads into square 1.'); return false; }
      if (reaches(j, i)) { if (!quiet) ctx.toast('That would close the chain into a loop.'); return false; }
      if (nx[i] >= 0) pv[nx[i]] = -1;
      if (pv[j] >= 0) nx[pv[j]] = -1;
      nx[i] = j; pv[j] = i;
      return true;
    }
    function tryLink(a, b) {
      let ok = false;
      if (P.succ[a].indexOf(b) >= 0) ok = link(a, b);
      else if (P.succ[b].indexOf(a) >= 0) ok = link(b, a);
      else { ctx.toast('Neither arrow points at the other square.'); ctx.sfx('wrong'); return; }
      if (ok) { ctx.sfx('snap'); refresh(); ctx.changed('link'); }
    }
    function cut(i) {
      let did = false;
      if (nx[i] >= 0) { pv[nx[i]] = -1; nx[i] = -1; did = true; } else if (pv[i] >= 0) { nx[pv[i]] = -1; pv[i] = -1; did = true; }
      if (did) { ctx.sfx('tap'); refresh(); ctx.changed('cut'); }
    }
    function cellAt(pt) {
      const c = Math.floor(pt[0] / SS), r = Math.floor(pt[1] / SS);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    function showTargets(i) {
      while (tgtG.firstChild) tgtG.removeChild(tgtG.firstChild);
      if (i < 0) return;
      P.succ[i].forEach((j) => s('rect', { x: cx(j) + 4, y: cy(j) + 4, width: SS - 8, height: SS - 8, rx: 6, class: 'sp-target' }, tgtG));
      P.pred[i].forEach((j) => s('rect', { x: cx(j) + 4, y: cy(j) + 4, width: SS - 8, height: SS - 8, rx: 6, class: 'sp-target back' }, tgtG));
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = cellAt(pt);
        if (i < 0) return false;
        curs.on = false; curs.r = Math.floor(i / w); curs.c = i % w; drawCursor();
        if (ev.button === 2) { picked = -1; cut(i); return true; }
        drag = { i, moved: false, touch: ev.pointerType === 'touch', pt0: pt };
        if (drag.touch) drag.longT = later(() => { if (drag && !drag.moved) { const k = drag.i; drag = null; rubber.style.display = 'none'; showTargets(-1); picked = -1; cut(k); } }, 480);
        showTargets(i);
        return true;
      },
      move(pt) {
        if (!drag) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.pt0[0], pt[1] - drag.pt0[1]) < SS * 0.3) return;
        drag.moved = true;
        clearTimeout(drag.longT);
        const a = mid(drag.i);
        rubber.style.display = '';
        rubber.setAttribute('d', 'M' + a[0] + ' ' + a[1] + 'L' + C.fmtNum(pt[0]) + ' ' + C.fmtNum(pt[1]));
      },
      up(pt) {
        if (!drag) return;
        const g = drag;
        drag = null;
        clearTimeout(g.longT);
        rubber.style.display = 'none';
        showTargets(-1);
        const j = cellAt(pt);
        if (!g.moved || j === g.i) {
          if (picked < 0) picked = g.i;
          else if (picked === g.i) picked = -1;
          else { const a = picked; picked = -1; tryLink(a, g.i); return; }
          refresh();
          return;
        }
        picked = -1;
        if (j < 0) { if (nx[g.i] >= 0) cut(g.i); else refresh(); return; }
        tryLink(g.i, j);
      }
    };
    function drawCursor() {
      curEl.style.display = curs.on ? '' : 'none';
      curEl.setAttribute('x', curs.c * SS); curEl.setAttribute('y', curs.r * SS);
    }
    drawCursor();

    /* ---------- hints ---------- */
    let shown = null;
    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function pairEls([i, j], cls) {
      const a = mid(i), b = mid(j);
      return [s('rect', { x: cx(i) + 2, y: cy(i) + 2, width: SS - 4, height: SS - 4, rx: 7, class: cls }, hintG), s('rect', { x: cx(j) + 2, y: cy(j) + 2, width: SS - 4, height: SS - 4, rx: 7, class: cls }, hintG),
        s('path', { d: 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], class: cls + ' ln' }, hintG)];
    }
    function pruneHint() {
      shown.set = shown.set.filter((x) => { if (nx[x[0]] === x[1]) { (shown.els[x.join()] || []).forEach((e) => e.remove()); return false; } return true; });
      if (!shown.set.length && !shown.wrong) clearHint();
    }
    const hinter = makeHinter(ctx, {
      wrongWord: 'link',
      wrong: () => { const out = []; for (let i = 0; i < N; i++) if (nx[i] >= 0 && nx[i] !== M.next[i]) out.push([i, nx[i]]); return out; },
      rubOut: (list) => list.forEach(([i]) => { if (nx[i] >= 0) { pv[nx[i]] = -1; nx[i] = -1; } }),
      step: () => L.spStep(P, Array.from(nx), 4, M.next),
      done: ([i, j]) => nx[i] === j,
      apply: (set) => { set.forEach(([i, j]) => link(i, j, true)); return set; },
      describe: (set) => 'I linked ' + L.cellName(set[0][0], w) + ' to ' + L.cellName(set[0][1], w),
      show: (st) => { clearHint(); shown = { set: st.set.slice(), els: {} }; st.set.forEach((x) => { shown.els[x.join()] = pairEls(x, 'sp-hcell'); }); },
      showWrong: (list) => { clearHint(); shown = { set: [], els: {}, wrong: true }; list.forEach((x) => pairEls(x, 'sp-hwrong')); },
      clear: clearHint,
      flash: (set) => { const els = [].concat(...set.map((x) => pairEls(x, 'sp-flash'))); later(() => els.forEach((e) => e.remove()), 1400); },
      evaluate,
      refresh
    });

    /* ---------- the panel ---------- */
    const cb = ctx.h('input', { type: 'checkbox', checked: true, onchange: () => { ui.links = cb.checked; refresh(); } });
    ctx.panel.appendChild(ctx.h('div.t2-panel',
      ctx.h('div.t2-tip', 'Drag from a square to the next one (or the other way round). Tap one square, then another, to link them without dragging. Drag a square off the board, or right-click it, to cut its link.'),
      ctx.h('label.t2-opt', cb, ' Show the links as lines')));

    refresh();

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() { return hinter.hint(); },
      solve() {
        clearHint(); hinter.forget(); picked = -1;
        for (let i = 0; i < N; i++) if (nx[i] >= 0 && nx[i] !== M.next[i]) { pv[nx[i]] = -1; nx[i] = -1; }
        const order = [];
        for (let k = 1; k < N; k++) { const i = M.order.indexOf(k); if (nx[i] !== M.next[i]) order.push(i); }
        const per = Math.max(1, Math.ceil(order.length / 18));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < order.length; t++, k++) link(order[k], M.next[order[k]], true);
          refresh();
          if (k < order.length) later(tick, C.anim(40)); else ctx.changed('solve');
        };
        tick();
      },
      getState() { return { n: Array.from(nx) }; },
      setState(o) {
        if (!o || !Array.isArray(o.n) || o.n.length !== N) return;
        nx.fill(-1); pv.fill(-1);
        for (let i = 0; i < N; i++) { const j = o.n[i]; if (j >= 0 && j < N && P.succ[i].indexOf(j) >= 0 && pv[j] < 0) { nx[i] = j; pv[j] = i; } }
        // no loops
        for (let i = 0; i < N; i++) if (nx[i] >= 0 && reaches(nx[i], i)) { pv[nx[i]] = -1; nx[i] = -1; }
        picked = -1; drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { hinter.reset(); clearHint(); picked = -1; },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (DIRKEY[k]) {
          if (!curs.on) { curs.on = true; drawCursor(); return true; }
          curs.r = Math.max(0, Math.min(h - 1, curs.r + DIRKEY[k][0])); curs.c = Math.max(0, Math.min(w - 1, curs.c + DIRKEY[k][1]));
          drawCursor();
          return true;
        }
        if (!curs.on) return false;
        const i = curs.r * w + curs.c;
        if (k === 'Enter' || k === ' ') {
          if (picked < 0) { picked = i; showTargets(i); refresh(); } else if (picked === i) { picked = -1; showTargets(-1); refresh(); } else { const a = picked; picked = -1; showTargets(-1); tryLink(a, i); }
          return true;
        }
        if (k === 'Backspace' || k === 'Delete') { cut(i); return true; }
        if (k === 'Escape') { picked = -1; showTargets(-1); curs.on = false; drawCursor(); refresh(); return true; }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); }
    };
  }

  /* =====================================================================
   *  RANGE
   * ===================================================================== */

  const RS = 40;
  function mountRange(ctx, p) {
    const d = p.data, wb = ctx.wb, s = ctx.s, L = LG();
    const M = rgModel(d), P = M.P, w = d.w, h = d.h, N = w * h;
    const st = new Int8Array(N);              // 0 empty, 1 black, 2 dot
    const ui = { tapDot: false };
    let won = false, drag = null, hovI = -1;
    const timers = [], later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const curs = { r: 0, c: 0, on: false };
    ctx.setGoal(p.goal || GOALS.range);

    const GW = w * RS, GH = h * RS;
    wb.setBounds({ x0: -6, y0: -6, x1: GW + 6, y1: GH + 6 }, 0.05);
    const G = s('g', { class: 'rg' }, wb.layer('board'));
    s('rect', { x: -4, y: -4, width: GW + 8, height: GH + 8, rx: 7, class: 'rg-boardbg' }, G);
    const cellG = s('g', null, G), viewG = s('g', { class: 'rg-view' }, G), markG = s('g', null, G), lineG = s('g', null, G), textG = s('g', { class: 'rg-texts' }, G);
    const topG = s('g', { class: 'rg-top' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const curEl = s('rect', { width: RS, height: RS, rx: 5, class: 'rg-cursor' }, topG);
    const cx = (i) => (i % w) * RS, cy = (i) => Math.floor(i / w) * RS;
    const cellEls = [], markEls = [], numEls = {}, sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) {
      cellEls.push(s('rect', { x: cx(i), y: cy(i), width: RS, height: RS, class: 'rg-cell', 'data-key': 'r' + i }, cellG));
      markEls.push(s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')' }, markG));
    }
    let grid = '';
    for (let c = 1; c < w; c++) grid += 'M' + c * RS + ' 0v' + GH;
    for (let r = 1; r < h; r++) grid += 'M0 ' + r * RS + 'h' + GW;
    s('path', { d: grid, class: 'rg-grid' }, lineG);
    s('rect', { x: 0, y: 0, width: GW, height: GH, rx: 2, class: 'rg-frame' }, lineG);
    P.clues.forEach((c) => { numEls[c] = s('text', { x: cx(c) + RS / 2, y: cy(c) + RS / 2 + 1, class: 'rg-num', text: String(P.num[c]) }, textG); });

    const vals = () => { const v = new Int8Array(N); for (let i = 0; i < N; i++) v[i] = st[i] === 1 ? 1 : st[i] === 2 ? 0 : -1; for (const c of P.clues) v[c] = 0; return v; };
    // views counted with every square that is not black as white
    function seen(c, black) {
      let k = 1;
      for (let dd = 0; dd < 4; dd++) for (const j of P.rays[c][dd]) { if (black[j]) break; k++; }
      return k;
    }
    function splitCells(black) {
      const comp = new Int32Array(N).fill(-1), sizes = [];
      for (let i = 0; i < N; i++) {
        if (black[i] || comp[i] >= 0) continue;
        const id = sizes.length, stack = [i];
        comp[i] = id; let n = 0;
        while (stack.length) { const u = stack.pop(); n++; for (const x of P.nb4[u]) if (!black[x] && comp[x] < 0) { comp[x] = id; stack.push(x); } }
        sizes.push(n);
      }
      if (sizes.length < 2) return null;
      let big = 0;
      sizes.forEach((n, k) => { if (n > sizes[big]) big = k; });
      return { comp, big };
    }
    function evaluate() {
      const black = Array.from(st, (x) => x === 1);
      for (let i = 0; i < N; i++) if (black[i] && P.nb4[i].some((j) => black[j])) return { solved: false, msg: 'Two black squares are touching.' };
      if (splitCells(black)) return { solved: false, msg: 'The white squares are cut into separate groups.' };
      let off = 0;
      for (const c of P.clues) if (seen(c, black) !== P.num[c]) off++;
      if (!off) return { solved: true, msg: 'Every number sees exactly what it should.' };
      return { solved: false, msg: (off === 1 ? 'One number sees' : off + ' numbers see') + ' the wrong number of squares.' };
    }
    function refresh() {
      const v = vals(), black = Array.from(st, (x) => x === 1);
      const err = new Uint8Array(N);
      for (let i = 0; i < N; i++) if (black[i]) for (const j of P.nb4[i]) if (black[j]) { err[i] = 1; err[j] = 1; }
      const sp = splitCells(black);
      for (let i = 0; i < N; i++) {
        const cut = sp && !black[i] && sp.comp[i] !== sp.big ? 1 : 0;
        const key = st[i] + ':' + err[i] + ':' + cut;
        if (sig[i] === key) continue;
        sig[i] = key;
        cellEls[i].setAttribute('class', 'rg-cell' + (st[i] === 1 ? ' black' : '') + (err[i] ? ' err' : '') + (cut ? ' cut' : ''));
        const g = markEls[i];
        while (g.firstChild) g.removeChild(g.firstChild);
        if (st[i] === 2 && P.num[i] <= 0) s('circle', { cx: RS / 2, cy: RS / 2, r: 3.2, class: 'rg-dot' }, g);
      }
      for (const c of P.clues) {
        const V = L.rgView(P, v, c), k = P.num[c];
        numEls[c].classList.toggle('ok', V.min === k && V.max === k);
        numEls[c].classList.toggle('bad', V.min > k || V.max < k);
        numEls[c].classList.toggle('onblack', st[c] === 1);
      }
      let nb = 0;
      for (let i = 0; i < N; i++) if (st[i] === 1) nb++;
      ctx.stat('Black', nb);
      drawView();
      if (won && !evaluate().solved) setWon(false);
      if (shown) pruneHint();
    }
    // what the number under the pointer can see
    function drawView() {
      while (viewG.firstChild) viewG.removeChild(viewG.firstChild);
      if (hovI < 0 || !(P.num[hovI] > 0)) return;
      const cells = [hovI];
      for (let dd = 0; dd < 4; dd++) for (const j of P.rays[hovI][dd]) { if (st[j] === 1) break; cells.push(j); }
      cells.forEach((j) => s('rect', { x: cx(j) + 1, y: cy(j) + 1, width: RS - 2, height: RS - 2, rx: 3, class: 'rg-seen' }, viewG));
    }
    function setWon(on, animate) {
      if (won === on) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      if (on) P.clues.forEach((c) => { numEls[c].style.animationDelay = (0.05 * ((c % w) + Math.floor(c / w))).toFixed(2) + 's'; });
    }

    /* ---------- gestures (as in the shading puzzles) ---------- */
    function cellAt(pt) {
      const c = Math.floor(pt[0] / RS), r = Math.floor(pt[1] / RS);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    const fixed = (i) => P.num[i] > 0;
    function startDrag(i, dot) {
      curs.on = false; curs.r = Math.floor(i / w); curs.c = i % w; drawCursor();
      if (fixed(i)) { if (!dot) ctx.toast('Numbered squares always stay white.'); return; }
      const from = st[i], to = dot ? (from === 2 ? 0 : 2) : (from === 1 ? 0 : 1);
      drag = { a: i, from, to, orig: Int8Array.from(st), line: [i], one: to === 1, axis: null };
      st[i] = to;
      ctx.sfx('tap');
      refresh();
    }
    function moveDrag(pt) {
      if (!drag || drag.one) return;
      const ar = Math.floor(drag.a / w), ac = drag.a % w;
      const c = Math.max(0, Math.min(w - 1, Math.floor(pt[0] / RS))), r = Math.max(0, Math.min(h - 1, Math.floor(pt[1] / RS)));
      if (r === ar && c === ac) drag.axis = null; else if (!drag.axis) drag.axis = Math.abs(c - ac) >= Math.abs(r - ar) ? 'h' : 'v';
      const line = [];
      if (!drag.axis) line.push(drag.a);
      else if (drag.axis === 'h') for (let k = Math.min(ac, c); k <= Math.max(ac, c); k++) line.push(ar * w + k);
      else for (let k = Math.min(ar, r); k <= Math.max(ar, r); k++) line.push(k * w + ac);
      let changed = false;
      drag.line.forEach((j) => { if (!line.includes(j) && st[j] !== drag.orig[j]) { st[j] = drag.orig[j]; changed = true; } });
      line.forEach((j) => { if (!fixed(j) && drag.orig[j] === drag.from && st[j] !== drag.to) { st[j] = drag.to; changed = true; } });
      drag.line = line;
      if (changed) refresh();
    }
    function endDrag() {
      if (!drag) return;
      const changed = st.some((x, i) => x !== drag.orig[i]);
      drag = null;
      if (changed) ctx.changed('cells');
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = cellAt(pt);
        if (i < 0) return false;
        startDrag(i, ev.pointerType === 'touch' ? ui.tapDot : ev.button === 2);
        return true;
      },
      move(pt) { moveDrag(pt); },
      up() { endDrag(); },
      hover(pt) { const i = cellAt(pt); if (i !== hovI) { hovI = i; drawView(); } }
    };
    const svg = wb.svg, onLeave = () => { hovI = -1; drawView(); };
    svg.addEventListener('pointerleave', onLeave);
    function drawCursor() {
      curEl.style.display = curs.on ? '' : 'none';
      curEl.setAttribute('x', curs.c * RS); curEl.setAttribute('y', curs.r * RS);
    }
    drawCursor();

    /* ---------- hints ---------- */
    let shown = null;
    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function pruneHint() {
      shown.set = shown.set.filter(([i, x]) => { if (st[i] === (x ? 1 : 2)) { (shown.els[i] || []).forEach((e) => e.remove()); return false; } return true; });
      if (!shown.set.length && !shown.wrong) clearHint();
    }
    const box = (i, cls) => s('rect', { x: cx(i) + 2, y: cy(i) + 2, width: RS - 4, height: RS - 4, rx: 5, class: cls }, hintG);
    const hinter = makeHinter(ctx, {
      wrongWord: 'mark',
      wrong: () => { const out = []; for (let i = 0; i < N; i++) if ((st[i] === 1 && !M.sol[i]) || (st[i] === 2 && M.sol[i])) out.push(i); return out; },
      rubOut: (list) => list.forEach((i) => { st[i] = 0; }),
      step: () => L.rgStep(P, vals(), 4, M.sol),
      done: ([i, x]) => st[i] === (x ? 1 : 2),
      apply: (set) => { set.forEach(([i, x]) => { st[i] = x ? 1 : 2; }); return set.map((y) => y[0]); },
      describe: (set) => { const b = set.filter((x) => x[1]).length, wh = set.length - b; return 'I put in ' + [b ? cnt(b) + ' black square' + (b === 1 ? '' : 's') : '', wh ? cnt(wh) + ' dot' + (wh === 1 ? '' : 's') : ''].filter(Boolean).join(' and '); },
      show: (stp) => {
        clearHint();
        shown = { set: stp.set.slice(), els: {} };
        (stp.focus || []).forEach((i) => box(i, 'rg-hzone'));
        stp.set.forEach(([i, x]) => {
          const g = s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')', class: 'rg-ghost' }, hintG);
          s('rect', { x: 2.5, y: 2.5, width: RS - 5, height: RS - 5, rx: 5, class: 'rg-hcell' }, g);
          if (x) s('rect', { x: 6, y: 6, width: RS - 12, height: RS - 12, rx: 3, class: 'rg-hblack' }, g); else s('circle', { cx: RS / 2, cy: RS / 2, r: 3.4, class: 'rg-dot' }, g);
          shown.els[i] = [g];
        });
      },
      showWrong: (list) => { clearHint(); shown = { set: [], els: {}, wrong: true }; list.forEach((i) => box(i, 'rg-hwrong')); },
      clear: clearHint,
      flash: (cells) => { const els = cells.map((i) => box(i, 'rg-flash')); later(() => els.forEach((e) => e.remove()), 1400); },
      evaluate,
      refresh
    });

    /* ---------- the panel ---------- */
    const segBtns = ['Black', 'Dot'].map((label, j) => ctx.h('button.t2-segb' + (j === 0 ? '.on' : ''), { type: 'button', onclick: () => { ui.tapDot = j === 1; segBtns.forEach((b, t) => b.classList.toggle('on', t === j)); } }, label));
    ctx.panel.appendChild(ctx.h('div.t2-panel',
      ctx.h('div.t2-seg', ctx.h('span.t2-segl', 'Tap puts:'), segBtns),
      ctx.h('div.t2-tip', 'Right-click puts a dot (a square you know is white); drag with it along a line to dot a run. Point at a number to see what it sees.')));

    refresh();

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() { return hinter.hint(); },
      solve() {
        clearHint(); hinter.forget();
        const order = [];
        for (let i = 0; i < N; i++) if ((M.sol[i] && st[i] !== 1) || (!M.sol[i] && st[i] === 1)) order.push(i);
        order.sort((a, b) => (a % w + Math.floor(a / w)) - (b % w + Math.floor(b / w)) || a - b);
        const per = Math.max(1, Math.ceil(order.length / 16));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < order.length; t++, k++) st[order[k]] = M.sol[order[k]] ? 1 : 0;
          refresh();
          if (k < order.length) later(tick, C.anim(40)); else ctx.changed('solve');
        };
        tick();
      },
      getState() { return { s: Array.from(st).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        for (let i = 0; i < N; i++) st[i] = fixed(i) ? 0 : Math.max(0, Math.min(2, +o.s[i] || 0));
        drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { hinter.reset(); clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return curs.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        if (DIRKEY[k]) {
          if (!curs.on) { curs.on = true; drawCursor(); return true; }
          curs.r = Math.max(0, Math.min(h - 1, curs.r + DIRKEY[k][0])); curs.c = Math.max(0, Math.min(w - 1, curs.c + DIRKEY[k][1]));
          drawCursor();
          return true;
        }
        if (!curs.on) return false;
        const i = curs.r * w + curs.c;
        const set = (v) => { if (!fixed(i) && st[i] !== v) { st[i] = v; ctx.sfx('tap'); refresh(); ctx.changed('cells'); } };
        if (k === 'Enter') { set(st[i] === 1 ? 0 : 1); return true; }
        if (k === ' ' || k === '.') { set(st[i] === 2 ? 0 : 2); return true; }
        if (k === 'Backspace' || k === 'Delete') { set(0); return true; }
        if (k === 'Escape') { curs.on = false; drawCursor(); }
        return false;
      },
      destroy() { timers.forEach(clearTimeout); svg.removeEventListener('pointerleave', onLeave); }
    };
  }

  const MOUNTS = { net: mountNet, magnets: mountMagnets, tracks: mountTracks, signpost: mountSignpost, range: mountRange };
  function mount(ctx, p) {
    const f = MOUNTS[p.data && p.data.kind];
    if (!f) throw new Error('unknown kind ' + (p.data && p.data.kind));
    return f(ctx, p);
  }

  /* ---------- family pictures ---------- */

  function thumb(p) {
    const d = p.data, w = d.w, h = d.h, kind = d.kind;
    const cs = Math.min(146 / w, 108 / h), gx = (160 - w * cs) / 2, gy = (120 - h * cs) / 2;
    const X = (c) => C.fmtNum(gx + c * cs), Y = (r) => C.fmtNum(gy + r * cs), f = C.fmtNum;
    let out = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet">';
    const frame = '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>';
    const gridLines = (stroke) => { let dd = ''; for (let c = 1; c < w; c++) dd += 'M' + X(c) + ' ' + Y(0) + 'V' + Y(h); for (let r = 1; r < h; r++) dd += 'M' + X(0) + ' ' + Y(r) + 'H' + X(w); return '<path d="' + dd + '" stroke="' + stroke + '" stroke-width=".6" fill="none"/>'; };
    const bg = (fill) => '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="' + fill + '"/>';
    if (kind === 'net') {
      const tiles = hexRows(d.tiles);
      out += bg('var(--board-2)') + gridLines('var(--grid-2)');
      let pipes = '';
      for (let i = 0; i < w * h; i++) {
        const c = i % w, r = Math.floor(i / w), mx = gx + (c + 0.5) * cs, my = gy + (r + 0.5) * cs;
        for (let dd = 0; dd < 4; dd++) if (tiles[i] >> dd & 1) pipes += 'M' + f(mx) + ' ' + f(my) + 'l' + f([0, 0.5, 0, -0.5][dd] * cs) + ' ' + f([-0.5, 0, 0.5, 0][dd] * cs);
      }
      out += '<path d="' + pipes + '" stroke="#8b93a8" stroke-width="' + f(cs * 0.2) + '" stroke-linecap="round" fill="none"/>';
      const sc = d.src % w, sr = Math.floor(d.src / w);
      out += '<rect x="' + f(gx + (sc + 0.25) * cs) + '" y="' + f(gy + (sr + 0.25) * cs) + '" width="' + f(cs * 0.5) + '" height="' + f(cs * 0.5) + '" rx="' + f(cs * 0.1) + '" fill="#f2b441"/>';
      return out + frame.replace('stroke-width="1.6"', 'stroke-width="1.6"' + (d.wrap ? ' stroke-dasharray="4 3"' : '')) + '</svg>';
    }
    if (kind === 'magnets') {
      out += bg('var(--cell)');
      const P = LG().magPrep(w, h, d.dom, { rp: d.rp, rm: d.rm, cp: d.cp, cm: d.cm });
      P.doms.forEach(([a, b]) => {
        const c = Math.min(a % w, b % w), r = Math.min(Math.floor(a / w), Math.floor(b / w)), horiz = b === a + 1;
        out += '<rect x="' + f(gx + c * cs + 1.2) + '" y="' + f(gy + r * cs + 1.2) + '" width="' + f((horiz ? 2 : 1) * cs - 2.4) + '" height="' + f((horiz ? 1 : 2) * cs - 2.4) + '" rx="' + f(cs * 0.22) + '" fill="var(--board-2)" stroke="var(--ink-2)" stroke-width=".8"/>';
      });
      return out + '<circle cx="' + f(gx + cs * 0.5) + '" cy="' + f(gy + cs * 0.5) + '" r="' + f(cs * 0.28) + '" fill="#e0524f"/>' + '<circle cx="' + f(gx + cs * 1.5) + '" cy="' + f(gy + cs * 0.5) + '" r="' + f(cs * 0.28) + '" fill="#3a74c9"/>' + frame + '</svg>';
    }
    if (kind === 'tracks') {
      out += bg('var(--cell)') + gridLines('var(--grid-2)');
      let rails = '';
      const piece = (i, m) => {
        const c = i % w, r = Math.floor(i / w), mx = gx + (c + 0.5) * cs, my = gy + (r + 0.5) * cs;
        for (let dd = 0; dd < 4; dd++) if (m >> dd & 1) rails += 'M' + f(mx) + ' ' + f(my) + 'l' + f([0, 0.5, 0, -0.5][dd] * cs) + ' ' + f([-0.5, 0, 0.5, 0][dd] * cs);
      };
      (d.given || []).forEach(([i, m]) => piece(i, m));
      rails += 'M' + f(gx - cs * 0.6) + ' ' + f(gy + (d.a + 0.5) * cs) + 'h' + f(cs * 0.6) + 'M' + f(gx + (d.b + 0.5) * cs) + ' ' + f(gy + h * cs) + 'v' + f(cs * 0.6);
      out += '<path d="' + rails + '" stroke="#7a5230" stroke-width="' + f(cs * 0.34) + '" stroke-linecap="butt" fill="none"/>';
      out += '<path d="' + rails + '" stroke="#b9c0cf" stroke-width="' + f(cs * 0.12) + '" fill="none"/>';
      return out + frame + '</svg>';
    }
    if (kind === 'signpost') {
      out += bg('var(--cell)') + gridLines('var(--grid-2)');
      const dirs = [];
      d.dirs.forEach((r) => { for (const ch of r) dirs.push(ch === '*' ? -1 : +ch); });
      let ar = '';
      dirs.forEach((dd, i) => {
        if (dd < 0) return;
        const c = i % w, r = Math.floor(i / w), mx = gx + (c + 0.5) * cs, my = gy + (r + 0.5) * cs, a = dd * Math.PI / 4, L = cs * 0.3;
        const ux = Math.sin(a), uy = -Math.cos(a);
        ar += 'M' + f(mx - ux * L) + ' ' + f(my - uy * L) + 'L' + f(mx + ux * L) + ' ' + f(my + uy * L);
        ar += 'M' + f(mx + ux * L - (ux * 0.5 + uy * 0.45) * L) + ' ' + f(my + uy * L - (uy * 0.5 - ux * 0.45) * L) + 'L' + f(mx + ux * L) + ' ' + f(my + uy * L) + 'L' + f(mx + ux * L - (ux * 0.5 - uy * 0.45) * L) + ' ' + f(my + uy * L - (uy * 0.5 + ux * 0.45) * L);
      });
      return out + '<path d="' + ar + '" stroke="var(--ink-2)" stroke-width="' + f(Math.max(1, cs * 0.07)) + '" stroke-linecap="round" fill="none"/>' + frame + '</svg>';
    }
    // range
    out += bg('var(--cell)') + gridLines('var(--grid-2)');
    d.grid.forEach((row, r) => { for (let c = 0; c < w; c++) { const ch = row[c]; if (ch === '.') continue; out += '<text x="' + f(gx + (c + 0.5) * cs) + '" y="' + f(gy + (r + 0.5) * cs) + '" text-anchor="middle" dominant-baseline="central" font-size="' + f(cs * 0.62) + '" font-weight="700" fill="var(--text)">' + parseInt(ch, 36) + '</text>'; } });
    return out + frame + '</svg>';
  }

  /* ---------- Endless drawers ---------- */

  const hex = (arr, w) => LG().toRows(arr, w, (x) => x.toString(16));
  const b36 = (n) => n.toString(36);
  // the puzzle data from what the makers return (shared with tools/gen/tatham2.js)
  const pack = {
    net: (r) => ({ kind: 'net', w: r.w, h: r.h, wrap: r.wrap, src: r.src, tiles: hex(r.tiles, r.w), sol: hex(r.sol, r.w) }),
    magnets: (r) => ({ kind: 'magnets', w: r.w, h: r.h, dom: r.dom, rp: r.clues.rp, rm: r.clues.rm, cp: r.clues.cp, cm: r.clues.cm, sol: r.sol }),
    tracks: (r) => ({ kind: 'tracks', w: r.w, h: r.h, a: r.ra, b: r.cb, rows: r.rows, cols: r.cols, given: r.givens, sol: hex(r.sol, r.w) }),
    signpost: (r) => ({ kind: 'signpost', w: r.w, h: r.h, dirs: LG().toRows(r.dirs, r.w, (x) => (x < 0 ? '*' : String(x))), nums: r.nums.map((n, i) => [i, n]).filter((x) => x[1]), sol: r.sol }),
    range: (r) => ({ kind: 'range', w: r.w, h: r.h, grid: LG().toRows(r.num, r.w, (x) => (x > 0 ? b36(x) : '.')), sol: LG().toRows(r.sol, r.w, (x) => (x ? '#' : '.')) })
  };
  const hiddenOf = (r) => ['rp', 'rm', 'cp', 'cm'].reduce((s2, k) => s2 + r.clues[k].filter((x) => x < 0).length, 0);
  // the level a made puzzle deserves
  const grade = {
    net: (r) => LG().netDiff(r.w, r.h, r.wrap, r.grade),
    magnets: (r) => LG().magDiff(r.w, r.h, r.grade, hiddenOf(r)),
    tracks: (r) => LG().trkDiff(r.w, r.h, r.grade, r.givens.length),
    signpost: (r) => LG().spDiff(r.w, r.h, r.grade, r.givens),
    range: (r) => LG().rgDiff(r.w, r.h, r.grade, r.clues)
  };
  // what to try for each level: [maker arguments…]
  const PLAN = {
    net: [null, [[5, 5, false, 3]], [[7, 7, false, 3], [5, 5, true, 3]], [[9, 9, false, 3], [7, 7, true, 3]], [[11, 11, false, 3], [9, 9, true, 3]], [[13, 11, false, 4], [11, 11, true, 4], [9, 9, true, 4]]],
    magnets: [null, [[6, 5, 1, 0]], [[6, 5, 2, 0], [8, 7, 1, 0]], [[8, 7, 2, 0]], [[8, 7, 3, 4], [10, 9, 2, 0]], [[10, 9, 3, 8]]],
    tracks: [null, [[6, 6, 1], [6, 6, 2]], [[8, 8, 2]], [[8, 8, 3], [10, 8, 3], [10, 10, 3]], [[8, 8, 4], [10, 10, 4]], [[10, 10, 4], [12, 10, 4]]],
    signpost: [null, [[4, 4, 2]], [[5, 5, 2]], [[6, 6, 2], [5, 5, 3]], [[6, 6, 3]], [[7, 7, 3]]],
    range: [null, [[7, 7, 1, 0]], [[7, 7, 2, 0], [9, 6, 2, 0]], [[9, 9, 2, 0], [12, 8, 2, 0]], [[9, 9, 3, 8], [12, 8, 3, 8]], [[13, 9, 3, 10], [12, 10, 3, 10]]]
  };
  function makeOne(kind, args, rng, budget) {
    const L = LG();
    if (kind === 'net') { const [w, h, wrap, lv] = args; return L.netMake(w, h, wrap, rng, lv, { budget }); }
    if (kind === 'magnets') { const [w, h, lv, hide] = args; return L.magMake(w, h, rng, lv, { hide, budget }); }
    if (kind === 'tracks') { const [w, h, lv] = args; return L.trkMake(w, h, rng, lv, { budget, fill: 0.45 + rng() * 0.15 }); }
    if (kind === 'signpost') { const [w, h, lv] = args; return L.spMake(w, h, rng, lv, { budget }); }
    const [w, h, lv, extra] = args;
    return L.rgMake(w, h, rng, lv, { extra, budget });
  }
  const NAMES = { net: 'Net', magnets: 'Magnets', tracks: 'Tracks', signpost: 'Signpost', range: 'Range' };
  function generate(rng, level, fam) {
    const kind = FAMILY_KIND[fam && fam.id];
    if (!kind) return null;
    const t0 = LG().now(), plan = PLAN[kind][level];
    while (LG().now() - t0 < 900) {
      const args = plan[rng.int(plan.length)];
      const r = makeOne(kind, args, rng, 500);
      if (!r || grade[kind](r) !== level) continue;
      const data = pack[kind](r);
      const title = (kind === 'net' && r.wrap ? 'Wrapping Net ' : NAMES[kind] + ' ') + r.w + '×' + r.h;
      return { title, text: textFor(data), diff: level, data };
    }
    return null;
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'tatham2',
    get name() { return KIND_NAMES[currentKind()] || 'Tatham favourites'; },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/tatham2-logic.js'],
    noMoves: true,
    about(p, meta) { return ABOUT[(p && p.data && p.data.kind) || FAMILY_KIND[meta && meta.id]] || ABOUT_ALL; },
    verify,
    generate,
    generates: ['net', 'magnets', 'tracks', 'signpost', 'range'],
    mount,
    thumb,
    textFor,
    pack,
    grade,
    kinds: ABOUT
  });

  C.css('tatham2', `
    .nt-top, .mg-top, .tk-top, .sp-top, .rg-top, .mg-texts, .tk-texts, .rg-texts, .sp-glyphs, .sp-links, .rg-view, .nt-ghosts { pointer-events: none; }
    /* shared panel */
    .t2-panel { display: grid; gap: 8px; margin: 10px 0; }
    .t2-seg { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .t2-segl { color: var(--muted); font-size: 13px; margin-right: 2px; }
    .t2-segb { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 8px; padding: 5px 11px; font: 600 13px "Segoe UI", system-ui, sans-serif; cursor: pointer; justify-self: start; }
    .t2-segb.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .t2-tip { color: var(--muted); font-size: 12.5px; }
    .t2-opt { color: var(--text); font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
    @keyframes t2pulse { 50% { opacity: .25; } }
    @keyframes t2flash { 15% { opacity: .45; } 100% { opacity: 0; } }

    /* net */
    .nt-boardbg { fill: var(--board); stroke: var(--line); }
    .nt-cell { fill: var(--board-2); stroke: var(--grid-2); stroke-width: 1; }
    .nt-cell.locked { fill: #3a3350; }
    [data-theme="light"] .nt-cell.locked { fill: #d9cfee; }
    .nt-frame { fill: none; stroke: var(--ink-2); stroke-width: 2.4; }
    .nt-frame.wrap { stroke-dasharray: 7 5; }
    .nt-ghosts { opacity: .38; }
    .nt-po { stroke: rgba(0,0,0,.55); stroke-width: 13; stroke-linecap: round; fill: none; }
    .nt-p { stroke: #8f97ab; stroke-width: 7.5; stroke-linecap: round; fill: none; transition: stroke .2s; }
    .nt-tile.lit .nt-p { stroke: #43d4f3; }
    [data-theme="light"] .nt-po { stroke: rgba(20,24,40,.55); }
    [data-theme="light"] .nt-tile.lit .nt-p { stroke: #19a9d3; }
    .nt-p.bad, .nt-tile.lit .nt-p.bad { stroke: var(--red); }
    .nt-hub { fill: #8f97ab; stroke: rgba(0,0,0,.55); stroke-width: 2.5; }
    .nt-tile.lit .nt-hub { fill: #43d4f3; }
    .nt-term { fill: #3a4262; stroke: rgba(0,0,0,.6); stroke-width: 2; }
    .nt-screen { fill: #59607a; transition: fill .2s; }
    .nt-tile.lit .nt-screen { fill: #9ff0ff; }
    .nt-src { fill: #f2b441; stroke: #7a5310; stroke-width: 2.4; }
    .nt-srcdot { fill: #fff6d6; }
    .nt-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .nt-hcell { fill: none; stroke: var(--gold); stroke-width: 3; }
    .nt-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .nt-ghost { opacity: .55; animation: t2pulse 1.3s ease-in-out infinite; }
    .nt-ghost .nt-p { stroke: var(--gold); }
    .nt-flash { fill: var(--gold); opacity: 0; animation: t2flash 1.3s ease-out; }
    .nt.won:not(.still) .nt-tile { animation: ntglow .9s ease-in-out both; }
    @keyframes ntglow { 45% { filter: brightness(1.9) drop-shadow(0 0 4px #7fe8ff); } }

    /* magnets */
    .mg-boardbg { fill: var(--board); stroke: var(--line); }
    .mg-cell { fill: var(--cell); }
    .mg-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; stroke-dasharray: 2 3; }
    .mg-dom { fill: var(--board-2); stroke: var(--ink-2); stroke-width: 1.6; }
    .mg-dom.blank { fill: var(--grid); stroke: var(--muted); }
    .mg-dom.any { stroke: var(--accent); stroke-dasharray: 5 3; }
    .mg-dom.mag { fill: none; stroke: none; }
    .mg-seam { stroke: var(--grid-2); stroke-width: 1.4; }
    .mg-half { stroke: rgba(0,0,0,.35); stroke-width: 1.4; }
    .mg-half.p { fill: #e0524f; }
    .mg-half.m { fill: #3a74c9; }
    .mg-half.err { stroke: var(--red); stroke-width: 4; }
    .mg-pole { font: 800 24px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
    .mg-x { stroke: var(--muted); stroke-width: 2.2; stroke-linecap: round; fill: none; }
    .mg-q { font: 700 19px "Segoe UI", system-ui, sans-serif; fill: var(--accent); text-anchor: middle; dominant-baseline: central; }
    .mg-clue { font: 700 18px "Segoe UI", system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; transition: opacity .2s, fill .2s; }
    .mg-clue.p { fill: #e0524f; }
    .mg-clue.m { fill: #4f8be0; }
    .mg-clue.done { opacity: .45; }
    .mg-clue.ticked { opacity: .25; text-decoration: line-through; }
    .mg-clue.bad { fill: var(--red); opacity: 1; font-weight: 900; }
    .mg-sign { font: 900 22px "Segoe UI", system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; }
    .mg-sign.p { fill: #e0524f; } .mg-sign.m { fill: #4f8be0; }
    .mg-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .mg-hcell { fill: var(--gold); fill-opacity: .15; stroke: var(--gold); stroke-width: 3; animation: t2pulse 1.3s ease-in-out infinite; }
    .mg-hwrong { fill: none; stroke: var(--red); stroke-width: 3.5; }
    .mg-flash { fill: var(--gold); opacity: 0; animation: t2flash 1.3s ease-out; }
    .mg.won:not(.still) .mg-domg { animation: mgsnap .6s ease-out both; transform-box: fill-box; transform-origin: center; }
    @keyframes mgsnap { 40% { transform: scale(1.07); filter: brightness(1.25); } }

    /* tracks */
    .tk-boardbg { fill: var(--board); stroke: var(--line); }
    .tk-cell { fill: var(--cell); }
    .tk-cell.given { fill: var(--board-2); }
    .tk-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .tk-frame { fill: none; stroke: var(--ink-2); stroke-width: 2.4; }
    .tk-sl { stroke: #8a5a36; stroke-width: 4.2; stroke-linecap: round; fill: none; }
    .tk-rl { stroke: #aeb6c7; stroke-width: 2.6; fill: none; stroke-linecap: round; }
    [data-theme="light"] .tk-rl { stroke: #5c6478; }
    .tk-piece.fixed .tk-sl { stroke: #5a3a22; }
    .tk-piece.fixed .tk-rl { stroke: var(--ink); }
    .tk-piece.bad .tk-rl, .tk-piece.loop .tk-rl { stroke: var(--red); }
    .tk-piece.bad .tk-sl, .tk-piece.loop .tk-sl { stroke: #a33; }
    .tk-mark { fill: var(--accent); opacity: .35; }
    .tk-x { stroke: var(--muted); stroke-width: 2.2; stroke-linecap: round; fill: none; }
    .tk-ex { stroke: var(--red); stroke-opacity: .7; stroke-width: 2; stroke-linecap: round; fill: none; }
    .tk-clue { font: 700 18px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; dominant-baseline: central; transition: opacity .2s, fill .2s; }
    .tk-clue.done { opacity: .4; }
    .tk-clue.bad { fill: var(--red); opacity: 1; }
    .tk-ab { font: 800 19px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; dominant-baseline: central; }
    .tk-hov { stroke: var(--accent); stroke-width: 5; stroke-linecap: round; opacity: .45; }
    .tk-hovsq { fill: var(--accent); opacity: .12; }
    .tk-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .tk-hzone { fill: var(--gold); opacity: .14; }
    .tk-hcell { fill: var(--gold); fill-opacity: .3; stroke: var(--gold); stroke-width: 2.5; animation: t2pulse 1.3s ease-in-out infinite; }
    .tk-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .tk-flash { fill: var(--gold); opacity: 0; animation: t2flash 1.3s ease-out; }
    .tk-body { stroke: rgba(0,0,0,.5); stroke-width: 1.5; }
    .tk-car.engine .tk-body { fill: #c8413b; }
    .tk-car.c1 .tk-body { fill: #2f8f5b; }
    .tk-car.c2 .tk-body { fill: #3a74c9; }
    .tk-cab { fill: #2b2d42; }
    .tk-stack { fill: #2b2d42; }
    .tk-lamp { fill: #ffe27a; }
    .tk-roof { fill: rgba(255,255,255,.35); }

    /* signpost */
    .sp-boardbg { fill: var(--board); stroke: var(--line); }
    .sp-cell { fill: var(--cell); stroke: var(--grid-2); stroke-width: 1; transition: fill .2s; }
    .sp-cell.num { fill: var(--board-2); }
    .sp-cell.bad { stroke: var(--red); stroke-width: 2.5; }
    .sp-arrow { fill: none; stroke: var(--ink-2); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; }
    .sp-star { font: 22px "Segoe UI Symbol", "Segoe UI", sans-serif; fill: var(--gold); text-anchor: middle; dominant-baseline: central; }
    .sp-lab { font: 600 13.5px "Segoe UI", system-ui, sans-serif; fill: var(--text); dominant-baseline: central; }
    .sp-lab.given { font-weight: 900; font-size: 15px; }
    .sp-lab.derived { fill: var(--accent); }
    .sp-lab.bad { fill: var(--red); }
    .sp-link { stroke: var(--muted); stroke-width: 2.2; fill: none; stroke-linecap: round; stroke-linejoin: round; opacity: .8; }
    .sp-link.head { stroke-width: 2.4; }
    .sp-rubber { stroke: var(--accent); stroke-width: 3; stroke-dasharray: 6 4; fill: none; }
    .sp-target { fill: var(--accent); opacity: .12; }
    .sp-target.back { fill: var(--teal); opacity: .08; }
    .sp-pick { fill: none; stroke: var(--gold); stroke-width: 3.2; }
    .sp-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .sp-hcell { fill: var(--gold); fill-opacity: .16; stroke: var(--gold); stroke-width: 2.8; animation: t2pulse 1.3s ease-in-out infinite; }
    .sp-hcell.ln { fill: none; stroke-dasharray: 6 4; }
    .sp-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .sp-flash { fill: var(--gold); opacity: 0; animation: t2flash 1.3s ease-out; }
    .sp-flash.ln { fill: none; stroke: var(--gold); }
    .sp.won:not(.still) .sp-lab { animation: sppop .5s ease-out both; }
    @keyframes sppop { 50% { fill: var(--gold); font-size: 17px; } }

    /* range */
    .rg-boardbg { fill: var(--board); stroke: var(--line); }
    .rg-cell { fill: var(--cell); transition: fill .15s; }
    .rg-cell.black { fill: #151827; }
    [data-theme="light"] .rg-cell.black { fill: #2a2e44; }
    .rg-cell.err { fill: #7a1f24; }
    .rg-cell.cut { fill: var(--red); fill-opacity: .22; }
    .rg-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .rg-frame { fill: none; stroke: var(--ink-2); stroke-width: 2.4; }
    .rg-dot { fill: var(--muted); }
    .rg-num { font: 700 19px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; dominant-baseline: central; transition: opacity .2s, fill .2s; }
    .rg-num.ok { opacity: .45; }
    .rg-num.bad { fill: var(--red); opacity: 1; }
    .rg-num.onblack { fill: #fff; }
    .rg-seen { fill: var(--accent); opacity: .13; }
    .rg-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .rg-hzone { fill: var(--gold); opacity: .17; }
    .rg-hcell { fill: none; stroke: var(--gold); stroke-width: 2.5; }
    .rg-hblack { fill: var(--ink); opacity: .7; }
    .rg-ghost { opacity: .6; animation: t2pulse 1.3s ease-in-out infinite; }
    .rg-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .rg-flash { fill: var(--gold); opacity: 0; animation: t2flash 1.3s ease-out; }
    .rg.won:not(.still) .rg-num { animation: rgpop .6s ease-out both; }
    @keyframes rgpop { 50% { fill: var(--gold); } }
    @media (prefers-reduced-motion: reduce) { .nt-ghost, .mg-hcell, .tk-hcell, .sp-hcell, .rg-ghost { animation: none !important; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
